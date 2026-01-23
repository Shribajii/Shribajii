import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, API } from '../App';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import axios from 'axios';
import { toast } from 'sonner';
import { LogOut, Users, BookOpen, FileText, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [statsRes, usersRes, resultsRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, { headers }),
        axios.get(`${API}/admin/users`, { headers }),
        axios.get(`${API}/results`, { headers })
      ]);
      
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setResults(resultsRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const avgPerformance = results.length > 0 
    ? (results.reduce((sum, r) => sum + r.percentage, 0) / results.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-outfit text-2xl font-bold text-[#0F172A] tracking-tight">ExamPro Admin</h1>
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
          <h2 className="font-outfit text-4xl font-bold text-[#0F172A] mb-2 tracking-tight">Admin Dashboard</h2>
          <p className="text-[#64748B]">System overview and user management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="card-hover border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Total Students</p>
                    <p className="font-outfit text-3xl font-bold text-primary">{stats.total_students}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-7 h-7 text-primary" />
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
                    <p className="text-sm text-[#64748B] mb-1">Total Teachers</p>
                    <p className="font-outfit text-3xl font-bold text-secondary">{stats.total_teachers}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                    <Users className="w-7 h-7 text-secondary" />
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
                    <p className="text-sm text-[#64748B] mb-1">Total Exams</p>
                    <p className="font-outfit text-3xl font-bold text-success">{stats.total_exams}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center">
                    <FileText className="w-7 h-7 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="card-hover border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Questions Bank</p>
                    <p className="font-outfit text-3xl font-bold text-[#F97316]">{stats.total_questions}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 flex items-center justify-center">
                    <BookOpen className="w-7 h-7 text-[#F97316]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="card-hover border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Submissions</p>
                    <p className="font-outfit text-3xl font-bold text-primary">{stats.total_results}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Award className="w-7 h-7 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="card-hover border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Avg Performance</p>
                    <p className="font-outfit text-3xl font-bold text-success">{avgPerformance}%</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]" data-testid="users-section">
            <CardContent className="p-6">
              <h3 className="font-outfit text-2xl font-semibold mb-4">Registered Users</h3>
              <div className="space-y-3">
                {users.slice(0, 10).map((u, idx) => (
                  <div key={idx} className="p-4 bg-[#F8FAFC] rounded-2xl flex justify-between items-center" data-testid={`user-card-${idx}`}>
                    <div>
                      <p className="font-outfit font-semibold text-[#0F172A]">{u.name}</p>
                      <p className="text-sm text-[#64748B]">{u.email}</p>
                    </div>
                    <Badge className={u.role === 'student' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}>
                      {u.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]" data-testid="recent-results-section">
            <CardContent className="p-6">
              <h3 className="font-outfit text-2xl font-semibold mb-4">Recent Results</h3>
              <div className="space-y-3">
                {results.slice(0, 10).map((result) => (
                  <div 
                    key={result.id} 
                    className="p-4 bg-[#F8FAFC] rounded-2xl hover:bg-[#EEF2FF] transition-colors cursor-pointer"
                    onClick={() => navigate(`/result/${result.id}`)}
                    data-testid={`result-card-${result.id}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-outfit font-semibold text-[#0F172A]">{result.student_name}</p>
                        <p className="text-xs text-[#64748B]">{result.exam_title}</p>
                      </div>
                      <Badge className={result.passed ? 'bg-success text-white' : 'bg-red-600 text-white'}>
                        {result.grade}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold font-mono" style={{ color: result.passed ? '#10B981' : '#EF4444' }}>
                        {result.percentage}%
                      </span>
                      <span className="text-xs text-[#64748B]">
                        {new Date(result.submitted_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
