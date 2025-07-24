const express = require('express');
const salesRouter = express.Router();

const verifyToken = require('../../../middlewares/auth/jwt/jwt.verify');

const salesController = require('./sales.controller');

salesRouter.get('/get', verifyToken, salesController.get);
salesRouter.get('/get/:date', verifyToken, salesController.get);
salesRouter.put('/add', verifyToken, salesController.add);

module.exports = salesRouter;