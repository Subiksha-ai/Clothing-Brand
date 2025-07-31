// Get all products data
const allProducts = {
    ...window.products?.women?.reduce((acc, product) => ({ ...acc, [product.id]: product }), {}) || {},
    ...window.products?.men?.reduce((acc, product) => ({ ...acc, [product.id]: product }), {}) || {}
};

// Cart state
let cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
let likedItems = JSON.parse(localStorage.getItem('likedItems') || '[]');

// Create cart item HTML
function createCartItemHTML(product, quantity = 1) {
    return `
        <div class="cart-item glass-effect" data-id="${product.id}">
            <div class="item-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="item-details">
                <h3>${product.name}</h3>
                <p class="item-price">$${product.price.toFixed(2)}</p>
                <div class="item-quantity">
                    <button class="quantity-btn decrease">-</button>
                    <span class="quantity">${quantity}</span>
                    <button class="quantity-btn increase">+</button>
                </div>
            </div>
            <div class="item-actions">
                <button class="remove-btn">Remove</button>
            </div>
        </div>
    `;
}

// Create liked item HTML
function createLikedItemHTML(product) {
    return `
        <div class="liked-item glass-effect" data-id="${product.id}">
            <div class="item-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="item-details">
                <h3>${product.name}</h3>
                <p class="item-price">$${product.price.toFixed(2)}</p>
            </div>
            <div class="item-actions">
                <button class="add-to-cart-btn">Add to Cart</button>
                <button class="remove-btn">Remove</button>
            </div>
        </div>
    `;
}

// Update cart display
function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return;

    // Count quantities
    const quantities = cartItems.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
    }, {});

    // Create HTML for unique items
    const uniqueItems = [...new Set(cartItems)];
    cartContainer.innerHTML = uniqueItems
        .map(id => createCartItemHTML(allProducts[id], quantities[id]))
        .join('');

    updateCartSummary();
}

// Update liked items display
function updateLikedDisplay() {
    const likedContainer = document.getElementById('liked-items');
    if (!likedContainer) return;

    likedContainer.innerHTML = likedItems
        .map(id => createLikedItemHTML(allProducts[id]))
        .join('');
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cartItems.reduce((sum, id) => sum + allProducts[id].price, 0);
    const shipping = cartItems.length > 0 ? 5 : 0;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Handle quantity changes
function handleQuantityChange(e) {
    const btn = e.target;
    if (!btn.classList.contains('quantity-btn')) return;

    const item = btn.closest('.cart-item');
    const id = item.dataset.id;
    const quantitySpan = item.querySelector('.quantity');
    let quantity = parseInt(quantitySpan.textContent);

    if (btn.classList.contains('increase')) {
        quantity++;
        cartItems.push(id);
    } else if (btn.classList.contains('decrease') && quantity > 1) {
        quantity--;
        const index = cartItems.lastIndexOf(id);
        if (index > -1) cartItems.splice(index, 1);
    }

    quantitySpan.textContent = quantity;
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartSummary();
}

// Handle remove from cart
function handleRemoveFromCart(e) {
    const btn = e.target;
    if (!btn.classList.contains('remove-btn')) return;

    const item = btn.closest('.cart-item, .liked-item');
    const id = item.dataset.id;

    if (item.classList.contains('cart-item')) {
        cartItems = cartItems.filter(itemId => itemId !== id);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCartDisplay();
    } else {
        likedItems = likedItems.filter(itemId => itemId !== id);
        localStorage.setItem('likedItems', JSON.stringify(likedItems));
        updateLikedDisplay();
    }
}

// Handle add to cart from liked items
function handleAddToCartFromLiked(e) {
    const btn = e.target;
    if (!btn.classList.contains('add-to-cart-btn')) return;

    const item = btn.closest('.liked-item');
    const id = item.dataset.id;

    cartItems.push(id);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartDisplay();

    showNotification('Added to cart!');
}

// Handle payment method selection
function handlePaymentSelection(e) {
    const option = e.target.closest('.payment-option');
    if (!option) return;

    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    option.classList.add('selected');
}

// Handle checkout
function handleCheckout() {
    const selectedPayment = document.querySelector('.payment-option.selected');
    if (!selectedPayment) {
        showNotification('Please select a payment method!');
        return;
    }

    if (cartItems.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    // Simulate checkout process
    showNotification('Processing your order...');
    setTimeout(() => {
        cartItems = [];
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCartDisplay();
        showNotification('Order placed successfully!');
    }, 2000);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification glass-effect';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    updateLikedDisplay();

    // Event listeners
    document.addEventListener('click', handleQuantityChange);
    document.addEventListener('click', handleRemoveFromCart);
    document.addEventListener('click', handleAddToCartFromLiked);
    document.addEventListener('click', handlePaymentSelection);

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }

    // Handle direct buy now
    const urlParams = new URLSearchParams(window.location.search);
    const buyProductId = urlParams.get('buy');
    if (buyProductId && allProducts[buyProductId]) {
        cartItems.push(buyProductId);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCartDisplay();
    }
});