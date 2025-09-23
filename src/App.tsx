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

  // VLibras accessibility widget - implementação robusta
  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    let retryCount = 0;
    const maxRetries = 3;
    
    const initializeVLibras = () => {
      try {
        if ((window as any).VLibras) {
          console.log('VLibras: Inicializando widget...');
          new (window as any).VLibras.Widget('https://vlibras.gov.br/app', {
            // Configurações do widget
            position: 'right',
            avatar: 'random',
            opacity: 0.8,
            width: 220,
            height: 160
          });
          console.log('VLibras: Widget inicializado com sucesso!');
        } else {
          throw new Error('VLibras não está disponível');
        }
      } catch (error) {
        console.error('VLibras: Erro na inicialização:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`VLibras: Tentativa ${retryCount}/${maxRetries}...`);
          setTimeout(initializeVLibras, 2000);
        }
      }
    };

    const loadVLibras = () => {
      // Verificar se já existe o script para evitar duplicação
      const existingScript = document.querySelector('script[src*="vlibras-plugin.js"]');
      if (existingScript) {
        console.log('VLibras: Script já carregado, inicializando...');
        setTimeout(initializeVLibras, 1000);
        return;
      }

      script = document.createElement('script');
      script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('VLibras: Script carregado com sucesso');
        // Aguardar um momento para garantir que o VLibras esteja completamente carregado
        setTimeout(initializeVLibras, 1000);
      };
      
      script.onerror = (error) => {
        console.error('VLibras: Erro ao carregar script:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`VLibras: Recarregando script - tentativa ${retryCount}/${maxRetries}...`);
          setTimeout(loadVLibras, 3000);
        } else {
          console.warn('VLibras: Falha ao carregar após múltiplas tentativas. Funcionalidade não disponível.');
        }
      };
      
      document.head.appendChild(script);
    };

    // Verificar se o documento já está carregado
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadVLibras);
    } else {
      // DOM já está pronto
      setTimeout(loadVLibras, 500);
    }

    return () => {
      // Cleanup
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      document.removeEventListener('DOMContentLoaded', loadVLibras);
    };
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
