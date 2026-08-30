-- Align the rewards rule with the Reader app (the source of truth for the
-- stamp-card program) and remove the birthday discount, which the Reader
-- never offered. Already applied; kept here as a record.

update "Store Info" set
  reward_rule = 'Earn one stamp with every book purchase. Fill your 10-stamp card and pick a reward at the counter: a free book, exclusive access, or a keepsake.'
where store_info_id = 1;

alter table "Store Info" drop column if exists birthday_discount_rule;

notify pgrst, 'reload schema';

-- Note: the Customers.birthday column (per-customer date of birth) is left in
-- place — it's data, not a rewards rule, and nothing surfaces it to customers.
