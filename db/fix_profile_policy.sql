-- This SQL adds a policy to allow profile creation
-- Run this in your Supabase SQL editor

-- Allow users to insert their own profile
CREATE POLICY "Users can create their own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Alternative approach if service role needs to create profiles
-- This allows the service role to create any profile
CREATE POLICY "Service role can create any profile" 
  ON profiles FOR INSERT 
  USING (auth.jwt() ? 'service_role');
