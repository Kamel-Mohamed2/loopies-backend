import Cart from '../models/Cart.js';

export const getCartByIdentity = async (req, res) => {
    const { userId, guestId } = req.query;

    if (!userId && !guestId) {
        return res.status(400).json({
            status: 400,
            message: 'Either userId or guestId must be provided'
        });
    }
    try {
        const filter = userId ? { userId } : { guestId };

        let cart = await Cart.findOne(filter).populate('items.productId');


        if (!cart) {
            return res.status(200).json({
                status: 200,
                message: 'No active cart found; returning empty initialization.',
                cart: { items: [] }
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Cart retrieved successfully',
            cart
        });

    } catch (err) {
        console.error('Error fetching cart by identity:', err.message);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

export const updateCart = async (req, res) => {
    const { userId, guestId, items } = req.body;

    if (!userId && !guestId) {
        return res.status(400).json({
            status: 400,
            message: 'Either userId or guestId must be provided to update the cart'
        });
    }

    if (!Array.isArray(items)) {
        return res.status(400).json({
            status: 400,
            message: 'Items must be an array'
        });
    }

    try {
        const filter = userId ? { userId } : { guestId };

        const updatedCart = await Cart.findOneAndUpdate(
            filter,
            {
                $set: {
                    items,
                    userId: userId || null,
                    guestId: guestId || null
                }
            },
            { new: true, upsert: true }
        ).populate('items.productId');

        return res.status(200).json({
            status: 200,
            message: 'Cart updated successfully',
            cart: updatedCart
        });

    } catch (err) {
        console.error('Error updating cart:', err.message);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error: Unable to update cart'
        });
    }
};

export const clearCart = async (req, res) => {
    const { userId, guestId } = req.body;

    if (!userId && !guestId) {
        return res.status(400).json({
            status: 400,
            message: 'Identity (userId or guestId) is required to clear the cart'
        });
    }

    try {
        const filter = userId ? { userId } : { guestId };

        const clearedCart = await Cart.findOneAndUpdate(
            filter,
            { $set: { items: [] } },
            { new: true }
        );

        return res.status(200).json({
            status: 200,
            message: 'Cart cleared successfully',
            cart: clearedCart || { items: [] }
        });
    } catch (err) {
        console.error('Error clearing cart:', err.message);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

export const mergeCarts = async (req, res) => {
    const { guestId, userId } = req.body;

    if (!guestId || !userId) {
        return res.status(400).json({
            status: 400,
            message: 'Both guestId and userId are required to merge carts'
        });
    }

    try {
        const guestCart = await Cart.findOne({ guestId });

        if (!guestCart) {
            return res.status(200).json({
                status: 200,
                message: 'No guest cart found; nothing to merge.'
            });
        }

        const userCart = await Cart.findOne({ userId });

        if (!userCart) {
            guestCart.userId = userId;
            guestCart.guestId = null;
            await guestCart.save();

            return res.status(200).json({
                status: 200,
                message: 'Guest cart successfully transferred to user account.',
                cart: guestCart
            });
        }

        guestCart.items.forEach(guestItem => {
            const existingItem = userCart.items.find(userItem =>
                userItem.productId.equals(guestItem.productId)
            );

            if (existingItem) {
                existingItem.quantity += guestItem.quantity;
            } else {
                userCart.items.push(guestItem);
            }
        });

        await userCart.save();
        await guestCart.deleteOne();

        return res.status(200).json({
            status: 200,
            message: 'Guest cart successfully merged with existing user cart.',
            cart: userCart
        });

    } catch (err) {
        console.error('Cart merge system failure:', err.message);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error: Processing cart sync failed.'
        });
    }
};