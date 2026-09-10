let latestScore = 0;

/*
    VulneraSense-AI Demonstration Assessment Engine

    IMPORTANT:
    This is a prototype/demo scoring system.
    It is NOT a clinical AI model and does NOT provide a diagnosis.
*/


// --------------------------------------------------
// SAFETY CONCERN DETECTION
// --------------------------------------------------

function detectSafetyConcerns(text) {
    const t = text.toLowerCase();

    const safetyPatterns = [
        {
            words: [
                "kidnap",
                "kidnapped",
                "kidnapping",
                "abduct",
                "abducted",
                "abduction"
            ],
            label: "Potential personal-safety concern detected"
        },

        {
            words: [
                "i am in danger",
                "i'm in danger",
                "i am unsafe",
                "i'm unsafe",
                "feel unsafe",
                "feeling unsafe"
            ],
            label: "User reports feeling unsafe"
        },

        {
            words: [
                "threatened",
                "someone threatened me",
                "being threatened",
                "threatening me"
            ],
            label: "Potential threat-related concern detected"
        },

        {
            words: [
                "someone is following me",
                "someone follows me",
                "being followed",
                "following me"
            ],
            label: "Potential immediate safety concern detected"
        },

        {
            words: [
                "someone is watching me",
                "someone watching me",
                "being watched"
            ],
            label: "Potential personal-safety concern detected"
        }
    ];

    const detected = [];

    safetyPatterns.forEach(pattern => {
        const matched = pattern.words.some(word => t.includes(word));

        if (matched) {
            detected.push(pattern.label);
        }
    });

    return {
        detected: detected.length > 0,
        indicators: [...new Set(detected)]
    };
}


// --------------------------------------------------
// GENERAL DISTRESS INDICATORS
// --------------------------------------------------

function detectDistressIndicators(text) {
    const t = text.toLowerCase();

    const indicators = [];

    const groups = [
        {
            words: [
                "overwhelmed",
                "stressed",
                "pressure",
                "exhausted",
                "burned out",
                "burnt out"
            ],
            label: "Stress or feeling overwhelmed"
        },

        {
            words: [
                "lonely",
                "isolated",
                "alone",
                "withdrawn",
                "disconnected"
            ],
            label: "Loneliness or social isolation"
        },

        {
            words: [
                "afraid",
                "scared",
                "fear",
                "unsafe",
                "threatened",
                "intimidated"
            ],
            label: "Fear or perceived threat"
        },

        {
            words: [
                "hopeless",
                "helpless",
                "desperate",
                "can't cope",
                "cannot cope"
            ],
            label: "Feeling unable to cope"
        }
    ];

    groups.forEach(group => {
        if (group.words.some(word => t.includes(word))) {
            indicators.push(group.label);
        }
    });

    return [...new Set(indicators)];
}


// --------------------------------------------------
// DEMONSTRATION SCORE
// --------------------------------------------------

function demoScore(text) {

    const distressIndicators = detectDistressIndicators(text);
    const safety = detectSafetyConcerns(text);

    let score = 10;

    // General distress signals
    if (
        distressIndicators.includes("Stress or feeling overwhelmed")
    ) {
        score += 18;
    }

    if (
        distressIndicators.includes("Loneliness or social isolation")
    ) {
        score += 16;
    }

    if (
        distressIndicators.includes("Fear or perceived threat")
    ) {
        score += 22;
    }

    if (
        distressIndicators.includes("Feeling unable to cope")
    ) {
        score += 25;
    }


    // Personal-safety concerns receive additional
    // priority in this demonstration.
    if (safety.detected) {
        score += 35;

        // Make sure a detected safety concern does not
        // remain classified as "Low".
        score = Math.max(score, 65);
    }


    // Longer descriptions can contain more contextual information.
    if (text.length > 120) {
        score += 8;
    }

    if (text.length > 260) {
        score += 6;
    }


    return Math.min(score, 100);
}


// --------------------------------------------------
// VULNERABILITY LEVEL
// --------------------------------------------------

function getLevel(score, safetyDetected = false) {

    /*
        Safety concerns receive a separate priority flag.
        The score remains a demonstration score.
    */

    if (safetyDetected && score >= 65) {
        return {
            key: "high",
            name: "High vulnerability",
            desc: "A potential personal-safety concern was detected. The result should be reviewed by a trained human and should not be treated as a diagnosis."
        };
    }

    if (score < 25) {
        return {
            key: "low",
            name: "Low vulnerability",
            desc: "Few broad distress signals were detected in this demonstration."
        };
    }

    if (score < 50) {
        return {
            key: "moderate",
            name: "Moderate vulnerability",
            desc: "Some distress-related patterns were detected. Consider supportive conversation and appropriate professional guidance."
        };
    }

    if (score < 75) {
        return {
            key: "high",
            name: "High vulnerability",
            desc: "Multiple distress-related patterns were detected. A trained human should review the situation."
        };
    }

    return {
        key: "critical",
        name: "Critical review required",
        desc: "A high concentration of distress-related signals was detected. This demonstration result requires trained human review."
    };
}


// --------------------------------------------------
// SAVE RESULT
// --------------------------------------------------

function saveResult(score, level, safety, indicators) {

    const result = {
        score: score,

        level: level,

        safetyConcern: safety.detected,

        safetyIndicators: safety.indicators,

        indicators: indicators,

        time: new Date().toLocaleString()
    };

    localStorage.setItem(
        "vulneraSenseResult",
        JSON.stringify(result)
    );
}


// --------------------------------------------------
// MAIN ANALYSIS FUNCTION
// --------------------------------------------------

function analyze() {

    const input = document.getElementById("textInput");

    if (!input || !input.value.trim()) {

        alert("Please enter a short sample first.");

        return;
    }


    const text = input.value.trim();

    const btn = document.getElementById("analyzeBtn");

    if (btn) {
        btn.disabled = true;
        btn.textContent = "Analyzing…";
    }


    setTimeout(() => {

        // Detect patterns
        const indicators = detectDistressIndicators(text);

        const safety = detectSafetyConcerns(text);


        // Calculate score
        latestScore = demoScore(text);


        // Determine level
        const level = getLevel(
            latestScore,
            safety.detected
        );


        // Save result
        saveResult(
            latestScore,
            level,
            safety,
            indicators
        );


        // Save original input
        localStorage.setItem(
            "vulneraSenseText",
            text
        );


        // Update button
        if (btn) {
            btn.disabled = false;
            btn.textContent = "Analyze Again →";
        }


        // Go to Results page
        window.location.href = "results.html";

    }, 900);
}


// --------------------------------------------------
// DOM READY
// --------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    /*
        The assessment page creates its controls dynamically.
        Therefore, we do not depend on the button already
        existing when this script initially loads.
    */

    const attachAnalyzeButton = () => {

        const btn = document.getElementById("analyzeBtn");

        if (!btn) {
            return;
        }

        // Prevent duplicate listeners
        if (btn.dataset.assessmentAttached === "true") {
            return;
        }

        btn.dataset.assessmentAttached = "true";

        btn.addEventListener("click", analyze);
    };


    attachAnalyzeButton();


    // Watch for dynamically-created elements
    const observer = new MutationObserver(() => {
        attachAnalyzeButton();
    });


    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

});