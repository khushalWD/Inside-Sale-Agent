import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResultProps {
  result: string;
}

const AnalysisResult = ({ result }: AnalysisResultProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [parsedData, setParsedData] = useState<Record<string, any> | null>(null);
  const { toast } = useToast();

  // Parse HTML and extract data when result changes
  useEffect(() => {
    if (!result) return;
    
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(result, 'text/html');
      const data: Record<string, any> = {};
      
      // Extract data from tables
      const tables = doc.querySelectorAll('table');
      tables.forEach((table, index) => {
        const rows = table.querySelectorAll('tr');
        const tableData: Record<string, string> = {};
        
        rows.forEach(row => {
          const cells = row.querySelectorAll('td, th');
          if (cells.length >= 2) {
            const key = cells[0].textContent?.trim() || '';
            const value = cells[1].textContent?.trim() || '';
            if (key) tableData[key] = value;
          }
        });
        
        if (Object.keys(tableData).length > 0) {
          data[`table_${index + 1}`] = tableData;
        }
      });
      
      // Extract data from paragraphs
      const paragraphs = doc.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
      const textData: string[] = [];
      paragraphs.forEach(p => {
        const text = p.textContent?.trim();
        if (text) textData.push(text);
      });
      
      if (textData.length > 0) {
        data['text_content'] = textData;
      }
      
      setParsedData(data);
    } catch (error) {
      console.error('Error parsing HTML:', error);
      setParsedData(null);
    }
  }, [result]);

  const handleAddToCRM = async () => {
    if (!parsedData) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("https://n8n.warpdrivetech.in/webhook-test/4dc31345-47b6-47e5-b9e6-c6c1fd1f141f", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: 'sales-insight-forge',
          timestamp: new Date().toISOString(),
          data: parsedData
        }),
      });

      if (!response.ok) throw new Error("Failed to send data to webhook");
      
      toast({
        title: "Success",
        description: "Analysis data has been sent successfully",
      });
    } catch (error) {
      console.error("Error sending data:", error);
      toast({
        title: "Error",
        description: "Failed to send analysis data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 pt-16">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-success" />
          <h3 className="text-lg font-semibold text-foreground">Analysis Results</h3>
        </div>
        <Button 
          onClick={handleAddToCRM}
          disabled={isLoading || !parsedData}
          variant="default"
          className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-md"
          title={!parsedData ? "No data available to send" : "Send analysis data to CRM"}
        >
          {isLoading ? (
            <>
              <span className="animate-spin">↻</span>
              Adding...
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              Add to CRM
            </>
          )}
        </Button>
      </div>
      
      <Card className="shadow-lg border-0 bg-card">
        <CardContent className="p-8">
          <div
            className="prose prose-sm max-w-none [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:p-3 [&_th]:text-left [&_td]:border [&_td]:border-border [&_td]:p-3 [&_h1]:text-[28px] [&_h1]:font-bold [&_h1]:mb-2.5 [&_h1]:pt-[60px] [&_h1]:text-[#111] [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-6 [&_p]:mb-3 [&_p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: result }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResult;