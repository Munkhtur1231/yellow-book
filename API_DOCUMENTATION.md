# Yellow Books API Documentation

## Overview

Backend API for the Yellow Books application - a directory service for searching businesses and places.

## Environment Setup

1. Copy `.env.local.example` to `.env.local`
2. Add your MongoDB connection string:

```bash
MONGO_URI=mongodb://localhost:27017/yellow-books
```

## Database Models

### Place Model

```typescript
{
  name: string;           // Required
  type: string;           // Required: restaurant, hotel, shop, clinic, service, other
  description: string;    // Required
  address: string;        // Required
  phone: string;          // Required
  email?: string;
  website?: string;
  images: string[];       // Array of image URLs
  companies: ObjectId[];  // References to Company model
  rating?: number;        // 0-5
  reviewCount?: number;
  openingHours?: {
    monday?: string;
    tuesday?: string;
    // ... other days
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
}
```

### Company Model

```typescript
{
  name: string;          // Required
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
}
```

## API Endpoints

### Places

#### GET /api/places

Search and list places with pagination

**Query Parameters:**

- `q` (optional) - Search query for name/description
- `type` (optional) - Filter by type (restaurant, hotel, shop, clinic, service, other)
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page

**Response:**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

**Example:**

```bash
GET /api/places?q=restaurant&type=restaurant&page=1&limit=10
```

#### POST /api/places

Create a new place

**Request Body:**

```json
{
  "name": "Хаан Ресторан",
  "type": "restaurant",
  "description": "Монгол хоол, орчин үеийн орчин",
  "address": "Сүхбаатар дүүрэг, 1-р хороо",
  "phone": "+7711-1234",
  "email": "khan@restaurant.mn",
  "images": ["/restaurant1.jpg"],
  "companies": ["company_id_here"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {...},
  "message": "Place created successfully"
}
```

#### GET /api/places/[id]

Get a single place by ID

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Хаан Ресторан",
    "type": "restaurant",
    "description": "...",
    "companies": [
      {
        "_id": "...",
        "name": "Монгол Хоол ХХК",
        "description": "..."
      }
    ],
    ...
  }
}
```

#### PUT /api/places/[id]

Update a place

**Request Body:** (partial update supported)

```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

#### DELETE /api/places/[id]

Delete a place

**Response:**

```json
{
  "success": true,
  "message": "Place deleted successfully"
}
```

### Companies

#### GET /api/companies

List all companies with pagination

**Query Parameters:**

- `q` (optional) - Search query
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

#### POST /api/companies

Create a new company

**Request Body:**

```json
{
  "name": "Монгол Хоол ХХК",
  "description": "Үндэсний хоолны сүлжээ",
  "phone": "+976-1234-5678",
  "email": "info@mongolhool.mn",
  "website": "https://mongolhool.mn"
}
```

### Seed Data

#### POST /api/seed

Seed the database with sample data (for development/testing)

**Response:**

```json
{
  "success": true,
  "message": "Database seeded successfully",
  "data": {
    "companies": 3,
    "places": 6
  }
}
```

## Testing the API

### 1. Seed the database

```bash
curl -X POST http://localhost:3000/api/seed
```

### 2. Search places

```bash
curl "http://localhost:3000/api/places?q=restaurant"
```

### 3. Get place by ID

```bash
curl http://localhost:3000/api/places/[id]
```

### 4. Create a new place

```bash
curl -X POST http://localhost:3000/api/places \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Restaurant",
    "type": "restaurant",
    "description": "Great food",
    "address": "123 Street",
    "phone": "+7711-1234"
  }'
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Next Steps

1. Set up MongoDB (local or Atlas)
2. Configure `.env.local`
3. Run `npm run dev`
4. Test by seeding data: `POST /api/seed`
5. Test search: `GET /api/places?q=test`
6. Integrate with frontend pages

## Frontend Integration Example

```typescript
// Fetch places
const response = await fetch("/api/places?q=restaurant&type=restaurant");
const { data, pagination } = await response.json();

// Get single place
const response = await fetch(`/api/places/${id}`);
const { data } = await response.json();

// Create place
const response = await fetch("/api/places", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(placeData),
});
```
