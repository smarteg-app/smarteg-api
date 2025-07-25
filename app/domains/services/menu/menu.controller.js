const Service = require('../services.model').Service;

const read = async (req, res) => {
    try {
        const getService = await Service.findOne({ email: req.user.email });
        if (!getService) {
            return res.status(400).json({
                status: 'error',
                message: "User not found or not registered yet",
                data: {}
            });
        }

        let getServiceData = getService.toObject();
        getServiceData.menu = getServiceData.menu.map(({_id, ...keys}) => keys);

        return res.status(200).json({
            status: 'success',
            message: 'Successfully read menu data',
            data: {
                menu: getServiceData.menu
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

const create = async (req, res) => {
    try {
        const newmenu = req.body || [];

        const getService = await Service.findOne({ email: req.user.email });
        if (!getService) {
            return res.status(400).json({
                status: 'error',
                message: "User not found or not registered yet",
                data: {}
            });
        }

        if (newmenu.length > 0) {
            for (const nm of newmenu) {
                let checkmenu = getService.menu.find(menu => menu.name === nm.name);
                if (checkmenu) {
                    return res.status(400).json({
                        status: 'error',
                        message: `Item ${nm.name} already exists`, 
                        data: {}
                    });
                } else {
                    getService.menu.push(nm);
                }
            }

            await getService.save();

            let getServiceData = getService.toObject();
            getServiceData.menu = getServiceData.menu.map(({_id, ...keys}) => keys);

            return res.status(200).json({
                status: 'success',
                message: 'Successfully create new menu',
                data: {
                    menu: getServiceData.menu
                }
            });
        } else {
            return res.status(400).json({
                status: 'error',
                message: 'No menu data to create',
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

const update = async (req, res) => {
    try {
        const newmenu = req.body || [];

        const getService = await Service.findOne({ email: req.user.email });
        if (!getService) {
            return res.status(400).json({
                status: 'error',
                message: "User not found or not registered yet",
                data: {}
            });
        }

        if (newmenu.length > 0) {
            for (const nm of newmenu) {
                let checkmenu = getService.menu.find(menu => menu.name === nm.name);
                if (checkmenu) {
                    checkmenu.name = nm.name;
                    checkmenu.price = nm.price;
                } else {
                    return res.status(400).json({
                        status: 'error',
                        message: `Item ${nm.name} not found`, 
                        data: {}
                    });
                }
            }

            await getService.save();

            let getServiceData = getService.toObject();
            getServiceData.menu = getServiceData.menu.map(({_id, ...keys}) => keys);

            return res.status(200).json({
                status: 'success',
                message: 'Successfully update user menu',
                data: {
                    menu: getServiceData.menu
                }
            });
        } else {
            return res.status(400).json({
                status: 'error',
                message: 'No menu data to update',
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

const remove = async (req, res) => {
    try {
        const { name } = req.body || [];

        const getService = await Service.findOne({ email: req.user.email });
        if (!getService) {
            return res.status(400).json({
                status: 'error',
                message: "User not found or not registered yet",
                data: {}
            });
        }

        const index = getService.menu.findIndex(menu => menu.name === name);
        if (index === -1) {
            return res.status(400).json({
                status: 'error',
                message: `Item ${name} not found`,
                data: {}
            });
        } else {
            getService.menu.splice(index, 1);
        }

        await getService.save();

        let getServiceData = getService.toObject();
        getServiceData.menu = getServiceData.menu.map(({_id, ...keys}) => keys);

        return res.status(200).json({
            status: 'success',
            message: 'Successfully remove user menu',
            data: {
                menu: getServiceData.menu
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
    read,
    create,
    update,
    remove
};