import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import {
getFirestore,
collection,
addDoc
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
const auth = getAuth(app);
const db = getFirestore(app);




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
window.location.href = "address.html";

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

const redirectPage =
localStorage.getItem("redirectAfterLogin");

if(redirectPage){

localStorage.removeItem(
"redirectAfterLogin"
);

window.location.href =
redirectPage;

}else{

window.location.href =
"profile.html";

}

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
const authBox =
document.getElementById("authBox");

const logoutBtn =
document.getElementById("logoutBtn");

if(user){

authBox.style.display = "none";

logoutBtn.style.display = "block";

info.innerHTML =
"Logged In: " + user.email;

const profileEmail =
document.getElementById("profileEmail");

if(profileEmail){
profileEmail.innerText = user.email;
}

const profilePhone =
document.getElementById("profilePhone");

if(profilePhone){

profilePhone.innerText =
localStorage.getItem("profilePhone")
|| "-";

}

const profileAddress =
document.getElementById("profileAddress");

if(profileAddress){

profileAddress.innerText =
localStorage.getItem("profileAddress")
|| "-";

}
}else{

authBox.style.display = "block";

logoutBtn.style.display = "none";

info.innerHTML =
"Not Logged In";

}

});
const uploadBtn =
document.getElementById("uploadPhotoBtn");

if(uploadBtn){

uploadBtn.addEventListener("click", async ()=>{

try{

const file =
document.getElementById("customerPhoto").files[0];

if(!file){
alert("Please Select Image");
return;
}

const user = auth.currentUser;

if(!user){
alert("Please Login First");
return;
}

const formData = new FormData();

formData.append("file", file);

formData.append(
"upload_preset",
"plantersemporium"
);

const response = await fetch(
"https://api.cloudinary.com/v1_1/da7pwkapr/image/upload",
{
method:"POST",
body:formData
}
);

const data =
await response.json();

await addDoc(
collection(db,"customerInstallations"),
{
email:user.email,
image:data.secure_url,
approved:false,
createdAt:new Date()
}
);

document.getElementById(
"uploadStatus"
).innerHTML =
"✅ Photo Uploaded Successfully";

}catch(error){

console.error(error);
alert(error.message);

}

});

}
