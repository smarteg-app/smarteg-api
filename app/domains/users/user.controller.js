const User = require('./user.model').User;

const read = async (req, res) => {
    try {
        const getUser = await User.findOne({ email: req.user.email });
        if (!getUser) {
            return res.status(400).json({
                status: 'error',
                message: "User not found or not registered yet",
                data: {}
            });
        }

        let getUserData = getUser;
        getUserData = getUserData.toObject();
        delete getUserData._id;
        delete getUserData.__v;

        return res.status(200).json({
            status: "success", 
            message: "Successfully get profile data",
            data: getUserData
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            status: 'error',
            message: process.env.DEBUG ? err.message : "Bad Request",
            data: {}
        });
    }
};

const update = async (req, res) => {
    try {
        const { name } = req.body;
        if (name) {
            const getUser = await User.findOne({ email: req.user.email });
            if (!getUser) {
                return res.status(400).json({
                    status: 'error',
                    message: "User not found or not registered yet",
                    data: {}
                });
            }

            getUser.name = name;
            await getUser.save();

            let getUserData = getUser;
            getUserData = getUserData.toObject();
            delete getUserData._id;
            delete getUserData.__v;

            return res.status(200).json({
                status: "success", 
                message: "Successfully update profile data",
                data: getUserData
            });
        } else {
            return res.status(200).json({
                status: "success", 
                message: "No changes were made",
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
};

module.exports = {
    read,
    update
};