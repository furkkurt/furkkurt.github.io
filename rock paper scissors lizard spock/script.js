function showRules(){
  document.getElementById("rules").classList.toggle("hidden");
  document.getElementById("but").classList.toggle("opacity-70");
  document.getElementById("icons").classList.toggle("opacity-70");
  document.getElementById("score").classList.toggle("opacity-70");
}

function play(pick){
  let stuff = ["rock", "paper", "scissors", "spock", "lizard"];
  let compNum = Math.floor(Math.random() * 5);
  let comp = stuff[compNum];
  let res = "";


  if(pick=="rock"){
    if(comp=="rock")
      res = "TIE";
    else if(comp=="paper")
      res = "YOU LOSE"
    else if(comp=="scissors")
      res = "YOU WIN";
    else if(comp=="spock")
      res = "YOU LOSE"
    else if(comp=="lizard")
      res = "YOU WIN";
  }
  else if(pick=="paper"){
    if(comp=="rock")
      res = "YOU WIN";
    else if(comp=="paper")
      res = "TIE";
    else if(comp=="scissors")
      res = "YOU LOSE"
    else if(comp=="spock")
      res = "YOU WIN";
    else if(comp=="lizard")
      res = "YOU LOSE"
  }
  else if(pick=="scissors"){
    if(comp=="rock")
      res = "YOU LOSE"
    else if(comp=="paper")
      res = "YOU WIN";
    else if(comp=="scissors")
      res = "TIE";
    else if(comp=="spock")
      res = "YOU LOSE"
    else if(comp=="lizard")
      res = "YOU WIN";
  }
  else if(pick=="spock"){
    if(comp=="rock")
      res = "YOU WIN";
    else if(comp=="paper")
      res = "YOU LOSE"
    else if(comp=="scissors")
      res = "YOU WIN";
    else if(comp=="spock")
      res = "TIE";
    else if(comp=="lizard")
      res = "YOU LOSE"
  }
  else if(pick=="lizard"){
    if(comp=="rock")
      res = "YOU LOSE"
    else if(comp=="paper")
      res = "YOU WIN";
    else if(comp=="scissors")
      res = "YOU LOSE"
    else if(comp=="spock")
      res = "YOU WIN";
    else if(comp=="lizard")
      res = "TIE";
  }

  localStorage.setItem("comp", comp);
  localStorage.setItem("pick", pick);
  localStorage.setItem("res", res);
  window.location.href="./versus.html";
}
function setImages(){
  eval("document.getElementById('compImg').src='./img/icon-"+localStorage.getItem("comp")+".svg'");
  eval("document.getElementById('pickImg').src='./img/icon-"+localStorage.getItem("pick")+".svg'");
  
  eval("document.getElementById('versusPick').classList.add('from-"+localStorage.getItem("pick")+"GradientFrom')");
  eval("document.getElementById('versusPick').classList.add('to-"+localStorage.getItem("pick")+"GradientTo')");
  eval("document.getElementById('versusComp').classList.add('from-"+localStorage.getItem("comp")+"GradientFrom')");
  eval("document.getElementById('versusComp').classList.add('to-"+localStorage.getItem("comp")+"GradientTo')");
  
  document.getElementById("resultText").innerHTML = localStorage.getItem("res");
  setTimeout(showComp, 150)
  setTimeout(showResult, 300)
}
function showComp(){
  document.getElementById("versusComp").classList.remove("hidden");
}
function showResult(){
  document.getElementById("result").classList.remove("hidden")
}


function again(){
  let score = 0;
  if(localStorage.getItem("score") != undefined)
    score = localStorage.getItem("score");
  
  if(localStorage.getItem("res") == "YOU WIN")
    score = parseInt(score)+1;
  else if(localStorage.getItem("res") == "YOU LOSE")
    score = parseInt(score)-1;
  else
    score = parseInt(score);

  localStorage.clear();
  localStorage.setItem("score", score);
  window.location.href="./index.html";
}

function setScore(){
  if(localStorage.getItem("score") == undefined)
    document.getElementById("score").innerHTML = "00";
  else
    document.getElementById("score").innerHTML = localStorage.getItem("score");
}

window.onload = setImages();
window.onload = setScore();
