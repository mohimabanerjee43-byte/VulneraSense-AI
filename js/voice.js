document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            document.body.dataset.page !==
            "assessment"
        ) {
            return;
        }


        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        const mic =
            document.getElementById(
                "micButton"
            );


        const status =
            document.getElementById(
                "voiceStatus"
            );


        const transcript =
            document.getElementById(
                "transcript"
            );


        if (!mic) return;


        if (!SpeechRecognition) {

            mic.addEventListener(
                "click",
                () => {

                    status.textContent =
                        "Speech recognition is not supported in this browser.";

                }
            );

            return;

        }


        const recognition =
            new SpeechRecognition();


        recognition.lang =
            "en-IN";


        recognition.continuous =
            false;


        recognition.interimResults =
            false;


        mic.addEventListener(
            "click",
            () => {

                status.textContent =
                    "Listening…";


                mic.textContent =
                    "⏺";


                recognition.start();

            }
        );


        recognition.onresult =
            event => {

                const text =
                    event
                        .results[0][0]
                        .transcript;


                transcript.textContent =
                    text;


                document
                    .getElementById(
                        "textInput"
                    )
                    .value = text;


                status.textContent =
                    "Voice captured";


                mic.textContent =
                    "🎙";

            };


        recognition.onerror =
            () => {

                status.textContent =
                    "Microphone/recognition error";


                mic.textContent =
                    "🎙";

            };

    }
);