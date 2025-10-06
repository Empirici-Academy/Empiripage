// ================================
// Empirici Academy - Content & Data Layer
// Loads from external JSON file
// ================================

(function() {
    'use strict';
    // ================================
    // Load Data from JSON Files
    // ================================
    async function loadDataFromJSON() {
        try {
            // Load all three JSON files in parallel
            const [siteDataResponse, coursesResponse, blogPostsResponse] = await Promise.all([
                fetch('data/site-data.json'),
                fetch('data/courses.json'),
                fetch('data/blog-posts.json')
            ]);
            
            // Check if all responses are OK
            if (!siteDataResponse.ok || !coursesResponse.ok || !blogPostsResponse.ok) {
                throw new Error('Failed to load data');
            }
            
            // Parse all JSON
            const [siteData, coursesData, blogPostsData] = await Promise.all([
                siteDataResponse.json(),
                coursesResponse.json(),
                blogPostsResponse.json()
            ]);
            
            // Merge all data into one object
            return {
                ...siteData,
                courses: coursesData.courses,
                blogPosts: blogPostsData.blogPosts
            };
        } catch (error) {
            console.error('Error loading data:', error);
            return null;
        }
    }

    // ================================
    // Initialize localStorage with JSON data
    // ================================
    async function initializeData() {
        const hasData = localStorage.getItem('courses') && 
                       localStorage.getItem('blogPosts') && 
                       localStorage.getItem('team') && 
                       localStorage.getItem('testimonials') &&
                       localStorage.getItem('stats') &&
                       localStorage.getItem('siteSettings') &&
                       localStorage.getItem('contactSubjects') &&
                       localStorage.getItem('socialMedia');
        
        if (!hasData) {
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
    // Render Courses
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
        
        if (featured === true) {
            posts = posts.filter(p => p.featured === true);
        }
        
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
    // Render Footer with Dynamic Social Media
    // ================================
    function renderFooter() {
        const footer = document.getElementById('site-footer');
        if (!footer) return;
        
        const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
        const socialMedia = JSON.parse(localStorage.getItem('socialMedia') || '[]');
        
        const email = settings.email || 'info@empirici.academy';
        const phone = settings.phone || '+20 100 000 0000';
        const address = settings.address || 'Cairo, Egypt';
        
        // Filter visible social media
        const visibleSocials = socialMedia.filter(s => s.visible);
        
        // Generate social links HTML
        const socialLinksHTML = visibleSocials.map(social => `
            <a href="${social.url}" class="social-link" aria-label="${social.name}" target="_blank" rel="noopener">
                <img src="${social.icon}" alt="${social.name}" width="24" height="24" style="display: block;" />
            </a>
        `).join('');
        
        footer.innerHTML = `
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-column">
                        <h3 class="footer-title">Empirici Academy</h3>
                        <p class="footer-description">Empowering learners with practical data skills through hands-on experience and real-world projects.</p>
                        ${visibleSocials.length > 0 ? `<div class="footer-social">${socialLinksHTML}</div>` : ''}
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
    // ================================add this later, /this is for [phone] in footer 
    //                            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg><a href="tel:${phone.replace(/\s/g, '')}" class="footer-link">${phone}</a></li>


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
// ================================add this later, ///// contact page contact info item [phone]
//                    <div class="contact-info-item">
//                        <div class="contact-info-icon">
//                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
//                            </svg>
//                        </div>
//                        <div class="contact-info-content">
//                            <h3>Call Us</h3>
//                            <p><a href="tel:${phone.replace(/\s/g, '')}">${phone}</a></p>
//                        </div>
//                    </div>

    // ================================
    // Render Contact Form Subjects
    // ================================
    function renderContactSubjects() {
        const subjectSelect = document.getElementById('subject');
        if (!subjectSelect) return;
        
        const subjects = JSON.parse(localStorage.getItem('contactSubjects') || '[]');
        
        if (subjects.length === 0) {
            subjectSelect.innerHTML = '<option value="">Select a subject</option>';
            return;
        }
        
        subjectSelect.innerHTML = '<option value="">Select a subject</option>' + 
            subjects.map(subject => `<option value="${subject}">${subject}</option>`).join('');
    }

    // ================================
    // Initialize on page load
    // ================================
    document.addEventListener('DOMContentLoaded', async () => {
        await initializeData();
        
        renderStats();
        
        if (document.getElementById('courses-scroll')) {
            renderCourses('courses-scroll', null, true, false);
        }
        
        if (document.getElementById('blog-scroll')) {
            renderBlogPosts('blog-scroll', 3, true);
        }
        
        if (document.getElementById('testimonials-scroll')) {
            renderTestimonials('testimonials-scroll');
        }

        if (document.getElementById('courses-container')) {
            renderCourses('courses-container', null, false, true);
        }

        if (document.getElementById('blog-container')) {
            renderBlogPosts('blog-container', null, false);
        }

        if (document.getElementById('team-scroll')) {
            renderTeam('team-scroll');
        }
        
        if (document.getElementById('contact-info-container')) {
            renderContactInfo();
        }
        
        if (document.getElementById('subject')) {
            renderContactSubjects();
        }
        
        renderFooter();

        console.log('✓ Content loaded successfully from JSON');
    });

    window.EmpiriciContent = {
        renderCourses,
        renderBlogPosts,
        renderTeam,
        renderTestimonials,
        renderStats,
        renderFooter,
        renderContactInfo,
        renderContactSubjects,
        initializeData
    };
})();
