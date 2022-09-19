const submit = document.getElementById("submit");
const rank1 = document.getElementById("rank1");
const rank2 = document.getElementById("rank2");
const rank3 = document.getElementById("rank3");
const rank4 = document.getElementById("rank4");
const rank5 = document.getElementById("rank5");
const youSelected = document.getElementById("youSelected");
var stars;

rank1.addEventListener("click", () => {
  stars = 1;
  localStorage.setItem("stars", stars);
  document.getElementById("rank1").classList.remove("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank1").classList.add("bg-newGray", "text-white");
  document.getElementById("rank2").classList.add("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank2").classList.remove("bg-newGray", "text-white");
  document.getElementById("rank3").classList.add("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank3").classList.remove("bg-newGray", "text-white");
  document.getElementById("rank4").classList.add("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank4").classList.remove("bg-newGray", "text-white");
  document.getElementById("rank5").classList.add("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank5").classList.remove("bg-newGray", "text-white");
});

rank2.addEventListener("click", () => {
  stars = 2;
  localStorage.setItem("stars", stars);
  document.getElementById("rank2").classList.remove("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank2").classList.add("bg-newGray", "text-white");
  document.getElementById("rank1").classList.add("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank1").classList.remove("bg-newGray", "text-white");
  document.getElementById("rank3").classList.add("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank3").classList.remove("bg-newGray", "text-white");
  document.getElementById("rank4").classList.add("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank4").classList.remove("bg-newGray", "text-white");
  document.getElementById("rank5").classList.add("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank5").classList.remove("bg-newGray", "text-white");
});

rank3.addEventListener("click", () => {
  stars = 3;
  localStorage.setItem("stars", stars);
  document.getElementById("rank3").classList.remove("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank3").classList.add("bg-newGray", "text-white");
  document.getElementById("rank2").classList.add("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank2").classList.remove("bg-newGray", "text-white");
  document.getElementById("rank1").classList.add("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank1").classList.remove("bg-newGray", "text-white");
  document.getElementById("rank4").classList.add("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank4").classList.remove("bg-newGray", "text-white");
  document.getElementById("rank5").classList.add("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank5").classList.remove("bg-newGray", "text-white");
});

rank4.addEventListener("click", () => {
  stars = 4;
  localStorage.setItem("stars", stars);
  document.getElementById("rank4").classList.remove("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank4").classList.add("bg-newGray", "text-white");
  document.getElementById("rank2").classList.add("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank2").classList.remove("bg-newGray", "text-white");
  document.getElementById("rank3").classList.add("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank3").classList.remove("bg-newGray", "text-white");
  document.getElementById("rank1").classList.add("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank1").classList.remove("bg-newGray", "text-white");
  document.getElementById("rank5").classList.add("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank5").classList.remove("bg-newGray", "text-white");
});

rank5.addEventListener("click", () => {
  stars = 5;
  localStorage.setItem("stars", stars);
  document.getElementById("rank5").classList.remove("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank5").classList.add("bg-newGray", "text-white");
  document.getElementById("rank2").classList.add("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank2").classList.remove("bg-newGray", "text-white");
  document.getElementById("rank3").classList.add("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank3").classList.remove("bg-newGray", "text-white");
  document.getElementById("rank4").classList.add("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank4").classList.remove("bg-newGray", "text-white");
  document.getElementById("rank1").classList.add("bg-grayishBlue", "text-lightGray");
  document.getElementById("rank1").classList.remove("bg-newGray", "text-white");
});

submit.addEventListener("click", () => {
  window.location.href="./thanks.html";  
});

function selectedRank(){
  youSelected.innerHTML="You selected " + localStorage.getItem("stars") + " out of 5";
  localStorage.removeItem("stars");
}
