import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, Download, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generatePDFContent } from "@/utils/pdfFormatter";
import maizeImage from "@/assets/crop-maize.jpg";
import beansImage from "@/assets/crop-beans.jpg";
import sorghumImage from "@/assets/crop-sorghum.jpg";

const CropRecommendation = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [formCollapsed, setFormCollapsed] = useState(false);
  
  const [formData, setFormData] = useState({
    soilPh: "",
    location: "",
    landSize: "",
    previousCrop: "",
  });

  const getCropImage = (cropName: string) => {
    const name = cropName.toLowerCase();
    if (name.includes("maize") || name.includes("corn")) return maizeImage;
    if (name.includes("bean")) return beansImage;
    if (name.includes("sorghum")) return sorghumImage;
    return maizeImage;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('crop-recommendations', {
        body: {
          soilPh: formData.soilPh,
          location: formData.location,
          landSize: formData.landSize,
          previousCrop: formData.previousCrop,
        }
      });

      if (error) {
        throw error;
      }

      setResults({
        recommendedCrops: data.recommendedCrops,
        selectedCrop: null,
      });
      setFormCollapsed(true);

      toast({
        title: "Analysis Complete",
        description: "AI has analyzed your farm conditions successfully.",
      });
    } catch (error: any) {
      console.error('Error getting crop recommendations:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectCrop = async (cropName: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('planting-guide', {
        body: {
          cropName,
          soilPh: formData.soilPh,
          location: formData.location,
          landSize: formData.landSize,
        }
      });

      if (error) {
        throw error;
      }

      setResults({
        ...results,
        selectedCrop: data,
      });

      toast({
        title: "Planting Guide Ready",
        description: `Detailed guide for ${cropName} has been generated.`,
      });
    } catch (error: any) {
      console.error('Error getting planting guide:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get planting guide. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadGuide = () => {
    if (!results?.selectedCrop) return;
    
    const content = generatePDFContent(results.selectedCrop);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${results.selectedCrop.name}-planting-guide.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Download Complete",
      description: "Your planting guide has been downloaded.",
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Farm Information</CardTitle>
                    <CardDescription>
                      Enter your farm details to receive AI-powered crop recommendations
                    </CardDescription>
                  </div>
                  {results && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormCollapsed(!formCollapsed)}
                    >
                      {formCollapsed ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronUp className="h-5 w-5" />
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              {!formCollapsed && (
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
                      <Input
                        id="previousCrop"
                        placeholder="e.g., Maize, Beans, Wheat, Vegetables, etc."
                        value={formData.previousCrop}
                        onChange={(e) => setFormData({ ...formData, previousCrop: e.target.value })}
                      />
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
              )}
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
                          className="relative overflow-hidden rounded-lg border group"
                        >
                          <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                            style={{ backgroundImage: `url(${getCropImage(crop.name)})` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
                          
                          <div className="relative flex items-center justify-between p-4">
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
                              {crop.yieldPrediction && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  Yield: {crop.yieldPrediction}
                                </div>
                              )}
                            </div>
                            <Button
                              onClick={() => selectCrop(crop.name)}
                              variant={results.selectedCrop?.name === crop.name ? "default" : "outline"}
                              disabled={loading}
                            >
                              {results.selectedCrop?.name === crop.name ? "Selected" : "Select"}
                            </Button>
                          </div>
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
