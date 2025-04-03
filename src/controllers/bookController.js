import Book from '../models/Book.model.js'

const bookController = {
    createBook: async (req, res) => {
        try {
            const { author, category, name, description, image, list_price, original_price, short_description, specifications } = req.body;
            if (!category || !name || !description || !image || !list_price || !original_price || !short_description || !specifications) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields required.'
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
                specifications
            }).save();
            return res.status(201).json(newBook)
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    editBook: async (req, res) => {
        try {
            const id = req.params.id;
            const { author, category, name, description, image, list_price, original_price, short_description, specifications } = req.body;
            if (!category || !name || !description || !image || !list_price || !original_price || !short_description || !specifications) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields required.'
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
                specifications
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
    }
}

export default bookController;