-- Create suggestions table
CREATE TABLE public.suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text,
  email text,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit suggestions
CREATE POLICY "Anyone can submit suggestions"
  ON public.suggestions
  FOR INSERT
  WITH CHECK (true);

-- Only allow users to view their own suggestions
CREATE POLICY "Users can view their own suggestions"
  ON public.suggestions
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);