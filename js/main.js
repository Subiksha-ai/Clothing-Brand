// Sample product data (to be replaced with actual data)
const products = [
    {
        id: 1,
        name: 'Elegant Summer Dress',
        price: 79.99,
        rating: 4.5,
        image: 'images/placeholder.svg',
        category: 'women',
        type: 'best'
    },
    {
        id: 2,
        name: 'Classic White Shirt',
        price: 49.99,
        rating: 4.8,
        image: 'images/placeholder.svg',
        category: 'men',
        type: 'offer'
    },
    {
        id: 3,
        name: 'Comfort Fit Leggings',
        price: 34.99,
        rating: 4.7,
        image: 'images/placeholder.svg',
        category: 'women',
        type: 'best'
    }
];

// Create product card HTML
function createProductCard(product) {
    const stars = '★'.repeat(Math.floor(product.rating)) + 
                 '☆'.repeat(5 - Math.floor(product.rating));
    
    return `
        <div class="product-card glass-effect">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <button class="like-btn" data-id="${product.id}">
                    <span class="heart">♡</span>
                </button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <div class="rating">${stars} (${product.rating})</div>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    <button class="buy-now" data-id="${product.id}">Buy Now</button>
                </div>
            </div>
        </div>
    `;
}

// Populate product sections
function populateProducts() {
    const bestProductsSection = document.querySelector('.best-products .product-grid');
    const offerProductsSection = document.querySelector('.offer-products .offer-grid');

    if (bestProductsSection) {
        const bestProducts = products.filter(p => p.type === 'best');
        bestProductsSection.innerHTML = bestProducts.map(createProductCard).join('');
    }

    if (offerProductsSection) {
        const offerProducts = products.filter(p => p.type === 'offer');
        offerProductsSection.innerHTML = offerProducts.map(createProductCard).join('');
    }
}

// Handle like button clicks
function handleLikeClick(e) {
    if (e.target.closest('.like-btn')) {
        const btn = e.target.closest('.like-btn');
        btn.classList.toggle('liked');
        const heart = btn.querySelector('.heart');
        heart.textContent = btn.classList.contains('liked') ? '♥' : '♡';
    }
}

// Handle add to cart clicks
function handleAddToCart(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const productId = e.target.dataset.id;
        // Add to cart functionality to be implemented
        console.log(`Added product ${productId} to cart`);
        showNotification('Product added to cart!');
    }
}

// Handle buy now clicks
function handleBuyNow(e) {
    if (e.target.classList.contains('buy-now')) {
        const productId = e.target.dataset.id;
        // Buy now functionality to be implemented
        console.log(`Buying product ${productId}`);
        window.location.href = `cart.html?buy=${productId}`;
    }
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
    populateProducts();

    // Event listeners
    document.addEventListener('click', handleLikeClick);
    document.addEventListener('click', handleAddToCart);
    document.addEventListener('click', handleBuyNow);
});