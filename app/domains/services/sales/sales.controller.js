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
                items: [],
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
            datedsalesdata.items = datedsalesdata.items.map(({_id, ...keys}) => keys);
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
                    items: [],
                    date: selecteddate
                }
                response.push(salesplaceholder);
            } else {
                datedsalesdata = datedsalesdata.toObject();
                delete datedsalesdata._id;
                datedsalesdata.items = datedsalesdata.items.map(({_id, ...keys}) => keys);
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
                    items: [],
                    date: selecteddate
                }
                response.push(salesplaceholder);
            } else {
                datedsalesdata = datedsalesdata.toObject();
                delete datedsalesdata._id;
                datedsalesdata.items = datedsalesdata.items.map(({_id, ...keys}) => keys);
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

            for (const s of sales) {
                let dailysalesdata = getService.dailysales.find(ds => ds.date === date);
                let item = datedstockdata.items.find(i => i.name === s.name);
                if (item) {
                    let price = getService.menu.find(menu => menu.name == s.name).price;
                    if (item.counts >= s.counts) {
                        if (!dailysalesdata) {
                            getService.dailysales.push({
                                sales: s.counts * price,
                                items: [{
                                    name: s.name,
                                    counts: s.counts
                                }],
                                date: date
                            });
                        } else {
                            item.counts -= s.counts;
                            dailysalesdata.sales += price * s.counts;
                            let inserted = false;
                            for (let dsitem of dailysalesdata.items) {
                                if (dsitem.name === s.name) {
                                    dsitem.counts += s.counts;
                                    inserted = true;
                                }
                            }
                            if (!inserted) {
                                dailysalesdata.items.push({
                                    name: s.name,
                                    counts: s.counts
                                })
                            }
                        }
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
                        message: `Item "${s.name}" not found in stock`,
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