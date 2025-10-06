// ================================
// Automatic Cache Buster
// Adds random version to CSS/JS files on page load
// ================================

(function() {
    'use strict';
    
    // Generate random cache-busting string using timestamp
    const cacheVersion = Date.now();
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addCacheBusting);
    } else {
        addCacheBusting();
    }
    
    function addCacheBusting() {
        // Add version to all local stylesheets (exclude external URLs)
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('css/')) {
                link.setAttribute('href', `${href}?v=${cacheVersion}`);
            }
        });
        
        // Add version to all local scripts (exclude external URLs and cache-buster itself)
        document.querySelectorAll('script[src]').forEach(script => {
            const src = script.getAttribute('src');
            if (src && src.startsWith('js/') && !src.includes('cache-buster')) {
                const newScript = document.createElement('script');
                newScript.src = `${src}?v=${cacheVersion}`;
                
                // Copy all attributes
                Array.from(script.attributes).forEach(attr => {
                    if (attr.name !== 'src') {
                        newScript.setAttribute(attr.name, attr.value);
                    }
                });
                
                // Replace old script with new one
                script.parentNode.replaceChild(newScript, script);
            }
        });
    }
})();
