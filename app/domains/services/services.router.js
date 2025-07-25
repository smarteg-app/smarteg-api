const express = require('express');
const serviceRouter = express.Router();

const geminiRouter = require('./gemini/gemini.router');
const menuRouter = require('./menu/menu.router');
const stockRouter = require('./stock/stock.router');
const salesRouter = require('./sales/sales.router');
const postRouter = require('./post/post.router');

serviceRouter.use('/gemini', geminiRouter);
serviceRouter.use('/menu', menuRouter);
serviceRouter.use('/stock', stockRouter);
serviceRouter.use('/sales', salesRouter);
serviceRouter.use('/post', postRouter);

module.exports = serviceRouter;