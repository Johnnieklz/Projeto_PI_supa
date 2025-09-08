-- Security Fix: Restrict profile visibility for privacy
-- Remove overly permissive profile access policy
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;

-- Update profile visibility: users can only view profiles of service providers (users with active services) or their own profile
CREATE POLICY "Users can view service provider profiles and their own" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = id 
  OR 
  EXISTS (
    SELECT 1 FROM public.services 
    WHERE services.user_id = profiles.id 
    AND services.active = true
  )
);