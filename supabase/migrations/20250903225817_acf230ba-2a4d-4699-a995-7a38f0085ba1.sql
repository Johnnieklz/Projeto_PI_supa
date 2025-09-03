-- Inserir usuário de teste
-- Nota: Este é apenas para teste - em produção, usuários devem ser criados via signup

INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'teste@exemplo.com',
  '$2a$10$N0J6lF7zP8yT6D5YQ3JB2.ZKz5T5H1K5F3Q8M9N2R4L1X7Y9V6W0S', -- senha: 123456
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Usuário Teste"}',
  false,
  'authenticated',
  'authenticated'
);

-- Inserir perfil correspondente
INSERT INTO public.profiles (
  id,
  full_name,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Usuário Teste',
  now(),
  now()
);