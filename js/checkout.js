// --- CHECKOUT JS ---
const form = document.getElementById("checkoutForm");
const orderSummary = document.getElementById("orderSummary");
const copyBtn = document.getElementById("copyAddressBtn");

// G2A Voucher Mapping Table
const VOUCHER_LINKS = [
  { max: 10,  url: "https://www.g2a.com/crypto-voucher-10-usd-key-global-i10000337580001" },
  { max: 25,  url: "https://www.g2a.com/crypto-voucher-25-usd-key-global-i10000337580002" },
  { max: 50,  url: "https://www.g2a.com/crypto-voucher-50-usd-key-global-i10000337580003" },
  { max: 100, url: "https://www.g2a.com/crypto-voucher-100-usd-key-global-i10000337580004" },
  { max: 200, url: "https://www.g2a.com/crypto-voucher-200-usd-key-global-i10000337580005" },
  { max: 500, url: "https://www.g2a.com/crypto-voucher-500-usd-key-global-i10000337580006" }
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

  let paymentAddress = "";
  let voucherInstruction = "";

  // Logic for Dynamic Voucher Link
  if (payment.toLowerCase() === "voucher") {
    // Find the first voucher tier that covers the total, or the highest available
    const match = VOUCHER_LINKS.find(v => v.max >= totalUSD) || VOUCHER_LINKS[VOUCHER_LINKS.length - 1];
    paymentAddress = "VOUCHER SUBMISSION PENDING";
    voucherInstruction = `
      <div style="margin: 15px 0; padding: 12px; border: 1px solid #ffcc00; background: rgba(255, 204, 0, 0.1); border-radius: 5px;">
        <p style="margin: 0; color: #ffcc00; font-weight: bold;">ACTION REQUIRED:</p>
        <p style="margin: 5px 0 0 0; font-size: 0.95em;">
          Please <a href="${match.url}" target="_blank" style="color: #fff; text-decoration: underline;">Buy a $${match.max} Crypto Voucher here</a> 
          and send the code to our Telegram support to finalize your order.
        </p>
      </div>`;
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
      console.log("ValidProps Log: Order successfully sent to Telegram.");
    } else {
      console.error("Telegram Error:", data.description);
    }
  })
  .catch(err => console.error("Network Error:", err));

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
    ${voucherInstruction}
    <p><b>Payment Address:</b> <span id="paymentAddress">${paymentAddress}</span></p>
    <p style="margin-top: 15px; font-weight: bold; color: #ffcc00;">Please send the exact amount and confirm with support on Telegram with proof.</p>
  `;

  // Hide copy button if it's a voucher payment, otherwise show it
  copyBtn.style.display = (payment.toLowerCase() === "voucher") ? "none" : "inline-block";

  // Clear cart after generating order
  localStorage.setItem("cart", JSON.stringify([]));
  if(typeof updateCartUI === "function") updateCartUI();
};

// Copy payment address
copyBtn.onclick = () => {
  const text = document.getElementById("paymentAddress").textContent;
  navigator.clipboard.writeText(text)
    .then(()=> alert("Address copied! Make payment then send proof to Telegram support."))
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
