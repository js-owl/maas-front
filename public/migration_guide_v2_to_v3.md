# Migration Guide: v2.x to v3.0.0

This guide helps frontend developers migrate from API v2.x to v3.0.0.

## Breaking Changes

### 1. Authentication: Form Data → JSON

**Before (v2.x):**
```javascript
// Login
const formData = new FormData();
formData.append('username', 'user');
formData.append('password', 'pass');

fetch('/login', {
  method: 'POST',
  body: formData
});

// Registration
const formData = new FormData();
formData.append('username', 'user');
formData.append('email', 'user@example.com');
formData.append('password', 'pass');

fetch('/register', {
  method: 'POST',
  body: formData
});
```

**After (v3.0.0):**
```javascript
// Login
fetch('/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'user',
    password: 'pass'
  })
});

// Registration
fetch('/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'user',
    email: 'user@example.com',
    password: 'pass',
    full_name: 'User Name',
    phone: '+1234567890',
    user_type: 'individual'
  })
});
```

### 2. File Uploads: Multipart → JSON with Base64

**Before (v2.x):**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('description', 'My model');

fetch('/files', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

**After (v3.0.0):**
```javascript
// Convert file to base64
const file = fileInput.files[0];
const reader = new FileReader();
reader.onload = function() {
  const base64Data = reader.result.split(',')[1]; // Remove data:type;base64, prefix
  
  fetch('/files', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      file_name: file.name,
      file_data: base64Data,
      description: 'My model'
    })
  });
};
reader.readAsDataURL(file);
```

### 3. Calculator Parameters: Updated Field Names

**Before (v2.x):**
```javascript
const calcData = {
  service_id: 'cnc-milling',
  material_id: 'alum_D16',
  material_form: 'rod',
  quantity: 1,
  length: 100,
  width: 50,
  height: 25,
  id_tolerance: '1',      // OLD
  id_finish: '1',         // OLD
  id_cover: ['1'],        // OLD
  k_otk: '1',
  k_cert: ['a', 'f'],
  k_complexity: 1.0
};
```

**After (v3.0.0):**
```javascript
const calcData = {
  service_id: 'cnc-milling',
  material_id: 'alum_D16',
  material_form: 'rod',
  quantity: 1,
  length: 100,
  width: 50,
  height: 25,
  tolerance_id: '1',      // NEW
  finish_id: '1',         // NEW
  cover_id: ['1'],        // NEW
  k_otk: '1',
  k_cert: ['a', 'f'],
  k_complexity: 1.0
};
```

### 4. Order Response: Consistent Field Naming

**Before (v2.x):**
```javascript
// Response might have inconsistent field names
const order = {
  id: 123,           // Sometimes 'id'
  order_id: 123,     // Sometimes 'order_id'
  // ... other fields
};
```

**After (v3.0.0):**
```javascript
// Consistent field naming
const order = {
  order_id: 123,     // Always 'order_id'
  user_id: 456,
  service_id: 'cnc-milling',
  // ... other fields
};
```

### 5. New Endpoints

**New endpoints in v3.0.0:**
- `POST /call-requests` - Call request creation (plural endpoint)
- `GET /orders/{order_id}/invoice` - Download order invoice
- `POST /orders/{order_id}/invoice/refresh` - Refresh invoice
- `GET /orders/invoices/missing` - Orders without invoices (admin)
- `GET /sync/status` - Bitrix sync status (admin)
- `POST /sync/all` - Sync all entities (admin)
- `POST /bitrix/webhook` - Bitrix webhook endpoint

### 6. OPTIONS Endpoints for CORS

All routes now support OPTIONS requests for CORS preflight:

```javascript
// Check if endpoint supports CORS
fetch('/api/endpoint', {
  method: 'OPTIONS'
}).then(response => {
  if (response.ok) {
    // Endpoint supports CORS
  }
});
```

## Migration Checklist

### Authentication Updates
- [ ] Update login form to use JSON instead of FormData
- [ ] Update registration form to use JSON instead of FormData
- [ ] Add required fields to registration (full_name, phone, user_type)
- [ ] Update error handling for new response format

### File Upload Updates
- [ ] Implement base64 encoding for file uploads
- [ ] Remove multipart form handling
- [ ] Update file upload progress indicators (if any)
- [ ] Test file upload with different file types (STL, STP, PDF, etc.)

### Calculator Integration Updates
- [ ] Update parameter names: id_tolerance → tolerance_id
- [ ] Update parameter names: id_finish → finish_id
- [ ] Update parameter names: id_cover → cover_id
- [ ] Test calculation requests with new parameter names

### Order Management Updates
- [ ] Update order response parsing to use order_id consistently
- [ ] Add invoice download functionality
- [ ] Add invoice refresh functionality
- [ ] Update order creation to use new parameter names

### New Features Integration
- [ ] Add call request creation functionality
- [ ] Add admin sync status monitoring (if admin interface)
- [ ] Add webhook handling (if needed)

### CORS Updates
- [ ] Ensure all API calls include proper CORS headers
- [ ] Handle OPTIONS preflight requests properly
- [ ] Test cross-origin requests

### Error Handling Updates
- [ ] Update error response parsing for new format
- [ ] Handle new error types and status codes
- [ ] Update user-facing error messages

## Code Examples

### Complete Authentication Service
```javascript
class AuthService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async login(username, password) {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return await response.json();
  }

  async register(userData) {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return await response.json();
  }
}
```

### Complete File Upload Service
```javascript
class FileUploadService {
  constructor(baseUrl, authToken) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  async uploadFile(file, description = '') {
    const base64Data = await this.fileToBase64(file);
    
    const response = await fetch(`${this.baseUrl}/files`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      },
      body: JSON.stringify({
        file_name: file.name,
        file_data: base64Data,
        description: description
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'File upload failed');
    }

    return await response.json();
  }

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
```

### Complete Order Service
```javascript
class OrderService {
  constructor(baseUrl, authToken) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  async createOrder(orderData) {
    const response = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      },
      body: JSON.stringify({
        service_id: orderData.service_id,
        file_id: orderData.file_id,
        quantity: orderData.quantity,
        length: orderData.length,
        width: orderData.width,
        height: orderData.height,
        n_dimensions: orderData.n_dimensions,
        tolerance_id: orderData.tolerance_id,  // Updated parameter name
        finish_id: orderData.finish_id,        // Updated parameter name
        cover_id: orderData.cover_id,          // Updated parameter name
        k_otk: orderData.k_otk,
        k_cert: orderData.k_cert,
        k_complexity: orderData.k_complexity,
        material_id: orderData.material_id,
        material_form: orderData.material_form,
        special_instructions: orderData.special_instructions
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Order creation failed');
    }

    return await response.json();
  }

  async getOrders() {
    const response = await fetch(`${this.baseUrl}/orders`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch orders');
    }

    return await response.json();
  }

  async downloadInvoice(orderId) {
    const response = await fetch(`${this.baseUrl}/orders/${orderId}/invoice`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Invoice not available');
    }

    return await response.blob();
  }
}
```

## Testing Your Migration

1. **Test Authentication:**
   - Login with valid credentials
   - Login with invalid credentials
   - Register new user
   - Register with existing username

2. **Test File Uploads:**
   - Upload STL files
   - Upload STP files
   - Upload PDF documents
   - Test file download and preview

3. **Test Calculator:**
   - Test price calculation with new parameter names
   - Test all service types
   - Test validation errors

4. **Test Orders:**
   - Create orders with new parameter names
   - Test order listing and details
   - Test invoice download (if available)

5. **Test CORS:**
   - Test from different origins
   - Verify OPTIONS requests work
   - Test preflight requests

## Rollback Plan

If issues arise during migration:

1. **Immediate Rollback:**
   - Revert frontend code to v2.x format
   - API v3.0.0 is backward compatible for most endpoints

2. **Gradual Migration:**
   - Migrate one feature at a time
   - Keep v2.x code as fallback
   - Use feature flags to switch between versions

3. **API Compatibility:**
   - v3.0.0 API maintains some v2.x compatibility
   - Old parameter names may still work (deprecated)
   - Response formats are mostly consistent

## Support

For migration support:
- Check API documentation: `docs/api_reference_v3.md`
- Test with API directly: `http://localhost:8000/docs`
- Contact development team for assistance

## Version History

- **v3.0.0**: Complete JSON API, new features, improved error handling
- **v2.x**: Form-based API, basic functionality
- **v1.x**: Initial version (deprecated)
