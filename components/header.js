class Header extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.innerHTML = `
			<header class="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
				<nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div class="flex items-center justify-between h-16">
						<div class="flex items-center justify-between w-full">
							<a class="flex-shrink-0" href="index.html">
								<img class="h-8 sm:h-12 w-auto" src="assets/logo.png" alt="Logo">
							</a>
							<div class="hidden md:block">
								<div class="flex items-baseline space-x-6">
									<a href="index.html" 
									   class="text-gray-600 hover:text-blue-600 px-6 py-2 rounded-md text-sm font-medium">
										Ana Sayfa
									</a>
									<a href="about.html" 
									   class="text-gray-600 hover:text-blue-600 px-6 py-2 rounded-md text-sm font-medium">
										Hakkımızda
									</a>
									<button id="docsButton"
											class="text-gray-600 hover:text-blue-600 px-6 py-2 rounded-md text-sm font-medium">
										Dokümanlar
									</button>
								</div>
							</div>
							<div class="md:hidden">
								<button id="mobileMenuButton" type="button" 
										class="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
									<span class="sr-only">Menüyü aç</span>
									<svg id="menuIcon" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
									</svg>
									<svg id="closeIcon" class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
						</div>
					</div>

					<div id="mobileMenu" class="hidden md:hidden">
						<div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
							<a href="index.html" 
							   class="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
								Ana Sayfa
							</a>
							<a href="about.html" 
							   class="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
								Hakkımızda
							</a>
							<button id="mobileDocsButton"
									class="text-gray-600 hover:text-blue-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium">
								Dokümanlar
							</button>
						</div>
					</div>
				</nav>
			</header>
		`;

		const mobileMenuButton = this.querySelector('#mobileMenuButton');
		const mobileMenu = this.querySelector('#mobileMenu');
		const menuIcon = this.querySelector('#menuIcon');
		const closeIcon = this.querySelector('#closeIcon');
		const docsButton = this.querySelector('#docsButton');
		const mobileDocsButton = this.querySelector('#mobileDocsButton');

		if (mobileMenuButton) {
			mobileMenuButton.addEventListener('click', () => {
				const isMenuHidden = mobileMenu.classList.contains('hidden');
				mobileMenu.classList.toggle('hidden');
				menuIcon.classList.toggle('hidden', !isMenuHidden);
				closeIcon.classList.toggle('hidden', isMenuHidden);
			});
		}

		if (docsButton) {
			docsButton.onclick = () => window.viewDocumentation();
		}
		if (mobileDocsButton) {
			mobileDocsButton.onclick = () => window.viewDocumentation();
		}
	}
}

customElements.define('custom-header', Header);
