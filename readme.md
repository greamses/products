# Menyz - Modern E-Commerce App

## Overview
Menyz is a responsive e-commerce web application built with vanilla JavaScript that provides a seamless shopping experience for fashion apparel. The app features product browsing, cart management, and checkout functionality with a clean, intuitive interface.

## Key Features

### Core Shopping Experience
- **Product Catalog**:
  - Grid display of fashion items with images, names, and prices
  - Quick "Add to Cart" functionality
  - Detailed product modal with additional information

- **Product Details**:
  - High-resolution image gallery with thumbnail navigation
  - Size and color selection options
  - Quantity controls
  - Detailed product descriptions

### Shopping Cart
- **Cart Management**:
  - Persistent cart using localStorage
  - Quantity adjustment (increase/decrease)
  - Item removal
  - Real-time total calculation
  - Empty cart state handling

- **Checkout Process**:
  - Order summary display
  - Form validation
  - Payment method selection
  - Order confirmation

### User Experience
- **Search & Filter**:
  - Instant search by product name/description
  - Category filtering
  - Custom dropdown select components

- **UI Feedback**:
  - Custom alert system
  - Visual feedback for selections
  - Responsive design for all device sizes

## Technical Implementation

### Architecture
- **Vanilla JavaScript** implementation (no frameworks)
- **Modular Class Structure**:
  - `ECommerceApp` - Main application logic
  - `CustomSelect` - Reusable dropdown component

- **State Management**:
  - Single source of truth for application state
  - LocalStorage persistence for cart data

### Key Components
- **Product Display**:
  - Dynamic rendering from product data
  - Responsive grid layout
  - Interactive product cards

- **Product Modal**:
  - Detailed product view
  - Interactive image gallery
  - Size/color selection
  - Quantity controls

- **Shopping Cart Sidebar**:
  - Slide-out panel design
  - Real-time updates
  - Interactive item management

### Performance Optimizations
- **Efficient DOM Updates**:
  - Selective re-rendering
  - Event delegation for dynamic elements

- **Responsive Design**:
  - Mobile-first approach
  - Adaptive layouts
  - Touch-friendly interactions

## How to Use

1. **Browse Products**:
   - View products in the main grid
   - Click on any product for more details
   - Use search and filters to find specific items

2. **Add to Cart**:
   - Select size and color (if available)
   - Adjust quantity
   - Click "Add to Cart"

3. **Manage Cart**:
   - Click cart icon to view items
   - Adjust quantities or remove items
   - Proceed to checkout when ready

4. **Checkout**:
   - Review order summary
   - Fill in shipping/payment details
   - Submit order

## Installation
No installation required - runs directly in modern browsers:
1. Clone repository
2. Open `index.html` in any browser

```bash
git clone https://github.com/greamses/products.git
```

## Development Highlights
- Implemented complete e-commerce functionality without frameworks
- Created reusable custom UI components
- Developed responsive design for all screen sizes
- Added comprehensive cart management
- Implemented form validation and user feedback

## Future Enhancements
- User accounts and order history
- Product reviews and ratings
- Wishlist functionality
- Payment gateway integration
- Advanced filtering options

## License
MIT License - Free for educational and personal use