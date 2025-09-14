// src/pages/BookDetail.tsx (Updated)
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Book } from '../types/Book';
import { fetchBookByIdentifier } from '../services/bookservice';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaArrowLeft, FaBook, FaUser, FaTag, FaBuilding, FaMoneyBill, FaPlus, FaCheck } from 'react-icons/fa';
import './BookDetail.css'

const BookDetail: React.FC = () => {
  const { bookIdentifier } = useParams<{ bookIdentifier: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { cartItems, addItemToCart, getCartItemCount } = useCart();
  const totalItemsInCart = getCartItemCount();

  useEffect(() => {
    const loadBook = async () => {
      if (!bookIdentifier) {
        setError('Book identifier is missing.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setBook(null);

      try {
        const bookData = await fetchBookByIdentifier(bookIdentifier);
        setBook(bookData);
      } catch (err) {
        console.error(`Error fetching book ${bookIdentifier}:`, err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred while fetching book details.');
        }
        setBook(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadBook();
  }, [bookIdentifier]);

  const currentBookIdentifier = book ? (book.id || book.isbn) : undefined;
  const itemInCart = cartItems.find(item =>
      (item.book.id || item.book.isbn) === currentBookIdentifier
  );
  const quantityInCart = itemInCart ? itemInCart.quantity : 0;

  const handleAddToCart = () => {
      if (book) {
          addItemToCart(book);
      }
  };

  const handleViewCart = () => {
      navigate('/cart');
  };

  if (isLoading) {
    return (
      <div className="book-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading book details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-detail-error">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="back-btn">
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-detail-not-found">
        <h3>Book Not Found</h3>
        <p>The book you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')} className="back-btn">
          <FaArrowLeft /> Browse Books
        </button>
      </div>
    );
  }

  const placeholderImage = "https://via.placeholder.com/250x350.png?text=No+Image+Available";
  const displayImageUrl = book.imageUrl || placeholderImage;

  return (
    <div className="book-detail-page">
      <div className="book-detail-container">
        <div className="book-detail-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            <FaArrowLeft /> Back to Collection
          </button>
          <h2>Book Details</h2>
        </div>

        <div className="book-detail-content">
          <div className="book-image-container">
            <img
              src={displayImageUrl}
              alt={`Cover of ${book.title || 'Untitled Book'}`}
              className="book-image"
              onError={(e) => (e.currentTarget.src = placeholderImage)}
            />
          </div>

          <div className="book-info-container">
            <h1 className="book-title">{book.title || 'Untitled Book'}</h1>
            <div className="book-author">
              <FaUser className="info-icon" />
              <span>by {book.author || 'Unknown Author'}</span>
            </div>

            <div className="book-metadata">
              {book.isbn && (
                <div className="metadata-item">
                  <FaTag className="info-icon" />
                  <span>ISBN: {book.isbn}</span>
                </div>
              )}
              {book.genre && (
                <div className="metadata-item">
                  <FaBook className="info-icon" />
                  <span>Genre: {book.genre}</span>
                </div>
              )}
              {book.publisher && (
                <div className="metadata-item">
                  <FaBuilding className="info-icon" />
                  <span>Publisher: {book.publisher}</span>
                </div>
              )}
            </div>

            <div className="book-price">
              <FaMoneyBill className="info-icon" />
              <span>
                {typeof book.price === 'number' && !isNaN(book.price)
                  ? `$${book.price.toFixed(2)}`
                  : 'Price N/A'}
              </span>
            </div>

            {book && typeof book.price === 'number' && !isNaN(book.price) && book.price > 0 && (
              <div className="book-actions">
                <button
                  onClick={handleAddToCart}
                  className={`add-to-cart-btn ${quantityInCart > 0 ? 'in-cart' : ''}`}
                >
                  {quantityInCart > 0 ? (
                    <>
                      <FaCheck /> Added to Cart
                    </>
                  ) : (
                    <>
                      <FaPlus /> Add to Cart
                    </>
                  )}
                </button>

                {quantityInCart > 0 && (
                  <div className="quantity-indicator">
                    {quantityInCart} in cart
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {book.description && (
          <div className="book-description">
            <h3>Description</h3>
            <p>{book.description}</p>
          </div>
        )}

        <div className="book-detail-footer">
          {totalItemsInCart > 0 && (
            <button
              onClick={handleViewCart}
              className="view-cart-btn"
            >
              <FaShoppingCart /> View Cart ({totalItemsInCart})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
