const express = require("express");

const router =
    express.Router();


const {
    analyzeText
} = require("../services/aiModel");


router.post(
    "/",
    (req, res) => {

        const {
            text = ""
        } = req.body;


        if (!text.trim()) {

            return res.status(400).json({

                error:
                    "Text is required"

            });

        }


        const result =
            analyzeText(text);


        res.json(result);

    }
);


module.exports = router;