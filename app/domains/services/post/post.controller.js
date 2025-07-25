const axios = require('axios');
const FormData = require('form-data');

const telegramChannel = async (req, res) => {
    try {
        // Get Telegram bot token and chat ID from environment variables
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        // Validate environment variables
        if (!botToken) {
            return res.status(500).json({
                status: 'error',
                message: 'TELEGRAM_BOT_TOKEN environment variable is not configured',
                data: {}
            });
        }

        if (!chatId) {
            return res.status(500).json({
                status: 'error',
                message: 'TELEGRAM_CHAT_ID environment variable is not configured',
                data: {}
            });
        }

        // Check if photo file was uploaded
        if (!req.file) {
            return res.status(400).json({
                status: 'error',
                message: 'No photo file uploaded. Please upload a photo.',
                data: {}
            });
        }

        // Get caption from request body (optional)
        const caption = req.body.caption || '';

        // Create FormData for Telegram API
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('photo', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });
        
        if (caption) {
            formData.append('caption', caption);
        }

        // Send photo to Telegram
        const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
        
        const response = await axios.post(telegramApiUrl, formData, {
            headers: {
                ...formData.getHeaders(),
            }
        });

        // Check if Telegram API responded successfully
        if (response.data.ok) {
            return res.status(200).json({
                status: 'success',
                message: 'Photo sent to Telegram channel successfully',
                data: {
                    message_id: response.data.result.message_id,
                    chat_id: response.data.result.chat.id,
                    date: response.data.result.date
                }
            });
        } else {
            return res.status(400).json({
                status: 'error',
                message: 'Failed to send photo to Telegram: ' + response.data.description,
                data: {}
            });
        }
        
    } catch (err) {
        console.error('Telegram API Error:', err.response?.data || err.message);
        return res.status(400).json({
            status: 'error',
            message: process.env.DEBUG ? err.message : "Bad Request",
            data: {}
        });
    }
}

module.exports = {
    telegramChannel
};