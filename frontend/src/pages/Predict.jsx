import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { 
  User, 
  Users, 
  GraduationCap, 
  Briefcase, 
  DollarSign, 
  Home,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Predict() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      gender: "",
      married: "",
      dependents: "",
      education: "",
      self_employed: "",
      applicant_income: "",
      coapplicant_income: "",
      loan_amount: "",
      loan_amount_term: "360",
      credit_history: "",
      property_area: ""
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setResult(null);
    
    try {
      const payload = {
        ...data,
        applicant_income: parseFloat(data.applicant_income),
        coapplicant_income: parseFloat(data.coapplicant_income) || 0,
        loan_amount: parseFloat(data.loan_amount),
        loan_amount_term: parseFloat(data.loan_amount_term),
        credit_history: parseInt(data.credit_history)
      };
      
      const response = await axios.post(`${API}/predict`, payload);
      setResult(response.data);
      toast.success("Prediction completed successfully!");
    } catch (error) {
      console.error("Prediction failed:", error);
      toast.error("Failed to make prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setResult(null);
  };

  return (
    <div className="space-y-8 animate-fade-in" data-testid="predict-page">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">New Prediction</h1>
        <p className="text-muted-foreground mt-1">Enter applicant details to predict loan approval</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select onValueChange={(v) => setValue("gender", v)} required>
                    <SelectTrigger id="gender" data-testid="select-gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="married">Married</Label>
                  <Select onValueChange={(v) => setValue("married", v)} required>
                    <SelectTrigger id="married" data-testid="select-married">
                      <SelectValue placeholder="Marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dependents">Dependents</Label>
                  <Select onValueChange={(v) => setValue("dependents", v)} required>
                    <SelectTrigger id="dependents" data-testid="select-dependents">
                      <SelectValue placeholder="Number of dependents" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3+">3+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Select onValueChange={(v) => setValue("education", v)} required>
                    <SelectTrigger id="education" data-testid="select-education">
                      <SelectValue placeholder="Education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Graduate">Graduate</SelectItem>
                      <SelectItem value="Not Graduate">Not Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="self_employed">Self Employed</Label>
                  <Select onValueChange={(v) => setValue("self_employed", v)} required>
                    <SelectTrigger id="self_employed" data-testid="select-self-employed">
                      <SelectValue placeholder="Employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="property_area">Property Area</Label>
                  <Select onValueChange={(v) => setValue("property_area", v)} required>
                    <SelectTrigger id="property_area" data-testid="select-property-area">
                      <SelectValue placeholder="Property location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Urban">Urban</SelectItem>
                      <SelectItem value="Semiurban">Semiurban</SelectItem>
                      <SelectItem value="Rural">Rural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Financial Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Financial Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="applicant_income">Applicant Income ($)</Label>
                  <Input
                    id="applicant_income"
                    type="number"
                    placeholder="e.g., 5000"
                    {...register("applicant_income", { required: true, min: 0 })}
                    data-testid="input-applicant-income"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coapplicant_income">Co-applicant Income ($)</Label>
                  <Input
                    id="coapplicant_income"
                    type="number"
                    placeholder="e.g., 2000"
                    {...register("coapplicant_income", { min: 0 })}
                    data-testid="input-coapplicant-income"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credit_history">Credit History</Label>
                  <Select onValueChange={(v) => setValue("credit_history", v)} required>
                    <SelectTrigger id="credit_history" data-testid="select-credit-history">
                      <SelectValue placeholder="Credit history status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Good (Meets Guidelines)</SelectItem>
                      <SelectItem value="0">Poor (Does Not Meet)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Loan Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Home className="w-5 h-5 text-primary" />
                  Loan Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="loan_amount">Loan Amount ($)</Label>
                  <Input
                    id="loan_amount"
                    type="number"
                    placeholder="e.g., 150000"
                    {...register("loan_amount", { required: true, min: 1 })}
                    data-testid="input-loan-amount"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loan_amount_term">Loan Term (months)</Label>
                  <Select onValueChange={(v) => setValue("loan_amount_term", v)} defaultValue="360">
                    <SelectTrigger id="loan_amount_term" data-testid="select-loan-term">
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">60 months (5 years)</SelectItem>
                      <SelectItem value="120">120 months (10 years)</SelectItem>
                      <SelectItem value="180">180 months (15 years)</SelectItem>
                      <SelectItem value="240">240 months (20 years)</SelectItem>
                      <SelectItem value="300">300 months (25 years)</SelectItem>
                      <SelectItem value="360">360 months (30 years)</SelectItem>
                      <SelectItem value="480">480 months (40 years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button 
                type="submit" 
                className="flex-1 h-12" 
                disabled={loading}
                data-testid="submit-prediction-btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Predict Loan Approval
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleReset}
                data-testid="reset-form-btn"
              >
                Reset
              </Button>
            </div>
          </form>
        </div>

        {/* Result Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <Card className={result ? (result.approved ? "result-approved" : "result-rejected") : ""}>
              <CardHeader>
                <CardTitle className="text-lg">Prediction Result</CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6 animate-fade-in" data-testid="prediction-result">
                    {/* Status */}
                    <div className="text-center py-6">
                      {result.approved ? (
                        <div className="space-y-3">
                          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center animate-pulse-glow">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                          </div>
                          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            APPROVED
                          </h3>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
                            <XCircle className="w-10 h-10 text-red-500" />
                          </div>
                          <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
                            REJECTED
                          </h3>
                        </div>
                      )}
                    </div>

                    {/* Confidence */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className="font-mono font-bold">{result.confidence}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            result.approved ? 'bg-emerald-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 pt-4 border-t border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Loan Amount</span>
                        <span className="font-mono">${result.input_data.loan_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Income</span>
                        <span className="font-mono">
                          ${(result.input_data.applicant_income + result.input_data.coapplicant_income).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Property Area</span>
                        <span>{result.input_data.property_area}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Credit History</span>
                        <span>{result.input_data.credit_history === 1 ? 'Good' : 'Poor'}</span>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border">
                      <Clock className="w-3 h-3" />
                      {new Date(result.timestamp).toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground" data-testid="no-result">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Fill in the form and submit to see the prediction result</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
