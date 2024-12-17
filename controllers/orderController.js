const orderModel = require('../models/orderModel');

exports.createOrder = (req, res) => {
    const { requesterName, requesterEmail, additionalNotes, selectedItems } = req.body;

    if (!requesterName || !requesterEmail) {
        return res.status(400).send('Requester name and email are required.');
    }

    const orderData = {
        id_user: req.session.user.id_user,
        o_name: requesterName,
        o_email: requesterEmail,
        approve_status: null, // Set approve_status to null
        reason: additionalNotes
    };

    orderModel.insertOrder(orderData, (err, result) => {
        if (err) {
            return res.status(500).send('Error inserting order.');
        }
        res.send('Order created successfully.');
    });
};