import React, { useEffect, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Skeleton from "@/components/Skeleton";

// Lazy loading das páginas
const Index = React.lazy(() => import("./pages/Index"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Services = React.lazy(() => import("./pages/Services"));
const ServiceDetail = React.lazy(() => import("./pages/ServiceDetail"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const CreateService = React.lazy(() => import("./pages/CreateService"));
const EditService = React.lazy(() => import("./pages/EditService"));
const Profile = React.lazy(() => import("./pages/Profile"));
const ContractDetail = React.lazy(() => import("./pages/ContractDetail"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));

const queryClient = new QueryClient();

const App = () => {

  // Inicializa VLibras
  useEffect(() => {
    const vlibrasScript = document.createElement("script");
    vlibrasScript.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    vlibrasScript.onload = () => {
      new (window as any).VLIBRAS.Widget("body");
    };
    document.body.appendChild(vlibrasScript);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<Skeleton height="200px" />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:id" element={<ServiceDetail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/services/new" element={
                  <ProtectedRoute>
                    <CreateService />
                  </ProtectedRoute>
                } />
                <Route path="/services/edit/:id" element={
                  <ProtectedRoute>
                    <EditService />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/contracts/:id" element={
                  <ProtectedRoute>
                    <ContractDetail />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
