-- Criar tabela de contratos
CREATE TABLE public.contracts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id uuid NOT NULL,
  client_id uuid NOT NULL,
  provider_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  value numeric NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_method text,
  description text NOT NULL,
  requirements text,
  delivery_days integer NOT NULL,
  deadline timestamp with time zone,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone
);

-- Habilitar RLS
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Clientes podem ver seus próprios contratos
CREATE POLICY "Clients can view their own contracts"
  ON public.contracts
  FOR SELECT
  USING (auth.uid() = client_id);

-- Prestadores podem ver contratos onde são o provider
CREATE POLICY "Providers can view their contracts"
  ON public.contracts
  FOR SELECT
  USING (auth.uid() = provider_id);

-- Clientes podem criar contratos
CREATE POLICY "Clients can create contracts"
  ON public.contracts
  FOR INSERT
  WITH CHECK (auth.uid() = client_id);

-- Clientes podem atualizar seus contratos
CREATE POLICY "Clients can update their contracts"
  ON public.contracts
  FOR UPDATE
  USING (auth.uid() = client_id);

-- Prestadores podem atualizar contratos onde são o provider
CREATE POLICY "Providers can update their contracts"
  ON public.contracts
  FOR UPDATE
  USING (auth.uid() = provider_id);

-- Índices para performance
CREATE INDEX idx_contracts_client_id ON public.contracts(client_id);
CREATE INDEX idx_contracts_provider_id ON public.contracts(provider_id);
CREATE INDEX idx_contracts_service_id ON public.contracts(service_id);
CREATE INDEX idx_contracts_status ON public.contracts(status);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();