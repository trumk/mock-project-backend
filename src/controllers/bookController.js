import Book from '../models/Book.model.js'
import mongoose from 'mongoose';

const bookController = {
    createBook: async (req, res) => {
        try {
            const { author, category, name, description, image, list_price, original_price, short_description, specifications, freeShip, superFastShip, topDeal } = req.body;

            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: 'Category is required.'
                });
            }
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Name is required.'
                });
            }
            if (!description) {
                return res.status(400).json({
                    success: false,
                    message: 'Description is required.'
                });
            }
            if (!image) {
                return res.status(400).json({
                    success: false,
                    message: 'Image is required.'
                });
            }
            if (!list_price) {
                return res.status(400).json({
                    success: false,
                    message: 'List price is required.'
                });
            }
            if (!original_price) {
                return res.status(400).json({
                    success: false,
                    message: 'Original price is required.'
                });
            }
            if (!short_description) {
                return res.status(400).json({
                    success: false,
                    message: 'Short description is required.'
                });
            }
            if (!specifications) {
                return res.status(400).json({
                    success: false,
                    message: 'Specifications are required.'
                });
            }

            const numberRandom = (lastNumber, fix, step = 0) => {
                return (Math.random() * lastNumber + step).toFixed(fix);
            }

            const rating_average = numberRandom(4, 1, 1);
            const quantity_sold = numberRandom(1000, 0);

            const newBook = await new Book({
                author,
                category,
                name,
                description,
                image,
                list_price,
                original_price,
                rating_average,
                short_description,
                quantity_sold,
                specifications,
                freeShip,
                superFastShip,
                topDeal,
                createdAt: Date.now(),
                updatedAt: Date.now()

            }).save();
            return res.status(201).json(newBook)
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    editBook: async (req, res) => {
        try {
            const id = req.params.id;
            const { author, category, name, description, image, list_price, original_price, short_description, specifications, freeShip, superFastShip, topDeal } = req.body;

            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: 'Category is required.'
                });
            }
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Name is required.'
                });
            }
            if (!description) {
                return res.status(400).json({
                    success: false,
                    message: 'Description is required.'
                });
            }
            if (!image) {
                return res.status(400).json({
                    success: false,
                    message: 'Image is required.'
                });
            }
            if (!list_price) {
                return res.status(400).json({
                    success: false,
                    message: 'List price is required.'
                });
            }
            if (!original_price) {
                return res.status(400).json({
                    success: false,
                    message: 'Original price is required.'
                });
            }
            if (!short_description) {
                return res.status(400).json({
                    success: false,
                    message: 'Short description is required.'
                });
            }
            if (!specifications) {
                return res.status(400).json({
                    success: false,
                    message: 'Specifications are required.'
                });
            }

            const updatedBook = await Book.findByIdAndUpdate(id, {
                author,
                category,
                name,
                description,
                image,
                list_price,
                original_price,
                short_description,
                specifications,
                freeShip,
                superFastShip,
                topDeal,
                updatedAt: Date.now()
            }, {
                new: true
            });
            return res.status(200).json(updatedBook)
        } catch (error) {
            return res.status(500).json(error)
        }
    },

    getBooks: async (req, res) => {
        try {
            const books = await Book.find();
            return res.status(200).json(books)
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    getBookDetails: async (req, res) => {
        try {
            const id = req.params.id;
            const result = await Book.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                {
                    $unwind: {
                        path: '$category',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $graphLookup: {
                        from: 'categories',
                        startWith: '$category._id',
                        connectFromField: 'parent',
                        connectToField: '_id',
                        as: 'categoryHierarchy'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        author: 1,
                        name: 1,
                        description: 1,
                        image: 1,
                        list_price: 1,
                        original_price: 1,
                        rating_average: 1,
                        short_description: 1,
                        quantity_sold: 1,
                        specifications: 1,
                        freeShip: 1,
                        superFastShip: 1,
                        topDeal: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        category: {
                            _id: '$category._id',
                            name: '$category.name',
                            image: '$category.image',
                            layer: '$category.layer'
                        },
                        categoryHierarchy: {
                            $map: {
                                input: '$categoryHierarchy',
                                as: 'cat',
                                in: {
                                    _id: '$$cat._id',
                                    name: '$$cat.name',
                                    image: '$$cat.image',
                                    layer: '$$cat.layer',
                                    depth: '$$cat.depth'
                                }
                            }
                        }
                    }
                }
            ]);

            if (!result || result.length === 0) {
                return res.status(404).json({ message: 'Book not found' });
            }
            return res.status(200).json(result[0]);
        } catch (error) {
            console.log(error)
            return res.status(500).json(error);
        }
    },

    getSimilarBooks: async (req, res) => {
        try {
            const { id } = req.params;
    
            
            const currentBook = await Book.findById(id);
            if (!currentBook) {
                return res.status(404).json({ message: 'Book not found' });
            }
    
            const books = await Book.find({
                category: currentBook.category,
                _id: { $ne: id } 
            });
    
            return res.status(200).json(books);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },

    deleteBook: async (req, res) => {
        try {
            const id = req.params.id;
            const book = await Book.findByIdAndDelete(id);
            return res.status(200).json(book)
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    searchBook: async (req, res) => {
        try {
            const { searchTerm } = req.query;
            const books = await Book.find({ name: new RegExp(searchTerm, "i") });
            return res.status(200).json(books)
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    filterBook: async (req, res) => {
        try {
            const {
                freeShip,
                superFastShip,
                topDeal,
                sortBy,
                star
            } = req.query;

            const filter = {};

            if (freeShip === "true") filter.freeShip = true;
            if (superFastShip === "true") filter.superFastShip = true;
            if (topDeal === "true") filter.topDeal = true;
            if (star == "true") {
                filter.rating_average = { $gte: 4 };
            }

            let sort = {};
            switch (sortBy) {
                case "price_high_to_low":
                    sort = { list_price: -1 };
                    break;
                case "price_low_to_high":
                    sort = { list_price: 1 };
                    break;
                case "newest":
                    sort = { createdAt: -1 };
                    break;
                default:
                    sort = {};
            }

            const books = await Book.find(filter).sort(sort);
            res.status(200).json(books);
        } catch (error) {
            res.status(500).json(error)
        }
    }

}

export default bookController;