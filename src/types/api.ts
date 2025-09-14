// src/types/api.ts

export interface SortInfo {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: SortInfo;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PaginatedResponse<T> {
  content: T[]; // Array of items, e.g., Book[]
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number; // Current page number (0-indexed from API)
  sort: SortInfo;
  numberOfElements: number; // Number of elements in the current page's content array
  first: boolean;
  empty: boolean;
}