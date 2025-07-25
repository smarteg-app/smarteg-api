const express = require('express');
const menuRouter = express.Router();

const verifyToken = require('../../../middlewares/auth/jwt/jwt.verify');

const menuController = require('./menu.controller');

menuRouter.get('/read', verifyToken, menuController.read);
menuRouter.post('/create', verifyToken, menuController.create);
menuRouter.put('/update', verifyToken, menuController.update);
menuRouter.delete('/remove', verifyToken, menuController.remove);

module.exports = menuRouter;