import React from "react";
import { Share2, Send, Copy, MessageCircle } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareMenuProps {
  service: {
    id: string;
    title: string;
    description?: string;
  };
}

export default function Sharemenu({ service }: ShareMenuProps) {
  const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(`${window.location.origin}/services/${service.id}`);
    }
  }, [service.id]);

  const copyLink = async () => {
    try {
      const url = window.location.href;

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success("✅ Link copiado para a área de transferência!");
      } else {
        // Prompt moderno e enxuto
        const linkPrompt = window.prompt("📎 Copie o link abaixo:", url);
        if (linkPrompt !== null) {
          toast.info("Link disponível para cópia manual.");
        }
      }
    } catch (err) {
      console.error("Erro ao copiar link:", err);
      const fallback = window.prompt("⚠️ Não foi possível copiar. Copie manualmente:", window.location.href);
      if (fallback !== null) {
        toast.error("Falha ao copiar automaticamente, use o link manual.");
      }
    }
  };


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label={`Compartilhar ${service.title}`}
          title="Compartilhar"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {/* Facebook */}
        <DropdownMenuItem asChild>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <FaFacebook className="mr-2 h-4 w-4 text-blue-600" /> Facebook
          </a>
        </DropdownMenuItem>

        {/* WhatsApp */}
        <DropdownMenuItem asChild>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              `Confira este serviço: ${service.title} - ${url}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
          </a>
        </DropdownMenuItem>

        {/* Telegram */}
        <DropdownMenuItem asChild>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(
              url
            )}&text=${encodeURIComponent(service.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <Send className="mr-2 h-4 w-4" /> Telegram
          </a>
        </DropdownMenuItem>

        {/* Instagram (placeholder) */}
        <DropdownMenuItem asChild>
          <a
            href={`https://www.instagram.com/?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <FaInstagram className="mr-2 h-4 w-4 text-pink-500" /> Instagram
          </a>
        </DropdownMenuItem>

        {/* Copiar link */}
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            copyLink();
          }}
        >
          <Copy className="mr-2 h-4 w-4" /> Copiar link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
