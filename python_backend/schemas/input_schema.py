# Pydantic, a popular Python library used for data validation and settings management.
from pydantic import BaseModel
from typing import Optional

# It creates two models, AcousticFeatures and PipelineOutput
# to strictly define, clean, and validate the data flowing through an audio/text processing pipeline.

# This model defines a blueprint for the structural, mathematical properties of an audio file. 
# If data is passed into this model, Pydantic guarantees that the values are present and are numbers with decimals (float)

# Define request schema using Pydantic
class TranslationRequest(BaseModel):
    text: str