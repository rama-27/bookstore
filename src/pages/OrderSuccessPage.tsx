// File: src/pages/OrderSuccessPage.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaCheckCircle } from 'react-icons/fa';
import './OrderSuccessPage.css';

const OrderSuccessPage: React.FC = () => {
    const { clearCart } = useCart();

    // Clear the cart once the user lands on this page
    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
    <div className="order-success-page">
    <div className="success-card">
      <FaCheckCircle className="success-icon" />
      <h2>Payment Successful!</h2>
      <p>Thank you for your purchase. Your order #12148 has been placed.</p>
    <a href="">
      <Link to="/err"  className="continue-btn">
        Continue Shopping
      </Link>
      </a>
    </div>
  </div>
            );
};

export default OrderSuccessPage;
