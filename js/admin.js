// admin.js - Admin panel functionality
const admin = {
    currentData: null,
    currentTab: 'dashboard',
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateDashboard();
        this.loadMessages();
    },
    
    loadData() {
        this.currentData = window.EmpiriciUtils.loadSiteData();
        this.populateFormFields();
    },
    
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.admin-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = link.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });
        
        // Auto-save on input change (with debounce)
        let saveTimeout;
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('admin-input')) {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    this.updateDataFromForm();
                }, 1000);
            }
        });
    },
    
    switchTab(tabName) {
        // Update active tab in sidebar
        document.querySelectorAll('.admin-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update active section
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${tabName}-section`).classList.add('active');
        
        this.currentTab = tabName;
    },
    
    populateFormFields() {
        // Populate all admin inputs with current data
        document.querySelectorAll('.admin-input').forEach(input => {
            const key = input.getAttribute('data-key');
            if (key) {
                const value = window.EmpiriciUtils.getValueByPath(this.currentData, key);
                if (value !== undefined) {
                    if (input.type === 'file') {
                        // Handle file inputs separately
                    } else if (input.tagName === 'TEXTAREA') {
                        input.value = value;
                    } else if (input.tagName === 'SELECT') {
                        input.value = value;
                    } else {
                        input.value = value;
                    }
                    
                    // Update image previews
                    if (key.includes('image') || key.includes('Image') || key.includes('photo') || key.includes('avatar')) {
                        this.updateImagePreview(key, value);
                    }
                }
            }
        });
    },
    
    updateDataFromForm() {
        document.querySelectorAll('.admin-input').forEach(input => {
            const key = input.getAttribute('data-key');
            if (key && input.type !== 'file') {
                const value = input.value;
                window.EmpiriciUtils.setValueByPath(this.currentData, key, value);
            }
        });
    },
    
    updateImagePreview(key, imageUrl) {
        const previewId = key.replace(/\./g, '-') + '-preview-img';
        const previewElement = document.getElementById(previewId);
        if (previewElement && imageUrl) {
            previewElement.src = imageUrl;
            previewElement.style.display = 'block';
        }
    },
    
    handleImageUpload(inputElement, dataKey) {
        const file = inputElement.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            window.EmpiriciUtils.setValueByPath(this.currentData, dataKey, dataUrl);
            
            // Update preview
            this.updateImagePreview(dataKey, dataUrl);
        };
        reader.readAsDataURL(file);
    },
    
    saveChanges() {
        this.updateDataFromForm();
        window.EmpiriciUtils.saveSiteData(this.currentData);
        
        // Show success message
        this.showNotification('Changes saved successfully!', 'success');
        
        // Update dashboard
        this.updateDashboard();
    },
    
    updateDashboard() {
        // Update storage status
        const used = JSON.stringify(this.currentData).length;
        const statusElement = document.getElementById('storage-status');
        if (statusElement) {
            statusElement.innerHTML = `<small>LocalStorage: ${Math.round(used / 1024)} KB used</small>`;
        }
    },
    
    loadMessages() {
        const messages = JSON.parse(localStorage.getItem('empirici:messages:v1') || '[]');
        const messagesList = document.getElementById('messages-list');
        const messageCount = document.getElementById('message-count');
        
        if (messageCount) {
            messageCount.textContent = `${messages.length} message${messages.length !== 1 ? 's' : ''}`;
        }
        
        if (messagesList) {
            messagesList.innerHTML = '';
            
            if (messages.length === 0) {
                messagesList.innerHTML = '<p>No messages yet.</p>';
                return;
            }
            
            messages.reverse().forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.className = 'message-item';
                messageElement.innerHTML = `
                    <div class="message-header">
                        <span class="message-name">${this.escapeHtml(message.name)}</span>
                        <span class="message-date">${new Date(message.createdAt).toLocaleString()}</span>
                    </div>
                    <div class="message-email">${this.escapeHtml(message.email)}</div>
                    ${message.phone ? `<div class="message-phone">Phone: ${this.escapeHtml(message.phone)}</div>` : ''}
                    ${message.subject ? `<div class="message-subject">Subject: ${this.escapeHtml(message.subject)}</div>` : ''}
                    <div class="message-content">${this.escapeHtml(message.message)}</div>
                `;
                messagesList.appendChild(messageElement);
            });
        }
    },
    
    exportJSON() {
        const dataStr = JSON.stringify(this.currentData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'empirici-site-data.json';
        link.click();
    },
    
    importJSON() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    this.currentData = importedData;
                    this.populateFormFields();
                    this.showNotification('JSON imported successfully!', 'success');
                } catch (error) {
                    this.showNotification('Error importing JSON: Invalid format', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    },
    
    resetToDefaults() {
        if (confirm('Are you sure you want to reset all content to defaults? This cannot be undone.')) {
            this.currentData = JSON.parse(JSON.stringify(window.DEFAULT_SITE_DATA));
            this.populateFormFields();
            this.showNotification('Reset to defaults completed!', 'success');
        }
    },
    
    exportMessagesCSV() {
        const messages = JSON.parse(localStorage.getItem('empirici:messages:v1') || '[]');
        
        if (messages.length === 0) {
            this.showNotification('No messages to export', 'warning');
            return;
        }
        
        let csv = 'Date,Name,Email,Phone,Subject,Message\n';
        
        messages.forEach(msg => {
            const date = new Date(msg.createdAt).toLocaleString();
            const name = this.escapeCsv(msg.name);
            const email = this.escapeCsv(msg.email);
            const phone = this.escapeCsv(msg.phone || '');
            const subject = this.escapeCsv(msg.subject || '');
            const message = this.escapeCsv(msg.message);
            
            csv += `"${date}","${name}","${email}","${phone}","${subject}","${message}"\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `empirici-messages-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    },
    
    clearMessages() {
        if (confirm('Are you sure you want to delete all messages? This cannot be undone.')) {
            localStorage.setItem('empirici:messages:v1', '[]');
            this.loadMessages();
            this.showNotification('All messages cleared', 'success');
        }
    },
    
    previewSite() {
        window.open('/index.html', '_blank');
    },
    
    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            border-radius: var(--radius);
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    },
    
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },
    
    escapeCsv(str) {
        if (str === null || str === undefined) return '';
        return String(str).replace(/"/g, '""');
    }
};

// Initialize admin when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    admin.init();
});

// Make admin globally available
window.admin = admin;
