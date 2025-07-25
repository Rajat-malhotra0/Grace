const Payment = require("../models/payment");

async function createPayment(data) {
    try {
        const payment = new Payment(data);
        await payment.save();
        return payment;
    } catch (error) {
        throw error;
    }
}

async function readPayments(filter = {}) {
    try {
        const payments = await Payment.find(filter);
        return payments;
    } catch (error) {
        throw error;
    }
}

async function updatePayment(filter = {}, data = {}) {
    try {
        const payment = await Payment.findOneAndUpdate(filter, data, {
            new: true,
        });
        return payment;
    } catch (error) {
        throw error;
    }
}

async function deletePayment(filter = {}) {
    try {
        await Payment.deleteOne(filter);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createPayment,
    readPayments,
    updatePayment,
    deletePayment,
};
