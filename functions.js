import { fetchDrugs, fetchRadiopharmaceuticals, fetchAllergens, askOpenAI } from './api.js';

// API endpoint'leri
const drugsUrl = "https://nzbjdivwzf.execute-api.eu-north-1.amazonaws.com/prod/drugs";
const radioUrl = "https://nzbjdivwzf.execute-api.eu-north-1.amazonaws.com/prod/radiopharmaceutical";
const allergenUrl = "https://nzbjdivwzf.execute-api.eu-north-1.amazonaws.com/prod/allergens";

// Global state objects
window.drugState = {
    currentPage: 1,
    itemsPerPage: 12,
    cachedData: null,
    isLoading: false
};

window.radioState = {
    currentPage: 1,
    itemsPerPage: 12,
    cachedData: null
};

window.allergenState = {
    currentPage: 1,
    itemsPerPage: 12,
    cachedData: null
};

// İlaç verilerini yükle
async function initializeCache() {
    try {
        if (window.drugState.isLoading) {
            console.log('Already loading data...');
            return;
        }

        window.drugState.isLoading = true;
        
        // İlk 1000 veriyi yükle
        const url = `${drugsUrl}?drugsId=all&limit=1000`;
        const initialResponse = await axios.get(url);
        
        if (!initialResponse.data || !initialResponse.data.items) {
                throw new Error('No data received from API');
            }
            
        window.drugState.cachedData = initialResponse.data.items;
        console.log('Initial data loaded:', window.drugState.cachedData.length);
        
        getDrugs(1);
        
        // Geri kalan verileri arka planda yükle
        loadRemainingDataInBackground(initialResponse.data.lastEvaluatedKey);
        
        await updateStatistics(); // İstatistikleri güncelle
        
    } catch (error) {
        console.error("Error initializing cache:", error);
        showError('Failed to load initial data. Please refresh the page.');
    } finally {
        window.drugState.isLoading = false;
    }
}

// Geri kalan ilaç verilerini arka planda yükle
async function loadRemainingDataInBackground(lastEvaluatedKey) {
    try {
        while (lastEvaluatedKey) {
            const url = `${drugsUrl}?drugsId=all&limit=1000&lastEvaluatedKey=${encodeURIComponent(JSON.stringify(lastEvaluatedKey))}`;
            const response = await axios.get(url);
            
            if (!response.data || !response.data.items) {
                break;
            }
            
            window.drugState.cachedData = [...window.drugState.cachedData, ...response.data.items];
            console.log('Updated cache size:', window.drugState.cachedData.length);
            
            // Her veri güncellemesinde istatistikleri güncelle
            await updateStatistics();
            
            getDrugs(1);
            lastEvaluatedKey = response.data.lastEvaluatedKey;
        }
        
        console.log('All data loaded:', window.drugState.cachedData.length);
        
    } catch (error) {
        console.error('Error loading remaining data:', error);
    }
}

// İlaçları göster
function getDrugs(page = 1) {
    const dataList = document.querySelector('#table1 tbody');
    if (!dataList) return;

    dataList.innerHTML = '';
    const startIndex = (page - 1) * window.drugState.itemsPerPage;
    const endIndex = startIndex + window.drugState.itemsPerPage;
    const pageData = window.drugState.cachedData.slice(startIndex, endIndex);

    pageData.forEach(item => {
            const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                <button onclick='viewProspectus(${JSON.stringify(item).replace(/'/g, "\\'")})'
                        class="text-blue-600 hover:text-blue-800">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                </button>
            </td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${item.BARKOD || '-'}</td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">${item['ÜRÜN ADI'] || '-'}</td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${item['ETKEN MADDE'] || item['ETKİN MADDE'] || '-'}</td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${item['ATC KODU'] || '-'}</td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${item['RUHSAT SAHİBİ'] || '-'}</td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${item['RUHSAT TARİHİ'] ? new Date(item['RUHSAT TARİHİ']).toLocaleDateString() : '-'}</td>
        `;
            dataList.appendChild(row);
        });

    window.drugState.currentPage = page;
    updatePageNumbers();
}

// Hata gösterme fonksiyonu
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Radyofarmasötik verilerini yükle
async function loadRadioData(page = 1) {
    const dataList = document.querySelector('#table2 tbody');
    if (!dataList) return;

    try {
        // Loading göster
        dataList.innerHTML = `
            <tr>
                <td colspan="3" class="px-6 py-4 text-center">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    Veriler yükleniyor...
                </td>
            </tr>
        `;

        // Veriyi çek (eğer cache'de yoksa)
        if (!window.radioState.cachedData) {
            const response = await axios.get('https://nzbjdivwzf.execute-api.eu-north-1.amazonaws.com/prod/radiopharmaceutical?radiopharmaId=all');
            if (!response.data) throw new Error('Veri alınamadı');
            window.radioState.cachedData = response.data;
            await updateStatistics();
        }

        // Sayfalama için veriyi böl
        const startIndex = (page - 1) * window.radioState.itemsPerPage;
        const endIndex = startIndex + window.radioState.itemsPerPage;
        const pageData = window.radioState.cachedData.slice(startIndex, endIndex);

        // Tabloyu güncelle
        dataList.innerHTML = '';
        pageData.forEach(item => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.Etkin_Madde || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.Firma_Adi || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.Urun_Adi || '-'}</td>
            `;
            dataList.appendChild(row);
        });

        // Sayfalama butonlarını güncelle
        setupRadioPagination(window.radioState.cachedData.length, page);
        window.radioState.currentPage = page;
        updatePageNumbers();

    } catch (error) {
        console.error('Radyofarmasötik veri yükleme hatası:', error);
        dataList.innerHTML = `
            <tr>
                <td colspan="3" class="px-6 py-4 text-center text-red-500">
                    Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
                </td>
            </tr>
        `;
    }
}

// Radyofarmasötik sayfalama butonlarını oluştur
function setupRadioPagination(totalItems, currentPage) {
    const pagination = document.getElementById('radioPagination');
    if (!pagination) return;

    const totalPages = Math.ceil(totalItems / window.radioState.itemsPerPage);
    pagination.innerHTML = '';

    const buttonClass = 'px-3 py-1 mx-1 rounded';
    const activeClass = 'bg-blue-500 text-white';
    const inactiveClass = 'bg-white text-blue-500 hover:bg-blue-100';
    const disabledClass = 'bg-gray-100 text-gray-400 cursor-not-allowed';

    // İlk sayfa butonu
    const firstPageButton = document.createElement('button');
    firstPageButton.innerHTML = "<<";
    firstPageButton.className = `${buttonClass} ${currentPage === 1 ? disabledClass : inactiveClass}`;
    if (currentPage !== 1) {
        firstPageButton.addEventListener('click', () => loadRadioData(1));
    }
    pagination.appendChild(firstPageButton);

    // Önceki sayfa butonu
    const prevPageButton = document.createElement('button');
    prevPageButton.innerHTML = "<";
    prevPageButton.className = `${buttonClass} ${currentPage === 1 ? disabledClass : inactiveClass}`;
    if (currentPage > 1) {
        prevPageButton.addEventListener('click', () => loadRadioData(currentPage - 1));
    }
    pagination.appendChild(prevPageButton);

    // Sayfa numarası
    const pageNumber = document.createElement('span');
    pageNumber.innerHTML = `${currentPage} / ${totalPages}`;
    pageNumber.className = `${buttonClass} ${activeClass}`;
    pagination.appendChild(pageNumber);

    // Sonraki sayfa butonu
    const nextPageButton = document.createElement('button');
    nextPageButton.innerHTML = ">";
    nextPageButton.className = `${buttonClass} ${currentPage >= totalPages ? disabledClass : inactiveClass}`;
    if (currentPage < totalPages) {
        nextPageButton.addEventListener('click', () => loadRadioData(currentPage + 1));
    }
    pagination.appendChild(nextPageButton);

    // Son sayfa butonu
    const lastPageButton = document.createElement('button');
    lastPageButton.innerHTML = ">>";
    lastPageButton.className = `${buttonClass} ${currentPage >= totalPages ? disabledClass : inactiveClass}`;
    if (currentPage !== totalPages) {
        lastPageButton.addEventListener('click', () => loadRadioData(totalPages));
    }
    pagination.appendChild(lastPageButton);
}

// Alerjen verilerini yükle
async function loadAllergenData(page = 1) {
    const dataList = document.querySelector('#table3 tbody');
    if (!dataList) return;

    try {
        // Loading göster
        dataList.innerHTML = `
            <tr>
                <td colspan="3" class="px-6 py-4 text-center">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    Veriler yükleniyor...
                </td>
            </tr>
        `;

        // Veriyi çek (eğer cache'de yoksa)
        if (!window.allergenState.cachedData) {
            const response = await axios.get('https://nzbjdivwzf.execute-api.eu-north-1.amazonaws.com/prod/allergens?allergensId=all');
            if (!response.data) throw new Error('Veri alınamadı');
            window.allergenState.cachedData = response.data;
            await updateStatistics();
        }

        // Sayfalama için veriyi böl ve ters çevir
        const reversedData = [...window.allergenState.cachedData].reverse();
        const startIndex = (page - 1) * window.allergenState.itemsPerPage;
        const endIndex = startIndex + window.allergenState.itemsPerPage;
        const pageData = reversedData.slice(startIndex, endIndex);

        // Tabloyu güncelle
        dataList.innerHTML = '';
        pageData.forEach(item => {
        const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.Etkin_Madde || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.Firma_Adi || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.Urun_Adi || '-'}</td>
            `;
        dataList.appendChild(row);
    });

        // Sayfalama butonlarını güncelle
        setupAllergenPagination(window.allergenState.cachedData.length, page);
        window.allergenState.currentPage = page;
        updatePageNumbers();

    } catch (error) {
        console.error('Alerjen veri yükleme hatası:', error);
        dataList.innerHTML = `
            <tr>
                <td colspan="3" class="px-6 py-4 text-center text-red-500">
                    Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
            </td>
        </tr>
    `;
    }
}

// Sayfalama butonlarını oluştur - Alerjenler için
function setupAllergenPagination(totalItems, currentPage) {
    const pagination = document.getElementById('allergenPagination');
    if (!pagination) return;

    const totalPages = Math.ceil(totalItems / window.allergenState.itemsPerPage);
    pagination.innerHTML = '';

    const buttonClass = 'px-3 py-1 mx-1 rounded';
    const activeClass = 'bg-blue-500 text-white';
    const inactiveClass = 'bg-white text-blue-500 hover:bg-blue-100';
    const disabledClass = 'bg-gray-100 text-gray-400 cursor-not-allowed';

    // İlk sayfa butonu
    const firstPageButton = document.createElement('button');
    firstPageButton.innerHTML = "<<";
    firstPageButton.className = `${buttonClass} ${currentPage === 1 ? disabledClass : inactiveClass}`;
    firstPageButton.addEventListener('click', () => loadAllergenData(1));
    pagination.appendChild(firstPageButton);

    // Önceki sayfa butonu
    const prevPageButton = document.createElement('button');
    prevPageButton.innerHTML = "<";
    prevPageButton.className = `${buttonClass} ${currentPage === 1 ? disabledClass : inactiveClass}`;
    if (currentPage > 1) {
        prevPageButton.addEventListener('click', () => loadAllergenData(currentPage - 1));
    }
    pagination.appendChild(prevPageButton);

    // Mevcut sayfa
    const pageLink = document.createElement('button');
    pageLink.innerHTML = currentPage;
    pageLink.className = `${buttonClass} ${activeClass}`;
    pagination.appendChild(pageLink);

    // Sonraki sayfa butonu
    const nextPageButton = document.createElement('button');
    nextPageButton.innerHTML = ">";
    nextPageButton.className = `${buttonClass} ${currentPage >= totalPages ? disabledClass : inactiveClass}`;
    if (currentPage < totalPages) {
        nextPageButton.addEventListener('click', () => loadAllergenData(currentPage + 1));
    }
    pagination.appendChild(nextPageButton);

    // Son sayfa butonu
    const lastPageButton = document.createElement('button');
    lastPageButton.innerHTML = ">>";
    lastPageButton.className = `${buttonClass} ${currentPage >= totalPages ? disabledClass : inactiveClass}`;
    lastPageButton.addEventListener('click', () => loadAllergenData(totalPages));
    pagination.appendChild(lastPageButton);
}

// Chatbot fonksiyonları
window.toggleChat = function() {
    const chatbox = document.getElementById('chatbox');
    const chatButton = document.getElementById('chatButton');
    
    if (chatbox.style.display === 'none') {
        chatbox.style.display = 'block';
        chatButton.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        `;
    } else {
        chatbox.style.display = 'none';
        chatButton.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
        `;
    }
};

window.sendMessage = async function() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    if (!message) return;

    const chatMessages = document.getElementById('chatMessages');
    
    // Kullanıcı mesajını ekle
    chatMessages.innerHTML += `
        <div class="flex justify-end mb-3">
            <div class="bg-blue-500 text-white rounded-lg py-2 px-4 max-w-[70%]">
                ${message}
            </div>
        </div>
    `;

    messageInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // Loading göster
        chatMessages.innerHTML += `
            <div class="flex justify-start mb-3" id="loadingMessage">
                <div class="bg-gray-200 rounded-lg py-2 px-4">
                    <div class="animate-pulse">Yanıt yazılıyor...</div>
                        </div>
            </div>
        `;

        // API'den yanıt al
        const response = await askOpenAI(message);

        // Loading mesajını kaldır
        const loadingMessage = document.getElementById('loadingMessage');
        if (loadingMessage) loadingMessage.remove();

        // Bot yanıtını ekle
        chatMessages.innerHTML += `
            <div class="flex justify-start mb-3">
                <div class="bg-gray-200 rounded-lg py-2 px-4 max-w-[70%]">
                    ${response}
                </div>
            </div>
        `;

        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        console.error('Mesaj gönderme hatası:', error);
        alert('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
    }
};

// Fonksiyonları window objesine ata
window.initializeCache = initializeCache;
window.getDrugs = getDrugs;
window.loadRadioData = loadRadioData;
window.loadAllergenData = loadAllergenData;

// showTable fonksiyonunu güncelle
window.showTable = async function(tableId) {
    console.log('showTable çağrıldı:', tableId);
    
    // Önce tüm tabloları gizle
    ["table1", "table2", "table3"].forEach(id => {
        const table = document.getElementById(id);
        if (table) table.style.display = "none";
    });

    // Seçilen tabloyu göster
    const selectedTable = document.getElementById(tableId);
    if (selectedTable) {
        selectedTable.style.display = "block";
        
        // Her tablo için kendi veri yükleme fonksiyonunu çağır
        switch(tableId) {
            case 'table1':
                if (!window.drugState.cachedData) {
                    await initializeCache();
            } else {
                    getDrugs(1);
                }
                break;
            case 'table2':
                await loadRadioData();
                break;
            case 'table3':
                await loadAllergenData();
                break;
        }
    }
    await updateStatistics(); // İstatistikleri güncelle
}

// Prospektüs görüntüleme fonksiyonu
window.viewProspectus = async function(drugData) {
    let loadingWindow;
    try {
        // Yeni pencere aç
        loadingWindow = window.open('', '_blank', 'width=800,height=800');
        
        // Temel HTML yapısını oluştur
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>İlaç Prospektüsü - ${drugData['ÜRÜN ADI']}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        line-height: 1.6; 
                        margin: 0; 
                        padding: 20px;
                        background-color: #f0f9ff;
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        background-color: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    h1 { 
                        color: #1e40af;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #1e40af;
                    }
                    .info-box {
                        background-color: #f3f4f6;
                        padding: 15px;
                        border-radius: 4px;
                        margin-bottom: 20px;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #4b5563;
                    }
                    .section {
                        margin-bottom: 20px;
                    }
                    .section h2 {
                        color: #1e40af;
                        font-size: 1.2em;
                        margin-bottom: 10px;
                    }
                    .note {
                        background-color: #fee2e2;
                        padding: 15px;
                        border-radius: 4px;
                        margin-top: 20px;
                    }
                    .buttons {
                        margin-top: 20px;
                        text-align: center;
                    }
                    button {
                        padding: 8px 16px;
                        margin: 0 5px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: bold;
                    }
                    .print-btn {
                        background-color: #2563eb;
                        color: white;
                    }
                    .print-btn:hover {
                        background-color: #1d4ed8;
                    }
                    .close-btn {
                        background-color: #6b7280;
                        color: white;
                    }
                    .close-btn:hover {
                        background-color: #4b5563;
                    }
                    ul {
                        list-style-type: disc;
                        padding-left: 20px;
                    }
                    @media print {
                        body { 
                            background-color: white;
                            padding: 0;
                        }
                        .container {
                            box-shadow: none;
                        }
                        .buttons {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>${drugData['ÜRÜN ADI']}</h1>
                    
                    <div class="info-box">
                        <p><span class="info-label">Etken Madde:</span> ${drugData['ETKEN MADDE'] || drugData['ETKİN MADDE'] || '-'}</p>
                        <p><span class="info-label">Ruhsat Sahibi:</span> ${drugData['RUHSAT SAHİBİ'] || '-'}</p>
                    </div>

                    <div class="section">
                        <h2>1. İlacın Tanımı</h2>
                        <p>${drugData['ÜRÜN ADI']}, ${drugData['ETKEN MADDE'] || drugData['ETKİN MADDE']} etken maddesini içeren, 
                        ${drugData['RUHSAT SAHİBİ']} firması tarafından üretilen bir ilaçtır.</p>
                    </div>

                    <div class="section">
                        <h2>2. Kullanım Alanları</h2>
                        <ul>
                            <li>Doktorunuzun belirttiği hastalıkların tedavisinde kullanılır</li>
                            <li>Kesin kullanım alanları için doktorunuza danışınız</li>
                        </ul>
                    </div>

                    <div class="section">
                        <h2>3. Kullanım Şekli ve Dozu</h2>
                        <ul>
                            <li>İlacı mutlaka doktorunuzun önerdiği şekilde kullanınız</li>
                            <li>Önerilen dozu aşmayınız</li>
                            <li>Tedavi süresince doktorunuzun kontrolünde kullanınız</li>
                            <li>İlacı düzenli olarak kullanınız</li>
                        </ul>
                    </div>

                    <div class="section">
                        <h2>4. Olası Yan Etkiler</h2>
                        <ul>
                            <li>Her ilaçta olduğu gibi bu ilacın da yan etkileri olabilir</li>
                            <li>Herhangi bir yan etki görmeniz durumunda doktorunuza başvurunuz</li>
                            <li>Alerjik reaksiyon belirtileri görürseniz ilacı kullanmayı bırakıp hemen doktorunuza danışınız</li>
                        </ul>
                    </div>

                    <div class="section">
                        <h2>5. Saklama Koşulları</h2>
                        <ul>
                            <li>İlacı 25°C'nin altındaki oda sıcaklığında saklayınız</li>
                            <li>Çocukların göremeyeceği ve erişemeyeceği yerlerde saklayınız</li>
                            <li>Son kullanma tarihi geçmiş ilaçları kullanmayınız</li>
                            <li>Orijinal ambalajında saklayınız</li>
                        </ul>
                    </div>

                    <div class="note">
                        <strong>ÖNEMLİ NOT:</strong> Bu bilgiler genel bilgilendirme amaçlıdır. 
                        Her hasta için özel durumlar olabileceğinden, ilacın kullanımı konusunda 
                        mutlaka doktorunuzun önerilerine uyunuz.
                    </div>

                    <div class="buttons">
                        <button class="print-btn" onclick="window.print()">Yazdır</button>
                        <button class="close-btn" onclick="window.close()">Kapat</button>
                    </div>
                </div>
            </body>
            </html>
        `;

        // HTML içeriğini yeni pencereye yaz
        loadingWindow.document.write(html);
        loadingWindow.document.close();

    } catch (error) {
        console.error('Prospektüs görüntüleme hatası:', error);
        if (loadingWindow) {
            loadingWindow.close();
        }
        alert('Prospektüs görüntülenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
}

// DOM yüklendiğinde chat fonksiyonlarını başlat
document.addEventListener('DOMContentLoaded', function() {
    initializeChat();
});

// Chat fonksiyonlarını başlat
function initializeChat() {
    const chatButton = document.getElementById('chat-button');
    const chatContainer = document.getElementById('chat-container');
    const closeChat = document.getElementById('close-chat');
    const chatForm = document.getElementById('chat-form');

    // Chat butonuna tıklama olayı
    chatButton.addEventListener('click', function() {
        if (chatContainer.classList.contains('hidden')) {
            chatContainer.classList.remove('hidden');
        } else {
            chatContainer.classList.add('hidden');
        }
    });

    // Kapatma butonuna tıklama olayı
    closeChat.addEventListener('click', function() {
        chatContainer.classList.add('hidden');
    });

    // Form gönderme olayı
    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Mesajı göster
        addMessageToChat('user', message);
        input.value = '';

        try {
            // Bot yanıtını al
            const response = await askOpenAI(message);
            addMessageToChat('bot', response);
        } catch (error) {
            console.error('Chat hatası:', error);
            addMessageToChat('error', 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.');
        }
    });
}

// Mesajı sohbete ekle
function addMessageToChat(type, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    
    if (type === 'user') {
        messageDiv.className = 'flex items-start justify-end space-x-2 mb-4';
        messageDiv.innerHTML = `
            <div class="bg-blue-600 text-white rounded-lg p-3 max-w-[80%]">
                <p class="text-sm">${message}</p>
            </div>
        `;
    } else if (type === 'bot') {
        messageDiv.className = 'flex items-start space-x-2 mb-4';
        messageDiv.innerHTML = `
            <div class="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <p class="text-sm">${message}</p>
            </div>
        `;
        } else {
        messageDiv.className = 'flex items-start space-x-2 mb-4';
        messageDiv.innerHTML = `
            <div class="bg-red-100 text-red-600 rounded-lg p-3 max-w-[80%]">
                <p class="text-sm">${message}</p>
            </div>
        `;
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Sayfa numaralarını güncelle
function updatePageNumbers() {
    const currentPageSpan = document.getElementById('currentPage');
    if (currentPageSpan) {
        currentPageSpan.textContent = window.drugState.currentPage;
    }

    const radioCurrentPageSpan = document.getElementById('radioCurrentPage');
    if (radioCurrentPageSpan) {
        radioCurrentPageSpan.textContent = window.radioState.currentPage;
    }

    const allergenCurrentPageSpan = document.getElementById('allergenCurrentPage');
    if (allergenCurrentPageSpan) {
        allergenCurrentPageSpan.textContent = window.allergenState.currentPage;
    }
}

// İstatistikleri güncelle
async function updateStatistics() {
    try {
        // İlaç verileri için istatistikler
        if (window.drugState.cachedData) {
            // Toplam ilaç sayısı
            document.querySelector('[data-stat="total-drugs"]').textContent = 
                window.drugState.cachedData.length;

            // Benzersiz etken madde sayısı
            const uniqueIngredients = new Set();
            window.drugState.cachedData.forEach(drug => {
                const ingredient = drug['ETKEN MADDE'] || drug['ETKİN MADDE'];
                if (ingredient) uniqueIngredients.add(ingredient);
            });
            document.querySelector('[data-stat="unique-ingredients"]').textContent = 
                uniqueIngredients.size;

            // Benzersiz firma sayısı
            const uniqueCompanies = new Set();
            window.drugState.cachedData.forEach(drug => {
                if (drug['RUHSAT SAHİBİ']) uniqueCompanies.add(drug['RUHSAT SAHİBİ']);
            });
            document.querySelector('[data-stat="unique-companies"]').textContent = 
                uniqueCompanies.size;
        }

        // Radyofarmasötik verileri için istatistikler
        if (!window.radioState.cachedData) {
            const response = await axios.get('https://nzbjdivwzf.execute-api.eu-north-1.amazonaws.com/prod/radiopharmaceutical?radiopharmaId=all');
            window.radioState.cachedData = response.data;
        }
        document.querySelector('[data-stat="radio-count"]').textContent = 
            window.radioState.cachedData.length;

        // Alerjen verileri için istatistikler
        if (!window.allergenState.cachedData) {
            const response = await axios.get('https://nzbjdivwzf.execute-api.eu-north-1.amazonaws.com/prod/allergens?allergensId=all');
            window.allergenState.cachedData = response.data;
        }
        document.querySelector('[data-stat="allergen-count"]').textContent = 
            window.allergenState.cachedData.length;

    } catch (error) {
        console.error('İstatistikler güncellenirken hata:', error);
    }
}

// Arama fonksiyonları
let searchTimeout = null;
let searchCache = new Map();

// Arama önerilerini göster
function showSearchSuggestions(searchTerm) {
    const suggestionsList = document.getElementById('searchSuggestions');
    if (!suggestionsList) return;

    // Arama terimi boşsa önerileri gizle
    if (!searchTerm.trim()) {
        suggestionsList.innerHTML = '';
        suggestionsList.classList.add('hidden');
        return;
    }

    // Cache'den sonuçları al veya hesapla
    let suggestions;
    if (searchCache.has(searchTerm)) {
        suggestions = searchCache.get(searchTerm);
    } else {
        suggestions = window.drugState.cachedData
            .filter(drug => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    (drug['ÜRÜN ADI'] || '').toLowerCase().includes(searchLower) ||
                    (drug['ETKEN MADDE'] || drug['ETKİN MADDE'] || '').toLowerCase().includes(searchLower) ||
                    (drug['RUHSAT SAHİBİ'] || '').toLowerCase().includes(searchLower)
                );
            })
            .slice(0, 5); // Sadece ilk 5 öneriyi göster
        searchCache.set(searchTerm, suggestions);
    }

    // Önerileri göster
    suggestionsList.innerHTML = suggestions
        .map(drug => `
            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                onclick="selectSuggestion('${drug['ÜRÜN ADI'].replace(/'/g, "\\'")}')">
                <div class="font-medium">${drug['ÜRÜN ADI']}</div>
                <div class="text-sm text-gray-600">
                    ${drug['ETKEN MADDE'] || drug['ETKİN MADDE'] || '-'} | ${drug['RUHSAT SAHİBİ'] || '-'}
                </div>
            </li>
        `)
        .join('');

    suggestionsList.classList.remove('hidden');
}

// Öneri seçildiğinde
window.selectSuggestion = function(drugName) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = drugName;
        document.getElementById('searchSuggestions').classList.add('hidden');
        performSearch(drugName);
    }
};

// Arama yap
function performSearch(searchTerm) {
    if (!searchTerm.trim()) {
        // Arama terimi boşsa tüm verileri göster
        const activeTable = document.querySelector('.tabcontent[style*="display: block"]');
        if (activeTable) {
            switch(activeTable.id) {
                case 'table1':
                    getDrugs(1);
                    break;
                case 'table2':
                    loadRadioData(1);
                    break;
                case 'table3':
                    loadAllergenData(1);
                    break;
            }
        }
            return;
        }

    // Aktif tabloyu bul
    const activeTable = document.querySelector('.tabcontent[style*="display: block"]');
    if (!activeTable) return;

    const searchLower = searchTerm.toLowerCase();
    let filteredData = [];

    // Hangi tablonun aktif olduğuna göre arama yap
    switch(activeTable.id) {
        case 'table1':
            // İlaçlar tablosu araması
            filteredData = window.drugState.cachedData.filter(drug => (
                (drug['ÜRÜN ADI'] || '').toLowerCase().includes(searchLower) ||
                (drug['ETKEN MADDE'] || drug['ETKİN MADDE'] || '').toLowerCase().includes(searchLower) ||
                (drug['RUHSAT SAHİBİ'] || '').toLowerCase().includes(searchLower)
            ));
            displayDrugResults(filteredData);
            break;

        case 'table2':
            // Radyofarmasötik tablosu araması
            filteredData = window.radioState.cachedData.filter(item => (
                (item.Urun_Adi || '').toLowerCase().includes(searchLower) ||
                (item.Etkin_Madde || '').toLowerCase().includes(searchLower) ||
                (item.Firma_Adi || '').toLowerCase().includes(searchLower)
            ));
            displayRadioResults(filteredData);
            break;

        case 'table3':
            // Alerjen tablosu araması
            filteredData = window.allergenState.cachedData.filter(item => (
                (item.Urun_Adi || '').toLowerCase().includes(searchLower) ||
                (item.Etkin_Madde || '').toLowerCase().includes(searchLower) ||
                (item.Firma_Adi || '').toLowerCase().includes(searchLower)
            ));
            displayAllergenResults(filteredData);
            break;
    }
}

// İlaç sonuçlarını göster
function displayDrugResults(filteredData) {
    const dataList = document.querySelector('#table1 tbody');
    if (!dataList) return;

    dataList.innerHTML = '';
    if (filteredData.length === 0) {
        dataList.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                    Sonuç bulunamadı
                </td>
            </tr>
        `;
        return;
    }

    filteredData.forEach(item => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
            <td class="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                <button onclick='viewProspectus(${JSON.stringify(item).replace(/'/g, "\\'")})'
                        class="text-blue-600 hover:text-blue-800">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                </button>
            </td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${item.BARKOD || '-'}</td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">${item['ÜRÜN ADI'] || '-'}</td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${item['ETKEN MADDE'] || item['ETKİN MADDE'] || '-'}</td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${item['ATC KODU'] || '-'}</td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${item['RUHSAT SAHİBİ'] || '-'}</td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${item['RUHSAT TARİHİ'] ? new Date(item['RUHSAT TARİHİ']).toLocaleDateString() : '-'}</td>
            `;
            dataList.appendChild(row);
        });
}

// Radyofarmasötik sonuçlarını göster
function displayRadioResults(filteredData) {
    const dataList = document.querySelector('#table2 tbody');
    if (!dataList) return;

    dataList.innerHTML = '';
    if (filteredData.length === 0) {
            dataList.innerHTML = `
                <tr>
                <td colspan="3" class="px-6 py-4 text-center text-gray-500">
                    Sonuç bulunamadı
                    </td>
                </tr>
            `;
        return;
    }

    filteredData.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.Etkin_Madde || '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.Firma_Adi || '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.Urun_Adi || '-'}</td>
        `;
        dataList.appendChild(row);
    });
}

// Alerjen sonuçlarını göster
function displayAllergenResults(filteredData) {
    const dataList = document.querySelector('#table3 tbody');
    if (!dataList) return;

    dataList.innerHTML = '';
    if (filteredData.length === 0) {
        dataList.innerHTML = `
            <tr>
                <td colspan="3" class="px-6 py-4 text-center text-gray-500">
                    Sonuç bulunamadı
                </td>
            </tr>
        `;
        return;
    }

    filteredData.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.Etkin_Madde || '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.Firma_Adi || '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.Urun_Adi || '-'}</td>
        `;
        dataList.appendChild(row);
    });
}

// Arama input event listener'ını ekle
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value;
            
            // Mevcut timeout'u temizle
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }

            // Yeni timeout ayarla
            searchTimeout = setTimeout(() => {
                showSearchSuggestions(searchTerm);
                performSearch(searchTerm);
            }, 300);
        });

        // Tıklama ile önerileri gizle
        document.addEventListener('click', function(e) {
            const suggestionsList = document.getElementById('searchSuggestions');
            if (suggestionsList && !searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
                suggestionsList.classList.add('hidden');
            }
        });
    }
});

// PDF görüntüleme fonksiyonu
window.viewDocumentation = function() {
    // Yeni pencerede PDF'i aç
    window.open('./assets/doc.pdf', '_blank');
};