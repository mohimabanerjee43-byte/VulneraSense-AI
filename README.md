# VulneraSense AI

AI-assisted vulnerability screening prototype.

## Project Flow

Voice/Text
    ↓
AI/NLP
    ↓
Stress Vulnerability Index
    ↓
Risk Category
    ↓
Support Pathway


## Frontend

The frontend uses:

- HTML
- CSS
- JavaScript
- LocalStorage
- Web Speech API


## Backend

The optional backend uses:

- Node.js
- Express
- CORS


## Run Frontend

Open the project in VS Code.

Install the Live Server extension.

Right-click:

index.html

Then select:

Open with Live Server


## Run Backend

Open VS Code Terminal.

Move into backend:

cd backend


Install dependencies:

npm install


Start the server:

npm start


The server will run at:

http://localhost:3000


## Test Backend

Open:

http://localhost:3000/api/health


You should receive:

{
    "status": "online",
    "prototype": true
}


## Assessment API

POST:

/api/assessment


Example request:

{
    "text": "I feel overwhelmed and isolated."
}


## Recommendation API

GET:

/api/recommendations/moderate


## Important

The current AI scoring is a demonstration based on simple
keyword rules.

It is NOT a clinical model.

For a real-world implementation, the system should include:

- validated ML/NLP models
- privacy protection
- user consent
- bias testing
- secure storage
- human review
- verified support resources
- audit logs

AI should not independently diagnose a person or make an
autonomous safety decision.