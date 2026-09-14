import base64
import numpy as np
import io

class AudioAnalyzer:
    def analyze_chunk(self, base64_audio):
        if not base64_audio:
            return {"verdict": "NO_AUDIO", "delta": 0}

        try:
            # Strip data URL header if present
            if "," in base64_audio:
                header, encoded = base64_audio.split(",", 1)
            else:
                encoded = base64_audio

            audio_bytes = base64.b64decode(encoded)
            
            # Convert raw bytes to a numpy array for numerical signal analysis
            audio_array = np.frombuffer(audio_bytes, dtype=np.int16)
            # --- LIVE TESTING PRINT STATEMENT ---
            print(f"PHONE AUDIO CAPTURED -> Size: {len(audio_bytes)} bytes | Max Amplitude: {np.max(np.abs(audio_array)) if len(audio_array) > 0 else 0}")
            # ------------------------------------
            
            if len(audio_array) == 0:
                return {"verdict": "INDOOR_SILENCE_OR_FLATLINE", "delta": -10}

            # Calculate RMS (Root Mean Square) energy to measure true audio volume/intensity
            rms_energy = np.sqrt(np.mean(audio_array.astype(float)**2))
            peak_amplitude = np.max(np.abs(audio_array))

            # Heuristic thresholds for threat detection
            if peak_amplitude > 25000 or rms_energy > 5000:
                return {
                    "verdict": "HIGH_INTENSITY_DISTRESS_OR_IMPULSE (Scream/Gunshot/Aggression)",
                    "delta": +25
                }
            elif rms_energy > 1500:
                return {
                    "verdict": "MODERATE_BACKGROUND_NOISE",
                    "delta": +5
                }
            else:
                return {
                    "verdict": "INDOOR_SILENCE_OR_FLATLINE (Potential False Report)",
                    "delta": -10
                }

        except Exception as e:
            print(f"Audio processing error: {e}")
            return {"verdict": "AUDIO_PROCESSING_ERROR", "delta": 0}