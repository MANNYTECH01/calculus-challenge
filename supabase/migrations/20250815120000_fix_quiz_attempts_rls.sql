-- Allow authenticated users to view all quiz attempts for the leaderboard and reviews.
-- The existing policy for INSERT is kept, so users can only create their own attempts.
CREATE POLICY "Allow read access to all authenticated users"
ON public.quiz_attempts
FOR SELECT
TO authenticated
USING (true);