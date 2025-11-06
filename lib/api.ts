// API utility functions for frontend

import type {
  Place,
  ApiResponse,
  PlaceSearchParams,
  CreatePlaceInput,
  UpdatePlaceInput,
} from "@/types";

const API_BASE = "/api";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "An error occurred");
  }

  return data;
}

// Places API
export const placesApi = {
  // Search/list places
  search: async (params?: PlaceSearchParams): Promise<ApiResponse<Place[]>> => {
    const searchParams = new URLSearchParams();

    if (params?.q) searchParams.append("q", params.q);
    if (params?.type && params.type !== "all")
      searchParams.append("type", params.type);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const url = `${API_BASE}/places${
      searchParams.toString() ? `?${searchParams}` : ""
    }`;
    const response = await fetch(url);

    return handleResponse<Place[]>(response);
  },

  // Get single place by ID
  getById: async (id: string): Promise<ApiResponse<Place>> => {
    const response = await fetch(`${API_BASE}/places/${id}`);
    return handleResponse<Place>(response);
  },

  // Create new place
  create: async (data: CreatePlaceInput): Promise<ApiResponse<Place>> => {
    const response = await fetch(`${API_BASE}/places`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Place>(response);
  },

  // Update place
  update: async (
    id: string,
    data: UpdatePlaceInput
  ): Promise<ApiResponse<Place>> => {
    const response = await fetch(`${API_BASE}/places/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Place>(response);
  },

  // Delete place
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE}/places/${id}`, {
      method: "DELETE",
    });
    return handleResponse<null>(response);
  },
};
