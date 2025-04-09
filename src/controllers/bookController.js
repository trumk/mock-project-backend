import Book from '../models/Book.model.js'

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
                topDeal

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
                topDeal
            }, {
                new: true
            });
            return res.status(200).json(updatedBook)
        } catch (error) {
            return res.status(500).json(error)
        }
    },

    getBooks : async (req, res) =>{
        try {
            const books = await Book.find();
            return res.status(200).json(books)
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    
    deleteBook : async (req, res) =>{
        try {
            const id = req.params.id;
            const book = await Book.findByIdAndDelete(id);
            return res.status(200).json(book)
        } catch (error) {
            return res.status(500).json(error)
        }
    },


}

export default bookController;