// ================================
// Empirici Academy - Content & Data Layer
// Loads from external JSON file
// ================================

(function() {
    'use strict';

    // ================================
    // Load Data from JSON File
    // ================================
    async function loadDataFromJSON() {
        try {
            const response = await fetch('data/site-data.json');
            if (!response.ok) {
                throw new Error('Failed to load data');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error loading data:', error);
            return null;
        }
    }

    // ================================
    // Initialize localStorage with JSON data
    // ================================
    async function initializeData() {
        // Check if data already exists
        const hasData = localStorage.getItem('courses') && 
                       localStorage.getItem('blogPosts') && 
                       localStorage.getItem('team') && 
                       localStorage.getItem('testimonials') &&
                       localStorage.getItem('stats') &&
                       localStorage.getItem('siteSettings');
        
        if (!hasData) {
            // Load from JSON file
            const data = await loadDataFromJSON();
            if (data) {
                Object.keys(data).forEach(key => {
                    localStorage.setItem(key, JSON.stringify(data[key]));
                });
                console.log('✓ Data loaded from JSON file');
            }
        }
    }

    // ================================
    // Render Homepage Stats
    // ================================
    function renderStats() {
        const statsContainer = document.getElementById('hero-stats');
        if (!statsContainer) return;
        
        const stats = JSON.parse(localStorage.getItem('stats') || '[]');
        
        if (stats.length === 0) {
            statsContainer.style.display = 'none';
            return;
        }
        
        statsContainer.innerHTML = stats.map(stat => `
            <div class="stat-item">
                <div class="stat-number" data-count="${stat.number}">${stat.number}</div>
                <div class="stat-label">${stat.label}</div>
            </div>
        `).join('');
    }

    // ================================
    // Render Courses with Badge Link
    // ================================
    function renderCourses(containerId = 'courses-grid', limit = null, featured = false, showBadge = true) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let courses = JSON.parse(localStorage.getItem('courses') || '[]');
        
        if (featured) {
            courses = courses.filter(c => c.featured);
        }
        
        if (limit) {
            courses = courses.slice(0, limit);
        }

        if (courses.length === 0) {
            const isGrid = containerId.includes('grid') || containerId.includes('container');
            const emptyStyle = isGrid ? 'grid-column: 1/-1;' : '';
            container.innerHTML = `<p style="text-align: center; color: var(--gray-500); ${emptyStyle}">No courses available yet.</p>`;
            return;
        }

        container.innerHTML = courses.map(course => `
            <article class="course-card" data-level="${course.level}">
                ${course.image ? `<img src="${course.image}" alt="${course.title}" class="course-image" loading="lazy">` : ''}
                <div class="course-content">
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-description">${course.description}</p>
                    <div class="course-meta">
                        <span class="course-badge">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                            ${course.duration || 'Self-paced'}
                        </span>
                        <span class="course-badge">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="8.5" cy="7" r="4"/>
                                <polyline points="17 11 19 13 23 9"/>
                            </svg>
                            ${course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                        </span>
                    </div>
                    <div class="course-actions">
                        <a href="contact.html" class="course-link">
                            Enroll Now
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"/>
                            </svg>
                        </a>
                        ${showBadge && course.badge ? `
                        <a href="${course.badge}" target="_blank" rel="noopener noreferrer" class="course-badge-link" title="View Badge">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                        </a>
                        ` : ''}
                    </div>
                </div>
            </article>
        `).join('');
    }

    // ================================
    // Render Blog Posts
    // ================================
    function renderBlogPosts(containerId = 'blog-grid', limit = null, featured = false) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        
        // ONLY filter featured if explicitly requested
        if (featured === true) {
            posts = posts.filter(p => p.featured === true);
        }
        
        // Sort by date (newest first)
        posts.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        });
        
        if (limit) {
            posts = posts.slice(0, limit);
        }

        if (posts.length === 0) {
            const isGrid = containerId.includes('grid') || containerId.includes('container');
            const emptyStyle = isGrid ? 'grid-column: 1/-1;' : '';
            container.innerHTML = `<p style="text-align: center; color: var(--gray-500); ${emptyStyle}">No blog posts available yet.</p>`;
            return;
        }

        container.innerHTML = posts.map(post => `
            <article class="blog-card">
                ${post.image ? `<img src="${post.image}" alt="${post.title}" class="blog-image" loading="lazy">` : ''}
                <div class="blog-content">
                    <div class="blog-meta-stacked">
                        ${post.author ? `<div class="blog-author">By ${post.author}</div>` : ''}
                        <div class="blog-date">${post.date}</div>
                    </div>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <a href="post.html?id=${post.id}" class="blog-link">
                        Read More
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"/>
                        </svg>
                    </a>
                </div>
            </article>
        `).join('');
    }

    // ================================
    // Render Team Members
    // ================================
    function renderTeam(containerId = 'team-grid') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const team = JSON.parse(localStorage.getItem('team') || '[]');

        if (team.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--gray-500);">No team members available yet.</p>';
            return;
        }

        container.innerHTML = team.map(member => `
            <article class="team-card">
                <h3 class="team-name">${member.name}</h3>
                <p class="team-role">${member.role}</p>
                <p class="team-bio">${member.bio}</p>
            </article>
        `).join('');
    }

    // ================================
    // Render Testimonials
    // ================================
    function renderTestimonials(containerId = 'testimonials-grid') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const testimonials = JSON.parse(localStorage.getItem('testimonials') || '[]');

        if (testimonials.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--gray-500);">No testimonials available yet.</p>';
            return;
        }

        container.innerHTML = testimonials.map(testimonial => `
            <article class="testimonial-card">
                <p class="testimonial-quote">"${testimonial.quote}"</p>
                <p class="testimonial-author">${testimonial.author}</p>
                <p class="testimonial-role">${testimonial.role}</p>
            </article>
        `).join('');
    }

    // ================================
    // Render Footer with Dynamic Settings
    // ================================
    function renderFooter() {
        const footer = document.getElementById('site-footer');
        if (!footer) return;
        
        const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
        const email = settings.email || 'info@empirici.academy';
        const phone = settings.phone || '+20 100 000 0000';
        const address = settings.address || 'Cairo, Egypt';
        const facebook = settings.facebook || '#';
        const linkedin = settings.linkedin || '#';
        const twitter = settings.twitter || '#';
        
        footer.innerHTML = `
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-column">
                        <h3 class="footer-title">Empirici Academy</h3>
                        <p class="footer-description">Empowering learners with practical data skills through hands-on experience and real-world projects.</p>
                        <div class="footer-social">
                            <a href="${facebook}" class="social-link" aria-label="Facebook" target="_blank" rel="noopener">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </a>
                            <a href="${linkedin}" class="social-link" aria-label="LinkedIn" target="_blank" rel="noopener">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                            </a>
                            <a href="${twitter}" class="social-link" aria-label="Twitter" target="_blank" rel="noopener">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                            </a>
                        </div>
                    </div>
                    <div class="footer-column">
                        <h4 class="footer-heading">Quick Links</h4>
                        <ul class="footer-links">
                            <li><a href="courses.html" class="footer-link">Courses</a></li>
                            <li><a href="about.html" class="footer-link">About Us</a></li>
                            <li><a href="blog.html" class="footer-link">Blog</a></li>
                            <li><a href="collaboration.html" class="footer-link">Collaborate</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h4 class="footer-heading">Resources</h4>
                        <ul class="footer-links">
                            <li><a href="#" class="footer-link">Student Portal</a></li>
                            <li><a href="#" class="footer-link">Course Materials</a></li>
                            <li><a href="#" class="footer-link">FAQs</a></li>
                            <li><a href="contact.html" class="footer-link">Support</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h4 class="footer-heading">Contact</h4>
                        <ul class="footer-contact">
                            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span>${address}</span></li>
                            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><a href="mailto:${email}" class="footer-link">${email}</a></li>
                            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg><a href="tel:${phone.replace(/\s/g, '')}" class="footer-link">${phone}</a></li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p class="footer-copyright">&copy; 2025 Empirici Academy. All rights reserved.</p>
                    <div class="footer-legal">
                        <a href="#" class="footer-link">Privacy Policy</a>
                        <span>•</span>
                        <a href="#" class="footer-link">Terms of Service</a>
                    </div>
                </div>
            </div>
        `;
    }

    // ================================
    // Render Contact Info
    // ================================
    function renderContactInfo() {
        const container = document.getElementById('contact-info-container');
        if (!container) return;
        
        const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
        const email = settings.email || 'info@empirici.academy';
        const phone = settings.phone || '+20 100 000 0000';
        const address = settings.address || 'Cairo, Egypt';
        
        container.innerHTML = `
            <div>
                <h2 style="margin-bottom: 2rem;">Contact Information</h2>
                <div class="contact-info">
                    <div class="contact-info-item">
                        <div class="contact-info-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                        </div>
                        <div class="contact-info-content">
                            <h3>Our Location</h3>
                            <p>${address}</p>
                        </div>
                    </div>
                    <div class="contact-info-item">
                        <div class="contact-info-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                        </div>
                        <div class="contact-info-content">
                            <h3>Email Us</h3>
                            <p><a href="mailto:${email}">${email}</a></p>
                        </div>
                    </div>
                    <div class="contact-info-item">
                        <div class="contact-info-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                        </div>
                        <div class="contact-info-content">
                            <h3>Call Us</h3>
                            <p><a href="tel:${phone.replace(/\s/g, '')}">${phone}</a></p>
                        </div>
                    </div>
                    <div class="contact-info-item">
                        <div class="contact-info-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                        </div>
                        <div class="contact-info-content">
                            <h3>Business Hours</h3>
                            <p>Sunday - Thursday: 9 AM - 6 PM<br>Friday - Saturday: Closed</p>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 3rem; padding: 2rem; background: var(--gray-50); border-radius: var(--radius-xl); border: 1px solid var(--gray-200);">
                    <h3 style="margin-bottom: 1rem;">Response Time</h3>
                    <p style="color: var(--gray-600); line-height: 1.8; margin-bottom: 0;">
                        We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.
                    </p>
                </div>
            </div>
        `;
    }

    // ================================
    // Initialize on page load
    // ================================
    document.addEventListener('DOMContentLoaded', async () => {
        await initializeData();
        
        // Render stats
        renderStats();
        
        // Homepage - Featured only
        if (document.getElementById('courses-scroll')) {
            renderCourses('courses-scroll', null, true, false); // Featured, no badge
        }
        
        if (document.getElementById('blog-scroll')) {
            renderBlogPosts('blog-scroll', 3, true); // Featured blog only
        }
        
        if (document.getElementById('testimonials-scroll')) {
            renderTestimonials('testimonials-scroll');
        }

        // Courses page - All courses with badge
        if (document.getElementById('courses-container')) {
            renderCourses('courses-container', null, false, true); // All courses, show badge
        }

        // Blog page - All posts
        if (document.getElementById('blog-container')) {
            renderBlogPosts('blog-container', null, false); // All posts
        }

        // About page
        if (document.getElementById('team-scroll')) {
            renderTeam('team-scroll');
        }
        
        // Contact page
        if (document.getElementById('contact-info-container')) {
            renderContactInfo();
        }
        
        // Render footer on all pages
        renderFooter();

        console.log('✓ Content loaded successfully from JSON');
    });

    // Export functions
    window.EmpiriciContent = {
        renderCourses,
        renderBlogPosts,
        renderTeam,
        renderTestimonials,
        renderStats,
        renderFooter,
        renderContactInfo,
        initializeData
    };
})();
