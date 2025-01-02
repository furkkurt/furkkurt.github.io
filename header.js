// Dokümanlar butonu
const docsButton = document.createElement('button');
docsButton.className = 'text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium';
docsButton.textContent = 'Dokümanlar';
docsButton.onclick = function() {
    window.viewDocumentation();
};
navItems.appendChild(docsButton); 