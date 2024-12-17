const orderModel = require('../models/orderModel');

exports.createOrder = (req, res) => {
    const { requesterName, requesterEmail, additionalNotes, selectedItems } = req.body;
    const userId = req.session.user.id_user;

    const orderData = {
        id_user: userId,
        o_name: requesterName,
        o_email: requesterEmail,
        approve_status: null,
        reason: additionalNotes
    };

    const orderItems = selectedItems.map(item => ({
        i_brand_name: item.name,
        type: item.type,
        quantity: item.quantity
    }));

    orderModel.createOrderWithItems(orderData, orderItems, (err, result) => {
        if (err) {
            console.error('Error creating order:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ message: 'Order created successfully', orderId: result.orderId });
    });
};