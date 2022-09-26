const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bonaire, Sint Eustatius and Saba",
  "Bosnia and Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Christmas Island",
  "Cocos (Keeling) Islands",
  "Colombia",
  "Comoros",
  "Cook Islands",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Heard Island and Mcdonald Islands",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Caledonia",
  "New Zealand",
 // "Nicaragua",
  "Niger",
  "Nigeria",
  "Niue",
  "Norfolk Island",
  "Northern Mariana Islands",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Romania",
  "Russian Federation",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Martin",
  "Saint Pierre and Miquelon",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Sint Maarten",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Georgia and the South Sandwich Islands",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Svalbard and Jan Mayen",
  "Sweden",
  "Switzerland",
  "Syrian Arab Republic",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks and Caicos Islands",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "United States Minor Outlying Islands",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Wallis and Futuna",
  "Western Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];

var main = document.getElementById("main");

function gatherStuff(){
for(let i=0; i<countries.length; i++){
  let country = countries[i];
  eval("var div"+i);
  eval("var divFlag"+i);
  eval("div"+i+"= document.createElement('div')");
  eval("div"+i+".classList.add('flex', 'flex-col', 'w-2/3', 'h-96', 'bg-white', 'mt-16', 'mx-auto', 'transition', 'hover:scale-110', 'sm:w-96')");
  eval("div"+i+".setAttribute('id', 'div"+i+"')");
  eval("div"+i+".onclick = function(){localStorage.setItem('clickedOn', '"+country+"')}");
  eval("main.appendChild(div"+i+")");
  eval("divFlag"+i+"= document.createElement('img')");
  eval("divP"+i+"= document.createElement('p')");
  eval("divP"+i+".classList.add('relative', 'p-6', 'text-3xl', 'font-barlow')");
  eval("div2P"+i+"= document.createElement('p')");
  eval("div2P"+i+".classList.add('relative', 'pl-6', 'font-barlow', 'text-xl')");
  eval("div3P"+i+"= document.createElement('p')");
  eval("div3P"+i+".classList.add('relative', 'pl-6', 'font-barlow', 'text-xl')");
  eval("div3P"+i+".setAttribute('id', 'div3P"+i+"')");
  eval("div4P"+i+"= document.createElement('p')");
  eval("div4P"+i+".classList.add('relative', 'pl-6', 'font-barlow', 'text-xl')");

  let finalURL = "";

  eval("finalURL = 'https://restcountries.com/v3.1/name/"+country+"?fullText=true'");
  fetch(finalURL).then((response) => response.json()).then((data) => {
    flag = data[0].flags.svg;
    eval("divFlag"+i+".src = '" + data[0].flags.svg + "'");
    eval("divFlag"+i+".classList.add('w-full', 'h-1/2', 'border-2')");
    eval("div"+i+".appendChild(divFlag"+i+")");
  
    eval("divP"+i+".innerHTML = '"+data[0].name.common+"'");
    eval("div"+i+".appendChild(divP"+i+")");
    
    eval("div2P"+i+".innerHTML = 'Population: "+data[0].population+"'");
    eval("div"+i+".appendChild(div2P"+i+")");
    
    eval("div3P"+i+".innerHTML = 'Region: "+data[0].region+"'");
    eval("div"+i+".appendChild(div3P"+i+")");
    
    eval("div4P"+i+".innerHTML = 'Capital: "+data[0].capital+"'");
    eval("div"+i+".appendChild(div4P"+i+")");
  });

  eval("overlay"+i+"= document.createElement('div')");
  eval("overlay"+i+".classList.add('absolute', 'w-full', 'h-full')");
  eval("div"+i+".appendChild(overlay"+i+")");
  eval("overlay"+i+".onclick = function(){window.location.href='./details.html'}");
}
}
function search(){
  let searchedText = document.getElementById("search").value;
  let validNums = [];
  for(let i=0; i<countries.length; i++){
    if(countries[i].toLowerCase().includes(searchedText.toLowerCase()))
      validNums.push(countries.indexOf(countries[i]));
  }
  for(let i=0; i<countries.length; i++){
    if(!(validNums.includes(i)))
      eval("div"+i+".classList.add('hidden')");
    else
      eval("div"+i+".classList.remove('hidden')");
  }
}

function filter(){
  for(let i=0; i<countries.length; i++){
    let ithCountry="";
    eval("ithCountry = document.getElementById('div3P"+i+"')");
    if(ithCountry.innerHTML.includes(document.getElementById("region").value))
      eval("div"+i+".classList.remove('hidden')")
    else
      eval("div"+i+".classList.add('hidden')")
  }
}

function gatherInfo(){
  let chosenCountry = localStorage.getItem("clickedOn");
  eval("finalURL = 'https://restcountries.com/v3.1/name/"+chosenCountry+"?fullText=true'");
  fetch(finalURL).then((response) => response.json()).then((data) => {
    console.log(finalURL)
    eval("document.getElementById('flagImg').src='"+data[0].flags.svg+"'");
    eval("document.getElementById('name').innerHTML='"+data[0].name.common+"'");
    eval("document.getElementById('population').innerHTML='Population: "+data[0].population+"'");
    eval("document.getElementById('regionI').innerHTML='Region: "+data[0].region+"'");
    eval("document.getElementById('subRegion').innerHTML='Sub Region: "+data[0].subregion+"'");
    eval("document.getElementById('capital').innerHTML='Capital: "+data[0].capital+"'");
    eval("document.getElementById('domain').innerHTML='Domain: "+data[0].tld+"'");
    eval("document.getElementById('currency').innerHTML='Currency: "+Object.values(data[0].currencies[Object.keys(data[0].currencies)].symbol)+"'");
    eval("document.getElementById('languages').innerHTML='Language(s): "+Object.values(data[0].languages).toString().split(",").join(", ")+"'");
    console.log(Object.values(data[0].borders[0]).toString().split(",").join(""));
    for(let i=0; i<Object.values(data[0].borders[0]).length; i++){
      eval("border"+i+"= document.createElement('div')");
      eval("border"+i+".classList.add('mt-2', 'border-2', 'flex', 'justify-center', 'items-center', 'w-16', 'h-8', 'transition', 'hover:scale-110')")
      eval("border"+i+".innerHTML='"+Object.values(data[0].borders[i]).toString().split(",").join("")+"'");
      eval("borders.appendChild(border"+i+")");
      eval("border"+i+".setAttribute('id', 'border"+i+"')");
      eval("finalURL = 'https://restcountries.com/v3.1/alpha/"+Object.values(data[0].borders[i]).toString().split(",").join("")+"'");
      fetch(finalURL).then((response) => response.json()).then((data) => {
        eval("border"+i+".onclick = function(){localStorage.setItem('clickedOn', '"+data[0].name.common+"')}");
      });
      eval("borderLink"+i+"= document.createElement('div')");
      eval("borderLink"+i+".classList.add('absolute', 'w-full', 'h-full')");
      eval("border"+i+".appendChild(borderLink"+i+")");
      eval("borderLink"+i+".onclick = function(){window.location.href='./details.html'}");
    }
    document.getElementById("border0").classList.add("ml-4")
  });
}

function darkMode(){
  document.getElementById("nav").classList.toggle('bg-darkBlue');
  document.getElementById("nav").classList.toggle('border-0');
  document.getElementById("searchBar").classList.toggle('border-0');
  document.getElementById("region").classList.toggle('border-0');
  document.getElementById("nav").classList.toggle('text-veryLightGray');
  document.getElementById("searchBar").classList.toggle('bg-darkBlue');
  document.getElementById("search").classList.toggle('bg-darkBlue');
  document.getElementById("but").classList.toggle('bg-darkBlue');
  document.getElementById("but").classList.toggle('text-veryLightGray');
  document.getElementById("region").classList.toggle('bg-darkBlue');
  document.getElementById("main").classList.toggle('bg-veryDarkBlue');
  document.getElementById("main").classList.toggle('text-veryLightGray');
  document.getElementById("flagImg").classList.toggle('border-0');

  for(let i=0; i<countries.length; i++){
    eval("div"+i+".classList.toggle('bg-darkBlue')");
    eval("div"+i+".classList.toggle('text-white')");
    //eval("divFlag"+i+".classList.toggle('border-0')");
  }

  if(localStorage.getItem("darkMode") != true)
    localStorage.setItem("darkMode", true)
  else
    localStorage.setItem("darkMode", false)
}
