-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create their own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can view their own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can update their own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can delete their own resumes" ON resumes;

DROP POLICY IF EXISTS "Users can create sections for their resumes" ON resume_sections;
DROP POLICY IF EXISTS "Users can view sections of their resumes" ON resume_sections;
DROP POLICY IF EXISTS "Users can update sections of their resumes" ON resume_sections;
DROP POLICY IF EXISTS "Users can delete sections of their resumes" ON resume_sections;

-- Enable RLS
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own resumes"
ON resumes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own resumes"
ON resumes FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes"
ON resumes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes"
ON resumes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Enable RLS for resume sections
ALTER TABLE resume_sections ENABLE ROW LEVEL SECURITY;

-- Create policies for resume sections
CREATE POLICY "Users can create sections for their resumes"
ON resume_sections FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM resumes
    WHERE id = resume_sections.resume_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can view sections of their resumes"
ON resume_sections FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM resumes
    WHERE id = resume_sections.resume_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update sections of their resumes"
ON resume_sections FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM resumes
    WHERE id = resume_sections.resume_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete sections of their resumes"
ON resume_sections FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM resumes
    WHERE id = resume_sections.resume_id
    AND user_id = auth.uid()
  )
); 