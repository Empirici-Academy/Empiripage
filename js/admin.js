// admin.js - Complete Admin Panel functionality
const admin = {
    currentData: null,
    currentTab: 'dashboard',
    editingArray: null,
    editingIndex: null,
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateDashboard();
        this.loadMessages();
        this.setupArrayTemplates();
    },
    
    loadData() {
        this.currentData = window.EmpiriciUtils.loadSiteData();
        this.populateFormFields();
        this.renderAllArrays();
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
        
        // Auto-save on input change
        let saveTimeout;
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('admin-input')) {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    this.updateDataFromForm();
                }, 1000);
            }
        });
        
        // Global save shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveChanges();
            }
        });
    },
    
    setupArrayTemplates() {
        // Create array management templates
        this.arrayTemplates = {
            'home.featuredCourses': {
                container: 'featured-courses-array',
                fields: ['title', 'level', 'duration', 'format', 'shortDesc', 'image', 'link']
            },
            'about.team': {
                container: 'team-array',
                fields: ['name', 'role', 'bio', 'photo']
            },
            'coursesPage.courses': {
                container: 'courses-array',
                fields: ['title', 'duration', 'level', 'format', 'fullDescription', 'image']
            },
            'blog.posts': {
                container: 'blog-posts-array',
                fields: ['title', 'slug', 'date', 'author', 'excerpt', 'content', 'featuredImage']
            },
            'products.items': {
                container: 'products-array',
                fields: ['title', 'description', 'image', 'ctaLink']
            }
        };
    },
    
    switchTab(tabName) {
        document.querySelectorAll('.admin-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${tabName}-section`).classList.add('active');
        
        this.currentTab = tabName;
        
        // Load tab-specific content
        if (tabName === 'messages') {
            this.loadMessages();
        }
    },
    
    populateFormFields() {
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
    
    renderAllArrays() {
        for (const [arrayPath, template] of Object.entries(this.arrayTemplates)) {
            this.renderArray(arrayPath, template.container);
        }
    },
    
    renderArray(arrayPath, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const array = window.EmpiriciUtils.getValueByPath(this.currentData, arrayPath) || [];
        container.innerHTML = '';
        
        if (array.length === 0) {
            container.innerHTML = '<p class="no-items">No items yet. Add your first item!</p>';
            return;
        }
        
        array.forEach((item, index) => {
            const itemElement = this.createArrayItemElement(arrayPath, item, index);
            container.appendChild(itemElement);
        });
    },
    
    createArrayItemElement(arrayPath, item, index) {
        const template = this.arrayTemplates[arrayPath];
        const itemElement = document.createElement('div');
        itemElement.className = 'array-item';
        itemElement.setAttribute('data-index', index);
        
        let content = `
            <div class="array-item-header">
                <h4>${item.title || item.name || `Item ${index + 1}`}</h4>
                <div class="array-item-actions">
                    <button type="button" class="btn btn-sm" onclick="admin.editArrayItem('${arrayPath}', ${index})">✏️ Edit</button>
                    <button type="button" class="btn btn-sm btn-outline" onclick="admin.moveArrayItem('${arrayPath}', ${index}, -1)">⬆️</button>
                    <button type="button" class="btn btn-sm btn-outline" onclick="admin.moveArrayItem('${arrayPath}', ${index}, 1)">⬇️</button>
                    <button type="button" class="btn btn-sm" style="background: #e74c3c; color: white;" onclick="admin.deleteArrayItem('${arrayPath}', ${index})">🗑️ Delete</button>
                </div>
            </div>
            <div class="array-item-preview">
        `;
        
        // Add preview fields
        template.fields.forEach(field => {
            if (item[field] && field !== 'image' && field !== 'photo' && field !== 'featuredImage') {
                let value = item[field];
                if (field === 'fullDescription' || field === 'content') {
                    value = value.replace(/<[^>]*>/g, '').substring(0, 100) + '...';
                }
                content += `<p><strong>${field}:</strong> ${value}</p>`;
            }
        });
        
        // Add image preview
        if (item.image || item.photo || item.featuredImage) {
            const imgUrl = item.image || item.photo || item.featuredImage;
            content += `<img src="${imgUrl}" alt="Preview" class="array-item-image-preview">`;
        }
        
        content += `</div>`;
        itemElement.innerHTML = content;
        
        return itemElement;
    },
    
    addArrayItem(arrayPath) {
        const template = this.arrayTemplates[arrayPath];
        const array = window.EmpiriciUtils.getValueByPath(this.currentData, arrayPath) || [];
        
        const newItem = {
            id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        };
        
        // Initialize fields
        template.fields.forEach(field => {
            if (field === 'slug') {
                newItem[field] = '';
            } else if (field === 'date') {
                newItem[field] = new Date().toISOString().split('T')[0];
            } else {
                newItem[field] = '';
            }
        });
        
        array.push(newItem);
        window.EmpiriciUtils.setValueByPath(this.currentData, arrayPath, array);
        this.renderArray(arrayPath, template.container);
        this.editArrayItem(arrayPath, array.length - 1);
    },
    
    editArrayItem(arrayPath, index) {
        const template = this.arrayTemplates[arrayPath];
        const array = window.EmpiriciUtils.getValueByPath(this.currentData, arrayPath);
        const item = array[index];
        
        let formHtml = `
            <div class="array-item-edit">
                <h4>Edit ${arrayPath.split('.').pop().slice(0, -1)}</h4>
                <div class="form-grid">
        `;
        
        template.fields.forEach(field => {
            const value = item[field] || '';
            formHtml += `
                <div class="form-group ${field === 'fullDescription' || field === 'content' || field === 'bio' ? 'form-full' : ''}">
                    <label for="edit-${field}">${this.capitalizeFirst(field)}</label>
            `;
            
            if (field === 'fullDescription' || field === 'content') {
                formHtml += `<textarea id="edit-${field}" class="admin-input" rows="6">${value}</textarea>`;
            } else if (field === 'image' || field === 'photo' || field === 'featuredImage') {
                formHtml += `
                    <input type="file" id="edit-${field}" accept="image/*" onchange="admin.handleArrayImageUpload(this, '${arrayPath}', ${index}, '${field}')">
                    ${value ? `<img src="${value}" class="image-preview" style="max-width: 200px; display: block; margin-top: 8px;">` : ''}
                `;
            } else {
                formHtml += `<input type="text" id="edit-${field}" class="admin-input" value="${value}">`;
            }
            
            formHtml += `</div>`;
        });
        
        formHtml += `
                </div>
                <div class="admin-actions">
                    <button type="button" class="btn btn-primary" onclick="admin.saveArrayItem('${arrayPath}', ${index})">💾 Save</button>
                    <button type="button" class="btn btn-outline" onclick="admin.cancelEditArrayItem('${arrayPath}')">❌ Cancel</button>
                </div>
            </div>
        `;
        
        const container = document.getElementById(template.container);
        container.innerHTML = formHtml;
        
        this.editingArray = arrayPath;
        this.editingIndex = index;
    },
    
    saveArrayItem(arrayPath, index) {
        const template = this.arrayTemplates[arrayPath];
        const array = window.EmpiriciUtils.getValueByPath(this.currentData, arrayPath);
        
        template.fields.forEach(field => {
            const input = document.getElementById(`edit-${field}`);
            if (input && input.type !== 'file') {
                array[index][field] = input.value;
            }
            
            // Auto-generate slug from title
            if (field === 'title' && template.fields.includes('slug')) {
                const slugInput = document.getElementById('edit-slug');
                if (slugInput && !slugInput.value) {
                    const slug = input.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    array[index].slug = slug;
                    if (slugInput) slugInput.value = slug;
                }
            }
        });
        
        window.EmpiriciUtils.setValueByPath(this.currentData, arrayPath, array);
        this.renderArray(arrayPath, template.container);
        this.editingArray = null;
        this.editingIndex = null;
        
        this.showNotification('Item saved successfully!', 'success');
    },
    
    cancelEditArrayItem(arrayPath) {
        this.renderArray(arrayPath, this.arrayTemplates[arrayPath].container);
        this.editingArray = null;
        this.editingIndex = null;
    },
    
    deleteArrayItem(arrayPath, index) {
        if (confirm('Are you sure you want to delete this item? This cannot be undone.')) {
            const array = window.EmpiriciUtils.getValueByPath(this.currentData, arrayPath);
            array.splice(index, 1);
            window.EmpiriciUtils.setValueByPath(this.currentData, arrayPath, array);
            this.renderArray(arrayPath, this.arrayTemplates[arrayPath].container);
            this.showNotification('Item deleted successfully!', 'success');
        }
    },
    
    moveArrayItem(arrayPath, index, direction) {
        const array = window.EmpiriciUtils.getValueByPath(this.currentData, arrayPath);
        const newIndex = index + direction;
        
        if (newIndex >= 0 && newIndex < array.length) {
            // Swap elements
            [array[index], array[newIndex]] = [array[newIndex], array[index]];
            window.EmpiriciUtils.setValueByPath(this.currentData, arrayPath, array);
            this.renderArray(arrayPath, this.arrayTemplates[arrayPath].container);
            this.showNotification('Item moved successfully!', 'success');
        }
    },
    
    handleImageUpload(inputElement, dataKey) {
        const file = inputElement.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            window.EmpiriciUtils.setValueByPath(this.currentData, dataKey, dataUrl);
            this.updateImagePreview(dataKey, dataUrl);
        };
        reader.readAsDataURL(file);
    },
    
    handleArrayImageUpload(inputElement, arrayPath, index, field) {
        const file = inputElement.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            const array = window.EmpiriciUtils.getValueByPath(this.currentData, arrayPath);
            array[index][field] = dataUrl;
            window.EmpiriciUtils.setValueByPath(this.currentData, arrayPath, array);
            
            // Update preview in the form
            const preview = inputElement.nextElementSibling;
            if (preview && preview.classList.contains('image-preview')) {
                preview.src = dataUrl;
                preview.style.display = 'block';
            }
        };
        reader.readAsDataURL(file);
    },
    
    updateImagePreview(key, imageUrl) {
        const previewId = key.replace(/\./g, '-') + '-preview-img';
        const previewElement = document.getElementById(previewId);
        if (previewElement && imageUrl) {
            previewElement.src = imageUrl;
            previewElement.style.display = 'block';
        }
    },
    
    saveChanges() {
        this.updateDataFromForm();
        window.EmpiriciUtils.saveSiteData(this.currentData);
        this.showNotification('All changes saved successfully!', 'success');
        this.updateDashboard();
    },
    
    updateDashboard() {
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
                messagesList.innerHTML = '<p class="no-items">No messages yet.</p>';
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
                    <div class="message-email">📧 ${this.escapeHtml(message.email)}</div>
                    ${message.phone ? `<div class="message-phone">📞 ${this.escapeHtml(message.phone)}</div>` : ''}
                    ${message.subject ? `<div class="message-subject">📋 ${this.escapeHtml(message.subject)}</div>` : ''}
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
        
        this.showNotification('JSON exported successfully!', 'success');
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
                    this.renderAllArrays();
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
        if (confirm('Are you sure you want to reset ALL content to defaults? This cannot be undone.')) {
            this.currentData = JSON.parse(JSON.stringify(window.DEFAULT_SITE_DATA));
            this.populateFormFields();
            this.renderAllArrays();
            this.showNotification('Reset to defaults completed!', 'success');
        }
    },
    
    resetPageDefaults() {
        if (confirm(`Reset ${this.currentTab} page to defaults?`)) {
            const defaultData = JSON.parse(JSON.stringify(window.DEFAULT_SITE_DATA));
            const currentTabData = window.EmpiriciUtils.getValueByPath(defaultData, this.currentTab);
            
            if (currentTabData) {
                window.EmpiriciUtils.setValueByPath(this.currentData, this.currentTab, currentTabData);
                this.populateFormFields();
                this.renderAllArrays();
                this.showNotification(`Page reset to defaults!`, 'success');
            }
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
        
        this.showNotification('Messages exported as CSV!', 'success');
    },
    
    clearMessages() {
        if (confirm('Are you sure you want to delete ALL messages? This cannot be undone.')) {
            localStorage.setItem('empirici:messages:v1', '[]');
            this.loadMessages();
            this.showNotification('All messages cleared', 'success');
        }
    },
    
    previewSite() {
        window.open('/index.html', '_blank');
    },
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#3498db'};
            color: white;
            border-radius: var(--radius);
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-weight: 600;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },
    
    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
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
