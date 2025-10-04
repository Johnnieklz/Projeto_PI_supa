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
const Chat = React.lazy(() => import("./pages/Chat"));

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000;

    const injectVLibrasContainer = () => {
      // Remove container existente, se houver
      const existingContainer = document.querySelector('div[vw="true"]');
      if (existingContainer) {
        existingContainer.remove();
      }

      // Cria o container principal
      const container = document.createElement('div');
      container.setAttribute('vw', 'true');
      container.className = 'enabled';
      container.style.cssText = 'position: fixed; z-index: 9999; right: 0; top: 40%;';

      // Cria o botão de acesso
      const button = document.createElement('div');
      button.setAttribute('vw-access-button', 'true');
      button.className = 'active';
      container.appendChild(button);

      // Cria o wrapper do plugin
      const wrapper = document.createElement('div');
      wrapper.setAttribute('vw-plugin-wrapper', 'true');
      container.appendChild(wrapper);

      // Adiciona ao body
      document.body.appendChild(container);
      return container;
    };

    const initializeVLibras = () => {
      if (!(window as any).VLibras) {
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`VLibras: Tentativa ${retryCount}/${maxRetries}`);
          setTimeout(initializeVLibras, retryDelay);
          return;
        }
        console.error("VLibras: Falha na inicialização");
        return;
      }

      try {
        // Primeiro injeta o container
        injectVLibrasContainer();

        // Depois inicializa o widget
        new (window as any).VLibras.Widget("https://vlibras.gov.br/app");
        console.log("VLibras: Inicializado com sucesso");
      } catch (error) {
        console.error("VLibras: Erro na inicialização:", error);
      }
    };

    const loadVLibras = () => {
      const existingScript = document.querySelector('script[src*="vlibras-plugin.js"]');
      if (existingScript) {
        console.log("VLibras: Script já carregado");
        initializeVLibras();
        return;
      }

      script = document.createElement("script");
      script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log("VLibras: Script carregado");
        initializeVLibras();
      };

      script.onerror = () => {
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`VLibras: Erro no carregamento - tentativa ${retryCount}/${maxRetries}`);
          setTimeout(loadVLibras, retryDelay);
        } else {
          console.error("VLibras: Falha no carregamento do script");
        }
      };

      document.head.appendChild(script);
    };

    // Inicia o carregamento após um delay
    setTimeout(loadVLibras, 2000);

    return () => {
      // Cleanup
      const container = document.querySelector('div[vw="true"]');
      if (container) container.remove();
      if (script) script.remove();
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
                <Route path="/chat" element={<Chat />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                  path="/services/new"
                  element={
                    <ProtectedRoute>
                      <CreateService />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/services/edit/:id"
                  element={
                    <ProtectedRoute>
                      <EditService />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/contracts/:id"
                  element={
                    <ProtectedRoute>
                      <ContractDetail />
                    </ProtectedRoute>
                  }
                />
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
