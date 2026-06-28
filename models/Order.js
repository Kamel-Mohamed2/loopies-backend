import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderStatus: {
        type: String,
        required: true,
        enum: ['Pending Approval', 'in Progress', 'Waiting Shipment', 'Delivered', 'Cancelled'],
        default: 'Pending Approval',
    }
    ,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
    ,
    customerName: {
        type: String,
        required: true,
    },
    customerEmail: {
        type: String,
        required: true,
    }
    ,
    customerWhatsappNumber: {
        type: String,
        required: true,
    },
    customerNumberTwo: {
        type: String,
    }
    ,
    customerAddress: {
        type: String,
        required: true,
    }
    ,
    orderTotal: {
        type: Number,
        required: true,
    },
    products: {
        type: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 },
            orderPrice: { type: Number, required: true },
        }]
    },
    paymentMethod: {
        type: String,
        enum: ['Cash on Delivery', 'InstaPay', 'E-Wallet'],
        required: true,
    }
    ,
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Success', 'Failed'],
        default: 'Pending',
        required: true,
    }
    ,
    paymentProof: {
        type: String,
        required: true,
    }
})


const Order = mongoose.model('Order', orderSchema);

export default Order;