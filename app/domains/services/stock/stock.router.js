const express = require('express');
const stockRouter = express.Router();

const verifyToken = require('../../../middlewares/auth/jwt/jwt.verify');

const stockController = require('./stock.controller');

stockRouter.get('/get', verifyToken, stockController.get);
stockRouter.get('/get/:date', verifyToken, stockController.get);
stockRouter.put('/add', verifyToken, stockController.add);

module.exports = stockRouter;