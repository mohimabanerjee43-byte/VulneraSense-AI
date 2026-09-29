# Pydantic, a popular Python library used for data validation and settings management.
from pydantic import BaseModel
from typing import Optional

# It creates two models, AcousticFeatures and PipelineOutput
# to strictly define, clean, and validate the data flowing through an audio/text processing pipeline.

# This model defines a blueprint for the structural, mathematical properties of an audio file. 
# If data is passed into this model, Pydantic guarantees that the values are present and are numbers with decimals (float)
class AcousticFeatures(BaseModel):
    duration_seconds: float # The length of the audio file in seconds
    mean_pitch_hz: float # The average pitch of the audio file in Hertz
    pitch_std_dev: float # The standard deviation of the pitch, indicating how much the pitch varies throughout the audio
    mean_energy: float # The average energy of the audio file, which can be related to the loudness of the audio
    silence_ratio: float # The ratio of silent segments to the total duration of the audio file

# This model represents the final packaged result of the processing pipeline. It can handle both text and audio inputs
class PipelineOutput(BaseModel):
    input_type: str # "audio" or "text"
    raw_text: str # Transcription or submitted text
    language: str # Detected or provided language
    acoustic_features: Optional[AcousticFeatures] = None # Optional field that holds the nested acoustic features if the input is audio. If the input is text, this field will be None.

# Define request schema using Pydantic
class TranslationRequest(BaseModel):
    text: str