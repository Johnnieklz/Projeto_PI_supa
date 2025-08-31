import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Users, Shield, Zap, Search, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const featuredServices = [
    {
      id: "1",
      title: "Design Gráfico",
      description: "Logos e identidade visual profissional",
      price: 299,
      rating: 4.9,
      category: "Design",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop"
    },
    {
      id: "2", 
      title: "Desenvolvimento Web",
      description: "Sites modernos e responsivos",
      price: 1299,
      rating: 4.8,
      category: "Tecnologia",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop"
    },
    {
      id: "3",
      title: "Marketing Digital",
      description: "Estratégias para aumentar suas vendas",
      price: 499,
      rating: 4.7,
      category: "Marketing",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop"
    }
  ];

  const stats = [
    { label: "Serviços Disponíveis", value: "10,000+" },
    { label: "Profissionais Ativos", value: "5,000+" },
    { label: "Projetos Concluídos", value: "25,000+" },
    { label: "Satisfação do Cliente", value: "98%" }
  ];

  const features = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Encontre Facilmente",
      description: "Sistema de busca avançado para encontrar exatamente o que precisa"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Pagamento Seguro",
      description: "Transações protegidas e garantia de satisfação"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Profissionais Verificados",
      description: "Todos os prestadores são verificados e avaliados"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Entrega Rápida",
      description: "Receba seu projeto no prazo combinado"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-subtle" />
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Conecte-se com 
                  <span className="gradient-primary bg-clip-text text-transparent block">
                    Profissionais
                  </span>
                  de Alta Qualidade
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  A maior plataforma de serviços do Brasil. Encontre o profissional perfeito para transformar suas ideias em realidade.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/services">
                  <Button size="lg" className="gradient-primary shadow-glow animate-pulse-glow">
                    Explorar Serviços
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/services/new">
                  <Button size="lg" variant="outline" className="hover:shadow-elegant">
                    Começar a Vender
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-elegant animate-float">
                <img
                  src={heroImage}
                  alt="ServiceHub - Plataforma de Serviços"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 gradient-accent p-4 rounded-2xl shadow-glow">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Por que escolher o ServiceHub?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A plataforma mais confiável e completa para encontrar e contratar serviços profissionais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 border-primary/10">
                <CardHeader>
                  <div className="gradient-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Serviços em Destaque</h2>
            <p className="text-xl text-muted-foreground">
              Os serviços mais procurados da nossa plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredServices.map((service) => (
              <Link key={service.id} to={`/services/${service.id}`}>
                <Card className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 shadow-card">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-t-lg overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{service.category}</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        {service.rating}
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="mb-4">
                      {service.description}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        R$ {service.price.toLocaleString()}
                      </span>
                      <Button size="sm" className="gradient-primary">
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link to="/services">
              <Button size="lg" variant="outline" className="hover:shadow-elegant">
                Ver Todos os Serviços
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Pronto para começar sua jornada?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a milhares de profissionais e clientes que já transformam ideias em realidade
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="shadow-elegant">
                Criar Conta Grátis
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Explorar Agora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final Stats */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
