import { fetchDrugs, fetchRadiopharmaceuticals, fetchAllergens, askOpenAI } from './api.js';

// API endpoint'leri
const drugsUrl = "https://nzbjdivwzf.execute-api.eu-north-1.amazonaws.com/prod/drugs";
const radioUrl = "https://nzbjdivwzf.execute-api.eu-north-1.amazonaws.com/prod/radiopharmaceutical";
const allergenUrl = "https://nzbjdivwzf.execute-api.eu-north-1.amazonaws.com/prod/allergens";

let currentPage = 1;
const itemsPerPage = 12;
let cachedData = null;
let isLoading = false;
let debounceTimeout;
let statsData = {
    totalDrugs: 0,
    uniqueIngredients: 0,
    uniqueCompanies: 0
};
let cachedDrugs = null;
let cachedRadio = null;
let cachedAllergens = null;

// Radyofarmasötik için sayfalama değişkenleri
let currentRadioPage = 1;
const radioItemsPerPage = 12;

// Alerjen için sayfalama değişkenleri
let currentAllergenPage = 1;
const allergenItemsPerPage = 12;

// Modify the initializeCache function
async function initializeCache() {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loading-indicator';
    loadingIndicator.className = 'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50';
    loadingIndicator.innerHTML = '<div class="text-white text-xl">Loading...</div>';
    
    try {
        if (isLoading) {
            console.log('Already loading data...');
            return;
        }

        isLoading = true;
        document.body.appendChild(loadingIndicator);
        
        console.log('Fetching data from:', `${drugsUrl}?drugsId=all`);
        const response = await axios.get(`${drugsUrl}?drugsId=all`);
        
        if (!response.data) {
            throw new Error('No data received from API');
        }
        
        console.log('Data received:', response.data);
        cachedData = response.data;
        
        // Hesaplamaları yap
        calculateStats();
        
        // Stats'ları güncelle
        updateStatsDisplay();
        
        isLoading = false;
        getDrugs(currentPage);
        
    } catch (error) {
        console.error("Error initializing cache:", error);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg';
        errorMessage.textContent = 'Failed to load data. Please refresh the page.';
        document.body.appendChild(errorMessage);
        setTimeout(() => errorMessage.remove(), 5000);
    } finally {
        isLoading = false;
        if (loadingIndicator && loadingIndicator.parentNode) {
            loadingIndicator.remove();
        }
    }
}

// Modify getDrugs function
function getDrugs(page = 1, searchQuery = '') {
    console.log('getDrugs called with page:', page, 'searchQuery:', searchQuery);
    console.log('isLoading:', isLoading);
    console.log('cachedData:', cachedData);

    if (isLoading) {
        console.log('Still loading data...');
        return;
    }

    if (!cachedData || !Array.isArray(cachedData)) {
        console.error("Cache not initialized or invalid");
        initializeCache();
        return;
    }

    // Make sure table1 is visible
    const table1 = document.getElementById('table1');
    if (table1) {
        table1.style.display = 'block';
    }

    // Use querySelector to find the tbody with class data-list inside table1
    const dataList = document.querySelector('#table1 .data-list');
    if (!dataList) {
        console.error("Data list element not found");
        return;
    }

    // Clear existing items
    dataList.innerHTML = '';

    const filteredData = searchQuery 
        ? cachedData.filter(item => 
            item['ÜRÜN ADI']?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : cachedData;

    console.log('Filtered data length:', filteredData.length);

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);

    console.log('Page data length:', pageData.length);

    if (pageData.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="8" class="border border-gray-300 p-2 text-center">No data found</td>';
        dataList.appendChild(emptyRow);
    } else {
        pageData.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = generateRowHTML(item, startIndex + index);
            dataList.appendChild(row);
        });
    }

    setupPagination(filteredData.length, page, searchQuery);
}

// Modify the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded, initializing...');
    
    // Make sure table1 is visible before loading data
    const table1 = document.getElementById('table1');
    if (table1) {
        table1.style.display = 'block';
        console.log('Table1 display set to block');
    }
    
    // Initialize data
    await initializeCache();
    
    // Setup autocomplete
    setupAutocomplete();
    
    // Setup search handlers
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const query = document.getElementById('searchInput').value.toLowerCase();
            searchDrugs(query);
        });
    }

    // Add search on Enter key
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = searchInput.value.toLowerCase();
                searchDrugs(query);
            }
        });
    }

    // Önceden hazırlanmış yanıtları güncelle
    const predefinedResponses = {
        // Ağrı kesiciler ve kullanım alanları
        'ağrı': `Ağrı türüne göre kullanılabilecek bazı ilaçlar:
        1. Parasetamol içeren ilaçlar (Parol, Tamol, Vermidon): Hafif ve orta şiddetli ağrılar için
        2. İbuprofen içeren ilaçlar (Arveles, Nurofen): Ağrı ve iltihap durumları için
        3. Naproksen içeren ilaçlar (Apranax, Naprosyn): Güçlü ağrı kesici etki için
        
        Not: Her ilacın yan etkileri olabilir, kullanmadan önce doktorunuza danışmanız önerilir.`,

        'baş ağrısı': `Baş ağrısı için kullanılabilecek ilaçlar:
        1. Parasetamol içeren ilaçlar: Parol, Tamol, Vermidon
        2. İbuprofen içeren ilaçlar: Arveles, Nurofen
        3. Kafein + Parasetamol kombinasyonu: Minoset Plus
        
        Öneriler:
        - Önce 500mg parasetamol deneyebilirsiniz
        - Ağrı geçmezse 4-6 saat sonra tekrarlayabilirsiniz
        - Sık tekrarlayan baş ağrılarında mutlaka doktora başvurun`,

        // Soğuk algınlığı ve grip
        'grip': `Grip belirtileri için kullanılabilecek ilaçlar:
        1. Ateş için: Parol, Tamol
        2. Burun tıkanıklığı için: Otrivine, Iliadin sprey
        3. Boğaz ağrısı için: Strepsils, Tantum Verde
        4. Öksürük için: Bronşial, Humex
        
        Öneriler:
        - Bol sıvı tüketin
        - İstirahat edin
        - C vitamini alın
        - Belirtiler 3-4 günden uzun sürerse doktora başvurun`,

        // Mide problemleri
        'mide': `Mide rahatsızlıkları için kullanılabilecek ilaçlar:
        1. Mide yanması için: Rennie, Gaviscon
        2. Mide bulantısı için: Dramamine
        3. Mide krampları için: Buscopan
        
        Öneriler:
        - Baharatlı ve asitli gıdalardan kaçının
        - Küçük porsiyonlar halinde beslenin
        - Sürekli mide problemleri yaşıyorsanız doktora başvurun`,

        // Alerji
        'alerji': `Alerji belirtileri için kullanılabilecek ilaçlar:
        1. Antihistaminikler: Zyrtec, Aerius, Xyzal
        2. Burun spreyleri: Flixonase, Nasacort
        
        Öneriler:
        - Alerjinizin nedenini belirlemeye çalışın
        - Tetikleyicilerden uzak durun
        - Ciddi alerjik reaksiyonlarda hemen doktora başvurun`,

        // Vitamin ve takviyeler
        'vitamin': `Sık kullanılan vitamin takviyeleri:
        1. D vitamini: Devit-3, D-Vit
        2. B12 vitamini: B12 Depot
        3. Multivitamin: Supradyn, Centrum
        
        Önemli not: Vitamin kullanmadan önce kan tahlili yaptırmanız ve doktorunuza danışmanız önerilir.`,

        // Genel sağlık tavsiyeleri
        'default': `Size yardımcı olabilmem için lütfen şikayetinizi belirtin. Örneğin:
        - Baş ağrısı
        - Grip belirtileri
        - Mide rahatsızlığı
        - Alerji
        - Vitamin ihtiyacı
        
        Not: Verdiğim bilgiler genel tavsiye niteliğindedir. Kesin teşhis ve tedavi için mutlaka bir sağlık kuruluşuna başvurunuz.`
    };

    // Chat işlevselliği
    const chatButton = document.getElementById('chat-button');
    const chatContainer = document.getElementById('chat-container');
    const closeChat = document.getElementById('close-chat');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    chatButton.addEventListener('click', () => {
        chatContainer.classList.toggle('hidden');
    });

    closeChat.addEventListener('click', () => {
        chatContainer.classList.add('hidden');
    });

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim().toLowerCase();
        if (!message) return;

        // Kullanıcı mesajını ekle
        addMessage(chatInput.value, 'user');
        chatInput.value = '';

        // Yanıtı bul
        let response = predefinedResponses.default;
        for (let key in predefinedResponses) {
            if (message.includes(key)) {
                response = predefinedResponses[key];
                break;
            }
        }

        // Kısa bir gecikme ekle (daha doğal görünmesi için)
        setTimeout(() => {
            addMessage(response, 'assistant');
        }, 500);
    });

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `flex items-start space-x-2 ${sender === 'user' ? 'justify-end' : ''}`;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `rounded-lg p-3 max-w-[80%] ${
            sender === 'user' ? 'bg-blue-500 text-white' : 'bg-blue-100'
        }`;
        
        messageDiv.textContent = text;
        div.appendChild(messageDiv);
        
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Default olarak ilk tabloyu göster
    document.getElementById('defaultOpen').click();
});

// Modified search function to use cached data
function searchDrugs(query) {
    console.log(`Searching for: ${query}`);
    
    if (!cachedData) {
        console.error("Cache not initialized");
        return;
    }

    const searchType = document.getElementById('searchType').value;
    const dataList = document.getElementsByClassName('data-list')[0];
    
    if (!dataList) {
        console.error("Element with class 'data-list' not found.");
        return;
    }

    dataList.innerHTML = '';  // Clear existing items

    const filteredData = cachedData.filter(item => {
        const searchValue = item[searchType]?.toString().toLowerCase() || '';
        return searchValue.includes(query.toLowerCase());
    });

    // Only show first page of results
    const startIndex = 0;
    const endIndex = itemsPerPage;
    
    filteredData.slice(startIndex, endIndex).forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = generateRowHTML(item, index);
        dataList.appendChild(row);
    });

    setupPagination(filteredData.length, 1, query);
}

// Helper function to generate row HTML
function generateRowHTML(item, index) {
    const activeIngredient = item['ETKEN MADDE'] || item['ETKİN MADDE'] || item['Etkin Madde'] || item['etkin madde'];
    
    return `
        <tr class="hover:bg-gray-50">
            <td class="px-2 py-2 text-sm text-gray-900">
                <button onclick="viewProspectus(${JSON.stringify(item).replace(/"/g, '&quot;')})" 
                        class="bg-blue-500 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </button>
            </td>
            <td class="px-3 py-3.5 text-sm text-gray-900">${index + 1}</td>
            <td class="px-3 py-3.5 text-sm text-gray-900">${item.BARKOD ?? 'N/A'}</td>
            <td class="px-3 py-3.5 text-sm text-gray-900 font-medium">${item['ÜRÜN ADI'] ?? 'N/A'}</td>
            <td class="px-3 py-3.5 text-sm text-gray-900">${activeIngredient ?? 'N/A'}</td>
            <td class="px-3 py-3.5 text-sm text-gray-900">${item['ATC KODU'] ?? 'N/A'}</td>
            <td class="px-3 py-3.5 text-sm text-gray-900">${item['RUHSAT SAHİBİ'] ?? 'N/A'}</td>
            <td class="px-3 py-3.5 text-sm text-gray-900">${item['RUHSAT TARİHİ'] ? new Date(item['RUHSAT TARİHİ']).toLocaleDateString() : 'N/A'}</td>
        </tr>
    `;
}

// Update setupPagination function for better styling
function setupPagination(totalItems, currentPage, searchQuery = '') {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const buttonClass = 'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150';
    const activeClass = 'bg-blue-600 text-white';
    const inactiveClass = 'bg-white text-gray-700 hover:bg-blue-50';
    const disabledClass = 'bg-gray-100 text-gray-400 cursor-not-allowed';

    // First page button
    const firstPageButton = document.createElement('button');
    firstPageButton.innerHTML = "<<";
    firstPageButton.className = `${buttonClass} ${currentPage === 1 ? disabledClass : inactiveClass}`;
    firstPageButton.addEventListener('click', () => getDrugs(1, searchQuery));
    pagination.appendChild(firstPageButton);

    // Previous page button
    const prevPageButton = document.createElement('button');
    prevPageButton.innerHTML = "<";
    prevPageButton.className = `${buttonClass} ${currentPage === 1 ? disabledClass : inactiveClass}`;
    if (currentPage > 1) {
        prevPageButton.addEventListener('click', () => getDrugs(currentPage - 1, searchQuery));
    }
    pagination.appendChild(prevPageButton);

    // Current page number
    const pageLink = document.createElement('button');
    pageLink.innerHTML = currentPage;
    pageLink.className = `${buttonClass} ${activeClass}`;
    pagination.appendChild(pageLink);

    // Next page button
    const nextPageButton = document.createElement('button');
    nextPageButton.innerHTML = ">";
    nextPageButton.className = `${buttonClass} ${currentPage >= totalPages ? disabledClass : inactiveClass}`;
    if (currentPage < totalPages) {
        nextPageButton.addEventListener('click', () => getDrugs(currentPage + 1, searchQuery));
    }
    pagination.appendChild(nextPageButton);

    // Last page button
    const lastPageButton = document.createElement('button');
    lastPageButton.innerHTML = ">>";
    lastPageButton.className = `${buttonClass} ${currentPage >= totalPages ? disabledClass : inactiveClass}`;
    lastPageButton.addEventListener('click', () => getDrugs(totalPages, searchQuery));
    pagination.appendChild(lastPageButton);
}

function addColumn() {
    console.log("ADDING COLUMN")
    function addRow() {
        // Get the table body element
        const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];

        // Create a new row
        const newRow = tableBody.insertRow();

        // Insert new cells (columns) into the row
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);

        // Add data to the cells
        cell1.textContent = 'John Doe'; // Replace with actual data
        cell2.textContent = '30';        // Replace with actual data
        cell3.textContent = 'New York';  // Replace with actual data
    }
}

// Add this new function for autocomplete
function setupAutocomplete() {
    const searchInput = document.getElementById('searchInput');
    const searchType = document.getElementById('searchType');
    const suggestionsContainer = document.getElementById('searchSuggestions');

    searchInput.addEventListener('input', function(e) {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        debounceTimeout = setTimeout(() => {
            const query = e.target.value.toLowerCase();
            const currentSearchType = searchType.value;
            
            if (query.length < 2) {
                suggestionsContainer.classList.add('hidden');
                return;
            }

            if (!cachedData) {
                console.error("Cache not initialized");
                return;
            }

            // Seçilen alana göre önerileri filtrele
            const suggestions = cachedData
                .filter(item => {
                    const value = item[currentSearchType]?.toString().toLowerCase() || '';
                    return value.startsWith(query);
                })
                .slice(0, 10)
                .map(item => item[currentSearchType]);

            // Önerileri göster
            if (suggestions.length > 0) {
                suggestionsContainer.innerHTML = suggestions
                    .map(suggestion => `
                        <div class="suggestion p-3 hover:bg-blue-50 cursor-pointer text-gray-700">
                            ${suggestion}
                        </div>
                    `)
                    .join('');
                suggestionsContainer.classList.remove('hidden');

                // Önerilere tıklama işlevselliği ekle
                const suggestionElements = suggestionsContainer.getElementsByClassName('suggestion');
                Array.from(suggestionElements).forEach(element => {
                    element.addEventListener('click', function() {
                        searchInput.value = this.textContent.trim();
                        suggestionsContainer.classList.add('hidden');
                        searchDrugs(searchInput.value);
                    });
                });
            } else {
                suggestionsContainer.classList.add('hidden');
            }
        }, 300);
    });

    // Dropdown değiştiğinde placeholder'ı güncelle
    searchType.addEventListener('change', function() {
        searchInput.placeholder = `${this.value} ile ara...`;
        searchInput.value = ''; // Input'u temizle
        suggestionsContainer.classList.add('hidden'); // Önerileri gizle
    });
}

// Add this new function to handle prospectus viewing
function viewProspectus(drugData) {
    // Simplify drug name by getting only the brand name
    let simplifiedName = drugData['ÜRÜN ADI']
        .split(' ')
        .find(word => {
            // Skip numbers, units, and common form descriptions
            return !word.match(/^\d+$/) && // Skip pure numbers
                   !word.match(/^(\d+(\.\d+)?)(MG|MCG|ML|G|IU|UI|KG|%)/i) && // Skip measurements
                   !word.match(/^(TABLET|KAPSUL|SURUP|AMPUL|KREM|JEL|POMAD|FILM|FORT|PLUS|RETARD)/i); // Skip form descriptions
        }) || drugData['ÜRÜN ADI'].split(' ')[0]; // Fallback to first word if no match

    console.log('Original drug name:', drugData['ÜRÜN ADI']);
    console.log('Simplified drug name:', simplifiedName);

    // Store both original and simplified data
    const prospectusData = {
        original: drugData,
        simplifiedName: simplifiedName
    };
    
    localStorage.setItem('selectedDrug', JSON.stringify(prospectusData));
    
    // Open in a new window with specific dimensions
    const width = 1000;
    const height = 800;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    
    window.open(
        'prospectus.html',
        '_blank',
        `width=${width},height=${height},left=${left},top=${top}`
    );
}

function calculateStats() {
    if (!cachedData) return;

    // Toplam ilaç sayısı
    statsData.totalDrugs = cachedData.length;

    // Benzersiz etken maddeleri say
    const uniqueIngredients = new Set();
    cachedData.forEach(drug => {
        // Hem "ETKEN MADDE" hem de "ETKİN MADDE" alanlarını kontrol et
        const activeIngredient = drug['ETKEN MADDE'] || drug['ETKİN MADDE'] || drug['Etkin Madde'] || drug['etkin madde'];
        if (activeIngredient) {
            // Virgülle ayrılmış etken maddeleri ayır ve her birini ekle
            activeIngredient.split(',').forEach(ingredient => {
                uniqueIngredients.add(ingredient.trim());
            });
        }
    });
    statsData.uniqueIngredients = uniqueIngredients.size;

    // Benzersiz şirketleri say
    const uniqueCompanies = new Set();
    cachedData.forEach(drug => {
        if (drug['RUHSAT SAHİBİ']) {
            uniqueCompanies.add(drug['RUHSAT SAHİBİ'].trim());
        }
    });
    statsData.uniqueCompanies = uniqueCompanies.size;
}

function updateStatsDisplay() {
    // Sayaçları güncelle
    const statsElements = {
        totalDrugs: document.querySelector('[data-stat="total-drugs"]'),
        uniqueIngredients: document.querySelector('[data-stat="unique-ingredients"]'),
        uniqueCompanies: document.querySelector('[data-stat="unique-companies"]')
    };

    // Animasyonlu sayaç fonksiyonu
    function animateCounter(element, targetValue) {
        if (!element) return;
        
        const duration = 2000; // 2 saniye
        const steps = 60;
        const stepDuration = duration / steps;
        let currentValue = 0;
        const increment = targetValue / steps;

        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                clearInterval(timer);
                currentValue = targetValue;
            }
            element.textContent = Math.round(currentValue).toLocaleString();
        }, stepDuration);
    }

    // Sayaçları animasyonlu şekilde güncelle
    animateCounter(statsElements.totalDrugs, statsData.totalDrugs);
    animateCounter(statsElements.uniqueIngredients, statsData.uniqueIngredients);
    animateCounter(statsElements.uniqueCompanies, statsData.uniqueCompanies);
}

// Radyofarmasötik verilerini çek
async function getRadioData(page = 1) {
    try {
        console.log('Radyofarmasötik veri çekme başladı');
        
        if (!cachedRadio) {
            console.log('Cache boş, API\'den veri çekiliyor...');
            const response = await axios.get(`${radioUrl}?radiopharmaId=all`);
            console.log('API yanıtı:', response);
            cachedRadio = response.data;
        }

        const dataList = document.querySelector('#table2 tbody');
        if (!dataList) {
            console.error('table2 tbody elementi bulunamadı');
            return;
        }

        dataList.innerHTML = '';

        // Sayfalama için veriyi böl
        const startIndex = (page - 1) * radioItemsPerPage;
        const endIndex = startIndex + radioItemsPerPage;
        const pageData = cachedRadio.slice(startIndex, endIndex);

        console.log('Veriler tabloya ekleniyor...');
        pageData.forEach((item, index) => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${startIndex + index + 1}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.Etkin_Madde || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.Firma_Adi || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.Urun_Adi || 'N/A'}</td>
            `;
            dataList.appendChild(row);
        });

        // Pagination'ı güncelle
        setupRadioPagination(cachedRadio.length, page);

    } catch (error) {
        console.error('Radyofarmasötik veri çekme hatası:', error);
        const dataList = document.querySelector('#table2 tbody');
        if (dataList) {
            dataList.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-4 text-center text-red-500">
                        Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
                    </td>
                </tr>
            `;
        }
    }
}

// Radyofarmasötik pagination setup fonksiyonu
function setupRadioPagination(totalItems, currentPage) {
    const pagination = document.getElementById('radio-pagination');
    if (!pagination) return;

    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalItems / radioItemsPerPage);

    const buttonClass = 'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150';
    const activeClass = 'bg-blue-600 text-white';
    const inactiveClass = 'bg-white text-gray-700 hover:bg-blue-50';
    const disabledClass = 'bg-gray-100 text-gray-400 cursor-not-allowed';

    // İlk sayfa butonu
    const firstPageButton = document.createElement('button');
    firstPageButton.innerHTML = "<<";
    firstPageButton.className = `${buttonClass} ${currentPage === 1 ? disabledClass : inactiveClass}`;
    firstPageButton.addEventListener('click', () => getRadioData(1));
    pagination.appendChild(firstPageButton);

    // Önceki sayfa butonu
    const prevPageButton = document.createElement('button');
    prevPageButton.innerHTML = "<";
    prevPageButton.className = `${buttonClass} ${currentPage === 1 ? disabledClass : inactiveClass}`;
    if (currentPage > 1) {
        prevPageButton.addEventListener('click', () => getRadioData(currentPage - 1));
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
        nextPageButton.addEventListener('click', () => getRadioData(currentPage + 1));
    }
    pagination.appendChild(nextPageButton);

    // Son sayfa butonu
    const lastPageButton = document.createElement('button');
    lastPageButton.innerHTML = ">>";
    lastPageButton.className = `${buttonClass} ${currentPage >= totalPages ? disabledClass : inactiveClass}`;
    lastPageButton.addEventListener('click', () => getRadioData(totalPages));
    pagination.appendChild(lastPageButton);
}

// Alerjen verilerini çek
async function getAllergenData(page = 1) {
    try {
        console.log('Alerjen veri çekme başladı');
        
        if (!cachedAllergens) {
            console.log('Cache boş, API\'den veri çekiliyor...');
            const response = await axios.get(`${allergenUrl}?allergensId=all`);
            console.log('API yanıtı:', response);
            cachedAllergens = response.data;
        }

        const dataList = document.querySelector('#table3 tbody');
        if (!dataList) {
            console.error('table3 tbody elementi bulunamadı');
            return;
        }

        dataList.innerHTML = '';

        // Sayfalama için veriyi böl
        const startIndex = (page - 1) * allergenItemsPerPage;
        const endIndex = startIndex + allergenItemsPerPage;
        const pageData = cachedAllergens.slice(startIndex, endIndex);

        console.log('Veriler tabloya ekleniyor...');
        pageData.forEach((item, index) => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${startIndex + index + 1}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.Etkin_Madde || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.Firma_Adi || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.Urun_Adi || 'N/A'}</td>
            `;
            dataList.appendChild(row);
        });

        // Pagination'ı güncelle
        setupAllergenPagination(cachedAllergens.length, page);

    } catch (error) {
        console.error('Alerjen veri çekme hatası:', error);
        const dataList = document.querySelector('#table3 tbody');
        if (dataList) {
            dataList.innerHTML = `
                <tr>
                    <td colspan="12" class="px-6 py-4 text-center text-red-500">
                        Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
                    </td>
                </tr>
            `;
        }
    }
}

// Alerjen pagination setup fonksiyonu
function setupAllergenPagination(totalItems, currentPage) {
    const pagination = document.getElementById('allergen-pagination');
    if (!pagination) return;

    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalItems / allergenItemsPerPage);

    const buttonClass = 'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150';
    const activeClass = 'bg-blue-600 text-white';
    const inactiveClass = 'bg-white text-gray-700 hover:bg-blue-50';
    const disabledClass = 'bg-gray-100 text-gray-400 cursor-not-allowed';

    // İlk sayfa butonu
    const firstPageButton = document.createElement('button');
    firstPageButton.innerHTML = "<<";
    firstPageButton.className = `${buttonClass} ${currentPage === 1 ? disabledClass : inactiveClass}`;
    firstPageButton.addEventListener('click', () => getAllergenData(1));
    pagination.appendChild(firstPageButton);

    // Önceki sayfa butonu
    const prevPageButton = document.createElement('button');
    prevPageButton.innerHTML = "<";
    prevPageButton.className = `${buttonClass} ${currentPage === 1 ? disabledClass : inactiveClass}`;
    if (currentPage > 1) {
        prevPageButton.addEventListener('click', () => getAllergenData(currentPage - 1));
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
        nextPageButton.addEventListener('click', () => getAllergenData(currentPage + 1));
    }
    pagination.appendChild(nextPageButton);

    // Son sayfa butonu
    const lastPageButton = document.createElement('button');
    lastPageButton.innerHTML = ">>";
    lastPageButton.className = `${buttonClass} ${currentPage >= totalPages ? disabledClass : inactiveClass}`;
    lastPageButton.addEventListener('click', () => getAllergenData(totalPages));
    pagination.appendChild(lastPageButton);
}

// showTable fonksiyonunu güncelle
function showTable(tableId) {
    const tables = ["table1", "table2", "table3"];
    tables.forEach((id) => {
        const table = document.getElementById(id);
        if (tableId === id) {
            table.style.display = "block";
            if (id === 'table2') {
                getRadioData(1); // Sayfa 1'den başla
            } else if (id === 'table3') {
                getAllergenData();
            }
        } else {
            table.style.display = "none";
        }
    });
}

// Hata gösterme fonksiyonu
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4';
    errorDiv.textContent = message;
    
    const activeTable = document.querySelector('.tabcontent[style="display: block"]');
    if (activeTable) {
        activeTable.insertBefore(errorDiv, activeTable.firstChild);
        setTimeout(() => errorDiv.remove(), 5000);
    }
}