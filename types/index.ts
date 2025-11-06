// Shared types for Yellow Books application

export interface Place {
  id: string;
  name: string;
  type: "restaurant" | "hotel" | "shop" | "clinic" | "service" | "other";
  description: string;
  address: string;
  phone: string;
  email?: string | null;
  website?: string | null;
  images: string[];
  rating?: number | null;
  reviewCount?: number | null;
  openingHours?: OpeningHours | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OpeningHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: Pagination;
}

// Form data types
export interface CreatePlaceInput {
  name: string;
  type: Place["type"];
  description: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  images?: string[];
  openingHours?: OpeningHours;
}

export type UpdatePlaceInput = Partial<CreatePlaceInput>;

// Search/filter types
export interface PlaceSearchParams {
  q?: string;
  type?: Place["type"] | "all";
  page?: number;
  limit?: number;
}
