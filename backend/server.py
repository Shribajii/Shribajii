from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
import joblib

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== ML MODEL SETUP ====================

# Training data based on loan approval patterns
def generate_training_data(n_samples=1000):
    np.random.seed(42)
    
    # Generate features
    data = {
        'Gender_Male': np.random.choice([0, 1], n_samples, p=[0.2, 0.8]),
        'Married_Yes': np.random.choice([0, 1], n_samples, p=[0.35, 0.65]),
        'Dependents_1': np.random.choice([0, 1], n_samples, p=[0.85, 0.15]),
        'Dependents_2': np.random.choice([0, 1], n_samples, p=[0.9, 0.1]),
        'Dependents_3+': np.random.choice([0, 1], n_samples, p=[0.92, 0.08]),
        'Education_Not Graduate': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
        'Self_Employed_Yes': np.random.choice([0, 1], n_samples, p=[0.85, 0.15]),
        'Property_Area_Semiurban': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
        'Property_Area_Urban': np.random.choice([0, 1], n_samples, p=[0.65, 0.35]),
        'Credit_History': np.random.choice([0, 1], n_samples, p=[0.15, 0.85]),
        'ApplicantIncomeLog': np.random.uniform(7.5, 11.5, n_samples),
        'LoanAmountLog': np.random.uniform(3.5, 6.5, n_samples),
        'Loan_Amount_Term_Log': np.random.uniform(4.5, 6.5, n_samples),
        'Total_Income_Log': np.random.uniform(8.0, 12.0, n_samples),
    }
    
    X = np.column_stack([data[k] for k in data.keys()])
    
    # Generate labels based on realistic patterns
    y = []
    for i in range(n_samples):
        credit_history = data['Credit_History'][i]
        income_log = data['ApplicantIncomeLog'][i]
        loan_log = data['LoanAmountLog'][i]
        total_income_log = data['Total_Income_Log'][i]
        
        # Probability calculation
        prob = 0.3
        if credit_history == 1:
            prob += 0.35
        if income_log > 9.0:
            prob += 0.15
        if total_income_log > 9.5:
            prob += 0.1
        if loan_log < 5.0:
            prob += 0.1
        
        prob = min(prob, 0.95)
        y.append('Y' if np.random.random() < prob else 'N')
    
    return X, np.array(y), list(data.keys())

# Initialize and train models
X, y, feature_names = generate_training_data(2000)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# Train multiple models
models = {
    'RandomForest': RandomForestClassifier(n_estimators=100, random_state=42),
    'LogisticRegression': LogisticRegression(max_iter=1000, random_state=42),
    'DecisionTree': DecisionTreeClassifier(random_state=42),
    'GradientBoosting': GradientBoostingClassifier(random_state=42),
}

model_scores = {}
for name, model in models.items():
    model.fit(X_train, y_train)
    model_scores[name] = round(model.score(X_test, y_test) * 100, 2)

# Use RandomForest as primary model (typically best performer)
primary_model = models['RandomForest']

logger.info(f"Models trained. Scores: {model_scores}")

# ==================== PYDANTIC MODELS ====================

class PredictionInput(BaseModel):
    gender: str
    married: str
    dependents: str
    education: str
    self_employed: str
    applicant_income: float
    coapplicant_income: float
    loan_amount: float
    loan_amount_term: float
    credit_history: int
    property_area: str

class PredictionResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    input_data: dict
    prediction: str
    confidence: float
    timestamp: str
    approved: bool

class PredictionHistory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    input_data: dict
    prediction: str
    confidence: float
    timestamp: str
    approved: bool

class ModelMetrics(BaseModel):
    model_name: str
    accuracy: float

class AnalyticsData(BaseModel):
    total_predictions: int
    approved_count: int
    rejected_count: int
    approval_rate: float
    avg_loan_amount: float
    avg_applicant_income: float
    model_scores: dict
    predictions_by_property: dict
    predictions_by_education: dict

# ==================== HELPER FUNCTIONS ====================

def prepare_features(input_data: PredictionInput) -> np.ndarray:
    """Convert input to feature array matching training data format."""
    
    # Log transformations (add small epsilon to avoid log(0))
    applicant_income_log = np.log(input_data.applicant_income + 1)
    coapplicant_income_log = np.log(input_data.coapplicant_income + 1)
    total_income = input_data.applicant_income + input_data.coapplicant_income
    total_income_log = np.log(total_income + 1)
    loan_amount_log = np.log(input_data.loan_amount + 1)
    loan_term_log = np.log(input_data.loan_amount_term + 1)
    
    # One-hot encoding
    features = [
        1 if input_data.gender == 'Male' else 0,  # Gender_Male
        1 if input_data.married == 'Yes' else 0,  # Married_Yes
        1 if input_data.dependents == '1' else 0,  # Dependents_1
        1 if input_data.dependents == '2' else 0,  # Dependents_2
        1 if input_data.dependents == '3+' else 0,  # Dependents_3+
        1 if input_data.education == 'Not Graduate' else 0,  # Education_Not Graduate
        1 if input_data.self_employed == 'Yes' else 0,  # Self_Employed_Yes
        1 if input_data.property_area == 'Semiurban' else 0,  # Property_Area_Semiurban
        1 if input_data.property_area == 'Urban' else 0,  # Property_Area_Urban
        input_data.credit_history,  # Credit_History
        applicant_income_log,  # ApplicantIncomeLog
        loan_amount_log,  # LoanAmountLog
        loan_term_log,  # Loan_Amount_Term_Log
        total_income_log,  # Total_Income_Log
    ]
    
    return np.array(features).reshape(1, -1)

# ==================== API ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Loan Prediction API", "status": "running"}

@api_router.post("/predict", response_model=PredictionResult)
async def predict_loan(input_data: PredictionInput):
    """Make a loan prediction and save to database."""
    try:
        features = prepare_features(input_data)
        
        # Get prediction and probability
        prediction = primary_model.predict(features)[0]
        probabilities = primary_model.predict_proba(features)[0]
        confidence = round(max(probabilities) * 100, 2)
        
        approved = prediction == 'Y'
        
        # Create result
        result = PredictionResult(
            input_data=input_data.model_dump(),
            prediction="Approved" if approved else "Rejected",
            confidence=confidence,
            timestamp=datetime.now(timezone.utc).isoformat(),
            approved=approved
        )
        
        # Save to MongoDB
        doc = result.model_dump()
        await db.predictions.insert_one(doc)
        
        return result
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/predictions", response_model=List[PredictionHistory])
async def get_predictions(limit: int = 50, status: Optional[str] = None):
    """Get prediction history."""
    query = {}
    if status == "approved":
        query["approved"] = True
    elif status == "rejected":
        query["approved"] = False
    
    predictions = await db.predictions.find(query, {"_id": 0}).sort("timestamp", -1).limit(limit).to_list(limit)
    return predictions

@api_router.get("/predictions/{prediction_id}", response_model=PredictionHistory)
async def get_prediction(prediction_id: str):
    """Get a specific prediction."""
    prediction = await db.predictions.find_one({"id": prediction_id}, {"_id": 0})
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return prediction

@api_router.delete("/predictions/{prediction_id}")
async def delete_prediction(prediction_id: str):
    """Delete a prediction."""
    result = await db.predictions.delete_one({"id": prediction_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return {"message": "Prediction deleted"}

@api_router.get("/model-metrics", response_model=List[ModelMetrics])
async def get_model_metrics():
    """Get accuracy scores for all trained models."""
    return [
        ModelMetrics(model_name=name, accuracy=score)
        for name, score in model_scores.items()
    ]

@api_router.get("/analytics", response_model=AnalyticsData)
async def get_analytics():
    """Get analytics data for dashboard."""
    predictions = await db.predictions.find({}, {"_id": 0}).to_list(1000)
    
    total = len(predictions)
    approved = sum(1 for p in predictions if p.get('approved', False))
    rejected = total - approved
    
    # Calculate averages
    loan_amounts = [p['input_data'].get('loan_amount', 0) for p in predictions if 'input_data' in p]
    incomes = [p['input_data'].get('applicant_income', 0) for p in predictions if 'input_data' in p]
    
    avg_loan = round(sum(loan_amounts) / len(loan_amounts), 2) if loan_amounts else 0
    avg_income = round(sum(incomes) / len(incomes), 2) if incomes else 0
    
    # Group by property area
    property_stats = {'Urban': {'approved': 0, 'rejected': 0}, 
                      'Semiurban': {'approved': 0, 'rejected': 0}, 
                      'Rural': {'approved': 0, 'rejected': 0}}
    for p in predictions:
        area = p.get('input_data', {}).get('property_area', 'Unknown')
        if area in property_stats:
            if p.get('approved'):
                property_stats[area]['approved'] += 1
            else:
                property_stats[area]['rejected'] += 1
    
    # Group by education
    education_stats = {'Graduate': {'approved': 0, 'rejected': 0}, 
                       'Not Graduate': {'approved': 0, 'rejected': 0}}
    for p in predictions:
        edu = p.get('input_data', {}).get('education', 'Unknown')
        if edu in education_stats:
            if p.get('approved'):
                education_stats[edu]['approved'] += 1
            else:
                education_stats[edu]['rejected'] += 1
    
    return AnalyticsData(
        total_predictions=total,
        approved_count=approved,
        rejected_count=rejected,
        approval_rate=round((approved / total * 100) if total > 0 else 0, 2),
        avg_loan_amount=avg_loan,
        avg_applicant_income=avg_income,
        model_scores=model_scores,
        predictions_by_property=property_stats,
        predictions_by_education=education_stats
    )

@api_router.get("/stats")
async def get_quick_stats():
    """Get quick stats for dashboard."""
    total = await db.predictions.count_documents({})
    approved = await db.predictions.count_documents({"approved": True})
    rejected = total - approved
    
    return {
        "total_predictions": total,
        "approved": approved,
        "rejected": rejected,
        "approval_rate": round((approved / total * 100) if total > 0 else 0, 2)
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
