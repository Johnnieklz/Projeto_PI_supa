-- Fix critical security issue: Enable RLS on categories table
-- Categories should be publicly readable since they're just category names

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read categories
CREATE POLICY "Categories are publicly readable" 
ON public.categories 
FOR SELECT 
USING (true);