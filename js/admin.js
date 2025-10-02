// ================================
// Empirici Academy - Admin Panel JavaScript
// Complete CRUD operations with ALL new features
// Stats, Settings, Social Media, Featured Toggle
// ================================

(function() {
    'use strict';

    // ================================
    // Tab Navigation
    // ================================
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
            
            this.classList.add('active');
            const panelId = this.dataset.tab + '-panel';
            document.getElementById(panelId)?.classList.add('active');
        });
    });

    // ================================
    // COURSES MANAGEMENT with Featured Toggle
    // ================================
    
    function loadCourses() {
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const tbody = document.getElementById('courses-tbody');
        
        if (courses.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--gray-500);">No courses yet</td></tr>';
            return;
        }
        
        tbody.innerHTML = courses.map(course => `
            <tr>
                <td>${course.title}</td>
                <td><span style="text-transform: capitalize;">${course.level}</span></td>
                <td>${course.duration || 'N/A'}</td>
                <td>
                    <label class="featured-toggle">
                        <input type="checkbox" ${course.featured ? 'checked' : ''} 
                               onchange="toggleCourseFeatured(${course.id}, this.checked)">
                        ${course.featured ? '<span class="featured-badge">Featured</span>' : 'No'}
                    </label>
                </td>
                <td class="admin-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editCourse(${course.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCourse(${course.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    window.toggleCourseFeatured = function(id, featured) {
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const index = courses.findIndex(c => c.id === id);
        if (index !== -1) {
            courses[index].featured = featured;
            localStorage.setItem('courses', JSON.stringify(courses));
            loadCourses();
            showSuccessMessage(featured ? 'Course marked as featured!' : 'Course unmarked from featured');
        }
    };

    window.showAddCourseForm = function() {
        document.getElementById('course-form').style.display = 'block';
        document.getElementById('course-id').value = '';
        document.getElementById('course-title').value = '';
        document.getElementById('course-description').value = '';
        document.getElementById('course-level').value = 'beginner';
        document.getElementById('course-duration').value = '';
        document.getElementById('course-image').value = '';
        document.getElementById('course-badge').value = '';
        document.getElementById('course-featured').checked = false;
        document.getElementById('course-form').scrollIntoView({ behavior: 'smooth' });
    };

    window.cancelCourseForm = function() {
        document.getElementById('course-form').style.display = 'none';
    };

    window.editCourse = function(id) {
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const course = courses.find(c => c.id === id);
        
        if (!course) return;
        
        document.getElementById('course-form').style.display = 'block';
        document.getElementById('course-id').value = course.id;
        document.getElementById('course-title').value = course.title;
        document.getElementById('course-description').value = course.description;
        document.getElementById('course-level').value = course.level;
        document.getElementById('course-duration').value = course.duration || '';
        document.getElementById('course-image').value = course.image || '';
        document.getElementById('course-badge').value = course.badge || '';
        document.getElementById('course-featured').checked = course.featured || false;
        
        document.getElementById('course-form').scrollIntoView({ behavior: 'smooth' });
    };

    window.saveCourse = function(event) {
        event.preventDefault();
        
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const id = document.getElementById('course-id').value;
        
        const courseData = {
            id: id ? parseInt(id) : Date.now(),
            title: document.getElementById('course-title').value,
            description: document.getElementById('course-description').value,
            level: document.getElementById('course-level').value,
            duration: document.getElementById('course-duration').value,
            image: document.getElementById('course-image').value,
            badge: document.getElementById('course-badge').value,
            featured: document.getElementById('course-featured').checked
        };
        
        if (id) {
            const index = courses.findIndex(c => c.id === parseInt(id));
            if (index !== -1) {
                courses[index] = courseData;
            }
        } else {
            courses.push(courseData);
        }
        
        localStorage.setItem('courses', JSON.stringify(courses));
        loadCourses();
        cancelCourseForm();
        showSuccessMessage('Course saved successfully!');
    };

    window.deleteCourse = function(id) {
        if (!confirm('Are you sure you want to delete this course?')) return;
        
        let courses = JSON.parse(localStorage.getItem('courses') || '[]');
        courses = courses.filter(c => c.id !== id);
        localStorage.setItem('courses', JSON.stringify(courses));
        loadCourses();
        showSuccessMessage('Course deleted successfully!');
    };

    // ================================
    // BLOG POSTS MANAGEMENT with Featured Toggle
    // ================================
    
    function loadBlogPosts() {
        const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        const tbody = document.getElementById('blog-tbody');
        
        if (posts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--gray-500);">No blog posts yet</td></tr>';
            return;
        }
        
        tbody.innerHTML = posts.map(post => `
            <tr>
                <td>${post.title}</td>
                <td>${post.author || 'N/A'}</td>
                <td>${post.date}</td>
                <td>
                    <label class="featured-toggle">
                        <input type="checkbox" ${post.featured ? 'checked' : ''} 
                               onchange="toggleBlogFeatured(${post.id}, this.checked)">
                        ${post.featured ? '<span class="featured-badge">Featured</span>' : 'No'}
                    </label>
                </td>
                <td class="admin-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editBlogPost(${post.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteBlogPost(${post.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    window.toggleBlogFeatured = function(id, featured) {
        const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        const index = posts.findIndex(p => p.id === id);
        if (index !== -1) {
            posts[index].featured = featured;
            localStorage.setItem('blogPosts', JSON.stringify(posts));
            loadBlogPosts();
            showSuccessMessage(featured ? 'Post marked as featured!' : 'Post unmarked from featured');
        }
    };

    window.showAddBlogForm = function() {
        document.getElementById('blog-form').style.display = 'block';
        document.getElementById('blog-id').value = '';
        document.getElementById('blog-title').value = '';
        document.getElementById('blog-excerpt').value = '';
        document.getElementById('blog-content').value = '';
        document.getElementById('blog-author').value = '';
        document.getElementById('blog-date').value = '';
        document.getElementById('blog-image').value = '';
        document.getElementById('blog-featured').checked = false;
        document.getElementById('blog-form').scrollIntoView({ behavior: 'smooth' });
    };

    window.cancelBlogForm = function() {
        document.getElementById('blog-form').style.display = 'none';
    };

    window.editBlogPost = function(id) {
        const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        const post = posts.find(p => p.id === id);
        
        if (!post) return;
        
        document.getElementById('blog-form').style.display = 'block';
        document.getElementById('blog-id').value = post.id;
        document.getElementById('blog-title').value = post.title;
        document.getElementById('blog-excerpt').value = post.excerpt;
        document.getElementById('blog-content').value = post.content || post.excerpt;
        document.getElementById('blog-author').value = post.author || '';
        document.getElementById('blog-date').value = post.date;
        document.getElementById('blog-image').value = post.image || '';
        document.getElementById('blog-featured').checked = post.featured || false;
        
        document.getElementById('blog-form').scrollIntoView({ behavior: 'smooth' });
    };

    window.saveBlogPost = function(event) {
        event.preventDefault();
        
        const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        const id = document.getElementById('blog-id').value;
        
        const postData = {
            id: id ? parseInt(id) : Date.now(),
            title: document.getElementById('blog-title').value,
            excerpt: document.getElementById('blog-excerpt').value,
            content: document.getElementById('blog-content').value,
            author: document.getElementById('blog-author').value,
            date: document.getElementById('blog-date').value || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: document.getElementById('blog-image').value,
            featured: document.getElementById('blog-featured').checked
        };
        
        if (id) {
            const index = posts.findIndex(p => p.id === parseInt(id));
            if (index !== -1) {
                posts[index] = postData;
            }
        } else {
            posts.push(postData);
        }
        
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        loadBlogPosts();
        cancelBlogForm();
        showSuccessMessage('Blog post saved successfully!');
    };

    window.deleteBlogPost = function(id) {
        if (!confirm('Are you sure you want to delete this blog post?')) return;
        
        let posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        posts = posts.filter(p => p.id !== id);
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        loadBlogPosts();
        showSuccessMessage('Blog post deleted successfully!');
    };

    // ================================
    // TEAM MANAGEMENT
    // ================================
    
    function loadTeam() {
        const team = JSON.parse(localStorage.getItem('team') || '[]');
        const tbody = document.getElementById('team-tbody');
        
        if (team.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--gray-500);">No team members yet</td></tr>';
            return;
        }
        
        tbody.innerHTML = team.map(member => `
            <tr>
                <td>${member.name}</td>
                <td>${member.role}</td>
                <td class="admin-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editTeamMember(${member.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTeamMember(${member.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    window.showAddTeamForm = function() {
        document.getElementById('team-form').style.display = 'block';
        document.getElementById('team-id').value = '';
        document.getElementById('team-name').value = '';
        document.getElementById('team-role').value = '';
        document.getElementById('team-bio').value = '';
        document.getElementById('team-form').scrollIntoView({ behavior: 'smooth' });
    };

    window.cancelTeamForm = function() {
        document.getElementById('team-form').style.display = 'none';
    };

    window.editTeamMember = function(id) {
        const team = JSON.parse(localStorage.getItem('team') || '[]');
        const member = team.find(m => m.id === id);
        
        if (!member) return;
        
        document.getElementById('team-form').style.display = 'block';
        document.getElementById('team-id').value = member.id;
        document.getElementById('team-name').value = member.name;
        document.getElementById('team-role').value = member.role;
        document.getElementById('team-bio').value = member.bio;
        
        document.getElementById('team-form').scrollIntoView({ behavior: 'smooth' });
    };

    window.saveTeamMember = function(event) {
        event.preventDefault();
        
        const team = JSON.parse(localStorage.getItem('team') || '[]');
        const id = document.getElementById('team-id').value;
        
        const memberData = {
            id: id ? parseInt(id) : Date.now(),
            name: document.getElementById('team-name').value,
            role: document.getElementById('team-role').value,
            bio: document.getElementById('team-bio').value
        };
        
        if (id) {
            const index = team.findIndex(m => m.id === parseInt(id));
            if (index !== -1) {
                team[index] = memberData;
            }
        } else {
            team.push(memberData);
        }
        
        localStorage.setItem('team', JSON.stringify(team));
        loadTeam();
        cancelTeamForm();
        showSuccessMessage('Team member saved successfully!');
    };

    window.deleteTeamMember = function(id) {
        if (!confirm('Are you sure you want to delete this team member?')) return;
        
        let team = JSON.parse(localStorage.getItem('team') || '[]');
        team = team.filter(m => m.id !== id);
        localStorage.setItem('team', JSON.stringify(team));
        loadTeam();
        showSuccessMessage('Team member deleted successfully!');
    };
    // ================================
    // TESTIMONIALS MANAGEMENT
    // ================================
    
    function loadTestimonials() {
        const testimonials = JSON.parse(localStorage.getItem('testimonials') || '[]');
        const tbody = document.getElementById('testimonials-tbody');
        
        if (testimonials.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--gray-500);">No testimonials yet</td></tr>';
            return;
        }
        
        tbody.innerHTML = testimonials.map(testimonial => `
            <tr>
                <td>${testimonial.author}</td>
                <td>${testimonial.role}</td>
                <td style="max-width: 300px;">${testimonial.quote.substring(0, 100)}${testimonial.quote.length > 100 ? '...' : ''}</td>
                <td class="admin-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editTestimonial(${testimonial.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTestimonial(${testimonial.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    window.showAddTestimonialForm = function() {
        document.getElementById('testimonial-form').style.display = 'block';
        document.getElementById('testimonial-id').value = '';
        document.getElementById('testimonial-quote').value = '';
        document.getElementById('testimonial-author').value = '';
        document.getElementById('testimonial-role').value = '';
        document.getElementById('testimonial-form').scrollIntoView({ behavior: 'smooth' });
    };

    window.cancelTestimonialForm = function() {
        document.getElementById('testimonial-form').style.display = 'none';
    };

    window.editTestimonial = function(id) {
        const testimonials = JSON.parse(localStorage.getItem('testimonials') || '[]');
        const testimonial = testimonials.find(t => t.id === id);
        
        if (!testimonial) return;
        
        document.getElementById('testimonial-form').style.display = 'block';
        document.getElementById('testimonial-id').value = testimonial.id;
        document.getElementById('testimonial-quote').value = testimonial.quote;
        document.getElementById('testimonial-author').value = testimonial.author;
        document.getElementById('testimonial-role').value = testimonial.role;
        
        document.getElementById('testimonial-form').scrollIntoView({ behavior: 'smooth' });
    };

    window.saveTestimonial = function(event) {
        event.preventDefault();
        
        const testimonials = JSON.parse(localStorage.getItem('testimonials') || '[]');
        const id = document.getElementById('testimonial-id').value;
        
        const testimonialData = {
            id: id ? parseInt(id) : Date.now(),
            quote: document.getElementById('testimonial-quote').value,
            author: document.getElementById('testimonial-author').value,
            role: document.getElementById('testimonial-role').value
        };
        
        if (id) {
            const index = testimonials.findIndex(t => t.id === parseInt(id));
            if (index !== -1) {
                testimonials[index] = testimonialData;
            }
        } else {
            testimonials.push(testimonialData);
        }
        
        localStorage.setItem('testimonials', JSON.stringify(testimonials));
        loadTestimonials();
        cancelTestimonialForm();
        showSuccessMessage('Testimonial saved successfully!');
    };

    window.deleteTestimonial = function(id) {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;
        
        let testimonials = JSON.parse(localStorage.getItem('testimonials') || '[]');
        testimonials = testimonials.filter(t => t.id !== id);
        localStorage.setItem('testimonials', JSON.stringify(testimonials));
        loadTestimonials();
        showSuccessMessage('Testimonial deleted successfully!');
    };

    // ================================
    // STATS MANAGEMENT (NEW FEATURE)
    // ================================
    
    function loadStats() {
        const stats = JSON.parse(localStorage.getItem('stats') || '[]');
        const container = document.getElementById('stats-container');
        
        if (!container) return;
        
        if (stats.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--gray-500); grid-column: 1/-1;">No stats yet. Add stats to display on the homepage.</p>';
            return;
        }
        
        container.innerHTML = stats.map(stat => `
            <div class="stat-card">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <div style="font-size: var(--text-3xl); font-weight: 700; color: var(--teal-primary);">${stat.number}+</div>
                        <div style="color: var(--gray-600); margin-top: 0.5rem;">${stat.label}</div>
                    </div>
                    <div class="admin-actions" style="flex-direction: column;">
                        <button class="btn btn-sm btn-secondary" onclick="editStat(${stat.id})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteStat(${stat.id})">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    window.showAddStatForm = function() {
        document.getElementById('stat-form').style.display = 'block';
        document.getElementById('stat-id').value = '';
        document.getElementById('stat-number').value = '';
        document.getElementById('stat-label').value = '';
        document.getElementById('stat-form').scrollIntoView({ behavior: 'smooth' });
    };

    window.cancelStatForm = function() {
        document.getElementById('stat-form').style.display = 'none';
    };

    window.editStat = function(id) {
        const stats = JSON.parse(localStorage.getItem('stats') || '[]');
        const stat = stats.find(s => s.id === id);
        
        if (!stat) return;
        
        document.getElementById('stat-form').style.display = 'block';
        document.getElementById('stat-id').value = stat.id;
        document.getElementById('stat-number').value = stat.number;
        document.getElementById('stat-label').value = stat.label;
        
        document.getElementById('stat-form').scrollIntoView({ behavior: 'smooth' });
    };

    window.saveStat = function(event) {
        event.preventDefault();
        
        const stats = JSON.parse(localStorage.getItem('stats') || '[]');
        const id = document.getElementById('stat-id').value;
        
        const statData = {
            id: id ? parseInt(id) : Date.now(),
            number: parseInt(document.getElementById('stat-number').value),
            label: document.getElementById('stat-label').value
        };
        
        if (id) {
            const index = stats.findIndex(s => s.id === parseInt(id));
            if (index !== -1) {
                stats[index] = statData;
            }
        } else {
            stats.push(statData);
        }
        
        localStorage.setItem('stats', JSON.stringify(stats));
        loadStats();
        cancelStatForm();
        showSuccessMessage('Stat saved successfully!');
    };

    window.deleteStat = function(id) {
        if (!confirm('Are you sure you want to delete this stat?')) return;
        
        let stats = JSON.parse(localStorage.getItem('stats') || '[]');
        stats = stats.filter(s => s.id !== id);
        localStorage.setItem('stats', JSON.stringify(stats));
        loadStats();
        showSuccessMessage('Stat deleted successfully!');
    };

    // ================================
    // SITE SETTINGS - Contact Info & Social Media (NEW FEATURE)
    // ================================
    
    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
        
        // Load contact info
        document.getElementById('settings-email').value = settings.email || '';
        document.getElementById('settings-phone').value = settings.phone || '';
        document.getElementById('settings-address').value = settings.address || '';
        
        // Load social media
        document.getElementById('settings-facebook').value = settings.facebook || '';
        document.getElementById('settings-linkedin').value = settings.linkedin || '';
        document.getElementById('settings-twitter').value = settings.twitter || '';
    }

    window.saveContactInfo = function(event) {
        event.preventDefault();
        
        const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
        
        settings.email = document.getElementById('settings-email').value;
        settings.phone = document.getElementById('settings-phone').value;
        settings.address = document.getElementById('settings-address').value;
        
        localStorage.setItem('siteSettings', JSON.stringify(settings));
        showSuccessMessage('Contact information saved successfully!');
    };

    window.saveSocialMedia = function(event) {
        event.preventDefault();
        
        const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
        
        settings.facebook = document.getElementById('settings-facebook').value;
        settings.linkedin = document.getElementById('settings-linkedin').value;
        settings.twitter = document.getElementById('settings-twitter').value;
        
        localStorage.setItem('siteSettings', JSON.stringify(settings));
        showSuccessMessage('Social media links saved successfully!');
    };

    // ================================
    // DATA MANAGEMENT
    // ================================
    
    window.exportData = function() {
        const data = {
            courses: JSON.parse(localStorage.getItem('courses') || '[]'),
            blogPosts: JSON.parse(localStorage.getItem('blogPosts') || '[]'),
            team: JSON.parse(localStorage.getItem('team') || '[]'),
            testimonials: JSON.parse(localStorage.getItem('testimonials') || '[]'),
            stats: JSON.parse(localStorage.getItem('stats') || '[]'),
            siteSettings: JSON.parse(localStorage.getItem('siteSettings') || '{}')
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `empirici-academy-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        showSuccessMessage('Data exported successfully!');
    };

    window.importData = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.courses) localStorage.setItem('courses', JSON.stringify(data.courses));
                if (data.blogPosts) localStorage.setItem('blogPosts', JSON.stringify(data.blogPosts));
                if (data.team) localStorage.setItem('team', JSON.stringify(data.team));
                if (data.testimonials) localStorage.setItem('testimonials', JSON.stringify(data.testimonials));
                if (data.stats) localStorage.setItem('stats', JSON.stringify(data.stats));
                if (data.siteSettings) localStorage.setItem('siteSettings', JSON.stringify(data.siteSettings));
                
                loadCourses();
                loadBlogPosts();
                loadTeam();
                loadTestimonials();
                loadStats();
                loadSettings();
                
                showSuccessMessage('Data imported successfully! Page will reload in 2 seconds...');
                setTimeout(() => window.location.reload(), 2000);
            } catch (error) {
                alert('Error importing data. Please check the file format.');
                console.error(error);
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    };

    window.clearAllData = function() {
        if (!confirm('⚠️ WARNING: This will delete ALL content from the website including courses, blog posts, team, testimonials, stats, and settings. Are you absolutely sure?')) return;
        if (!confirm('This action cannot be undone. Click OK to proceed with clearing all data.')) return;
        
        localStorage.removeItem('courses');
        localStorage.removeItem('blogPosts');
        localStorage.removeItem('team');
        localStorage.removeItem('testimonials');
        localStorage.removeItem('stats');
        localStorage.removeItem('siteSettings');
        
        loadCourses();
        loadBlogPosts();
        loadTeam();
        loadTestimonials();
        loadStats();
        loadSettings();
        
        showSuccessMessage('All data cleared! Reloading page...');
        setTimeout(() => window.location.reload(), 1500);
    };

    // ================================
    // SUCCESS MESSAGE
    // ================================
    
    function showSuccessMessage(message) {
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-message';
        messageDiv.textContent = message;
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '2rem';
        messageDiv.style.right = '2rem';
        messageDiv.style.zIndex = '9999';
        messageDiv.style.animation = 'slideInRight 0.3s ease-out';
        messageDiv.style.padding = '1rem 1.5rem';
        messageDiv.style.borderRadius = 'var(--radius-lg)';
        messageDiv.style.boxShadow = 'var(--shadow-xl)';
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ================================
    // INITIALIZE ON PAGE LOAD
    // ================================
    
    document.addEventListener('DOMContentLoaded', function() {
        loadCourses();
        loadBlogPosts();
        loadTeam();
        loadTestimonials();
        loadStats();
        loadSettings();
        
        console.log('✓ Admin panel loaded successfully with all features');
        console.log('✓ Features: Courses, Blog, Team, Testimonials, Stats, Settings');
    });

})();
