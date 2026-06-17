import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
getFirestore,
collection,
query,
where,
getDocs
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
getAuth
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

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
const auth = getAuth(app);

const ordersList =
document.getElementById("ordersList");

auth.onAuthStateChanged(async(user)=>{

if(!user){

window.location.href = "account.html";
return;

}

const q = query(
collection(db,"orders"),
where("userId","==",user.uid)
);

const snapshot =
await getDocs(q);

ordersList.innerHTML = "";

if(snapshot.empty){

ordersList.innerHTML =
"<h3>No Orders Found</h3>";

return;

}

snapshot.forEach(docSnap=>{

const order = docSnap.data();

ordersList.innerHTML += `
<div class="order-card">

<h2>📦 Order #${order.orderNumber}</h2>

<div class="order-status">
${order.status}
</div>

<p><b>Customer:</b> ${order.name}</p>

<p><b>Phone:</b> ${order.phone}</p>

<p><b>Payment:</b> ${
order.status === "Payment Verification Pending"
? "UPI"
: "Cash On Delivery"
}</p>
<p><b>Items:</b> ${
order.cart?.length || 0
}</p>

<p><b>Total Amount:</b> ₹${
order.cart
? order.cart.reduce(
(total,item)=>
total + (item.price * (item.quantity || 1)),
0
)
: 0
}</p>

<a
class="track-btn"
href="track-order.html?order=${order.orderNumber}">
Track Order
</a>

</div>
`;

});

});