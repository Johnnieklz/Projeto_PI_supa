-- Garantir constraint único para evitar duplicatas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'favorites_user_id_service_id_key'
  ) THEN
    ALTER TABLE public.favorites 
    ADD CONSTRAINT favorites_user_id_service_id_key 
    UNIQUE (user_id, service_id);
  END IF;
END $$;

-- Criar índice para melhor performance nas buscas
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_service_id ON public.favorites(service_id);