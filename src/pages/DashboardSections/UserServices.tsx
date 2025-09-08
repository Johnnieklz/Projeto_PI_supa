import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const UserServices = ({ services, loading, handleDeleteService }: any) => (
  <Card>
    <CardHeader>
      <CardTitle>Meus Serviços</CardTitle>
      <CardDescription>Gerencie seus serviços disponíveis</CardDescription>
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando seus serviços...</p>
        </div>
      ) : services.length === 0 ? (
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
          {services.map((service: any) => (
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
                    <Button size="sm" variant="outline" title="Visualizar"><Eye className="h-3 w-3" /></Button>
                  </Link>
                  <Link to={`/services/edit/${service.id}`}>
                    <Button size="sm" variant="outline" title="Editar"><Edit className="h-3 w-3" /></Button>
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
);

export default UserServices;
