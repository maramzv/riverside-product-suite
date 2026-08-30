-- Add contact / identity columns to the existing "Store Info" table and fill
-- them with the canonical values (previously hard-coded in the Ask chatbot).
-- Run once in the Supabase SQL editor. Reader and Shelves then read them from here.

alter table "Store Info" add column if not exists store_name  text;
alter table "Store Info" add column if not exists address     text;
alter table "Store Info" add column if not exists phone       text;
alter table "Store Info" add column if not exists email       text;  -- customer-facing (Reader, Ask)
alter table "Store Info" add column if not exists staff_email text;  -- staff-facing (Shelves)

update "Store Info" set
  store_name  = 'Riverside Books',
  address     = '428 Riverfront Place, Suite 100, Portland, OR 97201',
  phone       = '(503) 555-0192',
  email       = 'hello@riversidebooks.com',
  staff_email = 'staff@riversidebooks.com'
where store_info_id = 1;

notify pgrst, 'reload schema';
