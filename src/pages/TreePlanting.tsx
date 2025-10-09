import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trees, Upload, MapPin as MapPinIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const TreePlanting = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    species: "",
    quantity: "",
    location: "",
    latitude: "",
    longitude: "",
  });

  const [stats] = useState({
    totalTrees: 127543,
    thisMonth: 8234,
    regions: 24,
    species: 47,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Trees Logged Successfully",
        description: `${formData.quantity} ${formData.species} trees recorded at ${formData.location}.`,
      });
      
      // Reset form
      setFormData({
        species: "",
        quantity: "",
        location: "",
        latitude: "",
        longitude: "",
      });
    }, 1500);
  };

  const getRecommendations = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('tree-recommendations', {
        body: {
          location: formData.location || 'Kenya',
          soilType: '',
        }
      });

      if (error) {
        throw error;
      }

      setRecommendations(data.recommendations);
      setShowRecommendations(true);
      
      toast({
        title: "AI Recommendations Ready",
        description: "Native species suggestions based on your location.",
      });
    } catch (error: any) {
      console.error('Error getting tree recommendations:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Trees className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Tree Planting Monitoring</h1>
                <p className="text-muted-foreground">
                  Track reforestation efforts and get AI-powered species recommendations
                </p>
              </div>
            </div>

            {/* Statistics Dashboard */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Trees Planted</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {stats.totalTrees.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>This Month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {stats.thisMonth.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Active Regions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{stats.regions}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Tree Species</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{stats.species}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Log Tree Planting Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Log Tree Planting Activity</CardTitle>
                  <CardDescription>
                    Record new tree planting with GPS verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="species">Tree Species</Label>
                      <Select
                        value={formData.species}
                        onValueChange={(value) => setFormData({ ...formData, species: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select species" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="acacia">Acacia (Native)</SelectItem>
                          <SelectItem value="mango">Mango</SelectItem>
                          <SelectItem value="avocado">Avocado</SelectItem>
                          <SelectItem value="eucalyptus">Eucalyptus</SelectItem>
                          <SelectItem value="bamboo">Bamboo</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Number of Trees</Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="e.g., 50"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location Name</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Karura Forest, Nairobi"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                          id="latitude"
                          type="number"
                          step="0.000001"
                          placeholder="-1.234567"
                          value={formData.latitude}
                          onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                          id="longitude"
                          type="number"
                          step="0.000001"
                          placeholder="36.789012"
                          value={formData.longitude}
                          onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="photo">Upload Photo (Optional)</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging Trees...
                        </>
                      ) : (
                        "Log Tree Planting"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* AI Recommendations */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Species Recommendations</CardTitle>
                    <CardDescription>
                      Get suggestions for native and eco-friendly species
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={getRecommendations} className="w-full mb-4" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Getting Recommendations...
                        </>
                      ) : (
                        <>
                          <MapPinIcon className="mr-2 h-4 w-4" />
                          Get Recommendations for My Location
                        </>
                      )}
                    </Button>

                    {showRecommendations && recommendations.length > 0 && (
                      <div className="space-y-3">
                        {recommendations.map((rec, index) => {
                          const isNative = rec.category === "Native";
                          const isCaution = rec.category === "Caution";
                          const bgClass = isNative 
                            ? "bg-primary/5 border-primary/20" 
                            : isCaution 
                            ? "bg-destructive/5 border-destructive/20" 
                            : "bg-muted/50";
                          const badgeClass = isNative 
                            ? "bg-primary text-primary-foreground" 
                            : isCaution 
                            ? "bg-destructive text-destructive-foreground" 
                            : "bg-accent text-accent-foreground";

                          return (
                            <div key={index} className={`p-4 border rounded-lg ${bgClass}`}>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">{rec.name}</h4>
                                <span className={`text-xs px-2 py-1 rounded ${badgeClass}`}>
                                  {rec.category}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {rec.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 pb-3 border-b">
                        <MapPinIcon className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Karura Forest, Nairobi</p>
                          <p className="text-xs text-muted-foreground">250 Acacia trees • 2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 pb-3 border-b">
                        <MapPinIcon className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Aberdare Ranges</p>
                          <p className="text-xs text-muted-foreground">180 Bamboo trees • 1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPinIcon className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Mount Kenya Region</p>
                          <p className="text-xs text-muted-foreground">320 Mixed species • 3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TreePlanting;
