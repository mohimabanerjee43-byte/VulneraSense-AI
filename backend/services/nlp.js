function extractSignals(text) {

    const t =
        text.toLowerCase();


    const groups = {

        stress: [

            "overwhelmed",

            "stressed",

            "pressure",

            "exhausted",

            "burned out"

        ],


        isolation: [

            "lonely",

            "isolated",

            "alone",

            "withdrawn",

            "disconnected"

        ],


        fear: [

            "afraid",

            "scared",

            "unsafe",

            "threatened",

            "intimidated"

        ],


        hopelessness: [

            "hopeless",

            "helpless",

            "desperate",

            "can't cope"

        ]

    };


    const signals = [];


    for (
        const [name, words]
        of Object.entries(groups)
    ) {

        if (
            words.some(
                word =>
                    t.includes(word)
            )
        ) {

            signals.push(name);

        }

    }


    return signals;
}


module.exports = {

    extractSignals

};