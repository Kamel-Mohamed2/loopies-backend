import express from 'express';

const cartSchema = new express.Schema({
    guestId: { type: String, default: null },
    userId: { type: String, default: null },
    items: [
        {
            productId: { type: express.Schema.Types.ObjectId, ref: 'Product', required: true },
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

const Cart = express.model('Cart', cartSchema);

export default Cart;