import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
getFirestore,
collection,
getDocs,
doc,
updateDoc
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

const phoneNumber =
document.getElementById("phoneNumber").value.trim();

const result =
document.getElementById("result");
if(!orderId){
    result.innerHTML =
    "<p style='color:red'>Please enter Order ID</p>";
    return;
}

if(!phoneNumber){
    result.innerHTML =
    "<p style='color:red'>Please enter Mobile Number</p>";
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
const history = order.trackingHistory || [];

if(
    order.orderNumber === orderId &&
    order.phone === phoneNumber
){

found = true;
let historyHtml = "";

let allSteps = [];
const progressSteps = [
"Order Confirmed",
"Packed",
"Shipped",
"Out For Delivery",
"Delivered"
];

let currentStep =
progressSteps.indexOf(order.status);

if(currentStep < 0){
currentStep = 0;
}

let progressHtml = `

<div style="
display:flex;
justify-content:space-between;
align-items:center;
margin:30px 0;
position:relative;
">

<div style="
position:absolute;
top:18px;
left:0;
right:0;
height:4px;
background:#ddd;
z-index:1;
"></div>
`;

progressSteps.forEach((step,index)=>{

progressHtml += `
<div style="
position:relative;
z-index:2;
text-align:center;
flex:1;
">

<div style="
width:35px;
height:35px;
margin:auto;
border-radius:50%;
background:${
index <= currentStep
? '#16a34a'
: '#fff'
};
border:3px solid ${
index <= currentStep
? '#16a34a'
: '#bbb'
};
color:white;
display:flex;
justify-content:center;
align-items:center;
font-weight:bold;
">
${index <= currentStep ? '✓' : ''}
</div>

<div style="
font-size:12px;
margin-top:8px;
font-weight:bold;
">
${step}
</div>

</div>
`;
});

progressHtml += `</div>`;

if(order.status === "Cancelled"){
    progressHtml = "";
}


if(order.status === "Cancelled"){

allSteps = history.map(item => item.status);

}
else{

allSteps = [
"Order Confirmed",
"Packed",
"Shipped",
"Out For Delivery",
"Delivered"
];

}

allSteps.forEach((stepName,index)=>{

let stepData =
history.find(x => x.status === stepName);

let completed = !!stepData;

if(
allSteps.indexOf(stepName)
<=
allSteps.indexOf(order.status)
){
completed = true;
}
if(completed && !stepData){
stepData = {
time: "Status Updated"
};
}

if(
order.status === "Cancelled" &&
stepName === "Cancelled"
){
completed = true;
}

historyHtml += `

<div style="
display:flex;
align-items:flex-start;
">

<div style="
width:50px;
display:flex;
flex-direction:column;
align-items:center;
">

<div style="
width:32px;
height:32px;
border-radius:50%;
background:${
stepName==="Cancelled" && completed
? '#dc3545'
: completed
? '#16a34a'
: '#fff'
};

border:3px solid ${
stepName==="Cancelled" && completed
? '#dc3545'
: completed
? '#16a34a'
: '#999'
};
color:white;
font-size:18px;
font-weight:bold;
display:flex;
justify-content:center;
align-items:center;
">
${completed ? '✓' : ''}
</div>

${index < allSteps.length-1 ? `
<div style="
width:3px;
height:65px;
background:${completed ? '#16a34a' : '#ccc'};
"></div>
` : ''}

</div>

<div style="
padding-left:15px;
padding-bottom:25px;
">

<div style="
font-size:22px;
font-weight:bold;
color:${
stepName==="Cancelled" && completed
? '#dc3545'
: completed
? '#16a34a'
: '#111'
};
">
${stepName}
</div>

<div style="
margin-top:5px;
color:#666;
font-size:14px;
">
${stepData?.time || 'Not yet updated'}
</div>

<div style="
margin-top:8px;
font-size:15px;
color:#444;
">
${
stepName==="Order Confirmed"
? "Your order has been confirmed."
:
stepName==="Packed"
? "Your order has been packed."
:
stepName==="Shipped"
? "Your order is on the way."
:
stepName==="Out For Delivery"
? "Your order is out for delivery."
:
stepName==="Cancelled"
? "This order has been cancelled."
:
"Your order has been delivered."
}
</div>

</div>

</div>

`;

});

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
${(order.status === "Order Confirmed" || order.status === "Packed") ? `

<button
onclick="cancelOrder('${order.orderNumber}')"
style="
background:#dc3545;
color:white;
border:none;
padding:10px 20px;
border-radius:8px;
cursor:pointer;
margin-top:10px;
font-weight:bold;
">
Cancel Order
</button>

` : ''}
<h3 style="margin-top:25px;">
Tracking Updates
</h3>

${progressHtml}
${historyHtml}
<div style="
margin-top:20px;
padding:15px;
background:#eef8ee;
border:1px solid #b7dfb7;
border-radius:8px;
text-align:center;
color:#0b7a29;
font-weight:bold;
">

Last Updated:
${history.length ? history[history.length-1].time : 'N/A'}

</div>

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
window.cancelOrder = async function(orderNumber){

const ok = confirm(
"Are you sure you want to cancel this order?"
);

if(!ok) return;

try{

const snapshot =
await getDocs(
collection(db,"orders")
);

for(const d of snapshot.docs){

const order = d.data();

if(order.orderNumber === orderNumber){

const history =
order.trackingHistory || [];

history.push({
status:"Cancelled",
time:new Date().toLocaleString()
});

await updateDoc(
doc(db,"orders",d.id),
{
status:"Cancelled",
trackingHistory:history
}
);




alert("Order Cancelled Successfully");

trackOrder();

break;


}

}

}
catch(error){

console.error(error);

alert("Failed to cancel order");

}

};