import { useEffect, useState } from 'react'
import { products } from '../config/products'

const appSlides = [
  {
    key: 'reader',
    owner: 'Erick',
    users: 'Customers',
    painPoint:
      "Can't check if a book is in stock before making a trip, and no reason to keep coming back over a bigger chain.",
    solution:
      'Search the catalog, see live stock, place a pre-order for pickup, and earn a loyalty stamp with every purchase.',
  },
  {
    key: 'ask',
    owner: 'Ishmam',
    users: 'Customers',
    painPoint:
      'Repetitive questions — hours, return policy, upcoming events, stock — pull staff away from the register.',
    solution:
      "A chatbot that answers using the store's real, current data — hours, policies, events, and live stock counts.",
  },
  {
    key: 'shelves',
    owner: 'Mosiah',
    users: 'Staff',
    painPoint:
      'Inventory tracked by memory or a paper log, so a stockout goes unnoticed until a customer asks for it.',
    solution:
      'One live view of stock by title, flags what needs reordering, and lists pending pre-orders to pull and mark ready.',
  },
  {
    key: 'press',
    owner: 'Mara',
    users: 'Staff',
    painPoint:
      'Social posting is inconsistent — writing captions takes time a two-person part-time staff doesn’t have.',
    solution:
      'Pick a book or event and get a ready-to-review social caption and post idea in under a minute.',
  },
]

function TitleSlide() {
  return (
    <div className="rb-slide rb-slide--title">
      <img className="rb-slide__mark" src="/brand/suite/riverside-books-icon.png" alt="" />
      <div className="rb-slide__eyebrow">Product Suite</div>
      <h1>Riverside Books</h1>
      <div className="rb-slide__rule" aria-hidden="true" />
      <p className="rb-slide__lede">
        One shared platform, four products — modernizing the customer
        experience and staff operations for an independent bookstore.
      </p>
      <div className="rb-slide__footnote">
        <div className="rb-slide__footnote-names">
          <span style={{ color: 'var(--rb-primary)' }}>Erick</span>
          <span className="rb-slide__footnote-sep">&middot;</span>
          <span style={{ color: 'var(--rb-botanical)' }}>Mosiah</span>
          <span className="rb-slide__footnote-sep">&middot;</span>
          <span style={{ color: 'var(--rb-teal)' }}>Ishmam</span>
          <span className="rb-slide__footnote-sep">&middot;</span>
          <span style={{ color: 'var(--rb-accent)' }}>Mara</span>
        </div>
        <div className="rb-slide__footnote-meta">Pursuit AI-Native — July 2026 Cohort, L1 — August 27, 2026</div>
      </div>
    </div>
  )
}

function ClientSlide() {
  return (
    <div className="rb-slide">
      <div className="rb-slide__eyebrow">The Client</div>
      <h2>Riverside Books</h2>
      <p>
        A single-location independent bookstore selling new books, cards,
        and small gifts, and hosting occasional author events. The owner
        runs day-to-day operations with two part-time booksellers —
        inventory, orders, and customer communication were managed through
        memory, sticky notes, and a spreadsheet.
      </p>
      <p className="rb-slide__lede">The goal: modernize the experience without becoming a big e-commerce operation — customers still shop primarily by walking in or calling ahead.</p>
    </div>
  )
}

function PainPointsSlide() {
  return (
    <div className="rb-slide">
      <div className="rb-slide__eyebrow">The Client</div>
      <h2>Pain Points</h2>
      <ul className="rb-slide__list">
        <li>Customers can&rsquo;t check if a book is in stock or pre-order online before making a trip</li>
        <li>No loyalty/rewards system, so regulars have no reason to keep choosing this store</li>
        <li>Staff track inventory by memory or paper log — stockouts go unnoticed until a customer asks</li>
        <li>Common questions (hours, return policy, events) get asked repeatedly and pull staff from the register</li>
        <li>Social media posting is inconsistent — writing captions takes time nobody has</li>
      </ul>
    </div>
  )
}

function ArchitectureBackendSlide() {
  return (
    <div className="rb-slide">
      <div className="rb-slide__eyebrow">The Build</div>
      <h2>Architecture &amp; Backend</h2>
      <ul className="rb-slide__list">
        <li>Four products, one owner each, built independently, then unified behind one React + Vite shell with a shared sidebar and a single Vercel deploy</li>
        <li>All four read from the same Supabase (Postgres) backend, which holds 9 shared tables covering books, merchandise, customers, purchases, inventory, store info, events, and social accounts/posts</li>
        <li>Ask Riverside&rsquo;s chatbot runs on the Gemini API through a Vercel serverless function</li>
        <li>
          Take one book — all four products pull from the exact same record:
          <ul className="rb-slide__list rb-slide__list--nested">
            <li><strong>Riverside Reader</strong> shows customers the book is currently stocked in store and lets them reserve a copy</li>
            <li><strong>Riverside Shelves</strong> counts how many copies are on the shelf and gets reservations ready</li>
            <li><strong>Ask Riverside</strong> answers questions about it (price, stock) and lets customers reserve a copy</li>
            <li><strong>Riverside Press</strong> turns it into a social post</li>
          </ul>
        </li>
      </ul>
    </div>
  )
}

function DesignSlide() {
  return (
    <div className="rb-slide">
      <div className="rb-slide__eyebrow">The Build</div>
      <h2>Design &amp; Branding</h2>
      <ul className="rb-slide__list">
        <li>Forest green &amp; slate blue palette — Playfair Display + Lora type, shared across every app</li>
        <li>Every header shares the same height and logo lockup pattern</li>
        <li>Each product keeps its own icon and wordmark identity within the shared frame</li>
      </ul>
    </div>
  )
}

function AppSlide({ meta }) {
  const product = products[meta.key]
  return (
    <div className="rb-slide rb-slide--app">
      <div className="rb-slide__app-head">
        <img className="rb-slide__app-icon" src={product.icon} alt="" />
        <div>
          <div className="rb-slide__eyebrow">{product.group}</div>
          <h2>{product.name}</h2>
        </div>
      </div>
      <div className="rb-slide__grid">
        <div>
          <div className="rb-slide__label">Built by</div>
          <p>{meta.owner}</p>
        </div>
        <div>
          <div className="rb-slide__label">Users</div>
          <p>{meta.users}</p>
        </div>
        <div>
          <div className="rb-slide__label">Pain point</div>
          <p>{meta.painPoint}</p>
        </div>
        <div>
          <div className="rb-slide__label">Solution</div>
          <p>{meta.solution}</p>
        </div>
      </div>
    </div>
  )
}

function ClosingSlide() {
  return (
    <div className="rb-slide rb-slide--title">
      <div className="rb-slide__eyebrow">Let&rsquo;s see it live</div>
      <h1>Demo time</h1>
      <p className="rb-slide__lede">
        Click into each product from the sidebar to walk through Reader, Ask
        Riverside, Shelves, and Press.
      </p>
    </div>
  )
}

const slides = [
  { id: 'title', render: () => <TitleSlide /> },
  { id: 'client', render: () => <ClientSlide /> },
  { id: 'pain-points', render: () => <PainPointsSlide /> },
  { id: 'architecture-backend', render: () => <ArchitectureBackendSlide /> },
  { id: 'design', render: () => <DesignSlide /> },
  ...appSlides.map((meta) => ({ id: meta.key, render: () => <AppSlide meta={meta} /> })),
  { id: 'closing', render: () => <ClosingSlide /> },
]

export default function Presentation() {
  const [index, setIndex] = useState(0)

  const goTo = (next) => setIndex(Math.min(Math.max(next, 0), slides.length - 1))

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight') goTo(index + 1)
      if (event.key === 'ArrowLeft') goTo(index - 1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  return (
    <div className="rb-deck">
      <div className="rb-deck__stage">{slides[index].render()}</div>

      <div className="rb-deck__nav">
        <button
          type="button"
          className="rb-deck__arrow"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <div className="rb-deck__dots">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              className={`rb-deck__dot${i === index ? ' rb-deck__dot--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
            />
          ))}
        </div>
        <button
          type="button"
          className="rb-deck__arrow"
          onClick={() => goTo(index + 1)}
          disabled={index === slides.length - 1}
          aria-label="Next slide"
        >
          ›
        </button>
      </div>
    </div>
  )
}
