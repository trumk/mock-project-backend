import Category from '../models/Category.model.js'
import Book from '../models/Book.model.js'
import mongoose from "mongoose"

const updateChildLayers = async (parentId, parentLayer) => {
    const children = await Category.find({ parent: parentId });
    
    if (!children || children.length === 0) {
        return;
    }
    for (const child of children) {
        const newLayer = parentLayer + 1;
        await Category.findByIdAndUpdate(
            child._id,
            { layer: newLayer },
            { new: true }
        );
        await updateChildLayers(child._id, newLayer);
    }
};

const categoryController = {
    createCategory: async (req, res) => {
        try {
            const { name, image, parent } = req.body;
            if (!name || !image) {
                return res.status(400).json({
                    success: false,
                    message: 'Name and image are required fields.'
                });
            }

            let layer = 0;

            if (parent) {
                const parentLayer = await Category.findById(parent);


                if (!parentLayer) {
                    return res.status(404).json({
                        success: false,
                        message: 'Parent category not found.'
                    });
                }
                layer = parentLayer.layer + 1;
            }

            const newCategory = await new Category({
                name,
                image,
                parent: parent || null,
                layer
            }).save()

            return res.status(201).json(newCategory);
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    editCategory: async (req, res) => {
        try {
            const { name, image, parent } = req.body;
            const id = req.params.id
            if (!name || !image) {
                return res.status(400).json({
                    success: false,
                    message: 'Name and image are required fields.'
                });
            }

            const category = await Category.findById(id)

            console.log(category);
            

            if (!category) {
                return res.status(4044).json({
                    success: false,
                    message: 'Category not found.'
                });
            }
            let layer = 0;

            if (parent) {
                const parentLayer = await Category.findById(parent);
                if (!parentLayer) {
                    return res.status(404).json({
                        success: false,
                        message: 'Parent category not found.'
                    });
                }
                layer = parentLayer.layer + 1;
            }
            const updatedCategory = await Category.findByIdAndUpdate(id, {
                name,
                image,
                parent: parent || null,
                layer
            },
                { new: true })

            if (category.layer !== layer) {
                await updateChildLayers(id, layer);
            }
            return res.status(200).json(updatedCategory);
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.find()
            if (categories.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Categories not found.'
                });
            }
            return res.status(200).json(categories);
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    getCategoriesByLayer: async (req, res) => {
        try {
            const layer = req.query.layer
            const categories = await Category.find({ layer })
            if (categories.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Categories not found.'
                });
            }
            return res.status(200).json(categories);
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    getCategories: async (req, res) => {
        try {
            const id = req.params.id;
            const result = await Category.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(id) } },
                {
                    $graphLookup: {
                        from: "categories",
                        startWith: "$parent",
                        connectFromField: "parent",
                        connectToField: "_id",
                        as: "ancestors"
                    }
                },
                {
                    $project: {
                        name: 1,
                        image: 1,
                        layer: 1,
                        parent: 1,
                        ancestors: {
                            $reverseArray: "$ancestors"
                        }
                    }
                }
            ]);

            if (!result || result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found.'
                });
            }
            const categoryChildren = await Category.find({ parent: id });

            const bookChildren = await Book.find({ category: id })

            return res.status(200).json({
                category: result[0],
                children: categoryChildren,
                bookChildren: bookChildren
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const id = req.params.id;
            const category = await Category.findById(id);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found.'
                });
            }
            const getAllChildren = async (parentId) => {
                const children = await Category.find({ parent: parentId });
                let allChildren = [...children];
                for (const child of children) {
                    const grandChildren = await getAllChildren(child._id);
                    allChildren = allChildren.concat(grandChildren);
                }
                return allChildren;
            };
            const allChildren = await getAllChildren(id);
            const allCategoryIds = [id, ...allChildren.map(child => child._id)];

            const deletedBooks = await Book.deleteMany({ category: { $in: allCategoryIds } });
            await Category.deleteMany({ _id: { $in: allCategoryIds } });

            return res.status(200).json({
                success: true,
                message: 'Category and its hierarchy deleted successfully.',
                categoryDeleted: category,
                deletedCategoriesCount: allCategoryIds.length,
                deletedBooksCount: deletedBooks.deletedCount
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

export default categoryController;