document.addEventListener("DOMContentLoaded", () => {
    
    // Loader
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1500);

    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('scrolled');
            navbar.classList.remove('scrolled'); // Force layout
            if(window.scrollY <= 50) navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated to keep it visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Submitting Email Form Demo
    const form = document.querySelector('.subscribe-form');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = "Unlocked!";
            btn.style.background = "var(--secondary)";
            btn.style.color = "#fff";
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = "";
                btn.style.color = "";
                form.reset();
            }, 3000);
        });
    }

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Cart functionality
    let cartItems = [];
    const cartCountElement = document.getElementById('cart-count');
    const addButtons = document.querySelectorAll('.btn-sn');
    const cartBtn = document.querySelector('.cta-nav');
    const floatingCartBtn = document.getElementById('floating-cart-btn');
    const floatingCartCountElement = document.getElementById('floating-cart-count');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Toggle cart
    const openCart = () => {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    };
    
    const closeCart = () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    };

    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (floatingCartBtn) floatingCartBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    const updateCartUI = () => {
        if(cartCountElement) cartCountElement.textContent = cartItems.length;
        if(floatingCartCountElement) {
            floatingCartCountElement.textContent = cartItems.length;
            // Add a little pop effect dynamically to the floating badge when an item is added
            floatingCartCountElement.style.transform = 'scale(1.2)';
            setTimeout(() => floatingCartCountElement.style.transform = 'scale(1)', 200);
        }
        
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        if(cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding-top:2rem;">Your cart is empty.</p>';
        } else {
            cartItems.forEach((item, index) => {
                total += item.price;
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>₹${item.price}</p>
                    </div>
                    <button class="drop-item-btn" data-index="${index}">Drop</button>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }
        
        if(cartTotalPrice) cartTotalPrice.textContent = '₹' + total;
        
        // Re-attach drop events
        document.querySelectorAll('.drop-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                cartItems.splice(idx, 1);
                updateCartUI();
            });
        });
    };

    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Extract item data
            const card = e.target.closest('.card');
            const cardInfo = card.querySelector('.card-info');
            
            const name = cardInfo.querySelector('h3').textContent;
            // Target first textNode precisely
            const priceRaw = cardInfo.querySelector('.price').childNodes[0].nodeValue || cardInfo.querySelector('.price').textContent; 
            const price = parseInt(priceRaw.replace(/[^0-9]/g, ''));
            const img = card.querySelector('.card-visual img').getAttribute('src');

            cartItems.push({ name, price, img });
            updateCartUI();
            
            // Visual feedback on the button
            const originalText = btn.textContent;
            btn.textContent = "Added ✓";
            
            // Pop effect
            if (cartBtn) {
                cartBtn.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    cartBtn.style.transform = 'scale(1)';
                }, 200);
            }
            
            setTimeout(() => {
                btn.textContent = originalText;
            }, 1000); 
        });
    });
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cartItems.length > 0) {
                // Save cart data for the checkout page
                localStorage.setItem('fensc_cart', JSON.stringify(cartItems));
                // Redirect securely to a fully-fleshed payment UI page
                window.location.href = 'checkout.html';
            } else {
                alert("Your cart is empty! Add some caps first.");
            }
        });
    }
    
    // Initial UI state
    updateCartUI();
});
