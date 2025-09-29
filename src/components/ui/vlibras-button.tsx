import React, { useEffect } from "react";

const VLibrasButton: React.FC = () => {
  useEffect(() => {
    const initVLibras = () => {
      if (window.VLibras) {
        // Inicializa o widget se já existe
        new window.VLibras.Widget("body");
      } else {
        // Cria o script e inicializa quando carregar
        const script = document.createElement("script");
        script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
        script.async = true;
        script.onload = () => {
          if (window.VLibras) {
            new window.VLibras.Widget("body");
          }
        };
        document.body.appendChild(script);
      }
    };

    initVLibras();
  }, []);

  return (
    <div
      className="fixed bottom-6 right-6 z-50"
      aria-label="VLibras"
      title="Acessibilidade VLibras"
    >
      {/* O botão do VLibras é gerado automaticamente pelo script */}
    </div>
  );
};

export default VLibrasButton;
