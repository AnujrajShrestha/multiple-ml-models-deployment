# Multiple ML Models — React Frontend

React + Vite frontend for the Heart Disease and Mental Health FastAPI services.

## Features

- React Router routes:
  - `/`
  - `/heart-disease`
  - `/mental-health`
- Tailwind CSS v4
- GSAP page/component animations
- Animated SVG network/orbit background on every page
- FastAPI integration for both models
- Loading states
- API/network error handling
- Pydantic-compatible request payloads
- Heart model metrics endpoint integration

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

The frontend expects:

```env
VITE_HEART_API_URL=http://127.0.0.1:8000
VITE_MENTAL_HEALTH_API_URL=http://127.0.0.1:8001
```

Change these ports to match your FastAPI servers.

## Backend

Run the APIs separately, for example:

```bash
uvicorn backend.heart_strock_api:app --reload --port 8000
uvicorn backend.mental_health_api:app --reload --port 8001
```

If you instead run each API from inside `backend/`, update the model paths appropriately.

### Important path correction

Based on the repository structure:

```text
multiple-ml-models/
├── backend/
│   ├── heart_strock_api.py
│   └── mental_health_api.py
├── models/
│   ├── heart_scaler.pkl
│   ├── Logistic_Regression_heart.pkl
│   └── Mental_Health_Model.pkl
└── frontend/
```

If the APIs are launched from the project root, the heart API should use:

```python
model = "./models/Logistic_Regression_heart.pkl"
scaler = "./models/heart_scaler.pkl"
```

and the mental-health API should use:

```python
model = "./models/Mental_Health_Model.pkl"
```

Also make sure the malformed CORS lines in `heart_strock_api.py` are corrected to normal Python:

```python
allow_origins=["*"],
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
```

## API contracts

### Heart Disease

`POST /predict`

The frontend sends:

```json
{
  "Age": 54,
  "Sex": "Male",
  "ChestPainType": "ATA",
  "RestingBP": 130,
  "Cholesterol": 220,
  "FastingBS": 0,
  "RestingECG": "Normal",
  "MaxHR": 140,
  "ExerciseAngina": "N",
  "Oldpeak": 0,
  "ST_Slope": "Up"
}
```

### Mental Health

`POST /predict`

The frontend sends:

```json
{
  "age": 21,
  "gender": "Male",
  "country": "India",
  "academic_level": "Undergraduate",
  "most_used_platform": "Instagram",
  "purpose_of_use": "Education",
  "avg_daily_usage_hours": 4,
  "daily_unlocks": 50,
  "study_hours": 5,
  "physical_activity_hours": 1,
  "sleep_hours_per_night": 7,
  "stress_level": "Medium"
}
```
