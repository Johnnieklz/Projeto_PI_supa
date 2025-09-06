import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const categories = [
  "Design",
  "Tecnologia", 
  "Marketing",
  "Idiomas",
  "Consultoria",
  "Redação",
  "Vídeo",
  "Música",
  "Negócios"
];

const CreateService = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Você precisa estar logado para criar um serviço");
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      
      // Extrair dados do formulário
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const category = formData.get('category') as string;
      const price = parseFloat(formData.get('price') as string);
      const deliveryTime = formData.get('delivery-time') as string;
      const requirements = formData.get('requirements') as string;
      const extras = formData.get('extras') as string;

      // Converter delivery time para dias
      const deliveryDays = convertDeliveryTimeToDays(deliveryTime);

      // Criar o serviço
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .insert({
          user_id: user.id,
          title,
          description,
          category: category.toLowerCase(),
          price,
          delivery_days: deliveryDays,
          requirements: requirements || null,
          extras: extras || null,
        })
        .select()
        .single();

      if (serviceError) {
        console.error('Erro ao criar serviço:', serviceError);
        toast.error('Erro ao criar serviço');
        return;
      }

      // Criar imagens se houver
      if (images.length > 0 && service?.id) {
        const imageInserts = images.map(url => ({
          service_id: service.id,
          url
        }));

        const { error: imagesError } = await supabase
          .from('service_images')
          .insert(imageInserts);

        if (imagesError) {
          console.error('Erro ao salvar imagens:', imagesError);
          // Não bloquear a criação do serviço por causa das imagens
        }
      }

      toast.success("Serviço criado com sucesso!");
      
      // Atualizar listas se necessário
      window.dispatchEvent(new Event('serviceCreated'));
      
      navigate("/dashboard");
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao criar serviço');
    } finally {
      setIsLoading(false);
    }
  };

  const convertDeliveryTimeToDays = (deliveryTime: string): number => {
    switch (deliveryTime) {
      case '1-day': return 1;
      case '2-3-days': return 3;
      case '3-5-days': return 5;
      case '1-week': return 7;
      case '2-weeks': return 14;
      case '1-month': return 30;
      default: return 7;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Simulate image upload
      const newImages = Array.from(files).map((file, index) => 
        `https://images.unsplash.com/photo-${1460925895917 + index}?w=300&h=200&fit=crop`
      );
      setImages([...images, ...newImages].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Criar Novo Serviço
            </h1>
            <p className="text-muted-foreground">
              Compartilhe suas habilidades e comece a ganhar dinheiro
            </p>
          </div>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Informações do Serviço</CardTitle>
              <CardDescription>
                Preencha os detalhes para criar seu serviço
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título do Serviço *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Ex: Design de Logo Profissional"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Categoria *</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase()}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Descreva detalhadamente o que você oferece..."
                      rows={4}
                      required
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Preço (R$) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="299.00"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="delivery-time">Tempo de Entrega *</Label>
                    <Select name="delivery-time" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o prazo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-day">1 dia</SelectItem>
                        <SelectItem value="2-3-days">2-3 dias</SelectItem>
                        <SelectItem value="3-5-days">3-5 dias</SelectItem>
                        <SelectItem value="1-week">1 semana</SelectItem>
                        <SelectItem value="2-weeks">2 semanas</SelectItem>
                        <SelectItem value="1-month">1 mês</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <Label>Imagens do Serviço</Label>
                  <div className="mt-2">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Faça upload de até 5 imagens
                      </p>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        id="image-upload"
                        onChange={handleImageUpload}
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        Selecionar Imagens
                      </Button>
                    </div>
                    
                    {/* Preview Images */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="requirements">Requisitos do Cliente</Label>
                    <Textarea
                      id="requirements"
                      name="requirements"
                      placeholder="O que você precisa do cliente para começar o trabalho?"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="extras">Extras Disponíveis</Label>
                    <Textarea
                      id="extras"
                      name="extras"
                      placeholder="Serviços adicionais que você pode oferecer..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(-1)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 gradient-primary shadow-glow"
                    disabled={isLoading}
                  >
                    {isLoading ? "Criando..." : "Criar Serviço"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateService;