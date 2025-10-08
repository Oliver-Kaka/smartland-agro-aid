import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CropRecommendation = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    soilPh: "",
    location: "",
    landSize: "",
    previousCrop: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setResults({
        recommendedCrops: [
          { name: "Maize", suitability: 95, season: "Next season (April-July)" },
          { name: "Beans", suitability: 88, season: "Next season (April-July)" },
          { name: "Sorghum", suitability: 82, season: "Next season (April-July)" },
        ],
        selectedCrop: null,
      });
      setLoading(false);
      toast({
        title: "Analysis Complete",
        description: "AI has analyzed your farm conditions successfully.",
      });
    }, 2000);
  };

  const selectCrop = (cropName: string) => {
    setResults({
      ...results,
      selectedCrop: {
        name: cropName,
        spacing: "75cm x 30cm between rows and plants",
        fertilization: "Apply 100kg/ha NPK at planting, top-dress with 50kg/ha after 4 weeks",
        pestControl: "Scout weekly for fall armyworm. Use integrated pest management.",
        irrigation: "Requires 500-800mm rainfall. Irrigate if rainfall is insufficient.",
        expectedYield: "4-6 tons per hectare under good management",
        harvestTime: "3-4 months after planting",
      },
    });
  };

  const downloadGuide = () => {
    toast({
      title: "Download Started",
      description: "Your planting guide PDF is being prepared.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Sprout className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">AI Crop Recommendation</h1>
                <p className="text-muted-foreground">
                  Get personalized crop suggestions based on your soil and location
                </p>
              </div>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Farm Information</CardTitle>
                <CardDescription>
                  Enter your farm details to receive AI-powered crop recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="soilPh">Soil pH Level</Label>
                      <Input
                        id="soilPh"
                        type="number"
                        step="0.1"
                        placeholder="e.g., 6.5"
                        value={formData.soilPh}
                        onChange={(e) => setFormData({ ...formData, soilPh: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location/Region</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Nairobi, Kenya"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="landSize">Land Size (Hectares)</Label>
                      <Input
                        id="landSize"
                        type="number"
                        step="0.1"
                        placeholder="e.g., 2.5"
                        value={formData.landSize}
                        onChange={(e) => setFormData({ ...formData, landSize: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="previousCrop">Previous Crop</Label>
                      <Select
                        value={formData.previousCrop}
                        onValueChange={(value) => setFormData({ ...formData, previousCrop: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select previous crop" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maize">Maize</SelectItem>
                          <SelectItem value="beans">Beans</SelectItem>
                          <SelectItem value="wheat">Wheat</SelectItem>
                          <SelectItem value="vegetables">Vegetables</SelectItem>
                          <SelectItem value="none">None / First Season</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Get Recommendations"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {results && (
              <>
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Recommended Crops</CardTitle>
                    <CardDescription>
                      Based on your soil pH, location, and crop rotation needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.recommendedCrops.map((crop: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="font-semibold text-lg">{crop.name}</div>
                              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                {crop.suitability}% Match
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {crop.season}
                            </div>
                          </div>
                          <Button
                            onClick={() => selectCrop(crop.name)}
                            variant={results.selectedCrop?.name === crop.name ? "default" : "outline"}
                          >
                            {results.selectedCrop?.name === crop.name ? "Selected" : "Select"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {results.selectedCrop && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Planting Guide: {results.selectedCrop.name}</CardTitle>
                          <CardDescription>
                            Detailed instructions for successful cultivation
                          </CardDescription>
                        </div>
                        <Button onClick={downloadGuide} variant="outline" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download PDF
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-2 text-primary">Spacing</h3>
                        <p className="text-muted-foreground">{results.selectedCrop.spacing}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-primary">Fertilization</h3>
                        <p className="text-muted-foreground">{results.selectedCrop.fertilization}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-primary">Pest & Weed Control</h3>
                        <p className="text-muted-foreground">{results.selectedCrop.pestControl}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-primary">Irrigation</h3>
                        <p className="text-muted-foreground">{results.selectedCrop.irrigation}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-primary">Expected Yield</h3>
                        <p className="text-muted-foreground">{results.selectedCrop.expectedYield}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-primary">Harvest Time</h3>
                        <p className="text-muted-foreground">{results.selectedCrop.harvestTime}</p>
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

export default CropRecommendation;
