import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import { useParams } from "react-router-dom";
import {
  Star,
  Clock,
  MapPin,
  Shield,
  MessageCircle,
  Heart,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast as sonnerToast } from "sonner";
import Sharemenu from "@/components/ui/sharemenu";
import { addFavorite, removeFavorite, getFavoriteIdsByUser } from "@/lib/favorites";

// Mock service data
const service = {
  id: "1",
  title: "Design Gráfico Profissional",
  description:
    "Criação de logos, identidade visual e materiais gráficos para sua empresa com anos de experiência no mercado.",
  fullDescription: `Ofereço serviços completos de design gráfico para empresas e empreendedores que buscam uma identidade visual única e profissional. 

Meus serviços incluem:
• Criação de logos e marcas
• Identidade visual completa
• Cartões de visita e papelaria
• Materiais para redes sociais
• Banners e flyers
• Apresentações corporativas

Com mais de 8 anos de experiência no mercado, já atendi centenas de clientes satisfeitos. Utilizo as ferramentas mais modernas do mercado como Adobe Creative Suite, Figma e outras tecnologias de ponta.

Trabalho de forma colaborativa, sempre ouvindo as necessidades do cliente e garantindo entregas de alta qualidade dentro do prazo estabelecido.`,
  category: "Design",
  price: 299,
  rating: 4.9,
  reviews: 127,
  totalOrders: 340,
  deliveryTime: "3-5 dias",
  provider: {
    name: "Ana Silva",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    location: "São Paulo, SP",
    memberSince: "2020",
    rating: 4.8,
    totalReviews: 298,
    responseTime: "2 horas",
    languages: ["Português", "Inglês"],
  },
  images: [
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=400&fit=crop",
  ],
  features: [
    "Revisões ilimitadas",
    "Arquivos em alta resolução",
    "Suporte pós-entrega",
    "Garantia de satisfação",
  ],
};

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
  const actualServiceId = id && /[0-9a-fA-F-]{36}/.test(id) ? id : null;
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndFavorites = async () => {
      const user = (await import("@/integrations/supabase/client").then(mod => mod.supabase.auth.getUser())).data.user;
      if (!user) return;
      setUserId(user.id);

      if (actualServiceId) {
        const favoriteIds = await getFavoriteIdsByUser(user.id);
        setIsFavorite(favoriteIds.includes(actualServiceId));
      } else {
        setIsFavorite(false);
      }
    };
    fetchUserAndFavorites();
  }, [actualServiceId]);

  useEffect(() => {
    let unsub: { unsubscribe: () => void } | null = null;
    (async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        const uid = session?.user?.id ?? null;
        setUserId(uid);
        if (uid && actualServiceId) {
          getFavoriteIdsByUser(uid)
            .then(ids => setIsFavorite(ids.includes(actualServiceId)))
            .catch(() => {});
        }
      });
      unsub = subscription;
    })();
    return () => unsub?.unsubscribe();
  }, [actualServiceId]);

  const handleOrder = () => {
    toast({
      title: "Pedido iniciado!",
      description: "Você será redirecionado para o pagamento.",
    });
  };

  const handleContact = () => {
    toast({
      title: "Mensagem enviada",
      description: "Mensagem enviada para Ana Silva!",
    });
  };

  const toggleFavorite = async () => {
    if (!userId) {
      toast({ title: "Faça login para favoritar" });
      return;
    }
    if (!actualServiceId) {
      toast({ title: "Favoritar disponível apenas para serviços publicados" });
      return;
    }

    if (isFavorite) {
      await removeFavorite(userId, actualServiceId);
      toast({ title: "Removido dos favoritos" });
    } else {
      await addFavorite(userId, actualServiceId);
      toast({ title: "Adicionado aos favoritos" });
    }

    setIsFavorite(!isFavorite);
  };

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
                {service.images.map((image, index) => (
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
                        {service.rating} ({service.reviews} avaliações)
                      </div>
                      <div>|</div>
                      <div>{service.totalOrders} pedidos</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={toggleFavorite}
                      disabled={!userId || !actualServiceId}
                      title={!userId ? "Faça login para favoritar" : !actualServiceId ? "Disponível apenas para serviços publicados" : isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      className={isFavorite ? "text-red-500" : ""}
                    >
                      <Heart
                        className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                      />
                    </Button>

                    <Sharemenu service={{ id: (actualServiceId ?? id ?? service.id) as string, title: service.title }} />
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
                    {service.features.map((feature, index) => (
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
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                />
                              ))}
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
            <Card className="sticky top-24">
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
                      {service.provider.rating} ({service.provider.totalReviews})
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tempo de resposta:</span>
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
