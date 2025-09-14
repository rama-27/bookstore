// File: services/paymentService.ts (or add to bookservice.ts)
const API_BASE_URL = 'https://bookstoreapi.ramarajumantena.live'; // Make sure this is correct

interface CartItemPayload {
    id: string;
    quantity: number;
}

export const createPaymentIntent = async (items: CartItemPayload[]): Promise<{ clientSecret: string; error?: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || 'Failed to create payment intent');
    }

    return response.json();
};
