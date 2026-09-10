/* =========================================================
   VULNERASENSE-AI
   VOICE INPUT ENGINE
   ========================================================= */

let recognition = null;
let isRecording = false;
let finalTranscript = "";


/* =========================================================
   1. CHECK BROWSER SUPPORT
   ========================================================= */

function getSpeechRecognition() {

    return (
        window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        null
    );
}


/* =========================================================
   2. UPDATE MICROPHONE BUTTON
   ========================================================= */

function updateMicrophoneUI(recording) {

    const button =
        document.getElementById("micButton");

    if (!button) return;

    if (recording) {

        button.textContent = "⏹";

        button.classList.add("recording");

        button.setAttribute(
            "aria-label",
            "Stop recording"
        );

        button.setAttribute(
            "title",
            "Stop recording"
        );

    } else {

        button.textContent = "🎙";

        button.classList.remove("recording");

        button.setAttribute(
            "aria-label",
            "Start voice recording"
        );

        button.setAttribute(
            "title",
            "Start voice recording"
        );
    }
}


/* =========================================================
   3. START RECORDING
   ========================================================= */

function startRecording() {

    const SpeechRecognition =
        getSpeechRecognition();


    /* Browser support check */

    if (!SpeechRecognition) {

        const transcript =
            document.getElementById("transcript");

        if (transcript) {

            transcript.textContent =
                "Voice input is not supported in this browser. Please use Google Chrome or Microsoft Edge.";
        }

        return;
    }


    /* Prevent duplicate recording */

    if (isRecording) return;


    recognition =
        new SpeechRecognition();


    /* =====================================================
       RECOGNITION SETTINGS
       ===================================================== */

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = "en-IN";

    recognition.maxAlternatives = 1;


    finalTranscript = "";


    /* =====================================================
       WHEN RECORDING STARTS
       ===================================================== */

    recognition.onstart = function () {

        isRecording = true;

        updateMicrophoneUI(true);


        const transcript =
            document.getElementById("transcript");

        if (transcript) {

            transcript.textContent =
                "Listening... Speak now.";
        }
    };


    /* =====================================================
       WHEN SPEECH IS DETECTED
       ===================================================== */

    recognition.onresult = function (event) {

        let interimTranscript = "";


        for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
        ) {

            const speech =
                event.results[i][0].transcript;


            if (
                event.results[i].isFinal
            ) {

                finalTranscript +=
                    speech + " ";

            } else {

                interimTranscript +=
                    speech;
            }
        }


        const completeText =
            (
                finalTranscript +
                interimTranscript
            ).trim();


        /* Show transcript */

        const transcript =
            document.getElementById("transcript");

        if (transcript) {

            transcript.textContent =
                completeText ||
                "Listening...";
        }


        /* =================================================
           PUT VOICE TEXT INTO TEXTAREA
           ================================================= */

        const textInput =
            document.getElementById("textInput");

        if (textInput && completeText) {

            textInput.value =
                completeText;

            /* Trigger input event so other
               UI code can detect the change */

            textInput.dispatchEvent(
                new Event("input", {
                    bubbles: true
                })
            );
        }
    };


    /* =====================================================
       WHEN RECORDING ENDS
       ===================================================== */

    recognition.onend = function () {

        isRecording = false;

        updateMicrophoneUI(false);


        const transcript =
            document.getElementById("transcript");


        const textInput =
            document.getElementById("textInput");


        if (
            finalTranscript.trim()
        ) {

            const text =
                finalTranscript.trim();


            if (transcript) {

                transcript.textContent =
                    text;
            }


            if (textInput) {

                textInput.value =
                    text;
            }

        } else {

            if (transcript) {

                transcript.textContent =
                    "No speech detected. Please try again.";
            }
        }
    };


    /* =====================================================
       ERROR HANDLING
       ===================================================== */

    recognition.onerror = function (event) {

        console.error(
            "Speech recognition error:",
            event.error
        );


        isRecording = false;

        updateMicrophoneUI(false);


        const transcript =
            document.getElementById("transcript");


        if (!transcript) return;


        switch (event.error) {

            case "not-allowed":

            case "service-not-allowed":

                transcript.textContent =
                    "Microphone permission was denied. Please allow microphone access and try again.";

                break;


            case "no-speech":

                transcript.textContent =
                    "No speech detected. Please speak clearly and try again.";

                break;


            case "audio-capture":

                transcript.textContent =
                    "No microphone was detected. Check your microphone connection.";

                break;


            case "network":

                transcript.textContent =
                    "Speech recognition needs an internet connection in this browser.";

                break;


            case "aborted":

                transcript.textContent =
                    "Voice recording stopped.";

                break;


            default:

                transcript.textContent =
                    "Voice input could not be started. Please try again.";
        }
    };


    /* =====================================================
       START RECOGNITION
       ===================================================== */

    try {

        recognition.start();

    } catch (error) {

        console.error(
            "Could not start speech recognition:",
            error
        );

        isRecording = false;

        updateMicrophoneUI(false);
    }
}


/* =========================================================
   4. STOP RECORDING
   ========================================================= */

function stopRecording() {

    if (
        recognition &&
        isRecording
    ) {

        recognition.stop();
    }
}


/* =========================================================
   5. TOGGLE RECORDING
   ========================================================= */

function toggleRecording() {

    if (isRecording) {

        stopRecording();

    } else {

        startRecording();
    }
}


/* =========================================================
   6. ATTACH MICROPHONE BUTTON
   ========================================================= */

function attachMicrophoneButton() {

    const button =
        document.getElementById("micButton");


    if (!button) return;


    /* Prevent duplicate event listeners */

    if (
        button.dataset.voiceAttached ===
        "true"
    ) {
        return;
    }


    button.dataset.voiceAttached =
        "true";


    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            toggleRecording();
        }
    );


    console.log(
        "VulneraSense-AI microphone button attached."
    );
}


/* =========================================================
   7. WATCH FOR DYNAMICALLY CREATED BUTTON
   ========================================================= */

function startVoiceObserver() {

    attachMicrophoneButton();


    const observer =
        new MutationObserver(
            function () {

                attachMicrophoneButton();
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


/* =========================================================
   8. INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        startVoiceObserver();

    }
);