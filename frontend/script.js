// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================

const API_URL = 'http://localhost:8080/api';
const ADMIN_PASSWORD = '12345'; // En producción usar hash
let products = [];
let cart = [];
let currentSlide = 0;
let adminLoggedIn = false;
let selectedProductForModal = null;
let selectedSize = null;

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadCartFromLocalStorage();
    loadProducts();
    setupEventListeners();
    setupCarousel();
    updateCartCount();
}

// ============================================
// CARGA DE PRODUCTOS
// ============================================

async function loadProducts() {
    try {
        // Intentar cargar desde API
        const response = await fetch(`${API_URL}/products`);
        
        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }
        
        products = await response.json();
        renderProducts(products);
        renderFeaturedProducts();
        renderNewProducts();
    } catch (error) {
        console.warn('API no disponible, usando datos locales:', error);
        // Si la API no está disponible, mostrar mensaje
        document.getElementById('productContainer').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-server"></i>
                <p>API no disponible. Agregue productos desde el panel de administración.</p>
            </div>
        `;
    }
}

function renderProducts(productsToRender) {
    const container = document.getElementById('productContainer');
    
    if (productsToRender.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No hay productos disponibles en este momento.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <img src="${product.imagen}" alt="${product.nombre}" class="product-image">
            <div class="product-body">
                <h3 class="product-name">${product.nombre}</h3>
                <p class="product-description">${truncateText(product.descripcion, 60)}</p>
                <div class="product-footer">
                    <div>
                        <div class="product-price">$${formatPrice(product.precio)}</div>
                        <div class="product-sizes-display">${product.tallas.split(',').length} tallas</div>
                    </div>
                    <button class="btn-add-cart" onclick="openProductModal(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Ver
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderFeaturedProducts() {
    const featured = products.filter(p => p.destacado === true).slice(0, 4);
    const container = document.getElementById('featuredContainer');
    
    if (featured.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <p>No hay productos destacados aún.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = featured.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <img src="${product.imagen}" alt="${product.nombre}" class="product-image">
            <div class="product-body">
                <h3 class="product-name">${product.nombre}</h3>
                <p class="product-description">${truncateText(product.descripcion, 60)}</p>
                <div class="product-footer">
                    <div>
                        <div class="product-price">$${formatPrice(product.precio)}</div>
                        <div class="product-sizes-display">${product.tallas.split(',').length} tallas</div>
                    </div>
                    <button class="btn-add-cart" onclick="openProductModal(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Ver
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderNewProducts() {
    // Productos creados recientemente (últimos 4)
    const newProducts = products.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)).slice(0, 4);
    const container = document.getElementById('newProductsContainer');
    
    if (newProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <p>No hay productos nuevos aún.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = newProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <img src="${product.imagen}" alt="${product.nombre}" class="product-image">
            <div class="product-body">
                <h3 class="product-name">${product.nombre}</h3>
                <p class="product-description">${truncateText(product.descripcion, 60)}</p>
                <div class="product-footer">
                    <div>
                        <div class="product-price">$${formatPrice(product.precio)}</div>
                        <div class="product-sizes-display">${product.tallas.split(',').length} tallas</div>
                    </div>
                    <button class="btn-add-cart" onclick="openProductModal(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Ver
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// MODAL DE PRODUCTO
// ============================================

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    selectedProductForModal = product;
    selectedSize = null;

    // Llenar datos del modal
    document.getElementById('productModalName').textContent = product.nombre;
    document.getElementById('productModalPrice').textContent = `$${formatPrice(product.precio)}`;
    document.getElementById('productModalDescription').textContent = product.descripcion;
    document.getElementById('productModalImage').src = product.imagen;

    // Cargar tallas
    const sizes = product.tallas.split(',').map(s => s.trim());
    const sizeSelector = document.getElementById('sizeSelector');
    sizeSelector.innerHTML = sizes.map(size => `
        <button class="size-btn" data-size="${size}" onclick="selectSize('${size}')">
            ${size}
        </button>
    `).join('');

    // Resetear cantidad
    document.getElementById('quantityInput').value = 1;

    // Mostrar modal
    document.getElementById('productModal').classList.add('active');
}

function selectSize(size) {
    selectedSize = size;
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.querySelector(`[data-size="${size}"]`).classList.add('selected');
}

// ============================================
// CARRITO DE COMPRAS
// ============================================

function addToCart() {
    if (!selectedSize) {
        showToast('Por favor selecciona una talla', 'error');
        return;
    }

    const quantity = parseInt(document.getElementById('quantityInput').value) || 1;
    const cartItem = {
        id: selectedProductForModal.id,
        nombre: selectedProductForModal.nombre,
        precio: selectedProductForModal.precio,
        imagen: selectedProductForModal.imagen,
        talla: selectedSize,
        cantidad: quantity
    };

    const existingItem = cart.find(item => 
        item.id === cartItem.id && item.talla === cartItem.talla
    );

    if (existingItem) {
        existingItem.cantidad += quantity;
    } else {
        cart.push(cartItem);
    }

    saveCartToLocalStorage();
    updateCartCount();
    showToast(`${selectedProductForModal.nombre} agregado al carrito`, 'success');
    
    // Cerrar modal
    document.getElementById('productModal').classList.remove('active');
}

function addToCartFromCard(productId, size) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cartItem = {
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        imagen: product.imagen,
        talla: size,
        cantidad: 1
    };

    const existingItem = cart.find(item => 
        item.id === cartItem.id && item.talla === cartItem.talla
    );

    if (existingItem) {
        existingItem.cantidad += 1;
    } else {
        cart.push(cartItem);
    }

    saveCartToLocalStorage();
    updateCartCount();
    showToast(`${product.nombre} agregado al carrito`, 'success');
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.cantidad, 0);
    document.getElementById('cartCount').textContent = count;
}

function renderCart() {
    const container = document.getElementById('cartItemsContainer');

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        document.getElementById('checkout').disabled = true;
        document.getElementById('emptyCart').disabled = true;
        updateCartTotals();
        return;
    }

    document.getElementById('checkout').disabled = false;
    document.getElementById('emptyCart').disabled = false;

    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.imagen}" alt="${item.nombre}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.nombre}</div>
                <div class="cart-item-size">Talla: ${item.talla}</div>
                <div class="cart-item-price">$${formatPrice(item.precio)}</div>
                <div class="cart-item-controls">
                    <label>Cantidad:</label>
                    <input 
                        type="number" 
                        class="quantity-input" 
                        value="${item.cantidad}" 
                        min="1" 
                        max="10"
                        onchange="updateCartItemQuantity(${index}, this.value)"
                    >
                    <button class="btn-remove" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    updateCartTotals();
}

function updateCartItemQuantity(index, newQuantity) {
    newQuantity = parseInt(newQuantity) || 1;
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 10) newQuantity = 10;

    cart[index].cantidad = newQuantity;
    saveCartToLocalStorage();
    renderCart();
}

function removeFromCart(index) {
    const item = cart[index];
    cart.splice(index, 1);
    saveCartToLocalStorage();
    updateCartCount();
    renderCart();
    showToast(`${item.nombre} eliminado del carrito`, 'info');
}

function emptyCart() {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        cart = [];
        saveCartToLocalStorage();
        updateCartCount();
        renderCart();
        showToast('Carrito vaciado', 'info');
    }
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const shipping = subtotal > 50000 ? 0 : 10000;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `$${formatPrice(subtotal)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'Gratis' : `$${formatPrice(shipping)}`;
    document.getElementById('total').textContent = `$${formatPrice(total)}`;
}

// ============================================
// PERSISTENCIA - LOCAL STORAGE
// ============================================

function saveCartToLocalStorage() {
    localStorage.setItem('stepvibe_cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const saved = localStorage.getItem('stepvibe_cart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}

// ============================================
// PANEL DE ADMINISTRACIÓN
// ============================================

async function handleAdminLogin(password) {
    if (password === ADMIN_PASSWORD) {
        adminLoggedIn = true;
        document.getElementById('adminLogin').classList.remove('active');
        document.getElementById('adminPanel').classList.add('active');
        showToast('Acceso de administrador concedido', 'success');
        loadAdminProducts();
    } else {
        showToast('Contraseña incorrecta', 'error');
    }
}

function logoutAdmin() {
    adminLoggedIn = false;
    document.getElementById('adminLogin').classList.add('active');
    document.getElementById('adminPanel').classList.remove('active');
    document.getElementById('adminPassword').value = '';
    showToast('Sesión de administrador cerrada', 'info');
}

async function handleAddProduct(formData) {
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al agregar producto');
        }

        showToast('Producto agregado exitosamente', 'success');
        document.getElementById('addProductForm').reset();
        document.getElementById('imagePreview').innerHTML = '';
        
        // Recargar productos
        await loadProducts();
        loadAdminProducts();
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al agregar producto: ' + error.message, 'error');
    }
}

async function deleteProduct(productId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar producto');
        }

        showToast('Producto eliminado exitosamente', 'success');
        await loadProducts();
        loadAdminProducts();
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al eliminar producto: ' + error.message, 'error');
    }
}

function loadAdminProducts() {
    const container = document.getElementById('adminProductsList');
    
    if (products.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No hay productos aún.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="admin-product-item">
            <div class="admin-product-info">
                <div class="admin-product-name">${product.nombre}</div>
                <div class="admin-product-price">$${formatPrice(product.precio)}</div>
            </div>
            <div class="admin-product-actions">
                <button class="btn-edit" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

function editProduct(productId) {
    showToast('Función de edición disponible pronto', 'info');
}

// ============================================
// BÚSQUEDA Y FILTROS
// ============================================

function handleSearch(query) {
    if (!query.trim()) {
        renderProducts(products);
        return;
    }

    const filtered = products.filter(product =>
        product.nombre.toLowerCase().includes(query.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(query.toLowerCase())
    );

    renderProducts(filtered);
}

function handlePriceFilter(range) {
    if (!range) {
        renderProducts(products);
        return;
    }

    const [min, max] = range.split('-').map(Number);
    const filtered = products.filter(p => p.precio >= min && p.precio <= max);
    renderProducts(filtered);
}

function handleSort(sortType) {
    let sorted = [...products];

    switch(sortType) {
        case 'precio-asc':
            sorted.sort((a, b) => a.precio - b.precio);
            break;
        case 'precio-desc':
            sorted.sort((a, b) => b.precio - a.precio);
            break;
        case 'nombre':
            sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case 'nuevo':
        default:
            sorted.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
    }

    renderProducts(sorted);
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('priceFilter').value = '';
    document.getElementById('sortFilter').value = 'nuevo';
    renderProducts(products);
}

// ============================================
// CARRUSEL
// ============================================

function setupCarousel() {
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    
    if (slides.length === 0) return;

    slides[0].classList.add('active');
    updateCarouselIndicators();

    // Auto play
    setInterval(() => {
        nextSlide();
    }, 5000);
}

function nextSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
    updateCarouselIndicators();
}

function prevSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    updateCarouselIndicators();
}

function updateCarouselIndicators() {
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// ============================================
// MODAL MANAGEMENT
// ============================================

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // BÚSQUEDA
    document.getElementById('searchInput').addEventListener('input', (e) => {
        handleSearch(e.target.value);
    });

    // FILTROS
    document.getElementById('priceFilter').addEventListener('change', (e) => {
        handlePriceFilter(e.target.value);
    });

    document.getElementById('sortFilter').addEventListener('change', (e) => {
        handleSort(e.target.value);
    });

    document.getElementById('resetFilters').addEventListener('click', resetFilters);

    // CARRITO
    document.getElementById('cartBtn').addEventListener('click', () => {
        renderCart();
        openModal('cartModal');
    });

    document.getElementById('closeCart').addEventListener('click', () => {
        closeModal('cartModal');
    });

    document.getElementById('emptyCart').addEventListener('click', emptyCart);

    document.getElementById('checkout').addEventListener('click', () => {
        showToast('Función de pago en desarrollo', 'info');
    });

    document.getElementById('addToCartModal').addEventListener('click', addToCart);

    // MODAL PRODUCTO
    document.getElementById('closeProduct').addEventListener('click', () => {
        closeModal('productModal');
    });

    document.getElementById('increaseQty').addEventListener('click', () => {
        const input = document.getElementById('quantityInput');
        input.value = Math.min(10, parseInt(input.value) + 1);
    });

    document.getElementById('decreaseQty').addEventListener('click', () => {
        const input = document.getElementById('quantityInput');
        input.value = Math.max(1, parseInt(input.value) - 1);
    });

    // CARRUSEL
    document.getElementById('carouselNext').addEventListener('click', nextSlide);
    document.getElementById('carouselPrev').addEventListener('click', prevSlide);

    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            const slides = document.querySelectorAll('.carousel-slide');
            slides[currentSlide].classList.remove('active');
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            updateCarouselIndicators();
        });
    });

    // ADMINISTRADOR
    document.getElementById('adminBtn').addEventListener('click', () => {
        if (adminLoggedIn) {
            openModal('adminModal');
        } else {
            openModal('adminModal');
            document.getElementById('adminPassword').focus();
        }
    });

    document.getElementById('closeAdmin').addEventListener('click', () => {
        closeModal('adminModal');
        if (adminLoggedIn) {
            logoutAdmin();
        }
    });

    document.getElementById('loginAdminBtn').addEventListener('click', () => {
        const password = document.getElementById('adminPassword').value;
        handleAdminLogin(password);
    });

    document.getElementById('adminPassword').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const password = document.getElementById('adminPassword').value;
            handleAdminLogin(password);
        }
    });

    document.getElementById('logoutAdminBtn').addEventListener('click', () => {
        closeModal('adminModal');
        logoutAdmin();
    });

    // TABS ADMIN
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target.closest('.logout-btn')) return;
            
            const tabName = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });

    // FORMULARIO AGREGAR PRODUCTO
    document.getElementById('addProductForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nombre', document.getElementById('productName').value);
        formData.append('descripcion', document.getElementById('productDescription').value);
        formData.append('precio', document.getElementById('productPrice').value);
        formData.append('tallas', document.getElementById('productSizes').value);
        formData.append('destacado', document.getElementById('productFeatured').checked);

        const imageFile = document.getElementById('productImage').files[0];
        if (imageFile) {
            formData.append('imagen', imageFile);
        }

        handleAddProduct(formData);
    });

    // PREVIEW DE IMAGEN
    document.getElementById('productImage').addEventListener('change', (e) => {
        const file = e.target.files[0];
        const fileName = document.querySelector('.file-name');
        
        if (file) {
            fileName.textContent = file.name;

            const reader = new FileReader();
            reader.onload = (event) => {
                const preview = document.getElementById('imagePreview');
                preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // HAMBURGUESA MÓVIL
    document.getElementById('hamburger').addEventListener('click', () => {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.nav-menu').classList.remove('active');
        });
    });

    // Cerrar modales al hacer clic fuera
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                if (modal.id === 'adminModal' && adminLoggedIn) {
                    logoutAdmin();
                }
            }
        });
    });
}

// ============================================
// UTILIDADES
// ============================================

function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price).replace('COP', '').trim();
}

function truncateText(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// CERRAR SESIÓN AL CERRAR PESTAÑA
// ============================================

window.addEventListener('beforeunload', () => {
    if (adminLoggedIn) {
        adminLoggedIn = false;
    }
});
