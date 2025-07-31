// Sample product data
const products = {
    women: [
        {
            id: 'w1',
            name: 'Summer Floral Top',
            price: 39.99,
            rating: 4.5,
            image: 'images/placeholder.svg',
            category: 'tops'
        },
        {
            id: 'w2',
            name: 'High-Waist Leggings',
            price: 29.99,
            rating: 4.8,
            image: 'images/placeholder.svg',
            category: 'leggings'
        },
        {
            id: 'w3',
            name: 'Printed Palazzo Pants',
            price: 44.99,
            rating: 4.6,
            image: 'images/placeholder.svg',
            category: 'palazzos'
        },
        {
            id: 'w4',
            name: 'Casual Crop Top',
            price: 24.99,
            rating: 4.3,
            image: 'images/placeholder.svg',
            category: 'tops'
        }
    ],
    men: [
        {
            id: 'm1',
            name: 'Classic White T-Shirt',
            price: 24.99,
            rating: 4.7,
            image: 'images/placeholder.svg',
            category: 'tshirts'
        },
        {
            id: 'm2',
            name: 'Formal Blue Shirt',
            price: 49.99,
            rating: 4.6,
            image: 'images/placeholder.svg',
            category: 'shirts'
        },
        {
            id: 'm3',
            name: 'Slim Fit Chinos',
            price: 54.99,
            rating: 4.5,
            image: 'images/placeholder.svg',
            category: 'pants'
        },
        {
            id: 'm4',
            name: 'Graphic Print T-Shirt',
            price: 29.99,
            rating: 4.4,
            image: 'images/placeholder.svg',
            category: 'tshirts'
        }
    ]
};

// Create product card HTML
function createProductCard(product) {
    const stars = '★'.repeat(Math.floor(product.rating)) + 
                 '☆'.repeat(5 - Math.floor(product.rating));
    
    return `
        <div class="product-card glass-effect" data-category="${product.category}">
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

// Display products
function displayProducts(gender, category = 'all') {
    const container = document.getElementById(`${gender}-products`);
    const productsList = products[gender];
    
    if (!container || !productsList) return;

    const filteredProducts = category === 'all' 
        ? productsList
        : productsList.filter(p => p.category === category);

    container.innerHTML = filteredProducts.map(createProductCard).join('');
}

// Handle filter clicks
function handleFilterClick(e) {
    if (!e.target.classList.contains('filter-btn')) return;

    const section = e.target.closest('.category-section');
    const gender = section.querySelector('.product-grid').id.split('-')[0];
    const category = e.target.dataset.category;

    // Update active button
    section.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');

    // Display filtered products
    displayProducts(gender, category);
}

// Handle like button clicks
function handleLikeClick(e) {
    if (e.target.closest('.like-btn')) {
        const btn = e.target.closest('.like-btn');
        btn.classList.toggle('liked');
        const heart = btn.querySelector('.heart');
        heart.textContent = btn.classList.contains('liked') ? '♥' : '♡';

        // Save to liked items
        const productId = btn.dataset.id;
        const likedItems = JSON.parse(localStorage.getItem('likedItems') || '[]');
        if (btn.classList.contains('liked')) {
            if (!likedItems.includes(productId)) {
                likedItems.push(productId);
            }
        } else {
            const index = likedItems.indexOf(productId);
            if (index > -1) {
                likedItems.splice(index, 1);
            }
        }
        localStorage.setItem('likedItems', JSON.stringify(likedItems));
    }
}

// Handle add to cart
function handleAddToCart(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const productId = e.target.dataset.id;
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        showNotification('Product added to cart!');
    }
}

// Handle buy now
function handleBuyNow(e) {
    if (e.target.classList.contains('buy-now')) {
        const productId = e.target.dataset.id;
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
    // Display initial products
    displayProducts('women');
    displayProducts('men');

    // Load liked items
    const likedItems = JSON.parse(localStorage.getItem('likedItems') || '[]');
    likedItems.forEach(productId => {
        const btn = document.querySelector(`.like-btn[data-id="${productId}"]`);
        if (btn) {
            btn.classList.add('liked');
            btn.querySelector('.heart').textContent = '♥';
        }
    });

    // Event listeners
    document.addEventListener('click', handleFilterClick);
    document.addEventListener('click', handleLikeClick);
    document.addEventListener('click', handleAddToCart);
    document.addEventListener('click', handleBuyNow);
});