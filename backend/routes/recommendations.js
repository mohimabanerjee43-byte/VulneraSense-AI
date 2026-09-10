const express = require("express");

const router =
    express.Router();


const map = {

    low: [

        "Trusted connection",

        "Healthy routine",

        "Self-monitoring"

    ],


    moderate: [

        "Trusted support",

        "Counselling",

        "Follow-up"

    ],


    high: [

        "Professional review",

        "Trusted-person support",

        "Safety escalation"

    ],


    critical: [

        "Immediate human review",

        "Trusted support",

        "Emergency pathway"

    ]

};


router.get(
    "/:level",
    (req, res) => {

        const level =
            req.params.level
                .toLowerCase();


        res.json({

            level: level,

            recommendations:
                map[level] || []

        });

    }
);


module.exports = router;