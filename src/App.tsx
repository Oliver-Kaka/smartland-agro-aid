import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import CropRecommendation from "./pages/CropRecommendation";
import LandReclamation from "./pages/LandReclamation";
import TreePlanting from "./pages/TreePlanting";
import Auth from "./pages/Auth";
import Suggestions from "./pages/Suggestions";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FairUsage from "./pages/FairUsage";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";
import CookieConsent from "@/components/CookieConsent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CookieConsent />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/crop-recommendation" element={<CropRecommendation />} />
            <Route path="/land-reclamation" element={<LandReclamation />} />
            <Route path="/tree-planting" element={<TreePlanting />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/fair-usage" element={<FairUsage />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
