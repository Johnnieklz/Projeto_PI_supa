import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { Search, Star, MapPin, Clock, Plus } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for services
const services = [
  {
    id: "1",
    title: "Design Gráfico Profissional",
    description: "Criação de logos, identidade visual e materiais gráficos para sua empresa",
    category: "Design",
    price: 299,
    rating: 4.9,
    reviews: 127,
    provider: "Ana Silva",
    location: "São Paulo, SP",
    deliveryTime: "3-5 dias",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop"
  },
  {
    id: "2", 
    title: "Desenvolvimento de Website",
    description: "Sites responsivos e modernos com as melhores tecnologias do mercado",
    category: "Tecnologia",
    price: 1299,
    rating: 4.8,
    reviews: 89,
    provider: "Carlos Santos",
    location: "Rio de Janeiro, RJ",
    deliveryTime: "7-14 dias",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop"
  },
  {
    id: "3",
    title: "Consultoria em Marketing Digital",
    description: "Estratégias personalizadas para aumentar suas vendas online",
    category: "Marketing",
    price: 499,
    rating: 4.7,
    reviews: 156,
    provider: "Mariana Costa",
    location: "Belo Horizonte, MG",
    deliveryTime: "2-3 dias",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop"
  },
  {
    id: "4",
    title: "Tradução Profissional",
    description: "Tradução precisa e rápida para inglês, espanhol e francês",
    category: "Idiomas",
    price: 199,
    rating: 4.9,
    reviews: 203,
    provider: "Lucas Ferreira",
    location: "Florianópolis, SC",
    deliveryTime: "1-2 dias",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop"
  }
];

const categories = ["Todos", "Design", "Tecnologia", "Marketing", "Idiomas", "Consultoria"];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Encontre o Serviço Perfeito
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Conecte-se com profissionais qualificados e transforme suas ideias em realidade
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Pesquisar serviços..."
                className="pl-10 h-12 text-lg shadow-elegant"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "Todos" ? "default" : "outline"}
                className={category === "Todos" ? "gradient-primary shadow-glow" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Create Service Button */}
        <div className="flex justify-end mb-8">
          <Link to="/services/new">
            <Button className="gradient-accent shadow-glow">
              <Plus className="mr-2 h-4 w-4" />
              Criar Serviço
            </Button>
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service) => (
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
                      {service.rating} ({service.reviews})
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="line-clamp-2 mb-4">
                    {service.description}
                  </CardDescription>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {service.provider} • {service.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Entrega em {service.deliveryTime}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
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

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="hover:shadow-elegant">
            Carregar Mais Serviços
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Services;