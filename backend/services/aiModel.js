const {
    extractSignals
} = require("./nlp");


const {
    classify
} = require("./riskEngine");


function analyzeText(text) {

    let score = 10;


    const signals =
        extractSignals(text);


    const weights = {

        stress: 18,

        isolation: 16,

        fear: 22,

        hopelessness: 25

    };


    signals.forEach(
        signal => {

            score +=
                weights[signal] || 0;

        }
    );


    if (text.length > 120) {

        score += 8;

    }


    if (text.length > 260) {

        score += 6;

    }


    score =
        Math.min(score, 100);


    return {

        score: score,

        category:
            classify(score),

        signals: signals,

        disclaimer:
            "Prototype demonstration only. Not a diagnosis or autonomous safety decision."

    };

}


module.exports = {

    analyzeText

};