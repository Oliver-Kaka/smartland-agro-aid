import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import FairUsageGate from "@/components/FairUsageGate";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trees, Upload, MapPin as MapPinIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getFriendlyErrorMessage } from "@/lib/aiError";
import { useAuth } from "@/hooks/useAuth";

const TreePlanting = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [userPlantings, setUserPlantings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalTrees: 0,
    thisMonth: 0,
    totalPlantings: 0,
  });
  
  const [formData, setFormData] = useState({
    species: "",
    quantity: "",
    location: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to log tree planting activities.",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [user, authLoading, navigate, toast]);

  useEffect(() => {
    if (user) {
      fetchUserPlantings();
    }
  }, [user]);

  const fetchUserPlantings = async () => {
    try {
      const { data, error } = await supabase
        .from('tree_plantings')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUserPlantings(data || []);
      
      // Calculate stats
      const totalTrees = data?.reduce((sum, p) => sum + p.quantity, 0) || 0;
      const thisMonth = data?.filter(p => {
        const plantingDate = new Date(p.created_at);
        const now = new Date();
        return plantingDate.getMonth() === now.getMonth() && 
               plantingDate.getFullYear() === now.getFullYear();
      }).reduce((sum, p) => sum + p.quantity, 0) || 0;

      setStats({
        totalTrees,
        thisMonth,
        totalPlantings: data?.length || 0,
      });
    } catch (error: any) {
      console.error('Error fetching plantings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('tree_plantings')
        .insert({
          user_id: user.id,
          species: formData.species,
          quantity: parseInt(formData.quantity),
          location: formData.location,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        });

      if (error) throw error;

      toast({
        title: "Trees Logged Successfully",
        description: `${formData.quantity} ${formData.species} trees recorded at ${formData.location}.`,
      });
      
      // Reset form and refresh data
      setFormData({
        species: "",
        quantity: "",
        location: "",
        latitude: "",
        longitude: "",
      });
      
      await fetchUserPlantings();
    } catch (error: any) {
      console.error('Error logging trees:', error);
      toast({
        title: "Could Not Log Trees",
        description: await getFriendlyErrorMessage(error, "Failed to log tree planting. Please try again."),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
        title: "Could Not Get Recommendations",
        description: await getFriendlyErrorMessage(error, "Failed to get recommendations. Please try again."),
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
              <Trees className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Tree Planting Monitoring</h1>
                <p className="text-muted-foreground">
                  Track reforestation efforts and get AI-powered species recommendations
                </p>
              </div>
            </div>

            {/* Statistics Dashboard */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Your Total Trees</CardDescription>
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
                  <CardDescription>Total Plantings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {stats.totalPlantings}
                  </div>
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
                    <CardTitle>Your Recent Plantings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userPlantings.length > 0 ? (
                      <div className="space-y-4">
                        {userPlantings.slice(0, 5).map((planting, index) => (
                          <div key={planting.id} className={`flex items-start gap-3 ${index < userPlantings.slice(0, 5).length - 1 ? 'pb-3 border-b' : ''}`}>
                            <MapPinIcon className="h-5 w-5 text-primary mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{planting.location}</p>
                              <p className="text-xs text-muted-foreground">
                                {planting.quantity} {planting.species} trees • {new Date(planting.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No plantings recorded yet. Start logging your tree planting activities!
                      </p>
                    )}
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
