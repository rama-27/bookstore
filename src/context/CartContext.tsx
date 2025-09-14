// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Book, CartItem } from '../types/Book'; // Import Book and CartItem types

// Define the shape of the context state and actions
interface CartContextType {
  cartItems: CartItem[];
  addItemToCart: (book: Book) => void;
  adjustItemQuantity: (bookId: string, delta: number) => void; // positive delta to increase, negative to decrease
  removeItemFromCart: (bookId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number; // Total quantity of items
}

// Create the Context with a default undefined value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart Provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State to hold cart items, initialized from localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const localData = localStorage.getItem('bookverse_cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      return [];
    }
  });

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('bookverse_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cartItems]);

  // Function to add a book to the cart or increase quantity
  const addItemToCart = (book: Book) => {
    // Use a stable identifier like 'id' or 'isbn'
    const identifier = book.id || book.isbn;
    if (!identifier) {
        console.error("Cannot add book to cart: No valid identifier (id or isbn) found.", book);
        return;
    }

    setCartItems(currentItems => {
      const isExist = currentItems.find(item => (item.book.id || item.book.isbn) === identifier);

      if (isExist) {
        // If item exists, increase quantity
        return currentItems.map(item =>
          (item.book.id || item.book.isbn) === identifier
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If item doesn't exist, add it with quantity 1
        return [...currentItems, { book, quantity: 1 }];
      }
    });
  };

  // Function to adjust quantity of an item by delta
  const adjustItemQuantity = (bookId: string, delta: number) => {
      setCartItems(currentItems => {
          const itemIndex = currentItems.findIndex(item => (item.book.id || item.book.isbn) === bookId);

          if (itemIndex === -1) {
              // Item not found, do nothing or log error
              console.warn(`Attempted to adjust quantity for unknown book ID: ${bookId}`);
              return currentItems;
          }

          const item = currentItems[itemIndex];
          const newQuantity = item.quantity + delta;

          if (newQuantity <= 0) {
              // Remove item if quantity is 0 or less
              return currentItems.filter(item => (item.book.id || item.book.isbn) !== bookId);
          } else {
              // Update quantity
              const newItems = [...currentItems];
              newItems[itemIndex] = { ...item, quantity: newQuantity };
              return newItems;
          }
      });
  };

  // Function to remove an item completely from the cart
  const removeItemFromCart = (bookId: string) => {
    setCartItems(currentItems =>
      currentItems.filter(item => (item.book.id || item.book.isbn) !== bookId)
    );
  };

  // Function to clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Function to calculate total price
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.book.price ?? 0; // Use 0 if price is undefined/null
      return total + price * item.quantity;
    }, 0);
  };

  // Function to get total number of items (sum of quantities)
  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Context value provided to consumers
  const contextValue: CartContextType = {
    cartItems,
    addItemToCart,
    adjustItemQuantity,
    removeItemFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
