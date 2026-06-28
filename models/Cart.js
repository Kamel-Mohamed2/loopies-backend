import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    guestId: { type: String, default: null },
    userId: { type: String, default: null },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 },
            orderPrice: { type: Number, required: true }
        }
    ]
}, { timestamps: true });

// deletes after 30 days if the cart is a guest cart (no userId)

cartSchema.index(
    { updatedAt: 1 },
    {
        expireAfterSeconds: 2592000,
        partialFilterExpression: { guestId: { $type: "string" } }
    }
);

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;