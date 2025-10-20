import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FavoriteButtonProps {
  serviceId: string;
}

const FavoriteButton = ({ serviceId }: FavoriteButtonProps) => {
  const navigate = useNavigate();
  const { isFavorite, isLoading, toggleFavorite, isAuthenticated } = useFavorites(serviceId);

  const [localFavorite, setLocalFavorite] = useState(false);

  const isValidServiceId = serviceId && /[0-9a-fA-F-]{36}/.test(serviceId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Simular favoritos para serviços de demonstração (IDs não-UUID)
    if (!isValidServiceId) {
      setLocalFavorite((prev) => {
        const next = !prev;
        toast.success(next ? "Adicionado aos favoritos (simulação)" : "Removido dos favoritos (simulação)");
        return next;
      });
      return;
    }

    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    await toggleFavorite();
  };

  const favored = isValidServiceId ? isFavorite : localFavorite;

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "hover:text-red-600",
        favored && "text-red-500"
      )}
      title={
        !isValidServiceId
          ? (localFavorite ? "Remover dos favoritos (simulação)" : "Adicionar aos favoritos (simulação)")
          : !isAuthenticated
          ? "Faça login para favoritar"
          : isFavorite
          ? "Remover dos favoritos"
          : "Adicionar aos favoritos"
      }
    >
      <Heart className={cn("h-4 w-4 mr-1", favored && "fill-current")} />
    </Button>
  );
};

export default FavoriteButton;
