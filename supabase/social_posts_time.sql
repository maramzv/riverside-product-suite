-- Add a time-of-day to scheduled/published social posts (Press app).
-- Already applied; kept here as a record.

alter table "Social Posts" add column if not exists post_time text;

-- Give the existing seed posts a default so they don't display blank.
update "Social Posts" set post_time = '09:00' where post_time is null;

notify pgrst, 'reload schema';
