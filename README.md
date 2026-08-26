# Riverside Books — Product Suite

Riverside Books is an independent bookstore that sells new books, cards, and
small gifts, and hosts occasional author events. This suite modernizes the
customer experience and staff operations — checking stock, pre-ordering,
earning loyalty rewards, managing inventory, answering customer questions,
and generating social content — all in one place.

**Live:** https://riverside-product-suite.vercel.app

## Products

A sidebar switches between four products, grouped by who uses them:

| Product | For | What it does | Source |
|---|---|---|---|
| Riverside Reader | Customers | Browse the catalog, check live stock, place a pre-order for pickup, and earn a loyalty stamp with every purchase | `public/apps/reader` |
| Ask Riverside | Customers | A support chatbot that answers questions about stock, hours, policies, and events using real store data | `public/apps/ask` |
| Riverside Shelves | Staff | Live inventory view — flags low/out-of-stock titles and lists pending pre-orders to prepare | `apps/shelves` |
| Riverside Press | Staff | Generates a social caption and post idea for a book or event, for staff to review and publish | `public/apps/press` |

All four products read from the same underlying data — the book catalog,
inventory levels, customer/loyalty records, purchases, store info, and
events — so what a customer sees in Reader matches what staff see in
Shelves and what the chatbot answers with.

## Setup

Clone the repo and install dependencies:

```bash
git clone https://github.com/maramzv/riverside-product-suite.git
cd riverside-product-suite
npm install
npm run dev
```

`npm run dev` and `npm run build` also build Shelves as its own sub-project
first (installing its dependencies and building into `public/apps/shelves`),
then start/build the rest of the suite — no separate manual step needed.

Ask Riverside's chatbot needs a Gemini API key to respond. Locally, `vite`'s
dev server can't run the `/api/gemini.js` serverless function — use
`vercel dev` instead, with a `.env.local` (git-ignored, never committed)
containing:

```
GEMINI_API_KEY=your_key_here
```

Get a key at https://aistudio.google.com/apikey. In production, the same
variable is set in Vercel's project environment settings, not in this repo.

## Deploying

Pushing to `main` auto-deploys to Vercel. To deploy manually instead:

```bash
vercel --prod
```
