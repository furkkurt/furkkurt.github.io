const template = document.createElement('template');
template.innerHTML = `
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="stylesheet" href="../static/output.css" />
    <title>Header Component</title>
  </head>
  <body>
    <header class="flex items-center justify-between bg-transparent h-16">
      <!-- Logo -->
	  <img src="assets/firat.png" class="pl-2 pt-2 h-16" />
      <div class="font-custom1 text-blue-900 overflow-hidden mx-16 hidden justify-items-right lg:block [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
        <p class="animate-infinite-scroll w-screen whitespace-nowrap pl-128 text-xl grid justify-items-end">
        	TÜRKİYE'NİN EN GÜNCEL İLAÇ VE PROSPEKTÜS SORGU SİTESİ
        </p>
      </div>
      <!-- Menu Items -->
      <div class="justify-around space-x-4 pr-8 whitespace-nowrap text-xl font-bold transition">
        <a href="./index.html" class="text-black font-custom3 hover:text-blue-500 hover:scale-110 transition">Anasayfa</a>
        <a href="./about.html" class="text-black font-custom3 hover:text-blue-500 hover:scale-110 transition">Hakkımızda</a>
        <a href="./services.html" class="text-black font-custom3 hover:text-blue-500 hover:scale-110 transition">Hizmetler</a>
        <a href="./contact.html" class="text-black font-custom3 hover:text-blue-500 hover:scale-110 transition">İletişim</a>
      </div>
    
    </header>
  </body>
`;

class customHeader extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.append(template.content.cloneNode(true));
	}
}

customElements.define('custom-header', customHeader);
