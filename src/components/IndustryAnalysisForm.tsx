import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BarChart3, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IndustryAnalysisFormProps {
  onAnalysisComplete?: (result: string) => void;
}

const IndustryAnalysisForm = ({ onAnalysisComplete }: IndustryAnalysisFormProps) => {
  const [isLoadingIndustries, setIsLoadingIndustries] = useState(false);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [industries, setIndustries] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [researchNotes, setResearchNotes] = useState("");
  const [showCustomIndustry, setShowCustomIndustry] = useState(false);
  const [customIndustry, setCustomIndustry] = useState("");
  const { toast } = useToast();

  const durations = ["3 Months", "6 Months", "9 Months", "12 Months"];

  const loadIndustries = async () => {
    setIsLoadingIndustries(true);
    try {
      const response = await fetch("https://n8n.warpdrivetech.in/webhook/industry-company", {
        method: "POST",
      });
      const data = await response.json();
      const industryList = Object.values(data) as string[];
      setIndustries(industryList);
      setShowForm(true);
      toast({
        title: "Industries loaded successfully",
        description: `${industryList.length} industries available for analysis`,
      });
    } catch (error) {
      console.error("Error fetching industries:", error);
      toast({
        title: "Error loading industries",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoadingIndustries(false);
    }
  };

  const generateAnalysis = async () => {
    const industryToUse = selectedIndustry === 'Other' ? customIndustry : selectedIndustry;
    
    if (!industryToUse || !selectedDuration) {
      toast({
        title: "Missing information",
        description: "Please select both Industry and Duration before generating analysis",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingAnalysis(true);
    try {
      const payload = {
        Industry: industryToUse,
        Duration: selectedDuration,
        Notes: researchNotes || "",
      };

      const response = await fetch("https://n8n.warpdrivetech.in/webhook/industry-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const result = await response.text();
      onAnalysisComplete?.(result);
      toast({
        title: "Analysis generated successfully",
        description: "Your industry analysis is ready",
      });
    } catch (error) {
      console.error("Error generating analysis:", error);
      toast({
        title: "Error generating analysis",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-lg border-0 bg-card">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl font-semibold text-card-foreground">
              Sales Analysis Request
            </CardTitle>
          </div>
          <p className="text-muted-foreground text-sm">
            Fill out the form below to receive a customized analysis for your industry and business needs.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!showForm ? (
            <div className="text-center space-y-4">
              <Button
                onClick={loadIndustries}
                disabled={isLoadingIndustries}
                variant="portal"
                size="lg"
                className="w-full"
              >
                {isLoadingIndustries ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4" />
                    Start Analysis
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground">
                Click to load industry options and begin your analysis
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-sm font-medium">
                  Industry *
                </Label>
                <Select 
                  value={selectedIndustry} 
                  onValueChange={(value) => {
                    setSelectedIndustry(value);
                    setShowCustomIndustry(value === 'Other');
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                    <SelectItem value="Other">Other (please specify)</SelectItem>
                  </SelectContent>
                </Select>
                {showCustomIndustry && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={customIndustry}
                      onChange={(e) => setCustomIndustry(e.target.value)}
                      placeholder="Please specify your industry"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium">
                  Analysis Duration *
                </Label>
                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select analysis duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration} value={duration}>
                        {duration}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Research Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Please provide any relevant research notes, specific challenges, or goals you'd like us to consider in the analysis..."
                  value={researchNotes}
                  onChange={(e) => setResearchNotes(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Include information about your target market, current challenges, or specific areas of focus.
                </p>
              </div>

              <Button
                onClick={generateAnalysis}
                disabled={isGeneratingAnalysis || !(selectedIndustry === 'Other' ? customIndustry : selectedIndustry) || !selectedDuration}
                variant="portal"
                size="lg"
                className="w-full"
              >
                {isGeneratingAnalysis ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Analysis...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4" />
                    Generate Analysis
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IndustryAnalysisForm;