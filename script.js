// Smooth scroll behavior (already handled by CSS, but adding enhanced behavior)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(26, 58, 82, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(26, 58, 82, 0.08)';
    }
    
    lastScroll = currentScroll;
});

// Add animation on scroll for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.querySelectorAll('.service-card, .pricing-card, .credential-item, .contact-method').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Form submission handling (basic client-side validation)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        // Formspree will handle the actual submission
        // This is just for additional client-side handling if needed
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Re-enable after form processes (Formspree handles the redirect)
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Add hover effect to pricing cards
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// WhatsApp link dynamic generation (you'll need to update with actual number)
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', function(e) {
        // You can add analytics tracking here if needed
        console.log('WhatsApp link clicked');
    });
});

// Add current year to footer
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer-bottom p');
if (footerText) {
    footerText.textContent = `© ${currentYear} Precision Learning. All rights reserved.`;
}

// Pricing card highlight on scroll
const pricingCards = document.querySelectorAll('.pricing-card');
const pricingObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 150); // Stagger the animation
        }
    });
}, { threshold: 0.2 });

pricingCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    pricingObserver.observe(card);
});

// Console message for developers :)
console.log('%c🎓 Precision Learning - Built with care', 'color: #1a3a52; font-size: 16px; font-weight: bold;');
console.log('%cLooking at the code? Nice! This site was built with HTML, CSS, and vanilla JavaScript.', 'color: #ff6b4a; font-size: 12px;');

// PayFast Payment Integration
function payNow(packageType, amount, description) {
    // IMPORTANT: Replace these with your actual PayFast credentials after signing up
    const MERCHANT_ID = 'YOUR_MERCHANT_ID';  // Get this from PayFast dashboard
    const MERCHANT_KEY = 'YOUR_MERCHANT_KEY'; // Get this from PayFast dashboard
    
    // Check if merchant details are configured
    if (MERCHANT_ID === 'YOUR_MERCHANT_ID') {
        alert('Payment system is being configured. Please contact me directly via WhatsApp or the contact form to arrange payment.');
        return;
    }
    
    // Generate unique payment reference
    const paymentRef = 'TUT-' + packageType.toUpperCase() + '-' + Date.now();
    
    // PayFast payment data
    const paymentData = {
        merchant_id: MERCHANT_ID,
        merchant_key: MERCHANT_KEY,
        amount: amount.toFixed(2),
        item_name: description,
        item_description: 'Precision Learning - ' + description,
        
        // Return URLs (update these with your actual domain after deployment)
        return_url: window.location.origin + '/payment-success.html',
        cancel_url: window.location.origin + '/payment-cancelled.html',
        notify_url: window.location.origin + '/payment-notify.html',
        
        // Payment reference
        m_payment_id: paymentRef,
        
        // Optional: Add customer email if collected
        email_address: '', // Can collect this in a form
        
        // Optional: Cell number
        cell_number: '', // Can collect this in a form
    };
    
    // Create form dynamically and submit to PayFast
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://www.payfast.co.za/eng/process'; // Use sandbox URL for testing: https://sandbox.payfast.co.za/eng/process
    
    // Add all payment data as hidden fields
    for (const key in paymentData) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);
    }
    
    // Add form to page and submit
    document.body.appendChild(form);
    form.submit();
}

// Alternative: Show payment modal with options
function showPaymentOptions(packageType, amount, description) {
    // This creates a modal for users to choose payment method
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="payment-modal-content">
            <span class="close-modal" onclick="this.parentElement.parentElement.remove()">×</span>
            <h3>Choose Payment Method</h3>
            <p class="modal-description">${description} - R${amount}</p>
            
            <div class="modal-buttons">
                <button class="btn btn-primary" onclick="payNow('${packageType}', ${amount}, '${description}')">
                    💳 Pay Online (PayFast)
                </button>
                <button class="btn btn-outline" onclick="showBankDetails()">
                    🏦 Bank Transfer
                </button>
                <button class="btn btn-outline" onclick="window.location.href='#contact'">
                    📱 Contact Me First
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Show bank transfer details
function showBankDetails() {
    alert(`Bank Transfer Details:
    
Bank: [YOUR BANK NAME]
Account Name: [YOUR NAME]
Account Number: [YOUR ACCOUNT NUMBER]
Branch Code: [BRANCH CODE]
Reference: Your Name + TUT

Please WhatsApp proof of payment to confirm your booking.`);
    
    // Redirect to WhatsApp
    window.open('https://wa.me/27XXXXXXXXX?text=Hi!%20I%20made%20a%20bank%20transfer%20for%20tutoring', '_blank');
}
