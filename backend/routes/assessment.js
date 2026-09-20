const express = require("express");
const router = express.Router();

const {
    analyzeText
} = require("../services/aiModel");

router.post(
    "/",
    async (req, res) => {
        const {
            text = ""
        } = req.body;

        if (!text.trim()) {
            return res.status(400).json({
                error: "Text is required"
            });
        }

        try {
            // 1. Fetch verification metrics from your Python security service
            const pythonResponse = await fetch('http://127.0.0.1:5000/verify-trust', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-forwarded-for': req.ip || req.socket.remoteAddress
                },
                body: JSON.stringify(req.body)
            });

            const trustReport = await pythonResponse.json();

            // 2. Run your teammate's existing text analysis function
            const result = analyzeText(text);

            // 3. Return combined response containing both trust metrics and analysis results
            res.json({
                securityVerification: trustReport,
                analysis: result
            });

        } catch (err) {
            console.error("Failed to connect to Python security microservice:", err);
            
            // Fallback so the app still functions if the Python server drops
            const result = analyzeText(text);
            res.json({
                securityVerification: { status: "OFFLINE", trustValue: 50, flags: ["MICROSERVICE_UNAVAILABLE"] },
                analysis: result
            });
        }
    }
);

router.post(
    "/update-audio",
    async (req, res) => {
        try {
            const pythonResponse = await fetch('http://127.0.0.1:5000/update-audio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req.body)
            });
            const audioVerdict = await pythonResponse.json();
            res.status(200).json(audioVerdict);
        } catch (err) {
            console.error("Audio analysis gateway error:", err);
            res.status(500).json({ error: "Audio analysis gateway error" });
        }
    }
);

module.exports = router;