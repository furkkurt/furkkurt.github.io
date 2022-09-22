function showText(show){
  for(let i=1; i<=5; i++){
    if(!(show=="text"+i))
      eval("document.getElementById('text"+i+"').classList.add('hidden')");
  }
  document.getElementById(show).classList.toggle("hidden");
}
