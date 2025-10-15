# Manufacturing Service API v3.0.0 Reference

## Overview

The Manufacturing Service API provides a comprehensive backend for a manufacturing service platform with user management, 3D model file uploads, order processing, and Bitrix24 CRM integration.

**Base URL:** `http://localhost:8000` (development)  
**API Version:** 3.0.0  
**Authentication:** JWT Bearer tokens  
**Content Type:** `application/json` (all endpoints use JSON)

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### POST /register
Register a new user account.

**Authentication:** None  
**Request Body:**
```json
{
  "username": "string",
  "email": "string", 
  "password": "string",
  "full_name": "string",
  "phone": "string",
  "user_type": "individual" | "legal"
}
```

**Response:** 200 OK
```json
{
  "message": "User registered successfully",
  "user_id": 123
}
```

**Error Responses:**
- 400: Username already registered
- 422: Validation error

### POST /login
Authenticate user and receive access token.

**Authentication:** None  
**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:** 200 OK
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

**Error Responses:**
- 401: Invalid credentials
- 422: Validation error

### POST /logout
Logout user (invalidate token).

**Authentication:** Required  
**Request Body:** None

**Response:** 200 OK
```json
{
  "message": "Successfully logged out"
}
```

### OPTIONS /register, /login, /logout
Handle CORS preflight requests.

**Response:** 200 OK

## User Management

### GET /profile
Get current user's profile.

**Authentication:** Required  
**Response:** 200 OK
```json
{
  "id": 123,
  "username": "string",
  "email": "string",
  "full_name": "string",
  "phone": "string",
  "user_type": "individual" | "legal",
  "is_admin": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### PUT /profile
Update current user's profile.

**Authentication:** Required  
**Request Body:**
```json
{
  "full_name": "string",
  "phone": "string"
}
```

**Response:** 200 OK
```json
{
  "message": "Profile updated successfully"
}
```

### GET /users (Admin)
Get all users (admin only).

**Authentication:** Admin required  
**Response:** 200 OK
```json
[
  {
    "id": 123,
    "username": "string",
    "email": "string",
    "full_name": "string",
    "phone": "string",
    "user_type": "individual" | "legal",
    "is_admin": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### GET /users/{user_id} (Admin)
Get user by ID (admin only).

**Authentication:** Admin required  
**Response:** 200 OK
```json
{
  "id": 123,
  "username": "string",
  "email": "string",
  "full_name": "string",
  "phone": "string",
  "user_type": "individual" | "legal",
  "is_admin": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### PUT /users/{user_id} (Admin)
Update user by ID (admin only).

**Authentication:** Admin required  
**Request Body:**
```json
{
  "full_name": "string",
  "phone": "string",
  "is_admin": false
}
```

**Response:** 200 OK
```json
{
  "message": "User updated successfully"
}
```

### OPTIONS /profile, /users, /users/{user_id}
Handle CORS preflight requests.

**Response:** 200 OK

## Files (3D Models)

### POST /files
Upload a 3D model file using JSON with base64 data.

**Authentication:** Required  
**Request Body:**
```json
{
  "file_name": "model.stl",
  "file_data": "base64_encoded_file_content",
  "description": "Optional description"
}
```

**Response:** 200 OK
```json
{
  "id": 123,
  "filename": "generated_filename.stl",
  "original_filename": "model.stl",
  "file_size": 1024,
  "file_type": "stl",
  "uploaded_at": "2024-01-01T00:00:00Z",
  "preview_generated": true,
  "preview_url": "/files/123/preview"
}
```

### GET /files
Get user's uploaded files.

**Authentication:** Required  
**Response:** 200 OK
```json
[
  {
    "id": 123,
    "filename": "string",
    "original_filename": "string",
    "file_size": 1024,
    "file_type": "stl",
    "uploaded_at": "2024-01-01T00:00:00Z",
    "preview_generated": true
  }
]
```

### GET /files/demo
Get demo files (no authentication required).

**Authentication:** None  
**Response:** 200 OK
```json
[
  {
    "id": 1,
    "filename": "demo_model.stl",
    "original_filename": "demo_model.stl",
    "file_size": 1024,
    "file_type": "stl",
    "is_demo": true
  }
]
```

### GET /files/{file_id}
Get file details by ID.

**Authentication:** Required (or file owner)  
**Response:** 200 OK
```json
{
  "id": 123,
  "filename": "string",
  "original_filename": "string",
  "file_size": 1024,
  "file_type": "stl",
  "uploaded_at": "2024-01-01T00:00:00Z",
  "preview_generated": true
}
```

### GET /files/{file_id}/download
Download file by ID.

**Authentication:** Required (or file owner)  
**Response:** 200 OK (file content)

### GET /files/{file_id}/preview
Get file preview image.

**Authentication:** Required (or file owner)  
**Response:** 200 OK (image content)

### DELETE /files/{file_id}
Delete file by ID.

**Authentication:** Required (or file owner)  
**Response:** 200 OK
```json
{
  "message": "File deleted successfully"
}
```

### OPTIONS /files, /files/demo, /files/{file_id}, /files/{file_id}/download, /files/{file_id}/preview
Handle CORS preflight requests.

**Response:** 200 OK

## Documents

### POST /documents
Upload a document using JSON with base64 data.

**Authentication:** Required  
**Request Body:**
```json
{
  "file_name": "document.pdf",
  "file_data": "base64_encoded_file_content",
  "category": "technical_spec",
  "description": "Optional description"
}
```

**Response:** 200 OK
```json
{
  "id": 123,
  "filename": "generated_filename.pdf",
  "original_filename": "document.pdf",
  "file_size": 2048,
  "file_type": "pdf",
  "category": "technical_spec",
  "uploaded_at": "2024-01-01T00:00:00Z"
}
```

### GET /documents
Get user's uploaded documents.

**Authentication:** Required  
**Response:** 200 OK
```json
[
  {
    "id": 123,
    "filename": "string",
    "original_filename": "string",
    "file_size": 2048,
    "file_type": "pdf",
    "category": "technical_spec",
    "uploaded_at": "2024-01-01T00:00:00Z"
  }
]
```

### GET /documents/{document_id}
Get document details by ID.

**Authentication:** Required (or document owner)  
**Response:** 200 OK
```json
{
  "id": 123,
  "filename": "string",
  "original_filename": "string",
  "file_size": 2048,
  "file_type": "pdf",
  "category": "technical_spec",
  "uploaded_at": "2024-01-01T00:00:00Z"
}
```

### GET /documents/{document_id}/download
Download document by ID.

**Authentication:** Required (or document owner)  
**Response:** 200 OK (file content)

### DELETE /documents/{document_id}
Delete document by ID.

**Authentication:** Required (or document owner)  
**Response:** 200 OK
```json
{
  "message": "Document deleted successfully"
}
```

### GET /admin/documents (Admin)
Get all documents (admin only).

**Authentication:** Admin required  
**Query Parameters:**
- `category` (optional): Filter by category

**Response:** 200 OK
```json
[
  {
    "id": 123,
    "filename": "string",
    "original_filename": "string",
    "file_size": 2048,
    "file_type": "pdf",
    "category": "technical_spec",
    "uploaded_at": "2024-01-01T00:00:00Z",
    "user_id": 456
  }
]
```

### OPTIONS /documents, /documents/{document_id}, /documents/{document_id}/download
Handle CORS preflight requests.

**Response:** 200 OK

## Calculator Proxy

### POST /calculate-price
Calculate manufacturing price without creating an order.

**Authentication:** Optional  
**Request Body:**
```json
{
  "service_id": "cnc-milling",
  "material_id": "alum_D16",
  "material_form": "rod",
  "quantity": 1,
  "length": 100,
  "width": 50,
  "height": 25,
  "n_dimensions": 3,
  "tolerance_id": "1",
  "finish_id": "1",
  "cover_id": ["1"],
  "k_otk": "1",
  "k_cert": ["a", "f"],
  "k_complexity": 1.0
}
```

**Response:** 200 OK
```json
{
  "service_id": "cnc-milling",
  "total_price": 150.50,
  "detail_price": 150.50,
  "mat_price": 75.25,
  "work_price": 75.25,
  "mat_weight": 0.5,
  "mat_volume": 0.000125,
  "total_time": 2.5,
  "manufacturing_cycle": "2-3 days"
}
```

### GET /services
Get available manufacturing services.

**Authentication:** None  
**Response:** 200 OK
```json
{
  "cnc-milling": {
    "name": "CNC Milling",
    "description": "Precision milling operations"
  },
  "cnc-lathe": {
    "name": "CNC Lathe", 
    "description": "Turning and facing operations"
  },
  "printing": {
    "name": "3D Printing",
    "description": "Additive manufacturing"
  },
  "painting": {
    "name": "Painting",
    "description": "Surface finishing"
  }
}
```

### GET /materials
Get available materials.

**Authentication:** None  
**Response:** 200 OK
```json
{
  "alum_D16": {
    "name": "Aluminum D16",
    "density": 2.7,
    "price_per_kg": 15.50
  }
}
```

### GET /coefficients
Get calculation coefficients.

**Authentication:** None  
**Response:** 200 OK
```json
{
  "tolerance": {
    "1": {"name": "Standard", "multiplier": 1.0},
    "2": {"name": "High Precision", "multiplier": 1.5}
  },
  "finish": {
    "1": {"name": "Rough", "multiplier": 1.0},
    "2": {"name": "Smooth", "multiplier": 1.2}
  }
}
```

### GET /locations
Get available manufacturing locations.

**Authentication:** None  
**Response:** 200 OK
```json
{
  "moscow": {
    "name": "Moscow",
    "shipping_cost": 10.00
  }
}
```

### OPTIONS /calculate-price, /services, /materials, /coefficients, /locations
Handle CORS preflight requests.

**Response:** 200 OK

## Orders

### POST /orders
Create a new manufacturing order.

**Authentication:** Required  
**Request Body:**
```json
{
  "service_id": "cnc-milling",
  "file_id": 123,
  "quantity": 1,
  "length": 100,
  "width": 50,
  "height": 25,
  "n_dimensions": 3,
  "tolerance_id": "1",
  "finish_id": "1",
  "cover_id": ["1"],
  "k_otk": "1",
  "k_cert": ["a", "f"],
  "k_complexity": 1.0,
  "material_id": "alum_D16",
  "material_form": "rod",
  "special_instructions": "Handle with care"
}
```

**Response:** 200 OK
```json
{
  "order_id": 456,
  "user_id": 123,
  "service_id": "cnc-milling",
  "file_id": 123,
  "quantity": 1,
  "status": "pending",
  "total_price": 150.50,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### GET /orders
Get user's orders.

**Authentication:** Required  
**Response:** 200 OK
```json
[
  {
    "order_id": 456,
    "user_id": 123,
    "service_id": "cnc-milling",
    "file_id": 123,
    "quantity": 1,
    "status": "pending",
    "total_price": 150.50,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### GET /orders/{order_id}
Get order details by ID.

**Authentication:** Required (or order owner)  
**Response:** 200 OK
```json
{
  "order_id": 456,
  "user_id": 123,
  "service_id": "cnc-milling",
  "file_id": 123,
  "quantity": 1,
  "status": "pending",
  "total_price": 150.50,
  "created_at": "2024-01-01T00:00:00Z",
  "file": {
    "id": 123,
    "filename": "model.stl",
    "original_filename": "model.stl"
  }
}
```

### GET /orders/{order_id}/invoice
Download order invoice (if available).

**Authentication:** Required (or order owner)  
**Response:** 200 OK (PDF file content)

### POST /orders/{order_id}/invoice/refresh
Manually refresh order invoice from Bitrix.

**Authentication:** Required (or order owner)  
**Response:** 200 OK
```json
{
  "message": "Invoice refresh initiated"
}
```

### GET /orders/invoices/missing (Admin)
Get orders without invoices (admin only).

**Authentication:** Admin required  
**Response:** 200 OK
```json
[
  {
    "order_id": 456,
    "user_id": 123,
    "status": "completed",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### GET /admin/orders (Admin)
Get all orders (admin only).

**Authentication:** Admin required  
**Response:** 200 OK
```json
[
  {
    "order_id": 456,
    "user_id": 123,
    "service_id": "cnc-milling",
    "file_id": 123,
    "quantity": 1,
    "status": "pending",
    "total_price": 150.50,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### GET /admin/orders/{order_id} (Admin)
Get order details by ID (admin only).

**Authentication:** Admin required  
**Response:** 200 OK (same as GET /orders/{order_id})

### PUT /admin/orders/{order_id} (Admin)
Update order status (admin only).

**Authentication:** Admin required  
**Request Body:**
```json
{
  "status": "processing" | "completed" | "cancelled"
}
```

**Response:** 200 OK
```json
{
  "message": "Order updated successfully"
}
```

### OPTIONS /orders, /orders/{order_id}, /admin/orders, /admin/orders/{order_id}
Handle CORS preflight requests.

**Response:** 200 OK

## Call Requests

### POST /call-request
Create a call request (singular endpoint).

**Authentication:** Required  
**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "product": "CNC Milling",
  "time": "Morning",
  "additional": "Need urgent quote",
  "agreement": true
}
```

**Response:** 200 OK
```json
{
  "id": 789,
  "name": "John Doe",
  "phone": "+1234567890",
  "product": "CNC Milling",
  "time": "Morning",
  "additional": "Need urgent quote",
  "agreement": true,
  "status": "new",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### POST /call-requests
Create a call request (plural endpoint for compatibility).

**Authentication:** Required  
**Request Body:** Same as /call-request  
**Response:** Same as /call-request

### GET /admin/call-requests (Admin)
Get all call requests (admin only).

**Authentication:** Admin required  
**Response:** 200 OK
```json
[
  {
    "id": 789,
    "name": "John Doe",
    "phone": "+1234567890",
    "product": "CNC Milling",
    "time": "Morning",
    "additional": "Need urgent quote",
    "agreement": true,
    "status": "new",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### GET /admin/call-requests/{call_request_id} (Admin)
Get call request by ID (admin only).

**Authentication:** Admin required  
**Response:** 200 OK (same as POST /call-request)

### PUT /admin/call-requests/{call_request_id} (Admin)
Update call request status (admin only).

**Authentication:** Admin required  
**Request Body:**
```json
{
  "status": "contacted" | "completed" | "cancelled"
}
```

**Response:** 200 OK
```json
{
  "message": "Call request updated successfully"
}
```

### OPTIONS /call-request, /call-requests, /admin/call-requests, /admin/call-requests/{call_request_id}
Handle CORS preflight requests.

**Response:** 200 OK

## Bitrix Sync (Admin)

### GET /sync/status
Get Bitrix sync status.

**Authentication:** Admin required  
**Response:** 200 OK
```json
{
  "bitrix_enabled": true,
  "queue_size": 5,
  "last_sync": "2024-01-01T00:00:00Z",
  "pending_deals": 2,
  "pending_contacts": 1,
  "pending_leads": 2
}
```

### GET /sync/queue
Get sync queue items.

**Authentication:** Admin required  
**Response:** 200 OK
```json
[
  {
    "id": 1,
    "entity_type": "deal",
    "entity_id": 456,
    "operation": "create",
    "status": "pending",
    "attempts": 0,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### POST /sync/process
Manually process sync queue.

**Authentication:** Admin required  
**Request Body:**
```json
{
  "limit": 10
}
```

**Response:** 200 OK
```json
{
  "processed": 5,
  "successful": 4,
  "failed": 1
}
```

### POST /sync/all
Sync all entities to Bitrix.

**Authentication:** Admin required  
**Response:** 200 OK
```json
{
  "message": "Full sync initiated",
  "queued_items": 15
}
```

### POST /sync/pending
Sync only pending entities.

**Authentication:** Admin required  
**Response:** 200 OK
```json
{
  "message": "Pending sync initiated",
  "queued_items": 5
}
```

### POST /bitrix/webhook
Receive Bitrix webhook events.

**Authentication:** None (webhook endpoint)  
**Request Body:**
```json
{
  "event_type": "deal_updated",
  "entity_type": "deal",
  "entity_id": "12345",
  "data": {
    "id": "12345",
    "title": "Test Deal",
    "stage_id": "NEW"
  }
}
```

**Response:** 200 OK
```json
{
  "message": "Webhook processed successfully"
}
```

### OPTIONS /sync/process, /sync/status, /sync/queue, /sync/all, /sync/pending, /bitrix/webhook
Handle CORS preflight requests.

**Response:** 200 OK

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "BAD_REQUEST",
  "message": "Invalid request data",
  "details": {}
}
```

### 401 Unauthorized
```json
{
  "error": "UNAUTHORIZED",
  "message": "Authentication required",
  "details": {}
}
```

### 403 Forbidden
```json
{
  "error": "FORBIDDEN",
  "message": "Insufficient permissions",
  "details": {}
}
```

### 404 Not Found
```json
{
  "error": "NOT_FOUND",
  "message": "Resource not found",
  "details": {}
}
```

### 422 Validation Error
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": {
    "field_name": ["Error message"]
  }
}
```

### 500 Internal Server Error
```json
{
  "error": "INTERNAL_ERROR",
  "message": "Internal server error",
  "details": {}
}
```

## CORS Support

All endpoints support CORS preflight requests via OPTIONS method. The API includes appropriate CORS headers for cross-origin requests.

**Supported Origins:** Configured per environment  
**Supported Methods:** GET, POST, PUT, DELETE, OPTIONS  
**Supported Headers:** Authorization, Content-Type, Accept

## Rate Limiting

Currently no rate limiting is implemented. Consider implementing rate limiting for production use.

## Versioning

API versioning is handled via URL path. Current version is v3.0.0.

## Support

For API support and questions, contact the development team.
