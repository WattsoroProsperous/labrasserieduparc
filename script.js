/**
 * BRASSERIE DU PARC - Ultra Modern JavaScript
 * Cutting-edge interactions and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Loader.init();
    CustomCursor.init();
    Navigation.init();
    SmoothScroll.init();
    MenuSlider.init();
    MenuFilter.init();
    VideoPlayers.init();
    ScrollReveal.init();
    Forms.init();
    PromoPopup.init();
});

/**
 * Loader Module
 */
const Loader = {
    init() {
        const loader = document.getElementById('loader');
        if (!loader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.classList.remove('no-scroll');
            }, 1400);
        });

        document.body.classList.add('no-scroll');
    }
};

/**
 * Custom Cursor Module
 */
const CustomCursor = {
    init() {
        this.cursor = document.querySelector('.cursor');
        this.follower = document.querySelector('.cursor-follower');

        if (!this.cursor || !this.follower) return;
        if (window.matchMedia('(hover: none)').matches) return;

        this.cursorX = 0;
        this.cursorY = 0;
        this.followerX = 0;
        this.followerY = 0;

        this.bindEvents();
        this.animate();
    },

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.cursorX = e.clientX;
            this.cursorY = e.clientY;
        });

        // Hover effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .menu-item, .gallery-item, .moment-card');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
                this.follower.classList.add('hover');
            });

            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
                this.follower.classList.remove('hover');
            });
        });
    },

    animate() {
        // Smooth following effect
        this.followerX += (this.cursorX - this.followerX) * 0.1;
        this.followerY += (this.cursorY - this.followerY) * 0.1;

        this.cursor.style.left = `${this.cursorX}px`;
        this.cursor.style.top = `${this.cursorY}px`;

        this.follower.style.left = `${this.followerX}px`;
        this.follower.style.top = `${this.followerY}px`;

        requestAnimationFrame(() => this.animate());
    }
};

/**
 * Navigation Module
 */
const Navigation = {
    init() {
        this.nav = document.getElementById('nav');
        this.toggle = document.getElementById('navToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileLinks = document.querySelectorAll('.mobile-link');

        this.bindEvents();
        this.handleScroll();
    },

    bindEvents() {
        // Mobile menu toggle
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
        }

        // Close on link click
        this.mobileLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Scroll effect
        window.addEventListener('scroll', () => this.handleScroll());

        // Update active link on scroll
        window.addEventListener('scroll', () => this.updateActiveLink());
    },

    toggleMenu() {
        this.toggle.classList.toggle('active');
        this.mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    },

    closeMenu() {
        this.toggle.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    },

    handleScroll() {
        if (window.scrollY > 100) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
    },

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            const desktopLink = document.querySelector(`.nav-link[href="#${id}"]`);
            const mobileLink = document.querySelector(`.mobile-link[href="#${id}"]`);

            if (scrollPos >= top && scrollPos < top + height) {
                this.navLinks.forEach(l => l.classList.remove('active'));
                this.mobileLinks.forEach(l => l.classList.remove('active'));

                if (desktopLink) desktopLink.classList.add('active');
                if (mobileLink) mobileLink.classList.add('active');
            }
        });
    }
};

/**
 * Smooth Scroll Module
 */
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    const navHeight = document.getElementById('nav').offsetHeight;
                    const targetPos = target.offsetTop - navHeight;

                    window.scrollTo({
                        top: targetPos,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

/**
 * Menu Slider Module
 */
const MenuSlider = {
    init() {
        this.track = document.getElementById('menuTrack');
        this.prevBtn = document.getElementById('menuPrev');
        this.nextBtn = document.getElementById('menuNext');
        this.progressBar = document.getElementById('menuProgress');

        if (!this.track) return;

        this.items = this.track.querySelectorAll('.menu-item:not(.hidden)');
        this.currentIndex = 0;
        this.touchStartX = 0;
        this.touchHandled = false;

        this.calculateItemWidth();
        this.bindEvents();
        this.updateProgress();

        // Recalculate on resize
        window.addEventListener('resize', () => {
            this.calculateItemWidth();
            this.slide();
        });
    },

    calculateItemWidth() {
        const firstItem = this.track.querySelector('.menu-item:not(.hidden)');
        if (firstItem) {
            const style = window.getComputedStyle(firstItem);
            const gap = parseInt(window.getComputedStyle(this.track).gap) || 24;
            this.itemWidth = firstItem.offsetWidth + gap;
        } else {
            this.itemWidth = 280;
        }
    },

    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        // Touch events for mobile swipe
        this.track.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].pageX;
            this.touchHandled = false;
        }, { passive: true });

        this.track.addEventListener('touchend', (e) => {
            if (this.touchHandled) return;

            const touchEndX = e.changedTouches[0].pageX;
            const diff = this.touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                this.touchHandled = true;
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        }, { passive: true });
    },

    updateItems() {
        this.items = this.track.querySelectorAll('.menu-item:not(.hidden)');
        this.currentIndex = 0;
        this.calculateItemWidth();
        this.slide();
    },

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.slide();
        }
    },

    next() {
        const maxIndex = this.getMaxIndex();
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.slide();
        }
    },

    getVisibleItems() {
        const containerWidth = this.track.parentElement.offsetWidth;
        return Math.max(1, Math.floor(containerWidth / this.itemWidth));
    },

    getMaxIndex() {
        const totalItems = this.items.length;
        const visibleItems = this.getVisibleItems();
        return Math.max(0, totalItems - visibleItems);
    },

    slide() {
        const maxIndex = this.getMaxIndex();
        // Clamp currentIndex to valid range
        this.currentIndex = Math.min(this.currentIndex, maxIndex);
        this.currentIndex = Math.max(0, this.currentIndex);

        const translateX = this.currentIndex * this.itemWidth;
        this.track.style.transform = `translateX(-${translateX}px)`;
        this.updateProgress();
    },

    updateProgress() {
        if (!this.progressBar) return;

        const maxIndex = this.getMaxIndex();
        const progress = maxIndex === 0 ? 100 : ((this.currentIndex + 1) / (maxIndex + 1)) * 100;
        this.progressBar.style.width = `${Math.min(100, progress)}%`;
    }
};

/**
 * Menu Filter Module
 */
const MenuFilter = {
    init() {
        this.tabs = document.querySelectorAll('.category-tab');
        this.items = document.querySelectorAll('.menu-item');

        if (!this.tabs.length) return;

        this.bindEvents();
    },

    bindEvents() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.dataset.category;
                this.filter(category);
                this.updateActiveTab(tab);
            });
        });
    },

    filter(category) {
        this.items.forEach(item => {
            const itemCategory = item.dataset.category;

            if (category === 'all' || itemCategory === category) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });

        // Update slider after filtering
        setTimeout(() => {
            MenuSlider.updateItems();
        }, 50);
    },

    updateActiveTab(activeTab) {
        this.tabs.forEach(tab => tab.classList.remove('active'));
        activeTab.classList.add('active');
    }
};

/**
 * Video Players Module
 */
const VideoPlayers = {
    init() {
        this.setupMomentVideos();
    },

    setupMomentVideos() {
        const momentCards = document.querySelectorAll('.moment-card');

        momentCards.forEach(card => {
            const video = card.querySelector('video');
            const playBtn = card.querySelector('.moment-play');

            if (!video || !playBtn) return;

            playBtn.addEventListener('click', () => {
                if (video.paused) {
                    // Pause all other videos
                    document.querySelectorAll('.moment-card video').forEach(v => {
                        if (v !== video) {
                            v.pause();
                            v.currentTime = 0;
                        }
                    });

                    video.play();
                    playBtn.style.opacity = '0';
                } else {
                    video.pause();
                    playBtn.style.opacity = '1';
                }
            });

            video.addEventListener('ended', () => {
                playBtn.style.opacity = '1';
            });

            // Hover preview
            card.addEventListener('mouseenter', () => {
                if (video.paused) {
                    video.play().catch(() => {});
                }
            });

            card.addEventListener('mouseleave', () => {
                if (!video.paused && playBtn.style.opacity !== '0') {
                    video.pause();
                    video.currentTime = 0;
                }
            });
        });
    }
};

/**
 * Scroll Reveal Module
 */
const ScrollReveal = {
    init() {
        this.elements = document.querySelectorAll(
            '.section-header, .section-title, .concept-img, .feature, .menu-item, .gallery-item, .moment-card, .contact-item'
        );

        this.elements.forEach(el => el.classList.add('reveal'));

        this.bindEvents();
        this.reveal();
    },

    bindEvents() {
        window.addEventListener('scroll', () => this.reveal());
        window.addEventListener('resize', () => this.reveal());
    },

    reveal() {
        const windowHeight = window.innerHeight;
        const triggerPoint = windowHeight * 0.9;

        this.elements.forEach((el) => {
            const elementTop = el.getBoundingClientRect().top;

            if (elementTop < triggerPoint) {
                el.classList.add('active');
            }
        });
    }
};

/**
 * Forms Module
 */
const Forms = {
    init() {
        this.setupContactForm();
        this.setupNewsletterForm();
        this.setupDateInput();
    },

    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Show success
            this.showNotification('Merci ! Votre demande de réservation a été envoyée.', 'success');
            form.reset();
        });
    },

    setupNewsletterForm() {
        const form = document.querySelector('.newsletter-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = form.querySelector('input[type="email"]').value;

            if (this.validateEmail(email)) {
                this.showNotification('Merci pour votre inscription !', 'success');
                form.reset();
            } else {
                this.showNotification('Veuillez entrer un email valide.', 'error');
            }
        });
    },

    setupDateInput() {
        const dateInput = document.getElementById('date');
        if (!dateInput) return;

        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    },

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    showNotification(message, type) {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${type === 'success' ? '✓' : '✕'}</span>
            <span class="notification-text">${message}</span>
        `;

        // Style
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            backgroundColor: type === 'success' ? '#C45C3E' : '#DC3545',
            color: '#fff',
            fontWeight: '500',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            zIndex: '1000',
            animation: 'slideIn 0.4s ease'
        });

        document.body.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.4s ease forwards';
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }
};

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
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

/**
 * Parallax effect on scroll
 */
const Parallax = {
    init() {
        this.heroImg = document.querySelector('.hero-img');
        if (!this.heroImg) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                this.heroImg.style.transform = `scale(1.1) translateY(${scrolled * 0.15}px)`;
            }
        });
    }
};

// Initialize parallax
Parallax.init();

/**
 * Magnetic buttons effect
 */
const MagneticButtons = {
    init() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .menu-nav');

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }
};

// Initialize magnetic effect on desktop only
if (window.matchMedia('(hover: hover)').matches) {
    MagneticButtons.init();
}

/**
 * Promo Popup Module
 */
const PromoPopup = {
    init() {
        this.popup = document.getElementById('promoPopup');
        this.closeBtn = document.getElementById('popupClose');
        this.ctaBtn = document.getElementById('popupCta');

        if (!this.popup) return;

        this.hasShown = false;
        this.bindEvents();
    },

    bindEvents() {
        // Show popup on first scroll
        window.addEventListener('scroll', () => this.onScroll(), { once: true });

        // Close popup
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        // Close on CTA click
        if (this.ctaBtn) {
            this.ctaBtn.addEventListener('click', () => this.close());
        }

        // Close on overlay click
        this.popup.addEventListener('click', (e) => {
            if (e.target === this.popup) {
                this.close();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.popup.classList.contains('active')) {
                this.close();
            }
        });
    },

    onScroll() {
        if (this.hasShown) return;

        // Wait a bit after scroll starts
        setTimeout(() => {
            this.show();
        }, 500);
    },

    show() {
        if (this.hasShown) return;
        this.hasShown = true;
        this.popup.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    close() {
        this.popup.classList.remove('active');
        document.body.style.overflow = '';
    }
};

console.log('🍽️ Brasserie du Parc - Site chargé avec succès');