import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const navigate = useNavigate();

  // Verificar se há um token válido na URL e processar diferentes fluxos de autenticação
  useEffect(() => {
    const setup = async () => {
      // 1) Se vier com "code" na URL (fluxo PKCE), troca por sessão
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (error) {
          setTokenValid(false);
          toast.error("Link inválido ou expirado. Solicite um novo.");
          return;
        }
        setTokenValid(true);
        // Limpa a URL
        window.history.replaceState({}, document.title, '/reset-password');
        return;
      }

      // 2) Tenta pegar sessão (caso implicit via hash já tenha sido processado)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setTokenValid(true);
        return;
      }

      // 3) Verifica hash implicit (access_token + type=recovery)
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');

      if (accessToken && type === 'recovery') {
        setTokenValid(true);
        return;
      }

      setTokenValid(false);
      toast.error("Link de recuperação inválido ou expirado. Solicite um novo.");
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') {
        setTokenValid(true);
      }
    });

    setup();

    return () => subscription.unsubscribe();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validação simples
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Token de recuperação inválido ou expirado. Solicite um novo link.");
      } else if (error.message.includes("Password should be at least 6 characters")) {
        toast.error("A senha deve ter pelo menos 6 caracteres.");
      } else {
        toast.error(`Erro ao alterar senha: ${error.message}`);
      }
    } else {
      toast.success("Senha alterada com sucesso!");
      navigate("/auth"); // redireciona para página de login
    }

    setLoading(false);
  };

  // Mostrar loading enquanto verifica o token
  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando link de recuperação...</p>
        </div>
      </div>
    );
  }

  // Mostrar erro se token inválido
  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="shadow-elegant border-primary/20 border rounded-2xl bg-background p-6">
            <h1 className="text-2xl font-bold mb-4 text-destructive">Link Inválido</h1>
            <p className="text-muted-foreground mb-6">
              O link de recuperação de senha é inválido ou expirou. Solicite um novo link.
            </p>
            <Link 
              to="/forgot-password" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background gradient-primary shadow-glow h-10 px-4 py-2 w-full"
            >
              Solicitar Novo Link
            </Link>
            <p className="text-center text-sm text-muted-foreground mt-4">
              <Link to="/auth" className="text-primary hover:underline">
                ← Voltar para o login
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="gradient-primary h-10 w-10 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ServiceHub
            </span>
          </Link>

          <h1 className="text-2xl font-bold">Definir nova senha</h1>
          <p className="text-muted-foreground">
            Escolha uma nova senha para acessar sua conta
          </p>
        </div>

        <div className="shadow-elegant border-primary/20 border rounded-2xl bg-background p-6">
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar senha</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirme sua nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full gradient-accent shadow-glow"
              disabled={loading}
            >
              {loading ? "Atualizando..." : "Alterar senha"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              <Link to="/" className="text-primary hover:underline">
                ← Voltar para o login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
