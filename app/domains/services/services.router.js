const express = require('express');
const serviceRouter = express.Router();

const geminiRouter = require('./gemini/gemini.router');
const menuRouter = require('./menu/menu.router');
const stockRouter = require('./stock/stock.router');
const salesRouter = require('./sales/sales.router');

serviceRouter.use('/gemini', geminiRouter);
serviceRouter.use('/menu', menuRouter);
serviceRouter.use('/stock', stockRouter);
serviceRouter.use('/sales', salesRouter);

module.exports = serviceRouter;