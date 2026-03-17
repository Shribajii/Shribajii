#!/usr/bin/env python3

import requests
import json
import sys
from datetime import datetime

class LoanPredictionAPITester:
    def __init__(self, base_url="https://loanapproval-ml.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.prediction_id = None

    def log(self, message):
        """Log message with timestamp"""
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {message}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        self.log(f"🔍 Testing {name}...")
        self.log(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=30)

            self.log(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                self.log(f"✅ {name} - PASSED")
                try:
                    return success, response.json() if response.text else {}
                except:
                    return success, {"raw_response": response.text}
            else:
                self.log(f"❌ {name} - FAILED")
                self.log(f"   Expected: {expected_status}, Got: {response.status_code}")
                try:
                    error_data = response.json()
                    self.log(f"   Error: {error_data}")
                except:
                    self.log(f"   Response: {response.text[:200]}")
                return False, {}

        except requests.exceptions.RequestException as e:
            self.log(f"❌ {name} - NETWORK ERROR: {str(e)}")
            return False, {}
        except Exception as e:
            self.log(f"❌ {name} - ERROR: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "/",
            200
        )
        if success:
            self.log(f"   Response: {response}")
        return success

    def test_get_stats(self):
        """Test GET /api/stats endpoint"""
        success, response = self.run_test(
            "Get Quick Stats",
            "GET",
            "/stats",
            200
        )
        if success:
            expected_fields = ['total_predictions', 'approved', 'rejected', 'approval_rate']
            missing_fields = [field for field in expected_fields if field not in response]
            if missing_fields:
                self.log(f"⚠️  Missing fields in stats: {missing_fields}")
            else:
                self.log(f"   Stats: {response}")
        return success

    def test_get_model_metrics(self):
        """Test GET /api/model-metrics endpoint"""
        success, response = self.run_test(
            "Get Model Metrics",
            "GET",
            "/model-metrics",
            200
        )
        if success:
            if isinstance(response, list) and len(response) > 0:
                models = [item.get('model_name') for item in response]
                self.log(f"   Models: {models}")
                expected_models = ['RandomForest', 'LogisticRegression', 'DecisionTree', 'GradientBoosting']
                missing_models = [model for model in expected_models if model not in models]
                if missing_models:
                    self.log(f"⚠️  Missing models: {missing_models}")
            else:
                self.log(f"⚠️  Empty or invalid model metrics response")
        return success

    def test_create_prediction(self):
        """Test POST /api/predict endpoint"""
        test_data = {
            "gender": "Male",
            "married": "Yes",
            "dependents": "1",
            "education": "Graduate",
            "self_employed": "No",
            "applicant_income": 5000.0,
            "coapplicant_income": 2000.0,
            "loan_amount": 150000.0,
            "loan_amount_term": 360.0,
            "credit_history": 1,
            "property_area": "Urban"
        }
        
        success, response = self.run_test(
            "Create Prediction",
            "POST",
            "/predict",
            200,
            data=test_data
        )
        
        if success:
            expected_fields = ['id', 'input_data', 'prediction', 'confidence', 'timestamp', 'approved']
            missing_fields = [field for field in expected_fields if field not in response]
            if missing_fields:
                self.log(f"⚠️  Missing fields in prediction response: {missing_fields}")
            else:
                self.prediction_id = response.get('id')
                self.log(f"   Prediction: {response.get('prediction')} ({response.get('confidence')}% confidence)")
                self.log(f"   Approved: {response.get('approved')}")
                self.log(f"   Prediction ID: {self.prediction_id}")
        return success

    def test_get_predictions(self):
        """Test GET /api/predictions endpoint"""
        success, response = self.run_test(
            "Get Predictions List",
            "GET",
            "/predictions?limit=10",
            200
        )
        if success:
            if isinstance(response, list):
                self.log(f"   Retrieved {len(response)} predictions")
                if len(response) > 0:
                    sample = response[0]
                    self.log(f"   Sample prediction keys: {list(sample.keys())}")
            else:
                self.log(f"⚠️  Expected list, got: {type(response)}")
        return success

    def test_get_specific_prediction(self):
        """Test GET /api/predictions/{id} endpoint"""
        if not self.prediction_id:
            self.log("⚠️  Skipping specific prediction test - no prediction ID available")
            return True
            
        success, response = self.run_test(
            "Get Specific Prediction",
            "GET",
            f"/predictions/{self.prediction_id}",
            200
        )
        if success:
            self.log(f"   Retrieved prediction: {response.get('prediction')} ({response.get('confidence')}%)")
        return success

    def test_get_analytics(self):
        """Test GET /api/analytics endpoint"""
        success, response = self.run_test(
            "Get Analytics Data",
            "GET",
            "/analytics",
            200
        )
        if success:
            expected_fields = [
                'total_predictions', 'approved_count', 'rejected_count', 'approval_rate',
                'avg_loan_amount', 'avg_applicant_income', 'model_scores',
                'predictions_by_property', 'predictions_by_education'
            ]
            missing_fields = [field for field in expected_fields if field not in response]
            if missing_fields:
                self.log(f"⚠️  Missing fields in analytics: {missing_fields}")
            else:
                self.log(f"   Total predictions: {response.get('total_predictions')}")
                self.log(f"   Approval rate: {response.get('approval_rate')}%")
                self.log(f"   Avg loan amount: ${response.get('avg_loan_amount')}")
        return success

    def test_filtered_predictions(self):
        """Test GET /api/predictions with status filter"""
        success_approved, _ = self.run_test(
            "Get Approved Predictions",
            "GET",
            "/predictions?status=approved&limit=5",
            200
        )
        
        success_rejected, _ = self.run_test(
            "Get Rejected Predictions", 
            "GET",
            "/predictions?status=rejected&limit=5",
            200
        )
        
        return success_approved and success_rejected

    def test_delete_prediction(self):
        """Test DELETE /api/predictions/{id} endpoint"""
        if not self.prediction_id:
            self.log("⚠️  Skipping delete test - no prediction ID available")
            return True
            
        success, response = self.run_test(
            "Delete Prediction",
            "DELETE",
            f"/predictions/{self.prediction_id}",
            200
        )
        if success:
            self.log(f"   Deletion response: {response}")
        return success

    def run_all_tests(self):
        """Run all API tests"""
        self.log("🚀 Starting Loan Prediction API Tests")
        self.log(f"📡 Base URL: {self.base_url}")
        
        # Test all endpoints
        tests = [
            self.test_root_endpoint,
            self.test_get_stats,
            self.test_get_model_metrics,
            self.test_create_prediction,
            self.test_get_predictions,
            self.test_get_specific_prediction,
            self.test_get_analytics,
            self.test_filtered_predictions,
            self.test_delete_prediction
        ]
        
        failed_tests = []
        for test in tests:
            try:
                if not test():
                    failed_tests.append(test.__name__)
            except Exception as e:
                self.log(f"❌ {test.__name__} - EXCEPTION: {str(e)}")
                failed_tests.append(test.__name__)
        
        # Print summary
        self.log(f"\n📊 Test Results Summary:")
        self.log(f"   Tests Run: {self.tests_run}")
        self.log(f"   Tests Passed: {self.tests_passed}")
        self.log(f"   Tests Failed: {self.tests_run - self.tests_passed}")
        self.log(f"   Success Rate: {(self.tests_passed / self.tests_run * 100):.1f}%")
        
        if failed_tests:
            self.log(f"\n❌ Failed Tests:")
            for test in failed_tests:
                self.log(f"   - {test}")
        else:
            self.log(f"\n✅ All tests passed!")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test execution"""
    tester = LoanPredictionAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())