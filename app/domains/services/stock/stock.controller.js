const Service = require('../services.model').Service;

const getDate = (d) => {
    if (!d) {
        d = new Date();
    }
    return `${d.getFullYear()}-${("0" + (d.getMonth()+1).toString()).slice(-2)}-${("0" + d.getDate().toString()).slice(-2)}`;
}

const daily = async (req, res) => {
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

        let datedstockdata = getService.dailystock.find(ds => ds.date === date);

        if (!datedstockdata) {
            const newstock = {
                items: [],
                date: date
            }
            return res.status(200).json({
                status: 'success',
                message: 'Successfully read daily stock data for ' + date,
                data: newstock
            });
        } else {
            datedstockdata = datedstockdata.toObject()
            delete datedstockdata._id;
            datedstockdata.items = datedstockdata.items.map(({_id, ...keys}) => keys);
            return res.status(200).json({
                status: 'success',
                message: 'Successfully read daily stock data for ' + date,
                data: datedstockdata
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
            let datedstockdata = getService.dailystock.find(ds => ds.date === selecteddate);
            if (!datedstockdata) {
                const stockplaceholder = {
                    items: [],
                    date: selecteddate
                }
                response.push(stockplaceholder);
            } else {
                datedstockdata = datedstockdata.toObject();
                delete datedstockdata._id;
                response.push(datedstockdata);
            }
        }

        return res.status(200).json({
            status: 'success',
            message: 'Successfully read weekly stock data for ' + date,
            data: {
                weeklyStock: response
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
            let datedstockdata = getService.dailystock.find(ds => ds.date === selecteddate);
            if (!datedstockdata) {
                const stockplaceholder = {
                    items: [],
                    date: selecteddate
                }
                response.push(stockplaceholder);
            } else {
                datedstockdata = datedstockdata.toObject();
                delete datedstockdata._id;
                response.push(datedstockdata);
            }
        }

        return res.status(200).json({
            status: 'success',
            message: 'Successfully read monthly stock data for ' + date,
            data: {
                monthlyStock: response
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
        const newstock = req.body || [];

        const date = getDate();

        if (newstock.length > 0) {
            const getService = await Service.findOne({ email: req.user.email });
            if (!getService) {
                return res.status(400).json({
                    status: 'error',
                    message: "User not found or not registered yet",
                    data: {}
                });
            }

            let datedstockdata = getService.dailystock.find(ds => ds.date === date);

            if (!datedstockdata) {
                const newstock = {
                    items: [],
                    date: date
                }
                getService.dailystock.push(newstock);
                datedstockdata = getService.dailystock.find(ds => ds.date === date);
            }

            for (const ns of newstock) {
                let item = datedstockdata.items.find(i => i.name === ns.name);
                
                if (item) {
                    item.counts += ns.counts;
                } else {
                    let checkmenu = getService.menu.find(menu => menu.name == ns.name);
                    if (checkmenu) {
                        datedstockdata.items.push({
                            name: ns.name,
                            price: ns.price,
                            counts: ns.counts
                        });
                    } else {
                        return res.status(400).json({
                            status: 'error',
                            message: `Item ${ns.name} not found in user's menu`,
                            data: {}
                        });
                    }
                }
            
                getService.newstock.push({
                    name: ns.name,
                    counts: ns.counts,
                    time: new Date()
                });
            }
            
            await getService.save();

            return res.status(200).json({
                status: 'success',
                message: 'Successfully add new stock data for ' + date,
                data: {
                    newstock: newstock
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