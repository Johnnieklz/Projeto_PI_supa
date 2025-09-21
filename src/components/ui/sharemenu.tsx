// src/components/ui/sharemenu.tsx
import React from "react";
import { Share2, Facebook, Instagram, Send, Copy, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ShareMenuProps {
  service: {
    id: string;
    title: string;
    description?: string;
  };
}

export default function Sharemenu({ service }: ShareMenuProps) {
  // monta a URL do serviço (ex.: https://meusite.com/services/1)
  const url = `${window.location.origin}/services/${service.id}`;

  const copyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        alert("Link copiado!"); // feedback simples (substituiremos por toast na Etapa 2)
      } else {
        // navegadores antigos
        window.prompt("Copie o link abaixo:", url);
      }
    } catch (err) {
      console.error("Erro ao copiar link:", err);
      window.prompt("Copie o link abaixo:", url);
    }
  };

  return (
    <DropdownMenu>
      {/* Trigger do dropdown: usamos o Button padrão do projeto para manter visual */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e: React.MouseEvent) => {
            // impede que o Link do card rode quando clicamos no botão
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
            <Facebook className="mr-2 h-4 w-4" /> Facebook
          </a>
        </DropdownMenuItem>

        {/* WhatsApp */}
        <DropdownMenuItem asChild>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Confira este serviço: ${service.title} - ${url}`)}`}
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
            href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(service.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <Send className="mr-2 h-4 w-4" /> Telegram
          </a>
        </DropdownMenuItem>

        {/* Instagram (observação: Instagram não tem share direto de URL igual ao WhatsApp; abrimos perfil/app) */}
        <DropdownMenuItem asChild>
          <a
            href={`https://www.instagram.com/?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <Instagram className="mr-2 h-4 w-4" /> Instagram
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
