const drugsUrl = "https://nzbjdivwzf.execute-api.eu-north-1.amazonaws.com/prod/drugs";
let currentPage = 1;
const itemsPerPage = 12;

document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const query = document.getElementById('searchInput').value.toLowerCase();
            searchDrugs(query);
        });
    } else {
        console.error("Element with id 'searchButton' not found.");
    }
});

function searchDrugs(query) {
    console.log(`Searching for: ${query}`);

    axios.get(`${drugsUrl}?drugsId=all`).then((response) => {
        console.log("API Response:", response);
        const dataList = document.getElementsByClassName('data-list')[0];
        if (!dataList) {
            console.error("Element with class 'data-list' not found.");
            return;
        }

        dataList.innerHTML = '';  // Clear existing items

        const filteredData = response.data.filter(item =>
            item['ÜRÜN ADI'].toLowerCase().includes(query) ||
            item['ETKEN MADDE'].toLowerCase().includes(query) ||
            item['BARKOD'].toString().includes(query)
        );

        filteredData.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="border border-gray-300 p-2">${index + 1}</td>
                <td class="border border-gray-300 p-2">${item.BARKOD ?? 'N/A'}</td>
                <td class="border border-gray-300 p-2">${item['ÜRÜN ADI'] ?? 'N/A'}</td>
                <td class="border border-gray-300 p-2">${item['ETKEN MADDE'] ?? 'N/A'}</td>
                <td class="border border-gray-300 p-2">${item['ATC KODU'] ?? 'N/A'}</td>
                <td class="border border-gray-300 p-2">${item['RUHSAT SAHİBİ'] ?? 'N/A'}</td>
                <td class="border border-gray-300 p-2">${item['RUHSAT TARİHİ'] ? new Date(item['RUHSAT TARİHİ']).toLocaleDateString() : 'N/A'}</td>
                <td class="border border-gray-300 p-2">${item['RUHSAT NUMARASI'] ?? 'N/A'}</td>
            `;
            dataList.appendChild(row);
        });
    }).catch((error) => {
        console.error("Error:", error);
        console.log("Error Details:", error.response);
    });
}

function getDrugs(page = 1) {
    console.log(`GETTING DRUGS FOR PAGE ${page}`);

    axios.get(`${drugsUrl}?drugsId=all`).then((response) => {
        console.log("API Response:", response);
        const dataList = document.getElementsByClassName('data-list')[0];
        if (!dataList) {
            console.error("Element with class 'data-list' not found.");
            return;
        }

        dataList.innerHTML = '';  // Clear existing items

        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        response.data.slice(startIndex, endIndex).forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="border border-gray-300 p-2">${startIndex + index + 1}</td>
                <td class="border border-gray-300 p-2">${item.BARKOD ?? 'N/A'}</td>
                <td class="border border-gray-300 p-2">${item['ÜRÜN ADI'] ?? 'N/A'}</td>
                <td class="border border-gray-300 p-2">${item['ETKEN MADDE'] ?? 'N/A'}</td>
                <td class="border border-gray-300 p-2">${item['ATC KODU'] ?? 'N/A'}</td>
                <td class="border border-gray-300 p-2">${item['RUHSAT SAHİBİ'] ?? 'N/A'}</td>
                <td class="border border-gray-300 p-2">${item['RUHSAT TARİHİ'] ? new Date(item['RUHSAT TARİHİ']).toLocaleDateString() : 'N/A'}</td>
                <td class="border border-gray-300 p-2">${item['RUHSAT NUMARASI'] ?? 'N/A'}</td>
            `;
            dataList.appendChild(row);
        });

        setupPagination(response.data.length, page);
    }).catch((error) => {
        console.error("Error:", error);
        console.log("Error Details:", error.response);
    });
}

function setupPagination(totalItems, currentPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';  // Clear existing page numbers

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Create "<<" button
    const firstPageButton = document.createElement('span');
    firstPageButton.innerHTML = " << ";
    firstPageButton.className = 'mx-1 cursor-pointer';
    firstPageButton.addEventListener('click', () => {
        currentPage = 1;
        getDrugs(currentPage);
    });
    pagination.appendChild(firstPageButton);

    // Create "<" button
    const prevPageButton = document.createElement('span');
    prevPageButton.innerHTML = " < ";
    prevPageButton.className = 'mx-1 cursor-pointer';
    if (currentPage > 1) {
        prevPageButton.addEventListener('click', () => {
            currentPage -= 1;
            getDrugs(currentPage);
        });
    } else {
        prevPageButton.className += ' text-gray-400';
    }
    pagination.appendChild(prevPageButton);

    // Create page numbers
    const page = Math.max(1, currentPage);
    const pageLink = document.createElement('span');
    pageLink.innerHTML = page + "  ";
    pageLink.className = 'mx-1 cursor-pointer';
    getDrugs(currentPage);
    pagination.appendChild(pageLink);

    // Create ">" button
    const nextPageButton = document.createElement('span');
    nextPageButton.innerHTML = " > ";
    nextPageButton.className = 'mx-1 cursor-pointer';
    if (currentPage < totalPages) {
        nextPageButton.addEventListener('click', () => {
            currentPage += 1;
            getDrugs(currentPage);
        });
    } else {
        nextPageButton.className += ' text-gray-400';
    }
    pagination.appendChild(nextPageButton);

    // Create ">>" button
    const lastPageButton = document.createElement('span');
    lastPageButton.innerHTML = " >> ";
    lastPageButton.className = 'mx-1 cursor-pointer';
    lastPageButton.addEventListener('click', () => {
        currentPage = totalPages;
        getDrugs(currentPage);
    });
    pagination.appendChild(lastPageButton);
}

// Ensure getDrugs is called after DOM content is loaded
window.addEventListener('DOMContentLoaded', () => getDrugs(currentPage));

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