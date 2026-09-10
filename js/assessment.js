let latestScore = 0;


/*
    Demonstration scoring function.

    IMPORTANT:
    This is NOT a clinical AI model.
*/


function demoScore(text) {

    const t = text.toLowerCase();

    let score = 10;


    const groups = [

        [
            "overwhelmed",
            "stressed",
            "pressure",
            "exhausted",
            "burned out"
        ],

        [
            "lonely",
            "isolated",
            "alone",
            "withdrawn",
            "disconnected"
        ],

        [
            "afraid",
            "scared",
            "unsafe",
            "threatened",
            "intimidated"
        ],

        [
            "hopeless",
            "helpless",
            "desperate",
            "can't cope"
        ]

    ];


    groups.forEach(
        (group, index) => {

            if (
                group.some(
                    word => t.includes(word)
                )
            ) {

                score +=
                    [18, 16, 22, 25][index];

            }

        }
    );


    if (text.length > 120) {

        score += 8;

    }


    if (text.length > 260) {

        score += 6;

    }


    return Math.min(score, 100);
}


/* Risk category */

function getLevel(score) {

    if (score < 25) {

        return {

            key: "low",

            name: "Low vulnerability",

            desc:
                "Few broad distress signals were detected in this demonstration."

        };

    }


    if (score < 50) {

        return {

            key: "moderate",

            name: "Moderate vulnerability",

            desc:
                "Some distress-related patterns were detected. Consider supportive conversation and appropriate professional guidance."

        };

    }


    if (score < 75) {

        return {

            key: "high",

            name: "High vulnerability",

            desc:
                "Multiple distress-related patterns were detected. A trained human should review the situation."

        };

    }


    return {

        key: "critical",

        name: "Critical review required",

        desc:
            "A high concentration of distress-related signals was detected. This demo result must be reviewed by a trained human."

    };

}


/* Save result */

function saveResult(score, level) {

    localStorage.setItem(

        "vulneraSenseResult",

        JSON.stringify({

            score: score,

            level: level,

            time:
                new Date().toLocaleString()

        })

    );

}


/* Analyze */

function analyze() {

    const input =
        document.getElementById("textInput");


    if (
        !input ||
        !input.value.trim()
    ) {

        alert(
            "Please enter a short sample first."
        );

        return;
    }


    const btn =
        document.getElementById("analyzeBtn");


    btn.disabled = true;

    btn.textContent =
        "Analyzing…";


    setTimeout(() => {

        latestScore =
            demoScore(input.value);


        const level =
            getLevel(latestScore);


        saveResult(
            latestScore,
            level
        );


        localStorage.setItem(
            "vulneraSenseText",
            input.value
        );


        btn.disabled = false;

        btn.textContent =
            "Analyze Again →";


        window.location.href =
            "../pages/results.html";


    }, 900);

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            document.body.dataset.page !==
            "assessment"
        ) {

            return;

        }


        document
            .getElementById("analyzeBtn")
            .addEventListener(
                "click",
                analyze
            );

    }
);