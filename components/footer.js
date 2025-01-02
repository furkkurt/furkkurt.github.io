class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="bg-gray-900 text-white mt-20 h-full pb-4">
                <div class="container mx-auto px-4 py-12">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 class="text-lg font-semibold mb-4">Hakkımızda</h3>
                            <p class="text-gray-400 text-sm">
                                İlaç Bilgi Sistemi, Türkiye'deki ilaçlar hakkında kapsamlı bilgi sunan resmi bir platformdur.
                            </p>
                        </div>
                        
                        <div>
                            <h3 class="text-lg font-semibold mb-4">Hızlı Erişim</h3>
                            <ul class="space-y-2 text-gray-400 text-sm">
                                <li><a href="#" class="hover:text-blue-400 transition-colors duration-200">Ana Sayfa</a></li>
                                <li><a href="#" class="hover:text-blue-400 transition-colors duration-200">İlaç Sorgula</a></li>
                                <li><a href="#" class="hover:text-blue-400 transition-colors duration-200">Dokümanlar</a></li>
                                <li><a href="#" class="hover:text-blue-400 transition-colors duration-200">SSS</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 class="text-lg font-semibold mb-4">İletişim</h3>
                            <ul class="space-y-2 text-gray-400 text-sm">
                                <li class="flex items-center space-x-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                    </svg>
                                    <span>0552 248 41 38</span>
                                </li>
                                <li class="flex items-center space-x-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                    </svg>
                                    <span>prospektusebak@gmail.com</span>
                                </li>
                            </ul>
                        </div>
                        
                    <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                        <p>&copy; ${new Date().getFullYear()} İlaç Bilgi Sistemi. Tüm hakları saklıdır.</p>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('custom-footer', CustomFooter);
