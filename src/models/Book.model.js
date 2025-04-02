import mongoose from "mongoose"

const Schema = mongoose.Schema;
const bookSchema = new Schema({
    author: [{
        name: {
            type: String
        },
        slug: {
            type: String
        }
    }],
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: [{
        type: String,
        required: true,
    }],
    list_price: {
        type: Number,
        required: true,
    },
    original_price: {
        type: Number,
        required: true,
    },
    rating_average: {
        type: Number
    },
    short_description: {
        type: String,
        required: true,
    },
    quantity_sold: {
        type: Number
    },
    specifications: [{
        name: {
            type: String,
            default: "Thông tin chung"
        },
        attributes: [{
            name: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            }
        }]
    }]
})

const Book = mongoose.model("Product", bookSchema);

export default Book;
