const Service = require('../services.model').Service;

const get = async (req, res) => {
    try {
        let date = req.params.date;
        if (!date) {
            const d = new Date();
            date = `${d.getFullYear()}-${("0" + (d.getMonth()+1).toString()).slice(-2)}-${("0" + d.getDate().toString()).slice(-2)}`;
        }

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
            await getService.save();
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

const add = async (req, res) => {
    try {
        const newstock = req.body || [];

        const d = new Date();
        const date = `${d.getFullYear()}-${("0" + (d.getMonth()+1).toString()).slice(-2)}-${("0" + d.getDate().toString()).slice(-2)}`;

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
            const newstock = {
                items: [],
                date: date
            }
            getService.dailystock.push(newstock);
        }

        for (const ns of newstock) {
            let item = datedstockdata.items.find(i => i.name === ns.name);
        
            if (item) {
                item.counts += ns.counts;
            } else {
                datedstockdata.items.push({
                    name: ns.name,
                    price: ns.price,
                    counts: ns.counts
                });
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
    get,
    add
};