# Riverside Product Suite — Progress Log

Running record of changes made while getting the 4-app suite presentation / portfolio ready.
Newest work at the top of each section. Ask Claude to "update the progress log" to append new entries.

- **Repo:** maramzv/riverside-product-suite → deploys to riverside-product-suite.vercel.app
- **Apps:** Reader (`public/apps/reader`), Ask/chatbot (`public/apps/ask`), Shelves (`apps/shelves` → built into `public/apps/shelves`), Press (`public/apps/press`)
- **Shared backend:** one Supabase project (`wulylpywtdgoxamwlxlu`)

---

## Status at a glance

| Area | State |
|---|---|
| Reader UI polish (rewards card, star, modals) | ✅ Done, deployed |
| DEMO — Prefill + account-driven modals (Reader) | ✅ Done, deployed |
| Chatbot: developer language removed | ✅ Done, deployed |
| Shelves: customer names + live-arrival flash | ✅ Done, deployed |
| Press: colored book-cover cards | ✅ Done, deployed |
| Store info (hours/address/contact) centralized in Supabase | ✅ Done, deployed |
| Rewards rule unified + birthday discount removed | 🟡 DB done, code changes uncommitted |
| Reservation / pre-order flow (chatbot writes fake data) | 🔴 Not started — needs team decision |
| Loyalty stamp actually awarded on pickup | 🔴 Not wired in any app — needs decision |
| Reader "order ready" notification bug | 🔴 Known, not fixed (waits on status vocabulary decision) |

---

## Open decisions (need the team)

See the Slack draft / call agenda. The blockers:

1. **Does the chatbot create real reservations?** (currently fakes them — writes nothing to Supabase)
2. **Official `Purchases.status` values** — proposed: `Pending → Ready for Pickup → Completed → Cancelled`
3. **Pre-order categories** — industry model: **Hold** (in stock), **Special order** (published, sold out), **Pre-order** (not released yet). Author events = a flag, not a category.
4. **When is a loyalty stamp earned?** — proposed: on completed pickup, awarded by Shelves.
5. **`price_paid` on an unpaid hold** — proposed: 0 until pickup (no online payment in this project).
6. **One definition of "pre-order"** in all customer-facing copy.

Known bug waiting on #2: Reader polls for `status === 'Ready'` but Shelves writes `'Ready for Pickup'`, so the Reader's "🎉 Order Ready!" popup never fires.

---

## Changelog

### Database (Supabase — not tracked in git)

**2026-08-29**
- Created / populated the `"Store Info"` table as the single source of truth. Added columns `store_name`, `address`, `phone`, `email` (customer-facing), `staff_email` (staff-facing, for Shelves).
- Set canonical values: Riverside Books · 428 Riverfront Place, Suite 100, Portland, OR 97201 · (503) 555-0192 · hello@riversidebooks.com · staff@riversidebooks.com
- Hours string: `Monday-Friday: 10:00 AM-6:00 PM; Saturday: 10:00 AM-6:00 PM; Sunday: 11:00 AM-4:00 PM.` (Saturday broken onto its own line so it can be changed independently).
- Updated `reward_rule` to match the Reader: *"Earn one stamp with every book purchase. Fill your 10-stamp card and pick a reward at the counter: a free book, exclusive access, or a keepsake."*
- **Dropped** `birthday_discount_rule` column — the Reader never offered a birthday perk. (`Customers.birthday` left in place — it's data, not a rule, and nothing surfaces it.)
- SQL records kept in `supabase/*.sql` for reference (already applied).

### Reader (`public/apps/reader`)

**2026-08-29**
- "Store Information" card on the About page now renders hours + address + phone + email from the `Store Info` table (with a matching offline fallback). Kept the teammate's "Conveniently located… Pre-order online for quick in-store pickup!" blurb.
- Header tagline "Read & Discover" changed from sans-serif to Lora serif — it was the only app tagline not matching the others. Added the Lora font to all 4 Reader pages.

**2026-08-27**
- `31ab204` and earlier: **DEMO — Prefill** link in the account modal loads one real Supabase customer (Freya Achebe, `CUST-025`); her name/email/phone then auto-fill the reserve-a-book form. The reserve modal has no demo button — it only fills from the active account.
- Account modal profile view gained a **Pre-orders & Pickup** list (deduped a doubled row caused by two DB records for the same book); empty state links to the catalog with a smooth cross-fade (`@view-transition`).
- **"View My Stamps" / navbar star** now opens a real styled modal (was a browser `alert()`), matching the account modal. Shows **Active Status** (day-aware — "Reward ready" at 10/10, else "N more stamps…"), **X / 10 stamps earned**, and a per-purchase stamp list ("Book purchase · date · +1 stamp"). Widens at 10/10 so the status line fits.
- **Navbar star** lights up gold + pulses when the card hits 10/10.
- Single `currentStampCount` source of truth keeps the rewards card, navbar star, stamps modal and account modal in sync; Preview Demo (3→7→10→0) and "Switch Account" reset every surface.
- **Fixed:** the 10/10 "reward unlocked" banner was making the rewards card change width and shove the neighbouring column around. Locked the grid track ratio and let the card grow downward only.

### Ask / chatbot (`public/apps/ask`)

**2026-08-29** *(uncommitted)*
- Loads the `Store Info` row on startup; the "what are your hours", return/exchange, and rewards answers all read from it. Header shows a **live day-aware status** ("Open 'til 6 PM today" / "Closed · opens 11 AM tomorrow") derived from the hours string.
- Removed every `birthday_discount_rule` reference (default, tool description, tool return value, "birthday" keyword trigger, the "Birthday Perk" bullet). Rewards answer now just repeats the DB `reward_rule` verbatim.

**2026-08-27** (`f69f595`)
- Removed developer-facing language from answers: the *"Tool Executed: advanced_book_search({...})"* chips, the *"Gemini unavailable / Error"* fallback prefix, the "Tool: reserve_book_copy Enabled" badge, and the **API Settings** button. System prompt now forbids mentioning tools / JSON / databases in replies.

### Shelves (`apps/shelves`)

**2026-08-29**
- About / contact box reads store name, about text, address (now shown as a proper multi-line address), phone, **staff email**, and store hours from the `Store Info` table. Fixed a hidden inconsistency — Shelves used `staff@` while everyone else used `hello@`; now unified via the separate column. Tightened the spacing (was over-spaced).

**2026-08-27** (`0fb97bb`)
- Pre-order fulfillment queue shows **real customer names + email + phone** instead of raw IDs; fixed the order date (always read "Date unavailable"). Subscribed to `Customers` realtime changes.
- New pre-orders arriving live (e.g. a Reader reservation) get a **"New" badge + a 6-second pulse** — makes the Reader → Shelves handoff visible in a demo.

### Press (`public/apps/press`)

**2026-08-29** *(uncommitted)*
- `store_info.csv` seed file updated to match the live table (removed the birthday column, updated `reward_rule` + hours, added the contact columns).

**2026-08-27** (`d733b34`)
- Book / event picker cards in the composer restyled as **colored book covers** (title + author/date in white over a bottom gradient) to match the Reader's aesthetic — 6-colour rotating palette, hover lift, white outline on the selected card.

### Suite shell (`src/`)

**2026-08-27** (`314d8a3`)
- Nav rail **auto-collapses** the first time you open an app, for a fuller view. Subsequent manual toggles are respected.

---

## Not done / known gaps

- **Reservation flow** — chatbot reservations don't persist (fake `RES-xxxxxx` id, non-standard status words). Needs the team decision above.
- **Loyalty stamps** — no app increments `Customers.stamp_count`; the counts shown are seed data only.
- **Reader "order ready" notification** — never fires (status string mismatch). One-line fix once the status vocabulary is agreed.
- **Store description copy** — 4 slightly different blurbs across apps (Reader "about" prose, DB `about_text`, Shelves h2, Reader hero h1). Not contradictory, just un-unified.
- `.env.local` holds a Supabase access token + secret key (gitignored). Revoke the `claude-cli` token when schema work is finished.
