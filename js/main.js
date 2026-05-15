const container = document.getElementById("productContainer");
const searchBar = document.getElementById("searchBar");

// --- PERSISTENT COUNTDOWN ---
function getOrCreateCountdown() {
  let saved = localStorage.getItem("countdownTarget");

  if (!saved) {
    const newTarget = Date.now() + (7 * 24 * 60 * 60 * 1000);
    localStorage.setItem("countdownTarget", newTarget);
    return newTarget;
  }

  return parseInt(saved);
}

const targetDate = getOrCreateCountdown();

// --- DISPLAY PRODUCTS (ADVANCED GRID VERSION) ---
function displayProducts(list) {
  if (!container) return;

  // Clear the container first
  container.innerHTML = "";

  // 1. Create the Product Grid 
  // We map through the entire list provided (supports searching/filtering)
  const productCards = list.map(product => `
    <div class="product">
      <div class="product-badge">Top Seller</div>
      <div class="product-img-wrapper">
        <img src="${product.image}" onerror="this.src='images/placeholder.jpg'" alt="${product.name}">
      </div>
      <div class="product-content">
        <h3>${product.name}</h3>
        <p class="price">$${product.price.toFixed(2)}</p>
        <p class="stock-status">🟢 In Stock - Ships via USPS</p>
        
        <div class="product-btns">
          <button onclick="directBuy(${product.id})" class="buybtn">BUY NOW</button>
          <a href="product.html?id=${product.id}" class="viewbtn-link">View Details</a>
        </div>
      </div>
    </div>
  `).join("");

  // 2. Add the "Coming Soon" Box as a specialized card at the end of the list
  const comingSoonCard = `
    <div class="product coming-soon-card">
      <div class="coming-soon-content">
        <h3>🚧 $50 Bills Coming Soon</h3>
        <p>Large drops arriving soon. Stay locked in for early access.</p>
        
        <div id="countdown" class="countdown-timer">
          <div><span id="days">0</span><small>Days</small></div>
          <div><span id="hours">0</span><small>Hrs</small></div>
          <div><span id="minutes">0</span><small>Min</small></div>
          <div><span id="seconds">0</span><small>Sec</small></div>
        </div>

        <button id="earlyAccessBtn" class="early-btn">Request Early Access</button>
      </div>
    </div>
  `;

  // 3. Render everything into the container
  container.innerHTML = productCards + comingSoonCard;

  // 4. Restart your timers and listeners
  startCountdown();
  setupTelegramBtn();
}

// --- COUNTDOWN FUNCTION ---
function startCountdown() {
  function updateCountdown() {
    const now = Date.now();
    const distance = targetDate - now;

    const countdownEl = document.getElementById("countdown");
    if (!countdownEl) return;

    if (distance <= 0) {
      countdownEl.innerHTML = "🔥 LIVE NOW!";
      return;
    }

    document.getElementById("days").textContent =
      Math.floor(distance / (1000 * 60 * 60 * 24));

    document.getElementById("hours").textContent =
      Math.floor((distance / (1000 * 60 * 60)) % 24);

    document.getElementById("minutes").textContent =
      Math.floor((distance / (1000 * 60)) % 60);

    document.getElementById("seconds").textContent =
      Math.floor((distance / 1000) % 60);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// --- TELEGRAM BUTTON ---
function setupTelegramBtn() {
  const btn = document.getElementById("earlyAccessBtn");
  if (!btn) return;

  btn.onclick = () => {
    const message = encodeURIComponent(
      "I need early access to the $50 dollar bills, how do I make the payment?"
    );

    window.location.href = `https://t.me/upoffbtcc?text=${message}`;
  };
}

// --- LIVE VIEWERS ---
function startViewerCounter() {
  const viewerBox = document.createElement("div");
  viewerBox.className = "viewer-box";
  document.body.appendChild(viewerBox);

  function updateViewers() {
    const viewers = Math.floor(Math.random() * 20) + 5;
    viewerBox.innerHTML = `👀 ${viewers} people viewing this right now`;
  }

  updateViewers();
  setInterval(updateViewers, 4000);
}

// --- RANDOM NAME GENERATOR (UPGRADED 😏) ---
function getRandomName() {
  const first = ["Jay", "Chris", "Alex", "Sam", "Jordan", "Tyler", "Marcus", "Brian", "Kevin", "Leo"];
  const last = ["M.", "K.", "D.", "X.", "Z.", "T.", "L.", "P."];

  return first[Math.floor(Math.random() * first.length)] + " " +
         last[Math.floor(Math.random() * last.length)];
}

// --- FAKE SALES ---
function startFakeSales() {
  const locations = ["New York", "Miami", "Texas", "California", "London", "Toronto", "Dubai"];
  const items = ["$20 Bills Pack"];

  function showPopup() {
    const popup = document.createElement("div");
    popup.className = "sale-popup";

    const name = getRandomName();
    const location = locations[Math.floor(Math.random() * locations.length)];
    const item = items[Math.floor(Math.random() * items.length)];

    popup.innerHTML = `
      <strong>${name}</strong> from ${location}<br>
      just purchased <b>${item}</b>
    `;

    document.body.appendChild(popup);

    setTimeout(() => popup.remove(), 5000);
  }

  setInterval(showPopup, 8000);
}

// --- INIT ---
startViewerCounter();
startFakeSales();

if (typeof products !== "undefined") {
  displayProducts(products);
}

// --- SEARCH ---
if (searchBar) {
  searchBar.addEventListener("input", () => {
    let term = searchBar.value.toLowerCase();

    let filtered = products.filter(p =>
      p.name.toLowerCase().includes(term)
    );

    displayProducts(filtered);
  });
}
