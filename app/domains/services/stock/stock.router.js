const express = require('express');
const stockRouter = express.Router();

const verifyToken = require('../../../middlewares/auth/jwt/jwt.verify');

const stockController = require('./stock.controller');

stockRouter.get('/daily', verifyToken, stockController.daily);
stockRouter.get('/daily/:date', verifyToken, stockController.daily);
stockRouter.get('/weekly', verifyToken, stockController.weekly);
stockRouter.get('/monthly', verifyToken, stockController.monthly);
stockRouter.put('/add', verifyToken, stockController.add);

module.exports = stockRouter;