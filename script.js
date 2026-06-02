document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Navigation
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
            const isOpen = mobileNav.classList.contains('open');
            const toggleIcon = mobileToggle.querySelector('i');
            if (toggleIcon) {
                toggleIcon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
                lucide.createIcons();
            }
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                const toggleIcon = mobileToggle.querySelector('i');
                if (toggleIcon) {
                    toggleIcon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }

    // 2. Scroll Header State & Active Links Highlight
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        // Sticky Header class
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active Link Highlight
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150; // offset for nav header height
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // 3. Typing Effect
    const typedTextSpan = document.getElementById('typed-text');
    const textWords = ['Web Developer', 'Python Programmer', 'B.Tech Student', 'Tech Enthusiast'];
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const wordDelay = 1500;
    let wordIndex = 0;
    let charIndex = 0;
    
    function type() {
        if (charIndex < textWords[wordIndex].length) {
            typedTextSpan.textContent += textWords[wordIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, wordDelay);
        }
    }
    
    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textWords[wordIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            wordIndex = (wordIndex + 1) % textWords.length;
            setTimeout(type, typingSpeed);
        }
    }
    
    if (typedTextSpan) {
        setTimeout(type, 500);
    }

    // 4. Scroll Reveal Animations (Intersection Observer)
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    if ('IntersectionObserver' in window && scrollRevealElements.length > 0) {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Stop observing once revealed
                }
            });
        }, observerOptions);
        
        scrollRevealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for browsers that do not support IntersectionObserver
        scrollRevealElements.forEach(el => el.classList.add('active'));
    }

    // 5. Contact Form Validation and Submission
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const resetFormBtn = document.getElementById('resetFormBtn');
    
    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get values
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            let isValid = true;
            
            // Name validation
            if (!nameInput.value.trim()) {
                showError(nameInput, 'name-error');
                isValid = false;
            } else {
                clearError(nameInput, 'name-error');
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                showError(emailInput, 'email-error', 'Email address is required');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                showError(emailInput, 'email-error', 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError(emailInput, 'email-error');
            }
            
            // Message validation
            if (!messageInput.value.trim()) {
                showError(messageInput, 'message-error');
                isValid = false;
            } else {
                clearError(messageInput, 'message-error');
            }
            
            if (isValid) {
                const name = nameInput.value.trim();
                const email = emailInput.value.trim();
                const message = messageInput.value.trim();
                
                const submitBtn = document.getElementById('submitBtn');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending...';

                // CONFIGURATION: Replace with your actual Web3Forms access key
                // You can get a free key instantly from https://web3forms.com
                const web3FormsAccessKey = 'YOUR_ACCESS_KEY_HERE'; 

                const showSuccessState = (username) => {
                    formSuccess.querySelector('p').textContent = `Thank you for reaching out, ${username}. I will respond to your email shortly.`;
                    contactForm.classList.add('hidden');
                    formSuccess.classList.remove('hidden');
                };

                const fallbackToMailto = (username, useremail, usermessage) => {
                    const subject = `Contacting Aaysha from Portfolio`;
                    const body = `Name: ${username}\nEmail: ${useremail}\n\nMessage:\n${usermessage}`;
                    const mailtoUrl = `mailto:aaysha2103@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    window.location.href = mailtoUrl;
                };

                if (web3FormsAccessKey && web3FormsAccessKey !== 'YOUR_ACCESS_KEY_HERE') {
                    // Send email in background using Web3Forms
                    fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            access_key: web3FormsAccessKey,
                            name: name,
                            email: email,
                            message: message,
                            subject: `New Portfolio Message from ${name}`
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            showSuccessState(name);
                        } else {
                            console.warn('Web3Forms failed, falling back to mail client...');
                            fallbackToMailto(name, email, message);
                            showSuccessState(name);
                        }
                    })
                    .catch(error => {
                        console.error('Error submitting Web3Forms:', error);
                        fallbackToMailto(name, email, message);
                        showSuccessState(name);
                    })
                    .finally(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    });
                } else {
                    // Fallback to mailto link immediately
                    setTimeout(() => {
                        fallbackToMailto(name, email, message);
                        showSuccessState(name);
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    }, 500);
                }
            }
        });
        
        // Reset Form Listener
        if (resetFormBtn) {
            resetFormBtn.addEventListener('click', () => {
                contactForm.reset();
                contactForm.classList.remove('hidden');
                formSuccess.classList.add('hidden');
            });
        }
    }
    
    function showError(inputElement, errorId, customMessage) {
        const group = inputElement.closest('.form-group');
        group.classList.add('error');
        const errorSpan = document.getElementById(errorId);
        if (errorSpan && customMessage) {
            errorSpan.textContent = customMessage;
        }
    }
    
    function clearError(inputElement, errorId) {
        const group = inputElement.closest('.form-group');
        group.classList.remove('error');
    }
});
