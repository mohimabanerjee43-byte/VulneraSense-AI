from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
from trust_engine import TrustEngine
from audio_analyzer import AudioAnalyzer

app = FastAPI(title="VulneraSense Security Microservice")

# Enable CORS for Node.js communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

trust_engine = TrustEngine()
audio_analyzer = AudioAnalyzer()

class AssessmentPayload(BaseModel):
    text: str
    claimedLocation: Optional[Dict[str, Any]] = None
    telemetry: Optional[Dict[str, Any]] = None

class AudioUpdatePayload(BaseModel):
    incidentId: str
    ambientAudioSnippet: str

@app.post("/verify-trust")
async def verify_trust_endpoint(payload: AssessmentPayload, request: Request):
    client_ip = request.headers.get("x-forwarded-for", request.client.host)
    # Use model_dump() for Pydantic v2
    result = trust_engine.evaluate_complaint(payload.model_dump(), client_ip)
    return result

@app.post("/update-audio")
async def update_audio_endpoint(payload: AudioUpdatePayload):
    analysis = audio_analyzer.analyze_chunk(payload.ambientAudioSnippet)
    return {
        "incidentId": payload.incidentId,
        "audioVerdict": analysis["verdict"],
        "trustDelta": analysis["delta"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)