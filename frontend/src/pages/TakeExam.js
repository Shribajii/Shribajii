import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext, API } from '../App';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import axios from 'axios';
import { toast } from 'sonner';
import { Clock, ChevronLeft, ChevronRight, Send, AlertCircle } from 'lucide-react';

function TakeExam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExam();
  }, []);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchExam = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/exams/${examId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setExam(response.data);
      setQuestions(response.data.questions || []);
      setTimeLeft(response.data.duration_minutes * 60);
    } catch (error) {
      toast.error('Failed to load exam');
      navigate('/student');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    if (submitting) return;

    const unanswered = questions.filter(q => !answers[q.id]).length;
    if (unanswered > 0) {
      const confirm = window.confirm(`You have ${unanswered} unanswered questions. Submit anyway?`);
      if (!confirm) return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const submission = {
        exam_id: examId,
        answers: questions.map(q => ({
          question_id: q.id,
          selected_answer: answers[q.id] || ''
        }))
      };

      const response = await axios.post(`${API}/exams/submit`, submission, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Exam submitted successfully!');
      navigate(`/result/${response.data.id}`);
    } catch (error) {
      toast.error('Failed to submit exam');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft > 300) return 'text-success';
    if (timeLeft > 60) return 'text-[#F97316]';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] sticky top-0 z-50" data-testid="exam-header">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-outfit text-xl font-bold text-[#0F172A]">{exam?.title}</h1>
            <p className="text-sm text-[#64748B]">{user.name}</p>
          </div>
          <div className={`flex items-center gap-2 font-mono text-2xl font-bold ${getTimerColor()} ${timeLeft < 60 ? 'timer-warning' : ''}`} data-testid="exam-timer">
            <Clock className="w-6 h-6" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <div>
            <Card className="border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)] mb-4" data-testid="question-card">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-primary/10 text-primary">Question {currentIndex + 1} of {questions.length}</Badge>
                    <Badge variant="outline">{currentQuestion?.question_type === 'mcq' ? 'Multiple Choice' : 'True/False'}</Badge>
                  </div>
                  <h2 className="text-xl font-outfit font-semibold text-[#0F172A] leading-relaxed" data-testid="question-text">
                    {currentQuestion?.question_text}
                  </h2>
                </div>

                <RadioGroup 
                  value={answers[currentQuestion?.id] || ''} 
                  onValueChange={(value) => handleAnswerChange(currentQuestion?.id, value)}
                  className="space-y-3"
                  data-testid="answer-options"
                >
                  {currentQuestion?.options?.map((option, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        answers[currentQuestion?.id] === option 
                          ? 'border-primary bg-primary/5' 
                          : 'border-[#E2E8F0] hover:border-primary/50 hover:bg-[#F8FAFC]'
                      }`}
                      data-testid={`option-${idx}`}
                    >
                      <RadioGroupItem value={option} id={`option-${idx}`} />
                      <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer text-base">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {!answers[currentQuestion?.id] && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-[#F97316]">
                    <AlertCircle className="w-4 h-4" />
                    Please select an answer
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                data-testid="previous-btn"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {currentIndex === questions.length - 1 ? (
                <Button 
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-secondary hover:bg-secondary/90"
                  data-testid="submit-exam-btn"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submitting ? 'Submitting...' : 'Submit Exam'}
                </Button>
              ) : (
                <Button 
                  onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                  data-testid="next-btn"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 h-fit" data-testid="question-navigator">
            <Card className="border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <CardContent className="p-6">
                <h3 className="font-outfit font-semibold text-[#0F172A] mb-4">Question Navigator</h3>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`question-nav-button w-10 h-10 rounded-lg font-semibold text-sm ${
                        idx === currentIndex
                          ? 'bg-primary text-white'
                          : answers[q.id]
                          ? 'bg-success/20 text-success'
                          : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                      }`}
                      data-testid={`nav-btn-${idx}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <div className="mt-6 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-success/20"></div>
                    <span className="text-[#64748B]">Answered ({Object.keys(answers).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#F8FAFC] border border-[#E2E8F0]"></div>
                    <span className="text-[#64748B]">Not Answered ({questions.length - Object.keys(answers).length})</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TakeExam;
