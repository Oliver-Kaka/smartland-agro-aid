import { useState } from "react";
import Navigation from "@/components/Navigation";
import FairUsageGate from "@/components/FairUsageGate";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getFriendlyErrorMessage } from "@/lib/aiError";
import LandReclamationMap from "@/components/LandReclamationMap";

const LandReclamation = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('land-analysis', {
        body: {
          country,
          region: '',
        }
      });

      if (error) {
        throw error;
      }

      setResults({
        country,
        potentialSites: data.potentialSites,
        recommendations: data.recommendations,
      });

      toast({
        title: "Analysis Complete",
        description: `AI has analyzed ${data.potentialSites.length} potential sites in ${country}.`,
      });
    } catch (error: any) {
      console.error('Error analyzing land:', error);
      toast({
        title: "Could Not Analyze Region",
        description: await getFriendlyErrorMessage(error, "Failed to analyze region. Please try again."),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <FairUsageGate />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <MapPin className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Land Reclamation Analysis</h1>
                <p className="text-muted-foreground">
                  Identify potential areas for sustainable land development using GIS
                </p>
              </div>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>GIS Analysis Parameters</CardTitle>
                <CardDescription>
                  Enter a country or region to analyze potential reclamation sites
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAnalyze} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country/Region</Label>
                    <Input
                      id="country"
                      placeholder="e.g., Kenya"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing GIS Data...
                      </>
                    ) : (
                      "Analyze Region"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {results && (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Interactive Map</h2>
                  <LandReclamationMap sites={results.potentialSites} />
                </div>

                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">
                    Potential Sites in {results.country}
                  </h2>
                  <p className="text-muted-foreground">
                    AI-identified locations based on GIS data analysis
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {results.potentialSites.map((site: any) => (
                    <Card key={site.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="mb-2">{site.name}</CardTitle>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                                {site.type}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {site.area}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{site.suitability}%</div>
                            <div className="text-xs text-muted-foreground">Suitability</div>
                          </div>
                        </div>
                        <CardDescription>{site.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Coordinates</span>
                            <span className="font-mono">
                              {site.coordinates.lat.toFixed(2)}, {site.coordinates.lng.toFixed(2)}
                            </span>
                          </div>
                          <Button className="w-full" variant="outline">
                            View Detailed Analysis
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {results.recommendations && (
                  <Card className="mt-8">
                    <CardHeader>
                      <CardTitle>AI Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-semibold mb-2">Priority Site</h4>
                        <p className="text-sm text-muted-foreground">
                          {results.recommendations.priority}
                        </p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-semibold mb-2">Environmental Impact</h4>
                        <p className="text-sm text-muted-foreground">
                          {results.recommendations.environmental}
                        </p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-semibold mb-2">Community Engagement</h4>
                        <p className="text-sm text-muted-foreground">
                          {results.recommendations.community}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandReclamation;
