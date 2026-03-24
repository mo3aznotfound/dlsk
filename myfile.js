/**
 * Modern Scroll Reveal Effect
 * Elements appear with smooth animations when scrolled into view
 * 
 * Usage:
 * 1. Add class "reveal" to elements you want to animate
 * 2. Add data attributes for customization (optional):
 *    - data-delay: delay in ms (e.g., "200")
 *    - data-direction: "up", "down", "left", "right", "scale"
 *    - data-duration: duration in ms (e.g., "800")
 */

class ScrollReveal {
    constructor(options = {}) {
        // Default configuration
        this.config = {
            threshold: 0.15,           // How much of element must be visible (0-1)
            rootMargin: "0px 0px -50px 0px",  // Offset for trigger
            defaultDelay: 0,
            defaultDuration: 600,
            defaultDirection: "up",
            once: true,                // Animate only once
            mobileThreshold: 0.1,      // Lower threshold for mobile
            ...options
        };

        this.elements = [];
        this.observer = null;
        this.init();
    }

    init() {
        // Select all elements with 'reveal' class
        this.elements = document.querySelectorAll('.reveal');
        
        if (this.elements.length === 0) return;

        // Check if Intersection Observer is supported
        if (!window.IntersectionObserver) {
            this.fallbackReveal();
            return;
        }

        // Set up styles for all reveal elements
        this.setupStyles();

        // Create observer
        this.observer = new IntersectionObserver(
            this.handleIntersect.bind(this),
            {
                threshold: this.getThreshold(),
                rootMargin: this.config.rootMargin
            }
        );

        // Observe each element
        this.elements.forEach(el => this.observer.observe(el));
    }

    getThreshold() {
        // Use lower threshold for mobile devices
        return window.innerWidth <= 768 ? this.config.mobileThreshold : this.config.threshold;
    }

    setupStyles() {
        this.elements.forEach(el => {
            // Get animation direction from data attribute or default
            const direction = el.dataset.direction || this.config.defaultDirection;
            
            // Set initial hidden state
            el.style.opacity = "0";
            el.style.transition = `opacity ${this.getDuration(el)}ms cubic-bezier(0.2, 0.9, 0.4, 1.1), transform ${this.getDuration(el)}ms cubic-bezier(0.2, 0.9, 0.4, 1.1)`;
            el.style.willChange = "opacity, transform";
            
            // Apply transform based on direction
            switch(direction) {
                case "up":
                    el.style.transform = "translateY(40px)";
                    break;
                case "down":
                    el.style.transform = "translateY(-40px)";
                    break;
                case "left":
                    el.style.transform = "translateX(40px)";
                    break;
                case "right":
                    el.style.transform = "translateX(-40px)";
                    break;
                case "scale":
                    el.style.transform = "scale(0.8)";
                    break;
                case "fade":
                    el.style.transform = "none";
                    break;
                default:
                    el.style.transform = "translateY(40px)";
            }
        });
    }

    getDuration(el) {
        return parseInt(el.dataset.duration) || this.config.defaultDuration;
    }

    getDelay(el) {
        return parseInt(el.dataset.delay) || this.config.defaultDelay;
    }

    handleIntersect(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = this.getDelay(el);
                
                setTimeout(() => {
                    // Reveal the element
                    el.style.opacity = "1";
                    el.style.transform = "translateX(0) translateY(0) scale(1)";
                }, delay);
                
                // Stop observing if once is true
                if (this.config.once && this.observer) {
                    this.observer.unobserve(el);
                }
            } else if (!this.config.once) {
                // Hide again when scrolling back up (if once is false)
                const direction = el.dataset.direction || this.config.defaultDirection;
                el.style.opacity = "0";
                
                switch(direction) {
                    case "up":
                        el.style.transform = "translateY(40px)";
                        break;
                    case "down":
                        el.style.transform = "translateY(-40px)";
                        break;
                    case "left":
                        el.style.transform = "translateX(40px)";
                        break;
                    case "right":
                        el.style.transform = "translateX(-40px)";
                        break;
                    case "scale":
                        el.style.transform = "scale(0.8)";
                        break;
                    default:
                        el.style.transform = "translateY(40px)";
                }
            }
        });
    }

    fallbackReveal() {
        // Fallback for older browsers - just show everything
        this.elements.forEach(el => {
            el.style.opacity = "1";
            el.style.transform = "none";
        });
    }

    // Refresh observer (useful after dynamic content load)
    refresh() {
        if (this.observer) {
            this.elements.forEach(el => {
                this.observer.unobserve(el);
                this.observer.observe(el);
            });
        }
    }

    // Add new elements dynamically
    addElements(elements) {
        if (!elements) return;
        
        const newElements = elements instanceof NodeList || Array.isArray(elements) 
            ? elements 
            : [elements];
        
        newElements.forEach(el => {
            if (el.classList && !el.classList.contains('reveal')) {
                el.classList.add('reveal');
                this.elements.push(el);
                this.setupStylesForElement(el);
                if (this.observer) this.observer.observe(el);
            }
        });
    }

    setupStylesForElement(el) {
        const direction = el.dataset.direction || this.config.defaultDirection;
        el.style.opacity = "0";
        el.style.transition = `opacity ${this.getDuration(el)}ms cubic-bezier(0.2, 0.9, 0.4, 1.1), transform ${this.getDuration(el)}ms cubic-bezier(0.2, 0.9, 0.4, 1.1)`;
        el.style.willChange = "opacity, transform";
        
        switch(direction) {
            case "up": el.style.transform = "translateY(40px)"; break;
            case "down": el.style.transform = "translateY(-40px)"; break;
            case "left": el.style.transform = "translateX(40px)"; break;
            case "right": el.style.transform = "translateX(-40px)"; break;
            case "scale": el.style.transform = "scale(0.8)"; break;
            default: el.style.transform = "translateY(40px)";
        }
    }

    // Destroy observer and cleanup
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        
        // Reset all styles
        this.elements.forEach(el => {
            el.style.opacity = "";
            el.style.transform = "";
            el.style.transition = "";
            el.style.willChange = "";
        });
    }
}

// ============= ADDITIONAL MODERN SCROLL EFFECTS =============

/**
 * Parallax Scroll Effect
 * Elements move at different speeds relative to scroll
 */
class ScrollParallax {
    constructor(options = {}) {
        this.config = {
            elements: '[data-parallax]',
            speed: 0.5,
            ...options
        };
        
        this.elements = [];
        this.init();
    }
    
    init() {
        this.elements = document.querySelectorAll(this.config.elements);
        if (this.elements.length === 0) return;
        
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
        this.handleScroll();
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        
        this.elements.forEach(el => {
            const speed = parseFloat(el.dataset.parallaxSpeed) || this.config.speed;
            const direction = el.dataset.parallaxDirection || 'up';
            const offset = scrollY * speed;
            
            if (direction === 'up') {
                el.style.transform = `translateY(${offset}px)`;
            } else if (direction === 'down') {
                el.style.transform = `translateY(-${offset}px)`;
            }
        });
    }
    
    refresh() {
        this.handleScroll();
    }
}

/**
 * Progress Bar on Scroll
 * Shows scroll progress
 */
class ScrollProgress {
    constructor(options = {}) {
        this.config = {
            element: null,
            position: 'top',
            color: '#7b6ef6',
            height: '3px',
            ...options
        };
        
        this.progressBar = null;
        this.init();
    }
    
    init() {
        if (this.config.element) {
            this.progressBar = this.config.element;
        } else {
            this.progressBar = document.createElement('div');
            this.progressBar.style.position = 'fixed';
            this.progressBar.style.top = this.config.position === 'top' ? '0' : 'auto';
            this.progressBar.style.bottom = this.config.position === 'bottom' ? '0' : 'auto';
            this.progressBar.style.left = '0';
            this.progressBar.style.width = '0%';
            this.progressBar.style.height = this.config.height;
            this.progressBar.style.backgroundColor = this.config.color;
            this.progressBar.style.zIndex = '9999';
            this.progressBar.style.transition = 'width 0.1s ease-out';
            document.body.appendChild(this.progressBar);
        }
        
        window.addEventListener('scroll', this.update.bind(this), { passive: true });
        this.update();
    }
    
    update() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        
        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
        }
    }
}

/**
 * Staggered Animation for Lists/Grids
 * Elements appear one after another
 */
class StaggerReveal {
    constructor(options = {}) {
        this.config = {
            container: null,
            items: '.stagger-item',
            staggerDelay: 80,
            ...options
        };
        
        this.container = this.config.container;
        this.items = [];
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.items = this.container.querySelectorAll(this.config.items);
        
        // Set initial hidden state
        this.items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = `all 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1) ${index * this.config.staggerDelay}ms`;
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.items.forEach(item => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(this.container);
    }
}

/**
 * Number Counter Animation
 * Counts up when scrolled into view
 */
class ScrollCounter {
    constructor(options = {}) {
        this.config = {
            elements: '[data-counter]',
            duration: 2000,
            ...options
        };
        
        this.elements = [];
        this.observer = null;
        this.init();
    }
    
    init() {
        this.elements = document.querySelectorAll(this.config.elements);
        if (this.elements.length === 0) return;
        
        this.observer = new IntersectionObserver(this.handleIntersect.bind(this), { threshold: 0.5 });
        this.elements.forEach(el => this.observer.observe(el));
    }
    
    handleIntersect(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.counter);
                const duration = parseInt(el.dataset.duration) || this.config.duration;
                
                if (!el.dataset.animated) {
                    this.animateNumber(el, target, duration);
                    el.dataset.animated = 'true';
                }
                this.observer.unobserve(el);
            }
        });
    }
    
    animateNumber(element, target, duration) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const updateCounter = () => {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    }
}

// ============= EXPORT FOR MODULE USE =============

// For ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ScrollReveal,
        ScrollParallax,
        ScrollProgress,
        StaggerReveal,
        ScrollCounter
    };
}

// For browser global usage
if (typeof window !== 'undefined') {
    window.ScrollReveal = ScrollReveal;
    window.ScrollParallax = ScrollParallax;
    window.ScrollProgress = ScrollProgress;
    window.StaggerReveal = StaggerReveal;
    window.ScrollCounter = ScrollCounter;
    
    // Auto-initialize if data attribute present
    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('.reveal')) {
            window.scrollReveal = new ScrollReveal();
        }
        if (document.querySelector('[data-parallax]')) {
            window.scrollParallax = new ScrollParallax();
        }
    });
}
