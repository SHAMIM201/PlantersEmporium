const descriptions = {

"Fiber glass pot":
"Premium fiberglass planter. Durable and weather resistant.",

"Diamond Designer pot":
"Elegant diamond pattern planter for indoor and outdoor use.",

"Basket":
"Decorative hanging basket for beautiful plants.",

"Water Tank":
"Heavy-duty water storage tank."

};




const prices = {
  "Fiber glass pot": 999,
  "Diamond Designer pot": 799,
  "Corner Table Pot": 899,
  "Boat Plant Pot": 699,
  "Cup Plant Pot": 599,
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

// ==========================================
// CART INITIALIZATION & UPDATES
// ==========================================
function updateCartCounter() {

const cart =
JSON.parse(localStorage.getItem("cart")) || [];

const totalCount =
cart.reduce((sum,item)=>{
return sum + (item?.quantity || 0);
},0);

localStorage.setItem("cartCount",totalCount);

const cartCounter =
document.getElementById("cart-count");

if(cartCounter){
cartCounter.innerText = totalCount;
}

updateFloatingCart();

}

// Global function to update items quantity inside localStorage cart
window.changeQuantity = function(name, price, image, action) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let productIndex = cart.findIndex(item => item.name === name);

  if (action === "plus") {
    if (productIndex > -1) {
      cart[productIndex].quantity += 1;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }
  } else if (action === "minus") {
    if (productIndex > -1) {
      cart[productIndex].quantity -= 1;
      if (cart[productIndex].quantity <= 0) {
        cart.splice(productIndex, 1);
      }
    }
  }
localStorage.setItem(
"lastAddedImage",
image
);
localStorage.setItem(
"cart",
JSON.stringify(cart)
);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCounter();
  
  const updatedProduct = cart.find(item => item.name === name);
  return updatedProduct ? updatedProduct.quantity : 0;
};

// Initial Load
updateCartCounter();

// ==========================================
// SEARCH BAR FUNCTIONALITY
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
function similarity(a, b){

a = a.toLowerCase();
b = b.toLowerCase();

if(b.includes(a)) return 1;

let score = 0;

for(let char of a){
   if(b.includes(char)){
      score++;
   }
}

return score / a.length;

}
function performSearch() {

const filterValue =
searchInput.value.toLowerCase().trim();
const keywords =
filterValue.split(",")
.map(k => k.trim())
.filter(k => k);

const cards =
document.querySelectorAll(
".product-card, .slide-card"
);

let visibleCount = 0;

cards.forEach(card => {

const productName =
card.querySelector("h3")
?.innerText.toLowerCase() || "";

if (filterValue === "") {

card.style.display = "";
visibleCount++;

} else {

const matched =
keywords.some(keyword =>
productName.includes(keyword)
);

if (matched) {

card.style.display = "";
visibleCount++;

} else {

card.style.display = "none";

}

}

});

const noResults =
document.getElementById("noResults");

if(noResults){

if(visibleCount === 0 && filterValue !== ""){
   noResults.style.display = "block";
}else{
   noResults.style.display = "none";
}

}

}
 
if (searchInput) {

  searchInput.addEventListener("input", performSearch);

  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

}

  if (searchBtn) {
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      performSearch();
    });
  }
});
let allProducts = [];
// ==========================================
// FIREBASE STORE INTEGRATION
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
getFirestore,
collection,
getDocs,
doc,
getDoc
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD85FuEhRolVMpXTuu34LgDMRVaT_R3Fek",
  authDomain: "samim-d6b27.firebaseapp.com",
  projectId: "samim-d6b27",
  storageBucket: "samim-d6b27.firebasestorage.app",
  messagingSenderId: "147210923031",
  appId: "1:147210923031:web:04f6a9f5649183d8b1c052"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
async function loadFeaturedProducts() {

const featuredTrack =
document.getElementById("featuredProducts");

if(!featuredTrack) return;

featuredTrack.innerHTML = "";

try {

const snapshot =
await getDocs(collection(db, "products"));

snapshot.forEach((doc) => {

const product = doc.data();
const stock = product.stock || 0;
const cart =
JSON.parse(localStorage.getItem("cart")) || [];

const cartItem =
cart.find(item => item.name === product.name);

const currentQty =
cartItem ? cartItem.quantity : 0;
allProducts.push({
    name: product.name,
    price: product.price,
    image: product.image
});

if(product.featured !== true) return;

featuredTrack.innerHTML += `
<div class="slide-card"
data-id="${doc.id}"
data-name="${product.name}"
data-price="${product.price}"
data-image="${product.image}">

<img src="${product.image}" alt="${product.name}">

<h3>${product.name}</h3>

<p class="price">
₹${product.price}
</p>

<div class="cart-control">

${stock > 0 ? `
<button class="add-btn"
style="${currentQty > 0 ? 'display:none' : ''}">
Add Now
</button>
` : `

<button
style="
background:#ccc;
color:#666;
cursor:not-allowed;
">
Out Of Stock
</button>
`}

<div class="qty-box" style="display:none;">
<button class="qty-btn minus">−</button>
<span class="qty-number">0</span>
<button class="qty-btn plus">+</button>
</div>

</div>


</div>
`;

});

setupQuantityButtons();
initializeFeaturedSlider();

} catch(error) {

console.log(error);

}

}
async function loadFirebaseProducts() {
  const productGrid = document.getElementById("bestSellerProducts");
  if (!productGrid) return;

  productGrid.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "products"));
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    snapshot.forEach((doc) => {
      const product = doc.data();
      const stock = product.stock || 0;
      if(product.bestseller !== true) return;
      const cartItem = cart.find(item => item.name === product.name);
      const currentQty = cartItem ? cartItem.quantity : 0;
productGrid.innerHTML += `

<div class="product-card"
data-id="${doc.id}"
data-name="${product.name}"
data-price="${product.price}"
data-image="${product.image}">

<img src="${product.image}" alt="${product.name}">
<h3>${product.name}</h3>

<p class="price">
₹${product.price}
</p>

<div class="cart-control">

${stock > 0 ? `
<button class="add-btn"
style="${currentQty > 0 ? 'display:none' : ''}">
Add Now
</button>
` : `
<button
style="
background:#ccc;
color:#666;
cursor:not-allowed;
">
Out Of Stock
</button>
`}

<div class="qty-box" style="display:none;">
<button class="qty-btn minus">−</button>
<span class="qty-number">0</span>
<button class="qty-btn plus">+</button>
</div>

</div>



</div>
`;
    });

    setupQuantityButtons();

  } catch(error) {
    console.error("Firebase Error:", error);
  }
}
async function setupQuantityButtons() {


document.querySelectorAll(".cart-control").forEach(control => {

if(control.dataset.loaded) return;

control.dataset.loaded = "true";

const addBtn = control.querySelector(".add-btn");
if (!addBtn) return;
const buyNow =
control.querySelector(".buy-now-btn");
const qtyBox = control.querySelector(".qty-box");

const minus = control.querySelector(".minus");
const plus = control.querySelector(".plus");
const qty = control.querySelector(".qty-number");

let count = 0;
const card =
control.closest(".product-card") ||
control.closest(".slide-card");

const cart =
JSON.parse(localStorage.getItem("cart")) || [];

const existing =
cart.find(item => item.name === card.dataset.name);

count =
existing ? existing.quantity : 0;

if(count > 0){

addBtn.style.display = "none";
qtyBox.style.display = "flex";
qty.innerText = count;

}


addBtn.addEventListener("click", async () => {
  const card =
control.closest(".product-card") ||
control.closest(".slide-card");
  const productRef =
doc(db,"products",card.dataset.id);

const productSnap =
await getDoc(productRef);

if(!productSnap.exists()) return;

const stock =
productSnap.data().stock || 0;

if(stock <= 0){

alert("Out Of Stock");

return;

}

count = 1;




let cart =
JSON.parse(localStorage.getItem("cart")) || [];

const existing = cart.find(
item => item.name === card.dataset.name
);

if(existing){

    existing.quantity += 1;

    cart = cart.filter(
        item => item.name !== card.dataset.name
    );

    cart.push(existing);

}else{
   cart.push({
    id: card.dataset.id,
    name: card.dataset.name,
    price: parseInt(card.dataset.price),
    image: card.dataset.image,
    quantity: 1
});
}
localStorage.setItem(
"lastAddedImage",
card.dataset.image
);
let recentImages =
JSON.parse(
localStorage.getItem("recentImages")
) || [];

recentImages =
recentImages.filter(
img => img !== card.dataset.image
);

recentImages.push(card.dataset.image);

recentImages = recentImages.slice(-3);

localStorage.setItem(
"recentImages",
JSON.stringify(recentImages)
);
count = existing ? existing.quantity : 1;

qty.innerText = count;

addBtn.style.display = "none";
qtyBox.style.display = "flex";
localStorage.setItem(
"cart",
JSON.stringify(cart)
);

let cartCount =
parseInt(localStorage.getItem("cartCount")) || 0;


cartCount++;

localStorage.setItem("cartCount", cartCount);

document.getElementById("cart-count").innerText =
cartCount;
updateCartCounter();

});



plus.addEventListener("click", async () => {

const card =
control.closest(".product-card") ||
control.closest(".slide-card");

const productRef =
doc(db,"products",card.dataset.id);

const productSnap =
await getDoc(productRef);

if(!productSnap.exists()) return;

const stock =
productSnap.data().stock || 0;

let cart =
JSON.parse(localStorage.getItem("cart")) || [];


const existing =
cart.find(item => item.name === card.dataset.name);

const currentQty =
existing ? existing.quantity : 0;

if(currentQty >= stock){

alert(`Only ${stock} items available`);

return;

}

count++;
qty.innerText = count;

if(existing){

existing.quantity++;

}

else{

cart.push({
id: card.dataset.id,
name: card.dataset.name,
price: parseInt(card.dataset.price),
image: card.dataset.image,
quantity: 1
});

}
localStorage.setItem(
    "lastAddedImage",
    card.dataset.image
);
let recentImages =
JSON.parse(
localStorage.getItem("recentImages")
) || [];

recentImages =
recentImages.filter(
img => img !== card.dataset.image
);

recentImages.push(card.dataset.image);

recentImages = recentImages.slice(-3);

localStorage.setItem(
"recentImages",
JSON.stringify(recentImages)
);

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

updateCartCounter();

});

minus.addEventListener("click", () => {

let cart =
JSON.parse(localStorage.getItem("cart")) || [];
const card =
control.closest(".product-card") ||
control.closest(".slide-card");
const existing =
cart.find(item => item.name === card.dataset.name);

if(existing){

existing.quantity--;

if(existing.quantity <= 0){

cart = cart.filter(
item => item.name !== card.dataset.name
);

qtyBox.style.display = "none";
addBtn.style.display = "inline-block";

}else{

count = existing.quantity;
qty.innerText = count;

}

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

updateCartCounter();

}

});
});
}



// Script Execute Functions
loadFeaturedProducts();
loadFirebaseProducts();
// Dynamic attachment for hardcoded elements (Featured section)
document.addEventListener("DOMContentLoaded", setupQuantityButtons);
// PRODUCT POPUP

document.addEventListener("click", function(e){

const card =
e.target.closest(".slide-card, .product-card");

if(!card) return;
if(
!e.target.classList.contains("add-btn") &&
!e.target.classList.contains("plus") &&
!e.target.classList.contains("minus")
){
    window.location.href =
    `product.html?id=${card.dataset.id}`;
    return;
}

if(
e.target.classList.contains("add-btn") ||
e.target.classList.contains("plus") ||
e.target.classList.contains("minus")
){
return;
}

console.log("POPUP WORKING");

const image =
card.querySelector("img").src;

const title =
card.querySelector("h3").innerText;

document.getElementById("popupImage").src =
image;
document.getElementById("popupTitle").innerText =
title;

const price = card.dataset.price;

document.getElementById("popupPrice").innerText =
"₹" + price;

const whatsappMessage =
`Hello Planters Emporium,

I want to order:

Product: ${title}
Price: ₹${price}

Please share details.`;

document.querySelector(".order-btn").href =
`https://wa.me/919810475303?text=${encodeURIComponent(whatsappMessage)}`;

document.getElementById("popupDescription").innerText =
descriptions[title] ||
"Premium Quality Planter";

document.getElementById("productPopup")
.style.display = "flex";

});

const closeBtn =
document.getElementById("closePopup");

if(closeBtn){

closeBtn.addEventListener("click",()=>{

document.getElementById("productPopup")
.style.display = "none";

});


}
// ==========================================
// FEATURED PRODUCTS INFINITE SLIDER
// ==========================================

function initializeFeaturedSlider() {

const track =
document.getElementById("featuredProducts");

if(!track) return;

const cards =
Array.from(track.children);

if(cards.length === 0) return;

// Clone all cards
cards.forEach(card => {

const clone = card.cloneNode(true);
const addBtn = clone.querySelector(".add-btn");
const qtyBox = clone.querySelector(".qty-box");
const qtyNum = clone.querySelector(".qty-number");

const cart =
JSON.parse(localStorage.getItem("cart")) || [];

const existing =
cart.find(item => item.name === clone.dataset.name);

if(existing){

if(addBtn) addBtn.style.display = "none";

if(qtyBox) qtyBox.style.display = "flex";

if(qtyNum) qtyNum.innerText = existing.quantity;

}

const cartControl =
clone.querySelector(".cart-control");

if(cartControl){
   cartControl.removeAttribute("data-loaded");
}

track.appendChild(clone);

});

setupQuantityButtons();

let position = 0;
const cardWidth = 320;

setInterval(() => {

position += cardWidth;

track.style.transition =
"transform 0.5s ease";

track.style.transform =
`translateX(-${position}px)`;

if(position >= track.scrollWidth / 2){

setTimeout(() => {

track.style.transition =
"none";

position = 0;

track.style.transform =
"translateX(0px)";

},500);

}

},3000);

}
// ==========================================
// CATEGORY FILTER
// ==========================================

document.querySelectorAll(".category-card")
.forEach(card => {

card.addEventListener("click", async () => {

const category =
card.dataset.category;

const section =
document.getElementById(
"categoryProductsSection"
);

const title =
document.getElementById(
"categoryTitle"
);

const grid =
document.getElementById(
"categoryProducts"
);

section.style.display = "block";

title.innerText = category;

grid.innerHTML = "";

try{

const snapshot =
await getDocs(
collection(db,"products")
);

snapshot.forEach((doc)=>{

const product =
doc.data();

const stock = product.stock || 0;
const cart =
JSON.parse(localStorage.getItem("cart")) || [];

const cartItem =
cart.find(item => item.name === product.name);

const currentQty =
cartItem ? cartItem.quantity : 0;
if(product.category !== category)
return;

grid.innerHTML += `


<div class="product-card"
data-id="${doc.id}"
data-name="${product.name}"
data-price="${product.price}"
data-image="${product.image}">

<img src="${product.image}"
alt="${product.name}">
<h3>${product.name}</h3>

<p class="price">
₹${product.price}
</p>
<div class="cart-control">

${stock > 0 ? `
<button class="add-btn">
Add Now
</button>
` : `
<button
style="
background:#ccc;
color:#666;
cursor:not-allowed;
">
Out Of Stock
</button>
`}

<div class="qty-box" style="display:none;">
<button class="qty-btn minus">−</button>
<span class="qty-number">0</span>
<button class="qty-btn plus">+</button>
</div>

</div>

</div>

`;

});
setupQuantityButtons();
window.scrollTo({
top: section.offsetTop - 100,
behavior: "smooth"
});

}catch(error){

console.log(error);

}

});

});
// ==========================================
// GALLERY POPUP
// ==========================================

document.querySelectorAll(".gallery-grid img")
.forEach(img => {

img.addEventListener("click", () => {

document.getElementById("galleryPopupImg").src =
img.src;

document.getElementById("galleryPopup").style.display =
"flex";

});

});

document.getElementById("closeGallery")
.addEventListener("click", () => {

document.getElementById("galleryPopup").style.display =
"none";

});
const topBtn = document.getElementById("topBtn");

if(topBtn){

topBtn.addEventListener("click", () => {

window.scrollTo({
top: 0,
behavior: "smooth"
});

});

}
// HERO BANNER SLIDER

let currentSlide = 0;

const slides =
document.querySelectorAll(".hero .slide");

function showSlide(index){

slides.forEach(slide=>{
slide.classList.remove("active");
});

slides[index].classList.add("active");

}

setInterval(()=>{

currentSlide++;

if(currentSlide >= slides.length){
currentSlide = 0;
}

showSlide(currentSlide);

},2000);
const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("active");
});
const track = document.querySelector(".reviews-track");

function rotateReviews() {

    const firstCard = track.firstElementChild;

    track.style.transition = "transform 0.8s ease";
    track.style.transform = "translateX(-320px)";

    setTimeout(() => {

        track.style.transition = "none";
        track.appendChild(firstCard);

        track.style.transform = "translateX(0)";

    }, 800);

}
function loadMiniCart(){

const cart =
JSON.parse(localStorage.getItem("cart")) || [];

const container =
document.getElementById("miniCartItems");

if(!container) return;

if(cart.length === 0){

container.innerHTML = `
<p style="padding:20px;text-align:center;">
Your cart is empty
</p>
`;

return;
}
let totalItems = 0;
let totalAmount = 0;
container.innerHTML = "";

cart.forEach(item=>{
  totalItems += item.quantity;
totalAmount += item.price * item.quantity;

container.innerHTML += `
<div class="mini-cart-item">

<img src="${item.image}" alt="${item.name}">

<div class="mini-cart-info">

<div class="mini-cart-top">

<div>

<h4>${item.name}</h4>

<p>₹${item.price}</p>

</div>

<div class="mini-cart-qty">

<button onclick="changeMiniQty('${item.name}','minus')">
-
</button>

<span>${item.quantity}</span>

<button onclick="changeMiniQty('${item.name}','plus')">
+
</button>

</div>

</div>

<button
class="mini-remove"
onclick="removeMiniItem('${item.name}')">
Remove
</button>

</div>
</div>
`;

});

document.getElementById(
"miniCartTotalItems"
).innerText = totalItems;

document.getElementById(
"miniCartTotalAmount"
).innerText =
"₹" + totalAmount;
}

function updateFloatingCart(){
 
const cart =
JSON.parse(localStorage.getItem("cart")) || [];

const bar =
document.getElementById("floating-cart");

if(!bar) return;

if(cart.length === 0){

bar.style.display = "none";
return;

}

bar.style.display = "flex";

let totalItems = cart.reduce(
(sum,item)=>sum + (item.quantity || 1),
0
);

document.getElementById(
"floating-cart-count"
).innerText =
totalItems + " Items Selected";

const recentImages =
cart
.map(item => item.image)
.slice(-3)
.reverse();
const lastImage =
localStorage.getItem("lastAddedImage");

if(lastImage){

    recentImages.unshift(lastImage);

    const uniqueImages =
    [...new Set(recentImages)];

    recentImages.length = 0;

    recentImages.push(
        ...uniqueImages.slice(0,3)
    );
}
document.getElementById("img1").style.display =
recentImages[0] ? "block" : "none";

document.getElementById("img2").style.display =
recentImages[1] ? "block" : "none";

document.getElementById("img3").style.display =
recentImages[2] ? "block" : "none";

document.getElementById("img1").src =
recentImages[0] || "";

document.getElementById("img2").src =
recentImages[1] || "";

document.getElementById("img3").src =
recentImages[2] || "";


document.getElementById("img1").style.display =
recentImages[0] ? "block" : "none";

document.getElementById("img2").style.display =
recentImages[1] ? "block" : "none";

document.getElementById("img3").style.display =
recentImages[2] ? "block" : "none";

document.getElementById("img1").src =
recentImages[0] || "";

document.getElementById("img2").src =
recentImages[1] || "";

document.getElementById("img3").src =
recentImages[2] || "";


}

document.addEventListener(
"DOMContentLoaded",
()=>{

updateFloatingCart();

const bar =
document.getElementById(
"floating-cart"
);

if(bar){

bar.onclick = ()=>{
window.location.href =
"cart.html";
};

}

});
// AI IMAGE SEARCH

document.addEventListener("DOMContentLoaded", () => {

    const imageSearch = document.getElementById("imageSearch");

    if (!imageSearch) return;

    imageSearch.addEventListener("change", async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = async function () {

            const base64 = reader.result.split(",")[1];

            try {

                const response = await fetch(
                    "https://planters-ai-search.shamim20140168198.workers.dev",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            image: base64
                        })
                    }
                );

                const data = await response.json();

                console.log("FULL AI DATA:", data);

                if (!data.success) {
                    alert("AI Error: " + (data.error || "Unknown Error"));
                    return;
                }

                // AI keywords
                let keywords = data.keywords || "";
                const keywordMap = {
  "garden": "Garden Pot",
  "planter": "Designer Pot",
  "pot": "Plastic Pot",
  "watering": "Watering Can",
  "water": "Watering Can",
  "basket": "Basket",
  "tank": "Water Tank"
};

for (const key in keywordMap) {
  if (keywords.toLowerCase().includes(key)) {
    keywords = keywordMap[key];
    break;
  }
}

                // extra text clean kar do
                keywords = keywords
                    .replace(/The best answer is/gi, "")
                    .replace(/\n/g, ",")
                    .trim();

                // search box me daalo
                const searchInput =
                         document.getElementById("searchInput");
                         if (searchInput) {
                                searchInput.value = keywords;

                                searchInput.dispatchEvent(
                             new Event("input", { bubbles: true })
                                     );
                                    }

                if (searchInput) {
                    searchInput.value = keywords;
                }

                // agar filterProducts function hai
               
                console.log("Final Keywords:", keywords);

            } catch (error) {

                console.error(error);

                alert("AI Search Failed");

            }

        };

        reader.readAsDataURL(file);

    });

});
document.addEventListener("DOMContentLoaded",()=>{

const miniCart =
document.getElementById("miniCart");

const closeMiniCart =
document.getElementById("closeMiniCart");

const cartBtn =
document.querySelector(".cart-icon");

if(cartBtn){

cartBtn.addEventListener("click",(e)=>{

e.preventDefault();

miniCart.classList.add("active");

loadMiniCart();

});

}

if(closeMiniCart){

closeMiniCart.addEventListener("click",()=>{

miniCart.classList.remove("active");

});

}

});
window.changeMiniQty = function(name, action){

let cart =
JSON.parse(localStorage.getItem("cart")) || [];

const item =
cart.find(i => i.name === name);

if(!item) return;

if(action === "plus"){

item.quantity++;

}else{

item.quantity--;

if(item.quantity <= 0){

cart = cart.filter(
i => i.name !== name
);

}

}

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

loadMiniCart();
updateCartCounter();

};
window.removeMiniItem = function(name){

let cart =
JSON.parse(localStorage.getItem("cart")) || [];

cart = cart.filter(
item => item.name !== name
);

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

loadMiniCart();
updateCartCounter();

};
const aiButton =
document.getElementById("aiButton");

const aiPopup =
document.getElementById("aiPopup");

const closeAI =
document.getElementById("closeAI");

aiButton.onclick = () => {
    aiPopup.style.display = "flex";
};

closeAI.onclick = () => {
    aiPopup.style.display = "none";
};
const sendBtn = document.getElementById("sendAI");
const input = document.getElementById("aiInput");
const messages = document.getElementById("aiMessages");

const plantAnswers = {

"money plant":
"🌱 Money Plant ko indirect sunlight chahiye. Hafte me 2-3 baar paani dein.",

"snake plant":
"🌿 Snake Plant low maintenance hai aur kam roshni me bhi grow karta hai.",

"indoor plant":
"🏡 Best Indoor Plants: Money Plant, Snake Plant, ZZ Plant, Areca Palm.",

"outdoor plant":
"☀️ Best Outdoor Plants: Hibiscus, Bougainvillea, Rose, Marigold.",

"watering":
"💧 Plants ko tab paani dein jab upar ki mitti dry lage.",

"pot":
"🪴 Drainage holes wala pot sabse best rehta hai.",

"hanging pot":
"🪴 Hanging pots Money Plant aur Spider Plant ke liye perfect hain.",

"fertilizer":
"🌿 Mahine me 1-2 baar organic fertilizer use karein.",

"default":
"🌱 Sorry, mujhe is topic ki jankari nahi hai. Plant ya pot se related question puchhiye."
};
function getPlantAnswer(question){

question = question.toLowerCase();

for(let key in plantAnswers){

if(question.includes(key)){

return plantAnswers[key];

}

}

return plantAnswers["default"];

}
sendBtn.addEventListener("click", () => {

let question = input.value.trim();

if(!question) return;

messages.innerHTML += `
<div class="user-msg">
${question}
</div>
`;

const answer =
getPlantAnswer(question);

messages.innerHTML += `
<div class="ai-msg">
${answer}
</div>
`;

input.value = "";

messages.scrollTop =
messages.scrollHeight;

});