template.innerHTML = `
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Footer Component</title>
    <link rel="stylesheet" href="../static/output.css" />
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  </head>
 <footer class="text-black py-8"> 
 	<div class="container mx-auto px-4"> 
 		<div class="flex flex-wrap justify-between"> 
 			<div class="w-full sm:w-1/2 md:w-1/3 mb-6"> 
 				<h2 class="font-bold text-xl pb-2">İletişim</h2> 
 				<hr class="border-black w-1/2 mb-2"> 
 					<p>afurkankurt@outlook.com</p> 
 					<p>+90 552 248 41 38</p> 
 					<div class="w-full sm:w-1/2 md:w-1/3 mb-6 flex justify-end space-x-4"> <a href="https://www.facebook.com" target="_blank" class="text-black hover:text-blue-600"> <i class="fa fa-facebook-official fa-2x"></i> </a> <a href="https://www.twitter.com" target="_blank" class="text-black hover:text-blue-400"> <i class="fa fa-twitter fa-2x"></i> </a> <a href="https://www.linkedin.com" target="_blank" class="text-black hover:text-blue-700"> <i class="fa fa-linkedin-square fa-2x"></i> </a> <a href="https://www.instagram.com" target="_blank" class="text-black hover:text-purple-600"> <i class="fa fa-instagram fa-2x"></i> </a> </div>
 			</div> 
 			<div class="w-full sm:w-1/2 md:w-1/3 mb-6 text-center md:text-right grid place-items-end"> 
				<h2 class="font-bold text-xl pb-2">Bağlantılar</h2> 
				<hr class="border-black w-1/2 mb-2">
				<ul> 
				<li>
                  <a href="#" class="text-blue-400 hover:text-blue-200">Privacy Policy</a>
				</li> 
				<li>
			        <a href="#" class="text-blue-400 hover:text-blue-200">Terms of Service</a>
				</li> 
				<li>
				    <a href="#" class="text-blue-400 hover:text-blue-200">Support</a>
				</li> 
				</ul> 
				</div> 
				</div> 
				<div class="text-center pt-4 border-t border-black mt-4"> 
				<p>&copy; 2024 [Şirket Adı]. Tüm hakları saklıdır.</p> 
				</div> 
				</div> 
				</footer> 
`;

class customFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(template.content.cloneNode(true));
  }
}

customElements.define("custom-footer", customFooter);
