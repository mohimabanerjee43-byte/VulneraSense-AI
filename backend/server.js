const express = require("express");

const cors = require("cors");

const assessment =
    require("./routes/assessment");

const recommendations =
    require("./routes/recommendations");


const app = express();

const PORT = 3000;


/* Middleware */

app.use(cors());

app.use(express.json());


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


/* Start server */

app.listen(
    PORT,
    () => {

        console.log(
            `VulneraSense backend running at http://localhost:${PORT}`
        );

    }
);