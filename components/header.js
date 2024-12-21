class CustomHeader extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<header class="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
				<div class="container mx-auto px-4 py-6">
					<div class="flex justify-between items-center">
						<div class="flex items-center space-x-4">
							<img src="assets/logo.png" alt="Logo" class="h-16 w-auto"/>
							<div>
								<h1 class="text-2xl font-bold">Prospektüse Bak</h1>
								<p class="text-blue-200 text-sm">Türkiye'nin En Güncel İlaç ve Tıbbi Ürün Sorgu Sistemi</p>
							</div>
						</div>
						
						<nav class="hidden md:flex space-x-8">
							<a href="index.html" class="hover:text-blue-200 transition-colors duration-200 flex items-center space-x-1">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
								</svg>
								<span>Ana Sayfa</span>
							</a>
							<a href="#" class="hover:text-blue-200 transition-colors duration-200 flex items-center space-x-1">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0012.586 3H9"/>
								</svg>
								<span>Dokümanlar</span>
							</a>
							<a href="about.html" class="hover:text-blue-200 transition-colors duration-200 flex items-center space-x-1">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
								</svg>
								<span>Hakkımızda</span>
							</a>
							<a href="#" class="hover:text-blue-200 transition-colors duration-200 flex items-center space-x-1">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
								</svg>
								<span>İletişim</span>
							</a>
						</nav>
					</div>
				</div>
			</header>
		`;
	}
}

customElements.define('custom-header', CustomHeader);
