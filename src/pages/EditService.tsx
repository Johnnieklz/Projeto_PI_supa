import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/Header";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const categories = ["Design", "Tecnologia", "Marketing", "Idiomas", "Consultoria"];

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    delivery_days: "",
    requirements: "",
    extras: "",
    active: true
  });

  useEffect(() => {
    if (id && user) {
      loadService();
    }
  }, [id, user]);

  const loadService = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Erro ao carregar serviço:', error);
        toast.error('Erro ao carregar serviço');
        navigate('/dashboard');
        return;
      }

      setFormData({
        title: data.title || "",
        description: data.description || "",
        category: data.category || "",
        price: data.price?.toString() || "",
        delivery_days: data.delivery_days?.toString() || "",
        requirements: data.requirements || "",
        extras: data.extras || "",
        active: data.active ?? true
      });
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao carregar serviço');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('services')
        .update({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          delivery_days: parseInt(formData.delivery_days),
          requirements: formData.requirements || null,
          extras: formData.extras || null,
          active: formData.active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao atualizar serviço:', error);
        toast.error('Erro ao atualizar serviço');
        return;
      }

      toast.success('Serviço atualizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao atualizar serviço');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Editar Serviço</h1>
              <p className="text-muted-foreground">Atualize as informações do seu serviço</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Serviço</CardTitle>
              <CardDescription>
                Preencha os dados para atualizar seu serviço
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="title">Título do Serviço *</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Design de Logo Profissional"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição *</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva seu serviço de forma clara e detalhada..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Categoria *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="price">Preço (R$) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="299.00"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="delivery_days">Prazo de Entrega (dias) *</Label>
                    <Input
                      id="delivery_days"
                      type="number"
                      placeholder="7"
                      value={formData.delivery_days}
                      onChange={(e) => setFormData({ ...formData, delivery_days: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="requirements">Requisitos do Cliente</Label>
                    <Textarea
                      id="requirements"
                      placeholder="O que você precisa do cliente para executar o serviço?"
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="extras">Extras/Adicionais</Label>
                    <Textarea
                      id="extras"
                      placeholder="Serviços extras que podem ser contratados..."
                      value={formData.extras}
                      onChange={(e) => setFormData({ ...formData, extras: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="active">Serviço Ativo</Label>
                      <p className="text-sm text-muted-foreground">
                        Quando ativo, seu serviço ficará visível para outros usuários
                      </p>
                    </div>
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 gradient-primary shadow-glow"
                    disabled={loading}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                  <Link to="/dashboard">
                    <Button type="button" variant="outline" className="w-full">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EditService;