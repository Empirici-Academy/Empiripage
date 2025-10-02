// main.js - FIXED VERSION with all improvements
// Shared loader and utilities for all pages

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
  
  // Fall back to default data
  if (window.DEFAULT_SITE_DATA) {
    return window.DEFAULT_SITE_DATA;
  } else {
    console.error('DEFAULT_SITE_DATA not found! Check script loading order.');
    return {};
  }
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
        
        // Add error handling for images
        element.onerror = function() {
          this.src = '/assets/placeholder.svg';
          this.alt = 'Image not available';
        };
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
  
  // Update contact form subjects dynamically
  updateContactSubjects(siteData);
}

// Update contact form subjects from site data
function updateContactSubjects(siteData) {
  const subjectSelect = document.getElementById('subject');
  if (!subjectSelect) return;
  
  const subjects = getValueByPath(siteData, 'contact.subjects') || [];
  
  // Clear existing options except the first one
  while (subjectSelect.options.length > 1) {
    subjectSelect.remove(1);
  }
  
  // Add subjects from site data - handle both string arrays and object arrays
  subjects.forEach(subject => {
    const subjectText = typeof subject === 'string' ? subject : subject.subject;
    if (subjectText) {
      const option = document.createElement('option');
      option.value = subjectText.toLowerCase().replace(/\s+/g, '-');
      option.textContent = subjectText;
      subjectSelect.appendChild(option);
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
      
      // Handle different data structures
      let value;
      if (typeof item === 'string' || typeof item === 'number') {
        // For simple arrays (like values, services, subjects)
        value = item;
      } else if (typeof item === 'object') {
        // For object arrays (like courses, team, testimonials)
        const fieldName = key.replace('[i].', '');
        value = item[fieldName];
      }
      
      if (value !== undefined && value !== null) {
        if (element.tagName === 'IMG') {
          element.src = value;
          element.onerror = function() {
            this.src = '/assets/placeholder.svg';
            this.alt = 'Image not available';
          };
        } else if (element.hasAttribute('data-html')) {
          element.innerHTML = value;
        } else if (element.hasAttribute('href') && !element.getAttribute('data-ignore-href')) {
          if (key.includes('badgerLink')) {
            element.href = value;
            // Hide the raw URL text for Badger links
            element.textContent = 'More Info';
          } else {
            element.href = value;
          }
        } else {
          element.textContent = value;
        }
      }
    });
    
    container.appendChild(clone);
  });
}

// Render featured content (courses and posts that are marked as featured)
function renderFeaturedContent() {
  const siteData = loadSiteData();
  
  // Render featured courses on homepage
  const featuredCoursesContainer = document.getElementById('featured-courses-container');
  const courseTemplate = document.querySelector('#course-template');
  
  if (featuredCoursesContainer && courseTemplate) {
    const allCourses = getValueByPath(siteData, 'coursesPage.courses') || [];
    const featuredCourses = allCourses.filter(course => course.featured === true);
    
    featuredCoursesContainer.innerHTML = '';
    
    featuredCourses.forEach((course, index) => {
      const clone = courseTemplate.content.cloneNode(true);
      const elements = clone.querySelectorAll('[data-key]');
      
      elements.forEach(element => {
        const key = element.getAttribute('data-key');
        const fieldName = key.replace('[i].', '');
        const value = course[fieldName];
        
        if (value !== undefined) {
          if (element.tagName === 'IMG') {
            element.src = value;
            element.onerror = function() {
              this.src = '/assets/placeholder.svg';
              this.alt = 'Image not available';
            };
          } else if (element.hasAttribute('data-html')) {
            element.innerHTML = value;
          } else if (element.hasAttribute('href')) {
            element.href = `/courses.html#${course.id}`;
          } else {
            element.textContent = value;
          }
        }
      });
      
      featuredCoursesContainer.appendChild(clone);
    });
  }
  
  // Render featured posts on homepage
  const featuredPostsContainer = document.getElementById('featured-posts-container');
  const postTemplate = document.querySelector('#featured-post-template');
  
  if (featuredPostsContainer && postTemplate) {
    const allPosts = getValueByPath(siteData, 'blog.posts') || [];
    const featuredPosts = allPosts.filter(post => post.featured === true);
    
    featuredPostsContainer.innerHTML = '';
    
    featuredPosts.forEach((post, index) => {
      const clone = postTemplate.content.cloneNode(true);
      const elements = clone.querySelectorAll('[data-key]');
      
      elements.forEach(element => {
        const key = element.getAttribute('data-key');
        const fieldName = key.replace('[i].', '');
        const value = post[fieldName];
        
        if (value !== undefined) {
          if (element.tagName === 'IMG') {
            element.src = value;
            element.onerror = function() {
              this.src = '/assets/placeholder.svg';
              this.alt = 'Image not available';
            };
          } else if (element.hasAttribute('data-html')) {
            element.innerHTML = value;
          } else if (element.hasAttribute('href')) {
            element.href = `/post.html?post=${post.slug}`;
          } else {
            element.textContent = value;
          }
        }
      });
      
      featuredPostsContainer.appendChild(clone);
    });
  }
}

// Handle contact form submission
function handleContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    
    // Get form data
    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value.trim(),
      createdAt: new Date().toISOString()
    };
    
    // Validate
    let isValid = true;
    
    if (!formData.name) {
      showFieldError('name', 'Name is required');
      isValid = false;
    }
    
    if (!formData.email || !isValidEmail(formData.email)) {
      showFieldError('email', 'Valid email is required');
      isValid = false;
    }
    
    if (!formData.subject || formData.subject === '') {
      showFieldError('subject', 'Please select a subject');
      isValid = false;
    }
    
    if (!formData.message) {
      showFieldError('message', 'Message is required');
      isValid = false;
    }
    
    if (!isValid) return;
    
    // Save to localStorage
    const messages = JSON.parse(localStorage.getItem('empirici:messages:v1') || '[]');
    messages.push(formData);
    localStorage.setItem('empirici:messages:v1', JSON.stringify(messages));
    
    // Show success message
    contactForm.style.display = 'none';
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
      <div class="success-icon">✓</div>
      <h3>Message Sent Successfully!</h3>
      <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
      <a href="/contact.html" class="btn btn-primary">Send Another Message</a>
    `;
    contactForm.parentElement.appendChild(successMessage);
  });
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.createElement('span');
  error.className = 'error-message';
  error.textContent = message;
  field.parentElement.appendChild(error);
  field.focus();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Load individual blog post
function loadBlogPost() {
  const urlParams = new URLSearchParams(window.location.search);
  const postSlug = urlParams.get('post');
  
  if (!postSlug) {
    document.querySelector('.blog-post-content').innerHTML = '<p>Post not found.</p>';
    return;
  }
  
  const siteData = loadSiteData();
  const posts = getValueByPath(siteData, 'blog.posts') || [];
  const post = posts.find(p => p.slug === postSlug);
  
  if (!post) {
    document.querySelector('.blog-post-content').innerHTML = '<p>Post not found.</p>';
    return;
  }
  
  // Update page title
  document.title = `${post.title} - Empirici Academy Blog`;
  
  // Update breadcrumb
  const breadcrumbTitle = document.querySelector('.breadcrumb .post-title');
  if (breadcrumbTitle) {
    breadcrumbTitle.textContent = post.title;
  }
  
  // Update post header
  const postTitle = document.querySelector('.blog-post-header h1');
  if (postTitle) {
    postTitle.textContent = post.title;
  }
  
  const postMeta = document.querySelector('.blog-post-meta');
  if (postMeta) {
    const date = new Date(post.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    postMeta.innerHTML = `<span>${date}</span> • <span>By ${post.author}</span>`;
  }
  
  // Update featured image
  const featuredImage = document.querySelector('.blog-post-featured-image-fixed');
  if (featuredImage && post.featuredImage) {
    featuredImage.src = post.featuredImage;
    featuredImage.alt = post.title;
  }
  
  // Update post content
  const postContent = document.querySelector('.blog-post-content');
  if (postContent && post.content) {
    postContent.innerHTML = post.content;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Empirici Academy site initializing...');
  
  // Setup mobile navigation
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded',
        navToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
      );
    });
  }
  
  // Render all dynamic content
  renderAll();
  
  // Render arrays that need special handling
  if (window.EmpiriciUtils) {
    // Home page arrays
    window.EmpiriciUtils.renderArray('#stats-container', '#stat-template', 'home.stats');
    window.EmpiriciUtils.renderArray('#testimonials-container', '#testimonial-template', 'home.testimonials');
    
    // About page arrays
    window.EmpiriciUtils.renderArray('#values-container', '#value-template', 'about.values');
    window.EmpiriciUtils.renderArray('#team-container', '#team-template', 'about.team');
    
    // Courses page arrays
    window.EmpiriciUtils.renderArray('#courses-container', '#course-detail-template', 'coursesPage.courses');
    
    // Collaboration page arrays
    window.EmpiriciUtils.renderArray('#services-container', '#service-template', 'collaboration.servicesOffered');
    
    // Blog page arrays
    window.EmpiriciUtils.renderArray('#blog-posts-container', '#blog-post-template', 'blog.posts');
    
    // Featured content
    renderFeaturedContent();
  }
  
  // Initialize contact form if present
  handleContactForm();
  
  // Load blog post if on post.html page
  if (window.location.pathname.includes('post.html')) {
    loadBlogPost();
  }
  
  // Update course action buttons with proper links
  setTimeout(() => {
    // Update course "More Info" buttons to hide raw URLs
    document.querySelectorAll('.course-actions .btn-outline').forEach(button => {
      if (button.href && button.href.includes('badger.com')) {
        button.textContent = 'More Info';
      }
    });
    
    // Update blog "Read More" buttons with proper slugs
    document.querySelectorAll('.blog-post-card .btn').forEach(link => {
      const titleElement = link.closest('.blog-post-card').querySelector('h2, h3');
      if (titleElement) {
        const title = titleElement.textContent;
        const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        link.href = `/post.html?post=${encodeURIComponent(slug)}`;
      }
    });
  }, 100);
  
  // Listen for storage events (when admin saves changes)
  window.addEventListener('storage', function() {
    renderAll();
    if (window.EmpiriciUtils) {
      window.EmpiriciUtils.renderArray('#stats-container', '#stat-template', 'home.stats');
      window.EmpiriciUtils.renderArray('#testimonials-container', '#testimonial-template', 'home.testimonials');
      window.EmpiriciUtils.renderArray('#values-container', '#value-template', 'about.values');
      window.EmpiriciUtils.renderArray('#team-container', '#team-template', 'about.team');
      window.EmpiriciUtils.renderArray('#courses-container', '#course-detail-template', 'coursesPage.courses');
      window.EmpiriciUtils.renderArray('#services-container', '#service-template', 'collaboration.servicesOffered');
      window.EmpiriciUtils.renderArray('#blog-posts-container', '#blog-post-template', 'blog.posts');
      renderFeaturedContent();
    }
  });
  
  console.log('✅ Empirici Academy site ready!');
});

// Export functions for use in other scripts
window.EmpiriciUtils = {
  getValueByPath,
  setValueByPath,
  loadSiteData,
  saveSiteData,
  renderAll,
  renderArray,
  renderFeaturedContent,
  loadBlogPost
};
