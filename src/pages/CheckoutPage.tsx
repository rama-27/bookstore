// File: src/pages/CheckoutPage.tsx

import React, { useState, useEffect } from 'react';
// --- FIX: Separate the value and type imports ---
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
// --- END FIX ---
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { createPaymentIntent } from '../services/paymentService'; // Adjust path if needed
import CheckoutForm from '../components/CheckoutForm';
import { useNavigate } from 'react-router-dom';

// IMPORTANT: Replace with your Stripe public key. Use an environment variable for this.
const stripePromise = loadStripe('pk_test_51Rdo2iDlXZ7aEtXlO1ojWZl3z0nAXpmyu4yOjLjnCA8n7w9loMrfVRCkuYgyZ8tsJJJTknvG4YR4rhgvebdkKbqt002WryFTtP');

const CheckoutPage: React.FC = () => {
    const [clientSecret, setClientSecret] = useState("");
    const { cartItems, getCartTotal } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        if (cartItems.length === 0) {
            // If there are no items, redirect back to the cart which will show the empty message.
            navigate('/cart');
            return;
        }

        const itemsForPayload = cartItems.map(item => ({
            id: item.book.id || item.book.isbn || '',
            quantity: item.quantity
        }));

        // Call the backend to create the PaymentIntent
        createPaymentIntent(itemsForPayload)
            .then(data => {
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                } else {
                    console.error("Failed to get client secret:", data.error);
                    // Optionally, show an error message to the user
                }
            })
            .catch(error => {
                console.error("API call to create payment intent failed:", error);
                // Optionally, navigate to an error page or show a message
            });
    }, [cartItems, navigate]);

    const appearance: StripeElementsOptions['appearance'] = { theme: 'stripe' };
    const options: StripeElementsOptions = { clientSecret, appearance };
    const total = getCartTotal();

    return (
        <div style={{maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
            <h2>Checkout</h2>
            <div style={{border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9'}}>
                <h3>Order Summary</h3>
                <p>Total: <strong>${total.toFixed(2)}</strong></p>
            </div>

            {clientSecret ? (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            ) : (
                <p>Loading payment form...</p>
            )}
        </div>
    );
};

export default CheckoutPage;
