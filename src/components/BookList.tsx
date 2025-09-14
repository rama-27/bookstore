// src/components/BookList.tsx
import React, { useState, useEffect } from 'react';
import BookItem from './BookItem';
import { fetchPaginatedBooks } from '../services/bookservice';
import type { Book } from '../types/Book';
import type { PaginatedResponse } from '../types/api';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
// --- Add onBookClick to BookListProps interface ---
interface BookListProps {
  selectedGenre: string;
  searchTerm: string;
  onBookClick?: (book: Book) => void; // Add the click handler prop
}
// --- End BookListProps interface ---


// --- Receive onBookClick in the function signature ---
const BookList: React.FC<BookListProps> = ({ selectedGenre, searchTerm, onBookClick }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPageUi, setCurrentPageUi] = useState<number>(1);
  const itemsPerPage = 10;

  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [isFirstPage, setIsFirstPage] = useState<boolean>(true);


  useEffect(() => {
    if (currentPageUi !== 1) {
      setCurrentPageUi(1);
    }
  }, [selectedGenre, searchTerm]);


  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiPageToFetch = currentPageUi; // Assuming API is 1-indexed

        const responseData: PaginatedResponse<Book> = await fetchPaginatedBooks(
          apiPageToFetch,
          itemsPerPage,
          selectedGenre,
          searchTerm
        );

        setBooks(responseData.content);
        setTotalPages(responseData.totalPages);
        setTotalElements(responseData.totalElements);
        setIsLastPage(responseData.last);
        setIsFirstPage(responseData.first);

      } catch (err) {
        console.error("Error fetching books:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred while fetching books.');
        }
        setBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();

  }, [currentPageUi, itemsPerPage, selectedGenre, searchTerm]);


  const handlePreviousPage = () => {
    if (!isFirstPage && !isLoading) {
      setCurrentPageUi((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (!isLastPage && !isLoading) {
      setCurrentPageUi((prevPage) => prevPage + 1);
    }
  };

  const noBooksMessage = !isLoading && books.length === 0
    ? `No books found ${selectedGenre !== 'All' ? ` in ${selectedGenre} genre` : ''}${searchTerm.trim() !== '' ? ` for "${searchTerm.trim()}"` : ''}.`
    : null;


  return (
    <div className="BookList-container">
      <h2 style={{ textAlign: 'center' }}>
        Book Collection {isLoading ? <span style={{ fontSize: '0.8em', color: '#555' }}>(Updating...)</span> : ''}
      </h2>

      {/* Pagination Controls */}
      {(totalPages > 0 || isLoading) && (
        <div className="pagination-controls">
          <button onClick={handlePreviousPage} disabled={isFirstPage || isLoading} aria-label="Previous Page">
            <FaArrowLeft />
          </button>
          <span className="pagination-status">
            Page {totalPages > 0 ? currentPageUi : '?'} of {totalPages > 0 ? totalPages : '?'} (Total Books: {totalElements})
          </span>
          <button onClick={handleNextPage} disabled={isLastPage || isLoading} aria-label="Next Page">
            <FaArrowRight />
          </button>
        </div>
      )}

      {/* Book List Display */}
      {noBooksMessage && (
        <p style={{ textAlign: 'center' }}>{noBooksMessage}</p>
      )}
      <div className="BookList-grid">
        {books.map((book) => (
          <BookItem
            key={book.id} // Use book.id as the key
            book={book}
            onBookClick={onBookClick} // --- Pass the onBookClick prop down ---
          />
        ))}
      </div>

      {/* Optional: Pagination Controls at the bottom as well */}
      {(totalPages > 1 || isLoading) && (
         <div className="pagination-controls">
            <button onClick={handlePreviousPage} disabled={isFirstPage || isLoading} aria-label="Previous Page">
              <FaArrowLeft />
            </button>
            <span className="pagination-status">
              Page {totalPages > 0 ? currentPageUi : '?'} of {totalPages > 0 ? totalPages : '?'}
            </span>
            <button onClick={handleNextPage} disabled={isLastPage || isLoading} aria-label="Next Page">
              <FaArrowRight />
            </button>
        </div>
      )}
    </div>
  );
};

export default BookList;
