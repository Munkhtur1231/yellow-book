# Yellow Books Backend - Quick Start

## What's Been Created

### 📁 Database Models (`/models`)

- **Place.ts** - Business/place listings (restaurants, hotels, shops, etc.)
- **Company.ts** - Companies that own/operate places

### 🛣️ API Routes (`/app/api`)

```
GET    /api/places          - Search & list places
POST   /api/places          - Create new place
GET    /api/places/[id]     - Get place by ID
PUT    /api/places/[id]     - Update place
DELETE /api/places/[id]     - Delete place

GET    /api/companies       - List companies
POST   /api/companies       - Create company

POST   /api/seed            - Seed sample data (dev only)
```

### 🔧 Utilities

- **lib/api.ts** - Frontend API helper functions
- **types/index.ts** - TypeScript type definitions
- **lib/mongodb.ts** - Database connection (already existed)

### 📚 Documentation

- **API_DOCUMENTATION.md** - Complete API reference
- **.env.local.example** - Environment variable template

## Setup Instructions

### 1. Configure MongoDB

Create `.env.local` in the project root:

```bash
MONGO_URI=mongodb://localhost:27017/yellow-books
```

Or use MongoDB Atlas:

```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/yellow-books
```

### 2. Install Dependencies (if needed)

```bash
npm install mongoose
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Seed Sample Data

```bash
curl -X POST http://localhost:3000/api/seed
```

Or use the browser: navigate to your app and run in console:

```javascript
fetch("/api/seed", { method: "POST" })
  .then((r) => r.json())
  .then(console.log);
```

## Test the API

### Search places:

```bash
curl "http://localhost:3000/api/places?q=restaurant"
```

### Get specific place:

```bash
curl "http://localhost:3000/api/places/[place-id]"
```

### Create new place:

```bash
curl -X POST http://localhost:3000/api/places \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Restaurant",
    "type": "restaurant",
    "description": "Great food",
    "address": "123 Main St",
    "phone": "+976-1234-5678"
  }'
```

## Frontend Integration Example

```typescript
import { placesApi } from "@/lib/api";

// In your component
const searchPlaces = async () => {
  try {
    const result = await placesApi.search({
      q: "restaurant",
      type: "restaurant",
    });

    if (result.success) {
      console.log(result.data); // Array of places
      console.log(result.pagination); // Pagination info
    }
  } catch (error) {
    console.error("Search failed:", error);
  }
};

// Get single place
const getPlace = async (id: string) => {
  const result = await placesApi.getById(id);
  if (result.success) {
    console.log(result.data); // Place with populated companies
  }
};

// Create place
const createPlace = async () => {
  const result = await placesApi.create({
    name: "New Place",
    type: "restaurant",
    description: "Amazing food",
    address: "Улаанбаатар",
    phone: "+976-1234-5678",
  });
};
```

## Sample Data Included

After seeding, you'll have:

- **6 Places**: Restaurants, hotels, clinics, shops
- **3 Companies**: Business entities
- All with Mongolian names and addresses

## Database Schema

### Place

- name, type, description, address, phone (required)
- email, website, images, rating, reviewCount (optional)
- companies (references to Company)
- openingHours, coordinates (optional)

### Company

- name (required)
- description, website, email, phone (optional)

## Next Steps

1. ✅ Backend is ready
2. Update frontend pages to fetch real data
3. Create add/edit forms for places
4. Add image upload functionality
5. Add user authentication (if needed)

See **API_DOCUMENTATION.md** for complete API reference!
