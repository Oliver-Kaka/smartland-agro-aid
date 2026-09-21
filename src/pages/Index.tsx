import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Sprout, MapPin, Trees, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-agriculture.jpg";
import cropAiImage from "@/assets/crop-ai.jpg";
import landImage from "@/assets/land-reclamation.jpg";
import treesImage from "@/assets/tree-planting.jpg";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/50" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              AI-Powered Platform for Sustainable Agriculture
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Combat land degradation with data-driven insights, smart crop recommendations, 
              and comprehensive land reclamation tools.
            </p>
            <Link to="/crop-recommendation">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Solutions for Land Management
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Leverage AI and GIS technology to make informed decisions about 
              crop selection, land reclamation, and reforestation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/crop-recommendation" className="group">
              <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={cropAiImage} 
                    alt="AI Crop Recommendation"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Sprout className="h-6 w-6 text-primary" />
                    <CardTitle>AI Crop Recommendation</CardTitle>
                  </div>
                  <CardDescription>
                    Get personalized crop suggestions based on soil conditions, location, 
                    and historical data. Includes detailed planting guides and yield predictions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="gap-2 group-hover:gap-3 transition-all">
                    Explore <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link to="/land-reclamation" className="group">
              <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={landImage} 
                    alt="Land Reclamation Analysis"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-6 w-6 text-primary" />
                    <CardTitle>Land Reclamation Analysis</CardTitle>
                  </div>
                  <CardDescription>
                    Identify potential areas for dam construction and swamp reclamation 
                    using advanced GIS data and AI-powered recommendations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="gap-2 group-hover:gap-3 transition-all">
                    Explore <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link to="/tree-planting" className="group">
              <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={treesImage} 
                    alt="Tree Planting Monitoring"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Trees className="h-6 w-6 text-primary" />
                    <CardTitle>Tree Planting Monitoring</CardTitle>
                  </div>
                  <CardDescription>
                    Log and track tree planting activities with GPS verification. 
                    Get AI recommendations for native species suited to your region.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="gap-2 group-hover:gap-3 transition-all">
                    Explore <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
