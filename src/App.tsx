// File: src/App.tsx
import { Routes, Route } from 'react-router-dom';
import BookVerse from './components/BookVerse';
import BookDetail from './pages/BookDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage'; // Import CheckoutPage
import OrderSuccessPage from './pages/OrderSuccessPage'; // Import OrderSuccessPage

function App() {
  return (
    <Routes>
      <Route path="/" element={<BookVerse />} />
      <Route path="/books/:bookIdentifier" element={<BookDetail />} />
      <Route path="/cart" element={<CartPage />} />
      {/* --- Add Routes for Checkout and Success --- */}
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      {/* --- End Routes --- */}
    </Routes>
  );
}

export default App;
