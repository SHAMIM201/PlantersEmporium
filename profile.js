import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
getAuth,
signOut,
onAuthStateChanged
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
const auth = getAuth(app);

onAuthStateChanged(auth,user=>{

if(!user){

window.location.href = "account.html";
return;

}

document.getElementById("profileEmail").innerText =
user.email;

document.getElementById("profilePhone").innerText =
localStorage.getItem("profilePhone") || "-";

document.getElementById("profileAddress").innerText =
localStorage.getItem("profileAddress") || "-";

});

document
.getElementById("logoutBtn")
.addEventListener("click",()=>{

signOut(auth)
.then(()=>{

window.location.href = "account.html";

});

});