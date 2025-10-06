import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  serviceId: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost";
  className?: string;
  showLabel?: boolean;
}

const FavoriteButton = ({
  serviceId,
  size = "sm",
  variant = "outline",
  className,
  showLabel = false,
}: FavoriteButtonProps) => {
  const navigate = useNavigate();
  const { isFavorite, isLoading, toggleFavorite, isAuthenticated } = useFavorites(serviceId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    await toggleFavorite();
  };

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        isFavorite && "text-red-500 hover:text-red-600",
        className
      )}
      title={
        !isAuthenticated
          ? "Faça login para favoritar"
          : isFavorite
          ? "Remover dos favoritos"
          : "Adicionar aos favoritos"
      }
    >
      <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
      {showLabel && (
        <span className="ml-2">{isFavorite ? "Favoritado" : "Favoritar"}</span>
      )}
    </Button>
  );
};

export default FavoriteButton;
