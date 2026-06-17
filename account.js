import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
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

window.signup = function(){

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

createUserWithEmailAndPassword(
auth,
email,
password
)
.then(()=>{

alert("Account Created");

window.location.href = "checkout.html";

})
.catch(err=>{
alert(err.message);
});

};

window.login = function(){

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

signInWithEmailAndPassword(
auth,
email,
password
)
.then(()=>{

alert("Login Success");

window.location.href = "checkout.html";

})
.catch(err=>{
alert(err.message);
});

};

window.logout = function(){

signOut(auth);

};

onAuthStateChanged(auth,user=>{

const info =
document.getElementById("userInfo");

if(user){

info.innerHTML =
"Logged In: " + user.email;

}else{

info.innerHTML =
"Not Logged In";

}

});