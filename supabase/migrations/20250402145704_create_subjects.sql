CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  days INTEGER[] NOT NULL,
  lessons INTEGER,
  dates DATE[]
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own subjects"
ON subjects
FOR ALL 
USING (auth.uid() = user_id);

CREATE INDEX subjects_user_id_idx ON subjects(user_id);
