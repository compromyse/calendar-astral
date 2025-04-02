ALTER TABLE events RENAME COLUMN recurring TO subject;
ALTER TABLE events ADD COLUMN skipped DATE[];
ALTER TABLE events ADD COLUMN lessons INTEGER;
