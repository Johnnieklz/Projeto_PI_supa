import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useFavorites = (serviceId?: string) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Buscar favoritos do usuário
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.id) {
        setIsFavorite(false);
        setFavoriteIds([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("service_id")
          .eq("user_id", user.id);

        if (error) throw error;

        const ids = (data || []).map((f) => f.service_id);
        setFavoriteIds(ids);

        if (serviceId) {
          setIsFavorite(ids.includes(serviceId));
        }
      } catch (error) {
        console.error("Erro ao buscar favoritos:", error);
      }
    };

    fetchFavorites();
  }, [user?.id, serviceId]);

  // Toggle favorito
  const toggleFavorite = async (targetServiceId?: string) => {
    const effectiveServiceId = targetServiceId || serviceId;

    if (!user?.id) {
      toast.error("Faça login para favoritar serviços");
      return { success: false, needsAuth: true };
    }

    if (!effectiveServiceId) {
      toast.error("Serviço inválido");
      return { success: false };
    }

    setIsLoading(true);

    try {
      const isFav = favoriteIds.includes(effectiveServiceId);

      if (isFav) {
        // Remover favorito
        const { error } = await supabase
          .from("favorites")
          .delete()
          .match({ user_id: user.id, service_id: effectiveServiceId });

        if (error) throw error;

        setFavoriteIds((prev) => prev.filter((id) => id !== effectiveServiceId));
        if (effectiveServiceId === serviceId) setIsFavorite(false);
        toast.success("Removido dos favoritos");
      } else {
        // Adicionar favorito
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, service_id: effectiveServiceId });

        if (error) throw error;

        setFavoriteIds((prev) => [...prev, effectiveServiceId]);
        if (effectiveServiceId === serviceId) setIsFavorite(true);
        toast.success("Adicionado aos favoritos");
      }

      return { success: true };
    } catch (error: any) {
      console.error("Erro ao atualizar favorito:", error);
      toast.error("Erro ao atualizar favorito");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isFavorite,
    isLoading,
    toggleFavorite,
    favoriteIds,
    isAuthenticated: !!user,
  };
};
