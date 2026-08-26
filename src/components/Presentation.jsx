import { useEffect, useState } from 'react'
import { products } from '../config/products'

const appSlides = [
  {
    key: 'reader',
    owner: '@erickmarcatoma',
    users: 'Customers',
    painPoint: 'Add this app’s pain point here — what was broken before?',
    solution:
      'Browse the catalog, check live stock, place a pre-order for pickup, and earn a loyalty stamp with every purchase.',
  },
  {
    key: 'ask',
    owner: '@IshmamHaque1112',
    users: 'Customers',
    painPoint: 'Add this app’s pain point here — what was broken before?',
    solution:
      'A support chatbot that answers questions about stock, hours, policies, and events using real store data.',
  },
  {
    key: 'shelves',
    owner: '@mosiahjames-ui',
    users: 'Staff',
    painPoint: 'Add this app’s pain point here — what was broken before?',
    solution:
      'Live inventory view — flags low/out-of-stock titles and lists pending pre-orders to prepare.',
  },
  {
    key: 'press',
    owner: '@maramzv',
    users: 'Staff',
    painPoint: 'Add this app’s pain point here — what was broken before?',
    solution:
      'Generates a social caption and post idea for a book or event, for staff to review and publish.',
  },
]

function Placeholder({ children }) {
  return <span className="rb-slide__placeholder">{children}</span>
}

function TitleSlide() {
  return (
    <div className="rb-slide rb-slide--title">
      <img className="rb-slide__mark" src="/brand/suite/riverside-books-icon.png" alt="" />
      <div className="rb-slide__eyebrow">Product Suite</div>
      <h1>Riverside Books</h1>
      <p className="rb-slide__lede">
        One shared platform, four products — modernizing the customer
        experience and staff operations for an independent bookstore.
      </p>
      <p className="rb-slide__footnote">
        <Placeholder>Add team names / course / date here</Placeholder>
      </p>
    </div>
  )
}

function ClientSlide() {
  return (
    <div className="rb-slide">
      <div className="rb-slide__eyebrow">The Client</div>
      <h2>Riverside Books</h2>
      <p>
        An independent bookstore that sells new books, cards, and small
        gifts, and hosts occasional author events.
      </p>
      <ul className="rb-slide__list">
        <li>Wants customers to browse, check stock, and pre-order online</li>
        <li>Wants staff to manage inventory, questions, and promotion from one place</li>
        <li><Placeholder>Add the client's specific ask / brief here</Placeholder></li>
      </ul>
    </div>
  )
}

function BuildSlide() {
  return (
    <div className="rb-slide">
      <div className="rb-slide__eyebrow">The Build</div>
      <h2>Design &amp; Branding</h2>
      <ul className="rb-slide__list">
        <li>Four independently-built products, one shared shell and nav</li>
        <li>Consistent header height, logo lockups, and color system across every app</li>
        <li>Forest green &amp; slate blue palette — Playfair Display + Lora type</li>
        <li>Each product keeps its own icon, wordmark, and identity within the shared frame</li>
      </ul>
    </div>
  )
}

function BackendSlide() {
  return (
    <div className="rb-slide">
      <div className="rb-slide__eyebrow">The Build</div>
      <h2>Backend</h2>
      <ul className="rb-slide__list">
        <li>Supabase (Postgres) as the shared source of truth — catalog, inventory, loyalty, purchases, events</li>
        <li>Gemini API powers Ask Riverside's chatbot, via a Vercel serverless function</li>
        <li>React + Vite shell; each product ships as its own app or sub-project</li>
        <li>One Vercel deploy — push to main, live in seconds</li>
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
  { id: 'build', render: () => <BuildSlide /> },
  { id: 'backend', render: () => <BackendSlide /> },
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
