const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    email: { type: String, required: true },
    dailystock: [{
        items: [{
            name: { type: String, unique: true, required: true },
            price: { type: Number, required: true },
            counts: { type: Number, required: true }
        }],
        date: {
            type: String,
            required: true,
            default: function() {
                const d = new Date();
                return `${d.getFullYear()}-${("0" + (d.getMonth()+1).toString()).slice(-2)}-${("0" + d.getDate().toString()).slice(-2)}`;
            }
        }
    }],
    newstock: [{
        name: { type: String, required: true },
        counts: { type: Number, required: true },
        time: { type: Date, required: true, default: new Date() }
    }],
    sales: [{
        name: { type: String, required: true },
        counts: { type: Number, required: true },
        time: { type: Date, required: true, default: new Date() }
    }],
    dailysales: [{
        sales: { type: Number, required: true },
        date: {
            type: String,
            required: true,
            default: function() {
                const d = new Date();
                return `${d.getFullYear()}-${("0" + (d.getMonth()+1).toString()).slice(-2)}-${("0" + d.getDate().toString()).slice(-2)}`;
            }
        }
    }]
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = {
    Service
};