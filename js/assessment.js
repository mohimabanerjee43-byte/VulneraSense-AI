/* ============================================================
   VULNERASENSE-AI
   ADVANCED VULNERABILITY ASSESSMENT ENGINE
   ============================================================

   PURPOSE
   ------------------------------------------------------------
   Detects safety/vulnerability indicators from text.

   This is a PROTOTYPE SCREENING ENGINE.

   IMPORTANT:
   Risk Score       != Accuracy
   Confidence       != Accuracy
   Keyword detection != AI diagnosis

   Real accuracy requires:
   1. Labeled dataset
   2. Train/test split
   3. Independent evaluation
   4. Accuracy / Precision / Recall / F1
   5. Confusion matrix

   ============================================================ */


/* ============================================================
   GLOBAL
   ============================================================ */

let latestResult = null;


/* ============================================================
   1. TEXT NORMALIZATION
   ============================================================ */

function normalizeText(text) {

    return String(text || "")
        .toLowerCase()
        .replace(/[^\w\s'-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


/* ============================================================
   2. TOKENIZATION
   ============================================================ */

function tokenize(text) {

    return normalizeText(text)
        .split(/\s+/)
        .filter(Boolean);
}


/* ============================================================
   3. WORD / PHRASE MATCHING
   ============================================================ */

function escapeRegex(value) {

    return value.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );
}


function wordExists(text, word) {

    const escaped =
        escapeRegex(word.toLowerCase());

    const regex =
        new RegExp(
            "\\b" + escaped + "\\b",
            "i"
        );

    return regex.test(text);
}


function findMatches(text, words) {

    return words.filter(word =>
        wordExists(text, word)
    );
}


/* ============================================================
   4. INDICATOR DATABASE
   ============================================================ */

const indicators = {


    /* ========================================================
       SERIOUS VIOLENCE / DANGER
       ======================================================== */

    dangerousSituation: {

        name: "Serious danger / violence",

        weight: 45,

        words: [

            "murder",
            "murdered",
            "murdering",
            "killer",
            "killing",
            "killed",
            "homicide",
            "manslaughter",
            "assassination",
            "assassinated",
            "fatal",
            "deadly",
            "death",

            "attack",
            "attacked",
            "attacking",
            "assault",
            "assaulted",
            "assaulting",

            "violence",
            "violent",

            "harm",
            "harmed",
            "harming",

            "hurt",
            "hurtful",
            "hurting",

            "injury",
            "injured",

            "beaten",
            "beating",

            "punched",
            "punching",

            "kicked",
            "kicking",

            "slapped",
            "slapping",

            "choked",
            "choking",

            "strangled",
            "strangling",

            "hostage",
            "hostages",

            "kidnap",
            "kidnapped",
            "kidnapping",

            "abduct",
            "abducted",
            "abduction",

            "trapped",
            "restrained",

            "weapon",
            "weapons",
            "armed",

            "threat",
            "threatened",
            "threatening",

            "danger",
            "dangerous"
        ]
    },


    /* ========================================================
       SEXUAL VIOLENCE
       ======================================================== */

    sexualViolence: {

        name: "Sexual violence / assault",

        weight: 55,

        words: [

            "rape",
            "raped",
            "raping",
            "rapist",

            "molest",
            "molested",
            "molesting",
            "molestation",

            "sexualassault",
            "assaulted",

            "nonconsensual",
            "unwanted",

            "coerced",
            "coercion",

            "forced",

            "consent",

            "abused",
            "abuse"
        ]
    },


    /* ========================================================
       PHYSICAL VIOLENCE
       ======================================================== */

    physicalViolence: {

        name: "Physical violence",

        weight: 45,

        words: [

            "violence",
            "violent",

            "attack",
            "attacked",
            "attacking",

            "assault",
            "assaulted",

            "hit",
            "hitting",

            "punch",
            "punched",
            "punching",

            "kick",
            "kicked",
            "kicking",

            "slap",
            "slapped",
            "slapping",

            "beat",
            "beaten",
            "beating",

            "choke",
            "choked",
            "choking",

            "strangle",
            "strangled",
            "strangling",

            "injury",
            "injured",

            "hurt",
            "hurting",

            "harm",
            "harmed",

            "weapon",
            "weapons",
            "armed"
        ]
    },


    /* ========================================================
       PERSONAL SAFETY
       ======================================================== */

    personalSafety: {

        name: "Personal safety concern",

        weight: 40,

        words: [

            "unsafe",
            "danger",
            "dangerous",

            "threat",
            "threatened",
            "threatening",
            "threats",

            "stalker",
            "stalked",
            "stalking",

            "followed",
            "following",

            "chased",
            "chasing",

            "pursued",
            "pursuing",

            "kidnap",
            "missing",
            "raging",
            "torture",
            "tortured",
            "kidnapped",
            "kidnapping",

            "abducted",
            "abduction",

            "hostage",

            "trapped",
            "restrained",

            "escape",
            "escaping",

            "protect",
            "protection",

            "rescue",

            "security"
        ]
    },


    /* ========================================================
       ABUSE
       ======================================================== */

    abuse: {

        name: "Possible abuse",

        weight: 42,

        words: [

            "abuse",
            "abused",
            "abusing",
            "abusive",
            "abuser",
            "cutted",
            "scar",
            "cut",
            "scared",
            "bomblast",
            

            "mistreatment",
            "mistreated",

            "neglect",
            "neglected",
            "neglecting",

            "controlling",
            "controlled",

            "forced",
            "forcing",

            "threatened",

            "hurt",
            "hurting",

            "beaten",
            "beating"
        ]
    },


    /* ========================================================
       HARASSMENT
       ======================================================== */

    harassment: {

        name: "Harassment / intimidation",

        weight: 35,

        words: [

            "harass",
            "harassed",
            "harassing",
            "harassment",

            "bully",
            "bullied",
            "bullying",

            "intimidate",
            "intimidated",
            "intimidation",

            "threat",
            "threatened",
            "threatening",

            "humiliate",
            "humiliated",
            "humiliation",

            "torment",
            "tormented",
            "tormenting",

            "teased",
            "teasing"
        ]
    },


    /* ========================================================
       CYBER HARASSMENT
       ======================================================== */

    cyberHarassment: {

        name: "Online / cyber harassment",

        weight: 32,

        words: [

            "cyberbullying",

            "doxxing",
            "doxed",
            "doxxed",

            "blackmail",
            "blackmailed",
            "blackmailing",

            "trolling",
            "trolled",
            "troll",

            "stalking",
            "stalker",

            "impersonation",
            "impersonated",

            "leaked",
            "leaking",

            "exposed",

            "threatened",
            "threatening"
        ]
    },


    /* ========================================================
       COERCION
       ======================================================== */

    coercion: {

        name: "Coercion / forced situation",

        weight: 40,

        words: [

            "forced",
            "forcing",
            "force",

            "coerce",
            "coerced",
            "coercion",

            "pressured",
            "pressuring",
            "pressure",

            "compelled",
            "compel",

            "threatened",

            "blackmail",
            "blackmailed",

            "manipulated",
            "manipulation",

            "controlled",
            "controlling",

            "unwilling",
            "unwanted",

            "consent"
        ]
    },


    /* ========================================================
       EXPLOITATION
       ======================================================== */

    exploitation: {

        name: "Possible exploitation",

        weight: 38,

        words: [

            "exploited",
            "exploitation",
            "exploit",
            "exploiting",

            "manipulated",
            "manipulation",

            "coerced",
            "coercion",

            "blackmail",
            "blackmailed",

            "extortion",
            "extorted",

            "deceived",
            "deception",

            "scam",
            "scammed",
            "scamming",

            "fraud",
            "fraudulent",

            "cheated",
            "cheating",

            "used"
        ]
    },


    /* ========================================================
       FINANCIAL EXPLOITATION
       ======================================================== */

    financialAbuse: {

        name: "Financial exploitation",

        weight: 30,

        words: [

            "financial",
            "finance",

            "money",
            "debt",
            "loan",

            "fraud",
            "fraudulent",

            "scam",
            "scammed",

            "stolen",
            "stealing",

            "theft",
            "robbed",
            "robbery",

            "extortion",
            "extorted",

            "blackmail",
            "blackmailed"
        ]
    },


    /* ========================================================
       FEAR / ANXIETY
       ======================================================== */

    fearAnxiety: {

        name: "Fear / anxiety",

        weight: 28,

        words: [

            "fear",
            "afraid",

            "scared",
            "scaring",

            "frightened",
            "frightening",

            "terrified",
            "terrifying",

            "fearful",

            "anxious",
            "anxiety",

            "panic",
            "panicked",
            "panicking",

            "worried",
            "worry",
            "worrying",

            "nervous",
            "nervousness",

            "uneasy",

            "alarmed",

            "insecure",
            "insecurity",

            "unsafe",

            "threatened"
        ]
    },


    /* ========================================================
       EMOTIONAL DISTRESS
       ======================================================== */

    emotionalDistress: {

        name: "Emotional distress",

        weight: 22,

        words: [

            "stress",
            "stressed",
            "stressful",

            "overwhelmed",
            "overwhelming",

            "distress",
            "distressed",

            "upset",

            "sad",
            "sadness",

            "cry",
            "crying",
            "cried",

            "tears",

            "exhausted",
            "exhaustion",

            "drained",

            "tired",
            "tiredness",

            "burnout",
            "burned",

            "frustrated",
            "frustration",

            "angry",
            "anger",

            "irritable",
            "irritated",

            "struggling",
            "suffering"
        ]
    },


    /* ========================================================
       ISOLATION
       ======================================================== */

    isolation: {

        name: "Social isolation",

        weight: 18,

        words: [

            "alone",
            "lonely",
            "loneliness",

            "isolated",
            "isolation",

            "withdrawn",
            "withdrawal",

            "disconnected",

            "excluded",
            "exclusion",

            "ignored",

            "rejected",
            "rejection",

            "friendless",

            "outsider",

            "nobody",
            "noone",

            "abandoned",
            "abandonment"
        ]
    },


    /* ========================================================
       HELPLESSNESS
       ======================================================== */

    helplessness: {

        name: "Helplessness",

        weight: 25,

        words: [

            "helpless",
            "helplessness",

            "hopeless",
            "hopelessness",

            "powerless",
            "powerlessness",

            "desperate",
            "desperation",

            "trapped",

            "stuck",

            "lost",

            "confused",

            "unable",

            "cannot",
            "can't",

            "cope",
            "coping",

            "overwhelmed"
        ]
    },


    /* ========================================================
       TRAUMA
       ======================================================== */

    trauma: {

        name: "Trauma-related distress",

        weight: 30,

        words: [

            "trauma",
            "traumatic",
            "traumatized",

            "flashback",
            "flashbacks",

            "nightmare",
            "nightmares",

            "triggered",
            "trigger",

            "shaking",
            "shaken",

            "trembling",

            "frozen",
            "freeze",

            "shock",
            "shocked",

            "panic",

            "distress"
        ]
    },


    /* ========================================================
       DISCRIMINATION
       ======================================================== */

    discrimination: {

        name: "Discrimination",

        weight: 25,

        words: [

            "discrimination",
            "discriminated",

            "prejudice",
            "prejudiced",

            "bias",
            "biased",

            "excluded",
            "exclusion",

            "stereotype",
            "stereotyped",

            "racism",
            "racist",

            "sexism",
            "sexist",

            "unfair",
            "unfairly"
        ]
    },


    /* ========================================================
       SUPPORT NEED
       ======================================================== */

    supportNeed: {

        name: "Support need",

        weight: 12,

        words: [

            "help",
            "support",
            "assistance",

            "counselling",
            "counseling",

            "therapist",
            "professional",

            "doctor",
            "medical",

            "legal",
            "lawyer",

            "police",

            "protection",

            "emergency",

            "rescue",

            "guidance",
            "advice"
        ]
    }
};


/* ============================================================
   5. URGENCY WORDS
   ============================================================ */

const urgencyWords = [

    "emergency",
    "urgent",
    "urgently",

    "immediate",
    "immediately",

    "danger",
    "dangerous",

    "unsafe",

    "threat",
    "threatened",
    "threatening",

    "attack",
    "attacked",

    "kidnap",
    "kidnapped",
    "kidnapping",

    "hostage",

    "trapped",

    "rescue",

    "protect",
    "protection",

    "help",

    "now",
    "currently",
    "ongoing"
];


/* ============================================================
   6. CURRENT-SITUATION WORDS
   ============================================================ */

const currentWords = [

    "now",
    "currently",
    "today",
    "tonight",

    "happening",
    "ongoing",

    "present",
    "recently",

    "just"
];


/* ============================================================
   7. REPEATED-SITUATION WORDS
   ============================================================ */

const repeatedWords = [

    "again",
    "repeatedly",
    "repeated",

    "constantly",
    "regularly",

    "everyday",
    "daily",

    "often",
    "always",

    "keeps",
    "continued",
    "continuously",

    "multiple"
];


/* ============================================================
   8. NEGATION WORDS
   ============================================================ */

const negationWords = [

    "not",
    "no",
    "never",
    "without",
    "didn't",
    "dont",
    "don't",
    "isn't",
    "isnt",
    "wasn't",
    "wasnt",
    "weren't",
    "werent"
];


/* ============================================================
   9. FIND WORD POSITION
   ============================================================ */

function getWordPositions(text, word) {

    const words =
        tokenize(text);

    const target =
        word.toLowerCase();

    const positions = [];

    words.forEach(
        (current, index) => {

            if (
                current === target
            ) {

                positions.push(index);

            }
        }
    );

    return positions;
}


/* ============================================================
   10. NEGATION CHECK
   ------------------------------------------------------------
   Prevents some obvious false positives such as:

   "I am not afraid"

   from being treated exactly like:

   "I am afraid"
   ============================================================ */

function isNegated(text, word) {

    const words =
        tokenize(text);

    const positions =
        getWordPositions(
            text,
            word
        );

    for (
        const position of positions
    ) {

        const start =
            Math.max(
                0,
                position - 3
            );

        const nearby =
            words.slice(
                start,
                position
            );

        if (
            nearby.some(
                w =>
                    negationWords.includes(
                        w
                    )
            )
        ) {

            return true;
        }
    }

    return false;
}


/* ============================================================
   11. ANALYZE INDICATORS
   ============================================================ */

function analyzeIndicators(text) {

    const detected = [];

    for (
        const key in indicators
    ) {

        const category =
            indicators[key];

        const matches =
            findMatches(
                text,
                category.words
            );


        /*
           Remove matches that are clearly negated.
        */

        const validMatches =
            matches.filter(
                word =>
                    !isNegated(
                        text,
                        word
                    )
            );


        if (
            validMatches.length > 0
        ) {

            detected.push({

                key,

                name:
                    category.name,

                weight:
                    category.weight,

                matches:
                    validMatches,

                matchCount:
                    validMatches.length
            });
        }
    }

    return detected;
}


/* ============================================================
   12. URGENCY ANALYSIS
   ============================================================ */

function analyzeUrgency(text) {

    const matches =
        findMatches(
            text,
            urgencyWords
        );


    const seriousUrgencyWords =
        [
            "emergency",
            "urgent",
            "urgently",
            "immediate",
            "immediately",
            "danger",
            "unsafe",
            "threatened",
            "hostage",
            "kidnapped",
            "trapped",
            "rescue"
        ];


    const seriousMatches =
        findMatches(
            text,
            seriousUrgencyWords
        );


    return {

        matches,

        seriousMatches,

        urgent:
            seriousMatches.length >= 1
    };
}


/* ============================================================
   13. CONTEXT ANALYSIS
   ============================================================ */

function analyzeContext(text) {

    const current =
        findMatches(
            text,
            currentWords
        );


    const repeated =
        findMatches(
            text,
            repeatedWords
        );


    return {

        current:
            current.length > 0,

        repeated:
            repeated.length > 0,

        currentMatches:
            current,

        repeatedMatches:
            repeated
    };
}


/* ============================================================
   14. SERIOUS INDICATOR CHECK
   ============================================================ */

function hasSeriousSafetyIndicator(
    detected
) {

    const seriousCategories = [

        "dangerousSituation",
        "sexualViolence",
        "physicalViolence",
        "personalSafety",
        "abuse",
        "coercion",
        "exploitation"
    ];


    return detected.some(
        item =>
            seriousCategories.includes(
                item.key
            )
    );
}


/* ============================================================
   15. CALCULATE SCORE
   ============================================================ */

function calculateScore(
    detected,
    urgency,
    context,
    text
) {

    let score = 0;


    /* --------------------------------------------------------
       Category weights
       -------------------------------------------------------- */

    detected.forEach(
        item => {

            score +=
                item.weight;

        }
    );


    /* --------------------------------------------------------
       Additional matches
       -------------------------------------------------------- */

    detected.forEach(
        item => {

            if (
                item.matchCount >= 2
            ) {

                score += 4;
            }

        }
    );


    /* --------------------------------------------------------
       Current situation
       -------------------------------------------------------- */

    if (
        context.current
    ) {

        score += 8;
    }


    /* --------------------------------------------------------
       Repeated situation
       -------------------------------------------------------- */

    if (
        context.repeated
    ) {

        score += 8;
    }


    /* --------------------------------------------------------
       Urgency
       -------------------------------------------------------- */

    if (
        urgency.urgent
    ) {

        score += 20;
    }


    /* --------------------------------------------------------
       Multiple categories
       -------------------------------------------------------- */

    if (
        detected.length >= 2
    ) {

        score += 8;
    }


    if (
        detected.length >= 4
    ) {

        score += 8;
    }


    if (
        detected.length >= 6
    ) {

        score += 6;
    }


    /* --------------------------------------------------------
       More context
       -------------------------------------------------------- */

    if (
        text.length >= 100
    ) {

        score += 3;
    }


    if (
        text.length >= 250
    ) {

        score += 3;
    }


    return Math.min(
        Math.round(score),
        100
    );
}


/* ============================================================
   16. RISK LEVEL
   ============================================================ */

function getRiskLevel(
    score,
    urgency,
    detected
) {

    const serious =
        hasSeriousSafetyIndicator(
            detected
        );


    /* --------------------------------------------------------
       Critical
       -------------------------------------------------------- */

    if (
        urgency.urgent &&
        serious
    ) {

        return {

            key: "critical",

            name:
                "Critical review required",

            description:
                "Serious safety indicators with urgent context were detected. Appropriate human support should be prioritized."
        };
    }


    /* --------------------------------------------------------
       High
       -------------------------------------------------------- */

    if (
        serious &&
        score >= 60
    ) {

        return {

            key: "high",

            name:
                "High vulnerability",

            description:
                "A serious safety or vulnerability indicator was detected. Trained human review is recommended."
        };
    }


    if (
        score >= 70
    ) {

        return {

            key: "high",

            name:
                "High vulnerability",

            description:
                "Multiple significant vulnerability indicators were detected. Trained human review is recommended."
        };
    }


    /* --------------------------------------------------------
       Moderate
       -------------------------------------------------------- */

    if (
        score >= 40
    ) {

        return {

            key: "moderate",

            name:
                "Moderate vulnerability",

            description:
                "Several vulnerability or distress indicators were detected. Appropriate supportive follow-up may be helpful."
        };
    }


    /* --------------------------------------------------------
       Low
       -------------------------------------------------------- */

    return {

        key: "low",

        name:
            "Low vulnerability",

        description:
            "Few significant vulnerability indicators were detected in this screening."
    };
}


/* ============================================================
   17. EVIDENCE CONFIDENCE
   ============================================================ */

function calculateConfidence(
    detected,
    urgency,
    context,
    text
) {

    /*
       This is NOT model accuracy.

       It represents how much evidence
       the prototype found.
    */

    let confidence = 35;


    confidence +=
        detected.length * 7;


    detected.forEach(
        item => {

            if (
                item.matchCount >= 2
            ) {

                confidence += 3;
            }

        }
    );


    if (
        urgency.urgent
    ) {

        confidence += 12;
    }


    if (
        context.current
    ) {

        confidence += 5;
    }


    if (
        context.repeated
    ) {

        confidence += 5;
    }


    if (
        text.length > 100
    ) {

        confidence += 5;
    }


    return Math.min(
        Math.round(confidence),
        95
    );
}


/* ============================================================
   18. RECOMMENDATIONS
   ============================================================ */

function generateRecommendations(
    level,
    detected,
    urgency
) {

    const recommendations = [];


    /* Moderate */

    if (
        level.key === "moderate"
    ) {

        recommendations.push(
            "Consider speaking with a trusted person."
        );

        recommendations.push(
            "Consider appropriate professional support."
        );
    }


    /* High */

    if (
        level.key === "high"
    ) {

        recommendations.push(
            "Prioritize review by a trained human."
        );

        recommendations.push(
            "Consider appropriate counselling, legal, medical, or safety support depending on the situation."
        );
    }


    /* Critical */

    if (
        level.key === "critical"
    ) {

        recommendations.push(
            "Prioritize immediate human review."
        );

        recommendations.push(
            "Use appropriate emergency or safety services when there is immediate danger."
        );
    }


    /* Legal support */

    const legalIndicators = [

        "sexualViolence",
        "physicalViolence",
        "harassment",
        "abuse",
        "coercion",
        "exploitation",
        "dangerousSituation"
    ];


    if (
        detected.some(
            item =>
                legalIndicators.includes(
                    item.key
                )
        )
    ) {

        recommendations.push(
            "Consider appropriate legal and support services."
        );
    }


    /* Medical support */

    if (
        detected.some(
            item =>
                item.key ===
                    "physicalViolence" ||

                item.key ===
                    "sexualViolence"
        )
    ) {

        recommendations.push(
            "Consider appropriate medical support."
        );
    }


    /* Emergency */

    if (
        urgency.urgent
    ) {

        recommendations.push(
            "If there is immediate danger, contact local emergency services or a trusted person nearby."
        );
    }


    /* Default */

    if (
        recommendations.length === 0
    ) {

        recommendations.push(
            "Continue monitoring the situation and seek appropriate support if circumstances change."
        );
    }


    return [
        ...new Set(
            recommendations
        )
    ];
}


/* ============================================================
   19. MAIN ASSESSMENT
   ============================================================ */

function performAssessment(text) {

    const normalized =
        normalizeText(text);


    const detected =
        analyzeIndicators(
            normalized
        );


    const urgency =
        analyzeUrgency(
            normalized
        );


    const context =
        analyzeContext(
            normalized
        );


    const score =
        calculateScore(
            detected,
            urgency,
            context,
            normalized
        );


    const level =
        getRiskLevel(
            score,
            urgency,
            detected
        );


    const confidence =
        calculateConfidence(
            detected,
            urgency,
            context,
            normalized
        );


    const recommendations =
        generateRecommendations(
            level,
            detected,
            urgency
        );


    return {

        score,

        confidence,

        level,

        urgent:
            urgency.urgent,

        safetyConcern:
            hasSeriousSafetyIndicator(
                detected
            ),

        indicators:
            detected.map(
                item =>
                    item.name
            ),

        categories:
            detected.map(
                item =>
                    item.key
            ),

        matchedWords:
            [
                ...new Set(
                    detected.flatMap(
                        item =>
                            item.matches
                    )
                )
            ],

        detailedIndicators:
            detected,

        urgencyMatches:
            urgency.matches,

        context,

        recommendations,

        text,

        time:
            new Date()
                .toLocaleString(),

        disclaimer:
            "AI-assisted screening only. This result is not a diagnosis. Results should be reviewed by an appropriately trained human when necessary."
    };
}


/* ============================================================
   20. SAVE RESULT
   ============================================================ */

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


/* ============================================================
   21. ANALYZE BUTTON
   ============================================================ */

async function analyze() {

    const input =
        document.getElementById(
            "textInput"
        );


    if (
        !input ||
        !input.value.trim()
    ) {

        alert(
            "Please enter a sample first."
        );

        return;
    }


    const text =
        input.value.trim();


    const button =
        document.getElementById(
            "analyzeBtn"
        );


    if (button) {

        button.disabled = true;

        button.textContent =
            "Analyzing...";
    }


    try {

        const result =
            performAssessment(
                text
            );


        latestResult =
            result;


        saveResult(
            result
        );


        setTimeout(
            () => {

                window.location.href =
                    "results.html";

            },
            700
        );


    } catch (error) {

        console.error(
            "Assessment error:",
            error
        );


        alert(
            "Unable to analyze the input."
        );


        if (button) {

            button.disabled =
                false;

            button.textContent =
                "Analyze with AI →";
        }
    }
}


/* ============================================================
   22. DYNAMIC BUTTON SUPPORT
   ============================================================ */

function attachAnalyzeButton() {

    const button =
        document.getElementById(
            "analyzeBtn"
        );


    if (!button) {

        return;
    }


    if (
        button.dataset
            .assessmentAttached ===
        "true"
    ) {

        return;
    }


    button.dataset
        .assessmentAttached =
        "true";


    button.addEventListener(
        "click",
        analyze
    );
}


/* ============================================================
   23. OBSERVE DYNAMIC HTML
   ============================================================ */

function startAssessmentObserver() {

    attachAnalyzeButton();


    const observer =
        new MutationObserver(
            () => {

                attachAnalyzeButton();

            }
        );


    observer.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );
}


/* ============================================================
   24. START
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        startAssessmentObserver();

    }
);