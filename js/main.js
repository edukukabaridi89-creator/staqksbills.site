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

// --- DISPLAY PRODUCTS ---
function displayProducts(list) {
  if (!container) return;

  container.innerHTML = "";

  let categoryA = list.filter(p => p.category === "Category A").slice(0, 1);

  container.innerHTML = `
    <div class="dual-section">

      <!-- LEFT: $20 PRODUCT -->
      <div class="left-products">
        ${categoryA.map(product => `
          <div class="product">
            <img src="${product.image}" onerror="this.src='images/placeholder.jpg'">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <p class="stock">✔ In Stock</p>
            <a href="product.html?id=${product.id}" class="viewbtn">See More Details</a>
          </div>
        `).join("")}
      </div>

      <!-- RIGHT: COMING SOON -->
      <div class="coming-box">
        <h3>🚧 $100 Bills Coming Soon</h3>
        <h4>Big drops loading... stay tuned 👀</h4>

        <div id="countdown">
          <span id="days">0</span>d :
          <span id="hours">0</span>h :
          <span id="minutes">0</span>m :
          <span id="seconds">0</span>s
        </div>

        <button id="earlyAccessBtn" class="early-btn">
          Get Early Access
        </button>
      </div>

    </div>
  `;

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
      "I need early access to the $100 dollar bills, how do I make the payment?"
    );

    window.location.href = `https://t.me/StaqksBills3?text=${message}`;
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
