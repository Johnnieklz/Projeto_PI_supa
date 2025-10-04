import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User, Save, LogOut, Heart } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { getFavoriteServicesByUser } from "@/lib/favorites";

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    avatar_url: ""
  });
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loadingFav, setLoadingFav] = useState(true);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        avatar_url: profile.avatar_url || ""
      });
    }
  }, [profile]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      setLoadingFav(true);
      try {
        const services = await getFavoriteServicesByUser(user.id);
        setFavorites(services || []);
      } catch (e) {
        console.error('Erro ao carregar favoritos', e);
      } finally {
        setLoadingFav(false);
      }
    };
    loadFavorites();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        toast.error('Erro ao salvar as alterações');
      } else {
        toast.success('Perfil atualizado com sucesso!');
        // Força uma atualização do contexto
        window.location.reload();
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao salvar');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
        </div>

        <div className="space-y-6">
          {/* Profile Picture Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Foto do Perfil
              </CardTitle>
              <CardDescription>
                Atualize sua foto de perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.avatar_url || undefined} />
                  <AvatarFallback className="text-lg">
                    {formData.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label htmlFor="avatar_url">URL da Imagem</Label>
                  <Input
                    id="avatar_url"
                    type="url"
                    placeholder="https://exemplo.com/sua-foto.jpg"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Cole o link de uma imagem da web
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações básicas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo</Label>
                  <Input
                    id="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    O e-mail não pode ser alterado
                  </p>
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button 
                    type="submit" 
                    className="gradient-primary shadow-glow"
                    disabled={loading}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Favorites Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5" /> Meus Favoritos
              </CardTitle>
              <CardDescription>Serviços que você marcou como favorito</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingFav ? (
                <p className="text-muted-foreground">Carregando favoritos...</p>
              ) : favorites.length === 0 ? (
                <p className="text-muted-foreground">Você ainda não tem favoritos.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favorites.map((srv) => (
                    <Link key={srv.id} to={`/services/${srv.id}`} className="block p-3 rounded-md border hover:shadow-elegant transition">
                      <div className="font-medium">{srv.title}</div>
                      <div className="text-sm text-muted-foreground">{srv.category} • {srv.delivery_days} dias • R$ {Number(srv.price).toLocaleString()}</div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Ações da Conta</CardTitle>
              <CardDescription>
                Gerencie sua sessão
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleLogout}
                variant="destructive"
                className="w-full sm:w-auto"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Fazer Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;