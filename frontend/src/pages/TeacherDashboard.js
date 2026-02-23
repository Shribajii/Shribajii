import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, API } from '../App';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import axios from 'axios';
import { toast } from 'sonner';
import { LogOut, Plus, BookOpen, FileText, BarChart3, Trash2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function TeacherDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [showExamDialog, setShowExamDialog] = useState(false);

  const [questionForm, setQuestionForm] = useState({
    question_text: '',
    question_type: 'mcq',
    options: ['', '', '', ''],
    correct_answer: '',
    subject: '',
    difficulty: 'medium'
  });

  const [examForm, setExamForm] = useState({
    title: '',
    description: '',
    duration_minutes: 30,
    total_marks: 100,
    passing_marks: 40,
    subject: '',
    question_ids: [],
    randomize_questions: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [questionsRes, examsRes, resultsRes] = await Promise.all([
        axios.get(`${API}/questions`, { headers }),
        axios.get(`${API}/exams`, { headers }),
        axios.get(`${API}/results`, { headers })
      ]);
      
      setQuestions(questionsRes.data);
      setExams(examsRes.data);
      setResults(resultsRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const payload = { ...questionForm };
      if (questionForm.question_type === 'true_false') {
        payload.options = ['True', 'False'];
      }
      
      await axios.post(`${API}/questions`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Question created successfully!');
      setShowQuestionDialog(false);
      setQuestionForm({
        question_text: '',
        question_type: 'mcq',
        options: ['', '', '', ''],
        correct_answer: '',
        subject: '',
        difficulty: 'medium'
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to create question');
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    
    if (examForm.question_ids.length === 0) {
      toast.error('Please select at least one question');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/exams`, examForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Exam created successfully!');
      setShowExamDialog(false);
      setExamForm({
        title: '',
        description: '',
        duration_minutes: 30,
        total_marks: 100,
        passing_marks: 40,
        subject: '',
        question_ids: [],
        randomize_questions: true
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to create exam');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/questions/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Question deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete question');
    }
  };

  const handleDeleteExam = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/exams/${examId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Exam deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete exam');
    }
  };

  const toggleQuestionSelection = (questionId) => {
    setExamForm(prev => ({
      ...prev,
      question_ids: prev.question_ids.includes(questionId)
        ? prev.question_ids.filter(id => id !== questionId)
        : [...prev.question_ids, questionId]
    }));
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
      <nav className="bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.location.href = '/'} 
              className="flex items-center gap-2 hover:opacity-70 transition-opacity"
              data-testid="home-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span className="text-sm font-medium text-[#64748B]">Home</span>
            </button>
            <div className="h-6 w-px bg-[#E2E8F0]"></div>
            <h1 className="font-outfit text-2xl font-bold text-[#0F172A] tracking-tight">ExamPro Teacher</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#64748B]">Welcome, <strong>{user.name}</strong></span>
            <Button variant="outline" size="sm" onClick={logout} data-testid="logout-btn">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="mb-8">
          <h2 className="font-outfit text-4xl font-bold text-[#0F172A] mb-2 tracking-tight">Teacher Dashboard</h2>
          <p className="text-[#64748B]">Manage questions, create exams, and view student results</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="card-hover border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Total Questions</p>
                    <p className="font-outfit text-3xl font-bold text-primary">{questions.length}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-7 h-7 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="card-hover border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Total Exams</p>
                    <p className="font-outfit text-3xl font-bold text-secondary">{exams.length}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                    <FileText className="w-7 h-7 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="card-hover border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Total Submissions</p>
                    <p className="font-outfit text-3xl font-bold text-success">{results.length}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center">
                    <BarChart3 className="w-7 h-7 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="bg-white border border-[#E2E8F0]">
            <TabsTrigger value="questions" data-testid="questions-tab">Question Bank</TabsTrigger>
            <TabsTrigger value="exams" data-testid="exams-tab">Exams</TabsTrigger>
            <TabsTrigger value="results" data-testid="results-tab">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-outfit text-2xl font-semibold">Question Bank</h3>
              <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90" data-testid="create-question-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Question
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Question</DialogTitle>
                    <DialogDescription>Add a new question to your question bank</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateQuestion} className="space-y-4">
                    <div>
                      <Label>Question Text</Label>
                      <Textarea
                        value={questionForm.question_text}
                        onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                        required
                        rows={3}
                        data-testid="question-text-input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Question Type</Label>
                        <select
                          value={questionForm.question_type}
                          onChange={(e) => setQuestionForm({ ...questionForm, question_type: e.target.value })}
                          className="w-full px-3 py-2 border border-input rounded-lg"
                          data-testid="question-type-select"
                        >
                          <option value="mcq">Multiple Choice</option>
                          <option value="true_false">True/False</option>
                        </select>
                      </div>
                      <div>
                        <Label>Subject</Label>
                        <Input
                          value={questionForm.subject}
                          onChange={(e) => setQuestionForm({ ...questionForm, subject: e.target.value })}
                          required
                          data-testid="question-subject-input"
                        />
                      </div>
                    </div>
                    {questionForm.question_type === 'mcq' && (
                      <div>
                        <Label>Options</Label>
                        {questionForm.options.map((opt, idx) => (
                          <Input
                            key={idx}
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...questionForm.options];
                              newOpts[idx] = e.target.value;
                              setQuestionForm({ ...questionForm, options: newOpts });
                            }}
                            placeholder={`Option ${idx + 1}`}
                            className="mb-2"
                            required
                            data-testid={`question-option-${idx}`}
                          />
                        ))}
                      </div>
                    )}
                    <div>
                      <Label>Correct Answer</Label>
                      {questionForm.question_type === 'true_false' ? (
                        <select
                          value={questionForm.correct_answer}
                          onChange={(e) => setQuestionForm({ ...questionForm, correct_answer: e.target.value })}
                          className="w-full px-3 py-2 border border-input rounded-lg"
                          required
                          data-testid="correct-answer-select"
                        >
                          <option value="">Select correct answer</option>
                          <option value="True">True</option>
                          <option value="False">False</option>
                        </select>
                      ) : (
                        <select
                          value={questionForm.correct_answer}
                          onChange={(e) => setQuestionForm({ ...questionForm, correct_answer: e.target.value })}
                          className="w-full px-3 py-2 border border-input rounded-lg"
                          required
                          data-testid="correct-answer-select"
                        >
                          <option value="">Select correct answer</option>
                          {questionForm.options.filter(o => o).map((opt, idx) => (
                            <option key={idx} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <Button type="submit" className="w-full" data-testid="submit-question-btn">Create Question</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {questions.map((q) => (
                <Card key={q.id} className="border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]" data-testid={`question-card-${q.id}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-primary/10 text-primary">{q.subject}</Badge>
                          <Badge variant="outline">{q.question_type === 'mcq' ? 'MCQ' : 'True/False'}</Badge>
                        </div>
                        <p className="font-outfit font-semibold text-[#0F172A] mb-2">{q.question_text}</p>
                        <p className="text-sm text-[#64748B]">Correct Answer: <strong>{q.correct_answer}</strong></p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteQuestion(q.id)} data-testid={`delete-question-${q.id}`}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="exams" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-outfit text-2xl font-semibold">Exams</h3>
              <Dialog open={showExamDialog} onOpenChange={setShowExamDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-secondary hover:bg-secondary/90" data-testid="create-exam-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Exam
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Exam</DialogTitle>
                    <DialogDescription>Configure and create a new exam</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateExam} className="space-y-4">
                    <div>
                      <Label>Exam Title</Label>
                      <Input
                        value={examForm.title}
                        onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                        required
                        data-testid="exam-title-input"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={examForm.description}
                        onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                        required
                        data-testid="exam-description-input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Duration (minutes)</Label>
                        <Input
                          type="number"
                          value={examForm.duration_minutes}
                          onChange={(e) => setExamForm({ ...examForm, duration_minutes: parseInt(e.target.value) })}
                          required
                          data-testid="exam-duration-input"
                        />
                      </div>
                      <div>
                        <Label>Subject</Label>
                        <Input
                          value={examForm.subject}
                          onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
                          required
                          data-testid="exam-subject-input"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Total Marks</Label>
                        <Input
                          type="number"
                          value={examForm.total_marks}
                          onChange={(e) => setExamForm({ ...examForm, total_marks: parseInt(e.target.value) })}
                          required
                          data-testid="exam-total-marks-input"
                        />
                      </div>
                      <div>
                        <Label>Passing Marks</Label>
                        <Input
                          type="number"
                          value={examForm.passing_marks}
                          onChange={(e) => setExamForm({ ...examForm, passing_marks: parseInt(e.target.value) })}
                          required
                          data-testid="exam-passing-marks-input"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="mb-2 block">Select Questions ({examForm.question_ids.length} selected)</Label>
                      <div className="max-h-60 overflow-y-auto space-y-2 border border-[#E2E8F0] rounded-lg p-4">
                        {questions.map((q) => (
                          <div
                            key={q.id}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              examForm.question_ids.includes(q.id)
                                ? 'bg-primary/10 border-2 border-primary'
                                : 'bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#EEF2FF]'
                            }`}
                            onClick={() => toggleQuestionSelection(q.id)}
                            data-testid={`select-question-${q.id}`}
                          >
                            <p className="text-sm font-semibold">{q.question_text}</p>
                            <Badge className="mt-1 text-xs">{q.subject}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button type="submit" className="w-full" data-testid="submit-exam-btn">Create Exam</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {exams.map((exam) => (
                <Card key={exam.id} className="border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]" data-testid={`exam-card-${exam.id}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-secondary/10 text-secondary">{exam.subject}</Badge>
                          <Badge variant="outline">{exam.question_ids.length} questions</Badge>
                        </div>
                        <h3 className="font-outfit font-semibold text-[#0F172A] mb-1">{exam.title}</h3>
                        <p className="text-sm text-[#64748B] mb-3">{exam.description}</p>
                        <div className="flex gap-4 text-sm text-[#64748B]">
                          <span>Duration: {exam.duration_minutes} min</span>
                          <span>Passing: {exam.passing_marks}/{exam.total_marks}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteExam(exam.id)} data-testid={`delete-exam-${exam.id}`}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <h3 className="font-outfit text-2xl font-semibold">Student Results</h3>
            <div className="grid gap-4">
              {results.map((result) => (
                <Card key={result.id} className="border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]" data-testid={`result-card-${result.id}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-outfit font-semibold text-[#0F172A] mb-1">{result.student_name}</h3>
                        <p className="text-sm text-[#64748B] mb-2">{result.exam_title}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold font-mono" style={{ color: result.passed ? '#10B981' : '#EF4444' }}>
                            {result.percentage}%
                          </span>
                          <Badge className={result.passed ? 'bg-success text-white' : 'bg-red-600 text-white'}>
                            Grade {result.grade}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/result/${result.id}`)} data-testid={`view-result-${result.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default TeacherDashboard;
