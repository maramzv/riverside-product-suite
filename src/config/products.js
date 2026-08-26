export const products = {
  reader: {
    key: 'reader',
    group: 'Customer',
    name: 'Riverside Reader',
    tagline: 'READ & DISCOVER',
    icon: '/brand/reader/icon.png',
    headerWordmark: '/brand/reader/header-wordmark.png',
    // Cloned from erickmarcatoma/riverside-readers-app, served same-origin
    // out of public/apps/reader. Its own duplicate suite sidebar was
    // removed and its header logo swapped for our wordmark directly in
    // that copy — see public/apps/reader/*.html.
    url: '/apps/reader/index.html',
    liveUrl: 'https://riverside-readers-app.vercel.app',
  },
  ask: {
    key: 'ask',
    group: 'Customer',
    name: 'Ask Riverside',
    tagline: 'FIND & CONNECT',
    icon: '/brand/ask/icon.png',
    headerWordmark: '/brand/ask/header-wordmark.png',
    // Cloned from IshmamHaque1112/riverside-books-chatbot. Its Gemini
    // serverless function lives at /api/gemini.js in this repo now.
    url: '/apps/ask/index.html',
    liveUrl: 'https://riverside-books-chatbot-khaki.vercel.app',
  },
  shelves: {
    key: 'shelves',
    group: 'Staff',
    name: 'Riverside Shelves',
    tagline: 'INVENTORY & PREORDERS',
    icon: '/brand/shelves/icon.png',
    headerWordmark: '/brand/shelves/header-wordmark.png',
    // Cloned from mosiahjames-ui/riverside-inventory-app, its own Vite
    // build under apps/shelves, output into public/apps/shelves.
    url: '/apps/shelves/index.html',
    liveUrl: 'https://riverside-inventory-app.vercel.app',
  },
  press: {
    key: 'press',
    group: 'Staff',
    name: 'Riverside Press',
    tagline: 'CREATE & SHARE',
    icon: '/brand/press/icon.png',
    headerWordmark: '/brand/press/header-wordmark.png',
    // Cloned from maramzv/riverside-social-app.
    url: '/apps/press/index.html',
    liveUrl: 'https://riverside-social-app.vercel.app',
  },
}

export const productOrder = ['reader', 'ask', 'shelves', 'press']
