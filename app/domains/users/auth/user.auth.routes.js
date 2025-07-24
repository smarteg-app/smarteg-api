const express = require('express');
const authRouter = express.Router();

const verifyToken = require('../../../middlewares/auth/jwt/jwt.verify');

const authController = require('./user.auth.controller');
const googleAuthRouter = require('./google/auth.google.router');

authRouter.get('/sign-token', authController.sign);
authRouter.get('/refresh-token', verifyToken, authController.refresh);
authRouter.use('/google', googleAuthRouter);

module.exports = authRouter;