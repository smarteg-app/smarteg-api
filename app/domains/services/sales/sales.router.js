const express = require('express');
const salesRouter = express.Router();

const verifyToken = require('../../../middlewares/auth/jwt/jwt.verify');

const salesController = require('./sales.controller');

salesRouter.get('/daily', verifyToken, salesController.daily);
salesRouter.get('/daily/:date', verifyToken, salesController.daily);
salesRouter.get('/weekly', verifyToken, salesController.weekly);
salesRouter.get('/monthly', verifyToken, salesController.monthly);
salesRouter.put('/add', verifyToken, salesController.add);

module.exports = salesRouter;