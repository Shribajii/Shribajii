from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import os
import logging
import jwt
import bcrypt
from io import BytesIO
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Jinja2 for PDF templates
template_dir = ROOT_DIR / 'templates'
template_dir.mkdir(exist_ok=True)
env = Environment(loader=FileSystemLoader(str(template_dir)))

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

class UserBase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    email: EmailStr
    name: str
    role: str  # student, teacher, admin

class UserCreate(UserBase):
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str
    role: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class QuestionBase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    question_text: str
    question_type: str  # mcq, true_false
    options: List[str]  # For MCQ, for true_false will be ["True", "False"]
    correct_answer: str
    subject: str
    difficulty: str = "medium"

class QuestionCreate(QuestionBase):
    pass

class QuestionResponse(QuestionBase):
    id: str
    created_by: str
    created_at: datetime

class ExamBase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    title: str
    description: str
    duration_minutes: int
    total_marks: int
    passing_marks: int
    subject: str
    question_ids: List[str]
    randomize_questions: bool = True

class ExamCreate(ExamBase):
    pass

class ExamResponse(ExamBase):
    id: str
    created_by: str
    created_at: datetime

class AnswerSubmission(BaseModel):
    question_id: str
    selected_answer: str

class ExamSubmission(BaseModel):
    exam_id: str
    answers: List[AnswerSubmission]

class ResultResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    student_id: str
    student_name: str
    exam_id: str
    exam_title: str
    score: int
    total_marks: int
    percentage: float
    grade: str
    passed: bool
    answers: List[dict]
    submitted_at: datetime

# ==================== AUTH UTILITIES ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

async def get_current_user(authorization: str = None) -> dict:
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != 'bearer':
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication scheme")
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authorization header")
    
    payload = decode_token(token)
    user = await db.users.find_one({"email": payload.get("sub")}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

# ==================== CALCULATE GRADE ====================

def calculate_grade(percentage: float) -> str:
    if percentage >= 90:
        return "A+"
    elif percentage >= 80:
        return "A"
    elif percentage >= 70:
        return "B+"
    elif percentage >= 60:
        return "B"
    elif percentage >= 50:
        return "C"
    elif percentage >= 40:
        return "D"
    else:
        return "F"

# ==================== AUTH ENDPOINTS ====================

@api_router.post("/auth/register", response_model=UserResponse)
async def register(user: UserCreate):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    user_dict = user.model_dump()
    user_dict['password'] = hash_password(user_dict['password'])
    user_dict['created_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.users.insert_one(user_dict)
    user_dict['id'] = str(result.inserted_id)
    
    return UserResponse(
        id=user_dict['id'],
        email=user_dict['email'],
        name=user_dict['name'],
        role=user_dict['role']
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user['password']):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    token = create_access_token({"sub": user['email'], "role": user['role']})
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=str(user['_id']),
            email=user['email'],
            name=user['name'],
            role=user['role']
        )
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(authorization: str = None):
    user = await get_current_user(authorization)
    return UserResponse(
        id=str(user.get('_id', '')),
        email=user['email'],
        name=user['name'],
        role=user['role']
    )

# ==================== QUESTION BANK ENDPOINTS ====================

@api_router.post("/questions", response_model=QuestionResponse)
async def create_question(question: QuestionCreate, authorization: str = None):
    user = await get_current_user(authorization)
    if user['role'] not in ['teacher', 'admin']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only teachers can create questions")
    
    question_dict = question.model_dump()
    question_dict['created_by'] = user['email']
    question_dict['created_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.questions.insert_one(question_dict)
    question_dict['id'] = str(result.inserted_id)
    
    return QuestionResponse(**question_dict)

@api_router.get("/questions", response_model=List[QuestionResponse])
async def get_questions(authorization: str = None, subject: str = None):
    user = await get_current_user(authorization)
    if user['role'] not in ['teacher', 'admin']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    query = {}
    if subject:
        query['subject'] = subject
    
    questions = await db.questions.find(query, {"_id": 0}).to_list(1000)
    for q in questions:
        if '_id' in q:
            q['id'] = str(q['_id'])
    return questions

@api_router.delete("/questions/{question_id}")
async def delete_question(question_id: str, authorization: str = None):
    user = await get_current_user(authorization)
    if user['role'] not in ['teacher', 'admin']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    result = await db.questions.delete_one({"id": question_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    
    return {"message": "Question deleted successfully"}

# ==================== EXAM ENDPOINTS ====================

@api_router.post("/exams", response_model=ExamResponse)
async def create_exam(exam: ExamCreate, authorization: str = None):
    user = await get_current_user(authorization)
    if user['role'] not in ['teacher', 'admin']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only teachers can create exams")
    
    exam_dict = exam.model_dump()
    exam_dict['created_by'] = user['email']
    exam_dict['created_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.exams.insert_one(exam_dict)
    exam_dict['id'] = str(result.inserted_id)
    
    return ExamResponse(**exam_dict)

@api_router.get("/exams", response_model=List[ExamResponse])
async def get_exams(authorization: str = None):
    user = await get_current_user(authorization)
    
    exams = await db.exams.find({}, {"_id": 0}).to_list(1000)
    for exam in exams:
        if '_id' in exam:
            exam['id'] = str(exam['_id'])
    return exams

@api_router.get("/exams/{exam_id}")
async def get_exam_details(exam_id: str, authorization: str = None):
    user = await get_current_user(authorization)
    
    exam = await db.exams.find_one({"id": exam_id}, {"_id": 0})
    if not exam:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam not found")
    
    # Fetch questions
    questions = []
    for qid in exam['question_ids']:
        q = await db.questions.find_one({"id": qid}, {"_id": 0})
        if q:
            # Don't send correct answer to students
            if user['role'] == 'student':
                q.pop('correct_answer', None)
            questions.append(q)
    
    exam['questions'] = questions
    return exam

@api_router.delete("/exams/{exam_id}")
async def delete_exam(exam_id: str, authorization: str = None):
    user = await get_current_user(authorization)
    if user['role'] not in ['teacher', 'admin']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    result = await db.exams.delete_one({"id": exam_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam not found")
    
    return {"message": "Exam deleted successfully"}

# ==================== EXAM SUBMISSION & RESULTS ====================

@api_router.post("/exams/submit", response_model=ResultResponse)
async def submit_exam(submission: ExamSubmission, authorization: str = None):
    user = await get_current_user(authorization)
    if user['role'] != 'student':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only students can submit exams")
    
    # Get exam details
    exam = await db.exams.find_one({"id": submission.exam_id}, {"_id": 0})
    if not exam:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam not found")
    
    # Calculate score
    score = 0
    total_marks = exam['total_marks']
    marks_per_question = total_marks / len(exam['question_ids'])
    
    answer_details = []
    for answer in submission.answers:
        question = await db.questions.find_one({"id": answer.question_id}, {"_id": 0})
        if question:
            is_correct = answer.selected_answer == question['correct_answer']
            if is_correct:
                score += marks_per_question
            
            answer_details.append({
                "question_id": answer.question_id,
                "question_text": question['question_text'],
                "selected_answer": answer.selected_answer,
                "correct_answer": question['correct_answer'],
                "is_correct": is_correct
            })
    
    percentage = (score / total_marks) * 100
    grade = calculate_grade(percentage)
    passed = score >= exam['passing_marks']
    
    # Save result
    result_dict = {
        "id": f"result_{datetime.now(timezone.utc).timestamp()}",
        "student_id": user['email'],
        "student_name": user['name'],
        "exam_id": submission.exam_id,
        "exam_title": exam['title'],
        "score": int(score),
        "total_marks": total_marks,
        "percentage": round(percentage, 2),
        "grade": grade,
        "passed": passed,
        "answers": answer_details,
        "submitted_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.results.insert_one(result_dict)
    
    return ResultResponse(**result_dict)

@api_router.get("/results", response_model=List[ResultResponse])
async def get_results(authorization: str = None):
    user = await get_current_user(authorization)
    
    if user['role'] == 'student':
        results = await db.results.find({"student_id": user['email']}, {"_id": 0}).to_list(1000)
    else:
        results = await db.results.find({}, {"_id": 0}).to_list(1000)
    
    return results

@api_router.get("/results/{result_id}", response_model=ResultResponse)
async def get_result_details(result_id: str, authorization: str = None):
    user = await get_current_user(authorization)
    
    result = await db.results.find_one({"id": result_id}, {"_id": 0})
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Result not found")
    
    # Students can only view their own results
    if user['role'] == 'student' and result['student_id'] != user['email']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    return ResultResponse(**result)

# ==================== PDF REPORT GENERATION ====================

@api_router.get("/results/{result_id}/download")
async def download_result_pdf(result_id: str, authorization: str = None):
    user = await get_current_user(authorization)
    
    result = await db.results.find_one({"id": result_id}, {"_id": 0})
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Result not found")
    
    if user['role'] == 'student' and result['student_id'] != user['email']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    # Generate PDF
    try:
        html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page {{ size: A4; margin: 2cm; }}
        body {{ font-family: 'Arial', sans-serif; color: #0F172A; }}
        .header {{ text-align: center; border-bottom: 4px solid #2563EB; padding-bottom: 20px; margin-bottom: 30px; }}
        .header h1 {{ color: #2563EB; font-size: 32px; margin: 0; }}
        .info-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; background: #F8FAFC; padding: 20px; border-radius: 10px; }}
        .info-item {{ display: flex; justify-content: space-between; }}
        .label {{ font-weight: bold; color: #2563EB; }}
        .value {{ color: #64748B; }}
        .score-card {{ background: #F8FAFC; padding: 20px; border-radius: 10px; margin-bottom: 30px; text-align: center; }}
        .score {{ font-size: 48px; font-weight: bold; color: {"#10B981" if result['passed'] else "#EF4444"}; }}
        .grade {{ font-size: 32px; color: #2563EB; margin: 10px 0; }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
        th {{ background: #2563EB; color: white; padding: 12px; text-align: left; }}
        td {{ padding: 12px; border-bottom: 1px solid #E2E8F0; }}
        .correct {{ color: #10B981; font-weight: bold; }}
        .incorrect {{ color: #EF4444; font-weight: bold; }}
        .footer {{ margin-top: 40px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 20px; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>Exam Result Report</h1>
        <p>Online Examination System</p>
    </div>
    
    <div class="info-grid">
        <div class="info-item"><span class="label">Student Name:</span><span class="value">{result['student_name']}</span></div>
        <div class="info-item"><span class="label">Student ID:</span><span class="value">{result['student_id']}</span></div>
        <div class="info-item"><span class="label">Exam Title:</span><span class="value">{result['exam_title']}</span></div>
        <div class="info-item"><span class="label">Date:</span><span class="value">{datetime.fromisoformat(result['submitted_at']).strftime('%B %d, %Y')}</span></div>
    </div>
    
    <div class="score-card">
        <div class="score">{result['score']}/{result['total_marks']}</div>
        <div class="grade">Grade: {result['grade']}</div>
        <p style="font-size: 18px; color: #64748B;">Percentage: {result['percentage']}%</p>
        <p style="font-size: 20px; font-weight: bold; color: {"#10B981" if result['passed'] else "#EF4444"};">{"PASSED" if result['passed'] else "FAILED"}</p>
    </div>
    
    <h2 style="color: #2563EB; margin-top: 30px;">Answer Details</h2>
    <table>
        <thead>
            <tr>
                <th>Question</th>
                <th>Your Answer</th>
                <th>Correct Answer</th>
                <th>Result</th>
            </tr>
        </thead>
        <tbody>
"""
        
        for i, answer in enumerate(result['answers'], 1):
            status_class = "correct" if answer['is_correct'] else "incorrect"
            status_text = "✓ Correct" if answer['is_correct'] else "✗ Incorrect"
            html_content += f"""
            <tr>
                <td>{i}. {answer['question_text']}</td>
                <td>{answer['selected_answer']}</td>
                <td>{answer['correct_answer']}</td>
                <td class="{status_class}">{status_text}</td>
            </tr>
"""
        
        html_content += f"""
        </tbody>
    </table>
    
    <div class="footer">
        <p>This is an automatically generated report.</p>
        <p>Generated on: {datetime.now(timezone.utc).strftime('%B %d, %Y at %H:%M:%S UTC')}</p>
    </div>
</body>
</html>
"""
        
        pdf_bytes = HTML(string=html_content).write_pdf()
        
        return StreamingResponse(
            iter([pdf_bytes]),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=result_{result_id}.pdf"}
        )
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"PDF generation failed: {str(e)}")

# ==================== ADMIN ENDPOINTS ====================

@api_router.get("/admin/stats")
async def get_admin_stats(authorization: str = None):
    user = await get_current_user(authorization)
    if user['role'] != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access only")
    
    total_students = await db.users.count_documents({"role": "student"})
    total_teachers = await db.users.count_documents({"role": "teacher"})
    total_exams = await db.exams.count_documents({})
    total_questions = await db.questions.count_documents({})
    total_results = await db.results.count_documents({})
    
    return {
        "total_students": total_students,
        "total_teachers": total_teachers,
        "total_exams": total_exams,
        "total_questions": total_questions,
        "total_results": total_results
    }

@api_router.get("/admin/users")
async def get_all_users(authorization: str = None):
    user = await get_current_user(authorization)
    if user['role'] != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access only")
    
    users = await db.users.find({}, {"_id": 0, "password": 0}).to_list(1000)
    return users

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
