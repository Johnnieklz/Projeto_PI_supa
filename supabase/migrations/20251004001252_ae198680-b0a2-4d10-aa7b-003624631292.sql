-- Habilitar RLS na tabela favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver seus próprios favoritos
CREATE POLICY "Users can view their own favorites"
ON public.favorites
FOR SELECT
USING (auth.uid() = user_id);

-- Usuários podem adicionar favoritos
CREATE POLICY "Users can insert their own favorites"
ON public.favorites
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Usuários podem remover seus próprios favoritos
CREATE POLICY "Users can delete their own favorites"
ON public.favorites
FOR DELETE
USING (auth.uid() = user_id);