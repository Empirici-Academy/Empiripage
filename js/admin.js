// ================================
// Empirici Academy - Admin Panel JavaScript
// Complete CRUD operations with Contact Subjects & Social Media
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
    // COURSES MANAGEMENT
    // ================================
    function loadCourses() {
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const tbody = document.getElementById('courses-table-body');
        
        if (courses.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--gray-500);">No courses yet</td></tr>';
            return;
        }
        
        tbody.innerHTML = courses.map(course => `
            <tr>
                <td>${course.title}</td>
                <td>${course.level}</td>
                <td>${course.duration}</td>
                <td>
                    <input type="checkbox" ${course.featured ? 'checked' : ''} 
                           onchange="toggleCourseFeatured(${course.id})">
                </td>
                <td>
                    <button class="admin-btn admin-btn-secondary" onclick="editCourse(${course.id})" style="margin-right: 0.5rem;">Edit</button>
                    <button class="admin-btn admin-btn-danger" onclick="deleteCourse(${course.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    window.openCourseModal = function(id = null) {
        const modal = document.getElementById('course-modal');
        const form = document.getElementById('course-form');
        const title = document.getElementById('course-modal-title');
        
        form.reset();
        
        if (id) {
            const courses = JSON.parse(localStorage.getItem('courses') || '[]');
            const course = courses.find(c => c.id === id);
            if (course) {
                title.textContent = 'Edit Course';
                document.getElementById('course-id').value = course.id;
                document.getElementById('course-title').value = course.title;
                document.getElementById('course-description').value = course.description;
                document.getElementById('course-level').value = course.level;
                document.getElementById('course-duration').value = course.duration;
                document.getElementById('course-image').value = course.image || '';
                document.getElementById('course-badge').value = course.badge || '';
                document.getElementById('course-featured').checked = course.featured || false;
            }
        } else {
            title.textContent = 'Add Course';
        }
        
        modal.classList.add('active');
    };

    window.closeCourseModal = function() {
        document.getElementById('course-modal').classList.remove('active');
    };

    window.editCourse = function(id) {
        openCourseModal(id);
    };

    window.deleteCourse = function(id) {
        if (!confirm('Are you sure you want to delete this course?')) return;
        
        let courses = JSON.parse(localStorage.getItem('courses') || '[]');
        courses = courses.filter(c => c.id !== id);
        localStorage.setItem('courses', JSON.stringify(courses));
        loadCourses();
    };

    window.toggleCourseFeatured = function(id) {
        let courses = JSON.parse(localStorage.getItem('courses') || '[]');
        const course = courses.find(c => c.id === id);
        if (course) {
            course.featured = !course.featured;
            localStorage.setItem('courses', JSON.stringify(courses));
        }
    };

    document.getElementById('course-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
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
        
        let courses = JSON.parse(localStorage.getItem('courses') || '[]');
        
        if (id) {
            const index = courses.findIndex(c => c.id === parseInt(id));
            if (index !== -1) courses[index] = courseData;
        } else {
            courses.push(courseData);
        }
        
        localStorage.setItem('courses', JSON.stringify(courses));
        loadCourses();
        closeCourseModal();
    });

    // ================================
    // BLOG POSTS MANAGEMENT
    // ================================
    function loadBlogPosts() {
        const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        const tbody = document.getElementById('blog-table-body');
        
        if (posts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--gray-500);">No blog posts yet</td></tr>';
            return;
        }
        
        tbody.innerHTML = posts.map(post => `
            <tr>
                <td>${post.title}</td>
                <td>${post.author}</td>
                <td>${post.date}</td>
                <td>
                    <input type="checkbox" ${post.featured ? 'checked' : ''} 
                           onchange="toggleBlogFeatured(${post.id})">
                </td>
                <td>
                    <button class="admin-btn admin-btn-secondary" onclick="editBlog(${post.id})" style="margin-right: 0.5rem;">Edit</button>
                    <button class="admin-btn admin-btn-danger" onclick="deleteBlog(${post.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    window.openBlogModal = function(id = null) {
        const modal = document.getElementById('blog-modal');
        const form = document.getElementById('blog-form');
        const title = document.getElementById('blog-modal-title');
        
        form.reset();
        
        if (id) {
            const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
            const post = posts.find(p => p.id === id);
            if (post) {
                title.textContent = 'Edit Blog Post';
                document.getElementById('blog-id').value = post.id;
                document.getElementById('blog-title').value = post.title;
                document.getElementById('blog-excerpt').value = post.excerpt;
                document.getElementById('blog-content').value = post.content;
                document.getElementById('blog-author').value = post.author;
                document.getElementById('blog-date').value = post.date;
                document.getElementById('blog-image').value = post.image || '';
                document.getElementById('blog-featured').checked = post.featured || false;
            }
        } else {
            title.textContent = 'Add Blog Post';
        }
        
        modal.classList.add('active');
    };

    window.closeBlogModal = function() {
        document.getElementById('blog-modal').classList.remove('active');
    };

    window.editBlog = function(id) {
        openBlogModal(id);
    };

    window.deleteBlog = function(id) {
        if (!confirm('Are you sure you want to delete this blog post?')) return;
        
        let posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        posts = posts.filter(p => p.id !== id);
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        loadBlogPosts();
    };

    window.toggleBlogFeatured = function(id) {
        let posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        const post = posts.find(p => p.id === id);
        if (post) {
            post.featured = !post.featured;
            localStorage.setItem('blogPosts', JSON.stringify(posts));
        }
    };

    document.getElementById('blog-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = document.getElementById('blog-id').value;
        const postData = {
            id: id ? parseInt(id) : Date.now(),
            title: document.getElementById('blog-title').value,
            excerpt: document.getElementById('blog-excerpt').value,
            content: document.getElementById('blog-content').value,
            author: document.getElementById('blog-author').value,
            date: document.getElementById('blog-date').value,
            image: document.getElementById('blog-image').value,
            featured: document.getElementById('blog-featured').checked
        };
        
        let posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        
        if (id) {
            const index = posts.findIndex(p => p.id === parseInt(id));
            if (index !== -1) posts[index] = postData;
        } else {
            posts.push(postData);
        }
        
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        loadBlogPosts();
        closeBlogModal();
    });

    // ================================
    // TEAM MANAGEMENT
    // ================================
    function loadTeam() {
        const team = JSON.parse(localStorage.getItem('team') || '[]');
        const tbody = document.getElementById('team-table-body');
        
        if (team.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--gray-500);">No team members yet</td></tr>';
            return;
        }
        
        tbody.innerHTML = team.map(member => `
            <tr>
                <td>${member.name}</td>
                <td>${member.role}</td>
                <td>
                    <button class="admin-btn admin-btn-secondary" onclick="editTeam(${member.id})" style="margin-right: 0.5rem;">Edit</button>
                    <button class="admin-btn admin-btn-danger" onclick="deleteTeam(${member.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    window.openTeamModal = function(id = null) {
        const modal = document.getElementById('team-modal');
        const form = document.getElementById('team-form');
        const title = document.getElementById('team-modal-title');
        
        form.reset();
        
        if (id) {
            const team = JSON.parse(localStorage.getItem('team') || '[]');
            const member = team.find(m => m.id === id);
            if (member) {
                title.textContent = 'Edit Team Member';
                document.getElementById('team-id').value = member.id;
                document.getElementById('team-name').value = member.name;
                document.getElementById('team-role').value = member.role;
                document.getElementById('team-bio').value = member.bio;
            }
        } else {
            title.textContent = 'Add Team Member';
        }
        
        modal.classList.add('active');
    };

    window.closeTeamModal = function() {
        document.getElementById('team-modal').classList.remove('active');
    };

    window.editTeam = function(id) {
        openTeamModal(id);
    };

    window.deleteTeam = function(id) {
        if (!confirm('Are you sure you want to delete this team member?')) return;
        
        let team = JSON.parse(localStorage.getItem('team') || '[]');
        team = team.filter(m => m.id !== id);
        localStorage.setItem('team', JSON.stringify(team));
        loadTeam();
    };

    document.getElementById('team-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = document.getElementById('team-id').value;
        const memberData = {
            id: id ? parseInt(id) : Date.now(),
            name: document.getElementById('team-name').value,
            role: document.getElementById('team-role').value,
            bio: document.getElementById('team-bio').value
        };
        
        let team = JSON.parse(localStorage.getItem('team') || '[]');
        
        if (id) {
            const index = team.findIndex(m => m.id === parseInt(id));
            if (index !== -1) team[index] = memberData;
        } else {
            team.push(memberData);
        }
        
        localStorage.setItem('team', JSON.stringify(team));
        loadTeam();
        closeTeamModal();
    });

    // ================================
    // TESTIMONIALS MANAGEMENT
    // ================================
    function loadTestimonials() {
        const testimonials = JSON.parse(localStorage.getItem('testimonials') || '[]');
        const tbody = document.getElementById('testimonials-table-body');
        
        if (testimonials.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--gray-500);">No testimonials yet</td></tr>';
            return;
        }
        
        tbody.innerHTML = testimonials.map(t => `
            <tr>
                <td>${t.author}</td>
                <td>${t.role}</td>
                <td>${t.quote.substring(0, 50)}...</td>
                <td>
                    <button class="admin-btn admin-btn-secondary" onclick="editTestimonial(${t.id})" style="margin-right: 0.5rem;">Edit</button>
                    <button class="admin-btn admin-btn-danger" onclick="deleteTestimonial(${t.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    window.openTestimonialModal = function(id = null) {
        const modal = document.getElementById('testimonial-modal');
        const form = document.getElementById('testimonial-form');
        const title = document.getElementById('testimonial-modal-title');
        
        form.reset();
        
        if (id) {
            const testimonials = JSON.parse(localStorage.getItem('testimonials') || '[]');
            const testimonial = testimonials.find(t => t.id === id);
            if (testimonial) {
                title.textContent = 'Edit Testimonial';
                document.getElementById('testimonial-id').value = testimonial.id;
                document.getElementById('testimonial-quote').value = testimonial.quote;
                document.getElementById('testimonial-author').value = testimonial.author;
                document.getElementById('testimonial-role').value = testimonial.role;
            }
        } else {
            title.textContent = 'Add Testimonial';
        }
        
        modal.classList.add('active');
    };

    window.closeTestimonialModal = function() {
        document.getElementById('testimonial-modal').classList.remove('active');
    };

    window.editTestimonial = function(id) {
        openTestimonialModal(id);
    };

    window.deleteTestimonial = function(id) {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;
        
        let testimonials = JSON.parse(localStorage.getItem('testimonials') || '[]');
        testimonials = testimonials.filter(t => t.id !== id);
        localStorage.setItem('testimonials', JSON.stringify(testimonials));
        loadTestimonials();
    };

    document.getElementById('testimonial-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = document.getElementById('testimonial-id').value;
        const testimonialData = {
            id: id ? parseInt(id) : Date.now(),
            quote: document.getElementById('testimonial-quote').value,
            author: document.getElementById('testimonial-author').value,
            role: document.getElementById('testimonial-role').value
        };
        
        let testimonials = JSON.parse(localStorage.getItem('testimonials') || '[]');
        
        if (id) {
            const index = testimonials.findIndex(t => t.id === parseInt(id));
            if (index !== -1) testimonials[index] = testimonialData;
        } else {
            testimonials.push(testimonialData);
        }
        
        localStorage.setItem('testimonials', JSON.stringify(testimonials));
        loadTestimonials();
        closeTestimonialModal();
    });

    // ================================
    // STATS MANAGEMENT
    // ================================
    function loadStats() {
        const stats = JSON.parse(localStorage.getItem('stats') || '[]');
        const tbody = document.getElementById('stats-table-body');
        
        if (stats.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--gray-500);">No statistics yet</td></tr>';
            return;
        }
        
        tbody.innerHTML = stats.map(stat => `
            <tr>
                <td>${stat.number}</td>
                <td>${stat.label}</td>
                <td>
                    <button class="admin-btn admin-btn-secondary" onclick="editStat(${stat.id})" style="margin-right: 0.5rem;">Edit</button>
                    <button class="admin-btn admin-btn-danger" onclick="deleteStat(${stat.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    window.openStatModal = function(id = null) {
        const modal = document.getElementById('stat-modal');
        const form = document.getElementById('stat-form');
        const title = document.getElementById('stat-modal-title');
        
        form.reset();
        
        if (id) {
            const stats = JSON.parse(localStorage.getItem('stats') || '[]');
            const stat = stats.find(s => s.id === id);
            if (stat) {
                title.textContent = 'Edit Statistic';
                document.getElementById('stat-id').value = stat.id;
                document.getElementById('stat-number').value = stat.number;
                document.getElementById('stat-label').value = stat.label;
            }
        } else {
            title.textContent = 'Add Statistic';
        }
        
        modal.classList.add('active');
    };

    window.closeStatModal = function() {
        document.getElementById('stat-modal').classList.remove('active');
    };

    window.editStat = function(id) {
        openStatModal(id);
    };

    window.deleteStat = function(id) {
        if (!confirm('Are you sure you want to delete this statistic?')) return;
        
        let stats = JSON.parse(localStorage.getItem('stats') || '[]');
        stats = stats.filter(s => s.id !== id);
        localStorage.setItem('stats', JSON.stringify(stats));
        loadStats();
    };

    document.getElementById('stat-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = document.getElementById('stat-id').value;
        const statData = {
            id: id ? parseInt(id) : Date.now(),
            number: parseInt(document.getElementById('stat-number').value),
            label: document.getElementById('stat-label').value
        };
        
        let stats = JSON.parse(localStorage.getItem('stats') || '[]');
        
        if (id) {
            const index = stats.findIndex(s => s.id === parseInt(id));
            if (index !== -1) stats[index] = statData;
        } else {
            stats.push(statData);
        }
        
        localStorage.setItem('stats', JSON.stringify(stats));
        loadStats();
        closeStatModal();
    });

    // ================================
    // CONTACT SETTINGS
    // ================================
    function loadContactSettings() {
        const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
        
        document.getElementById('site-email').value = settings.email || '';
        document.getElementById('site-phone').value = settings.phone || '';
        document.getElementById('site-address').value = settings.address || '';
    }

    document.getElementById('contact-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const settings = {
            email: document.getElementById('site-email').value,
            phone: document.getElementById('site-phone').value,
            address: document.getElementById('site-address').value
        };
        
        localStorage.setItem('siteSettings', JSON.stringify(settings));
        alert('Contact information saved successfully!');
    });

    // ================================
    // CONTACT SUBJECTS MANAGEMENT
    // ================================
    function loadContactSubjects() {
        const subjects = JSON.parse(localStorage.getItem('contactSubjects') || '[]');
        const container = document.getElementById('subjects-list');
        
        if (subjects.length === 0) {
            container.innerHTML = '<p style="color: var(--gray-500);">No subjects yet</p>';
            return;
        }
        
        container.innerHTML = subjects.map((subject, index) => `
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--gray-100); border-radius: var(--radius-md); border: 1px solid var(--gray-200);">
                <span>${subject}</span>
                <button onclick="deleteSubject(${index})" style="background: none; border: none; color: var(--red-500); cursor: pointer; font-size: 1.2rem; padding: 0; line-height: 1;">&times;</button>
            </div>
        `).join('');
    }

    window.openSubjectModal = function() {
        const modal = document.getElementById('subject-modal');
        document.getElementById('subject-form').reset();
        modal.classList.add('active');
    };

    window.closeSubjectModal = function() {
        document.getElementById('subject-modal').classList.remove('active');
    };

    window.deleteSubject = function(index) {
        if (!confirm('Are you sure you want to delete this subject?')) return;
        
        let subjects = JSON.parse(localStorage.getItem('contactSubjects') || '[]');
        subjects.splice(index, 1);
        localStorage.setItem('contactSubjects', JSON.stringify(subjects));
        loadContactSubjects();
    };

    document.getElementById('subject-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const subjectName = document.getElementById('subject-name').value.trim();
        if (!subjectName) return;
        
        let subjects = JSON.parse(localStorage.getItem('contactSubjects') || '[]');
        
        if (subjects.includes(subjectName)) {
            alert('This subject already exists!');
            return;
        }
        
        subjects.push(subjectName);
        localStorage.setItem('contactSubjects', JSON.stringify(subjects));
        loadContactSubjects();
        closeSubjectModal();
    });

    // ================================
    // SOCIAL MEDIA MANAGEMENT
    // ================================
    function loadSocialMedia() {
        const socialMedia = JSON.parse(localStorage.getItem('socialMedia') || '[]');
        const tbody = document.getElementById('social-table-body');
        
        if (socialMedia.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--gray-500);">No social platforms yet</td></tr>';
            return;
        }
        
        tbody.innerHTML = socialMedia.map(social => `
            <tr>
                <td>${social.name}</td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${social.url}</td>
                <td>${social.icon}</td>
                <td>
                    <input type="checkbox" ${social.visible ? 'checked' : ''} 
                           onchange="toggleSocialVisibility(${social.id})">
                </td>
                <td>
                    <button class="admin-btn admin-btn-secondary" onclick="editSocial(${social.id})" style="margin-right: 0.5rem;">Edit</button>
                    <button class="admin-btn admin-btn-danger" onclick="deleteSocial(${social.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    window.openSocialModal = function(id = null) {
        const modal = document.getElementById('social-modal');
        const form = document.getElementById('social-form');
        const title = document.getElementById('social-modal-title');
        
        form.reset();
        
        if (id) {
            const socialMedia = JSON.parse(localStorage.getItem('socialMedia') || '[]');
            const social = socialMedia.find(s => s.id === id);
            if (social) {
                title.textContent = 'Edit Social Platform';
                document.getElementById('social-id').value = social.id;
                document.getElementById('social-name').value = social.name;
                document.getElementById('social-url').value = social.url;
                document.getElementById('social-icon').value = social.icon;
                document.getElementById('social-visible').checked = social.visible;
            }
        } else {
            title.textContent = 'Add Social Platform';
            document.getElementById('social-visible').checked = true;
        }
        
        modal.classList.add('active');
    };

    window.closeSocialModal = function() {
        document.getElementById('social-modal').classList.remove('active');
    };

    window.editSocial = function(id) {
        openSocialModal(id);
    };

    window.deleteSocial = function(id) {
        if (!confirm('Are you sure you want to delete this social platform?')) return;
        
        let socialMedia = JSON.parse(localStorage.getItem('socialMedia') || '[]');
        socialMedia = socialMedia.filter(s => s.id !== id);
        localStorage.setItem('socialMedia', JSON.stringify(socialMedia));
        loadSocialMedia();
    };

    window.toggleSocialVisibility = function(id) {
        let socialMedia = JSON.parse(localStorage.getItem('socialMedia') || '[]');
        const social = socialMedia.find(s => s.id === id);
        if (social) {
            social.visible = !social.visible;
            localStorage.setItem('socialMedia', JSON.stringify(socialMedia));
        }
    };

    document.getElementById('social-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = document.getElementById('social-id').value;
        const socialData = {
            id: id ? parseInt(id) : Date.now(),
            name: document.getElementById('social-name').value,
            url: document.getElementById('social-url').value,
            icon: document.getElementById('social-icon').value,
            visible: document.getElementById('social-visible').checked
        };
        
        let socialMedia = JSON.parse(localStorage.getItem('socialMedia') || '[]');
        
        if (id) {
            const index = socialMedia.findIndex(s => s.id === parseInt(id));
            if (index !== -1) socialMedia[index] = socialData;
        } else {
            socialMedia.push(socialData);
        }
        
        localStorage.setItem('socialMedia', JSON.stringify(socialMedia));
        loadSocialMedia();
        closeSocialModal();
    });

    // ================================
    // RESET TO DEFAULTS
    // ================================
    window.resetToDefaults = async function() {
        if (!confirm('⚠️ WARNING: This will delete all your current data and restore default content. This action cannot be undone. Are you sure?')) {
            return;
        }
        
        if (!confirm('This is your last chance. Click OK to permanently delete all data and restore defaults.')) {
            return;
        }
        
        try {
            // Clear all localStorage
            localStorage.clear();
            
            // Reload data from JSON file
            const response = await fetch('data/site-data.json');
            if (!response.ok) {
                throw new Error('Failed to load default data');
            }
            const data = await response.json();
            
            // Restore defaults to localStorage
            Object.keys(data).forEach(key => {
                localStorage.setItem(key, JSON.stringify(data[key]));
            });
            
            alert('✓ All data has been reset to defaults successfully! Reloading page...');
            location.reload();
        } catch (error) {
            alert('Error resetting to defaults. Please check your site-data.json file.');
            console.error(error);
        }
    };

    // ================================
    // DATA IMPORT/EXPORT
    // ================================
    window.exportData = function() {
        const data = {
            courses: JSON.parse(localStorage.getItem('courses') || '[]'),
            blogPosts: JSON.parse(localStorage.getItem('blogPosts') || '[]'),
            team: JSON.parse(localStorage.getItem('team') || '[]'),
            testimonials: JSON.parse(localStorage.getItem('testimonials') || '[]'),
            stats: JSON.parse(localStorage.getItem('stats') || '[]'),
            contactSubjects: JSON.parse(localStorage.getItem('contactSubjects') || '[]'),
            socialMedia: JSON.parse(localStorage.getItem('socialMedia') || '[]'),
            siteSettings: JSON.parse(localStorage.getItem('siteSettings') || '{}')
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `empirici-academy-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    window.importData = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                Object.keys(data).forEach(key => {
                    localStorage.setItem(key, JSON.stringify(data[key]));
                });
                
                alert('Data imported successfully! Reloading page...');
                location.reload();
            } catch (error) {
                alert('Error importing data. Please check the file format.');
                console.error(error);
            }
        };
        reader.readAsText(file);
    };

    // ================================
    // Initialize on page load
    // ================================
    document.addEventListener('DOMContentLoaded', function() {
        loadCourses();
        loadBlogPosts();
        loadTeam();
        loadTestimonials();
        loadStats();
        loadContactSettings();
        loadContactSubjects();
        loadSocialMedia();
    });
})();
