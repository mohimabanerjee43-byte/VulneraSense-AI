import numpy as np
import librosa # Librosa is a Python package for music and audio analysis. It provides the building blocks necessary to create music information retrieval systems.
from app.schemas.input_schema import AcousticFeatures

class AudioAnalysisService:
    @staticmethod
    # def <func_name>(<args>:<arg_type>) -> <return_type>:
    def extract_stress_signals(file_path: str) -> AcousticFeatures:
        """
        Extracts pitch variance, energy, and silence ratios from audio files.
        """
        # y is the audio time series, A 1D NumPy array representing the actual sound wave. If you plot this array on a graph, it looks exactly like a standard audio visualizer wave
        # sr is the sample rate, It measures how many times per second the audio was recorded, known as the Sample Rate (sr). 
        # For example, if sr is 44100, it means the audio contains 44,100 data points for every single second of sound.
        y, sr = librosa.load(file_path, sr=None) # sr=None means that the original sample rate of the audio file will be preserved, rather than resampling it to a default rate (like 22050 Hz). This is important for accurate analysis, especially for pitch and energy calculations.
        
        # Pitch / F0 Analysis
        pitches, magnitudes = librosa.piptrack(y=y, sr=sr) # librosa.piptrack breaks the audio down into two identical 2D grids. One for pitches (Frequency Matrix(specific numeric frequency of the voice over time)) and another is magnitudes (The Loudness Matrix (how strong or loud that specific note or frequency was at that exact moment.))
        pitch_values = pitches[pitches > 0] # Only pitches or frequencies greater than 0 are considered to be taken , other values are removed.
        mean_pitch = float(np.mean(pitch_values)) if len(pitch_values) > 0 else 0.0 # Calculates the mean of the pitch values. If there are no pitch values (i.e., the array is empty), it returns 0.0 to avoid division by zero errors.
        std_pitch = float(np.std(pitch_values)) if len(pitch_values) > 0 else 0.0 # Calculates the standard deviation of the pitch values. If there are no pitch values, it returns 0.0.

        # Energy / Volume (RMS)
        # An audio wave (y) moves up and down between positive and negative numbers. 
        # If you simply calculate a regular average of the wave, the positive and negative numbers cancel each other out- 
        # resulting in zero—which isn't helpful.  librosa.feature.rms solves this by:
        # 1. Squaring all the numbers (turning everything positive).
        # 2. Calculating the Mean (average) of those squared values.
        # 3. Taking the Square Root of the result to bring it back to a normal scale.
        rms = librosa.feature.rms(y=y)
        mean_energy = float(np.mean(rms)) # mean of energy or loudness
        
        # Pause & Silence Analysis
        non_silent_intervals = librosa.effects.split(y, top_db=20) # librosa.effects.split identifies non silent intervals i.e. the intervals which is lie in between (peak db to (peak db - 20))
        total_duration = len(y) / sr # Total number of data points in the audio divided by the number of data points per second
        speaking_duration = sum([(end - start) for start, end in non_silent_intervals]) / sr # Sum of all non-silent intervals in seconds
        silence_ratio = float((total_duration - speaking_duration) / total_duration) if total_duration > 0 else 0.0 # Silence ratio is calculated by subtracting the speaking duration from the total duration and dividing it by the total duration. If the total duration is zero, it returns 0.0 to avoid division by zero errors.

        return AcousticFeatures(
            duration_seconds=round(total_duration, 2),
            mean_pitch_hz=round(mean_pitch, 2),
            pitch_std_dev=round(std_pitch, 2),
            mean_energy=round(mean_energy, 4),
            silence_ratio=round(silence_ratio, 2)
        )