import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { 
  Search, 
  Filter, 
  Trash2, 
  Clock, 
  ChevronDown,
  FileX,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function History() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const status = filter === "all" ? "" : filter;
      const response = await axios.get(`${API}/predictions?limit=100${status ? `&status=${status}` : ''}`);
      setPredictions(response.data);
    } catch (error) {
      console.error("Failed to fetch predictions:", error);
      toast.error("Failed to load prediction history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, [filter]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/predictions/${id}`);
      setPredictions(predictions.filter(p => p.id !== id));
      toast.success("Prediction deleted successfully");
    } catch (error) {
      console.error("Failed to delete prediction:", error);
      toast.error("Failed to delete prediction");
    }
  };

  const filteredPredictions = predictions.filter(pred => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      pred.input_data?.property_area?.toLowerCase().includes(searchLower) ||
      pred.input_data?.education?.toLowerCase().includes(searchLower) ||
      pred.prediction?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-8 animate-fade-in" data-testid="history-page">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Prediction History</h1>
        <p className="text-muted-foreground mt-1">View and manage all loan predictions</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by property area, education..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="search-input"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-[180px]" data-testid="filter-select">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Predictions</SelectItem>
                <SelectItem value="approved">Approved Only</SelectItem>
                <SelectItem value="rejected">Rejected Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {filteredPredictions.length} Prediction{filteredPredictions.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredPredictions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Applicant Income</TableHead>
                    <TableHead>Loan Amount</TableHead>
                    <TableHead>Property Area</TableHead>
                    <TableHead>Education</TableHead>
                    <TableHead>Credit</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPredictions.map((pred, idx) => (
                    <TableRow key={pred.id} data-testid={`history-row-${idx}`}>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          {new Date(pred.timestamp).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        ${pred.input_data?.applicant_income?.toLocaleString() || 0}
                      </TableCell>
                      <TableCell className="font-mono">
                        ${pred.input_data?.loan_amount?.toLocaleString() || 0}
                      </TableCell>
                      <TableCell>{pred.input_data?.property_area || '-'}</TableCell>
                      <TableCell>{pred.input_data?.education || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={pred.input_data?.credit_history === 1 ? "default" : "secondary"}>
                          {pred.input_data?.credit_history === 1 ? 'Good' : 'Poor'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{pred.confidence}%</TableCell>
                      <TableCell>
                        <Badge 
                          variant={pred.approved ? "default" : "destructive"}
                          className={pred.approved ? "badge-approved" : "badge-rejected"}
                        >
                          {pred.prediction}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`delete-btn-${idx}`}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Prediction</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this prediction? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(pred.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileX className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No predictions found</p>
              <p className="text-sm mt-1">Try adjusting your filters or make a new prediction</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
