import { Button } from "@/components/ui/button";
import { TrendingUp, Zap, Target } from "lucide-react";

interface HeroSectionProps {
  onStartAnalysis: () => void;
}

const HeroSection = ({ onStartAnalysis }: HeroSectionProps) => {
  return (
    <section className="relative py-20 px-6 text-center bg-gradient-to-br from-background to-background-subtle">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Accelerate Your{" "}
            <span className="text-primary">Inside Sales</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform your sales process with advanced CRM integration, intelligent analytics,
            and automated workflows designed for modern inside sales teams.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button
              onClick={onStartAnalysis}
              variant="portal"
              size="lg"
              className="px-8"
            >
              <TrendingUp className="w-4 h-4" />
              Start Analysis
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              Explore Solutions
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mx-auto">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Targeted Insights</h3>
          <p className="text-sm text-muted-foreground">
            Get industry-specific analysis tailored to your business needs
          </p>
        </div>
        
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mx-auto">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Fast Results</h3>
          <p className="text-sm text-muted-foreground">
            Receive comprehensive analysis in minutes, not hours
          </p>
        </div>
        
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mx-auto">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Sales Growth</h3>
          <p className="text-sm text-muted-foreground">
            Data-driven recommendations to accelerate your sales success
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;