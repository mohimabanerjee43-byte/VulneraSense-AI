/* =========================================================
   VULNERASENSE-AI
   Assessment & Vulnerability Detection Engine
   =========================================================

   IMPORTANT:
   This is a rule-based DEMONSTRATION / SCREENING engine.
   It is NOT a medical or legal diagnostic system.

   Risk score  = prototype screening score (0-100)
   Confidence  = evidence coverage estimate, NOT accuracy
   ========================================================= */

let latestScore = 0;


/* =========================================================
   1. INDICATOR DATABASE
   ========================================================= */

const indicators = {

    /* -----------------------------------------------------
       GENERAL DANGEROUS SITUATIONS
       ----------------------------------------------------- */

    dangerousSituations: {
        weight: 48,
        serious: true,

        words: [
            "danger",
            "suicided",
            "suicide",
            "dangerous",
            "unsafe",
            "emergency",
            "urgent",
            "threat",
            "threatened",
            "threatening",

            "attack",
            "attacked",
            "attacking",
            "violence",
            "violent",

            "terror",
            "terrorized",

            "hostage",
            "trapped",
            "restrained",

            "kidnap",
            "kidnapped",
            "kidnapping",

            "abduct",
            "abducted",
            "abduction",

            "chased",
            "pursued",
            "stalked",
            "torturing",
            "tortured",
            "torture",
            "stalking",
            "stalker",

            "murder",
            "murdered",
            "murdering",
            "killer",
            "killing",
            "kill",
            "killed",
            "homicide",
            "manslaughter",
            "assassination",
            "assassinated",
            "execution",
            "executed",
            "fatal",
            "deadly",
            "death",
            "died",

            "assault",
            "assaulted",
            "assaulting",
            "beaten",
            "beating",
            "hit",
            "hitting",
            "punched",
            "punching",
            "kicked",
            "kicking",

            "injured",
            "injury",
            "hurt",
            "hurting",
            "harm",
            "harmed",
            "wounded",
            "wound",

            "burned",
            "burning",

            "weapon",
            "weapons",
            "armed",
            "gun",
            "guns",
            "rifle",
            "pistol",
            "knife",
            "knives",
            "blade",
            "blades",
            "firearm",

            "explosive",
            "explosives",
            "bomb",
            
            "bombing",
            "bombed",
            "blast",
            "blasted",
            "explosion",
            "exploded",

            "fire",
            "arson",

            "poison",
            "poisoned",
            "poisoning"
        ]
    },


    /* -----------------------------------------------------
       PHYSICAL VIOLENCE
       ----------------------------------------------------- */

    physicalViolence: {
        weight: 44,
        serious: true,

        words: [
            "murder",
            "murdered",
            "murdering",
            "kill",
            "killed",
            "killing",
            "killer",
            "homicide",

            "attack",
            "attacked",
            "attacking",

            "assault",
            "assaulted",
            "assaulting",

            "violence",
            "violent",

            "beaten",
            "beating",
            "hit",
            "hitting",
            "punched",
            "punching",
            "kicked",
            "kicking",

            "injured",
            "injury",
            "wounded",
            "wound",

            "hurt",
            "hurting",
            "harm",
            "harmed",

            "weapon",
            "weapons",
            "armed",
            "gun",
            "guns",
            "knife",
            "knives",
            "blade",
            "firearm"
        ]
    },


    /* -----------------------------------------------------
       EXPLOSIVE / BOMB INCIDENTS
       ----------------------------------------------------- */

    explosiveIncident: {
        weight: 48,
        serious: true,

        words: [
            "bomb",
            "bombing",
            "bombed",
            "bomb blast",
            "bombblasted",
            "bombblast",
            "bomblast",
            "blast",
            "blasted",
            "explosion",
            "exploded",
            "explosive",
            "explosives",
            "detonation",
            "terror attack",
            "bomb attack"
        ]
    },


    /* -----------------------------------------------------
       CHEMICAL / ACID ATTACK
       ----------------------------------------------------- */

    chemicalAttack: {
        weight: 48,
        serious: true,

        words: [
            "acid attack",
            "acid attacked",
            "acid assault",
            "chemical attack",
            "chemical assault",
            "chemical violence",
            "toxic attack",
            "poisoned",
            "poisoning",
            "poison",
            "chemical exposure",
            "toxic substance"
        ]
    },


    /* -----------------------------------------------------
       SEXUAL VIOLENCE
       ----------------------------------------------------- */

    sexualViolence: {
        weight: 48,
        serious: true,

        words: [
            "rape",
            "raped",
            "rapist",
            "sexual assault",
            "sexually assaulted",
            "sexual violence",
            "sexual abuse",
            "molest",
            "molested",
            "molestation",
            "nonconsensual",
            "without consent"
        ]
    },


    /* -----------------------------------------------------
       ROBBERY / THEFT
       ----------------------------------------------------- */

    robberyTheft: {
        weight: 35,
        serious: true,

        words: [
            "robbery",
            "robbed",
            "rob",
            "stolen",
            "stole",
            "stealing",
            "theft",
            "thief",
            "burglary",
            "burglar",
            "break in",
            "break-in",
            "trespassing",
            "snatched",
            "snatching",
            "looted",
            "looting",
            "mugged",
            "mugging",
            "pickpocket",
            "pickpocketed",
            "extortion"
        ]
    },


    /* -----------------------------------------------------
       PERSONAL SAFETY
       ----------------------------------------------------- */

    personalSafety: {
        weight: 34,
        serious: true,

        words: [
            "danger",
            "dangerous",
            "unsafe",
            "threat",
            "threatened",
            "threatening",

            "intimidated",
            "intimidation",

            "followed",
            "following",

            "stalked",
            "stalking",
            "stalker",

            "kidnap",
            "kidnapped",
            "kidnapping",

            "abducted",
            "abduction",

            "trapped",
            "cornered",
            "hostage",

            "protection",
            "security",

            "fear",
            "afraid",
            "scared"
        ]
    },


    /* -----------------------------------------------------
       ABUSE
       ----------------------------------------------------- */

    abuse: {
        weight: 38,
        serious: true,

        words: [
            "abuse",
            "abused",
            "abusing",
            "abusive",
            "abuser",

            "violence",
            "violent",

            "mistreatment",
            "mistreated",

            "neglect",
            "neglected",

            "controlling",
            "controlled",

            "threatened",

            "forced",
            "forcing",

            "hurt",
            "hurting",

            "beaten",
            "beating",

            "exploited",
            "exploitation"
        ]
    },


    /* -----------------------------------------------------
       HARASSMENT / BULLYING
       ----------------------------------------------------- */

    harassment: {
        weight: 28,
        serious: false,

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
            "tormenting"
        ]
    },


    /* -----------------------------------------------------
       CYBER HARASSMENT
       ----------------------------------------------------- */

    cyberHarassment: {
        weight: 26,
        serious: false,

        words: [
            "cyberbullying",
            "cyber harassment",

            "doxxing",
            "doxed",
            "doxxed",

            "blackmail",
            "blackmailed",
            "blackmailing",

            "online threat",
            "online harassment",

            "trolling",
            "troll",

            "stalking",
            "stalked",

            "impersonation",
            "impersonated",

            "leaked",
            "leaking",
            "exposed"
        ]
    },


    /* -----------------------------------------------------
       COERCION
       ----------------------------------------------------- */

    coercion: {
        weight: 34,
        serious: true,

        words: [
            "forced",
            "forcing",
            "force",

            "coerce",
            "coerced",
            "coercion",

            "pressured",
            "pressure",
            "pressuring",

            "compelled",
            "compel",

            "threatened",

            "blackmail",
            "blackmailed",

            "manipulated",
            "manipulation",

            "controlled",

            "unwilling",
            "unwanted",

            "against my will",
            "no choice"
        ]
    },


    /* -----------------------------------------------------
       EXPLOITATION
       ----------------------------------------------------- */

    exploitation: {
        weight: 34,
        serious: true,

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

            "fraud",
            "fraudulent",

            "scammed",
            "scam",

            "cheated",
            "used",

            "taking advantage"
        ]
    },


    /* -----------------------------------------------------
       FINANCIAL ABUSE
       ----------------------------------------------------- */

    financialAbuse: {
        weight: 20,
        serious: false,

        words: [
            "financial abuse",
            "money",
            "financial",
            "finance",
            "debt",
            "loan",

            "fraud",
            "scam",
            "scammed",
            "cheated",

            "stolen",
            "stealing",
            "theft",
            "robbed",
            "robbery",

            "blackmail",
            "extortion",
            "extorted"
        ]
    },


    /* -----------------------------------------------------
       FEAR / ANXIETY
       ----------------------------------------------------- */

    fearAnxiety: {
        weight: 24,
        serious: false,

        words: [
            "fear",
            "afraid",
            "scared",
            "frightened",
            "terrified",
            "terrifying",

            "anxious",
            "anxiety",

            "panic",
            "panicking",

            "worried",
            "worry",
            "worrying",

            "nervous",
            "uneasy",
            "alarmed",
            "frantic",
            "disturbed",
            "insecure",
            "vulnerable",

            "on edge",
            "apprehensive",
            "hesitant",
            "uncertain",
            "doubt",
            "skeptical",

            "restless",
            "agitated",
            "shaken"
        ]
    },


    /* -----------------------------------------------------
       EMOTIONAL DISTRESS
       ----------------------------------------------------- */

    emotionalDistress: {
        weight: 18,
        serious: false,

        words: [
            "stressed",
            "stress",
            "stressful",

            "overwhelmed",
            "overwhelming",

            "distressed",
            "distress",

            "upset",
            "sad",
            "sadness",

            "crying",
            "cried",
            "tears",

            "exhausted",
            "exhaustion",
            "drained",
            "tired",

            "burnout",
            "burned out",

            "frustrated",
            "frustration",

            "angry",
            "anger",
            "irritable",
            "irritated",

            "struggling",
            "suffering",
            "miserable",

            "humiliated",
            "burdened",
            "defeated",
            "discouraged",
            "listless",

            "pathetic",
            "worthless",
            "neglected",
            "gloomy",

            "numb",
            "empty",
            "unloved",
            "unwelcome",

            "dissatisfied",
            "disappointed",

            "down",
            "low",
            "dull",
            "lethargic",
            "sleep deprived",
            "groggy",

            "terrible",
            "crappy",
            "pain"
        ]
    },


    /* -----------------------------------------------------
       ISOLATION
       ----------------------------------------------------- */

    isolation: {
        weight: 16,
        serious: false,

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
            "ignored",

            "rejected",
            "rejection",

            "friendless",
            "outsider",

            "nobody",
            "no one",

            "abandoned",
            "abandonment"
        ]
    },


    /* -----------------------------------------------------
       HELPLESSNESS
       ----------------------------------------------------- */

    helplessness: {
        weight: 23,
        serious: false,

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

            "cannot",
            "can't",

            "unable",

            "cope",
            "coping",

            "overwhelmed"
        ]
    },


    /* -----------------------------------------------------
       TRAUMA
       ----------------------------------------------------- */

    trauma: {
        weight: 26,
        serious: false,

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

            "distress",
            "fear",
            "panic",

            "shaking",
            "trembling",

            "freeze",
            "frozen",

            "shock",
            "shocked"
        ]
    },


    /* -----------------------------------------------------
       DISCRIMINATION
       ----------------------------------------------------- */

    discrimination: {
        weight: 22,
        serious: false,

        words: [
            "discriminated",
            "discrimination",

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

            "humiliated",

            "unfair",
            "unfairly"
        ]
    },


    /* -----------------------------------------------------
       WORKPLACE / EDUCATION PROBLEMS
       ----------------------------------------------------- */

    workplaceEducation: {
        weight: 18,
        serious: false,

        words: [
            "workplace",
            "office",
            "boss",
            "manager",

            "teacher",
            "professor",

            "college",
            "school",

            "classmate",
            "coworker",
            "colleague",

            "employee",
            "employer",

            "supervisor",
            "senior",
            "junior",

            "bullying",
            "harassment",
            "discrimination",

            "threatened",
            "pressured",
            "intimidated"
        ]
    },


    /* -----------------------------------------------------
       SUPPORT NEED
       ----------------------------------------------------- */

    supportNeed: {
        weight: 8,
        serious: false,

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


/* =========================================================
   2. URGENCY WORDS
   ========================================================= */

const urgencyWords = [

    "emergency",
    "urgent",
    "urgently",
    "immediately",
    "immediate",

    "now",
    "currently",
    "today",

    "danger",
    "dangerous",
    "unsafe",

    "threat",
    "threatened",
    "attacking",
    "attack",

    "kidnap",
    "kidnapped",

    "hostage",
    "trapped",

    "rescue",
    "help",
    "protection",

    "bomb",
    "blast",
    "explosion",
    "explosive",

    "murder",
    "killed",
    "killing",

    "weapon",

    "robbery",
    "robbed",

    "acid attack",
    "chemical attack"
];


/* =========================================================
   3. CURRENT / PAST CONTEXT
   ========================================================= */

const currentContextWords = [

    "now",
    "currently",
    "today",
    "right now",
    "at present",

    "still",
    "ongoing",

    "happening",
    "happening now"
];


const pastContextWords = [

    "yesterday",
    "last week",
    "last month",

    "years ago",
    "long ago",

    "when i was",

    "in the past",
    "previously",
    "formerly",

    "once",
    "history",
    "historical"
];


/* =========================================================
   4. NEGATION WORDS
   ========================================================= */

const negationWords = [

    "not",
    "no",
    "never",
    "without",

    "isn't",
    "wasn't",
    "weren't",

    "didn't",
    "don't",
    "doesn't",

    "cannot",
    "can't"
];


/* =========================================================
   5. EMOTION WORDS
   ========================================================= */

const emotionWords = {

    sadness: [

        "sad",
        "sadness",
        "hopeless",
        "hopelessness",

        "burdened",
        "pathetic",
        "suffering",
        "distressed",
        "overwhelmed",

        "defeated",
        "discouraged",
        "listless",
        "rejected",
        "miserable",
        "worthless",

        "isolated",
        "lonely",
        "neglected",
        "gloomy",

        "drained",
        "helpless",
        "numb",
        "empty",

        "unloved",
        "unwelcome",

        "dissatisfied",
        "disappointed",

        "down",
        "low",
        "dull",
        "lethargic",
        "groggy",

        "terrible",
        "hurt",
        "pain"
    ],


    fear: [

        "fear",
        "afraid",
        "scared",
        "unsafe",
        "threatened",

        "intimidated",
        "apprehensive",
        "nervous",
        "uneasy",

        "frightened",
        "terrified",

        "panicking",
        "panic",

        "anxious",
        "anxiety",

        "restless",
        "agitated",
        "shaken",

        "vulnerable",
        "hesitant",
        "uncertain",
        "doubt",
        "skeptical",

        "alarmed",
        "frantic",

        "worried",
        "worry",

        "disturbed",
        "insecure",
        "on edge"
    ],


    anger: [

        "angry",
        "anger",
        "grouchy",
        "irritated",
        "bitter",

        "furious",
        "frustrated",
        "appalled",
        "resentful",

        "hostile",
        "disgusted",
        "cranky",
        "pissed",
        "annoyed",

        "irritable",
        "outraged",
        "insulted",

        "jealous",
        "envious",

        "vindictive",
        "spiteful",
        "resentment",

        "rage",
        "ballistic",
        "fighting"
    ],


    joy: [

        "happy",
        "excited",
        "content",
        "calm",
        "relaxed",

        "grateful",
        "hopeful",
        "inspired",
        "energetic",

        "confident",
        "comfortable",
        "blessed",
        "lucky",
        "thankful",

        "honored",
        "peace",
        "tranquil",
        "strong",

        "positive",
        "fulfilled",
        "secure",
        "reassured",
        "glad"
    ],


    love: [

        "love",
        "loving",
        "supportive",
        "caring",

        "accepted",
        "acceptance",

        "friend",
        "family",

        "compassion",
        "safe",
        "trust",
        "loyal",

        "kindness",
        "valued",
        "appreciated",

        "belonging",
        "protected",

        "comfort",
        "encouragement"
    ],


    surprise: [

        "surprised",
        "shocked",
        "stunned",
        "dazed",
        "amazed",

        "unexpected",
        "curious",
        "puzzling",
        "funny",
        "giddy",

        "wonder",
        "astonished",
        "impressed"
    ]
};


/* =========================================================
   6. TEXT NORMALIZATION
   ========================================================= */

function normalizeText(text) {

    return text
        .toLowerCase()
        .replace(/[^\w\s'-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


/* =========================================================
   7. SAFE WORD / PHRASE MATCHING
   ========================================================= */

function escapeRegex(value) {

    return value.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );
}


function findMatches(text, words) {

    const matches = [];


    for (const word of words) {

        const cleanWord =
            word.toLowerCase().trim();


        if (!cleanWord) continue;


        const pattern =
            cleanWord.includes(" ")

                ? new RegExp(
                    `(^|\\s)${escapeRegex(cleanWord)}(?=\\s|$)`,
                    "i"
                )

                : new RegExp(
                    `\\b${escapeRegex(cleanWord)}\\b`,
                    "i"
                );


        const match =
            pattern.exec(text);


        if (match) {

            matches.push(cleanWord);
        }
    }


    return [
        ...new Set(matches)
    ];
}


/* =========================================================
   8. NEGATION DETECTION
   ========================================================= */

function isNegated(text, word) {

    const index =
        text.indexOf(word);


    if (index === -1) {
        return false;
    }


    const before =
        text.substring(
            Math.max(0, index - 50),
            index
        );


    const tokens =
        before
            .split(/\s+/)
            .slice(-5);


    return tokens.some(
        token =>
            negationWords.includes(token)
    );
}


/* =========================================================
   9. DETECT INDICATORS
   ========================================================= */

function detectIndicators(text) {

    const normalized =
        normalizeText(text);


    const detected = [];


    for (
        const [key, data]
        of Object.entries(indicators)
    ) {

        const matches =
            findMatches(
                normalized,
                data.words
            );


        const validMatches =
            matches.filter(
                word =>
                    !isNegated(
                        normalized,
                        word
                    )
            );


        if (validMatches.length > 0) {

            detected.push({

                key,

                matches:
                    validMatches,

                weight:
                    data.weight,

                serious:
                    data.serious
            });
        }
    }


    return detected;
}


/* =========================================================
   10. URGENCY DETECTION
   ========================================================= */

function detectUrgency(text) {

    const normalized =
        normalizeText(text);


    return findMatches(
        normalized,
        urgencyWords
    );
}


/* =========================================================
   11. CONTEXT DETECTION
   ========================================================= */

function detectContext(text) {

    const normalized =
        normalizeText(text);


    const current =
        findMatches(
            normalized,
            currentContextWords
        );


    const past =
        findMatches(
            normalized,
            pastContextWords
        );


    return {

        current,

        past,

        isCurrent:
            current.length > 0,

        isPast:
            past.length > 0
    };
}


/* =========================================================
   12. EMOTION ANALYSIS
   ========================================================= */

function detectEmotion(text) {

    const normalized =
        normalizeText(text);


    const scores = {};


    for (
        const [emotion, words]
        of Object.entries(emotionWords)
    ) {

        const matches =
            findMatches(
                normalized,
                words
            );


        scores[emotion] =
            matches.length;
    }


    let dominantEmotion =
        "neutral";


    let highestScore = 0;


    for (
        const [emotion, score]
        of Object.entries(scores)
    ) {

        if (score > highestScore) {

            highestScore =
                score;

            dominantEmotion =
                emotion;
        }
    }


    return {

        emotion:
            dominantEmotion,

        emotionScores:
            scores
    };
}


/* =========================================================
   13. SERIOUS SAFETY CHECK
   ========================================================= */

function hasSeriousSafetyIndicator(
    detected
) {

    return detected.some(
        item =>
            item.serious === true
    );
}


/* =========================================================
   14. CONDITION-SPECIFIC RECOMMENDATIONS
   ========================================================= */

function generateRecommendations(
    detected,
    score,
    urgent
) {

    const recommendations = [];


    const categories =
        detected.map(
            item => item.key
        );


    /* -----------------------------------------------------
       DANGEROUS SITUATIONS
       ----------------------------------------------------- */

    if (
        categories.includes(
            "dangerousSituations"
        )
    ) {

        recommendations.push({

            type: "Immediate Safety",

            title:
                "Immediate safety review",

            text:
                "Prioritize personal safety and involve a trusted person or appropriate authority."
        });
    }


    /* -----------------------------------------------------
       PHYSICAL VIOLENCE
       ----------------------------------------------------- */

    if (
        categories.includes(
            "physicalViolence"
        )
    ) {

        recommendations.push({

            type: "Physical Safety",

            title:
                "Physical safety support",

            text:
                "Prioritize safety and seek appropriate medical, trusted-person, or authority support when needed."
        });
    }


    /* -----------------------------------------------------
       PERSONAL SAFETY
       ----------------------------------------------------- */

    if (
        categories.includes(
            "personalSafety"
        )
    ) {

        recommendations.push({

            type: "Personal Safety",

            title:
                "Personal safety assistance",

            text:
                "Talk to a trusted person and consider appropriate protection or authority support."
        });
    }


    /* -----------------------------------------------------
       EXPLOSIVE INCIDENT
       ----------------------------------------------------- */

    if (
        categories.includes(
            "explosiveIncident"
        )
    ) {

        recommendations.push({

            type: "Emergency",

            title:
                "Emergency safety response",

            text:
                "Move toward a safe environment when possible and seek immediate human or emergency assistance."
        });
    }


    /* -----------------------------------------------------
       CHEMICAL ATTACK
       ----------------------------------------------------- */

    if (
        categories.includes(
            "chemicalAttack"
        )
    ) {

        recommendations.push({

            type: "Emergency",

            title:
                "Medical and safety assistance",

            text:
                "Prioritize safety and seek appropriate emergency or medical assistance."
        });
    }


    /* -----------------------------------------------------
       SEXUAL VIOLENCE
       ----------------------------------------------------- */

    if (
        categories.includes(
            "sexualViolence"
        )
    ) {

        recommendations.push({

            type: "Specialized Support",

            title:
                "Trauma-informed support",

            text:
                "Connect with a trusted person and qualified support professional. Appropriate medical or legal support may also be considered."
        });
    }


    /* -----------------------------------------------------
       ABUSE
       ----------------------------------------------------- */

    if (
        categories.includes(
            "abuse"
        )
    ) {

        recommendations.push({

            type: "Protection",

            title:
                "Protection and support",

            text:
                "Talk with a trusted person or qualified professional and prioritize personal safety."
        });
    }


    /* -----------------------------------------------------
       COERCION
       ----------------------------------------------------- */

    if (
        categories.includes(
            "coercion"
        )
    ) {

        recommendations.push({

            type: "Support",

            title:
                "Coercion support",

            text:
                "Seek support from a trusted person or qualified professional rather than handling the situation alone."
        });
    }


    /* -----------------------------------------------------
       EXPLOITATION
       ----------------------------------------------------- */

    if (
        categories.includes(
            "exploitation"
        )
    ) {

        recommendations.push({

            type: "Legal Support",

            title:
                "Legal and protective support",

            text:
                "Consider appropriate legal, financial, or professional assistance depending on the situation."
        });
    }


    /* -----------------------------------------------------
       ROBBERY / THEFT
       ----------------------------------------------------- */

    if (
        categories.includes(
            "robberyTheft"
        )
    ) {

        recommendations.push({

            type: "Legal / Safety",

            title:
                "Incident and safety support",

            text:
                "Prioritize safety and consider reporting the incident to the appropriate authority."
        });
    }


    /* -----------------------------------------------------
       FINANCIAL ABUSE
       ----------------------------------------------------- */

    if (
        categories.includes(
            "financialAbuse"
        )
    ) {

        recommendations.push({

            type: "Financial Support",

            title:
                "Financial assistance",

            text:
                "Consider appropriate financial, institutional, or legal assistance for affected accounts or transactions."
        });
    }


    /* -----------------------------------------------------
       HARASSMENT
       ----------------------------------------------------- */

    if (
        categories.includes(
            "harassment"
        )
    ) {

        recommendations.push({

            type: "Harassment Support",

            title:
                "Trusted-person and institutional support",

            text:
                "Talk with a trusted person and consider the appropriate school, workplace, or institutional support process."
        });
    }


    /* -----------------------------------------------------
       CYBER HARASSMENT
       ----------------------------------------------------- */

    if (
        categories.includes(
            "cyberHarassment"
        )
    ) {

        recommendations.push({

            type: "Digital Safety",

            title:
                "Digital safety support",

            text:
                "Review account security and privacy settings and use appropriate platform reporting tools."
        });
    }


    /* -----------------------------------------------------
       FEAR / ANXIETY
       ----------------------------------------------------- */

    if (
        categories.includes(
            "fearAnxiety"
        )
    ) {

        recommendations.push({

            type: "Emotional Support",

            title:
                "Fear and anxiety support",

            text:
                "Talk with a trusted person and consider professional support if the distress continues."
        });
    }


    /* -----------------------------------------------------
       EMOTIONAL DISTRESS
       ----------------------------------------------------- */

    if (
        categories.includes(
            "emotionalDistress"
        )
    ) {

        recommendations.push({

            type: "Mental Wellbeing",

            title:
                "Emotional wellbeing support",

            text:
                "Talk with someone you trust and consider professional mental-health support when appropriate."
        });
    }


    /* -----------------------------------------------------
       ISOLATION
       ----------------------------------------------------- */

    if (
        categories.includes(
            "isolation"
        )
    ) {

        recommendations.push({

            type: "Social Support",

            title:
                "Social connection",

            text:
                "Reconnect with a trusted friend, family member, teacher, mentor, or other supportive person."
        });
    }


    /* -----------------------------------------------------
       HELPLESSNESS
       ----------------------------------------------------- */

    if (
        categories.includes(
            "helplessness"
        )
    ) {

        recommendations.push({

            type: "Support",

            title:
                "Supportive human connection",

            text:
                "Talk with a trusted person and consider professional support if these feelings continue."
        });
    }


    /* -----------------------------------------------------
       TRAUMA
       ----------------------------------------------------- */

    if (
        categories.includes(
            "trauma"
        )
    ) {

        recommendations.push({

            type: "Trauma Support",

            title:
                "Trauma-informed support",

            text:
                "Consider speaking with a qualified professional experienced in trauma-related support."
        });
    }


    /* -----------------------------------------------------
       DISCRIMINATION
       ----------------------------------------------------- */

    if (
        categories.includes(
            "discrimination"
        )
    ) {

        recommendations.push({

            type: "Institutional Support",

            title:
                "Grievance and support options",

            text:
                "Consider speaking with a trusted person and using the appropriate institutional grievance or support process."
        });
    }


    /* -----------------------------------------------------
       WORKPLACE / EDUCATION
       ----------------------------------------------------- */

    if (
        categories.includes(
            "workplaceEducation"
        )
    ) {

        recommendations.push({

            type: "Institutional Support",

            title:
                "School or workplace support",

            text:
                "Consider speaking with a teacher, mentor, supervisor, counsellor, or appropriate institutional authority."
        });
    }


    /* -----------------------------------------------------
       SUPPORT NEED
       ----------------------------------------------------- */

    if (
        categories.includes(
            "supportNeed"
        )
    ) {

        recommendations.push({

            type: "General Support",

            title:
                "Connect with appropriate support",

            text:
                "Choose support from a trusted person or qualified professional based on the concern identified."
        });
    }


    /* =====================================================
       URGENT OVERRIDE
       ===================================================== */

    if (urgent) {

        recommendations.unshift({

            type: "URGENT",

            title:
                "Prioritize immediate safety",

            text:
                "This screening contains serious and urgency-related signals. Human review should take priority."
        });
    }


    /* =====================================================
       HIGH SCORE
       ===================================================== */

    if (score >= 65) {

        recommendations.push({

            type: "Human Review",

            title:
                "Human review recommended",

            text:
                "A trained human should review this screening result before important decisions are made."
        });
    }


    /* =====================================================
       FALLBACK
       ===================================================== */

    if (
        recommendations.length === 0
    ) {

        recommendations.push({

            type: "General",

            title:
                "Continue wellbeing monitoring",

            text:
                "Continue monitoring the situation and seek support if concerns increase."
        });
    }


    /* =====================================================
       REMOVE DUPLICATE TITLES
       ===================================================== */

    const unique = [];

    const seen =
        new Set();


    for (
        const recommendation
        of recommendations
    ) {

        if (
            !seen.has(
                recommendation.title
            )
        ) {

            seen.add(
                recommendation.title
            );

            unique.push(
                recommendation
            );
        }
    }


    return unique;
}


/* =========================================================
   15. RISK LEVEL
   ========================================================= */

function getLevel(
    score,
    serious,
    urgent
) {

    /*
       A single word does not automatically
       mean the situation is critical.
    */


    if (
        serious &&
        urgent
    ) {

        return {

            key: "critical",

            name:
                "Critical review required",

            desc:
                "Serious safety-related signals and urgency indicators were detected. Human review should take priority."
        };
    }


    if (
        serious &&
        score >= 60
    ) {

        return {

            key: "high",

            name:
                "High vulnerability",

            desc:
                "Significant safety-related indicators were detected. A trained human should review the situation."
        };
    }


    if (score < 20) {

        return {

            key: "low",

            name:
                "Low vulnerability",

            desc:
                "Few significant vulnerability indicators were detected in this screening."
        };
    }


    if (score < 40) {

        return {

            key: "moderate",

            name:
                "Moderate vulnerability",

            desc:
                "Some vulnerability or distress-related indicators were detected."
        };
    }


    if (score < 65) {

        return {

            key: "high",

            name:
                "High vulnerability",

            desc:
                "Multiple vulnerability indicators were detected. Human review is recommended."
        };
    }


    return {

        key: "critical",

        name:
            "Critical review required",

        desc:
            "A high concentration of vulnerability or safety indicators was detected. Human review is required."
    };
}


/* =========================================================
   16. MAIN SCORING ENGINE
   ========================================================= */

function calculateRisk(text) {

    const detected =
        detectIndicators(text);


    const urgencyMatches =
        detectUrgency(text);


    const context =
        detectContext(text);


    const emotionResult =
        detectEmotion(text);


    let score = 5;


    let seriousDetected =
        false;


    /* -----------------------------------------------------
       CATEGORY SCORING
       ----------------------------------------------------- */

    detected.forEach(
        item => {

            score +=
                item.weight;


            /*
               Additional evidence bonus.
               Prevents repeated words from
               exploding the score.
            */

            if (
                item.matches.length > 1
            ) {

                const bonus =
                    Math.min(
                        10,
                        (
                            item.matches.length - 1
                        ) * 3
                    );


                score +=
                    bonus;
            }


            if (
                item.serious
            ) {

                seriousDetected =
                    true;
            }
        }
    );


    /* -----------------------------------------------------
       MULTIPLE CATEGORIES
       ----------------------------------------------------- */

    if (
        detected.length > 1
    ) {

        score +=
            Math.min(
                12,
                (
                    detected.length - 1
                ) * 3
            );
    }


    /* -----------------------------------------------------
       URGENCY
       ----------------------------------------------------- */

    if (
        urgencyMatches.length > 0
    ) {

        score +=
            Math.min(
                18,
                urgencyMatches.length * 4
            );
    }


    /* -----------------------------------------------------
       CURRENT SITUATION
       ----------------------------------------------------- */

    if (
        context.isCurrent
    ) {

        score += 8;
    }


    /* -----------------------------------------------------
       PAST SITUATION
       ----------------------------------------------------- */

    if (
        context.isPast &&
        !context.isCurrent
    ) {

        score -= 8;
    }


    /* -----------------------------------------------------
       POSITIVE COUNTER-EVIDENCE
       ----------------------------------------------------- */

    const positiveCount =

        (
            emotionResult
                .emotionScores
                .joy || 0
        )

        +

        (
            emotionResult
                .emotionScores
                .love || 0
        );


    if (
        positiveCount > 0 &&
        !seriousDetected
    ) {

        score -=
            Math.min(
                6,
                positiveCount
            );
    }


    /* -----------------------------------------------------
       CLAMP SCORE
       ----------------------------------------------------- */

    score =
        Math.max(
            0,
            Math.min(
                100,
                Math.round(score)
            )
        );


    /* -----------------------------------------------------
       URGENT CONDITION
       ----------------------------------------------------- */

    const urgent =

        seriousDetected &&

        (
            urgencyMatches.length > 0 ||
            context.isCurrent
        );


    /* -----------------------------------------------------
       SAFETY CONCERN
       ----------------------------------------------------- */

    const safetyConcern =

        seriousDetected &&

        (
            score >= 45 ||
            urgent
        );


    /* -----------------------------------------------------
       CONFIDENCE ESTIMATE
       ----------------------------------------------------- */

    const totalMatches =

        detected.reduce(
            (
                total,
                item
            ) =>

                total +
                item.matches.length,

            0
        );


    let confidence =

        40 +

        detected.length * 7 +

        totalMatches * 2;


    if (
        context.isCurrent
    ) {

        confidence += 5;
    }


    if (
        urgencyMatches.length > 0
    ) {

        confidence += 5;
    }


    confidence =
        Math.min(
            95,
            Math.round(
                confidence
            )
        );


    /* -----------------------------------------------------
       RISK LEVEL
       ----------------------------------------------------- */

    const level =
        getLevel(
            score,
            seriousDetected,
            urgent
        );


    /* -----------------------------------------------------
       CONDITION-SPECIFIC RECOMMENDATIONS
       ----------------------------------------------------- */

    const recommendations =
        generateRecommendations(
            detected,
            score,
            urgent
        );


    /* -----------------------------------------------------
       RETURN RESULT
       ----------------------------------------------------- */

    return {

        score,

        confidence,

        level,

        safetyConcern,

        urgent,


        indicators:

            detected.map(
                item => ({

                    category:
                        item.key,

                    matches:
                        item.matches
                })
            ),


        categories:

            detected.map(
                item =>
                    item.key
            ),


        urgencyMatches,


        currentContext:
            context.current,


        pastContext:
            context.past,


        emotion:
            emotionResult.emotion,


        emotionScores:
            emotionResult.emotionScores,


        recommendations
    };
}


/* =========================================================
   17. SAVE RESULT
   ========================================================= */

function saveResult(
    result,
    text
) {

    const finalResult = {

        score:
            result.score,

        confidence:
            result.confidence,

        level:
            result.level,

        safetyConcern:
            result.safetyConcern,

        urgent:
            result.urgent,

        indicators:
            result.indicators,

        categories:
            result.categories,

        recommendations:
            result.recommendations,

        urgencyMatches:
            result.urgencyMatches,

        emotion:
            result.emotion,

        emotionScores:
            result.emotionScores,

        time:
            new Date()
                .toLocaleString(),

        text:
            text
    };


    localStorage.setItem(

        "vulneraSenseResult",

        JSON.stringify(
            finalResult
        )
    );


    localStorage.setItem(

        "vulneraSenseText",

        text
    );
}


/* =========================================================
   18. ANALYZE FUNCTION
   ========================================================= */

function analyze() {

    const input =
        document.getElementById(
            "textInput"
        );


    if (!input) {

        console.error(
            "textInput was not found."
        );

        return;
    }


    const text =
        input.value.trim();


    if (!text) {

        alert(
            "Please enter a short sample first."
        );

        return;
    }


    const btn =
        document.getElementById(
            "analyzeBtn"
        );


    if (btn) {

        btn.disabled =
            true;

        btn.textContent =
            "Analyzing...";
    }


    /*
       Small delay makes the prototype
       feel like an AI processing pipeline.
    */

    setTimeout(
        () => {

            try {

                const result =
                    calculateRisk(
                        text
                    );


                latestScore =
                    result.score;


                saveResult(
                    result,
                    text
                );


                if (btn) {

                    btn.disabled =
                        false;

                    btn.textContent =
                        "Analyze Again →";
                }


                window.location.href =
                    "../pages/results.html";


            } catch (error) {

                console.error(
                    "Assessment error:",
                    error
                );


                if (btn) {

                    btn.disabled =
                        false;

                    btn.textContent =
                        "Analyze with AI";
                }


                alert(
                    "Something went wrong while analyzing the text."
                );
            }

        },

        900
    );
}


/* =========================================================
   19. DYNAMIC BUTTON ATTACHMENT
   ========================================================= */

function attachAnalyzeButton() {

    const btn =
        document.getElementById(
            "analyzeBtn"
        );


    if (!btn) return;


    if (
        btn.dataset
            .assessmentAttached ===
        "true"
    ) {

        return;
    }


    btn.dataset
        .assessmentAttached =
        "true";


    btn.addEventListener(
        "click",
        analyze
    );
}


/* =========================================================
   20. INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

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
);