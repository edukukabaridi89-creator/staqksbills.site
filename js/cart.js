// --- CART MANAGEMENT ---
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Add product to cart
function addToCart(productId, qty = 1) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) cartItem.qty += qty;
  else cart.push({ ...product, qty });

  saveCart();
  updateCartUI();
}

// Remove product (UPDATED with confirm)
function removeFromCart(productId) {

  const confirmDelete = confirm("Remove this item from cart?");
  if (!confirmDelete) return;

  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

// Change quantity
function changeQty(productId, qty) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty = Number(qty);

  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  updateCartUI();
}

// Update cart count in navbar
function updateCartCount() {
  const cartCount = document.querySelector(".cart-count");
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = totalItems;
  }
}

// Display cart
function updateCartUI() {
  const container = document.getElementById("cartContainer");
  const totalEl = document.getElementById("cartTotal");

  if (!container || !totalEl) return;

  container.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    totalEl.textContent = "$0.00";
    return;
  }

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" onerror="this.src='images/placeholder.jpg'" width="100">

        <div class="cart-info">
          <h4>${item.name}</h4>
          <p class="urgency">⚠ Almost Sold Out</p>

          <p>Price: $${item.price}</p>

          <p>
            Qty: 
            <input 
              type="number" 
              min="1" 
              value="${item.qty}" 
              onchange="changeQty(${item.id}, this.value)">
          </p>

          <p>Total: $${itemTotal}</p>

          <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    `;
  });

  totalEl.textContent = `$${total.toFixed(2)}`;
}

// --- CHECKOUT ---
document.getElementById("checkoutBtn")?.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Redirect to checkout page
  location.href = "checkout.html";
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
  updateCartCount();
});