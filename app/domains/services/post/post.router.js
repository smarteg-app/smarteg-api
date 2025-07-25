const express = require('express');
const multer = require('multer');
const postRouter = express.Router();

const verifyToken = require('../../../middlewares/auth/jwt/jwt.verify');

const postController = require('./post.controller');

// Configure multer for memory storage (don't save to disk)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Route with multer middleware to handle single photo upload
postRouter.post('/telegram-channel', verifyToken, upload.single('photo'), postController.telegramChannel);

module.exports = postRouter;