# FLIRT Claims API Documentation

## Overview
The Claims API allows users to submit ownership claims for lost/found items and enables administrators to verify and approve/reject these claims.

---

## Endpoints

### 1. Submit a New Claim

**POST** `/api/claims`

Submit a claim for ownership of an item.

**Authentication:** Required

**Request Body:**
```json
{
  "itemId": 5,
  "verificationMessage": "This is my black backpack. It has my CS textbook and a red water bottle inside. My name is written on the inside pocket."
}
```

**Validation Rules:**
- `itemId`: Required, must be a positive integer
- `verificationMessage`: Required, 10-1000 characters, alphanumeric with basic punctuation

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Claim submitted successfully. The item owner will be notified for verification.",
  "data": {
    "id": 15,
    "item_id": 5,
    "claimant_id": 3,
    "verification_message": "This is my black backpack...",
    "status": "pending",
    "admin_notes": null,
    "created_at": "2025-10-14T10:30:00.000Z",
    "updated_at": "2025-10-14T10:30:00.000Z",
    "claimant_name": "John Doe",
    "claimant_email": "john@ccis.edu",
    "item_name": "Black Backpack",
    "item_status": "lost",
    "reporter_name": "Jane Smith",
    "reporter_email": "jane@ccis.edu"
  }
}
```

**Error Responses:**

**400 Bad Request - Already Claimed:**
```json
{
  "success": false,
  "message": "This item has already been claimed and verified"
}
```

**400 Bad Request - Own Item:**
```json
{
  "success": false,
  "message": "You cannot claim your own item"
}
```

**400 Bad Request - Duplicate Claim:**
```json
{
  "success": false,
  "message": "You already have a pending claim for this item"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Item not found"
}
```

---

### 2. Get All Claims

**GET** `/api/claims`

Retrieve all claims (filtered by user if not admin).

**Authentication:** Required

**Query Parameters:**
- `status` (optional): Filter by status - `pending`, `approved`, `rejected`
- `itemId` (optional): Filter by item ID
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 50): Items per page

**Example:**
```
GET /api/claims?status=pending&page=1&limit=20
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Claims retrieved successfully",
  "count": 5,
  "total": 15,
  "page": 1,
  "totalPages": 1,
  "data": [
    {
      "id": 15,
      "item_id": 5,
      "claimant_id": 3,
      "verification_message": "This is my black backpack...",
      "status": "pending",
      "admin_notes": null,
      "created_at": "2025-10-14T10:30:00.000Z",
      "updated_at": "2025-10-14T10:30:00.000Z",
      "claimant_name": "John Doe",
      "claimant_email": "john@ccis.edu",
      "item_name": "Black Backpack",
      "item_description": "North Face black backpack...",
      "item_status": "lost",
      "item_location": "Library 2nd Floor",
      "item_claim_status": "unclaimed",
      "reporter_name": "Jane Smith",
      "reporter_email": "jane@ccis.edu",
      "reporter_id": 1
    }
  ]
}
```

**Notes:**
- Regular users see only their own claims OR claims for items they reported
- Admins see all claims in the system

---

### 3. Get Single Claim

**GET** `/api/claims/:id`

Get detailed information about a specific claim.

**Authentication:** Required

**Parameters:**
- `id`: Claim ID

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Claim retrieved successfully",
  "data": {
    "id": 15,
    "item_id": 5,
    "claimant_id": 3,
    "verification_message": "This is my black backpack...",
    "status": "pending",
    "admin_notes": null,
    "created_at": "2025-10-14T10:30:00.000Z",
    "updated_at": "2025-10-14T10:30:00.000Z",
    "claimant_name": "John Doe",
    "claimant_email": "john@ccis.edu",
    "item_name": "Black Backpack",
    "item_description": "North Face black backpack with laptop compartment",
    "item_location": "Library 2nd Floor",
    "item_date": "2025-10-13",
    "item_status": "lost",
    "item_claim_status": "unclaimed",
    "item_image_url": "/uploads/backpack-123.jpg",
    "reporter_name": "Jane Smith",
    "reporter_email": "jane@ccis.edu",
    "reporter_id": 1
  }
}
```

**Authorization:**
- Claimant can view their own claim
- Item reporter can view claims for their items
- Admin can view all claims

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Not authorized to view this claim"
}
```

---

### 4. Update Claim Status (Admin Only)

**PUT** `/api/claims/:id/status`

Approve or reject a claim.

**Authentication:** Required (Admin only)

**Parameters:**
- `id`: Claim ID

**Request Body:**
```json
{
  "status": "approved",
  "adminNotes": "Verification confirmed. Item owner verified ownership details."
}
```

**Validation:**
- `status`: Required, must be `pending`, `approved`, or `rejected`
- `adminNotes`: Optional, max 500 characters

**Success Response (200 OK) - Approved:**
```json
{
  "success": true,
  "message": "Claim approved successfully. Item marked as claimed and claimant (John Doe) has been notified.",
  "data": {
    "id": 15,
    "item_id": 5,
    "claimant_id": 3,
    "verification_message": "This is my black backpack...",
    "status": "approved",
    "admin_notes": "Verification confirmed...",
    "created_at": "2025-10-14T10:30:00.000Z",
    "updated_at": "2025-10-14T11:00:00.000Z",
    "claimant_name": "John Doe",
    "claimant_email": "john@ccis.edu",
    "item_name": "Black Backpack"
  }
}
```

**Success Response (200 OK) - Rejected:**
```json
{
  "success": true,
  "message": "Claim rejected. Claimant (John Doe) has been notified.",
  "data": {
    "id": 15,
    "status": "rejected",
    "admin_notes": "Unable to verify ownership details",
    "updated_at": "2025-10-14T11:00:00.000Z"
  }
}
```

**What Happens When Approved:**
1. Claim status changes to `approved`
2. Item's `claim_status` changes to `claimed`
3. All other pending claims for the same item are automatically rejected
4. Admin notes are saved

**What Happens When Rejected:**
1. Claim status changes to `rejected`
2. Admin notes are saved
3. If this was the only approved claim, item reverts to `unclaimed`

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Claim is already approved"
}
```

---

### 5. Get Claims by Item

**GET** `/api/claims/item/:itemId`

Get all claims for a specific item.

**Authentication:** Required (Item owner or Admin)

**Parameters:**
- `itemId`: Item ID

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Claims retrieved successfully",
  "count": 3,
  "data": [
    {
      "id": 15,
      "item_id": 5,
      "claimant_id": 3,
      "verification_message": "This is my black backpack...",
      "status": "pending",
      "admin_notes": null,
      "created_at": "2025-10-14T10:30:00.000Z",
      "updated_at": "2025-10-14T10:30:00.000Z",
      "claimant_name": "John Doe",
      "claimant_email": "john@ccis.edu"
    }
  ]
}
```

---

### 6. Get User Claim Statistics

**GET** `/api/claims/stats`

Get claim statistics for the authenticated user.

**Authentication:** Required

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Claim statistics retrieved successfully",
  "data": {
    "total": 8,
    "pending": 2,
    "approved": 4,
    "rejected": 2
  }
}
```

---

### 7. Delete Claim

**DELETE** `/api/claims/:id`

Delete a claim.

**Authentication:** Required

**Parameters:**
- `id`: Claim ID

**Authorization:**
- Claimant can delete their own pending/rejected claims
- Admin can delete any claim
- Approved claims can only be deleted by admin

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Claim deleted successfully"
}
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Cannot delete an approved claim. Please contact an administrator."
}
```

---

## Claim Status Flow

```
┌──────────┐
│ pending  │ ← Initial status when claim is submitted
└────┬─────┘
     │
     ├─────→ ┌──────────┐
     │       │ approved │ ← Admin approves claim
     │       └──────────┘   (Item marked as claimed, other claims rejected)
     │
     └─────→ ┌──────────┐
             │ rejected │ ← Admin rejects claim
             └──────────┘   (Item remains available)
```

---

## Business Rules

1. **Claim Submission:**
   - User must be authenticated
   - Cannot claim own items
   - Cannot claim already claimed items
   - Cannot have multiple pending claims for same item
   - Verification message must be detailed (min 10 characters)

2. **Claim Approval:**
   - Only admins can approve/reject claims
   - Approving a claim automatically rejects all other pending claims for that item
   - Item status changes to "claimed" when approved
   - Original item reporter and claimant are notified

3. **Claim Rejection:**
   - Admin must provide reason in admin notes
   - If the only approved claim is rejected, item becomes unclaimed again
   - User can submit a new claim after rejection

4. **Claim Deletion:**
   - Regular users can only delete their pending/rejected claims
   - Admins can delete any claim
   - Deleting an approved claim requires admin privileges

---

## Testing with cURL

### Submit a Claim
```bash
curl -X POST http://localhost:5000/api/claims \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": 5,
    "verificationMessage": "This is my black backpack. It has my CS textbook inside and a red water bottle in the side pocket."
  }'
```

### Get All Claims
```bash
curl -X GET "http://localhost:5000/api/claims?status=pending" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Approve Claim (Admin)
```bash
curl -X PUT http://localhost:5000/api/claims/15/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved",
    "adminNotes": "Ownership verified through detailed description"
  }'
```

### Reject Claim (Admin)
```bash
curl -X PUT http://localhost:5000/api/claims/15/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "rejected",
    "adminNotes": "Unable to verify ownership. Description does not match item details."
  }'
```

---

## Frontend Integration

### Claim Submission Flow
1. User browses items
2. Clicks "Claim This Item"
3. Fills verification form
4. Submits claim → POST `/api/claims`
5. Receives confirmation with status

### Status Updates for Frontend
```javascript
// Poll for status updates
const checkClaimStatus = async (claimId) => {
  const response = await fetch(`/api/claims/${claimId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  
  // Update UI based on status
  switch(data.data.status) {
    case 'pending':
      showStatus('Pending Review', 'warning');
      break;
    case 'approved':
      showStatus('Approved! Contact reporter to arrange pickup', 'success');
      break;
    case 'rejected':
      showStatus(`Rejected: ${data.data.admin_notes}`, 'error');
      break;
  }
};
```

### Admin Dashboard Integration
```javascript
// Get all pending claims for admin review
const getPendingClaims = async () => {
  const response = await fetch('/api/claims?status=pending', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return await response.json();
};

// Approve/Reject claim
const reviewClaim = async (claimId, status, notes) => {
  const response = await fetch(`/api/claims/${claimId}/status`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status, adminNotes: notes })
  });
  return await response.json();
};
```

---

## HTTP Status Codes

- **200 OK**: Successful GET, PUT, DELETE
- **201 Created**: Successful claim submission
- **400 Bad Request**: Validation errors, business rule violations
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Claim or item not found
- **500 Internal Server Error**: Server error

---

## Security Considerations

1. All endpoints require authentication
2. Users can only view/modify their own claims (except admins)
3. Only admins can change claim status
4. Verification messages are validated for malicious content
5. SQL injection prevention through parameterized queries
6. Rate limiting recommended for claim submissions

---

## Notes for Developers

- Implement WebSocket or Server-Sent Events for real-time status updates
- Add email notifications when claims are approved/rejected
- Consider adding image verification requirements
- Implement anti-spam measures for claim submissions
- Log all admin actions for audit trail
