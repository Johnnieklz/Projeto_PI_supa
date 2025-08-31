import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Dashboard from "./pages/Dashboard";
import CreateService from "./pages/CreateService";
import ContractDetail from "./pages/ContractDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/new" element={<CreateService />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contracts/:id" element={<ContractDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
