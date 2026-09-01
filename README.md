# Multiple ML Models Deployment

A full-stack machine learning deployment project that brings multiple independently developed machine learning models together into a single web application.

The project provides an interactive frontend where users can select a machine learning application, enter the required inputs, and receive predictions through dedicated FastAPI backend endpoints.

## 🚀 Live Demo

[Live Application — Multiple ML Models Deployment](https://multiple-ml-models-deployment.onrender.com?utm_source=chatgpt.com)

## 📂 Source Code

[GitHub Repository](https://github.com/AnujrajShrestha/multiple-ml-models-deployment?utm_source=chatgpt.com)

---

## 📌 About The Project

**Multiple ML Models Deployment** is a collection of machine learning applications deployed as a unified full-stack web platform.

Instead of keeping individual ML projects as separate notebooks or standalone applications, this project demonstrates how multiple trained machine learning models can be integrated with APIs and exposed through a single modern frontend.

The project covers different machine learning tasks, including:

* Regression
* Binary classification
* Text classification
* Health-risk prediction
* Student outcome prediction
* Weather prediction
* Price prediction
* NLP-based prediction

Each model has its own backend API and frontend interface.

---

## 🤖 Machine Learning Applications

The application currently contains the following ML-powered modules:

| Application                     | Task                        | Backend |
| ------------------------------- | --------------------------- | ------- |
| 🚗 Car Price Prediction         | Regression                  | FastAPI |
| 📧 Email Spam Detection         | Text Classification         | FastAPI |
| 📰 Fake News Detection          | Text Classification         | FastAPI |
| ❤️ Heart Disease Prediction     | Classification              | FastAPI |
| 🏠 House Price Prediction       | Regression                  | FastAPI |
| 🧠 Mental Health Prediction     | Prediction / Classification | FastAPI |
| 🎓 Student Placement Prediction | Classification              | FastAPI |
| 🌦️ Weather Prediction          | Regression + Classification | FastAPI |

The backend contains dedicated API modules for each application.

---

## 🧠 Machine Learning Pipeline

The machine learning models were developed as proper end-to-end ML pipelines rather than treating preprocessing and model inference as unrelated steps.

The general workflow is:

```text
Dataset
   ↓
Data Cleaning
   ↓
Feature Engineering
   ↓
Data Preprocessing
   ↓
Train / Test Split
   ↓
Model Training
   ↓
Model Evaluation
   ↓
Pipeline / Preprocessing Serialization
   ↓
Saved Model
   ↓
FastAPI Inference API
   ↓
React Frontend
   ↓
Prediction
```

This approach helps maintain consistency between training-time preprocessing and inference-time data transformation.

For example, the text-based email spam detection API loads both the trained model and its TF-IDF vectorizer before transforming incoming text and generating a prediction.

The deployed model artifacts are stored separately inside the `models` directory, including classification models, regression models, scalers, and TF-IDF vectorizers.

---

## 🏗️ Project Architecture

```text
                    ┌─────────────────────────┐
                    │       React Frontend    │
                    │                         │
                    │  Vite + React           │
                    │  Tailwind CSS            │
                    │  React Router            │
                    │  GSAP                    │
                    │  Lucide React            │
                    └────────────┬────────────┘
                                 │
                                 │ HTTP Requests
                                 ▼
                    ┌─────────────────────────┐
                    │      FastAPI Backend    │
                    │                         │
                    │  /predict endpoints     │
                    │  Pydantic validation    │
                    │  Model inference        │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   Serialized ML Models  │
                    │                         │
                    │  Joblib / Pickle        │
                    │  Preprocessors          │
                    │  Vectorizers / Scalers  │
                    └─────────────────────────┘
```

The frontend sends user inputs to the appropriate FastAPI endpoint. The backend validates the request, prepares the input in the expected format, loads the corresponding trained model, performs inference, and returns the prediction to the frontend.

---

## 🗂️ Project Structure

```text
multiple-ml-models-deployment/
│
├── backend/
│   ├── car_price_prediction_api.py
│   ├── email_spam_dectection_api.py
│   ├── fake_news_prediction_api.py
│   ├── heart_strock_api.py
│   ├── house_prediction_api.py
│   ├── mental_health_api.py
│   ├── student_placement_api.py
│   ├── weather_prediction_api.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── models/
│   ├── Logistic_Regression_heart.pkl
│   ├── Mental_Health_Model.pkl
│   ├── car_price_model.pkl
│   ├── email_detection.pkl
│   ├── heart_scaler.pkl
│   ├── house_model.pkl
│   ├── model.pkl
│   ├── random_forest_classification.pkl
│   ├── random_forest_regression.pkl
│   ├── tfidf_vectorizer.pkl
│   └── tfidfvect.pkl
│
└── .gitignore
```

The repository follows this separation between frontend, backend APIs, and serialized model artifacts.

---

## 🛠️ Tech Stack

### Machine Learning

* Python
* NumPy
* pandas
* scikit-learn
* Joblib
* TF-IDF
* Machine Learning Pipelines
* Classification
* Regression
* Feature Engineering
* Model Evaluation

### Backend

* FastAPI
* Pydantic
* Uvicorn
* pandas
* Joblib
* scikit-learn
* CORS

The backend dependency list includes FastAPI, joblib, Uvicorn, pandas, Pydantic, and scikit-learn.

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* GSAP
* Lucide React
* JavaScript

The frontend package configuration confirms React, Vite, Tailwind CSS, React Router, GSAP, and Lucide React as core dependencies.

### Deployment

* Render
* GitHub

The live application is deployed on Render. Render supports deploying web services from Git repositories and provides public `onrender.com` service URLs.

---

## 🔌 Backend API Design

Each machine learning application has a dedicated FastAPI module.

For example, the car price prediction service:

```text
POST /predict
```

accepts validated car information and returns the predicted price. The API uses Pydantic models for input validation and loads the serialized machine learning model with Joblib.

Similarly, the email spam detection service accepts text, transforms it using the saved TF-IDF vectorizer, and passes the transformed representation to the trained classifier.

This modular API architecture makes each ML model independently accessible while keeping the overall application organized.

---

## 🎨 Frontend

The frontend provides a unified interface for all deployed machine learning applications.

The frontend contains individual pages for:

* Home
* Car Price Prediction
* Email Spam Detection
* Fake News Detection
* Heart Disease Prediction
* House Price Prediction
* Mental Health Prediction
* Student Placement Prediction
* Weather Prediction
* 404 / Not Found

Reusable components are used for navigation, page headers, loading states, error alerts, and animated UI elements.

### Frontend Development Note

The frontend UI was **vibe coded with AI assistance** to accelerate the creation of the user interface, styling, reusable components, and overall visual experience.

However, the **application routing, model-to-page mapping, API integration, and project structure were managed and implemented by the author**.

This distinction is intentional: AI assistance was used primarily as a development aid for the frontend experience, while the machine learning, backend architecture, API implementation, integration, and routing decisions were handled by the author.

---

## 👨‍💻 Author's Contribution

This project was developed with a clear separation between machine learning/backend engineering and frontend UI assistance.

### ML & Backend — Author

The author is responsible for:

* Developing the machine learning models
* Preparing the datasets
* Performing data preprocessing
* Feature engineering
* Building ML pipelines
* Training and evaluating models
* Serializing trained models
* Creating FastAPI services
* Designing API request and response structures
* Implementing input validation
* Connecting models to APIs
* Integrating the APIs with the frontend
* Managing the overall project architecture

### Frontend — AI-Assisted

AI assistance was used for **frontend vibe coding**, particularly for:

* UI implementation
* Styling
* Component generation
* Visual layout
* Frontend design ideas
* Reusable UI elements

The author retained control over:

* Application routing
* Route-to-page mapping
* API integration
* Project organization
* Frontend/backend integration
* Overall application behavior

---

## 🔄 Prediction Flow

A typical prediction request follows this flow:

```text
User
  │
  ▼
React Form
  │
  ▼
Input Validation
  │
  ▼
API Request
  │
  ▼
FastAPI Endpoint
  │
  ▼
Pydantic Validation
  │
  ▼
Preprocessing / Pipeline
  │
  ▼
Trained ML Model
  │
  ▼
Prediction
  │
  ▼
JSON Response
  │
  ▼
React UI
  │
  ▼
Prediction Result
```

---

## 📦 Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/AnujrajShrestha/multiple-ml-models-deployment.git
cd multiple-ml-models-deployment
```

### 2. Backend Setup

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the required FastAPI application with Uvicorn.

For example:

```bash
uvicorn car_price_prediction_api:app --reload
```

The exact module can be changed depending on which ML application you want to run.

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend uses Vite for local development.

---

## ⚠️ Important Notes

* The models are intended for demonstration and educational purposes.
* Predictions should not automatically be treated as professional, medical, financial, or real-world decisions.
* Model performance depends on the datasets, preprocessing, and training methodology used for each individual model.
* Some services may take time to respond when the deployment environment is inactive.
* Input values should remain within the ranges expected by the corresponding API.

---

## 🎯 Project Goals

The main purpose of this project is to demonstrate the complete journey from:

```text
Machine Learning
      ↓
Model Development
      ↓
Model Serialization
      ↓
API Development
      ↓
Frontend Integration
      ↓
Deployment
```

Rather than demonstrating only machine learning inside a notebook, this project focuses on taking trained models and turning them into usable web-based prediction services.

---

## 🚀 Future Improvements

Potential improvements include:

* [ ] Add authentication and user accounts
* [ ] Add model performance dashboards
* [ ] Add confidence/probability visualization
* [ ] Add automated model versioning
* [ ] Add centralized API documentation
* [ ] Add Docker-based deployment
* [ ] Add CI/CD
* [ ] Add automated testing
* [ ] Add monitoring and logging
* [ ] Improve mobile responsiveness
* [ ] Add model explainability with SHAP
* [ ] Add dedicated model training pipelines to the repository
* [ ] Add automated retraining workflows

---

## 📚 What This Project Demonstrates

This project demonstrates practical knowledge of:

* Machine Learning
* Supervised Learning
* Classification
* Regression
* NLP
* TF-IDF
* Feature Engineering
* ML Pipelines
* Model Serialization
* FastAPI
* REST APIs
* Pydantic Validation
* React
* React Router
* Tailwind CSS
* API Integration
* Full-Stack Development
* Cloud Deployment
* Git & GitHub

---

## 👤 Author

**Anuj Shrestha**

Machine Learning / Backend / Full-Stack Developer

* Machine Learning model development
* FastAPI backend development
* API integration
* React application development
* Model deployment

---

## ⭐ Acknowledgement

This project was built as a practical exploration of deploying multiple machine learning models as real-world web services.

The machine learning models and backend APIs were developed by the **author**. AI assistance was used for frontend **vibe coding**, while the author managed the application's routing, API integration, model integration, and overall project architecture.

---

## 📄 License

This project is available for educational and portfolio purposes. Please check the repository for the applicable licensing information.

---

**Live Demo:** [multiple-ml-models-deployment.onrender.com](https://multiple-ml-models-deployment.onrender.com?utm_source=chatgpt.com)

**Source Code:** [github.com/AnujrajShrestha/multiple-ml-models-deployment](https://github.com/AnujrajShrestha/multiple-ml-models-deployment?utm_source=chatgpt.com)
