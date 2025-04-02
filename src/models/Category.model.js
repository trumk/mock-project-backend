import mongoose from "mongoose"

const Schema = mongoose.Schema;
const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        default: null
    },
    layer: {
        type: Number,
        default: 0
    }
})

const Category = mongoose.model("Category", categorySchema);

export default Category;