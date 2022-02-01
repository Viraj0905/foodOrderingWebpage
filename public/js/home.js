
const myAccount=document.querySelector(".link-btn");
const body=document.querySelector("body");
const dropdowns=document.querySelector(".link-down");

window.onscroll=function() {myFunction()};
var navbar=document.querySelector("#navbar");
var sticky =navbar.offsetTop;
function myFunction(){
    if(window.pageYOffset > sticky){
        navbar.classList.add("sticky");
    }else{
        navbar.classList.remove("sticky");
    }
}


myAccount.addEventListener("click",function(){
if(dropdowns.style.display === "none"){
    dropdowns.style.display ="block";
}else{
    dropdowns.style.display ="none";
}
});
