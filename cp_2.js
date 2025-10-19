const API_URL = 'https://www.course-api.com/javascript-store-products';

/* ----------------- Utilities to normalize API variations ----------------- */
function getName(p) {
  return p?.fields?.name ?? p?.name ?? 'Unnamed Product';
}

function getImageUrl(p) {
  // Try several common shapes from the course API variations
  return (
    p?.fields?.image?.[0]?.url ||
    p?.fields?.image?.[0]?.thumbnails?.large?.url ||
    p?.images?.[0]?.url ||
    p?.image?.url ||
    p?.image ||
    'https://via.placeholder.com/600x400?text=No+Image'
  );
}

function getPrice(p) {
  // Course API often returns price in cents (e.g., 10999). Fall back gracefully.
  let raw =
    p?.fields?.price ??
    p?.price ??
    0;

  // If it looks like cents, convert.
  if (typeof raw === 'number' && raw > 1000) raw = raw / 100;

  // Ensure number
  const n = Number(raw) || 0;
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

/* ----------------- Step 3: fetch() with .then()/.catch() ----------------- */
function fetchProductsThen() {
  fetch(API_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      // Log each product's name
      data.forEach((p) => console.log(getName(p)));
    })
    .catch((err) => {
      console.error('Fetch (then) failed:', err);
    });
}

/* -------- Step 4: async/await with try/catch and displayProducts ---------- */
async function fetchProductsAsync() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const products = await res.json();
    displayProducts(products);
  } catch (error) {
    handleError(error);
  }
}

/* --------------------- Step 5: Render first 5 products -------------------- */
function displayProducts(products) {
  const container = document.getElementById('product-container');
  if (!container) return;

  container.innerHTML = ''; // clear
  products.slice(0, 5).forEach((p) => {
    const card = document.createElement('article');
    card.className = 'product-card';

    const img = document.createElement('img');
    img.src = getImageUrl(p);
    img.alt = getName(p);

    const body = document.createElement('div');
    body.className = 'product-body';

    const title = document.createElement('h3');
    title.className = 'product-title';
    title.textContent = getName(p);

    const meta = document.createElement('div');
    meta.className = 'product-meta';

    const priceEl = document.createElement('span');
    priceEl.textContent = getPrice(p);

    const idEl = document.createElement('span');
    idEl.textContent = (p?.id ?? '').toString().slice(0, 8) || '';

    meta.appendChild(priceEl);
    meta.appendChild(idEl);

    body.appendChild(title);
    body.appendChild(meta);

    card.appendChild(img);
    card.appendChild(body);

    container.appendChild(card);
  });
}

/* ------------------------ Step 6: handleError() --------------------------- */
function handleError(error) {
  console.error(`An error occurred: ${error?.message || error}`);
  const container = document.getElementById('product-container');
  if (container) {
    container.innerHTML = `
      <p style="color:#fca5a5; background:#1b0f12; padding:.75rem; border:1px solid rgba(255,255,255,.1); border-radius:8px;">
        Sorry, we couldn’t load products right now. Please try again later.
      </p>`;
  }
}

/* ---------------------- Step 7: call both functions ----------------------- */
fetchProductsThen();
fetchProductsAsync();