// src/services/bookservice.ts
import type { Book } from '../types/Book';
import type { PaginatedResponse } from '../types/api';

// --- FIX: Use the correct protocol ---
const API_PREFIX = 'https://bookstoreapi.ramarajumantena.live';
//const API_PREFIX = 'http://localhost:8080';
// Or if using Vite proxy: const API_PREFIX = '/api';
// --- End FIX ---

/**
 * Fetches a paginated list of books from the backend, optionally filtered by genre and search term.
 * ... (previous function remains) ...
 */
export const fetchPaginatedBooks = async (
  page: number = 1,
  size: number = 10,
  genre?: string,
  searchTerm?: string
): Promise<PaginatedResponse<Book>> => {
   // ... (previous implementation remains) ...
    try {
        let url = `${API_PREFIX}/books?page=${page}&size=${size}`;
        if (genre && genre !== 'All') {
          url += `&genre=${encodeURIComponent(genre)}`;
        }
        if (searchTerm && searchTerm.trim() !== '') {
            url += `&searchTerm=${encodeURIComponent(searchTerm.trim())}`;
        }
        //console.log("Fetching URL:", url);

        const response = await fetch(url);
        const responseBodyText = await response.text();
        //console.log("Received Response Status:", response.status, response.statusText);

        if (!response.ok) {
            console.error("HTTP Error details:", responseBodyText); // Log full body on error
            throw new Error(
              `HTTP Error ${response.status}: ${response.statusText}. URL: ${url}. Server Response: ${responseBodyText.substring(0, 200)}...`
            );
        }

        try {
            const data: PaginatedResponse<Book> = JSON.parse(responseBodyText);
             //console.log("Fetch Paginated Books Success:", data); // Log success
            return data;
        } catch (jsonError) {
             console.error("JSON parsing failed:", jsonError, "Response Body:", responseBodyText);
             throw new Error(`Failed to parse JSON response from ${url}. Error: ${jsonError}. Response body starts with: ${responseBodyText.substring(0, 200)}...`);
        }

      } catch (error) {
        console.error("Error in fetchPaginatedBooks caught:", error);
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('An unknown error occurred while fetching books.');
      }
};


// --- Add the function to fetch a single book by its identifier ---
/**
 * Fetches a single book by its unique identifier (ID or ISBN).
 * @param identifier - The unique ID or ISBN of the book.
 * @returns A Promise that resolves to the Book object.
 */
export const fetchBookByIdentifier = async (
  identifier: string | number
): Promise<Book> => {
  try {
    // Assuming your backend has an endpoint like GET /api/books/{identifier}
    // You might need to adjust the path based on your actual backend routes.
    const url = `${API_PREFIX}/books/${encodeURIComponent(identifier)}`;

   // console.log(`Fetching book details URL: ${url}`); // Log the details URL

    const response = await fetch(url);

     // --- Add more detailed error handling ---
    const responseBodyText = await response.text();
    //console.log(`Received Book Detail Response Status for ${identifier}:`, response.status, response.statusText);

    if (!response.ok) {
         console.error(`HTTP Error fetching book ${identifier} details:`, responseBodyText); // Log full body on error
         if (response.status === 404) {
              throw new Error(`Book not found with identifier: ${identifier}`);
         }
        throw new Error(
          `HTTP Error ${response.status}: ${response.statusText}. URL: ${url}. Server Response: ${responseBodyText.substring(0, 200)}...`
        );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
       console.error(`Expected JSON for book ${identifier} details, but received Content-Type: ${contentType || 'none'}`, responseBodyText);
       throw new Error(
           `Expected JSON response for book ${identifier} details, but received Content-Type: ${contentType || 'none'}. Response body starts with: ${responseBodyText.substring(0, 200)}...`
       );
    }

    try {
        const bookData: Book = JSON.parse(responseBodyText);
       // console.log("Fetch Book Detail Success:", bookData); // Log success
        return bookData;
    } catch (jsonError) {
         console.error("JSON parsing failed for book detail:", jsonError, "Response Body:", responseBodyText);
         throw new Error(`Failed to parse JSON response for book ${identifier} details from ${url}. Error: ${jsonError}. Response body starts with: ${responseBodyText.substring(0, 200)}...`);
    }
    // --- End added error handling ---


  } catch (error) {
    console.error(`Error in fetchBookByIdentifier (${identifier}) caught:`, error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`An unknown error occurred while fetching book ${identifier} details.`);
  }
};
// --- End fetchBookByIdentifier function ---
