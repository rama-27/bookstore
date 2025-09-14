// src/types/Book.ts

// Assuming your existing Book type looks something like this:
export interface Book {
  id: string; // Or number, make sure this is unique
  isbn?: string; // ISBN can also be used as an identifier
  title: string;
  author: string;
  genre?: string;
  description?: string;
  imageUrl?: string;
  price?: number; // Price should be a number
  // Add any other relevant book properties
}

// New type for an item in the cart
export interface CartItem {
  book: Book;
  quantity: number;
}

// Also define the structure for the paginated response if not already done
export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number; // Current page number (0-indexed or 1-indexed depending on API)
    first: boolean;
    last: boolean;
    // Add other pagination metadata if needed
}
