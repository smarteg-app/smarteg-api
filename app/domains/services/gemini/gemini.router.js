const express = require('express');
const geminiRouter = express.Router();

const verifyToken = require('../../../middlewares/auth/jwt/jwt.verify');

const geminiController = require('./gemini.controller');

geminiRouter.get('/token', verifyToken, geminiController.token);

module.exports = geminiRouter;