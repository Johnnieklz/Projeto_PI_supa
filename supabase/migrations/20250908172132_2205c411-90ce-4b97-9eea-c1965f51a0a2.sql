-- Fix security issue: Restrict profile access to authenticated users only
-- This prevents anonymous users from viewing all user profiles

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create new policy that requires authentication to view profiles
CREATE POLICY "Authenticated users can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Keep existing policies for insert/update unchanged
-- Users can still insert their own profile: "Users can insert their own profile"
-- Users can still update their own profile: "Users can update their own profile"