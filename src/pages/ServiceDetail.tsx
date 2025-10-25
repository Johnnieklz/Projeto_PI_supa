import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import { useParams } from "react-router-dom";
import { Star, Clock, MapPin, Shield, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Sharemenu from "@/components/ui/sharemenu";
import FavoriteButton from "@/components/FavoriteButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const reviews = [
  {
    id: "1",
    user: "Carlos Santos",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    rating: 5,
    comment:
      "Trabalho excepcional! Ana entendeu perfeitamente o que eu precisava e entregou muito além das expectativas. Super recomendo!",
    date: "2025-01-10",
  },
  {
    id: "2",
    user: "Mariana Costa",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
    rating: 5,
    comment:
      "Profissional incrível! Entregou no prazo, com qualidade excepcional e sempre muito atenciosa. Já contratei várias vezes.",
    date: "2025-01-08",
  },
  {
    id: "3",
    user: "Pedro Oliveira",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    rating: 4,
    comment:
      "Muito bom trabalho, ficou exatamente como imaginei. Comunicação excelente durante todo o processo.",
    date: "2025-01-05",
  },
];

const ServiceDetail = () => {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast: uiToast } = useToast();

  // Buscar serviço do banco de dados
  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // Primeiro, buscar o serviço
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select('*')
          .eq('id', id)
          .eq('active', true)
          .single();

        if (serviceError) {
          console.error('Erro ao carregar serviço:', serviceError);
          toast.error('Erro ao carregar serviço');
          return;
        }

        if (serviceData) {
          // Buscar informações do provedor separadamente
          let providerData = null;
          if (serviceData.user_id) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('id, full_name, avatar_url, created_at, location')
              .eq('id', serviceData.user_id)
              .single();

            if (!profileError) {
              providerData = profileData;
            }
          }

          // Buscar reviews do serviço
          const { data: reviewsData, error: reviewsError } = await supabase
            .from('reviews')
            .select('*')
            .eq('service_id', id)
            .order('created_at', { ascending: false });

          if (reviewsError) {
            console.error('Erro ao carregar reviews:', reviewsError);
          }

          // Buscar estatísticas do provedor (outros serviços do mesmo usuário)
          let providerRating = 4.8;
          let totalReviews = 0;
          let totalOrders = 0;

          if (serviceData.user_id) {
            // Buscar todos os serviços ativos do provedor
            const { data: providerServices, error: servicesError } = await supabase
              .from('services')
              .select('id, total_orders')
              .eq('user_id', serviceData.user_id)
              .eq('active', true);

            if (!servicesError && providerServices) {
              // Calcular total de pedidos
              totalOrders = providerServices.reduce((sum, service) => 
                sum + (service.total_orders || 0), 0
              );

              // Buscar reviews de todos os serviços do provedor
              const serviceIds = providerServices.map(service => service.id);
              const { data: allReviews, error: allReviewsError } = await supabase
                .from('reviews')
                .select('rating')
                .in('service_id', serviceIds);

              if (!allReviewsError && allReviews && allReviews.length > 0) {
                providerRating = allReviews.reduce((sum, review) => 
                  sum + (review.rating || 0), 0
                ) / allReviews.length;
                totalReviews = allReviews.length;
              }
            }
          }

          // Formatar os dados do serviço
          const formattedService = {
            id: serviceData.id,
            title: serviceData.title,
            description: serviceData.description,
            fullDescription: serviceData.full_description || serviceData.description,
            category: serviceData.category,
            price: serviceData.price,
            rating: serviceData.average_rating || 5.0,
            reviews: reviewsData?.length || 0,
            totalOrders: serviceData.total_orders || totalOrders || 0,
            deliveryTime: `${serviceData.delivery_days || 7} dias`,
            provider: {
              name: providerData?.full_name || "Usuário",
              avatar: providerData?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
              location: providerData?.location || "Brasil",
              memberSince: providerData?.created_at 
                ? new Date(providerData.created_at).getFullYear().toString() 
                : "2024",
              rating: providerRating,
              totalReviews: totalReviews,
              responseTime: "2 horas",
              languages: ["Português"]
            },
            images: serviceData.images && serviceData.images.length > 0 
              ? serviceData.images 
              : [
                  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
                  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
                  "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=400&fit=crop",
                ],
            features: serviceData.features && serviceData.features.length > 0 
              ? serviceData.features 
              : [
                  "Revisões ilimitadas",
                  "Arquivos em alta resolução",
                  "Suporte pós-entrega",
                  "Garantia de satisfação",
                ]
          };

          setService(formattedService);
        }
      } catch (error) {
        console.error('Erro inesperado:', error);
        toast.error('Erro ao carregar serviço');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleOrder = () => {
    uiToast({
      title: "Pedido iniciado!",
      description: "Você será redirecionado para o pagamento.",
    });
  };

  const handleContact = () => {
    uiToast({
      title: "Mensagem enviada",
      description: `Mensagem enviada para ${service?.provider.name || 'o prestador'}!`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando serviço...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Serviço não encontrado.</p>
            <Link to="/services">
              <Button className="mt-4">Voltar para serviços</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10">
                <img
                  src={service.images[currentImage]}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2 p-4">
                {service.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImage === index
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </Card>

            {/* Service Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Badge variant="secondary">{service.category}</Badge>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        {service.rating.toFixed(1)} ({service.reviews} avaliações)
                      </div>
                      <div>|</div>
                      <div>{service.totalOrders} pedidos</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FavoriteButton
                      serviceId={service.id}
                      size="sm"
                      variant="outline"
                    />
                    <Sharemenu
                      service={{
                        id: service.id,
                        title: service.title,
                      }}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{service.description}</p>

                  <div className="prose max-w-none">
                    <div className="whitespace-pre-line text-sm">
                      {service.fullDescription}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                    {service.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-success" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Avaliações ({service.reviews})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="flex space-x-4">
                      <Avatar>
                        <AvatarImage src={review.avatar} />
                        <AvatarFallback>{review.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{review.user}</h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <div className="flex items-center mr-2">
                              {Array.from({ length: review.rating }).map(
                                (_, i) => (
                                  <Star
                                    key={i}
                                    className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                  />
                                )
                              )}
                            </div>
                            {new Date(review.date).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Card */}
            <Card className="sticky top-6">
              <CardHeader>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    R$ {service.price.toLocaleString()}
                  </div>
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    Entrega em {service.deliveryTime}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full gradient-primary shadow-glow"
                  size="lg"
                  onClick={handleOrder}
                >
                  Fazer Pedido
                </Button>

                <Link to="/chat">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleContact}
                  >
                    Conversar
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Provider Info */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre o Prestador</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={service.provider.avatar} />
                    <AvatarFallback>{service.provider.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{service.provider.name}</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {service.provider.location}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Membro desde:</span>
                    <span>{service.provider.memberSince}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avaliação:</span>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      {service.provider.rating.toFixed(1)} ({service.provider.totalReviews})
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Tempo de resposta:
                    </span>
                    <span>{service.provider.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Idiomas:</span>
                    <span>{service.provider.languages.join(", ")}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Ver Perfil Completo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceDetail;