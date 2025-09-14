// src/components/BookItem.tsx
import React, { useState } from 'react';
import type { Book } from '../types/Book';

interface BookItemProps {
  book: Book;
  // Add a prop for the click handler
  onBookClick?: (book: Book) => void; // Function that takes the clicked book object
}

const BookItem: React.FC<BookItemProps> = ({ book, onBookClick }) => { // Receive onBookClick prop
  const [isSkipped, setIsSkipped] = useState(false);

  if (!book || !book.imageUrl || isSkipped) {
    return null;
  }

  const cardStyle: React.CSSProperties = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    width: '220px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    flexShrink: 0,
    minWidth: 0,
    cursor: onBookClick ? 'pointer' : 'default', // Show pointer cursor if clickable
    transition: 'transform 0.2s ease, box-shadow 0.2s ease', // Add hover effect transitions
  };

   // Optional Hover Effect
   const cardHoverStyle: React.CSSProperties = onBookClick ? {
       transform: 'translateY(-5px)',
       boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
   } : {};


  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '200px',
    objectFit: 'contain',
    marginBottom: '12px',
    backgroundColor: '#f0f0f0',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.1em',
    fontWeight: 'bold',
    marginBottom: '4px',
    minHeight: '2.4em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  };

  const authorStyle: React.CSSProperties = {
    fontSize: '0.9em',
    color: '#555',
    marginBottom: '8px',
  };

  const priceStyle: React.CSSProperties = {
    fontSize: '1em',
    fontWeight: 'bold',
    color: '#27ae60',
    marginTop: 'auto',
  };

  // Handle click: Call the onBookClick prop if it exists
  const handleClick = () => {
    if (onBookClick) {
      onBookClick(book);
    }
  };

  return (
    // Add onClick handler to the main div
    <div
      style={cardStyle}
      onClick={handleClick} // Call the handler when the div is clicked
      // Optional: Add hover effect using a pseudo-selector or CSS class
      // For inline styles, you might need to use a state variable for hover or rely on CSS class
      // For simplicity, adding a basic CSS hover style is often better
      // Add a class name to the div for external CSS styling
      className="book-item-card" // Add a class name
    >
      <img
        src={book.imageUrl}
        alt={`Cover of ${book.title || 'Untitled'}`}
        style={imageStyle}
        onError={(e) => {
           console.warn(`Image failed to load for book "${book.title || 'Unknown Title'}": ${book.imageUrl}`, e);
           setIsSkipped(true);
        }}
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth === 1 && img.naturalHeight === 1) {
             console.warn(`Skipping book "${book.title || 'Unknown Title'}" due to 1x1 pixel image: ${book.imageUrl}`);
             setIsSkipped(true);
          }
        }}
      />

      <h3 style={titleStyle} title={book.title || 'Untitled Book'}>{book.title || 'Untitled Book'}</h3>
      <p style={authorStyle}>by {book.author || 'Unknown Author'}</p>

      {book.isbn && <p style={{ fontSize: '0.8em', color: '#777', marginBottom: '4px' }}>ISBN: {book.isbn}</p>}

      <p style={priceStyle}>
         {typeof book.price === 'number' && !isNaN(book.price) ? `$${book.price.toFixed(2)}` : 'Price N/A'}
      </p>
    </div>
  );
};

export default BookItem;
