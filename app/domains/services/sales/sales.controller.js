const Service = require('../services.model').Service;

const getDate = (d) => {
    if (!d) {
        d = new Date();
    }
    return `${d.getFullYear()}-${("0" + (d.getMonth()+1).toString()).slice(-2)}-${("0" + d.getDate().toString()).slice(-2)}`;
}

const daily = async (req, res) => {
    try {
        let date = req.params.date;
        if (!date) {
            const d = new Date();
            date = getDate();
        }

        const getService = await Service.findOne({ email: req.user.email });
        if (!getService) {
            return res.status(400).json({
                status: 'error',
                message: "User not found or not registered yet",
                data: {}
            });
        }

        let datedsalesdata = getService.dailysales.find(ds => ds.date === date);

        if (!datedsalesdata) {
            const salesplaceholder = {
                sales: 0,
                date: date
            }
            return res.status(200).json({
                status: 'success',
                message: 'Successfully read daily sales data for ' + date,
                data: salesplaceholder
            });
        } else {
            datedsalesdata = datedsalesdata.toObject();
            delete datedsalesdata._id;
            return res.status(200).json({
                status: 'success',
                message: 'Successfully read daily sales data for ' + date,
                data: datedsalesdata
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            status: 'error',
            message: process.env.DEBUG ? err.message : "Bad Request",
            data: {}
        });
    }
}

const weekly = async (req, res) => {
    try {
        const date = getDate();
        const getService = await Service.findOne({ email: req.user.email });
        if (!getService) {
            return res.status(400).json({
                status: 'error',
                message: "User not found or not registered yet",
                data: {}
            });
        }

        let response = [];

        for (let i = 0; i < 7; i++) {
            let selecteddate = getDate(new Date(new Date(date) - (i * 24 * 60 * 60 * 1000)));
            let datedsalesdata = getService.dailysales.find(ds => ds.date === selecteddate);
            if (!datedsalesdata) {
                const salesplaceholder = {
                    sales: 0,
                    date: selecteddate
                }
                response.push(salesplaceholder);
            } else {
                datedsalesdata = datedsalesdata.toObject();
                delete datedsalesdata._id;
                response.push(datedsalesdata);
            }
        }

        return res.status(200).json({
            status: 'success',
            message: 'Successfully read weekly sales data for ' + date,
            data: {
                weeklySales: response
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            status: 'error',
            message: process.env.DEBUG ? err.message : "Bad Request",
            data: {}
        });
    }
}

const monthly = async (req, res) => {
    try {
        const date = getDate();
        const getService = await Service.findOne({ email: req.user.email });
        if (!getService) {
            return res.status(400).json({
                status: 'error',
                message: "User not found or not registered yet",
                data: {}
            });
        }

        let response = [];

        for (let i = 0; i < 30; i++) {
            let selecteddate = getDate(new Date(new Date(date) - (i * 24 * 60 * 60 * 1000)));
            let datedsalesdata = getService.dailysales.find(ds => ds.date === selecteddate);
            if (!datedsalesdata) {
                const salesplaceholder = {
                    sales: 0,
                    date: selecteddate
                }
                response.push(salesplaceholder);
            } else {
                datedsalesdata = datedsalesdata.toObject();
                delete datedsalesdata._id;
                response.push(datedsalesdata);
            }
        }

        return res.status(200).json({
            status: 'success',
            message: 'Successfully read monthly sales data for ' + date,
            data: {
                monthlySales: response
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            status: 'error',
            message: process.env.DEBUG ? err.message : "Bad Request",
            data: {}
        });
    }
}

const add = async (req, res) => {
    try {
        const sales = req.body || [];

        if (sales.length > 0) {
            const d = new Date();
            const date = getDate();

            const getService = await Service.findOne({ email: req.user.email });
            if (!getService) {
                return res.status(400).json({
                    status: 'error',
                    message: "User not found or not registered yet",
                    data: {}
                });
            }

            const datedstockdata = getService.dailystock.find(ds => ds.date === date);

            if (!datedstockdata) {
                return res.status(400).json({
                    status: 'error',
                    message: "Item stock is empty",
                    data: {}
                });
            }

            let dailysalesdata = getService.dailysales.find(ds => ds.date === date);

            for (const s of sales) {
                let item = datedstockdata.items.find(i => i.name === s.name);
            
                if (item) {
                    if (item.counts >= s.counts) {
                        if (!dailysalesdata) {
                            const salesplaceholder = {
                                sales: 0,
                                date: date
                            }
                            getService.dailysales.push(salesplaceholder);
                            dailysalesdata = getService.dailysales.find(ds => ds.date === date);
                        }
                        item.counts -= s.counts;
                        dailysalesdata.sales += item.price * s.counts;
                    } else {
                        return res.status(400).json({
                            status: 'error',
                            message: "Insufficient item to sell",
                            data: {}
                        });
                    }
                } else {
                    return res.status(400).json({
                        status: 'error',
                        message: `Item "${s.name}" not found`,
                        data: {}
                    });
                }
            
                getService.sales.push({
                    name: s.name,
                    counts: s.counts,
                    time: new Date()
                });
            }
            
            await getService.save();

            return res.status(200).json({
                status: 'success',
                message: 'Successfully add sales data for ' + date,
                data: {
                    sales: sales
                }
            });
        } else {
            return res.status(200).json({
                status: 'success',
                message: 'No changes were made',
                data: {}
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            status: 'error',
            message: process.env.DEBUG ? err.message : "Bad Request",
            data: {}
        });
    }
}

module.exports = {
    daily,
    weekly,
    monthly,
    add
};