import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

const shareUrls = {
  whatsapp: (url: string, title: string) =>
    `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
  facebook: (url: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  instagram: () => "https://www.instagram.com/", // Instagram não permite compartilhamento direto via URL
};

type Props = {
  url: string;
  title: string;
};

export function ShareService({ url, title }: Props) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert("Link copiado!");
  };

  return (
    <div className="flex gap-2">
      <a
        href={shareUrls.whatsapp(url, title)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="outline" size="sm">
          WhatsApp
        </Button>
      </a>
      <a
        href={shareUrls.facebook(url)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="outline" size="sm">
          Facebook
        </Button>
      </a>
      <a href={shareUrls.instagram()} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="sm">
          Instagram
        </Button>
      </a>
      <Button variant="outline" size="sm" onClick={copyToClipboard}>
        <Copy className="h-4 w-4 mr-1" /> Copiar Link
      </Button>
    </div>
  );
}
