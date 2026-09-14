// js/audioTracker.js

function beginContinuousSurroundingsTracking(incidentId) {
    const LOOP_INTERVAL_MS = 30000; // Every 30 seconds

    const trackingTimer = setInterval(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            let chunks = [];

            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            
            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                
                reader.onloadend = async () => {
                    const base64Data = reader.result;

                    // Send to backend for dynamic verdict adjustment
                    await fetch('http://localhost:3000/api/assessment/update-audio', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ incidentId, ambientAudioSnippet: base64Data })
                    });
                };
                
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setTimeout(() => mediaRecorder.stop(), 5000); // Record for 5 seconds
        } catch (err) {
            console.error("Microphone tracking stream interrupted:", err);
            clearInterval(trackingTimer);
        }
    }, LOOP_INTERVAL_MS);
}