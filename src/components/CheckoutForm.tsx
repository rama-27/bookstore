// File: src/components/CheckoutForm.tsx
import React, { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // ... Logic to handle post-payment redirection status ...
    }, [stripe]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/order-success`, // A new page for success message
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || 'An unexpected error occurred.');
        } else {
            setMessage("An unexpected error occurred.");
        }
        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <button disabled={isLoading || !stripe || !elements} id="submit" style={{marginTop: '20px', width: '100%', padding: '12px', background: '#5469d4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                <span id="button-text">
                    {isLoading ? "Processing..." : "Pay now"}
                </span>
            </button>
            {message && <div id="payment-message" style={{color: 'red', marginTop: '10px'}}>{message}</div>}
        </form>
    );
};

export default CheckoutForm;
