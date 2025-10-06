import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // usa o toast visual do projeto

interface FavoriteButtonProps {
  serviceId: string;
}

const FavoriteButton = ({ serviceId }: FavoriteButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Clique detectado no botão de favoritos:", serviceId);

    toast.success("Item adicionado aos favoritos ❤️");
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleClick}
      className="hover:text-red-600"
    >
      <Heart className="h-4 w-4 mr-1" />
    </Button>
  );
};

export default FavoriteButton;
