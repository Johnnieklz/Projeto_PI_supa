import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import React, { Suspense } from "react";
import Skeleton from "@/components/Skeleton";

// Lazy loading das seções
const ProfileStats = React.lazy(() => import("./DashboardSections/ProfileStats"));
const UserServices = React.lazy(() => import("./DashboardSections/UserServices"));
const RecentContracts = React.lazy(() => import("./DashboardSections/RecentContracts"));

const recentContractsMock = [
  { id: "1", service: "Design Gráfico Profissional", client: "João Silva", status: "Em Andamento", value: 299, deadline: "2025-01-15" },
  { id: "2", service: "Consultoria em UX/UI", client: "Maria Santos", status: "Concluído", value: 799, deadline: "2025-01-10" },
  { id: "3", service: "Design Gráfico Profissional", client: "Pedro Costa", status: "Aguardando Aprovação", value: 299, deadline: "2025-01-20" }
];

const Dashboard = () => {
  const { user } = useAuth();
  const [userServices, setUserServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalServices: 0, totalContracts: 34, totalEarnings: 15420, monthlyGrowth: 23.4 });

  const loadUserServices = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase.from('services').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (error) { toast.error('Erro ao carregar seus serviços'); return; }
      setUserServices(data || []);
      setStats(prev => ({ ...prev, totalServices: data?.length || 0 }));
    } catch (error) { toast.error('Erro inesperado ao carregar serviços'); }
    finally { setLoading(false); }
  };

  const handleDeleteService = async (id: string, title: string) => {
    if (!confirm(`Deseja excluir "${title}"?`)) return;
    const { error } = await supabase.from('services').delete().eq('id', id).eq('user_id', user?.id);
    if (error) { toast.error('Erro ao excluir serviço'); return; }
    toast.success('Serviço excluído!');
    loadUserServices();
  };

  useEffect(() => { if (user) loadUserServices(); }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Gerencie seus serviços e contratos</p>
          </div>
          <Link to="/services/new">
            <Button className="gradient-primary shadow-glow mt-4 sm:mt-0"><Plus className="mr-2 h-4 w-4" />Novo Serviço</Button>
          </Link>
        </div>

        <Suspense fallback={<Skeleton height="100px" />}>
          <ProfileStats stats={stats} />
        </Suspense>

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList>
            <TabsTrigger value="services">Meus Serviços</TabsTrigger>
            <TabsTrigger value="contracts">Contratos</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <Suspense fallback={<Skeleton height="200px" />}>
              <UserServices services={userServices} loading={loading} handleDeleteService={handleDeleteService} />
            </Suspense>
          </TabsContent>

          <TabsContent value="contracts">
            <Suspense fallback={<Skeleton height="200px" />}>
              <RecentContracts contracts={recentContractsMock} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
