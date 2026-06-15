
function login(){

let email =
document.getElementById("email").value;

let password =
document.getElementById("password").value;

if(
email === "admin@gmail.com" &&
password === "123456"
){

localStorage.setItem(
"adminLoggedIn",
"true"
);

window.location.href =
"dashboard.html";

}else{

alert("Wrong Email or Password");

}

}

