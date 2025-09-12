import { useState, useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import IndustryAnalysisForm from "@/components/IndustryAnalysisForm";
import AnalysisResult from "@/components/AnalysisResult";
import WhyChooseSection from "@/components/WhyChooseSection";
import ContactUsForm from "@/components/ContactUsForm";
import SalesforceIntegration from "@/components/SalesforceIntegration";

const Index = () => {
  const [activeTab, setActiveTab] = useState("analysis");
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const formRef = useRef<HTMLDivElement>(null);

  const handleStartAnalysis = () => {
    setActiveTab("analysis");
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleAnalysisComplete = (result: string) => {
    setAnalysisResult(result);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="pt-20">
        {activeTab === "analysis" && (
          <>
            <section className="py-16 px-6 text-center bg-gradient-to-br from-background to-background-subtle">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Industry Analysis
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Get comprehensive insights tailored to your industry and business duration. Our
                  analysis tool provides data-driven recommendations to accelerate your sales success.
                </p>
              </div>
            </section>
            
            <section className="py-16 px-6" ref={formRef}>
              <IndustryAnalysisForm onAnalysisComplete={handleAnalysisComplete} />
              {analysisResult && <AnalysisResult result={analysisResult} />}
            </section>
          </>
        )}
        
        {activeTab === "home" && (
          <>
            <HeroSection onStartAnalysis={handleStartAnalysis} />
            <WhyChooseSection />
          </>
        )}
        
        {activeTab === "salesforce" && <SalesforceIntegration />}
        
        {activeTab === "contact" && <ContactUsForm />}
      </main>
    </div>
  );
};

export default Index;
