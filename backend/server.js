const express = require("express");
const path = require('path') ;
const cors = require("cors");

const assessment =
    require("./routes/assessment");

const recommendations =
    require("./routes/recommendations");


const app = express();

const PORT = 3000;


/* Middleware */

app.use(cors());

// Increase JSON and URL-encoded body size limits to handle base64 audio snippets
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve all static files from your root VulneraSense-AI folder
// (Assumes server.js is inside C:\Users\aditi\VulneraSense-AI\backend\)
app.use(express.static(path.join(__dirname, '../')));

// Default route to load your assessment page directly at localhost:3000
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/assessment.html'));
});
/* Routes */

app.use(
    "/api/assessment",
    assessment
);



app.use(
    "/api/recommendations",
    recommendations
);


/* Health check */

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            status: "online",

            prototype: true

        });

    }
);
/* Audio Telemetry Proxy Route */

app.post(
    "/api/update-audio",
    async (req, res) => {
        try {
            const pythonResponse = await fetch(
                "http://127.0.0.1:5000/update-audio",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(req.body)
                }
            );

            const data = await pythonResponse.json();
            res.json(data);

        } catch (error) {
            console.error("Python audio service connection error:", error);
            res.status(500).json({
                audioVerdict: "SERVICE_OFFLINE",
                trustDelta: 0
            });
        }
    }
);



/* Start server */

app.listen(
    PORT,
    () => {

        console.log(
            `VulneraSense backend running at http://localhost:${PORT}`
        );

    }
);