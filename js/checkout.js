// --- CHECKOUT JS ---
const form = document.getElementById("checkoutForm");
const orderSummary = document.getElementById("orderSummary");
const copyBtn = document.getElementById("copyAddressBtn");

// Handle form submit
form.onsubmit = function(e){
  e.preventDefault();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if(cart.length === 0){
    alert("Your cart is empty.");
    return;
  }

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const payment = document.getElementById("payment").value;

  const totalUSD = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const orderID = "ORD" + Math.floor(Math.random()*1000000);
  const time = new Date().toLocaleString();

  let paymentAddress = "";
  switch(payment.toLowerCase()){
    case "bitcoin": paymentAddress = "bc1q7yuv6pl9ht2pe6kxe6hyf0kuzfua6rkqtkgyf5"; break;
    case "ethereum": paymentAddress = "0xAFc94727bFe3A51d7B7c7E321f02B094bA72847"; break;
    case "solana": paymentAddress = "HooqUQLi4trb46fuzNy1rhY3qtkrPJw6FcRwWNEhtLsn"; break;
  }

  // Display order summary
  orderSummary.innerHTML = `
    <h3>Order Generated</h3>
    <p><b>Order ID:</b> ${orderID}</p>
    <p><b>Date:</b> ${time}</p>
    <p><b>Name:</b> ${firstName} ${lastName}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Address:</b> ${address}</p>
    <p><b>Total:</b> $${totalUSD}</p>
    <p><b>Payment Method:</b> ${payment}</p>
    <p><b>Payment Address:</b> <span id="paymentAddress">${paymentAddress}</span></p>
    <p>Please follow the payment instructions and confirm with support on Telegram.</p>
  `;

  // Show copy button
  copyBtn.style.display = "inline-block";

  // Clear cart after generating order
  localStorage.setItem("cart", JSON.stringify([]));
  if(typeof updateCartUI === "function") updateCartUI();
};

// Copy payment address
copyBtn.onclick = () => {
  const text = document.getElementById("paymentAddress").textContent;
  navigator.clipboard.writeText(text)
    .then(()=> alert("Payment address copied, MAKE THE PAYMENT THEN COME TO THE TELEGRAM WITH PROOF!"))
    .catch(()=> alert("Failed to copy."));
};

// --- FAKE LIVE PURCHASE POPUPS ---
const names = ["James", "Michael", "Chris", "Daniel", "Alex", "Brian"];
const countries = ["USA", "UK", "Canada", "Germany", "Australia"];

function showFakePurchase() {
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomCountry = countries[Math.floor(Math.random() * countries.length)];
  if (!products || products.length === 0) return;

  const randomProduct = products[Math.floor(Math.random() * products.length)];

  const popup = document.createElement("div");
  popup.className = "fake-popup";
  popup.innerHTML = `
    <p><strong>${randomName}</strong> from ${randomCountry}</p>
    <p>just purchased <strong>${randomProduct.name}</strong></p>
  `;

  document.body.appendChild(popup);

  setTimeout(() => popup.remove(), 4000);
}

// Show every 10–20 seconds
setInterval(showFakePurchase, Math.random() * 10000 + 10000);

// --- TELEGRAM FLOAT INLINE ---
document.querySelectorAll(".telegram-float").forEach(el=>{
  el.addEventListener("click", e=>{
    e.preventDefault();
    const iframe = document.createElement("iframe");
    iframe.src = el.href;
    iframe.style.width = "100%";
    iframe.style.height = "600px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);
    window.scrollTo({ top: iframe.offsetTop, behavior: "smooth" });
  });
});
