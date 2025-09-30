// main.js - Shared loader and utilities for all pages

// Utility function to get nested value from object using path string
function getValueByPath(obj, path) {
    return path.split('.').reduce((current, key) => {
        // Handle array indices like "team[0].name"
        const arrayMatch = key.match(/(\w+)\[(\d+)\]/);
        if (arrayMatch) {
            const arrayKey = arrayMatch[1];
            const arrayIndex = parseInt(arrayMatch[2]);
            return current && current[arrayKey] ? current[arrayKey][arrayIndex] : undefined;
        }
        return current ? current[key] : undefined;
    }, obj);
}

// Utility function to set nested value in object using path string
function setValueByPath(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const arrayMatch = key.match(/(\w+)\[(\d+)\]/);
        
        if (arrayMatch) {
            const arrayKey = arrayMatch[1];
            const arrayIndex = parseInt(arrayMatch[2]);
            if (!current[arrayKey]) current[arrayKey] = [];
            if (!current[arrayKey][arrayIndex]) current[arrayKey][arrayIndex] = {};
            current = current[arrayKey][arrayIndex];
        } else {
            if (!current[key]) current[key] = {};
            current = current[key];
        }
    }
    
    const lastKey = keys[keys.length - 1];
    const lastArrayMatch = lastKey.match(/(\w+)\[(\d+)\]/);
    
    if (lastArrayMatch) {
        const arrayKey = lastArrayMatch[1];
        const arrayIndex = parseInt(lastArrayMatch[2]);
        if (!current[arrayKey]) current[arrayKey] = [];
        current[arrayKey][arrayIndex] = value;
    } else {
        current[lastKey] = value;
    }
}

// Load site data from localStorage or fall back to defaults
function loadSiteData() {
    const stored = localStorage.getItem('empirici:siteData:v1');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing stored site data:', e);
        }
    }
    return window.DEFAULT_SITE_DATA;
}

// Save site data to localStorage
function saveSiteData(data) {
    localStorage.setItem('empirici:siteData:v1', JSON.stringify(data));
    // Trigger storage event so other tabs can update
    window.dispatchEvent(new Event('storage'));
}

// Render all content elements with data-key attributes
function renderAll() {
    const siteData = loadSiteData();
    const elements = document.querySelectorAll('[data-key]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-key');
        const value = getValueByPath(siteData, key);
        
        if (value !== undefined) {
            if (element.tagName === 'IMG') {
                element.src = value;
                if (element.getAttribute('data-alt')) {
                    element.alt = getValueByPath(siteData, element.getAttribute('data-alt'));
                }
            } else if (element.hasAttribute('data-html')) {
                element.innerHTML = value;
            } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = value;
            } else if (element.hasAttribute('href') && !element.getAttribute('data-ignore-href')) {
                element.href = value;
            } else {
                element.textContent = value;
            }
        }
    });
}

// Render array data into container using template
function renderArray(containerSelector, templateSelector, arrayPath) {
    const siteData = loadSiteData();
    const array = getValueByPath(siteData, arrayPath);
    const container = document.querySelector(containerSelector);
    const template = document.querySelector(templateSelector);
    
    if (!container || !template || !array) return;
    
    container.innerHTML = '';
    
    array.forEach((item, index) => {
        const clone = template.content.cloneNode(true);
        const elements = clone.querySelectorAll('[data-key]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-key');
            // Replace [i] with actual index in the path
            const resolvedKey = key.replace('[i]', `[${index}]`);
            const value = getValueByPath(siteData, resolvedKey);
            
            if (value !== undefined) {
                if (element.tagName === 'IMG') {
                    element.src = value;
                } else if (element.hasAttribute('data-html')) {
                    element.innerHTML = value;
                } else if (element.hasAttribute('href') && !element.getAttribute('data-ignore-href')) {
                    element.href = value;
                } else {
                    element.textContent = value;
                }
            }
        });
        
        container.appendChild(clone);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    renderAll();
    
    // Listen for storage events (when admin saves changes)
    window.addEventListener('storage', function() {
        renderAll();
    });
});

// Export functions for use in other scripts
window.EmpiriciUtils = {
    getValueByPath,
    setValueByPath,
    loadSiteData,
    saveSiteData,
    renderAll,
    renderArray
};
