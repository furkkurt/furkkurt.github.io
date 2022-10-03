$(document).ready(function() {
  $.getJSON("http://ip-api.com/json", function(data){
    $("#ip").text(data.query);
    $("#isp").text(data.isp);
    let offset = new Date().getTimezoneOffset();
    let timezone = "UTC"+offset/60;
    $("#timezone").text(timezone);
    $("#address").text(data.city+", "+data.countryCode+", "+data.zip);
    $("#map").attr("src", "https://www.google.com/maps?q="+data.lat+","+data.lon+"&output=embed");
  });
});

function gatherStuff(){
  let ipInput=document.getElementById("search").value;
  $(document).ready(function() {
    $.getJSON("http://ip-api.com/json/"+ipInput, function(data){
      $("#ip").text(data.query);
      $("#isp").text(data.isp);
      let offset = new Date().getTimezoneOffset();
      let timezone = "UTC"+offset/60;
      $("#timezone").text(timezone);
      $("#address").text(data.city+", "+data.countryCode+", "+data.zip);
      $("#map").attr("src", "https://www.google.com/maps?q="+data.lat+","+data.lon+"&output=embed");
    });
  });
}
