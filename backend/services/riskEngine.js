function classify(score) {

    if (score < 25) {

        return {

            key: "low",

            name:
                "Low vulnerability"

        };

    }


    if (score < 50) {

        return {

            key: "moderate",

            name:
                "Moderate vulnerability"

        };

    }


    if (score < 75) {

        return {

            key: "high",

            name:
                "High vulnerability"

        };

    }


    return {

        key: "critical",

        name:
            "Critical review required"

    };

}


module.exports = {

    classify

};