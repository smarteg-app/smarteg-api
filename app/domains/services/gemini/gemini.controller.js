const { GoogleGenAI } = require("@google/genai");

const token = async (req, res) => {
    try {
        const client = new GoogleGenAI({
            apiKey: process.env.GOOGLE_AI_API_KEY
        });
        const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();

        const token = await client.authTokens.create({
            config: {
                uses: 1,
                expireTime: expireTime,
                newSessionExpireTime: new Date(Date.now() + (1 * 60 * 1000)),
                httpOptions: {apiVersion: 'v1alpha'},
            },
        });

        return res.status(200).json({
            status: 'success',
            message: 'Successfully generate gemini ephemeral token',
            data: token
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            status: 'error',
            message: process.env.DEBUG ? err.message : "Bad Request",
            data: {}
        });
    }
}

module.exports = {
    token
};