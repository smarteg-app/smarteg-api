const express = require('express');
const userRouter = express.Router();

const verifyToken = require('../../middlewares/auth/jwt/jwt.verify');

const authRouter = require('./auth/user.auth.routes');
const userController = require('./user.controller');

userRouter.use('/auth', authRouter);
userRouter.get('/me', verifyToken, userController.read);
userRouter.put('/me', verifyToken, userController.update);

module.exports = userRouter;