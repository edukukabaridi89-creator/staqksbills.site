let cart = JSON.parse(localStorage.getItem("cart")) || []

const container = document.getElementById("cartItems")

let total = 0

cart.forEach((item,index)=>{

let itemTotal = item.price * item.qty

total += itemTotal

container.innerHTML += `

<div class="cart-item">

<h3>${item.name}</h3>

<p>Price: $${item.price}</p>

<p>Quantity: ${item.qty}</p>

<p>Total: $${itemTotal}</p>

<button onclick="removeFromCart(${index})">
Remove
</button>

</div>

`

})

document.getElementById("totalPrice").innerText = "Total: $" + total