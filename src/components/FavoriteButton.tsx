import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  serviceId: string;
}

const FavoriteButton = ({ serviceId }: FavoriteButtonProps) => {
  const navigate = useNavigate();
  const { isFavorite, isLoading, toggleFavorite, isAuthenticated } = useFavorites(serviceId);

  const isValidServiceId = serviceId && /[0-9a-fA-F-]{36}/.test(serviceId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isValidServiceId) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    await toggleFavorite();
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleClick}
      disabled={isLoading || !isValidServiceId}
      className={cn(
        "hover:text-red-600",
        isFavorite && isValidServiceId && "text-red-500"
      )}
      title={
        !isValidServiceId
          ? "Disponível apenas para serviços publicados"
          : !isAuthenticated
          ? "Faça login para favoritar"
          : isFavorite
          ? "Remover dos favoritos"
          : "Adicionar aos favoritos"
      }
    >
      <Heart className={cn("h-4 w-4 mr-1", isFavorite && isValidServiceId && "fill-current")} />
    </Button>
  );
};

export default FavoriteButton;
