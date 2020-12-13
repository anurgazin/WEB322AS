document.addEventListener("DOMContentLoaded", nav);
function nav() {
  const burger = document.querySelector(".burger");
  const sign = document.querySelector(".button");
  const close = document.querySelector(".close");
  const nav = document.querySelector(".navbar");
  const menu = document.querySelector(".menu")
  burger.addEventListener("click", () => {
    nav.classList.toggle("show");
  });
  sign.addEventListener("click",()=>{
    menu.style.visibility = "hidden";
    burger.style.visibility = "hidden";
  })
}