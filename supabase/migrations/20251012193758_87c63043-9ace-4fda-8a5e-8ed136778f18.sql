-- Drop the existing insecure policy
DROP POLICY IF EXISTS "Users can view their own suggestions" ON public.suggestions;

-- Create a secure policy: users can only view their own suggestions
CREATE POLICY "Users can view only their own suggestions" 
ON public.suggestions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Add admin policy to allow admins to view all suggestions for moderation
CREATE POLICY "Admins can view all suggestions" 
ON public.suggestions 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));