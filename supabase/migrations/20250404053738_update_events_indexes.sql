DROP INDEX IF EXISTS events_title_idx;

CREATE INDEX idx_events_subject_id ON public.events (subject_id);
