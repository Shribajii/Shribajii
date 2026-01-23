import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext, API } from '../App';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import axios from 'axios';
import { toast } from 'sonner';
import { Download, ArrowLeft, CheckCircle, XCircle, Award } from 'lucide-react';
import { motion } from 'framer-motion';

function ViewResult() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/results/${resultId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(response.data);
    } catch (error) {
      toast.error('Failed to load result');
      navigate(`/${user.role}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/results/${resultId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `result_${resultId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="bg-white/80 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-outfit text-2xl font-bold text-[#0F172A]">Exam Result</h1>
          <Button variant="outline" onClick={() => navigate(`/${user.role}`)} data-testid="back-btn">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 md:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)] mb-6" data-testid="result-summary">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  result.passed ? 'bg-success/10' : 'bg-red-100'
                }`}>
                  {result.passed ? (
                    <CheckCircle className="w-12 h-12 text-success" />
                  ) : (
                    <XCircle className="w-12 h-12 text-red-600" />
                  )}
                </div>
                <h2 className="font-outfit text-4xl font-bold text-[#0F172A] mb-2">{result.exam_title}</h2>
                <p className="text-[#64748B]">{result.student_name}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center p-4 bg-[#F8FAFC] rounded-2xl">
                  <p className="text-sm text-[#64748B] mb-1">Score</p>
                  <p className="text-3xl font-bold font-mono text-primary">{result.score}/{result.total_marks}</p>
                </div>
                <div className="text-center p-4 bg-[#F8FAFC] rounded-2xl">
                  <p className="text-sm text-[#64748B] mb-1">Percentage</p>
                  <p className="text-3xl font-bold font-mono text-secondary">{result.percentage}%</p>
                </div>
                <div className="text-center p-4 bg-[#F8FAFC] rounded-2xl">
                  <p className="text-sm text-[#64748B] mb-1">Grade</p>
                  <div className="flex items-center justify-center gap-2">
                    <Award className="w-6 h-6 text-[#F97316]" />
                    <p className="text-3xl font-bold font-outfit text-[#0F172A]">{result.grade}</p>
                  </div>
                </div>
                <div className="text-center p-4 bg-[#F8FAFC] rounded-2xl">
                  <p className="text-sm text-[#64748B] mb-1">Status</p>
                  <Badge className={`text-base px-4 py-1 ${
                    result.passed ? 'bg-success text-white' : 'bg-red-600 text-white'
                  }`}>
                    {result.passed ? 'PASSED' : 'FAILED'}
                  </Badge>
                </div>
              </div>

              <Button 
                onClick={downloadPDF} 
                disabled={downloading}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
                data-testid="download-pdf-btn"
              >
                <Download className="w-5 h-5 mr-2" />
                {downloading ? 'Downloading...' : 'Download PDF Report'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]" data-testid="answer-details">
            <CardHeader>
              <CardTitle className="font-outfit text-2xl font-semibold">Answer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.answers.map((answer, idx) => (
                <div 
                  key={idx} 
                  className={`p-6 rounded-2xl border-2 ${
                    answer.is_correct 
                      ? 'border-success/20 bg-success/5' 
                      : 'border-red-200 bg-red-50'
                  }`}
                  data-testid={`answer-detail-${idx}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      answer.is_correct ? 'bg-success/20' : 'bg-red-200'
                    }`}>
                      {answer.is_correct ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-outfit font-semibold text-[#0F172A] mb-3">
                        Q{idx + 1}. {answer.question_text}
                      </p>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-[#64748B]">Your Answer: </span>
                          <span className={`font-semibold ${
                            answer.is_correct ? 'text-success' : 'text-red-600'
                          }`}>
                            {answer.selected_answer || 'Not answered'}
                          </span>
                        </div>
                        {!answer.is_correct && (
                          <div>
                            <span className="text-sm text-[#64748B]">Correct Answer: </span>
                            <span className="font-semibold text-success">{answer.correct_answer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

export default ViewResult;
