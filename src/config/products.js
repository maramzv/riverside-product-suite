export const products = {
  reader: {
    key: 'reader',
    group: 'Customer',
    name: 'Riverside Reader',
    tagline: 'READ & DISCOVER',
    icon: '/brand/reader/icon.png',
    headerWordmark: '/brand/reader/header-wordmark.png',
    url: 'https://riverside-readers-app.vercel.app',
    // Reader renders its own copy of the full 4-product suite sidebar
    // (a fixed 288px <aside>, Tailwind w-72) baked into every page.
    // We crop it out of the iframe rather than touching Erick's repo.
    sidebarCropPx: 288,
  },
  ask: {
    key: 'ask',
    group: 'Customer',
    name: 'Ask Riverside',
    tagline: 'FIND & CONNECT',
    icon: '/brand/ask/icon.png',
    headerWordmark: '/brand/ask/header-wordmark.png',
    url: 'https://riverside-books-chatbot-khaki.vercel.app',
    // Same story: a 264px suite sidebar, open by default.
    sidebarCropPx: 264,
  },
  shelves: {
    key: 'shelves',
    group: 'Staff',
    name: 'Riverside Shelves',
    tagline: 'INVENTORY & PREORDERS',
    icon: '/brand/shelves/icon.png',
    headerWordmark: '/brand/shelves/header-wordmark.png',
    url: 'https://riverside-inventory-app.vercel.app',
    // Same story: a 248px suite sidebar (`.sidebar` in App.css).
    sidebarCropPx: 248,
  },
  press: {
    key: 'press',
    group: 'Staff',
    name: 'Riverside Press',
    tagline: 'CREATE & SHARE',
    icon: '/brand/press/icon.png',
    headerWordmark: '/brand/press/header-wordmark.png',
    url: 'https://riverside-social-app.vercel.app',
    // Press has no internal suite sidebar — nothing to crop.
    sidebarCropPx: 0,
  },
}

export const productOrder = ['reader', 'ask', 'shelves', 'press']
