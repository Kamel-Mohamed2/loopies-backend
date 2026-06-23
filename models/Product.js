import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    images: {
        type: [String],
        required: [true, 'A product must have at least one image']
    },
    duration: {
        type: String,
        required: [true, 'Duration is Required'],
    },
    price: {
        type: Number,
    },
    description: {
        type: String,
    },
    options: [{
        type: String,
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'A product must belong to a category']
    }
}, { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;