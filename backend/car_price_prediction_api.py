from fastapi import FastAPI,HTTPException
import joblib
from pydantic import BaseModel,Field
from typing import Literal
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import datetime


app= FastAPI()
model= joblib.load("./models/car_price_model.pkl")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

COLUMNS= ['HP_per_CC',
 'Manufacture_Year',
 'Engine_CC',
 'Horsepower',
 'Mileage_km_per_l',
 'Car_Age',
 'Efficiency_Score',
 'Brand',
 'Body_Type',
 'Fuel_Type',
 'Transmission',
 'Price_Category']

class car_info(BaseModel):
    HP_per_CC: float= Field(...,ge=0,le=1,description="HP per CC of car between 0 to 1")
    Manufacture_Year: int= Field(...,ge=1500,le= datetime.datetime.now().year,description="Enter manufacture year of car")
    Engine_CC: int= Field(...,ge=1000,le=5000,description="Enter Engine CC of car")
    Horsepower: int= Field(...,ge=60,le=600,description="Enter car horse power between 60 to 600")
    Mileage_km_per_l: int= Field(...,ge=0,le=50,description="Enter car mileage")
    Car_Age: int= Field(...,ge=0,le=100,description="Enter car age")
    Efficiency_Score: float= Field(...,ge=0,le=1,description="Enter car Efficiency Score between 0 to 1")
    Brand: Literal['Mercedes', 'Nissan', 'Hyundai', 'Tesla', 'Audi', 'Honda', 'Ford',
       'Toyota', 'BMW', 'Kia']
    Body_Type: Literal['SUV', 'Coupe', 'Hatchback', 'Sedan', 'Pickup']
    Fuel_Type: Literal['Petrol', 'Diesel', 'Hybrid', 'Electric']
    Transmission: Literal['Manual', 'Automatic']
    Price_Category: Literal['Premium', 'Mid-Range', 'Budget', 'Luxury']
    
class model_response(BaseModel):
    price: float
    
@app.get("/")
def home():
    return {'message': 'Car price prediction API'}

@app.post("/predict")
def predict(features: car_info):
    try:
        inputs= pd.DataFrame([features.model_dump()],columns=COLUMNS)
        prediction= model.predict(inputs)
        return model_response(price= round(float(prediction[0]),2))
    except Exception as e:
        raise HTTPException(
            status_code= 500,
            detail= f"Something wnet wrong from our site. {str(e)}"
        )