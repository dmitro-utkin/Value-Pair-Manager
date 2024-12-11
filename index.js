class ValuePairManager {
    constructor() {
        this.pairs = [];
        this.initializeDOM();
    }

    initializeDOM() {
        this.pairInput = document.getElementById('pairInput');
        this.pairList = document.getElementById('pairList');
        this.addPairBtn = document.getElementById('addPairBtn');
        this.sortNameBtn = document.getElementById('sortNameBtn');
        this.sortValueBtn = document.getElementById('sortValueBtn');
        this.deleteBtn = document.getElementById('deleteBtn');
        this.showXmlBtn = document.getElementById('showXmlBtn');
        this.xmlModal = document.getElementById('xmlModal');
        this.xmlContent = document.getElementById('xmlContent');
        this.closeModalBtn = document.querySelector('.close');

        this.addEventListeners();
    }

    addEventListeners() {
        this.addPairBtn.addEventListener('click', () => this.addPair());
        this.sortNameBtn.addEventListener('click', () => this.sortByName());
        this.sortValueBtn.addEventListener('click', () => this.sortByValue());
        this.deleteBtn.addEventListener('click', () => this.deleteSelected());
        this.showXmlBtn.addEventListener('click', () => this.showXml());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        
        // Close modal if clicked outside
        window.addEventListener('click', (event) => {
            if (event.target === this.xmlModal) {
                this.closeModal();
            }
        });

        // Allow adding pair by pressing Enter key
        this.pairInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.addPair();
            }
        });
    }

    isValidPair(pair) {
        // Trim and remove extra spaces
        pair = pair.trim();
        
        // Check if pair contains '='
        if (!pair.includes('=')) {
            this.showValidationError('Pair must contain "=" sign');
            return false;
        }
        
        // Split pair into name and value
        const [name, value] = pair.split('=').map(part => part.trim());
        
        // Check if name or value is empty
        if (!name || !value) {
            this.showValidationError('Name and Value cannot be empty');
            return false;
        }
        
        // Check if name and value contain only alphanumeric characters
        const alphanumericRegex = /^[a-zA-Z0-9]+$/;
        if (!alphanumericRegex.test(name)) {
            this.showValidationError('Name must contain only alphanumeric characters');
            return false;
        }
        if (!alphanumericRegex.test(value)) {
            this.showValidationError('Value must contain only alphanumeric characters');
            return false;
        }

        return true;
    }

    showValidationError(message) {
        alert(message);
    }

    addPair() {
        const pair = this.pairInput.value;

        if (this.isValidPair(pair)) {
            // Check for duplicate pairs
            if (this.pairs.includes(pair)) {
                this.showValidationError('This pair already exists');
                return;
            }

            this.pairs.push(pair);
            this.updatePairList();
            this.pairInput.value = '';
        }
    }

    updatePairList() {
        // Clear existing options
        this.pairList.innerHTML = '';
        
        // Add new options
        this.pairs.forEach(pair => {
            const option = document.createElement('option');
            option.textContent = pair;
            this.pairList.appendChild(option);
        });
    }

    sortByName() {
        this.pairs.sort((a, b) => {
            const nameA = a.split('=')[0].trim();
            const nameB = b.split('=')[0].trim();
            return nameA.localeCompare(nameB);
        });
        this.updatePairList();
    }

    sortByValue() {
        this.pairs.sort((a, b) => {
            const valueA = a.split('=')[1].trim();
            const valueB = b.split('=')[1].trim();
            return valueA.localeCompare(valueB);
        });
        this.updatePairList();
    }

    deleteSelected() {
        const selectedOptions = Array.from(this.pairList.selectedOptions);
        selectedOptions.forEach(option => {
            const index = this.pairs.indexOf(option.textContent);
            if (index > -1) {
                this.pairs.splice(index, 1);
            }
        });
        this.updatePairList();
    }

    showXml() {
        const xmlPairs = this.pairs.map(pair => {
            const [name, value] = pair.split('=').map(part => part.trim());
            return `<pair><name>${name}</name><value>${value}</value></pair>`;
        });

        const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<pairs>\n${xmlPairs.join('\n')}\n</pairs>`;
        
        this.xmlContent.textContent = xmlContent;
        this.xmlModal.style.display = 'block';
    }

    closeModal() {
        this.xmlModal.style.display = 'none';
    }
}

// Initialize the ValuePairManager when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const valuePairManager = new ValuePairManager();
});