-- Criar tabela de serviços
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- pode futuramente virar FOREIGN KEY para tabela categories
  price NUMERIC(10,2) NOT NULL, -- melhor precisão para dinheiro
  delivery_days INTEGER NOT NULL, -- em dias, ao invés de texto
  requirements TEXT,
  extras TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela de imagens separada
CREATE TABLE public.service_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- (Opcional) Criar tabela de categorias
-- Facilita filtrar e validar categorias de serviços
CREATE TABLE public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_images ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para serviços
CREATE POLICY "Serviços visíveis se ativos ou do próprio dono" 
ON public.services
FOR SELECT
USING (active = true OR auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios serviços"
ON public.services
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios serviços"
ON public.services
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios serviços"
ON public.services
FOR DELETE
USING (auth.uid() = user_id);

-- Políticas RLS para imagens
CREATE POLICY "Imagens visíveis se pertencem a serviços ativos ou do próprio dono"
ON public.service_images
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.services s
    WHERE s.id = service_id
    AND (s.active = true OR s.user_id = auth.uid())
  )
);

CREATE POLICY "Usuários podem criar imagens para seus próprios serviços"
ON public.service_images
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.services s
    WHERE s.id = service_id
    AND s.user_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem deletar imagens dos seus próprios serviços"
ON public.service_images
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.services s
    WHERE s.id = service_id
    AND s.user_id = auth.uid()
  )
);

-- Trigger para updated_at em services
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Inserir categorias padrão
INSERT INTO public.categories (name) VALUES 
('Design'),
('Tecnologia'), 
('Marketing'),
('Idiomas'),
('Consultoria'),
('Redação'),
('Vídeo'),
('Música'),
('Negócios');