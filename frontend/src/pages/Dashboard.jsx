import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  TrendingUp, 
  TrendingDown, 
  FileCheck, 
  FileX, 
  Activity,
  ArrowRight,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const COLORS = {
  approved: "hsl(160, 84%, 39%)",
  rejected: "hsl(0, 84%, 60%)",
  accent: "hsl(32, 95%, 44%)"
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [modelMetrics, setModelMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, predictionsRes, metricsRes] = await Promise.all([
          axios.get(`${API}/stats`),
          axios.get(`${API}/predictions?limit=5`),
          axios.get(`${API}/model-metrics`)
        ]);
        setStats(statsRes.data);
        setPredictions(predictionsRes.data);
        setModelMetrics(metricsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pieData = stats ? [
    { name: "Approved", value: stats.approved, color: COLORS.approved },
    { name: "Rejected", value: stats.rejected, color: COLORS.rejected }
  ] : [];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" data-testid="dashboard-page">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Loan Approval Prediction System</h1>
          <p className="text-muted-foreground mt-1">Machine Learning powered loan eligibility assessment</p>
        </div>
        <Link to="/predict">
          <Button className="gap-2" data-testid="new-prediction-btn">
            <FileCheck className="w-4 h-4" />
            New Prediction
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover" data-testid="stat-total">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Predictions</p>
                <p className="text-3xl font-bold mt-2 font-mono">{stats?.total_predictions || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover" data-testid="stat-approved">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-3xl font-bold mt-2 font-mono text-emerald-600 dark:text-emerald-400">
                  {stats?.approved || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-sm bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover" data-testid="stat-rejected">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-3xl font-bold mt-2 font-mono text-red-600 dark:text-red-400">
                  {stats?.rejected || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-sm bg-red-500/10 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover" data-testid="stat-rate">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approval Rate</p>
                <p className="text-3xl font-bold mt-2 font-mono">{stats?.approval_rate || 0}%</p>
              </div>
              <div className="w-12 h-12 rounded-sm bg-amber-500/10 flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Performance */}
        <Card data-testid="model-performance-chart">
          <CardHeader>
            <CardTitle className="text-lg">Model Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelMetrics} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <YAxis dataKey="model_name" type="category" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, "Accuracy"]}
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "4px"
                    }}
                  />
                  <Bar 
                    dataKey="accuracy" 
                    fill="hsl(160, 84%, 39%)" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Approval Distribution */}
        <Card data-testid="approval-distribution-chart">
          <CardHeader>
            <CardTitle className="text-lg">Approval Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              {stats?.total_predictions > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [value, name]}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "4px"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted-foreground">
                  <FileX className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No predictions yet</p>
                  <Link to="/predict">
                    <Button variant="link" className="mt-2">Make your first prediction</Button>
                  </Link>
                </div>
              )}
            </div>
            {stats?.total_predictions > 0 && (
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm">Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm">Rejected</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Predictions */}
      <Card data-testid="recent-predictions">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Predictions</CardTitle>
          <Link to="/history">
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {predictions.length > 0 ? (
            <div className="space-y-3">
              {predictions.map((pred, idx) => (
                <div 
                  key={pred.id} 
                  className="flex items-center justify-between p-4 rounded-sm border border-border hover:bg-muted/50 transition-colors"
                  data-testid={`recent-prediction-${idx}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${pred.approved ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="font-medium">
                        {pred.input_data?.property_area || 'Unknown'} - ${pred.input_data?.loan_amount?.toLocaleString() || 0}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(pred.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-muted-foreground">{pred.confidence}%</span>
                    <Badge variant={pred.approved ? "default" : "destructive"} className={pred.approved ? "badge-approved" : "badge-rejected"}>
                      {pred.prediction}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileX className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No predictions yet</p>
              <Link to="/predict">
                <Button variant="link" className="mt-2">Make your first prediction</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
