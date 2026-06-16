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

window.trackOrder = async function(){

const orderId =
document.getElementById("orderId").value.trim();

const result =
document.getElementById("result");

if(!orderId){

result.innerHTML =
"<p>Please enter Order ID</p>";

return;

}

result.innerHTML =
"<p>Searching...</p>";

try{

const snapshot =
await getDocs(
collection(db,"orders")
);

let found = false;

snapshot.forEach(doc=>{

const order = doc.data();

if(order.orderNumber === orderId){

found = true;
let step = 1;

if(order.status === "Packed"){
step = 2;
}

else if(order.status === "Shipped"){
step = 3;
}

else if(order.status === "Out For Delivery"){
step = 4;
}

else if(order.status === "Delivered"){
step = 5;
}

result.innerHTML = `

<div style="
background:#f5f5f5;
padding:20px;
border-radius:10px;
margin-top:20px;
">

<h3>Order Found</h3>

<p>
<b>Order ID:</b>
${order.orderNumber}
</p>

<p>
<b>Name:</b>
${order.name}
</p>

<p>
<b>Phone:</b>
${order.phone}
</p>

<p>
<b>Status:</b>
${order.status}
</p>

<p style="
margin-top:15px;
font-size:16px;
line-height:30px;
color:#0b7a29;
font-weight:bold;
">
<div style="
display:flex;
justify-content:center;
align-items:flex-start;
gap:25px;
margin-top:25px;
font-weight:bold;
flex-wrap:wrap;
">

<div style="text-align:center;">
<div style="
width:40px;
height:40px;
border-radius:50%;
background:${step>=1?'#28a745':'#ccc'};
margin:auto;
"></div>
<div style="margin-top:8px;">
Order Received
</div>
</div>

<div style="text-align:center;">
<div style="
width:40px;
height:40px;
border-radius:50%;
background:${step>=2?'#28a745':'#ccc'};
margin:auto;
"></div>
<div style="margin-top:8px;">
Packed
</div>
</div>

<div style="text-align:center;">
<div style="
width:40px;
height:40px;
border-radius:50%;
background:${step>=3?'#28a745':'#ccc'};
margin:auto;
"></div>
<div style="margin-top:8px;">
Shipped
</div>
</div>

<div style="text-align:center;">
<div style="
width:40px;
height:40px;
border-radius:50%;
background:${step>=4?'#28a745':'#ccc'};
margin:auto;
"></div>
<div style="margin-top:8px;">
Out For Delivery
</div>
</div>

<div style="text-align:center;">
<div style="
width:40px;
height:40px;
border-radius:50%;
background:${step>=5?'#28a745':'#ccc'};
margin:auto;
"></div>
<div style="margin-top:8px;">
Delivered
</div>
</div>

</div>


</div>
</p>

</div>
`;
}

});

if(!found){

result.innerHTML = `

<div style="
background:#ffeaea;
padding:15px;
border-radius:10px;
margin-top:20px;
">

Order Not Found

</div>

`;

}

}
catch(error){

console.error(error);

result.innerHTML = `

<div style="
background:#ffeaea;
padding:15px;
border-radius:10px;
margin-top:20px;
">

Something went wrong

</div>

`;

}

};