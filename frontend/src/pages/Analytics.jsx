import { useEffect, useState } from "react";
import axios from "axios";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Award,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const COLORS = {
  approved: "hsl(160, 84%, 39%)",
  rejected: "hsl(0, 84%, 60%)",
  accent: "hsl(32, 95%, 44%)",
  primary: "hsl(217, 91%, 60%)",
  purple: "hsl(263, 70%, 50%)"
};

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [modelMetrics, setModelMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, metricsRes] = await Promise.all([
          axios.get(`${API}/analytics`),
          axios.get(`${API}/model-metrics`)
        ]);
        setAnalytics(analyticsRes.data);
        setModelMetrics(metricsRes.data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prepare chart data
  const propertyData = analytics ? Object.entries(analytics.predictions_by_property).map(([key, value]) => ({
    name: key,
    Approved: value.approved,
    Rejected: value.rejected
  })) : [];

  const educationData = analytics ? Object.entries(analytics.predictions_by_education).map(([key, value]) => ({
    name: key,
    Approved: value.approved,
    Rejected: value.rejected
  })) : [];

  const approvalPieData = analytics ? [
    { name: "Approved", value: analytics.approved_count, color: COLORS.approved },
    { name: "Rejected", value: analytics.rejected_count, color: COLORS.rejected }
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
    <div className="space-y-8 animate-fade-in" data-testid="analytics-page">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Comprehensive insights and model performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover" data-testid="metric-total">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Predictions</p>
                <p className="text-3xl font-bold mt-2 font-mono">{analytics?.total_predictions || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover" data-testid="metric-approval-rate">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approval Rate</p>
                <p className="text-3xl font-bold mt-2 font-mono text-emerald-600 dark:text-emerald-400">
                  {analytics?.approval_rate || 0}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-sm bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover" data-testid="metric-avg-loan">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Loan Amount</p>
                <p className="text-3xl font-bold mt-2 font-mono">
                  ${analytics?.avg_loan_amount?.toLocaleString() || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-sm bg-amber-500/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover" data-testid="metric-avg-income">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Applicant Income</p>
                <p className="text-3xl font-bold mt-2 font-mono">
                  ${analytics?.avg_applicant_income?.toLocaleString() || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-sm bg-blue-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Performance */}
        <Card data-testid="model-accuracy-chart">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Model Accuracy Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="model_name" 
                    tick={{ fontSize: 11 }}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis domain={[70, 100]} tickFormatter={(v) => `${v}%`} />
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
                    fill={COLORS.approved} 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Approval Distribution Pie */}
        <Card data-testid="approval-pie-chart">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-primary" />
              Approval Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {analytics?.total_predictions > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={approvalPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {approvalPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "4px"
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* By Property Area */}
        <Card data-testid="property-area-chart">
          <CardHeader>
            <CardTitle className="text-lg">Predictions by Property Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {propertyData.some(d => d.Approved > 0 || d.Rejected > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={propertyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "4px"
                      }}
                    />
                    <Legend />
                    <Bar dataKey="Approved" fill={COLORS.approved} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Rejected" fill={COLORS.rejected} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* By Education */}
        <Card data-testid="education-chart">
          <CardHeader>
            <CardTitle className="text-lg">Predictions by Education Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {educationData.some(d => d.Approved > 0 || d.Rejected > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={educationData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "4px"
                      }}
                    />
                    <Legend />
                    <Bar dataKey="Approved" fill={COLORS.approved} radius={[0, 4, 4, 0]} />
                    <Bar dataKey="Rejected" fill={COLORS.rejected} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Scores Table */}
      <Card data-testid="model-scores-table">
        <CardHeader>
          <CardTitle className="text-lg">Trained Model Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">Model</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Accuracy</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {modelMetrics.map((model, idx) => (
                  <tr key={model.model_name} className="border-b border-border hover:bg-muted/50" data-testid={`model-row-${idx}`}>
                    <td className="p-4 font-medium">{model.model_name}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${model.accuracy}%` }}
                          />
                        </div>
                        <span className="font-mono text-sm">{model.accuracy}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {model.model_name === 'RandomForest' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                          <Award className="w-3 h-3" />
                          Primary Model
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">Trained</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
