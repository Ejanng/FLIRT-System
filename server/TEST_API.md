# FLIRT API Testing Guide

## Testing `/api/items` Endpoints

### 1. GET All Items (Public)

**Request:**
```bash
curl -X GET http://localhost:5000/api/items
```

**With Filters:**
```bash
curl -X GET "http://localhost:5000/api/items?category=electronics&status=lost&search=phone"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Items retrieved successfully",
  "count": 5,
  "total": 10,
  "page": 1,
  "totalPages": 2,
  "data": [
    {
      "id": 1,
      "name": "iPhone 13",
      "description": "Silver iPhone with blue case",
      "category": "electronics",
      "status": "lost",
      "location": "Library 2nd Floor",
      "date": "2025-10-14",
      "image_url": "/uploads/image-1234567890.jpg",
      "claim_status": "unclaimed",
      "reporter_name": "John Doe",
      "reporter_email": "john@ccis.edu"
    }
  ]
}
```

---

### 2. GET Single Item by ID (Public)

**Request:**
```bash
curl -X GET http://localhost:5000/api/items/1
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Item retrieved successfully",
  "data": {
    "id": 1,
    "name": "iPhone 13",
    "description": "Silver iPhone with blue case",
    "category": "electronics",
    "status": "lost",
    "location": "Library 2nd Floor",
    "date": "2025-10-14",
    "image_url": "/uploads/image-1234567890.jpg",
    "claim_status": "unclaimed",
    "reporter_id": 1,
    "reporter_name": "John Doe",
    "reporter_email": "john@ccis.edu"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Item not found"
}
```

---

### 3. POST Create Item (Protected - Requires Authentication)

**Without Image:**
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Black Backpack",
    "description": "North Face black backpack with laptop compartment",
    "category": "bags",
    "status": "lost",
    "location": "Library 2nd Floor",
    "date": "2025-10-14"
  }'
```

**With Image:**
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=Black Backpack" \
  -F "description=North Face black backpack with laptop compartment" \
  -F "category=bags" \
  -F "status=lost" \
  -F "location=Library 2nd Floor" \
  -F "date=2025-10-14" \
  -F "image=@/path/to/image.jpg"
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Item reported successfully",
  "data": {
    "id": 5,
    "user_id": 1,
    "name": "Black Backpack",
    "description": "North Face black backpack with laptop compartment",
    "category": "bags",
    "status": "lost",
    "location": "Library 2nd Floor",
    "date": "2025-10-14",
    "image_url": "/uploads/backpack-1729123456789.jpg",
    "claim_status": "unclaimed",
    "created_at": "2025-10-14T10:30:00.000Z",
    "updated_at": "2025-10-14T10:30:00.000Z",
    "reporter_name": "John Doe",
    "reporter_email": "john@ccis.edu"
  }
}
```

**Validation Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "description",
      "message": "Description must be at least 10 characters"
    },
    {
      "field": "date",
      "message": "Date cannot be in the future"
    }
  ]
}
```

**Authentication Error (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

---

### 4. PUT Update Item (Protected)

**Request:**
```bash
curl -X PUT http://localhost:5000/api/items/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Item Name",
    "location": "New Location"
  }'
```

**With New Image:**
```bash
curl -X PUT http://localhost:5000/api/items/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=Updated Item Name" \
  -F "image=@/path/to/new-image.jpg"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Item updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Item Name",
    "location": "New Location",
    "updated_at": "2025-10-14T11:00:00.000Z"
  }
}
```

**Authorization Error (403 Forbidden):**
```json
{
  "success": false,
  "message": "Not authorized to update this item"
}
```

---

### 5. DELETE Item (Protected)

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/items/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

---

## File Upload Specifications

### Accepted Image Types:
- JPEG (image/jpeg, image/jpg)
- PNG (image/png)
- GIF (image/gif)
- WebP (image/webp)

### Maximum File Size:
- 5MB (5,242,880 bytes)

### File Upload Errors:

**File Too Large:**
```json
{
  "success": false,
  "message": "File is too large. Maximum size is 5MB."
}
```

**Invalid File Type:**
```json
{
  "success": false,
  "message": "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
}
```

---

## Testing with Postman

### Setup:
1. Create a new collection "FLIRT API"
2. Add environment variables:
   - `base_url`: http://localhost:5000
   - `token`: (JWT token after login)

### Test POST with Image:
1. Method: POST
2. URL: `{{base_url}}/api/items`
3. Headers:
   - Authorization: `Bearer {{token}}`
4. Body: form-data
   - name: "Black Backpack"
   - description: "Lost backpack with laptop"
   - category: "bags"
   - status: "lost"
   - location: "Library"
   - date: "2025-10-14"
   - image: (select file)

---

## Common HTTP Status Codes

- **200 OK**: Successful GET, PUT, DELETE
- **201 Created**: Successful POST
- **400 Bad Request**: Validation errors, invalid input
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Not authorized (not owner/admin)
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Server error

---

## Query Parameters for GET /api/items

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| category | string | Filter by category | `electronics`, `bags`, `clothing` |
| status | string | Filter by status | `lost`, `found` |
| location | string | Search in location | `library` |
| dateFrom | date | Items from this date | `2025-10-01` |
| dateTo | date | Items until this date | `2025-10-14` |
| search | string | Search in name/description | `phone` |
| claimStatus | string | Filter by claim status | `claimed`, `unclaimed` |
| page | number | Page number | `1` |
| limit | number | Items per page | `20` |

**Example:**
```
GET /api/items?category=electronics&status=lost&page=1&limit=10
```
