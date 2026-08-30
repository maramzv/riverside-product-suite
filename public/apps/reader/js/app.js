// js/app.js - Main Application Controller

import { InventoryAPI } from './api.js';
import { initSearch } from './search.js'; 

let currentBooksCache = [];
// Most recent shopper email we've seen (from a profile lookup or a reservation),
// used to show their pending pre-orders in the Riverside Stamps summary modal.
let lastKnownEmail = null;
// Single source of truth for the stamp count shared by every surface:
// the rewards card, the navbar star, the stamps modal and the account modal.
let currentStampCount = 0;
// The customer whose account is currently active in the demo. Holds a full
// record (name/email/phone) when a demo profile is selected; null when only a
// raw email was typed or nobody is signed in.
let activeCustomer = null;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof initSearch === 'function') {
    initSearch((category, query) => {
      loadFeaturedBooks(category, query);
    });
  }

  initReservationForm();
  loadFeaturedBooks();
  loadStaffPicks(); 
  
  renderLoyaltyGrid(0); 
  initLoyaltyCheck();   
  initRewardsDemo(); 
  initFilterTags();
  initShopFilters(); 
  initSortHandler();
  initMobileMenu();
  initNavbarActions();
  initDemoPrefill();
  initStoreHours();
});

/* ----------------------------------------------------
   Store hours + location — rendered from the central "Store Info" table
---------------------------------------------------- */
const STORE_INFO_FALLBACK = {
  hours: 'Monday-Saturday: 10:00 AM-6:00 PM; Sunday: 11:00 AM-4:00 PM.',
  address: '428 Riverfront Place, Suite 100, Portland, OR 97201',
  phone: '(503) 555-0192',
  email: 'hello@riversidebooks.com',
};

async function initStoreHours() {
  const list = document.getElementById('store-hours-list');
  const contact = document.getElementById('store-contact');
  if (!list && !contact) return;

  let info = STORE_INFO_FALLBACK;
  try {
    const fetched = await InventoryAPI.getStoreInfo();
    if (fetched) info = { ...STORE_INFO_FALLBACK, ...fetched };
  } catch (err) {
    console.warn('Could not load store info, using fallback:', err);
  }

  if (list) {
    const parts = (info.hours || '').replace(/\.\s*$/, '').split(';').map((s) => s.trim()).filter(Boolean);
    list.innerHTML = parts.map((part) => {
      const i = part.indexOf(':');
      return i === -1
        ? `<li>${part}</li>`
        : `<li><strong>${part.slice(0, i)}:</strong> ${part.slice(i + 1).trim()}</li>`;
    }).join('');
  }

  if (contact) {
    const phoneDigits = (info.phone || '').replace(/[^\d+]/g, '');
    contact.innerHTML = [
      info.address ? `<span>${info.address}</span>` : '',
      info.phone ? `<a href="tel:${phoneDigits}" style="color: inherit;">${info.phone}</a>` : '',
      info.email ? `<a href="mailto:${info.email}" style="color: inherit;">${info.email}</a>` : '',
    ].filter(Boolean).join('<br>');
  }
}

/* ----------------------------------------------------
   DEMO — Prefill: load a real Supabase customer into the account modal
---------------------------------------------------- */
function initDemoPrefill() {
  document.querySelectorAll('.demo-prefill').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const label = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = 'Loading demo profile…';

      try {
        const customer = await InventoryAPI.getDemoCustomer();
        if (!customer) throw new Error('No demo customer available');
        if (customer.email) lastKnownEmail = customer.email;
        activeCustomer = customer;

        const email = document.getElementById('account-email-input');
        if (email) email.value = customer.email || '';
      } catch (err) {
        console.warn('DEMO prefill failed:', err);
        alert('Could not load a demo profile right now. Try again in a moment.');
      } finally {
        btn.disabled = false;
        btn.innerHTML = label;
      }
    });
  });
}

/* ----------------------------------------------------
   STEP 1 & 2: Search, Filter & Load Inventory (Home & Shop)
---------------------------------------------------- */
async function loadFeaturedBooks(category = 'all', searchQuery = '') {
  const isHomePageContainer = !!document.getElementById('books-container');
  const container = document.getElementById('books-container') || document.getElementById('full-inventory-container');
  if (!container) return;

  container.innerHTML = `<div class="book-card-loading">Searching Supabase catalog...</div>`;

  try {
    let books = await InventoryAPI.getBooks(category, searchQuery);
    currentBooksCache = books || [];

    // Limit featured titles to 6 strictly on the home page container
    if (isHomePageContainer && (!searchQuery || searchQuery === '') && category === 'all') {
      books = currentBooksCache.slice(0, 6);
    } else {
      books = currentBooksCache;
    }

    renderBookList(books, container);

  } catch (err) {
    container.innerHTML = `
      <div style="padding: 1rem; color: #c62828; background: #ffebee; border-radius: 8px;">
        <strong>Database Search Error:</strong>
        <p style="font-size: 0.85rem; margin-top: 0.25rem;">${err.message || err}</p>
      </div>
    `;
  }
}

/* ----------------------------------------------------
   STEP 10: Local Picks & Staff Favorites Loader
---------------------------------------------------- */
async function loadStaffPicks() {
  const container = document.getElementById('local-picks-container');
  if (!container) return;
  
  container.innerHTML = `<div class="book-card-loading">Loading staff recommendations from Supabase...</div>`;

  try {
    const books = await InventoryAPI.getBooks('staff-pick', ''); 

    if (!books || books.length === 0) {
      container.innerHTML = `<p class="subtitle" style="padding: 1rem;">No staff picks currently available. Check back soon!</p>`;
      return;
    }

    const coverColors = ['#24422e', '#a84832', '#1e3a5f', '#8c5e3c', '#5c3d52', '#2b4c5f'];

    container.innerHTML = books.map((book, index) => {
      let stockText = `${book.stock_quantity} in stock`;
      let dotColor = '#2F855A'; // Soft green for normal stock

      if (book.stock_quantity === 0) {
        stockText = 'Out of stock';
        dotColor = '#A0AEC0'; // Muted grey for out of stock
      } else if (book.stock_quantity <= 2) {
        stockText = `Only ${book.stock_quantity} left`;
        dotColor = '#DD6B20'; // Orange for low stock
      }

      const displayTitle = book.title || book.tittle || 'Unknown Title';
      const safeTitle = displayTitle.replace(/'/g, "\\'");
      const bgColor = coverColors[index % coverColors.length];
      const staffBlurb = book.blurb ? `<p style="font-size: 0.85rem; color: #666; font-style: italic; margin: 0.5rem 0;">"${book.blurb}"</p>` : '';

      return `
        <article class="book-card" data-isbn="${book.isbn}">
          <div class="book-cover-mockup" style="background-color: ${bgColor}; height: 140px; display: flex; align-items: center; justify-content: center;">
            <div style="text-align: center; color: white;">
              <i class="fa-solid fa-book-open" style="font-size: 1.75rem; opacity: 0.8; margin-bottom: 0.4rem; display: block;"></i>
              <span class="mockup-genre" style="font-size: 0.75rem; letter-spacing: 2px;">${book.genre || 'Staff Pick'}</span>
            </div>
          </div>
          <div class="book-info">
            <h4>${displayTitle}</h4>
            <p class="book-author" style="margin-bottom: 0.4rem;">by ${book.author}</p>
            <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: #4a5568; margin: 0 0 0.5rem 0;">
              <span style="width: 8px; height: 8px; background-color: ${dotColor}; border-radius: 50%; display: inline-block;"></span>
              <span>${stockText}</span>
            </div>
            ${staffBlurb}
            
            <!-- Price and Button Wrapper aligned uniformly at the bottom -->
            <div style="margin-top: auto; padding-top: 0.75rem;">
              <p class="book-price" style="margin-bottom: 0.5rem; font-weight: bold;">$${Number(book.regular_price || 0).toFixed(2)}</p>
              <button class="btn-dark btn-small" style="width: 100%;"
                ${book.stock_quantity === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}
                onclick="openReserveModal('${safeTitle}', '${book.isbn}')">
                ${book.stock_quantity === 0 ? 'Unavailable' : 'Reserve for Pickup'}
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

  } catch (err) {
    container.innerHTML = `
      <div style="padding: 1rem; color: #c62828; background: #ffebee; border-radius: 8px;">
        <strong>Error loading staff picks:</strong>
        <p style="font-size: 0.85rem; margin-top: 0.25rem;">${err.message || err}</p>
      </div>
    `;
  }
}

// Helper function to render book cards with unique colored covers
function renderBookList(books, container) {
  if (!books || books.length === 0) {
    container.innerHTML = `<p class="subtitle" style="padding: 1rem;">No books found matching your criteria.</p>`;
    return;
  }

  const coverColors = ['#24422e', '#a84832', '#1e3a5f', '#8c5e3c', '#5c3d52', '#2b4c5f'];

  container.innerHTML = books.map((book, index) => {
    let stockText = `${book.stock_quantity} in stock`;
    let dotColor = '#2F855A'; // Soft green for normal stock

    if (book.stock_quantity === 0) {
      stockText = 'Out of stock';
      dotColor = '#A0AEC0'; // Muted grey for out of stock
    } else if (book.stock_quantity <= 2) {
      stockText = `Only ${book.stock_quantity} left`;
      dotColor = '#DD6B20'; // Orange for low stock
    }

    const displayTitle = book.title || book.tittle || 'Unknown Title';
    const safeTitle = displayTitle.replace(/'/g, "\\'");
    const bgColor = coverColors[index % coverColors.length];

    return `
      <article class="book-card" data-isbn="${book.isbn}">
        <div class="book-cover-mockup" style="background-color: ${bgColor}; height: 140px; display: flex; align-items: center; justify-content: center;">
          <div style="text-align: center; color: white;">
            <i class="fa-solid fa-book-open" style="font-size: 1.75rem; opacity: 0.8; margin-bottom: 0.4rem; display: block;"></i>
            <span class="mockup-genre" style="font-size: 0.75rem; letter-spacing: 2px;">${book.genre || 'Literature'}</span>
          </div>
        </div>
        <div class="book-info">
          <h4>${displayTitle}</h4>
          <p class="book-author" style="margin-bottom: 0.4rem;">by ${book.author}</p>
          <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: #4a5568; margin: 0 0 0.5rem 0;">
            <span style="width: 8px; height: 8px; background-color: ${dotColor}; border-radius: 50%; display: inline-block;"></span>
            <span>${stockText}</span>
          </div>

          <!-- Price and Button Wrapper aligned uniformly at the bottom -->
          <div style="margin-top: auto; padding-top: 0.75rem;">
            <p class="book-price" style="margin-bottom: 0.5rem; font-weight: bold;">$${Number(book.regular_price || 0).toFixed(2)}</p>
            <button class="btn-dark btn-small" style="width: 100%;"
              ${book.stock_quantity === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}
              onclick="openReserveModal('${safeTitle}', '${book.isbn}')">
              ${book.stock_quantity === 0 ? 'Unavailable' : 'Reserve for Pickup'}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

/* ----------------------------------------------------
   STEP 3: Reserve Modal Handler
---------------------------------------------------- */
window.openReserveModal = function(title, isbn) {
  const modal = document.getElementById('reserve-modal');
  const titleEl = document.getElementById('modal-book-title');
  const isbnEl = document.getElementById('modal-isbn');

  if (titleEl) titleEl.innerText = title;
  if (isbnEl) isbnEl.value = isbn;

  // Prefill the contact fields from whichever account is active in the demo.
  const nameEl = document.getElementById('customer-name');
  const emailEl = document.getElementById('customer-email');
  const phoneEl = document.getElementById('customer-phone');

  if (lastKnownEmail && emailEl) emailEl.value = lastKnownEmail;
  if (activeCustomer) {
    const fullName = [activeCustomer.first_name, activeCustomer.last_name].filter(Boolean).join(' ');
    if (nameEl) nameEl.value = fullName;
    if (phoneEl) phoneEl.value = activeCustomer.phone || '';
  }

  if (modal) modal.classList.remove('hidden');
};

function initReservationForm() {
  const modal = document.getElementById('reserve-modal');
  const reserveForm = document.getElementById('reserve-form');
  const closeBtn = document.getElementById('close-modal-btn');
  const cancelBtn = document.getElementById('cancel-modal-btn');

  const closeModal = () => modal?.classList.add('hidden');
  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);

  reserveForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isbn = document.getElementById('modal-isbn').value;
    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const quantity = parseInt(document.getElementById('reservation-quantity')?.value) || 1;

    if (customerEmail) lastKnownEmail = customerEmail.trim();

    try {
      const book = await InventoryAPI.getBookByIsbn(isbn);

      const response = await InventoryAPI.createReservation({
        bookId: book.book_id,
        customerName,
        customerEmail,
        customerPhone,
        quantity: quantity,
        regularPrice: book.regular_price
      });

      alert('Hold request submitted! We are notifying staff at Riverside Books.');
      closeModal();
      reserveForm.reset();

      if (response && response.purchase_id) {
        startPickupAlertPolling(response.purchase_id);
      }
    } catch (err) {
      alert(`Unable to submit reservation: ${err.message || 'Check database permissions.'}`);
    }
  });
}

/* ----------------------------------------------------
   STEP 4: Pickup Alert Status Polling
---------------------------------------------------- */
function startPickupAlertPolling(purchaseId) {
  const pollInterval = setInterval(async () => {
    try {
      const data = await InventoryAPI.getReservationStatus(purchaseId);

      if (data && data.status === 'Ready') {
        clearInterval(pollInterval);
        alert(`🎉 Order Ready! Your book is set aside at the counter. Show your QR code to collect!`);
      }
    } catch (err) {
      console.warn('Polling reservation status...', err);
    }
  }, 5000);
}

/* ----------------------------------------------------
   STEP 5: Reader Loyalty Stamp Rendering (With 10/10 Celebration)
---------------------------------------------------- */
// Renders 10 stamp slots into any grid element, filling up to earnedCount.
function fillStampSlots(gridEl, earnedCount = 0) {
  if (!gridEl) return;
  gridEl.innerHTML = '';
  for (let i = 1; i <= 10; i++) {
    const slot = document.createElement('div');
    slot.className = `stamp-slot ${i <= earnedCount ? 'earned' : ''}`;
    slot.innerHTML = i <= earnedCount ? '✓' : i;
    gridEl.appendChild(slot);
  }
}

// Central stamp-count setter — updates every surface so all modules stay in sync.
function renderLoyaltyGrid(earnedCount = 0) {
  currentStampCount = earnedCount;
  const unlocked = earnedCount >= 10;

  // Home page rewards card (only present on index.html)
  const grid = document.getElementById('stamp-grid');
  if (grid) {
    const container = grid.closest('.rewards-section');
    let banner = container?.querySelector('.reward-banner');

    if (unlocked) {
      grid.classList.add('reward-unlocked');
      if (!banner && container) {
        banner = document.createElement('div');
        banner.className = 'reward-banner';
        banner.innerHTML = `
          🎉 <strong>REWARD UNLOCKED!</strong> Choose your 10/10 perk to redeem at the counter:
          <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; justify-content: center; flex-wrap: wrap;">
            <button class="btn-dark btn-small" onclick="alert('Selected: Free Book! Show this screen at the register.')">Free Book</button>
            <button class="btn-dark btn-small" onclick="alert('Selected: Exclusive Access! Show this screen at the register.')">Exclusive Access</button>
            <button class="btn-dark btn-small" onclick="alert('Selected: Reading Accessories &amp; Keepsakes! Show this screen at the register.')">Keepsakes</button>
          </div>
        `;
        container.insertBefore(banner, grid);
      }
    } else {
      grid.classList.remove('reward-unlocked');
      if (banner) banner.remove();
    }

    fillStampSlots(grid, earnedCount);

    const progressText = document.getElementById('loyalty-progress-text');
    if (progressText) progressText.innerText = unlocked ? '✨ 10 / 10 Completed!' : `${earnedCount} / 10 Stamps collected`;
  }

  // Navbar star
  const navBadgeText = document.getElementById('nav-stamp-count');
  if (navBadgeText) navBadgeText.innerText = earnedCount;
  document.getElementById('cart-link')?.classList.toggle('stamps-complete', unlocked);

  // Account modal loyalty line
  const profileSummary = document.getElementById('profile-stamp-summary');
  if (profileSummary) {
    profileSummary.innerText = unlocked
      ? '✨ 10 / 10 Stamps — reward unlocked!'
      : `${earnedCount} / 10 Stamps collected towards your reward`;
  }

  // Stamps & Rewards modal
  syncStampsModal(earnedCount);
}

// Updates the Riverside Stamps & Rewards modal to a given count.
function syncStampsModal(count) {
  const progressEl = document.getElementById('stamps-modal-progress');
  if (progressEl) progressEl.innerText = `${count} / 10 stamps earned`;

  const statusEl = document.getElementById('stamps-modal-status');
  if (statusEl) {
    if (count >= 10) {
      statusEl.innerText = 'Reward ready — show this screen at the counter for verification.';
    } else {
      const left = 10 - count;
      statusEl.innerText = `${left} more stamp${left === 1 ? '' : 's'} until your next reward.`;
    }
  }

  // Widen the modal at 10/10 so the longer status line stays on one line.
  document.getElementById('stamps-modal')?.classList.toggle('stamps-modal--unlocked', count >= 10);

  renderStampHistory();
}

/* ----------------------------------------------------
   STEP 6: Dynamic Loyalty Lookup
---------------------------------------------------- */
function initLoyaltyCheck() {
  const viewRewardsBtn = document.querySelector('.rewards-footer .btn-dark:not(#rewards-demo-btn)');
  if (viewRewardsBtn) {
    viewRewardsBtn.addEventListener('click', openStampsModal);
  }
}

// Opens the Riverside Stamps & Rewards modal, synced to the current stamp count.
function openStampsModal() {
  const stampsModal = document.getElementById('stamps-modal');
  if (!stampsModal) return;

  syncStampsModal(currentStampCount);

  stampsModal.classList.remove('hidden');
}

// Cached real purchase history so demo clicks don't re-hit Supabase.
let stampHistoryCache = null; // { email, rows }

function stampHistoryRow(dateValue, stamps) {
  const d = dateValue ? new Date(dateValue) : null;
  const dateLabel = d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString() : 'Date unavailable';
  const n = Number(stamps) || 1;
  return `
    <div class="stamp-history">
      <span class="stamp-history__label">Book purchase &middot; ${dateLabel}</span>
      <span class="stamp-history__badge">✦ ${n} stamp${n === 1 ? '' : 's'}</span>
    </div>`;
}

// One placeholder row per current stamp, dated backwards from today.
function renderPlaceholderStampHistory(box) {
  if (currentStampCount <= 0) {
    box.innerHTML = '<p class="stamp-summary-text">No stamps yet — every book you buy earns one.</p>';
    return;
  }
  const today = new Date();
  box.innerHTML = Array.from({ length: currentStampCount }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i * 4);
    return stampHistoryRow(d, 1);
  }).join('');
}

async function renderStampHistory() {
  const box = document.getElementById('stamps-modal-history');
  if (!box) return;

  // Real history for this shopper, if we've already fetched it.
  if (lastKnownEmail && stampHistoryCache?.email === lastKnownEmail) {
    if (stampHistoryCache.rows.length) {
      box.innerHTML = stampHistoryCache.rows.map((e) => stampHistoryRow(e.purchased_on, e.stamps)).join('');
    } else {
      renderPlaceholderStampHistory(box);
    }
    return;
  }

  if (!lastKnownEmail) {
    renderPlaceholderStampHistory(box);
    return;
  }

  box.innerHTML = '<p class="stamp-summary-text">Loading your stamp history…</p>';
  try {
    const history = await InventoryAPI.getStampHistoryByEmail(lastKnownEmail);
    stampHistoryCache = { email: lastKnownEmail, rows: history };
    if (history.length) {
      box.innerHTML = history.map((e) => stampHistoryRow(e.purchased_on, e.stamps)).join('');
    } else {
      renderPlaceholderStampHistory(box);
    }
  } catch (err) {
    console.warn('Could not load stamp history:', err);
    renderPlaceholderStampHistory(box);
  }
}

/* ----------------------------------------------------
   NEW: Rewards Interactive Preview Demo
---------------------------------------------------- */
function initRewardsDemo() {
  const demoBtn = document.getElementById('rewards-demo-btn');
  if (!demoBtn) return;

  let demoStep = 0;
  const demoMilestones = [3, 7, 10, 0]; 

  demoBtn.addEventListener('click', () => {
    const currentStamps = demoMilestones[demoStep];
    renderLoyaltyGrid(currentStamps);
    
    if (currentStamps === 10) {
      demoBtn.innerText = "Reset Demo";
    } else if (currentStamps === 0) {
      demoBtn.innerText = "Preview Demo";
    } else {
      demoBtn.innerText = `Demo: ${currentStamps}/10 Stamps`;
    }

    demoStep = (demoStep + 1) % demoMilestones.length;
  });
}

/* ----------------------------------------------------
   STEP 7: Interactive Filter Tags (Home Page)
---------------------------------------------------- */
function initFilterTags() {
  const tags = document.querySelectorAll('.tag');
  
  tags.forEach(tag => {
    tag.style.cursor = 'pointer';
    tag.addEventListener('click', () => {
      const text = tag.innerText.toLowerCase();
      let category = 'all';

      if (text.includes('new arrivals')) {
        category = 'all';
      } else if (text.includes('best sellers')) {
        category = 'bestseller';
      } else if (text.includes('local authors')) {
        category = 'staff-pick';
      } else if (text.includes('gift ideas')) {
        category = 'all'; 
      }

      loadFeaturedBooks(category, '');
    });
  });
}

/* ----------------------------------------------------
   STEP 8: Shop Page Interactive Filter Buttons
---------------------------------------------------- */
function initShopFilters() {
  const filterContainer = document.getElementById('shop-filter-buttons');
  if (!filterContainer) return; 

  const buttons = filterContainer.querySelectorAll('.filter-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.style.background = 'white';
        b.style.color = 'inherit';
        b.style.borderColor = '#ccc';
      });

      btn.style.background = 'var(--primary-green)';
      btn.style.color = 'white';
      btn.style.borderColor = 'var(--primary-green)';

      const category = btn.getAttribute('data-filter');
      loadFeaturedBooks(category, '');
    });
  });
}

/* ----------------------------------------------------
   STEP 9: Shop Page Sort Dropdown Handler
---------------------------------------------------- */
function initSortHandler() {
  const sortSelect = document.getElementById('sort-select');
  if (!sortSelect) return;

  sortSelect.addEventListener('change', (e) => {
    const sortBy = e.target.value;
    const container = document.getElementById('books-container') || document.getElementById('full-inventory-container');
    if (!container) return;

    let sortedBooks = [...currentBooksCache];

    if (sortBy === 'price-asc') {
      sortedBooks.sort((a, b) => Number(a.regular_price || 0) - Number(b.regular_price || 0));
    } else if (sortBy === 'price-desc') {
      sortedBooks.sort((a, b) => Number(b.regular_price || 0) - Number(a.regular_price || 0));
    } else if (sortBy === 'alpha') {
      sortedBooks.sort((a, b) => {
        const titleA = (a.title || a.tittle || '').toLowerCase();
        const titleB = (b.title || b.tittle || '').toLowerCase();
        return titleA.localeCompare(titleB);
      });
    }

    renderBookList(sortedBooks, container);
  });
}

/* ----------------------------------------------------
   STEP 11: Mobile Navigation Menu Toggle (Mobile Viewports Only)
---------------------------------------------------- */
function initMobileMenu() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let hamburger = navbar.querySelector('.mobile-menu-toggle');
  const navLinks = navbar.querySelector('.nav-links');

  if (!hamburger && navLinks && window.innerWidth <= 768) {
    hamburger = document.createElement('button');
    hamburger.className = 'mobile-menu-toggle';
    hamburger.innerHTML = '☰ Menu';

    navbar.insertBefore(hamburger, navLinks);
  }

  if (hamburger && navLinks) {
    // Force the menu to always start closed upon script initialization
    navLinks.classList.remove('mobile-open');

    // Toggle open/closed strictly on explicit hamburger button clicks
    hamburger.onclick = (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('mobile-open');
    };

    // Ensure clicking any navigation link hides the menu
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.remove('mobile-open');
      });
    });

    // Close the menu if a user clicks anywhere else outside the navbar
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('mobile-open');
      }
    });
  }
}

/* ----------------------------------------------------
   STEP 12: Interactive Account Modal & Cart Handlers
---------------------------------------------------- */
function initNavbarActions() {
  const accountBtn = document.getElementById('account-link');
  const cartBtn = document.getElementById('cart-link');
  
  const accountModal = document.getElementById('account-modal');
  const closeAccountModalBtn = document.getElementById('close-account-modal');
  const accountForm = document.getElementById('account-form');
  const accountLoginView = document.getElementById('account-login-view');
  const accountProfileView = document.getElementById('account-profile-view');
  const profileDisplayEmail = document.getElementById('profile-display-email');
  const logoutBtn = document.getElementById('logout-account-btn');

  const closeAccountModal = () => accountModal?.classList.add('hidden');
  closeAccountModalBtn?.addEventListener('click', closeAccountModal);

  accountBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    accountModal?.classList.remove('hidden');
  });

  accountForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('account-email-input').value.trim();
    if (!emailInput) return;

    try {
      const submitBtn = accountForm.querySelector('button[type="submit"]');
      submitBtn.innerText = "Loading...";

      const customer = await InventoryAPI.getCustomerByEmail(emailInput);
      lastKnownEmail = emailInput;
      // Keep the full record if this email is a known customer (so the reserve
      // form can prefill name/phone); null for a fresh, unrecognised email.
      activeCustomer = customer;

      profileDisplayEmail.innerText = emailInput;
      // renderLoyaltyGrid drives the loyalty line + every other stamp surface.
      renderLoyaltyGrid(customer?.stamp_count ?? 0);

      accountLoginView.classList.add('hidden');
      accountProfileView.classList.remove('hidden');
      submitBtn.innerText = "View Profile";

      renderAccountPreorders();
    } catch (err) {
      alert("Could not find an account associated with this email.");
      accountForm.querySelector('button[type="submit"]').innerText = "View Profile";
    }
  });

  logoutBtn?.addEventListener('click', () => {
    accountProfileView.classList.add('hidden');
    accountLoginView.classList.remove('hidden');
    document.getElementById('account-email-input').value = '';
    lastKnownEmail = null;
    activeCustomer = null;
    stampHistoryCache = null;
    renderLoyaltyGrid(0);
  });

  const stampsModal = document.getElementById('stamps-modal');
  const closeStampsModal = () => stampsModal?.classList.add('hidden');
  document.getElementById('close-stamps-modal')?.addEventListener('click', closeStampsModal);
  document.getElementById('stamps-modal-close-btn')?.addEventListener('click', closeStampsModal);

  cartBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openStampsModal();
  });
}

async function renderAccountPreorders() {
  const box = document.getElementById('account-preorders');
  if (!box) return;

  const emptyState = `
    <p class="stamp-summary-text">You have no pre-orders yet — reserve a book and we'll set it aside for pickup.</p>
    <a class="btn-dark btn-small account-preorders__cta" href="shop.html"
       onclick="document.getElementById('account-modal').classList.add('hidden')">Browse book catalog</a>`;

  if (!lastKnownEmail) {
    box.innerHTML = emptyState;
    return;
  }

  box.innerHTML = '<p class="stamp-summary-text">Checking your pre-orders…</p>';

  try {
    const orders = await InventoryAPI.getPendingPreordersByEmail(lastKnownEmail);
    if (!orders.length) {
      box.innerHTML = emptyState;
      return;
    }

    box.innerHTML = orders.map((order) => {
      const ready = order.status === 'Ready for Pickup';
      const copies = order.quantity === 1 ? 'copy' : 'copies';
      return `
        <div class="modal-preorder">
          <div class="modal-preorder__info">
            <strong>${order.book_title}</strong>
            <small>${order.quantity} ${copies}</small>
          </div>
          <span class="modal-preorder__status${ready ? ' modal-preorder__status--ready' : ''}">${order.status}</span>
        </div>`;
    }).join('');
  } catch (err) {
    console.warn('Could not load pickup status:', err);
    box.innerHTML = '<p class="stamp-summary-text">Could not load pre-orders right now.</p>';
  }
}