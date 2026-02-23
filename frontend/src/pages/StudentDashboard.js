import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, API } from '../App';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { LogOut, BookOpen, Clock, Award, TrendingUp, FileText, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [examsRes, resultsRes] = await Promise.all([
        axios.get(`${API}/exams`, { headers }),
        axios.get(`${API}/results`, { headers })
      ]);
      
      setExams(examsRes.data);
      setResults(resultsRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableExams = () => {
    const completedExamIds = results.map(r => r.exam_id);
    return exams.filter(exam => !completedExamIds.includes(exam.id));
  };

  const calculateStats = () => {
    if (results.length === 0) return { avgScore: 0, totalExams: 0, passedExams: 0 };
    
    const totalExams = results.length;
    const passedExams = results.filter(r => r.passed).length;
    const avgScore = results.reduce((sum, r) => sum + r.percentage, 0) / totalExams;
    
    return { avgScore: avgScore.toFixed(1), totalExams, passedExams };
  };

  const stats = calculateStats();

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
            <h1 className="font-outfit text-2xl font-bold text-[#0F172A] tracking-tight">ExamPro</h1>
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
          <h2 className="font-outfit text-4xl font-bold text-[#0F172A] mb-2 tracking-tight">Student Dashboard</h2>
          <p className="text-[#64748B]">Track your exams and view your performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="card-hover border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Average Score</p>
                    <p className="font-outfit text-3xl font-bold text-primary">{stats.avgScore}%</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-primary" />
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
                    <p className="font-outfit text-3xl font-bold text-secondary">{stats.totalExams}</p>
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
                    <p className="text-sm text-[#64748B] mb-1">Passed Exams</p>
                    <p className="font-outfit text-3xl font-bold text-success">{stats.passedExams}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center">
                    <Award className="w-7 h-7 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]" data-testid="available-exams-section">
            <CardHeader>
              <CardTitle className="font-outfit text-2xl font-semibold flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                Available Exams
              </CardTitle>
              <CardDescription>Start taking your exams</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {getAvailableExams().length === 0 ? (
                <p className="text-[#64748B] text-center py-8">No exams available at the moment</p>
              ) : (
                getAvailableExams().map((exam) => (
                  <div key={exam.id} className="p-4 bg-[#F8FAFC] rounded-2xl hover:bg-[#EEF2FF] transition-colors" data-testid={`exam-card-${exam.id}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-outfit font-semibold text-[#0F172A] mb-1">{exam.title}</h3>
                        <p className="text-sm text-[#64748B]">{exam.description}</p>
                      </div>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{exam.subject}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-[#64748B]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {exam.duration_minutes} min
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {exam.question_ids.length} questions
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-secondary hover:bg-secondary/90"
                        onClick={() => navigate(`/exam/${exam.id}`)}
                        data-testid={`start-exam-btn-${exam.id}`}
                      >
                        Start Exam
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]" data-testid="recent-results-section">
            <CardHeader>
              <CardTitle className="font-outfit text-2xl font-semibold flex items-center gap-2">
                <Award className="w-6 h-6 text-success" />
                Recent Results
              </CardTitle>
              <CardDescription>Your exam performance history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.length === 0 ? (
                <p className="text-[#64748B] text-center py-8">No results yet. Take an exam to see your performance!</p>
              ) : (
                results.slice(0, 5).map((result) => (
                  <div key={result.id} className="p-4 bg-[#F8FAFC] rounded-2xl hover:bg-[#EEF2FF] transition-colors cursor-pointer" onClick={() => navigate(`/result/${result.id}`)} data-testid={`result-card-${result.id}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-outfit font-semibold text-[#0F172A]">{result.exam_title}</h3>
                        <p className="text-xs text-[#64748B] flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(result.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={result.passed ? 'bg-success/10 text-success' : 'bg-red-100 text-red-600'}>
                        Grade {result.grade}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold font-mono" style={{ color: result.passed ? '#10B981' : '#EF4444' }}>
                        {result.percentage}%
                      </span>
                      <Button variant="ghost" size="sm" data-testid={`view-result-btn-${result.id}`}>
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
