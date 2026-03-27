/**
 * Academic Personal Website - Theme Toggle & Utilities
 * Clean, minimal JavaScript for theme switching and UI interactions
 */

(function() {
    'use strict';

    // ============================================
    // Theme Management
    // ============================================
    
    const ThemeManager = {
        // Configuration
        STORAGE_KEY: 'academic-theme-preference',
        THEME_ATTRIBUTE: 'data-theme',
        
        // Available themes
        LIGHT: 'light',
        DARK: 'dark',
        
        /**
         * Initialize theme manager
         */
        init() {
            this.themeToggleBtn = document.getElementById('themeToggle');
            this.htmlElement = document.documentElement;
            
            if (!this.themeToggleBtn) {
                console.warn('Theme toggle button not found');
                return;
            }
            
            // Load saved theme or detect system preference
            this.loadTheme();
            
            // Bind click event
            this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
            
            // Listen for system theme changes
            this.listenForSystemThemeChanges();
        },
        
        /**
         * Load theme from localStorage or system preference
         */
        loadTheme() {
            const savedTheme = this.getSavedTheme();
            const systemTheme = this.getSystemTheme();
            const theme = savedTheme || systemTheme;
            
            this.applyTheme(theme);
        },
        
        /**
         * Get saved theme from localStorage
         * @returns {string|null} The saved theme or null
         */
        getSavedTheme() {
            try {
                return localStorage.getItem(this.STORAGE_KEY);
            } catch (e) {
                // localStorage might be disabled or unavailable
                console.warn('Unable to access localStorage:', e);
                return null;
            }
        },
        
        /**
         * Get system preferred theme
         * @returns {string} 'dark' or 'light'
         */
        getSystemTheme() {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return this.DARK;
            }
            return this.LIGHT;
        },
        
        /**
         * Apply theme to document
         * @param {string} theme - 'dark' or 'light'
         */
        applyTheme(theme) {
            if (theme === this.DARK) {
                this.htmlElement.setAttribute(this.THEME_ATTRIBUTE, this.DARK);
            } else {
                this.htmlElement.removeAttribute(this.THEME_ATTRIBUTE);
            }
            
            // Update button aria-label for accessibility
            this.updateAriaLabel(theme);
        },
        
        /**
         * Toggle between light and dark themes
         */
        toggleTheme() {
            const currentTheme = this.htmlElement.getAttribute(this.THEME_ATTRIBUTE);
            const newTheme = currentTheme === this.DARK ? this.LIGHT : this.DARK;
            
            this.applyTheme(newTheme);
            this.saveTheme(newTheme);
        },
        
        /**
         * Save theme preference to localStorage
         * @param {string} theme - 'dark' or 'light'
         */
        saveTheme(theme) {
            try {
                localStorage.setItem(this.STORAGE_KEY, theme);
            } catch (e) {
                console.warn('Unable to save theme preference:', e);
            }
        },
        
        /**
         * Update button aria-label based on current theme
         * @param {string} theme - 'dark' or 'light'
         */
        updateAriaLabel(theme) {
            const label = theme === this.DARK 
                ? 'Switch to light mode' 
                : 'Switch to dark mode';
            this.themeToggleBtn.setAttribute('aria-label', label);
        },
        
        /**
         * Listen for system theme preference changes
         */
        listenForSystemThemeChanges() {
            if (!window.matchMedia) return;
            
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Use addEventListener with fallback for older browsers
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', (e) => {
                    // Only apply system theme if user hasn't set a preference
                    if (!this.getSavedTheme()) {
                        this.applyTheme(e.matches ? this.DARK : this.LIGHT);
                    }
                });
            } else if (mediaQuery.addListener) {
                // Fallback for older browsers
                mediaQuery.addListener((e) => {
                    if (!this.getSavedTheme()) {
                        this.applyTheme(e.matches ? this.DARK : this.LIGHT);
                    }
                });
            }
        }
    };

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    
    const SmoothScroll = {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        }
    };

    // ============================================
    // Project Links Handler
    // ============================================
    
    const ProjectLinks = {
        init() {
            // Handle placeholder links
            document.querySelectorAll('.pub-btn').forEach(btn => {
                const href = btn.getAttribute('href');
                if (href === '#') {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.showComingSoon(btn);
                    });
                }
            });
        },
        
        showComingSoon(element) {
            // Simple visual feedback for demo
            const originalText = element.innerHTML;
            element.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                Coming soon
            `;
            
            setTimeout(() => {
                element.innerHTML = originalText;
            }, 1500);
        }
    };

    // ============================================
    // External Links Handler
    // ============================================
    
    const ExternalLinks = {
        init() {
            // Add security attributes to external links
            document.querySelectorAll('a[href^="http"]').forEach(link => {
                if (!link.hasAttribute('rel')) {
                    link.setAttribute('rel', 'noopener noreferrer');
                }
                if (!link.hasAttribute('target')) {
                    link.setAttribute('target', '_blank');
                }
            });
        }
    };

    // ============================================
    // Utility Functions
    // ============================================
    
    const Utils = {
        /**
         * Debounce function to limit how often a function can fire
         * @param {Function} func - Function to debounce
         * @param {number} wait - Milliseconds to wait
         * @returns {Function} Debounced function
         */
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        /**
         * Check if element is in viewport
         * @param {Element} element - Element to check
         * @returns {boolean} True if in viewport
         */
        isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    };

    // ============================================
    // Initialize Everything on DOM Ready
    // ============================================
    
    function init() {
        ThemeManager.init();
        SmoothScroll.init();
        ProjectLinks.init();
        ExternalLinks.init();
        
        // Add loaded class for any CSS transitions on load
        document.body.classList.add('js-loaded');
        
        console.log('Academic website initialized successfully');
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded
        init();
    }

    // Expose to global scope for debugging (optional)
    window.AcademicSite = {
        ThemeManager,
        SmoothScroll,
        ProjectLinks,
        ExternalLinks,
        Utils
    };

})();
