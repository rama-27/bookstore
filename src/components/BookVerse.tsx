// src/components/BookVerse.tsx
import React, { useRef } from 'react'; // Import useRef
import './BookVerse.css';
import { FaSearch, FaBookOpen, FaShoppingCart } from 'react-icons/fa';
import BookList from './BookList';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../types/Book';
import { useCart } from '../context/CartContext';

const BookVerse = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedGenre, setSelectedGenre] = React.useState('All');
  const genres = [
    "All", "Fiction", "Science Fiction", "Fantasy", "Mystery", "Thriller",
    "Romance", "Historical Fiction", "Contemporary", "Young Adult", "Children's",
    "Non-Fiction", "Biography", "History", "Science", "Self-Help", "Poetry"
  ];

  const navigate = useNavigate();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  // --- Create a ref for the main content area ---
  const mainRef = useRef<HTMLElement>(null);
  // --- End useRef ---


  const handleGenreClick = (genre: string) => {
    //console.log("Genre button clicked:", genre);
    setSelectedGenre(genre);
    // Optional: Scroll to main when filter changes
    if (mainRef.current) {
        mainRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookClick = (book: Book) => {
    //console.log("Book clicked:", book.title);
    const identifier = book.id || book.isbn;
    if (identifier) {
      navigate(`/books/${identifier}`);
    } else {
      console.warn("Could not navigate to book detail: No ID or ISBN found for the book.", book);
    }
  };

  const handleCartClick = () => {
      navigate('/cart');
  };

  // --- Function to handle the "Browse Collection" button click ---
  const handleBrowseCollection = () => {
      //console.log("Browse Collection button clicked");
      // 1. Reset search term and genre filter
      setSearchTerm('');
      setSelectedGenre('All');

      // 2. Scroll to the main content section
      if (mainRef.current) {
          mainRef.current.scrollIntoView({ behavior: 'smooth' }); // Smooth scrolling
      }
  };
  // --- End handleBrowseCollection ---


  return (
    <div className="BookVerse">
      <header className="BookVerse-header">
        <div className="header-content">
          <div className="logo-container">
            <FaBookOpen className="logo-icon" />
            <h1>BookVerse</h1>
          </div>
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="cart-icon-container" onClick={handleCartClick}>
              <FaShoppingCart className="cart-icon" />
              {cartItemCount > 0 && (
                  <span className="cart-counter">{cartItemCount}</span>
              )}
          </div>
        </div>
      </header>

      <div className="hero-section">
        <div className="hero-content">
          <h2 className="animated-text">Discover Your Next Adventure</h2>
          <p>Explore thousands of books across every genre imaginable</p>
          {/* --- Add onClick handler to the CTA button --- */}
          <button className="cta-button" onClick={handleBrowseCollection}>
            Browse Collection
          </button>
          {/* --- End onClick --- */}
        </div>
      </div>

      {/* --- Attach the ref to the main element --- */}
      <main ref={mainRef}>
      {/* --- End ref --- */}
        <div className="filters-container">
          {genres.map(genre => (
            <button
              key={genre}
              className={`filter-button ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => handleGenreClick(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        <BookList
          selectedGenre={selectedGenre}
          searchTerm={searchTerm}
          onBookClick={handleBookClick}
        />

      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h3>BookVerse</h3>
            <p>Your Digital Book Haven </p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
            <a href="#">FAQ</a>
          </div>
          <div className="footer-section">
            <h3>Connect</h3>
            <div className="social-icons">
              <a href="#" aria-label="Twitter">Twitter</a>
              <a href="#" aria-label="Instagram">Instagram</a>
              <a href="#" aria-label="Facebook">Facebook</a>
            </div>
          </div>
        </div>
        <p className="copyright">© {new Date().getFullYear()} BookVerse - All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default BookVerse;
