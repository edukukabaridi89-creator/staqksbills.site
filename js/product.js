// --- PRODUCT DETAILS PAGE ---

// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));

// Find the product in products array
const product = products.find(p => p.id === productId);

// DOM elements
const productImage = document.getElementById("productImage");
const productName = document.getElementById("productName");
const productDescription = document.getElementById("productDescription");
const qtyInput = document.getElementById("qty");
const minusBtn = document.getElementById("minus");
const plusBtn = document.getElementById("plus");
const addCartBtn = document.getElementById("addCart");
const buyNowBtn = document.getElementById("buyNow");
const relatedContainer = document.getElementById("relatedProducts");
const cartCountEl = document.getElementById("cartCount");

// Display product details
if(product){
  productName.textContent = product.name;
  productDescription.innerHTML = product.description || `
<b>Shipping:</b> FREE 2-7 DAYS VIA USPS PRIORITY MAIL<br>
(No Other Shipping Options Available)<br><br>

<b>Printed With:</b><br>
• 75% Cotton, 25% Linen Paper<br>
• 85 GSM<br>
• Colour Shifting Ink<br>
• Watermarks<br>
• UV Ink<br>
• 4000 DPI Prints Resolution<br><br>

<b>Shipping Info:</b><br>
Tracking Number is provided to your email the following day.<br>
To track your package once you receive the tracking number, visit: 
<a href="https://tools.usps.com/go/TrackConfirmAction" target="_blank" style="color:gold; text-decoration:underline;">
USPS Tracking</a><br><br>

<b>About Product:</b><br>
The notes are passable and spendable.<br>
They have all necessary security features including UV, watermarks, and proper texture.<br>
These bills will pass marker tests and even money counters are fooled with our bills.
  `;
  
  productImage.src = product.image || "images/placeholder.jpg";
} else {
  productName.textContent = "Product not found";
  productDescription.textContent = "This product does not exist.";
  productImage.src = "images/placeholder.jpg";
}

// Quantity buttons
minusBtn.onclick = () => {
  let val = parseInt(qtyInput.value);
  if(val > 1) qtyInput.value = val - 1;
};
plusBtn.onclick = () => {
  let val = parseInt(qtyInput.value);
  qtyInput.value = val + 1;
};

// Add to Cart
addCartBtn.onclick = () => {
  const qty = parseInt(qtyInput.value);
  addToCart(productId, qty);
  updateCartCount();
};

// Buy Now
buyNowBtn.onclick = () => {
  const qty = parseInt(qtyInput.value);
  addToCart(productId, qty);
  window.location.href = "cart.html";
};

// Update cart count
function updateCartCount(){
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  if(cartCountEl) cartCountEl.textContent = totalItems;
}

// Initial cart count update
updateCartCount();

// Display related products (same category)
if(product){

  const related = products.filter(p =>
    p.category === product.category && p.id !== product.id
  )

  related.forEach(p => {

    const div = document.createElement("div")
    div.classList.add("product")

    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <a href="product.html?id=${p.id}" class="viewbtn">See More Details</a>
    `

    relatedContainer.appendChild(div)

  })

}