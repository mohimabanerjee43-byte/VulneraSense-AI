const recommendationSets = {

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

}