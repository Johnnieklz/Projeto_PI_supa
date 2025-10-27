import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Clock, CheckCircle2, XCircle, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";

interface Order {
  id: string;
  status: string;
  amount: number;
  created_at: string;
  services: {
    id: string;
    title: string;
    price: number;
  };
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          services (
            id,
            title,
            price
          ),
          profiles:provider_id (
            full_name,
            avatar_url
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar pedidos:", error);
        return;
      }

      setOrders(data || []);
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Pago";
      case "pending":
        return "Pendente";
      case "failed":
        return "Falhou";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <Clock className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Meus Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Você ainda não tem pedidos
                </p>
                <Button onClick={() => navigate("/services")}>
                  Explorar Serviços
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            {order.profiles.avatar_url ? (
                              <img
                                src={order.profiles.avatar_url}
                                alt={order.profiles.full_name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-6 h-6" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{order.services.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {order.profiles.full_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(order.created_at), "dd 'de' MMMM', às' HH:mm", { locale: ptBR })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-medium">
                            R$ {order.amount.toFixed(2)}
                          </span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/services/${order.services.id}`)}
                        >
                          Ver Serviço
                        </Button>
                        <Button
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          Detalhes do Pedido
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Orders;