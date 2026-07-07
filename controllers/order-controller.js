import Order from '../models/Order.js';


export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({});
        return res.status(200).json({
            status: 200,
            message: orders.length ? 'Orders Found' : 'No orders found',
            orders,
            count: orders.length
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });
    }
}

export const getOrder = async (req, res) => {
    const orderId = req.params.orderId;
    try {
        const order = await Order.findOne({ _id: orderId })
        if (!order) {
            return res.status(404).json({
                status: 404,
                message: 'Order not found'
            })
        }
        else {
            return res.status(200).json({
                status: 200,
                message: 'Order found',
                order
            })
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });
    }
}

export const addOrder = async (req, res) => {
    const { orderDetails } = req.body;
    const { userId, customerName, customerEmail, customerWhatsappNumber, customerNumberTwo, customerAddress, products, paymentMethod, paymentProof } = orderDetails;
    let orderTotal = 0;
    products.forEach(product => {
        orderTotal += product.orderPrice * product.quantity
    })

    // Validation
    if (!customerName || !customerEmail || !customerWhatsappNumber || !customerAddress) {
        return res.status(400).json({
            status: 400,
            message: "Please provide valid order details"
        });
    }
    else if (!products || !products.length) {
        return res.status(400).json({
            status: 400,
            message: "Please provide products"
        })
    }
    else if (!paymentMethod) {
        return res.status(400).json({
            status: 400,
            message: "Please provide payment method"
        })
    }
    else if ((paymentMethod == "InstaPay" || paymentMethod == "E-Wallet") && !paymentProof) {
        return res.status(400).json({
            status: 400,
            message: "Please provide payment proof"
        })
    }
    // Validation

    try {
        const newOrder = new Order({
            userId,
            customerName,
            customerEmail,
            customerWhatsappNumber,
            customerNumberTwo,
            customerAddress,
            orderTotal,
            products,
            paymentMethod,
            paymentProof,
        })
        await newOrder.save();
        return res.status(201).json({
            status: 201,
            message: 'Order created successfully',
            order: newOrder
        })

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });

    }
}