// admin.js - COMPLETE VERSION with all fixes and features
console.log('=== ADMIN JS LOADED ===');

const admin = {
  currentData: null,
  currentTab: 'dashboard',
  editingArray: null,
  editingIndex: null,

  init() {
    console.log('🔄 Admin initializing...');
    this.loadData();
    this.setupEventListeners();
    this.updateDashboard();
    this.loadMessages();
    this.showNotification('Admin panel loaded successfully!', 'success');
  },

  loadData() {
    console.log('📥 Loading site data...');
    this.currentData = window.EmpiriciUtils.loadSiteData();
    this.populateAllFormFields();
    this.renderAllArrays();
    this.updateDashboard();
  },

  setupEventListeners() {
    console.log('🎯 Setting up event listeners...');
    
    // Tab navigation
    document.querySelectorAll('.admin-nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    // Auto-save on input
    let saveTimeout;
    document.addEventListener('input', (e) => {
      if (e.target.classList.contains('admin-input') || e.target.classList.contains('admin-textarea')) {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
          this.updateDataFromForm();
        }, 1000);
      }
    });
  },

  switchTab(tabName) {
    this.currentTab = tabName;
    
    // Update active tab
    document.querySelectorAll('.admin-nav-link').forEach(link => {
      link.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update active section
    document.querySelectorAll('.admin-section').forEach(section => {
      section.classList.remove('active');
    });
    const targetSection = document.getElementById(`${tabName}-section`);
    if (targetSection) {
      targetSection.classList.add('active');
    }
    
    if (tabName === 'messages') {
      this.loadMessages();
    }
  },

  populateAllFormFields() {
    console.log('📝 Populating form fields...');
    
    // Site Settings
    this.setInputValue('site-name', 'site.name');
    this.setInputValue('site-tagline', 'site.tagline');
    this.setInputValue('site-email', 'site.email');
    this.setInputValue('site-phone', 'site.phone');
    this.setTextareaValue('site-address', 'site.address');
    
    // Home Page
    this.setInputValue('home-hero-title', 'home.hero.title');
    this.setTextareaValue('home-hero-subtitle', 'home.hero.subtitle');
    this.setInputValue('home-hero-primaryCta', 'home.hero.primaryCta');
    this.setInputValue('home-hero-secondaryCta', 'home.hero.secondaryCta');
    this.setInputValue('home-intro-heading', 'home.intro.heading');
    this.setTextareaValue('home-intro-paragraph', 'home.intro.paragraph');
    
    // About Page
    this.setTextareaValue('about-mission', 'about.mission');
    this.setTextareaValue('about-vision', 'about.vision');
    this.setTextareaValue('about-story', 'about.story');
    
    // Courses Page
    this.setInputValue('courses-header', 'coursesPage.header');
    this.setTextareaValue('courses-description', 'coursesPage.description');
    
    // Collaboration Page
    this.setInputValue('collaboration-headline', 'collaboration.headline');
    this.setTextareaValue('collaboration-paragraph', 'collaboration.paragraph');
    this.setInputValue('collaboration-cta-text', 'collaboration.cta.text');
    
    // Contact Page
    this.setInputValue('contact-heading', 'contact.heading');
    this.setInputValue('contact-subheading', 'contact.subheading');
    this.setTextareaValue('contact-mapEmbed', 'contact.mapEmbed');
  },

  setInputValue(elementId, dataPath) {
    const element = document.getElementById(elementId);
    if (element) {
      const value = window.EmpiriciUtils.getValueByPath(this.currentData, dataPath);
      element.value = value || '';
    }
  },

  setTextareaValue(elementId, dataPath) {
    const element = document.getElementById(elementId);
    if (element) {
      const value = window.EmpiriciUtils.getValueByPath(this.currentData, dataPath);
      element.value = value || '';
    }
  },

  updateDataFromForm() {
    // Site Settings
    this.updateDataValue('site-name', 'site.name');
    this.updateDataValue('site-tagline', 'site.tagline');
    this.updateDataValue('site-email', 'site.email');
    this.updateDataValue('site-phone', 'site.phone');
    this.updateDataValue('site-address', 'site.address');
    
    // Home Page
    this.updateDataValue('home-hero-title', 'home.hero.title');
    this.updateDataValue('home-hero-subtitle', 'home.hero.subtitle');
    this.updateDataValue('home-hero-primaryCta', 'home.hero.primaryCta');
    this.updateDataValue('home-hero-secondaryCta', 'home.hero.secondaryCta');
    this.updateDataValue('home-intro-heading', 'home.intro.heading');
    this.updateDataValue('home-intro-paragraph', 'home.intro.paragraph');
    
    // About Page
    this.updateDataValue('about-mission', 'about.mission');
    this.updateDataValue('about-vision', 'about.vision');
    this.updateDataValue('about-story', 'about.story');
    
    // Courses Page
    this.updateDataValue('courses-header', 'coursesPage.header');
    this.updateDataValue('courses-description', 'coursesPage.description');
    
    // Collaboration Page
    this.updateDataValue('collaboration-headline', 'collaboration.headline');
    this.updateDataValue('collaboration-paragraph', 'collaboration.paragraph');
    this.updateDataValue('collaboration-cta-text', 'collaboration.cta.text');
    
    // Contact Page
    this.updateDataValue('contact-heading', 'contact.heading');
    this.updateDataValue('contact-subheading', 'contact.subheading');
    this.updateDataValue('contact-mapEmbed', 'contact.mapEmbed');
    
    this.saveChanges();
  },

  updateDataValue(elementId, dataPath) {
    const element = document.getElementById(elementId);
    if (element) {
      window.EmpiriciUtils.setValueByPath(this.currentData, dataPath, element.value);
    }
  },

  renderAllArrays() {
    console.log('🔄 Rendering arrays...');
    
    // Home page arrays
    this.renderArray('home.stats', 'stats-array', ['number', 'label']);
    this.renderFeaturedCourses();
    this.renderFeaturedPosts();
    this.renderArray('home.testimonials', 'testimonials-array', ['quote', 'author', 'role']);
    
    // About page arrays
    this.renderArray('about.team', 'team-array', ['name', 'role', 'bio']);
    this.renderArray('about.values', 'values-array', ['value']);
    
    // Courses
    this.renderArray('coursesPage.courses', 'courses-array', [
      'title', 'duration', 'level', 'format', 'fullDescription', 'image', 'badgerLink', 'featured'
    ]);
    
    // Collaboration
    this.renderArray('collaboration.servicesOffered', 'services-array', ['service']);
    
    // Blog
    this.renderArray('blog.posts', 'blog-posts-array', [
      'title', 'slug', 'date', 'author', 'excerpt', 'content', 'featuredImage', 'featured'
    ]);
    
    // Contact
    this.renderSimpleArray('contact.subjects', 'subjects-array');
  },

  renderFeaturedCourses() {
    const container = document.getElementById('featured-courses-array');
    if (!container) return;

    const allCourses = window.EmpiriciUtils.getValueByPath(this.currentData, 'coursesPage.courses') || [];
    const featuredCourses = allCourses.filter(course => course.featured === true);

    if (featuredCourses.length === 0) {
      container.innerHTML = '<p style="color: var(--muted);">No featured courses. Mark courses as featured in the Courses section.</p>';
      return;
    }

    container.innerHTML = '';
    featuredCourses.forEach((course) => {
      const div = document.createElement('div');
      div.className = 'array-item';
      div.innerHTML = `
        <div class="array-item-header">
          <strong>${course.title}</strong>
          <span class="badge featured-badge">Featured</span>
        </div>
        <p><strong>Level:</strong> ${course.level || 'N/A'}</p>
        <p><strong>Duration:</strong> ${course.duration || 'N/A'}</p>
      `;
      container.appendChild(div);
    });
  },

  renderFeaturedPosts() {
    const container = document.getElementById('featured-posts-array');
    if (!container) return;

    const allPosts = window.EmpiriciUtils.getValueByPath(this.currentData, 'blog.posts') || [];
    const featuredPosts = allPosts.filter(post => post.featured === true);

    if (featuredPosts.length === 0) {
      container.innerHTML = '<p style="color: var(--muted);">No featured posts. Mark posts as featured in the Blog section.</p>';
      return;
    }

    container.innerHTML = '';
    featuredPosts.forEach((post) => {
      const div = document.createElement('div');
      div.className = 'array-item';
      div.innerHTML = `
        <div class="array-item-header">
          <strong>${post.title}</strong>
          <span class="badge featured-badge">Featured</span>
        </div>
        <p><strong>Author:</strong> ${post.author || 'N/A'}</p>
        <p><strong>Date:</strong> ${post.date || 'N/A'}</p>
      `;
      container.appendChild(div);
    });
  },

  renderArray(arrayPath, containerId, fields) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const array = window.EmpiriciUtils.getValueByPath(this.currentData, arrayPath) || [];

    if (array.length === 0) {
      container.innerHTML = '<p style="color: var(--muted);">No items yet. Add your first item!</p>';
      return;
    }

    container.innerHTML = '';
    array.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'array-item';
      
      let content = `<div class="array-item-header">`;
      
      // Show item title/name
      const titleField = item.title || item.name || item.quote || item.value || item.service || item.number;
      content += `<strong>${titleField || `Item ${index + 1}`}</strong>`;
      
      // Show featured badge if applicable
      if (item.featured) {
        content += `<span class="badge featured-badge">Featured</span>`;
      }
      
      content += `<div class="array-item-actions">
        <button onclick="admin.editArrayItem('${arrayPath}', ${index})" class="btn btn-sm btn-warning">✏️ Edit</button>
        <button onclick="admin.deleteArrayItem('${arrayPath}', ${index})" class="btn btn-sm btn-danger">🗑️ Delete</button>
      </div></div>`;
      
      // Show preview of fields
      fields.forEach(field => {
        if (field === 'featured') return; // Skip featured field in preview
        
        const value = item[field];
        if (value) {
          let displayValue = String(value);
          if (displayValue.length > 100) {
            displayValue = displayValue.substring(0, 100) + '...';
          }
          content += `<p><strong>${field}:</strong> ${this.escapeHtml(displayValue)}</p>`;
        }
      });
      
      div.innerHTML = content;
      container.appendChild(div);
    });
  },

  renderSimpleArray(arrayPath, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const array = window.EmpiriciUtils.getValueByPath(this.currentData, arrayPath) || [];

    if (array.length === 0) {
      container.innerHTML = '<p style="color: var(--muted);">No items yet.</p>';
      return;
    }

    container.innerHTML = '';
    array.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'array-item';
      div.innerHTML = `
        <div class="array-item-header">
          <strong>${item}</strong>
          <div class="array-item-actions">
            <button onclick="admin.editSimpleArrayItem('${arrayPath}', ${index})" class="btn btn-sm btn-warning">✏️ Edit</button>
            <button onclick="admin.deleteArrayItem('${arrayPath}', ${index})" class="btn btn-sm btn-danger">🗑️ Delete</button>
          </div>
        </div>
      `;
      container.appendChild(div);
    });
  },

  addArrayItem(arrayPath) {
    const array = window.EmpiriciUtils.getValueByPath(this.currentData, arrayPath) || [];
    
    // Templates for different array types
    const templates = {
      'home.stats': { number: '100+', label: 'New Stat' },
      'home.testimonials': { quote: 'Testimonial quote...', author: 'Author Name', role: 'Role' },
      'about.team': { name: 'Team Member', role: 'Position', bio: 'Biography...' },
      'about.values': { value: 'New Value' },
      'coursesPage.courses': {
        title: 'New Course',
        duration: '8 weeks',
        level: 'Beginner',
        format: 'Live',
        fullDescription: 'Course description...',
        image: '/assets/course-1.png',
        badgerLink: '',
        featured: false
      },
      'collaboration.servicesOffered': { service: 'New Service' },
      'blog.posts': {
        title: 'New Blog Post',
        slug: 'new-blog-post',
        date: new Date().toISOString().split('T')[0],
        author: 'Author',
        excerpt: 'Post excerpt...',
        content: '<p>Post content...</p>',
        featuredImage: '/assets/hero.png',
        featured: false
      },
      'contact.subjects': 'New Subject'
    };

    const newItem = arrayPath === 'contact.subjects' 
      ? templates[arrayPath]
      : { id: `item_${Date.now()}`, ...templates[arrayPath] };

    array.push(newItem);
    window.EmpiriciUtils.setValueByPath(this.currentData, arrayPath, array);
    
    this.renderAllArrays();
    this.saveChanges();
    this.showNotification('Item added successfully!', 'success');
  },

  editArrayItem(arrayPath, index) {
    const array = window.EmpiriciUtils.getValueByPath(this.currentData, arrayPath);
    const item = array[index];
    
    const fieldConfigs = {
      'home.stats': [
        { name: 'number', label: 'Number', type: 'text' },
        { name: 'label', label: 'Label', type: 'text' }
      ],
      'home.testimonials': [
        { name: 'quote', label: 'Quote', type: 'textarea' },
        { name: 'author', label: 'Author', type: 'text' },
        { name: 'role', label: 'Role', type: 'text' }
      ],
      'about.team': [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'role', label: 'Role', type: 'text' },
        { name: 'bio', label: 'Bio', type: 'textarea' }
      ],
      'about.values': [
        { name: 'value', label: 'Value', type: 'text' }
      ],
      'coursesPage.courses': [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'duration', label: 'Duration', type: 'text' },
        { name: 'level', label: 'Level', type: 'text' },
        { name: 'format', label: 'Format', type: 'text' },
        { name: 'fullDescription', label: 'Description', type: 'textarea' },
        { name: 'image', label: 'Image URL', type: 'text' },
        { name: 'badgerLink', label: 'Badger Link', type: 'text' },
        { name: 'featured', label: 'Featured', type: 'checkbox' }
      ],
      'collaboration.servicesOffered': [
        { name: 'service', label: 'Service', type: 'text' }
      ],
      'blog.posts': [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'slug', label: 'Slug', type: 'text' },
        { name: 'date', label: 'Date (YYYY-MM-DD)', type: 'text' },
        { name: 'author', label: 'Author', type: 'text' },
        { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
        { name: 'content', label: 'Content (HTML)', type: 'textarea' },
        { name: 'featuredImage', label: 'Featured Image URL', type: 'text' },
        { name: 'featured', label: 'Featured', type: 'checkbox' }
      ]
    };

    const fields = fieldConfigs[arrayPath] || [];
    
    let formHtml = `<div class="admin-card"><h3>Edit Item</h3>`;
    
    fields.forEach(field => {
      const value = item[field.name] || '';
      
      if (field.type === 'checkbox') {
        const checked = value ? 'checked' : '';
        formHtml += `
          <div class="form-group">
            <label>
              <input type="checkbox" id="edit-${field.name}" ${checked}> ${field.label}
            </label>
          </div>
        `;
      } else if (field.type === 'textarea') {
        formHtml += `
          <div class="form-group">
            <label>${field.label}</label>
            <textarea id="edit-${field.name}" class="admin-textarea">${this.escapeHtml(value)}</textarea>
          </div>
        `;
      } else {
        formHtml += `
          <div class="form-group">
            <label>${field.label}</label>
            <input type="text" id="edit-${field.name}" class="admin-input" value="${this.escapeHtml(value)}">
          </div>
        `;
      }
    });
    
    formHtml += `
      <div class="admin-actions">
        <button onclick="admin.saveArrayItemEdit('${arrayPath}', ${index})" class="btn btn-primary">💾 Save</button>
        <button onclick="admin.cancelArrayItemEdit()" class="btn btn-outline">❌ Cancel</button>
      </div>
    </div>`;
    
    // Create modal/overlay
    const overlay = document.createElement('div');
    overlay.id = 'edit-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: white;
      padding: 32px;
      border-radius: var(--radius);
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    `;
    modal.innerHTML = formHtml;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  },

  saveArrayItemEdit(arrayPath, index) {
    const array = window.EmpiriciUtils.getValueByPath(this.currentData, arrayPath);
    const item = array[index];
    
    // Update all fields
    const editElements = document.querySelectorAll('[id^="edit-"]');
    editElements.forEach(element => {
      const fieldName = element.id.replace('edit-', '');
      if (element.type === 'checkbox') {
        item[fieldName] = element.checked;
      } else {
        item[fieldName] = element.value;
      }
    });
    
    window.EmpiriciUtils.setValueByPath(this.currentData, arrayPath, array);
    
    this.cancelArrayItemEdit();
    this.renderAllArrays();
    this.saveChanges();
    this.showNotification('Item updated successfully!', 'success');
  },

  cancelArrayItemEdit() {
    const overlay = document.getElementById('edit-overlay');
    if (overlay) {
      overlay.remove();
    }
  },

  editSimpleArrayItem(arrayPath, index) {
    const array = window.EmpiriciUtils.getValueByPath(this.currentData, arrayPath);
    const item = array[index];
    
    const newValue = prompt('Edit item:', item);
    if (newValue !== null && newValue.trim() !== '') {
      array[index] = newValue.trim();
      window.EmpiriciUtils.setValueByPath(this.currentData, arrayPath, array);
      this.renderAllArrays();
      this.saveChanges();
      this.showNotification('Item updated!', 'success');
    }
  },

  deleteArrayItem(arrayPath, index) {
    if (confirm('Are you sure you want to delete this item?')) {
      const array = window.EmpiriciUtils.getValueByPath(this.currentData, arrayPath);
      array.splice(index, 1);
      window.EmpiriciUtils.setValueByPath(this.currentData, arrayPath, array);
      this.renderAllArrays();
      this.saveChanges();
      this.showNotification('Item deleted successfully!', 'success');
    }
  },

  saveChanges() {
    window.EmpiriciUtils.saveSiteData(this.currentData);
    this.showNotification('✅ Changes saved!', 'success');
  },

  updateDashboard() {
    const courses = window.EmpiriciUtils.getValueByPath(this.currentData, 'coursesPage.courses') || [];
    const posts = window.EmpiriciUtils.getValueByPath(this.currentData, 'blog.posts') || [];
    const messages = JSON.parse(localStorage.getItem('empirici:messages:v1') || '[]');
    
    document.getElementById('dashboard-courses-count').textContent = courses.length;
    document.getElementById('dashboard-posts-count').textContent = posts.length;
    document.getElementById('dashboard-messages-count').textContent = messages.length;
    
    const dataStr = JSON.stringify(this.currentData);
    const sizeKB = (new Blob([dataStr]).size / 1024).toFixed(2);
    document.getElementById('dashboard-storage').textContent = `💾 Using ${sizeKB} KB of localStorage`;
  },

  loadMessages() {
    const messages = JSON.parse(localStorage.getItem('empirici:messages:v1') || '[]');
    const messagesList = document.getElementById('messages-list');
    
    if (!messagesList) return;
    
    if (messages.length === 0) {
      messagesList.innerHTML = '<p style="color: var(--muted);">No messages yet.</p>';
      return;
    }
    
    messagesList.innerHTML = '';
    messages.reverse().forEach(msg => {
      const div = document.createElement('div');
      div.className = 'message-item';
      div.innerHTML = `
        <strong>${this.escapeHtml(msg.name)}</strong>
        <p>📧 ${this.escapeHtml(msg.email)}</p>
        ${msg.phone ? `<p>📱 ${this.escapeHtml(msg.phone)}</p>` : ''}
        ${msg.subject ? `<p>📋 Subject: ${this.escapeHtml(msg.subject)}</p>` : ''}
        <p>💬 ${this.escapeHtml(msg.message)}</p>
        <p style="font-size: 12px;">🕐 ${new Date(msg.createdAt).toLocaleString()}</p>
      `;
      messagesList.appendChild(div);
    });
  },

  exportJSON() {
    const dataStr = JSON.stringify(this.currentData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `empirici-site-data-${new Date().toISOString().split('T')[0]}.json`;
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
          const data = JSON.parse(e.target.result);
          this.currentData = data;
          this.loadData();
          this.saveChanges();
          this.showNotification('JSON imported successfully!', 'success');
        } catch (error) {
          this.showNotification('Error: Invalid JSON file', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  },

  resetToDefaults() {
    if (confirm('⚠️ Reset ALL content to defaults? This cannot be undone!')) {
      this.currentData = JSON.parse(JSON.stringify(window.DEFAULT_SITE_DATA));
      this.loadData();
      this.saveChanges();
      this.showNotification('Reset to defaults complete!', 'success');
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
      csv += `"${new Date(msg.createdAt).toLocaleString()}","${this.escapeCsv(msg.name)}","${this.escapeCsv(msg.email)}","${this.escapeCsv(msg.phone || '')}","${this.escapeCsv(msg.subject || '')}","${this.escapeCsv(msg.message)}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `messages-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    this.showNotification('Messages exported as CSV!', 'success');
  },

  clearMessages() {
    if (confirm('⚠️ Delete ALL messages? This cannot be undone!')) {
      localStorage.setItem('empirici:messages:v1', '[]');
      this.loadMessages();
      this.updateDashboard();
      this.showNotification('All messages cleared', 'success');
    }
  },

  previewSite() {
    window.open('/index.html', '_blank');
  },

  logout() {
    sessionStorage.removeItem('admin-authenticated');
    window.location.reload();
  },

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#3498db'};
      color: white;
      border-radius: var(--radius);
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      font-weight: 600;
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },

  escapeHtml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  escapeCsv(str) {
    if (!str) return '';
    return String(str).replace(/"/g, '""');
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  if (sessionStorage.getItem('admin-authenticated') === 'true') {
    if (window.EmpiriciUtils && window.DEFAULT_SITE_DATA) {
      admin.init();
    }
  }
});

window.admin = admin;
