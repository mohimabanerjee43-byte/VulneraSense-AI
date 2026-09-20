# Centralizes app settings so you can change Whisper models without touching business logic.
# os module is used to read environment variables, which can be set in a .env file or in the system environment.
import os

# Settings class holds configuration settings for the application. 
# It includes the project name and the Whisper model name, which can be set via environment variables. 
# The default Whisper model is set to "base" if not specified in the environment.
class Settings:
    PROJECT_NAME: str = "Victim Triage Input Pipeline"
    # Options: "tiny", "base", "small", "medium", "large"
    WHISPER_MODEL_NAME: str = os.getenv("WHISPER_MODEL_NAME", "large")

# An instance of the Settings class is created named as settings to be used throughout the application.
settings = Settings()