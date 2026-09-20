# Import the OpenAI Whisper library for speech-to-text processing
import whisper
from app.config import settings

class STTService:
    # The setup method that runs automatically whenever a new STTService object is created
    def __init__(self):
        print(f"Loading Whisper model: {settings.WHISPER_MODEL_NAME}...")
        # Load the heavy machine learning model into memory and store it in 'self.model' for later use
        self.model = whisper.load_model(settings.WHISPER_MODEL_NAME)

    # Define a method to convert an audio file into text, expecting a string file path and returning a dictionary
    def transcribe(self, file_path: str) -> dict:
        """
        Transcribes audio and returns text along with detected language.
        """
        # Use the stored Whisper model (self.model) to process the audio file and save the raw results
        result = self.model.transcribe(file_path)
        return {
            # Safely extract the transcribed text, removing any accidental spaces from the start or end
            "text": result.get("text", "").strip(),
            # Safely extract the language code (e.g., 'en'), defaulting to 'unknown' if not found
            "language": result.get("language", "unknown")
        }

# Singleton instance for global app usage
stt_service = STTService()