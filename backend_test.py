import requests
import sys
import json
from datetime import datetime

class ExamSystemAPITester:
    def __init__(self, base_url="https://resultpro.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tokens = {}  # Store tokens for different roles
        self.users = {}   # Store user data for different roles
        self.test_data = {}  # Store created test data
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
            self.failed_tests.append({"test": name, "error": details})

    def make_request(self, method, endpoint, data=None, role=None, expect_status=200):
        """Make API request with proper headers"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if role and role in self.tokens:
            headers['Authorization'] = f'Bearer {self.tokens[role]}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)
            
            success = response.status_code == expect_status
            return success, response.json() if success else {}, response.status_code
        except Exception as e:
            return False, {}, str(e)

    def test_user_registration(self):
        """Test user registration for all roles"""
        print("\n🔍 Testing User Registration...")
        
        roles = ['student', 'teacher', 'admin']
        for role in roles:
            user_data = {
                "name": f"Test {role.title()}",
                "email": f"test_{role}@example.com",
                "password": "TestPass123!",
                "role": role
            }
            
            success, response, status = self.make_request('POST', 'auth/register', user_data, expect_status=200)
            
            if success:
                self.users[role] = response
                self.log_test(f"Register {role}", True)
            else:
                self.log_test(f"Register {role}", False, f"Status: {status}")

    def test_user_login(self):
        """Test user login for all roles"""
        print("\n🔍 Testing User Login...")
        
        for role in ['student', 'teacher', 'admin']:
            login_data = {
                "email": f"test_{role}@example.com",
                "password": "TestPass123!"
            }
            
            success, response, status = self.make_request('POST', 'auth/login', login_data, expect_status=200)
            
            if success and 'access_token' in response:
                self.tokens[role] = response['access_token']
                self.log_test(f"Login {role}", True)
            else:
                self.log_test(f"Login {role}", False, f"Status: {status}")

    def test_auth_me(self):
        """Test get current user endpoint"""
        print("\n🔍 Testing Auth Me Endpoint...")
        
        for role in ['student', 'teacher', 'admin']:
            if role in self.tokens:
                success, response, status = self.make_request('GET', 'auth/me', role=role)
                
                if success and response.get('role') == role:
                    self.log_test(f"Auth me - {role}", True)
                else:
                    self.log_test(f"Auth me - {role}", False, f"Status: {status}")

    def test_question_management(self):
        """Test question CRUD operations"""
        print("\n🔍 Testing Question Management...")
        
        # Test create question (teacher role)
        question_data = {
            "question_text": "What is 2 + 2?",
            "question_type": "mcq",
            "options": ["2", "3", "4", "5"],
            "correct_answer": "4",
            "subject": "Mathematics",
            "difficulty": "easy"
        }
        
        success, response, status = self.make_request('POST', 'questions', question_data, role='teacher')
        
        if success:
            self.test_data['question_id'] = response['id']
            self.log_test("Create question", True)
        else:
            self.log_test("Create question", False, f"Status: {status}")

        # Test create true/false question
        tf_question = {
            "question_text": "The Earth is round.",
            "question_type": "true_false",
            "options": ["True", "False"],
            "correct_answer": "True",
            "subject": "Geography",
            "difficulty": "easy"
        }
        
        success, response, status = self.make_request('POST', 'questions', tf_question, role='teacher')
        
        if success:
            self.test_data['tf_question_id'] = response['id']
            self.log_test("Create true/false question", True)
        else:
            self.log_test("Create true/false question", False, f"Status: {status}")

        # Test get questions
        success, response, status = self.make_request('GET', 'questions', role='teacher')
        
        if success and isinstance(response, list):
            self.log_test("Get questions", True)
        else:
            self.log_test("Get questions", False, f"Status: {status}")

        # Test student cannot create questions
        success, response, status = self.make_request('POST', 'questions', question_data, role='student', expect_status=403)
        
        if success:
            self.log_test("Student cannot create questions", True)
        else:
            self.log_test("Student cannot create questions", False, "Student was able to create questions")

    def test_exam_management(self):
        """Test exam CRUD operations"""
        print("\n🔍 Testing Exam Management...")
        
        # Ensure we have questions to use
        if 'question_id' not in self.test_data or 'tf_question_id' not in self.test_data:
            self.log_test("Exam creation", False, "No questions available")
            return

        # Test create exam
        exam_data = {
            "title": "Sample Math Test",
            "description": "A basic mathematics test",
            "duration_minutes": 30,
            "total_marks": 100,
            "passing_marks": 40,
            "subject": "Mathematics",
            "question_ids": [self.test_data['question_id'], self.test_data['tf_question_id']],
            "randomize_questions": True
        }
        
        success, response, status = self.make_request('POST', 'exams', exam_data, role='teacher')
        
        if success:
            self.test_data['exam_id'] = response['id']
            self.log_test("Create exam", True)
        else:
            self.log_test("Create exam", False, f"Status: {status}")

        # Test get exams
        success, response, status = self.make_request('GET', 'exams', role='student')
        
        if success and isinstance(response, list):
            self.log_test("Get exams", True)
        else:
            self.log_test("Get exams", False, f"Status: {status}")

        # Test get exam details
        if 'exam_id' in self.test_data:
            success, response, status = self.make_request('GET', f'exams/{self.test_data["exam_id"]}', role='student')
            
            if success and 'questions' in response:
                # Verify student doesn't see correct answers
                has_correct_answer = any('correct_answer' in q for q in response['questions'])
                if not has_correct_answer:
                    self.log_test("Exam details (student view)", True)
                else:
                    self.log_test("Exam details (student view)", False, "Student can see correct answers")
            else:
                self.log_test("Exam details (student view)", False, f"Status: {status}")

    def test_exam_submission(self):
        """Test exam submission and result generation"""
        print("\n🔍 Testing Exam Submission...")
        
        if 'exam_id' not in self.test_data:
            self.log_test("Exam submission", False, "No exam available")
            return

        # Test exam submission
        submission_data = {
            "exam_id": self.test_data['exam_id'],
            "answers": [
                {
                    "question_id": self.test_data['question_id'],
                    "selected_answer": "4"
                },
                {
                    "question_id": self.test_data['tf_question_id'],
                    "selected_answer": "True"
                }
            ]
        }
        
        success, response, status = self.make_request('POST', 'exams/submit', submission_data, role='student')
        
        if success:
            self.test_data['result_id'] = response['id']
            self.log_test("Submit exam", True)
            
            # Verify result data
            if response.get('score') == 100 and response.get('grade') == 'A+':
                self.log_test("Result calculation", True)
            else:
                self.log_test("Result calculation", False, f"Unexpected score: {response.get('score')}")
        else:
            self.log_test("Submit exam", False, f"Status: {status}")

    def test_result_management(self):
        """Test result viewing and PDF generation"""
        print("\n🔍 Testing Result Management...")
        
        # Test get results
        success, response, status = self.make_request('GET', 'results', role='student')
        
        if success and isinstance(response, list):
            self.log_test("Get results", True)
        else:
            self.log_test("Get results", False, f"Status: {status}")

        # Test get specific result
        if 'result_id' in self.test_data:
            success, response, status = self.make_request('GET', f'results/{self.test_data["result_id"]}', role='student')
            
            if success:
                self.log_test("Get result details", True)
            else:
                self.log_test("Get result details", False, f"Status: {status}")

            # Test PDF download (just check endpoint exists)
            try:
                url = f"{self.api_url}/results/{self.test_data['result_id']}/download"
                headers = {'Authorization': f'Bearer {self.tokens["student"]}'}
                response = requests.get(url, headers=headers)
                
                if response.status_code == 200 and response.headers.get('content-type') == 'application/pdf':
                    self.log_test("PDF download", True)
                else:
                    self.log_test("PDF download", False, f"Status: {response.status_code}")
            except Exception as e:
                self.log_test("PDF download", False, str(e))

    def test_admin_endpoints(self):
        """Test admin-specific endpoints"""
        print("\n🔍 Testing Admin Endpoints...")
        
        # Test admin stats
        success, response, status = self.make_request('GET', 'admin/stats', role='admin')
        
        if success and 'total_students' in response:
            self.log_test("Admin stats", True)
        else:
            self.log_test("Admin stats", False, f"Status: {status}")

        # Test get all users
        success, response, status = self.make_request('GET', 'admin/users', role='admin')
        
        if success and isinstance(response, list):
            self.log_test("Admin get users", True)
        else:
            self.log_test("Admin get users", False, f"Status: {status}")

        # Test non-admin cannot access admin endpoints
        success, response, status = self.make_request('GET', 'admin/stats', role='student', expect_status=403)
        
        if success:
            self.log_test("Admin access control", True)
        else:
            self.log_test("Admin access control", False, "Student can access admin endpoints")

    def test_role_permissions(self):
        """Test role-based access control"""
        print("\n🔍 Testing Role Permissions...")
        
        # Test student cannot access teacher endpoints
        question_data = {
            "question_text": "Test question",
            "question_type": "mcq",
            "options": ["A", "B", "C", "D"],
            "correct_answer": "A",
            "subject": "Test",
            "difficulty": "easy"
        }
        
        success, response, status = self.make_request('POST', 'questions', question_data, role='student', expect_status=403)
        
        if success:
            self.log_test("Student question access control", True)
        else:
            self.log_test("Student question access control", False, "Student can create questions")

        # Test teacher cannot submit exams
        if 'exam_id' in self.test_data:
            submission_data = {
                "exam_id": self.test_data['exam_id'],
                "answers": []
            }
            
            success, response, status = self.make_request('POST', 'exams/submit', submission_data, role='teacher', expect_status=403)
            
            if success:
                self.log_test("Teacher exam submission control", True)
            else:
                self.log_test("Teacher exam submission control", False, "Teacher can submit exams")

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Exam System API Tests...")
        print(f"Testing against: {self.base_url}")
        
        # Run test suites in order
        self.test_user_registration()
        self.test_user_login()
        self.test_auth_me()
        self.test_question_management()
        self.test_exam_management()
        self.test_exam_submission()
        self.test_result_management()
        self.test_admin_endpoints()
        self.test_role_permissions()
        
        # Print summary
        print(f"\n📊 Test Summary:")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"  - {test['test']}: {test['error']}")
        
        return len(self.failed_tests) == 0

def main():
    tester = ExamSystemAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())