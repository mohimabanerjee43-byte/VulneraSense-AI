/*
===========================================================
 VULNERASENSE-AI
 Context-Aware Demonstration Screening Engine

 IMPORTANT:
 This is an academic prototype.
 It is NOT a medical diagnosis and does not replace
 professional, legal, medical, or emergency assessment.
===========================================================
*/

let latestResult = null;


// ========================================================
// TEXT NORMALIZATION
// ========================================================

function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s']/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


// ========================================================
// CATEGORY DEFINITIONS
// ========================================================

const categories = {

    emotionalDistress: {
        name: "Emotional distress",
        weight: 16,

        phrases: [
            "feeling overwhelmed",
            "feel overwhelmed",
            "very stressed",
            "under a lot of pressure",
            "emotionally exhausted",
            "mentally exhausted",
            "burned out",
            "burnt out",
            "cannot cope",
            "can't cope"
        ]
    },

    fearAnxiety: {
        name: "Fear or anxiety",
        weight: 18,

        phrases: [
            "feeling afraid",
            "feel afraid",
            "feeling scared",
            "feel scared",
            "constant fear",
            "very anxious",
            "extremely anxious",
            "panic",
            "persistent worry",
            "feel frightened"
        ]
    },

    personalSafety: {
        name: "Personal-safety concern",
        weight: 30,

        phrases: [
            "feel unsafe",
            "feeling unsafe",
            "not safe",
            "in danger",
            "feel threatened",
            "feeling threatened",
            "someone is following me",
            "being followed",
            "someone is watching me",
            "being watched",
            "someone is threatening me",
            "threatening me",
            "someone is trying to hurt me",
            "someone may hurt me",
            "i might be kidnapped",
            "might get kidnapped",
            "being kidnapped",
            "being abducted"
        ]
    },

    abuseOrViolence: {
        name: "Potential abuse or violence",
        weight: 28,

        phrases: [
            "being abused",
            "someone abuses me",
            "physically abused",
            "verbally abused",
            "being attacked",
            "someone attacked me",
            "someone is hurting me",
            "being hurt by someone",
            "threatened by someone",
            "forced to do something",
            "being forced",
            "coerced"
        ]
    },

    harassment: {
        name: "Harassment or intimidation",
        weight: 22,

        phrases: [
            "being harassed",
            "someone keeps harassing me",
            "repeatedly harassing me",
            "being intimidated",
            "someone keeps threatening me",
            "unwanted messages",
            "constant unwanted contact",
            "being stalked"
        ]
    },

    isolation: {
        name: "Social isolation",
        weight: 12,

        phrases: [
            "feel lonely",
            "feeling lonely",
            "feel isolated",
            "feeling isolated",
            "no one to talk to",
            "have nobody",
            "feel completely alone",
            "socially isolated",
            "disconnected from everyone"
        ]
    },

    helplessness: {
        name: "Difficulty coping",
        weight: 20,

        phrases: [
            "feel helpless",
            "feeling helpless",
            "feel powerless",
            "feeling powerless",
            "don't know what to do",
            "do not know what to do",
            "unable to cope",
            "can't handle this",
            "cannot handle this"
        ]
    },

    exploitation: {
        name: "Potential exploitation",
        weight: 26,

        phrases: [
            "being exploited",
            "financially exploited",
            "someone is taking my money",
            "forced to work",
            "being forced to work",
            "forced labor",
            "someone controls my money",
            "someone controls my finances"
        ]
    },

    supportNeed: {
        name: "Support need",
        weight: 10,

        phrases: [
            "need help",
            "need support",
            "need someone to talk to",
            "need professional help",
            "need counselling",
            "need counseling",
            "need legal help",
            "need medical help"
        ]
    }
};


// ========================================================
// NEGATION DETECTION
// ========================================================

function isNegated(text, phrase) {

    const index = text.indexOf(phrase);

    if (index === -1) {
        return false;
    }

    const before = text
        .substring(Math.max(0, index - 35), index)
        .trim();

    const negations = [
        "not",
        "never",
        "no",
        "don't",
        "do not",
        "doesn't",
        "didn't",
        "without"
    ];

    return negations.some(word => {
        return before.endsWith(word);
    });
}


// ========================================================
// CATEGORY ANALYSIS
// ========================================================

function analyzeCategories(text) {

    const normalized = normalizeText(text);

    const detected = [];

    Object.entries(categories).forEach(
        ([key, category]) => {

            const matches = [];

            category.phrases.forEach(phrase => {

                if (
                    normalized.includes(phrase) &&
                    !isNegated(normalized, phrase)
                ) {
                    matches.push(phrase);
                }

            });

            if (matches.length > 0) {

                detected.push({
                    key: key,
                    name: category.name,
                    weight: category.weight,
                    matches: matches
                });

            }
        }
    );

    return detected;
}


// ========================================================
// URGENCY ANALYSIS
// ========================================================

function detectUrgency(text) {

    const t = normalizeText(text);

    const urgentPatterns = [
        "immediate danger",
        "in immediate danger",
        "need help immediately",
        "need help right now",
        "emergency",
        "not safe right now",
        "unsafe right now",
        "someone is threatening me right now",
        "being followed right now"
    ];

    const matches = urgentPatterns.filter(
        phrase =>
            t.includes(phrase) &&
            !isNegated(t, phrase)
    );

    return {
        detected: matches.length > 0,
        matches: matches
    };
}


// ========================================================
// CONTEXT ANALYSIS
// ========================================================

function analyzeContext(text) {

    const t = normalizeText(text);

    let contextScore = 0;

    /*
       Multiple independent signals are stronger than
       one isolated phrase.
    */

    const contextualSignals = [
        "right now",
        "currently",
        "every day",
        "for several days",
        "for weeks",
        "keeps happening",
        "happens repeatedly",
        "repeatedly",
        "cannot escape",
        "no one knows",
        "afraid to tell anyone"
    ];

    contextualSignals.forEach(signal => {

        if (t.includes(signal)) {
            contextScore += 5;
        }

    });

    return Math.min(contextScore, 20);
}


// ========================================================
// SCORE CALCULATION
// ========================================================

function calculateScore(text) {

    const detectedCategories =
        analyzeCategories(text);

    const urgency =
        detectUrgency(text);

    const contextScore =
        analyzeContext(text);

    let score = 5;


    // Add category contributions
    detectedCategories.forEach(category => {

        score += category.weight;

        // Multiple matching phrases within the same
        // category add only a small contextual bonus.
        if (category.matches.length > 1) {
            score += Math.min(
                (category.matches.length - 1) * 3,
                9
            );
        }

    });


    // Context bonus
    score += contextScore;


    // Urgency has priority
    if (urgency.detected) {
        score = Math.max(score, 75);
    }


    // Multiple categories indicate broader vulnerability
    if (detectedCategories.length >= 3) {
        score += 10;
    }


    // Long enough input may contain useful context,
    // but length alone should never create a high score.
    if (text.length > 250) {
        score += 3;
    }


    return Math.min(
        Math.round(score),
        100
    );
}


// ========================================================
// CONFIDENCE ESTIMATION
// ========================================================

function calculateConfidence(
    detectedCategories,
    urgency,
    text
) {

    if (!text.trim()) {
        return 0;
    }

    let confidence = 35;

    if (detectedCategories.length >= 1) {
        confidence += 15;
    }

    if (detectedCategories.length >= 2) {
        confidence += 15;
    }

    if (detectedCategories.length >= 3) {
        confidence += 10;
    }

    if (urgency.detected) {
        confidence += 15;
    }

    if (text.length > 80) {
        confidence += 5;
    }

    return Math.min(
        confidence,
        95
    );
}


// ========================================================
// LEVEL CLASSIFICATION
// ========================================================

function getLevel(
    score,
    detectedCategories,
    urgency
) {

    if (urgency.detected || score >= 75) {

        return {
            key: "critical",
            name: "Critical review required",
            desc:
                "Urgent safety-related signals were detected. This prototype cannot verify the situation or provide a diagnosis. Human review is required."
        };
    }


    if (
        score >= 50 ||
        detectedCategories.some(
            category =>
                category.key === "personalSafety" ||
                category.key === "abuseOrViolence"
        )
    ) {

        return {
            key: "high",
            name: "High vulnerability",
            desc:
                "Multiple or significant vulnerability signals were detected. A trained human should review the situation."
        };
    }


    if (score >= 25) {

        return {
            key: "moderate",
            name: "Moderate vulnerability",
            desc:
                "Some vulnerability or distress-related patterns were detected. Supportive conversation and appropriate professional guidance may be useful."
        };
    }


    return {
        key: "low",
        name: "Low vulnerability",
        desc:
            "Few significant vulnerability signals were detected in this demonstration."
    };
}


// ========================================================
// RECOMMENDATIONS
// ========================================================

function generateRecommendations(
    detectedCategories,
    urgency
) {

    const recommendations = [];


    if (
        detectedCategories.some(
            c => c.key === "personalSafety"
        )
    ) {
        recommendations.push(
            "Consider contacting a trusted person and obtaining appropriate safety support."
        );
    }


    if (
        detectedCategories.some(
            c => c.key === "abuseOrViolence" ||
            c.key === "harassment"
        )
    ) {
        recommendations.push(
            "Consider appropriate professional, legal, or safeguarding support."
        );
    }


    if (
        detectedCategories.some(
            c => c.key === "emotionalDistress" ||
            c.key === "fearAnxiety" ||
            c.key === "helplessness"
        )
    ) {
        recommendations.push(
            "Consider speaking with a qualified mental-health professional or trusted support person."
        );
    }


    if (
        detectedCategories.some(
            c => c.key === "exploitation"
        )
    ) {
        recommendations.push(
            "Consider appropriate legal or social-support services."
        );
    }


    if (urgency.detected) {
        recommendations.unshift(
            "The prototype has flagged an urgent safety concern for human review."
        );
    }


    if (recommendations.length === 0) {
        recommendations.push(
            "Continue monitoring the situation and consider supportive resources if concerns increase."
        );
    }


    return recommendations;
}


// ========================================================
// SAVE RESULT
// ========================================================

function saveResult(result) {

    localStorage.setItem(
        "vulneraSenseResult",
        JSON.stringify(result)
    );

    localStorage.setItem(
        "vulneraSenseText",
        result.text
    );
}


// ========================================================
// MAIN ANALYSIS
// ========================================================

function analyze() {

    const input =
        document.getElementById("textInput");

    if (!input || !input.value.trim()) {

        alert(
            "Please enter a short sample first."
        );

        return;
    }


    const text = input.value.trim();

    const button =
        document.getElementById("analyzeBtn");


    if (button) {

        button.disabled = true;
        button.textContent = "Analyzing…";
    }


    setTimeout(() => {

        const detectedCategories =
            analyzeCategories(text);

        const urgency =
            detectUrgency(text);

        const score =
            calculateScore(text);

        const confidence =
            calculateConfidence(
                detectedCategories,
                urgency,
                text
            );

        const level =
            getLevel(
                score,
                detectedCategories,
                urgency
            );

        const recommendations =
            generateRecommendations(
                detectedCategories,
                urgency
            );


        const result = {

            score: score,

            confidence: confidence,

            level: level,

            safetyConcern:
                detectedCategories.some(
                    c =>
                        c.key === "personalSafety" ||
                        c.key === "abuseOrViolence"
                ),

            urgent:
                urgency.detected,

            indicators:
                detectedCategories.map(
                    category => category.name
                ),

            categories:
                detectedCategories.map(
                    category => ({
                        key: category.key,
                        name: category.name
                    })
                ),

            recommendations:
                recommendations,

            time:
                new Date().toLocaleString(),

            text: text
        };


        latestResult = result;

        saveResult(result);


        if (button) {

            button.disabled = false;

            button.textContent =
                "Analyze Again →";
        }


        window.location.href =
            "results.html";

    }, 900);
}


// ========================================================
// DYNAMIC BUTTON SUPPORT
// ========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        function attachButton() {

            const button =
                document.getElementById("analyzeBtn");

            if (!button) {
                return;
            }

            if (
                button.dataset.assessmentAttached ===
                "true"
            ) {
                return;
            }

            button.dataset.assessmentAttached =
                "true";

            button.addEventListener(
                "click",
                analyze
            );
        }


        attachButton();


        const observer =
            new MutationObserver(
                attachButton
            );


        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );

    }
);