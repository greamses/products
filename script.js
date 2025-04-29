import clothes from '/clothes.js';

class ECommerceApp {
  constructor() {
    this.elements = {
      shirtContainer: document.getElementById('shirt-container'),
      cartIcon: document.getElementById('cart-icon'),
      cartCount: document.querySelector('.cart-count'),
      cartSidebar: document.getElementById('cart-sidebar'),
      closeCart: document.getElementById('close-cart'),
      cartOverlay: document.getElementById('cart-overlay'),
      cartItemsContainer: document.getElementById('cart-items'),
      cartTotalPrice: document.getElementById('cart-total-price'),
      checkoutBtn: document.getElementById('checkout-btn'),
      productModal: document.getElementById('product-modal'),
      modalOverlay: document.getElementById('modal-overlay'),
      closeModal: document.querySelector('.close-modal'),
      modalMainImage: document.getElementById('modal-main-image'),
      thumbnailContainer: document.getElementById('thumbnail-container'),
      modalProductName: document.getElementById('modal-product-name'),
      modalPrice: document.getElementById('modal-price'),
      modalDescription: document.getElementById('modal-description'),
      sizeOptions: document.getElementById('size-options'),
      colorOptions: document.getElementById('color-options'),
      addToCartModal: document.querySelector('.add-to-cart-modal'),
      quantityMinus: document.querySelector('.quantity-btn.minus'),
      quantityPlus: document.querySelector('.quantity-btn.plus'),
      quantityDisplay: document.querySelector('.quantity'),
      searchInput: document.getElementById('search-input'),
      filterSelect: document.getElementById('filter-select'),
      checkoutModal: document.getElementById('checkout-modal'),
      closeCheckout: document.getElementById('close-checkout'),
      checkoutForm: document.getElementById('checkout-form'),
      customAlert: document.getElementById('custom-alert'),
      alertMessage: document.getElementById('alert-message'),
      alertClose: document.querySelector('.alert-close')
    };
    
    this.state = {
      cart: JSON.parse(localStorage.getItem('cart')) || [],
      filteredProducts: [...clothes],
      currentQuantity: 1,
      selectedProduct: null,
      selectedSize: null,
      selectedColor: null
    };
    
    this.init();
    
    const filterSelectContainer = document.querySelector('.custom-select');
    this.filterSelect = new CustomSelect(filterSelectContainer);
    
    const paymentSelectContainer = document.querySelector('.payment-select');
    this.paymentSelect = new CustomSelect(paymentSelectContainer);
  }
  
  init() {
    this.renderProducts();
    this.setupEventListeners();
    this.updateCartUI();
  }
  
  // Product Rendering
  renderProducts() {
    this.elements.shirtContainer.innerHTML = this.state.filteredProducts.map(shirt => `
      <div class="shirt-card" data-id="${shirt.id}">
        <img src="${shirt.imageUrl}" alt="${shirt.name}">
        <h3>${shirt.name}</h3>
        <p class="price">₦${shirt.price.toLocaleString()}</p>
        <button class="button add-to-cart" data-id="${shirt.id}">Add to Cart</button>
      </div>
    `).join('');
  }
  
  // Search and Filter
  handleSearch() {
    const searchTerm = this.elements.searchInput.value.toLowerCase();
    const filterValue = this.elements.filterSelect.value;
    
    this.state.filteredProducts = clothes.filter(product => {
      const matchesSearch = product.description.toLowerCase().includes(searchTerm) ||product.name.toLowerCase().includes(searchTerm) ||product.category.toLowerCase().includes(searchTerm);
      const matchesFilter = filterValue === 'all' || product.category === filterValue;
      return matchesSearch && matchesFilter;
    });
    
    this.renderProducts();
  }
  
  // Cart Management
  openCart() {
    this.elements.cartSidebar.classList.add('active');
    this.elements.cartOverlay.classList.add('active');
  }
  
  closeCart() {
    this.elements.cartSidebar.classList.remove('active');
    this.elements.cartOverlay.classList.remove('active');
  }
  
  addToCart(product) {
    const existingItem = this.state.cart.find(item =>
      item.id === product.id &&
      item.selectedSize === (product.selectedSize || null) &&
      item.selectedColor === (product.selectedColor || null)
    );
    
    if (existingItem) {
      existingItem.quantity += product.quantity || 1;
      // not just increment
    } else {
      this.state.cart.push({
        ...product,
        quantity: product.quantity || 1,
        selectedSize: product.selectedSize || null,
        selectedColor: product.selectedColor || null
      });
    }
    
    this.saveCart();
  }
  
  removeFromCart(productId) {
    this.state.cart = this.state.cart.filter(item => item.id !== productId);
    this.saveCart();
    this.updateCartUI();
  }
  
  updateQuantity(productId, newQuantity) {
    const item = this.state.cart.find(item => item.id === productId);
    
    if (item) {
      if (newQuantity > 0) {
        item.quantity = newQuantity;
      } else {
        this.removeFromCart(productId);
        return;
      }
      
      this.saveCart();
      this.updateCartUI();
    }
  }
  
  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.state.cart));
    this.updateCartUI();
  }
  
  calculateTotal() {
    return this.state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  
  updateCartUI() {
    // Update cart count
    const totalItems = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
    this.elements.cartCount.textContent = totalItems;
    
    // Remove any existing event listeners to prevent duplicates
    const oldCartItemsContainer = this.elements.cartItemsContainer;
    const newCartItemsContainer = oldCartItemsContainer.cloneNode(false);
    oldCartItemsContainer.parentNode.replaceChild(newCartItemsContainer, oldCartItemsContainer);
    this.elements.cartItemsContainer = newCartItemsContainer;
    
    // Render cart items
    if (this.state.cart.length === 0) {
      this.elements.cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-bag"></i>
        <p>Your cart is empty</p>
        <button class="button continue-shopping">Continue Shopping</button>
      </div>
    `;
      
      const continueBtn = this.elements.cartItemsContainer.querySelector('.continue-shopping');
      if (continueBtn) {
        continueBtn.addEventListener('click', () => this.closeCart());
      }
    } else {
      this.elements.cartItemsContainer.innerHTML = this.state.cart.map(item => `
      <div class="cart-item">
        <img src="${item.imageUrl}" alt="${item.name}">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          ${item.selectedSize ? `<p>Size: ${item.selectedSize}</p>` : ''}
          ${item.selectedColor ? `<p>Color: ${item.selectedColor}</p>` : ''}
          <p class="cart-item-price">₦${item.price.toLocaleString()}</p>
          <div class="quantity-controls">
            <button class="decrease" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="increase" data-id="${item.id}">+</button>
          </div>
          <button class="remove-item" data-id="${item.id}">
            <i class="fas fa-trash-alt"></i> Remove
          </button>
        </div>
      </div>
    `).join('');
      
      this.elements.cartItemsContainer.addEventListener('click', (e) => {
        const decreaseBtn = e.target.closest('.decrease');
        const increaseBtn = e.target.closest('.increase');
        const removeBtn = e.target.closest('.remove-item');
        
        if (!decreaseBtn && !increaseBtn && !removeBtn) return;
        
        const id = parseInt(
          decreaseBtn?.getAttribute('data-id') ||
          increaseBtn?.getAttribute('data-id') ||
          removeBtn?.getAttribute('data-id')
        );
        
        const item = this.state.cart.find(item => item.id === id);
        if (!item) return;
        
        if (decreaseBtn) {
          this.updateQuantity(id, item.quantity - 1);
        } else if (increaseBtn) {
          this.updateQuantity(id, item.quantity + 1);
        } else if (removeBtn) {
          this.removeFromCart(id);
          this.showAlert(`${item.name} removed from cart`, 'error');
        }
      });
    }
    
    // Update total price
    this.elements.cartTotalPrice.textContent = `₦${this.calculateTotal().toLocaleString()}`;
  }
  
  // Product Modal
  openProductModal(product) {
    this.state.currentQuantity = 1;
    this.state.selectedSize = null;
    this.state.selectedColor = null;
    
    // Update UI
    this.elements.quantityDisplay.textContent = this.state.currentQuantity;
    this.elements.modalProductName.textContent = product.name;
    this.elements.modalPrice.textContent = `₦${product.price.toLocaleString()}`;
    this.elements.modalDescription.textContent = product.description;
    this.elements.modalMainImage.src = product.imageUrl;
    this.elements.modalMainImage.alt = product.name;
    
    // Set thumbnails
    this.elements.thumbnailContainer.innerHTML = '';
    const thumbnail = document.createElement('img');
    thumbnail.src = product.imageUrl;
    thumbnail.alt = product.name;
    thumbnail.classList.add('thumbnail');
    thumbnail.addEventListener('click', () => {
      this.elements.modalMainImage.src = product.imageUrl;
    });
    this.elements.thumbnailContainer.appendChild(thumbnail);
    
    // Set size options
    this.elements.sizeOptions.innerHTML = '';
    product.size.forEach(size => {
      const sizeOption = document.createElement('div');
      sizeOption.textContent = size;
      sizeOption.classList.add('size-option');
      sizeOption.addEventListener('click', () => {
        document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
        sizeOption.classList.add('selected');
        this.state.selectedSize = size;
      });
      this.elements.sizeOptions.appendChild(sizeOption);
      
      // Select first size by default
      if (!this.state.selectedSize) {
        sizeOption.click();
      }
    });
    
    // Set color options
    this.elements.colorOptions.innerHTML = '';
    product.color.forEach(color => {
      const colorOption = document.createElement('div');
      colorOption.classList.add('color-option');
      colorOption.style.backgroundColor = this.getColorValue(color);
      colorOption.title = color;
      colorOption.addEventListener('click', () => {
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
        colorOption.classList.add('selected');
        this.state.selectedColor = color;
      });
      this.elements.colorOptions.appendChild(colorOption);
      
      // Select first color by default
      if (!this.state.selectedColor) {
        colorOption.click();
      }
    });
    
    // Show modal
    this.elements.productModal.classList.add('active');
    this.elements.modalOverlay.classList.add('active');
  }
  
  closeProductModal() {
    this.elements.productModal.classList.remove('active');
    this.elements.modalOverlay.classList.remove('active');
  }
  
  // Quantity Controls
  decreaseQuantity() {
    if (this.state.currentQuantity > 1) {
      this.state.currentQuantity--;
      this.elements.quantityDisplay.textContent = this.state.currentQuantity;
    }
  }
  
  increaseQuantity() {
    this.state.currentQuantity++;
    this.elements.quantityDisplay.textContent = this.state.currentQuantity;
  }
  
  // Checkout
  openCheckoutModal() {
    if (this.state.cart.length === 0) {
      this.showAlert('Your cart is empty!', 'error');
      return;
    }
    this.elements.checkoutModal.classList.add('active');
    this.elements.modalOverlay.classList.add('active');
    
    // Render checkout items
    const checkoutItems = document.getElementById('checkout-items');
    checkoutItems.innerHTML = this.state.cart.map(item => `
      <div class="checkout-item">
        <span>${item.name} (${item.selectedSize || 'One Size'}) × ${item.quantity}</span>
        <span>₦${(item.price * item.quantity).toLocaleString()}</span>
      </div>
    `).join('');
    
    document.getElementById('checkout-total').textContent = `₦${this.calculateTotal().toLocaleString()}`;
  }
  
  closeCheckoutModal() {
    this.elements.checkoutModal.classList.remove('active');
    this.elements.modalOverlay.classList.remove('active');
  }
  
  handleCheckoutSubmit(e) {
    e.preventDefault();
    
    // Validate custom selects
    let isValid = true;
    document.querySelectorAll('.custom-select').forEach(select => {
      const hiddenSelect = select.querySelector('.hidden-select');
      if (hiddenSelect.required && !hiddenSelect.value) {
        select.classList.add('invalid');
        isValid = false;
      }
    });
    
    if (!isValid) {
      this.showAlert('Please fill all required fields', 'error');
      return;
    }
    
    // Rest of your form submission logic
    const formData = new FormData(this.elements.checkoutForm);
    const orderData = {
      items: [...this.state.cart],
      customer: Object.fromEntries(formData),
      total: this.calculateTotal()
    };
    
    console.log('Order submitted:', orderData);
    this.state.cart = [];
    this.saveCart();
    this.closeCheckoutModal();
    this.showAlert('Order placed successfully!', 'success');
  }
  
  // Alerts
  showAlert(message, type = 'success', duration = 3000) {
    this.elements.alertMessage.textContent = message;
    this.elements.customAlert.className = `custom-alert show ${type}`;
    
    setTimeout(() => {
      this.hideAlert();
    }, duration);
  }
  
  hideAlert() {
    this.elements.customAlert.classList.remove('show');
  }
  
  // Helpers
  getColorValue(colorName) {
    const colorMap = {
      'White': '#ffffff',
      'Chambray Blue': '#5f8db3',
      'Red Plaid': '#cc0000',
      'Light Blue': '#add8e6',
      'Black': '#000000',
      'Charcoal': '#36454f',
      'Navy': '#000080',
      'Blue and White Stripes': '#1e90ff',
      'Camouflage Green': '#78866b',
      'Gray': '#808080',
      'Dark Blue': '#00008b',
      'Tropical': '#ff6347',
      'Olive Green': '#556b2f',
      'Light Gray': '#d3d3d3',
      'Bright Green': '#00ff00',
      'Denim Blue': '#1560bd',
      'Red and White': '#ff0000'
    };
    return colorMap[colorName] || '#cccccc';
  }
  
  // Event Listeners
  setupEventListeners() {
    // Product card clicks
    this.elements.shirtContainer.addEventListener('click', (e) => {
      const addToCartBtn = e.target.closest('.add-to-cart');
      if (addToCartBtn) {
        e.preventDefault();
        e.stopPropagation();
        const shirtId = parseInt(addToCartBtn.getAttribute('data-id'));
        const shirt = clothes.find(item => item.id === shirtId);
        if (shirt) {
          this.addToCart(shirt);
          this.showAlert(`${shirt.name} added to cart!`);
        }
      }
      
      const card = e.target.closest('.shirt-card');
      if (card && !e.target.classList.contains('add-to-cart')) {
        const shirtId = parseInt(card.getAttribute('data-id'));
        this.state.selectedProduct = clothes.find(item => item.id === shirtId);
        if (this.state.selectedProduct) {
          this.openProductModal(this.state.selectedProduct);
        }
      }
    });
    
    // Cart events
    this.elements.cartIcon.addEventListener('click', () => this.openCart());
    this.elements.closeCart.addEventListener('click', () => this.closeCart());
    this.elements.checkoutBtn.addEventListener('click', () => this.openCheckoutModal());
    
    // Modal events
    this.elements.closeModal.addEventListener('click', () => this.closeProductModal());
    this.elements.modalOverlay.addEventListener('click', () => {
      this.closeProductModal();
      this.closeCheckoutModal();
    });
    this.elements.quantityMinus.addEventListener('click', () => this.decreaseQuantity());
    this.elements.quantityPlus.addEventListener('click', () => this.increaseQuantity());
    this.elements.addToCartModal.addEventListener('click', () => this.handleAddToCartFromModal());
    
    // Search and filter
    this.elements.searchInput.addEventListener('input', () => this.handleSearch());
    this.elements.filterSelect.addEventListener('change', () => this.handleSearch());
    
    // Checkout
    this.elements.closeCheckout.addEventListener('click', () => this.closeCheckoutModal());
    this.elements.checkoutForm.addEventListener('submit', (e) => this.handleCheckoutSubmit(e));
    
    // Alert close
    this.elements.alertClose.addEventListener('click', () => this.hideAlert());
  }
  
  handleAddToCartFromModal() {
    if (!this.state.selectedProduct) return;
    
    if (!this.state.selectedSize) {
      this.showAlert('Please select a size', 'error');
      return;
    }
    
    if (!this.state.selectedColor) {
      this.showAlert('Please select a color', 'error');
      return;
    }
    
    const productToAdd = {
      ...this.state.selectedProduct,
      quantity: this.state.currentQuantity,
      selectedSize: this.state.selectedSize,
      selectedColor: this.state.selectedColor
    };
    
    this.addToCart(productToAdd);
    this.closeProductModal();
    this.showAlert(`${this.state.selectedProduct.name} (${this.state.selectedSize}, ${this.state.selectedColor}) added to cart!`);
  }
}

class CustomSelect {
  constructor(container) {
    this.container = container;
    this.select = container.querySelector('.hidden-select');
    this.selected = container.querySelector('.select-selected');
    this.items = container.querySelectorAll('.select-items div');
    this.arrow = container.querySelector('.select-selected i');
    this.isRequired = this.select.required;
    
    this.init();
    this.setupValidation();
  }
  
  init() {
    // Click handler for selected element
    this.selected.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });
    
    // Click handlers for options
    this.items.forEach(item => {
      item.addEventListener('click', () => {
        this.selectOption(item);
      });
    });
    
    // Close when clicking outside
    document.addEventListener('click', () => {
      this.close();
    });
  }
  
  toggle() {
    this.container.classList.toggle('active');
  }
  
  close() {
    this.container.classList.remove('active');
  }
  
  selectOption(item) {
    // Update visual selection
    this.items.forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');
    
    // Update displayed text
    this.selected.querySelector('span').textContent = item.textContent;
    
    // Update hidden select value
    const value = item.getAttribute('data-value');
    this.select.value = value;
    
    // Trigger change event
    this.select.dispatchEvent(new Event('change'));
    
    if (this.isRequired && value) {
      this.container.classList.remove('invalid');
    }
    
    // Close dropdown
    this.close();
  }
  
  setupValidation() {
    if (this.isRequired) {
      this.select.addEventListener('change', () => {
        if (this.select.value) {
          this.container.classList.remove('invalid');
        } else {
          this.container.classList.add('invalid');
        }
      });
    }
  }
}


// Initialize the application
new ECommerceApp();