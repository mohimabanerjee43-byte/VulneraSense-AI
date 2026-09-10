/*
 * ==========================================
 * VULNERASENSE VOICE INPUT
 * ==========================================
 *
 * Uses the browser's Speech Recognition API.
 * This is a prototype feature.
 */


let recognition = null;
let isRecording = false;
let voiceInitialized = false;


/*
 * ==========================================
 * INITIALIZE VOICE RECOGNITION
 * ==========================================
 */

function initializeVoice() {

    /*
     * Avoid initializing more than once.
     */

    if (voiceInitialized) {
        return;
    }


    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    /*
     * Check browser support.
     */

    if (!SpeechRecognition) {

        console.warn(
            "Speech Recognition is not supported by this browser."
        );

        return;

    }


    recognition =
        new SpeechRecognition();


    /*
     * Recognition settings
     */

    recognition.continuous = false;

    recognition.interimResults = true;

    recognition.lang = "en-IN";


    /*
     * ==========================================
     * WHEN RECORDING STARTS
     * ==========================================
     */

    recognition.onstart = () => {

        isRecording = true;


        const status =
            document.getElementById(
                "voiceStatus"
            );


        const mic =
            document.getElementById(
                "micButton"
            );


        if (status) {

            status.textContent =
                "Listening...";

        }


        if (mic) {

            mic.classList.add(
                "recording"
            );

            mic.textContent =
                "⏹";

        }

    };


    /*
     * ==========================================
     * SPEECH RESULT
     * ==========================================
     */

    recognition.onresult = (event) => {

        let transcriptText = "";


        for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
        ) {

            transcriptText +=
                event.results[i][0].transcript;

        }


        transcriptText =
            transcriptText.trim();


        /*
         * Display transcript.
         */

        const transcript =
            document.getElementById(
                "transcript"
            );


        if (transcript) {

            transcript.textContent =
                transcriptText ||
                "Listening...";

        }


        /*
         * Put the recognized speech into
         * the main text input as well.
         *
         * This allows the existing Analyze
         * button to analyze the voice input.
         */

        const textInput =
            document.getElementById(
                "textInput"
            );


        if (
            textInput &&
            transcriptText
        ) {

            textInput.value =
                transcriptText;

        }

    };


    /*
     * ==========================================
     * RECORDING ENDS
     * ==========================================
     */

    recognition.onend = () => {

        isRecording = false;


        const status =
            document.getElementById(
                "voiceStatus"
            );


        const mic =
            document.getElementById(
                "micButton"
            );


        if (status) {

            status.textContent =
                "Tap to record";

        }


        if (mic) {

            mic.classList.remove(
                "recording"
            );

            mic.textContent =
                "🎙";

        }

    };


    /*
     * ==========================================
     * ERROR HANDLING
     * ==========================================
     */

    recognition.onerror = (event) => {

        console.error(
            "Speech recognition error:",
            event.error
        );


        isRecording = false;


        const status =
            document.getElementById(
                "voiceStatus"
            );


        const mic =
            document.getElementById(
                "micButton"
            );


        if (mic) {

            mic.classList.remove(
                "recording"
            );

            mic.textContent =
                "🎙";

        }


        if (status) {

            if (
                event.error ===
                "not-allowed"
            ) {

                status.textContent =
                    "Microphone permission denied";

            }

            else if (
                event.error ===
                "no-speech"
            ) {

                status.textContent =
                    "No speech detected — tap to try again";

            }

            else {

                status.textContent =
                    "Voice recognition error — tap to try again";

            }

        }

    };


    voiceInitialized = true;

}


/*
 * ==========================================
 * START / STOP RECORDING
 * ==========================================
 */

function toggleRecording() {

    /*
     * Initialize if necessary.
     */

    initializeVoice();


    if (!recognition) {

        alert(
            "Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge."
        );

        return;

    }


    /*
     * Stop if already recording.
     */

    if (isRecording) {

        recognition.stop();

        return;

    }


    /*
     * Clear previous transcript.
     */

    const transcript =
        document.getElementById(
            "transcript"
        );


    if (transcript) {

        transcript.textContent =
            "Listening...";

    }


    /*
     * Start recording.
     */

    try {

        recognition.start();

    } catch (error) {

        console.error(
            "Could not start speech recognition:",
            error
        );

    }

}


/*
 * ==========================================
 * ATTACH MICROPHONE BUTTON
 * ==========================================
 */

function attachMicrophoneButton() {

    const micButton =
        document.getElementById(
            "micButton"
        );


    /*
     * Button doesn't exist yet.
     */

    if (!micButton) {

        return false;

    }


    /*
     * Prevent duplicate listeners.
     */

    if (
        micButton.dataset.voiceAttached ===
        "true"
    ) {

        return true;

    }


    micButton.dataset.voiceAttached =
        "true";


    micButton.addEventListener(
        "click",
        toggleRecording
    );


    /*
     * Initialize the recognition object.
     */

    initializeVoice();


    console.log(
        "VulneraSense microphone button ready."
    );


    return true;

}


/*
 * ==========================================
 * WATCH FOR DYNAMIC CONTENT
 * ==========================================
 *
 * Your assessment.html creates micButton
 * dynamically using innerHTML.
 *
 * MutationObserver detects when that
 * button appears.
 */

function watchForVoiceButton() {

    /*
     * Try immediately.
     */

    attachMicrophoneButton();


    /*
     * Watch the page for dynamically
     * inserted elements.
     */

    const observer =
        new MutationObserver(() => {

            if (
                attachMicrophoneButton()
            ) {

                /*
                 * Once attached, we can stop
                 * observing the whole page.
                 */

                observer.disconnect();

            }

        });


    observer.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );

}


/*
 * ==========================================
 * START
 * ==========================================
 */

document.addEventListener(
    "DOMContentLoaded",
    watchForVoiceButton
);