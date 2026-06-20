import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
getFirestore,
collection,
getDocs
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

const orderNumber =
new URLSearchParams(window.location.search)
.get("order");

const invoiceDiv =
document.getElementById("invoiceData");

const snapshot =
await getDocs(collection(db,"orders"));

let found = false;

snapshot.forEach(doc=>{

const order = doc.data();

if(order.orderNumber !== orderNumber) return;

found = true;

let rows = "";
let subtotal = 0;

(order.cart || []).forEach(item=>{

const qty = item.quantity || 1;

const total =
(item.price || 0) * qty;

subtotal += total;

rows += `
<tr>
<td>${item.name}</td>
<td>${qty}</td>
<td>₹${item.price}</td>
<td>₹${total}</td>
</tr>
`;

});

const gst = subtotal * 0.18;
const grandTotal = subtotal + gst;

invoiceDiv.innerHTML = `

<div class="header">

<div class="company">
<h1>PLANTERS EMPORIUM</h1>

<p>
GSTIN : 07BFGPA5432J1ZN
</p>

<p>
Wholesale & Manufacturer
</p>

</div>

<div>

<h2>GST INVOICE</h2>

<p>
Invoice Date:
${new Date().toLocaleDateString()}
</p>

<p>
Order ID:
${order.orderNumber}
</p>

</div>

</div>

<hr>

<h3>Customer Details</h3>

<p><b>Name:</b> ${order.name}</p>

<p><b>Phone:</b> ${order.phone}</p>

<p><b>Address:</b>
${order.address},
${order.city},
${order.pincode}
</p>

<table>

<tr>
<th>Product</th>
<th>Qty</th>
<th>Price</th>
<th>Total</th>
</tr>

${rows}

</table>

<div class="total-box">

<h3>
Subtotal :
₹${subtotal.toFixed(2)}
</h3>

<h3>
GST (18%) :
₹${gst.toFixed(2)}
</h3>

<h2>
Grand Total :
₹${grandTotal.toFixed(2)}
</h2>

</div>

`;

});

if(!found){

invoiceDiv.innerHTML = `
<h2>
Invoice Not Found
</h2>
`;

}