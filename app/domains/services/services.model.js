const mongoose = require('mongoose');

const getDate = () => {
    const d = new Date();
    return `${d.getFullYear()}-${("0" + (d.getMonth()+1).toString()).slice(-2)}-${("0" + d.getDate().toString()).slice(-2)}`;
};

const serviceSchema = new mongoose.Schema({
    email: { type: String, required: true },
    menu: [{
        name: { type: String, unique: true, required: true },
        icon: { type: String, required: true },
        capital: { type: Number, required: true },
        price: { type: Number, required: true },
    }],
    newstock: [{
        name: { type: String, required: true },
        counts: { type: Number, required: true },
        time: { type: Date, required: true, default: new Date() }
    }],
    dailystock: [{
        items: [{
            name: { type: String, required: true },
            counts: { type: Number, required: true }
        }],
        date: {
            type: String,
            required: true,
            default: getDate
        }
    }],
    sales: [{
        name: { type: String, required: true },
        counts: { type: Number, required: true },
        time: { type: Date, required: true, default: new Date() }
    }],
    dailysales: [{
        sales: { type: Number, required: true },
        items: [{
            name: { type: String, required: true },
            counts: { type: Number, required: true }
        }],
        date: {
            type: String,
            required: true,
            default: getDate
        }
    }]
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = {
    Service
};