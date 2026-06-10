    const prices = {

"Orchid Square": 499,
"Water Tank": 899,
"Basket": 299,
"Hanging pot": 349,
"Square pot": 599,
"Kisti": 449,
"Lotus pot": 399,
"Mixer": 699,

"Plastic Pot": 299,
"Square Planter": 499,
"Designer Pot": 699,
"Garden Pot": 799,
"Watering Can": 249

};

    // CART
  
let cartCount =
parseInt(localStorage.getItem("cartCount")) || 0;

const cartCounter =
document.getElementById("cart-count");

if(cartCounter){
cartCounter.innerText = cartCount;
}

document.querySelectorAll(".add-cart-btn").forEach(btn=>{

btn.addEventListener("click",()=>{

cartCount++;

if(cartCounter){
cartCounter.innerText = cartCount;
}

const productName =
btn.parentElement.querySelector("h3").innerText;

let cart =
JSON.parse(localStorage.getItem("cart")) || [];

cart.push({
name: productName,
price: prices[productName]
});
localStorage.setItem(
"cart",
JSON.stringify(cart)
);

localStorage.setItem(
"cartCount",
cartCount
);

alert(productName + " Added To Cart");

});

});
// ==========================================
// SEARCH BAR
// ==========================================

const searchInput =
document.getElementById("searchInput");

if(searchInput){

searchInput.addEventListener("keyup", function(){

let searchValue =
this.value.toLowerCase();

const products =
document.querySelectorAll(
".product-card, .slide-card"
);

products.forEach(product => {

let productName =
product.querySelector("h3")
.innerText
.toLowerCase();

if(productName.includes(searchValue)){

product.style.display = "block";

}else{

product.style.display = "none";

}

});

});

}
