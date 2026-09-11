/*const recommendationSets = {

    low: [

        [
            "🤝",
            "Trusted Connection",
            "Encourage regular connection with a trusted person.",
            "Routine"
        ],

        [
            "🌿",
            "Wellbeing Support",
            "Suggest healthy routines, rest, movement and supportive activities.",
            "Self-care"
        ],

        [
            "📘",
            "Follow-up",
            "Check again if distress persists or increases.",
            "Monitor"
        ]

    ],


    moderate: [

        [
            "🤝",
            "Trusted Support",
            "Encourage a conversation with a trusted adult, teacher, family member or safe support person.",
            "Priority"
        ],

        [
            "🧠",
            "Counselling",
            "Consider speaking with a qualified counsellor or mental-health professional.",
            "Priority"
        ],

        [
            "📅",
            "Follow-up",
            "Create a follow-up plan instead of relying on a one-time AI result.",
            "Follow-up"
        ]

    ],


    high: [

        [
            "🧠",
            "Professional Review",
            "Route the situation to an appropriately trained professional for human assessment.",
            "High priority"
        ],

        [
            "👥",
            "Trusted-Person Support",
            "Involve a trusted adult or support person where appropriate.",
            "High priority"
        ],

        [
            "🚨",
            "Safety Escalation",
            "If there is immediate danger, use local emergency support and trusted human help.",
            "Urgent"
        ]

    ],


    critical: [

        [
            "🚨",
            "Immediate Human Review",
            "Do not rely on the AI score. Seek prompt review by an appropriately trained human.",
            "Urgent"
        ],

        [
            "👥",
            "Trusted Support",
            "Connect with a trusted adult or responsible support person as soon as possible.",
            "Urgent"
        ],

        [
            "🏥",
            "Emergency Pathway",
            "If someone is in immediate danger, contact local emergency services or an appropriate emergency facility.",
            "Urgent"
        ]

    ]

};


function renderRecommendations(level) {

    const grid =
        document.getElementById(
            "recommendationGrid"
        );


    const badge =
        document.getElementById(
            "recommendationBadge"
        );


    if (!grid) return;


    badge.textContent =
        level.name;


    grid.innerHTML =
        recommendationSets[level.key]
        .map(item => `

            <article class="rec-card">

                <div class="rec-icon">
                    ${item[0]}
                </div>

                <h3>
                    ${item[1]}
                </h3>

                <p>
                    ${item[2]}
                </p>

                <span>
                    ${item[3]}
                </span>

            </article>

        `)
        .join("");

}*/

/* =========================================================
   VULNERASENSE-AI
   CONDITION-BASED RECOMMENDATION ENGINE
   =========================================================

   IMPORTANT:
   This is a rule-based DEMONSTRATION / SCREENING engine.
   It is NOT a medical, legal or diagnostic system.

   Priority logic:
   1. riskScore >= 80  -> Emergency Support
   2. Otherwise detect the most relevant condition
   3. Select ONE Top Recommendation
   4. Keep other recommendations as secondary support options
   ========================================================= */


/* =========================================================
   GENERAL RECOMMENDATION SETS
   ========================================================= */

/* =========================================================
   VULNERASENSE-AI
   RECOMMENDATION ENGINE

   PURPOSE:
   - Detect the user's main condition from text.
   - Select ONE of the FIVE available recommendations
     as the TOP RECOMMENDATION.
   - Always display ALL FIVE recommendations below.

   IMPORTANT:
   The risk score does NOT automatically select the
   recommendation. The detected condition does.
   ========================================================= */


/* =========================================================
   FIVE AVAILABLE RECOMMENDATIONS
   ========================================================= */

const recommendationOptions = [

    {
        id: "counselling",

        icon: "🧠",

        title: "Counselling Support",

        description:
            "Consider speaking with a trusted counsellor or qualified professional for supportive guidance.",

        label: "SUPPORT"
    },


    {
        id: "trusted-person",

        icon: "🤝",

        title: "Trusted Person",

        description:
            "Consider reaching out to a trusted family member, friend, teacher or other safe support person.",

        label: "SUPPORT"
    },


    {
        id: "human-review",

        icon: "👤",

        title: "Human Review",

        description:
            "The situation can be reviewed by a trained human rather than relying only on an automated result.",

        label: "HUMAN REVIEW"
    },


    {
        id: "legal",

        icon: "⚖️",

        title: "Legal Assistance",

        description:
            "When the situation involves legal concerns, appropriate legal support may be considered.",

        label: "LEGAL AID"
    },


    {
        id: "medical",

        icon: "🏥",

        title: "Medical Assistance",

        description:
            "Where appropriate, a qualified healthcare professional can provide further assessment and support.",

        label: "MEDICAL"
    }

];


/* =========================================================
   CONDITION RULES
   =========================================================

   IMPORTANT:
   These rules ONLY choose between the five available
   recommendations above.

   No separate emergency or physical-safety card is
   generated.
   ========================================================= */

const conditionRules = [

    /* -----------------------------------------------------
       MEDICAL
       ----------------------------------------------------- */

    {
        id: "medical",

        recommendationId: "medical",

        priority: 90,

        keywords: [

            "doctor",
            "doctor appointment",
            "hospital",
            "clinic",
            "medical",
            "medical help",
            "medical attention",
            "health problem",
            "health issue",
            "health concern",
            "ill",
            "wound",
            "wounded",
            "sick",
            "injury",
            "injured",
            "bleeding",
            "severe pain",
            "body pain",
            "physical pain",
            "chest pain",
            "stomach pain",
            "headache",
            "dizzy",
            "dizziness",
            "faint",
            "fainted",
            "fainting",
            "weak",
            "died",
            "dead",
            "death",
            "weakness",
            "exhausted",
            "extremely tired",
            "low energy",
            "sleep deprived",
            "sleep deprivation",
            "medication",
            "medicine",
            "side effect",
            "overdose",
            "dose",
            "blood test",
            "surgery",
            "cancer",
            "pregnancy",
            "pregnant",
            "hallucinations",
            "acid attack"

        ]
    },


    /* -----------------------------------------------------
       LEGAL / REPORTING
       ----------------------------------------------------- */

    {
        id: "legal",

        recommendationId: "legal",

        priority: 85,

        keywords: [

            "legal",
            "rape",
            "raped",
            "tortured",
            "torturing",
            "torture",
            "molest",
            "molested",
            "law",
            "laws",
            "legal advice",
            "legal help",
            "lawyer",
            "police",
            "police report",
            "report to police",
            "file a report",
            "report harassment",
            "report abuse",
            "reporting",
            "rights",
            "bomblast",
            "acid attack",
            "chemical attack",
            "my rights",
            "civil rights",
            "court",
            "crime",
            "criminal",
            "criminal case",
            "complaint",
            "official complaint",
            "legal protection",
            "protective order",
            "blackmail",
            "stalking",
            "threat",
            "threatened",
            "blackmailed",
            "blackmailing",
            "blackmaile",
            "stolen",
            "stole",
            "theif",
            "theift",
            "attacked",
            "attack",
            "totured"
        ]
    },


    /* -----------------------------------------------------
       HUMAN REVIEW
       ----------------------------------------------------- */

    {
        id: "human-review",

        recommendationId: "human-review",

        priority: 80,

        keywords: [

            "harassment",
            "harassed",
            "harassing",
            "cyber harassment",
            "online harassment",
            "sexual harassment",
            "bullying",
            "bullied",
            "bully",
            "being bullied",
            "school bullying",
            "online bullying",
            "cyber bullying",
            "cyber threat",
            "online threat",
            "online abuse",
            "online stalking",
            "internet harassment",
            "social media harassment",
            "social media threat",
            "hacked account",
            "account hacked",
            "my account was hacked",
            "password stolen",
            "password compromised",
            "account compromised",
            "private information shared",
            "private information leaked",
            "privacy violation",
            "privacy breach",
            "data leaked",
            "personal information leaked",
            "threatening messages",
            "threatening message",
            "harassed online",
            "bullied online",
            "someone is stalking me online",
            "suicide",
            "suicided",
            "suicidal",
            "immediate danger",
            "immediate threat",
            "life threatening",
            "life-threatening",
            "dangerous situation",
            "in danger",
            "unsafe right now",
            "not safe right now",
            "someone is attacking",
            "someone attacked me",
            "violent attack",
            "violent situation",
            "serious threat",
            "death threat",
            "threatened with violence",
            "kidnapped",
            "kidnapping",
            "hostage",
            "threatened",
            "bomb threat",
            "explosive",
            "explosion",
            "shooter",
            "shooting",
            "weapon",
            "armed",
            "severe violence"
        ]
    },


    /* -----------------------------------------------------
       TRUSTED PERSON
       ----------------------------------------------------- */

    {
        id: "trusted-person",

        recommendationId: "trusted-person",

        priority: 75,

        keywords: [

            "physical violence",
            "physical abuse",
            "physically abused",
            "physically hurt",
            "physical harm",
            "hit me",
            "hitting me",
            "hit someone",
            "hitting someone",
            "hurt me",
            "hurting me",
            "hurt someone",
            "beaten",
            "beating",
            "beat me",
            "attacked",
            "attacking",
            "attack me",
            "assault",
            "assaulted",
            "violent",
            "violence",
            "fight",
            "fighting",
            "threatened",
            "threatening",
            "threatening me",
            "threatened me",
            "afraid of someone",
            "scared of someone",
            "unsafe at home",
            "unsafe around",
            "physical threat",
            "physical danger",

            "abuse",
            "abused",
            "abusive",
            "neglect",
            "neglected",
            "neglectful",
            "emotional abuse",
            "emotional blackmail",
            "controlled",
            "controlling",
            "control me",
            "forced",
            "forcing me",
            "intimidated",
            "intimidation",
            "punished",
            "unwelcome at home",
            "family violence",
            "domestic violence",
            "family abuse",
            "threatened at home",
            "afraid at home"
        ]
    },


    /* -----------------------------------------------------
       COUNSELLING / EMOTIONAL SUPPORT
       ----------------------------------------------------- */

    {
        id: "emotional",

        recommendationId: "counselling",

        priority: 70,

        keywords: [

            "anxiety",
            "anxious",
            "anxiousness",
            "fear",
            "fearing",
            "afraid",
            "scared",
            "terrified",
            "terror",
            "nervous",
            "nervousness",
            "worried",
            "worry",
            "worrying",
            "apprehensive",
            "hesitant",
            "uncertain",
            "uncertainty",
            "confused",
            "overwhelmed",
            "overwhelming",
            "frantic",
            "restless",
            "restlessness",
            "stressed",
            "stress",
            "stressed out",
            "panic",
            "panicked",
            "panicking",
            "vulnerable",
            "fearful",
            "uneasy",
            "uncomfortable",
            "under pressure",

            "sad",
            "sadness",
            "very sad",
            "feeling sad",
            "feel sad",
            "hopeless",
            "hopelessness",
            "helpless",
            "helplessness",
            "worthless",
            "miserable",
            "lonely",
            "loneliness",
            "alone",
            "isolated",
            "isolation",
            "empty",
            "emptiness",
            "depressed",
            "depression",
            "gloomy",
            "dismayed",
            "discouraged",
            "disheartened",
            "drained",
            "emotionally drained",
            "emotionally exhausted",
            "burdened",
            "neglected",
            "unloved",
            "unwelcome",
            "rejected",
            "rejection",
            "ashamed",
            "embarrassed",
            "pathetic",
            "terrible",
            "awful",
            "suffering",
            "distressed",
            "distress",
            "numb",
            "lost",
            "give up",
            "giving up",
            "feel like giving up",
            "emotionally hurt",
            "heartbroken",
            "brokenhearted",

            "anger",
            "angry",
            "irritated",
            "irritation",
            "frustrated",
            "frustration",
            "furious",
            "rage",
            "raging",
            "resentful",
            "resentment",
            "bitter",
            "bitterness",
            "hostile",
            "hostility",
            "agitated",
            "agitation",
            "cranky",
            "grumpy",
            "pissed",
            "annoyed",
            "annoying",
            "outraged",
            "outrage",
            "jealous",
            "jealousy",
            "envious",
            "envy",
            "wronged",
            "insulted",
            "disgusted",
            "spiteful",
            "vindictive",
            "conflict",
            "argument",
            "arguing"
        ]
    }

];


/* =========================================================
   TEXT NORMALIZATION
   ========================================================= */

function normalizeText(value) {

    return String(value || "")
        .toLowerCase()
        .replace(/[’']/g, "")
        .replace(/[^a-z0-9\s-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}


/* =========================================================
   SAFE KEYWORD MATCHING
   =========================================================

   Uses word boundaries so:

   "ill" does NOT accidentally match "still"

   ========================================================= */

function keywordMatches(text, keyword) {

    const normalizedKeyword =
        normalizeText(keyword);

    if (!normalizedKeyword) {
        return false;
    }

    const escaped =
        normalizedKeyword.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

    const pattern =
        new RegExp(
            "(^|\\s)" +
            escaped +
            "(?=\\s|$)",
            "i"
        );

    return pattern.test(text);

}


/* =========================================================
   DETECT CONDITIONS
   ========================================================= */

function detectConditions(problemText) {

    const text =
        normalizeText(problemText);

    const results = [];


    conditionRules.forEach(rule => {

        const matchedKeywords =
            rule.keywords.filter(keyword =>
                keywordMatches(
                    text,
                    keyword
                )
            );


        if (matchedKeywords.length > 0) {

            let score =
                matchedKeywords.length;


            /*
             * Multi-word phrases receive
             * a little additional weight.
             */

            matchedKeywords.forEach(keyword => {

                if (
                    normalizeText(keyword)
                        .includes(" ")
                ) {

                    score += 2;

                }

            });


            results.push({

                ...rule,

                matchedKeywords,

                score

            });

        }

    });


    return results.sort((a, b) => {

        if (b.priority !== a.priority) {
            return b.priority - a.priority;
        }

        return b.score - a.score;

    });

}


/* =========================================================
   FIND RECOMMENDATION
   ========================================================= */

function findRecommendationById(id) {

    return recommendationOptions.find(
        item => item.id === id
    );

}


/* =========================================================
   TOP RECOMMENDATION SELECTOR
   =========================================================

   IMPORTANT:

   The top recommendation is ALWAYS one of the
   FIVE available recommendations.

   Risk score does NOT override the condition.

   ========================================================= */

function getTopRecommendation(
    problemText,
    riskScore
) {

    const numericRisk =
        Number(riskScore) || 0;


    const detected =
        detectConditions(problemText);


    let selected;


    /*
     * If a condition was detected,
     * select the recommendation belonging
     * to the strongest matching condition.
     */

    if (detected.length > 0) {

        selected =
            findRecommendationById(
                detected[0].recommendationId
            );

    }


    /*
     * Default recommendation when
     * no specific condition is detected.
     */

    if (!selected) {

        selected =
            findRecommendationById(
                "trusted-person"
            );

    }


    return {

        topRecommendation:
            selected.title,

        recommendationId:
            selected.id,

        icon:
            selected.icon,

        description:
            selected.description,

        matchedCondition:
            detected.length > 0
                ? detected[0].id
                : "general",

        matchedKeywords:
            detected.length > 0
                ? detected[0].matchedKeywords
                : [],

        riskScore:
            numericRisk

    };

}


/* =========================================================
   RENDER TOP RECOMMENDATION
   ========================================================= */

function renderTopRecommendation(
    problemText,
    riskScore
) {

    const result =
        getTopRecommendation(
            problemText,
            riskScore
        );


    const panel =
        document.getElementById(
            "topRecommendationPanel"
        );


    if (!panel) {

        return result;

    }


    panel.innerHTML = `

        <div class="top-rec-header">

            <div>

                <span class="top-rec-label">
                    TOP RECOMMENDATION
                </span>

            </div>


            <span class="top-rec-score">

                Risk:
                ${result.riskScore}
                /100

            </span>

        </div>


        <div class="top-rec-content">

            <div class="top-rec-icon">

                ${result.icon}

            </div>


            <div class="top-rec-text">

                <h3>
                    ${escapeRecommendationHTML(
                        result.topRecommendation
                    )}
                </h3>


                <p>

                    ${escapeRecommendationHTML(
                        result.description
                    )}

                </p>


                ${
                    result.matchedKeywords.length > 0

                    ? `

                        <span class="top-rec-match">

                            Condition detected:
                            ${escapeRecommendationHTML(
                                result.matchedCondition
                            )}

                        </span>

                    `

                    : `

                        <span class="top-rec-match">

                            General support recommendation

                        </span>

                    `
                }

            </div>

        </div>

    `;


    return result;

}


/* =========================================================
   RENDER ALL FIVE RECOMMENDATIONS
   ========================================================= */

function renderRecommendations() {

    const grid =
        document.getElementById(
            "recommendationGrid"
        );


    if (!grid) {

        return;

    }


    /*
     * ALWAYS render all five.
     */

    grid.innerHTML =

        recommendationOptions.map(
            item => `

                <article class="rec-card">

                    <div class="rec-icon">

                        ${item.icon}

                    </div>


                    <h3>

                        ${escapeRecommendationHTML(
                            item.title
                        )}

                    </h3>


                    <p>

                        ${escapeRecommendationHTML(
                            item.description
                        )}

                    </p>


                    <span>

                        ${item.label}

                    </span>

                </article>

            `
        ).join("");

}


/* =========================================================
   COMPLETE UPDATE
   ========================================================= */

function updateRecommendationSystem(
    problemText,
    riskScore
) {

    const result =
        renderTopRecommendation(
            problemText,
            riskScore
        );


    /*
     * Always show exactly five cards.
     */

    renderRecommendations();


    /*
     * Make result available to
     * other JavaScript files.
     */

    window.vulneraSenseRecommendation =
        result;


    return result;

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeRecommendationHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value || "");

    return div.innerHTML;

}


/* =========================================================
   GLOBAL API
   ========================================================= */

window.getTopRecommendation =
    getTopRecommendation;

window.detectConditions =
    detectConditions;

window.renderTopRecommendation =
    renderTopRecommendation;

window.renderRecommendations =
    renderRecommendations;

window.updateRecommendationSystem =
    updateRecommendationSystem;


/* =========================================================
   ASSESSMENT EVENT LISTENER
   ========================================================= */

document.addEventListener(
    "vulnerasense:analysisComplete",
    event => {

        const detail =
            event.detail || {};


        updateRecommendationSystem(

            detail.text ||
            detail.problemText ||
            detail.input ||
            "",

            detail.riskScore ??
            detail.score ??
            0

        );

    }
);


/* =========================================================
   TEST FUNCTION
   ========================================================= */

window.testVulneraSenseRecommendation =
    function (
        text,
        riskScore = 0
    ) {

        const result =
            getTopRecommendation(
                text,
                riskScore
            );


        console.log(
            "VulneraSense Recommendation:",
            result
        );


        return result;

    };