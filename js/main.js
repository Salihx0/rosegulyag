/* ========================================
   BRR ROSE - Main JavaScript
   ======================================== */

(function() {
    'use strict';

    // ===== PRELOADER =====
    window.addEventListener('load', function() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(function() {
                preloader.classList.add('loaded');
                setTimeout(function() {
                    preloader.style.display = 'none';
                }, 600);
            }, 2000);
        }
    });

    // ===== DOM READY =====
    document.addEventListener('DOMContentLoaded', function() {

        // ===== LANGUAGE SYSTEM =====
        const currentLang = detectLanguage();
        applyLanguage(currentLang);

        // Desktop language selector
        const langBtn = document.getElementById('langBtn');
        const langSelector = document.getElementById('langSelector');
        const langDropdown = document.getElementById('langDropdown');

        if (langBtn && langSelector) {
            langBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                langSelector.classList.toggle('open');
                langBtn.setAttribute('aria-expanded', langSelector.classList.contains('open'));
            });

            // Desktop lang options
            const langOptions = document.querySelectorAll('.lang-dropdown .lang-option');
            langOptions.forEach(function(option) {
                option.addEventListener('click', function() {
                    const lang = this.getAttribute('data-lang');
                    applyLanguage(lang);
                    localStorage.setItem('brr_lang', lang);
                    langSelector.classList.remove('open');
                    langBtn.setAttribute('aria-expanded', 'false');

                    // Update active states
                    langOptions.forEach(function(o) { o.classList.remove('active'); o.setAttribute('aria-selected', 'false'); });
                    this.classList.add('active');
                    this.setAttribute('aria-selected', 'true');
                });
            });
        }

        // Mobile lang buttons
        const mobileLangBtns = document.querySelectorAll('.mobile-lang-btn');
        mobileLangBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                applyLanguage(lang);
                localStorage.setItem('brr_lang', lang);

                mobileLangBtns.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');

                // Also update desktop
                const langOptions = document.querySelectorAll('.lang-dropdown .lang-option');
                langOptions.forEach(function(o) {
                    o.classList.remove('active');
                    o.setAttribute('aria-selected', 'false');
                    if (o.getAttribute('data-lang') === lang) {
                        o.classList.add('active');
                        o.setAttribute('aria-selected', 'true');
                    }
                });
            });
        });

        // Close dropdown on outside click
        document.addEventListener('click', function(e) {
            if (langSelector && !langSelector.contains(e.target)) {
                langSelector.classList.remove('open');
                if (langBtn) langBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // ===== THEME TOGGLE =====
        const themeToggle = document.getElementById('themeToggle');
        const savedTheme = localStorage.getItem('brr_theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('brr_theme', newTheme);
            });
        }

        // ===== HAMBURGER MENU =====
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const mobileNav = document.getElementById('mobileNav');

        if (hamburgerBtn && mobileNav) {
            hamburgerBtn.addEventListener('click', function() {
                this.classList.toggle('active');
                mobileNav.classList.toggle('open');
                this.setAttribute('aria-expanded', mobileNav.classList.contains('open'));
                document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
            });

            // Close mobile nav on link click
            const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
            mobileLinks.forEach(function(link) {
                link.addEventListener('click', function() {
                    hamburgerBtn.classList.remove('active');
                    mobileNav.classList.remove('open');
                    hamburgerBtn.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                });
            });
        }

        // ===== HEADER SCROLL =====
        const header = document.getElementById('header');
        let lastScrollY = 0;

        window.addEventListener('scroll', function() {
            const scrollY = window.pageYOffset;
            if (header) {
                if (scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
            lastScrollY = scrollY;
        }, { passive: true });

        // ===== ACTIVE NAV LINK ON SCROLL =====
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

        function updateActiveNav() {
            const scrollPos = window.pageYOffset + 150;
            sections.forEach(function(section) {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');

                if (scrollPos >= top && scrollPos < top + height) {
                    navLinks.forEach(function(link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', updateActiveNav, { passive: true });

        // ===== PRODUCT FILTER =====
        const filterBtns = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.product-card');

        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');

                filterBtns.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');

                productCards.forEach(function(card) {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.classList.remove('hidden');
                        card.style.display = '';
                    } else {
                        card.classList.add('hidden');
                        card.style.display = 'none';
                    }
                });
            });
        });

        // ===== SCROLL TO TOP =====
        const scrollToTopBtn = document.getElementById('scrollToTop');

        window.addEventListener('scroll', function() {
            if (scrollToTopBtn) {
                if (window.pageYOffset > 400) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
            }
        }, { passive: true });

        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // ===== CONTACT FORM =====
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();

                const name = document.getElementById('name');
                const email = document.getElementById('email');
                const subject = document.getElementById('subject');
                const message = document.getElementById('message');
                const kvkk = document.getElementById('kvkk');

                // Validation
                let isValid = true;

                if (!name.value.trim()) { highlightField(name); isValid = false; }
                if (!email.value.trim() || !isValidEmail(email.value)) { highlightField(email); isValid = false; }
                if (!subject.value.trim()) { highlightField(subject); isValid = false; }
                if (!message.value.trim()) { highlightField(message); isValid = false; }
                if (kvkk && !kvkk.checked) { isValid = false; }

                if (isValid) {
                    const submitBtn = contactForm.querySelector('button[type="submit"]');
                    const currentLang = document.documentElement.getAttribute('lang') || 'tr';
                    const t = translations[currentLang] || translations.tr;

                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

                    // Simulate form submission
                    setTimeout(function() {
                        submitBtn.disabled = false;
                        submitBtn.textContent = t.form_submit;
                        contactForm.reset();

                        showNotification(t.form_success, 'success');
                    }, 1500);
                }
            });
        }

        // ===== COOKIE NOTICE =====
        const cookieNotice = document.getElementById('cookieNotice');
        const cookieAccept = document.getElementById('cookieAccept');

        if (cookieNotice && !localStorage.getItem('brr_cookies_accepted')) {
            setTimeout(function() {
                cookieNotice.style.display = 'block';
            }, 3000);
        }

        if (cookieAccept) {
            cookieAccept.addEventListener('click', function() {
                localStorage.setItem('brr_cookies_accepted', 'true');
                cookieNotice.style.display = 'none';
            });
        }

        // ===== SCROLL ANIMATIONS =====
        const animateElements = document.querySelectorAll('.section-header, .product-card, .gallery-item, .blog-card, .contact-card, .about-content, .about-image, .feature-item');

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-on-scroll', 'animated');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animateElements.forEach(function(el) {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });

        // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const headerHeight = header ? header.offsetHeight : 75;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            });
        });

    }); // END DOMContentLoaded

    // ===== LANGUAGE FUNCTIONS =====
    function detectLanguage() {
        // 1. Check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && translations[urlLang]) return urlLang;

        // 2. Check localStorage
        const savedLang = localStorage.getItem('brr_lang');
        if (savedLang && translations[savedLang]) return savedLang;

        // 3. Detect browser language
        const browserLangs = navigator.languages || [navigator.language || navigator.userLanguage || 'tr'];
        for (let i = 0; i < browserLangs.length; i++) {
            const bl = browserLangs[i];
            if (browserLangMap[bl]) return browserLangMap[bl];
            const short = bl.split('-')[0];
            if (browserLangMap[short]) return browserLangMap[short];
        }

        // 4. Default to Turkish
        return 'tr';
    }

    function applyLanguage(lang) {
        if (!translations[lang]) lang = 'tr';
        const t = translations[lang];
        const config = langConfig[lang];

        // Set HTML attributes
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', config.dir);

        // Update page title
        const titleMap = {
            tr: "BRR ROSE | Doğal Gül Yağı, Gül Suyu ve Bitkisel Yağlar",
            en: "BRR ROSE | Natural Rose Oil, Rose Water and Herbal Oils",
            ar: "بي آر آر روز | زيت الورد الطبيعي وماء الورد والزيوت العشبية",
            fr: "BRR ROSE | Huile de rose naturelle, eau de rose et huiles végétales",
            it: "BRR ROSE | Olio di rosa naturale, acqua di rose e oli vegetali",
            zh: "BRR ROSE | 天然玫瑰精油、玫瑰纯露和草本精油"
        };
        document.title = titleMap[lang] || titleMap.tr;

        // Update header flag & name
        const currentFlag = document.getElementById('currentFlag');
        const currentLangEl = document.getElementById('currentLang');
        if (currentFlag) currentFlag.textContent = config.flag;
        if (currentLangEl) currentLangEl.textContent = config.short;

        // Update all data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(function(el) {
            const key = el.getAttribute('data-i18n');
            if (t[key] !== undefined) {
                if (key === 'form_kvkk') {
                    el.innerHTML = t[key];
                } else {
                    el.textContent = t[key];
                }
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
            const key = el.getAttribute('data-i18n-placeholder');
            if (t[key] !== undefined) {
                el.setAttribute('placeholder', t[key]);
            }
        });

        // Update active state on language selectors
        document.querySelectorAll('.lang-option').forEach(function(opt) {
            opt.classList.remove('active');
            opt.setAttribute('aria-selected', 'false');
            if (opt.getAttribute('data-lang') === lang) {
                opt.classList.add('active');
                opt.setAttribute('aria-selected', 'true');
            }
        });

        document.querySelectorAll('.mobile-lang-btn').forEach(function(btn) {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });

        // Update meta description
        const metaDescMap = {
            tr: "BRR ROSE - Premium kalite doğal gül yağı, gül absolute, gül konkret, gül suyu ve bitkisel yağlar. Isparta güllerinden elde edilen saf ve doğal ürünler.",
            en: "BRR ROSE - Premium quality natural rose oil, rose absolute, rose concrete, rose water and herbal oils. Pure and natural products from Isparta roses.",
            ar: "بي آر آر روز - زيت الورد الطبيعي عالي الجودة، ورد أبسوليوت، كونكريت الورد، ماء الورد والزيوت العشبية. منتجات نقية وطبيعية من ورود إسبارطة.",
            fr: "BRR ROSE - Huile de rose naturelle de qualité premium, absolue de rose, concrète de rose, eau de rose et huiles végétales. Produits purs et naturels des roses d'Isparta.",
            it: "BRR ROSE - Olio di rosa naturale di qualità premium, assoluta di rosa, concreta di rosa, acqua di rose e oli vegetali. Prodotti puri e naturali dalle rose di Isparta.",
            zh: "BRR ROSE - 高品质天然玫瑰精油、玫瑰原精、玫瑰凝香体、玫瑰纯露和草本精油。来自伊斯帕尔塔玫瑰的纯正天然产品。"
        };
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', metaDescMap[lang] || metaDescMap.tr);
    }

    // ===== UTILITY FUNCTIONS =====
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function highlightField(field) {
        field.style.borderColor = '#e74c3c';
        field.addEventListener('input', function() {
            field.style.borderColor = '';
        }, { once: true });
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = 'notification notification-' + type;
        notification.innerHTML = '<i class="fas ' + (type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle') + '"></i> ' + message;
        notification.style.cssText = 'position:fixed;top:100px;right:20px;background:' + (type === 'success' ? '#2ecc71' : '#e74c3c') + ';color:#fff;padding:16px 24px;border-radius:12px;z-index:10000;font-size:0.9rem;box-shadow:0 8px 30px rgba(0,0,0,0.15);display:flex;align-items:center;gap:10px;animation:slideInRight 0.5s ease;max-width:90vw;';

        document.body.appendChild(notification);

        setTimeout(function() {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            notification.style.transition = 'all 0.4s ease';
            setTimeout(function() { notification.remove(); }, 400);
        }, 4000);
    }

    // Add notification animation
    const style = document.createElement('style');
    style.textContent = '@keyframes slideInRight{from{opacity:0;transform:translateX(100px);}to{opacity:1;transform:translateX(0);}}';
    document.head.appendChild(style);

})();
