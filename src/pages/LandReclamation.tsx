import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LandReclamation = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate GIS analysis
    setTimeout(() => {
      setResults({
        country,
        potentialSites: [
          {
            id: 1,
            name: "Tana River Basin",
            type: "Dam Construction",
            area: "2,400 hectares",
            coordinates: { lat: -1.5, lng: 39.5 },
            suitability: 92,
            description: "Ideal location for medium-scale dam. Good geological foundation and water catchment area.",
          },
          {
            id: 2,
            name: "Yala Swamp Region",
            type: "Swamp Reclamation",
            area: "17,500 hectares",
            coordinates: { lat: 0.1, lng: 34.0 },
            suitability: 88,
            description: "Suitable for agricultural reclamation. Requires drainage system installation.",
          },
          {
            id: 3,
            name: "Ewaso Ngiro Basin",
            type: "Dam Construction",
            area: "3,200 hectares",
            coordinates: { lat: 0.5, lng: 37.5 },
            suitability: 85,
            description: "Multi-purpose dam site for irrigation and water supply.",
          },
        ],
      });
      setLoading(false);
      toast({
        title: "Analysis Complete",
        description: `Found ${3} potential sites for land reclamation in ${country}.`,
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
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
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium mb-1">Interactive Map Coming Soon</p>
                          <p className="text-sm text-muted-foreground">
                            The full GIS map visualization will display identified sites with topographic data, 
                            water bodies, and detailed geographic analysis.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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

                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>AI Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">Dam Construction Priority</h4>
                      <p className="text-sm text-muted-foreground">
                        Focus on Tana River Basin first due to its high suitability score and strategic 
                        importance for water supply and irrigation.
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">Environmental Impact</h4>
                      <p className="text-sm text-muted-foreground">
                        Conduct environmental impact assessments before proceeding. All sites require 
                        careful planning to protect local ecosystems.
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">Community Engagement</h4>
                      <p className="text-sm text-muted-foreground">
                        Engage with local communities early in the planning process. Their knowledge 
                        of the land is invaluable for successful implementation.
                      </p>
                    </div>
                  </CardContent>
                </Card>
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
