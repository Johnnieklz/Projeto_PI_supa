import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, TrendingUp, Users, Star, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Mock data for contracts (this would come from a contracts table later)
const recentContracts = [
  {
    id: "1",
    service: "Design Gráfico Profissional",
    client: "João Silva",
    status: "Em Andamento",
    value: 299,
    deadline: "2025-01-15"
  },
  {
    id: "2",
    service: "Consultoria em UX/UI", 
    client: "Maria Santos",
    status: "Concluído",
    value: 799,
    deadline: "2025-01-10"
  },
  {
    id: "3",
    service: "Design Gráfico Profissional",
    client: "Pedro Costa",
    status: "Aguardando Aprovação",
    value: 299,
    deadline: "2025-01-20"
  }
];

const Dashboard = () => {
  const { user } = useAuth();
  const [userServices, setUserServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalServices: 0,
    totalContracts: 34,
    totalEarnings: 15420,
    monthlyGrowth: 23.4
  });

  const loadUserServices = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar serviços:', error);
        toast.error('Erro ao carregar seus serviços');
        return;
      }

      setUserServices(data || []);
      setStats(prev => ({
        ...prev,
        totalServices: data?.length || 0
      }));
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId: string, serviceTitle: string) => {
    if (!confirm(`Tem certeza que deseja excluir o serviço "${serviceTitle}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Erro ao excluir serviço:', error);
        toast.error('Erro ao excluir serviço');
        return;
      }

      toast.success('Serviço excluído com sucesso!');
      loadUserServices(); // Recarrega a lista
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao excluir serviço');
    }
  };

  useEffect(() => {
    if (user) {
      loadUserServices();
    }
  }, [user]);

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
            <Button className="gradient-primary shadow-glow mt-4 sm:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              Novo Serviço
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="gradient-subtle border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Serviços</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalServices}</div>
              <p className="text-xs text-muted-foreground">
                +2 novos este mês
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-subtle border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Contratos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalContracts}</div>
              <p className="text-xs text-muted-foreground">
                +7 novos este mês
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-subtle border-success/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ganhos Totais</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.monthlyGrowth}% este mês
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-subtle border-yellow-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.85</div>
              <p className="text-xs text-muted-foreground">
                Baseado em 34 avaliações
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList>
            <TabsTrigger value="services">Meus Serviços</TabsTrigger>
            <TabsTrigger value="contracts">Contratos</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Meus Serviços</CardTitle>
                <CardDescription>
                  Gerencie seus serviços disponíveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Carregando seus serviços...</p>
                  </div>
                ) : userServices.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Você ainda não criou nenhum serviço.</p>
                    <Link to="/services/new">
                      <Button className="gradient-primary">
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Primeiro Serviço
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-card transition-shadow">
                        <div className="space-y-1">
                          <h4 className="font-semibold">{service.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Badge variant="outline">{service.category}</Badge>
                            </span>
                            <span>Prazo: {service.delivery_days} dias</span>
                            <span className="flex items-center">
                              <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                              5.0
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <Badge variant={service.active ? "default" : "secondary"}>
                              {service.active ? "Ativo" : "Pausado"}
                            </Badge>
                            <p className="text-sm font-semibold text-success mt-1">
                              R$ {parseFloat(service.price).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Link to={`/services/${service.id}`}>
                              <Button size="sm" variant="outline" title="Visualizar">
                                <Eye className="h-3 w-3" />
                              </Button>
                            </Link>
                            <Link to={`/services/edit/${service.id}`}>
                              <Button size="sm" variant="outline" title="Editar">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </Link>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-destructive hover:text-destructive" 
                              title="Excluir"
                              onClick={() => handleDeleteService(service.id, service.title)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts">
            <Card>
              <CardHeader>
                <CardTitle>Contratos Recentes</CardTitle>
                <CardDescription>
                  Acompanhe o status dos seus contratos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentContracts.map((contract) => (
                    <Link 
                      key={contract.id} 
                      to={`/contracts/${contract.id}`}
                      className="block p-4 border rounded-lg hover:shadow-card transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold">{contract.service}</h4>
                          <p className="text-sm text-muted-foreground">Cliente: {contract.client}</p>
                          <p className="text-sm text-muted-foreground">Prazo: {new Date(contract.deadline).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={
                              contract.status === "Concluído" ? "default" :
                              contract.status === "Em Andamento" ? "secondary" : 
                              "outline"
                            }
                          >
                            {contract.status}
                          </Badge>
                          <p className="text-sm font-semibold mt-1">
                            R$ {contract.value.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;