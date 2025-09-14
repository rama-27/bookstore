// src/pages/CartPage.tsx (Updated)
import React from 'react';
import { useCart } from '../context/CartContext';
import type { CartItem } from '../types/Book';
import { FaPlus, FaMinus, FaTrash, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartItemDisplay: React.FC<{ item: CartItem }> = ({ item }) => {
    const { adjustItemQuantity, removeItemFromCart } = useCart();
    const placeholderImage = "https://via.placeholder.com/100x150.png?text=No+Image";
    const displayImageUrl = item.book.imageUrl || placeholderImage;
    const itemIdentifier = item.book.id || item.book.isbn || '';

    if (!itemIdentifier) return null;

    const price = item.book.price ?? 0;

    return (
        <div className="cart-item-card">
            <div className="cart-item-image-container">
                <img
                    src={displayImageUrl}
                    alt={`Cover of ${item.book.title || 'Untitled'}`}
                    className="cart-item-image"
                    onError={(e) => (e.currentTarget.src = placeholderImage)}
                />
            </div>
            <div className="cart-item-details">
                <h3 className="cart-item-title">{item.book.title || 'Untitled Book'}</h3>
                <p className="cart-item-author">by {item.book.author || 'Unknown Author'}</p>
                <p className="cart-item-price">${price.toFixed(2)}</p>
            </div>
            <div className="cart-item-controls">
                <div className="cart-item-quantity">
                    <button
                        className="quantity-btn"
                        onClick={() => adjustItemQuantity(itemIdentifier, -1)}
                        aria-label="Decrease quantity"
                    >
                        <FaMinus />
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                        className="quantity-btn"
                        onClick={() => adjustItemQuantity(itemIdentifier, 1)}
                        aria-label="Increase quantity"
                    >
                        <FaPlus />
                    </button>
                </div>
                <button
                    className="remove-btn"
                    onClick={() => removeItemFromCart(itemIdentifier)}
                    aria-label="Remove item"
                >
                    <FaTrash />
                </button>
            </div>
            <div className="cart-item-subtotal">
                <span>Subtotal:</span>
                <span>${(price * item.quantity).toFixed(2)}</span>
            </div>
        </div>
    );
};

const CartPage: React.FC = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const total = getCartTotal();

  const handleCheckout = () => {
      navigate('/checkout');
  };

  return (
    <div className="cart-page-container">
      <div className="cart-page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <h2 className="cart-page-title">
          <FaShoppingCart /> Your Shopping Cart
        </h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <FaShoppingCart />
          </div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added any books to your cart yet.</p>
          <button className="continue-shopping-btn" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-container">
            {cartItems.map(item => (
                (item.book.id || item.book.isbn) ?
                <CartItemDisplay key={item.book.id || item.book.isbn} item={item} />
                : null
            ))}
          </div>

          <div className="cart-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Total Items:</span>
              <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="cart-actions">
              <button onClick={handleCheckout} className="checkout-btn">
                Proceed to Checkout
              </button>
              <button onClick={() => navigate('/')} className="continue-shopping-btn">
                Continue Shopping
              </button>
              <button onClick={clearCart} className="clear-cart-btn">
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
