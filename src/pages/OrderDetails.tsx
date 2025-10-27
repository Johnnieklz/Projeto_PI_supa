import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Clock, User, Calendar, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OrderDetails {
  id: string;
  status: string;
  amount: number;
  payment_id: string | null;
  created_at: string;
  service_id: string;
  user_id: string;
  provider_id: string;
  service: {
    title: string;
    description: string;
    price: number;
    delivery_days: number;
  };
  provider: {
    full_name: string;
    avatar_url: string | null;
  };
}

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        // First, get the order with basic info
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderError) throw orderError;

        // Then get the service details
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select('title, description, price, delivery_days')
          .eq('id', orderData.service_id)
          .single();

        if (serviceError) throw serviceError;

        // Finally get the provider details
        const { data: providerData, error: providerError } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', orderData.provider_id)
          .single();

        if (providerError) throw providerError;

        // Combine all the data
        const completeOrder = {
          ...orderData,
          service: serviceData,
          provider: providerData
        };

        setOrder(completeOrder);
      } catch (error) {
        console.error('Erro ao carregar pedido:', error);
        toast.error('Erro ao carregar detalhes do pedido');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

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

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Pedido não encontrado</h2>
              <Button onClick={() => navigate("/orders")}>Ver Meus Pedidos</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Detalhes do Pedido</CardTitle>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === "paid" 
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {order.status === "paid" ? "Pago" : "Pendente"}
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Informações do Serviço */}
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{order.service.title}</h3>
              <p className="text-muted-foreground mb-4">{order.service.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">
                  R$ {order.amount.toFixed(2)}
                </span>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{order.service.delivery_days} dias úteis</span>
                </div>
              </div>
            </div>

            {/* Informações do Prestador */}
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                {order.provider.avatar_url ? (
                  <img 
                    src={order.provider.avatar_url} 
                    alt={order.provider.full_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
              <div>
                <h4 className="font-medium">Prestador do Serviço</h4>
                <p className="text-muted-foreground">{order.provider.full_name}</p>
              </div>
            </div>

            {/* Detalhes do Pedido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(order.created_at), "dd 'de' MMMM', às' HH:mm", { 
                      locale: ptBR 
                    })}
                  </span>
                </div>
                {order.payment_id && (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Transação: {order.payment_id}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="font-medium text-primary">
                    R$ {order.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/orders")}
              >
                Voltar para Pedidos
              </Button>
              <Button
                className="flex-1"
                onClick={() => navigate(`/services/${order.service_id}`)}
              >
                Ver Serviço
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OrderDetails;