# FLIRT Authentication & Security Documentation

## Overview
FLIRT uses JWT (JSON Web Tokens) for stateless authentication with bcrypt password hashing for secure credential storage.

---

## Security Features

### ✅ Implemented Security Measures

1. **Password Security**
   - bcrypt hashing with cost factor 12
   - Minimum password requirements (6+ chars, uppercase, lowercase, number)
   - Password strength validation
   - Prevention of password reuse

2. **JWT Token Security**
   - Signed with HS256 algorithm
   - 7-day expiration (configurable)
   - Token includes: user ID, email, role
   - Automatic token expiration handling

3. **Rate Limiting**
   - Authentication endpoints: 5 requests per 15 minutes
   - Password change: 10 requests per hour
   - General API: 100 requests per 15 minutes
   - Prevents brute force attacks

4. **Account Protection**
   - Account suspension capability
   - Email uniqueness validation
   - Case-insensitive email matching
   - Suspended account login prevention

5. **Input Validation**
   - Email format validation
   - Password strength requirements
   - SQL injection prevention (parameterized queries)
   - XSS protection (input sanitization)

6. **Security Headers**
   - Helmet.js integration
   - CORS configuration
   - Content Security Policy

---

## Authentication Endpoints

### 1. Register

**POST** `/api/users/register`

Create a new user account with secure password hashing.

**Rate Limit:** 5 requests per 15 minutes per IP

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@ccis.edu",
  "password": "SecurePass123"
}
```

**Password Requirements:**
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Maximum 128 characters

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful. Welcome to FLIRT!",
  "data": {
    "user": {
      "id": 5,
      "name": "John Doe",
      "email": "john.doe@ccis.edu",
      "role": "student",
      "status": "active",
      "created_at": "2025-10-14T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

**Error Responses:**

**400 Bad Request - Weak Password:**
```json
{
  "success": false,
  "message": "Password does not meet security requirements",
  "code": "WEAK_PASSWORD",
  "errors": [
    "Password must contain at least one uppercase letter",
    "Password must contain at least one number"
  ]
}
```

**409 Conflict - Email Exists:**
```json
{
  "success": false,
  "message": "An account with this email already exists",
  "code": "EMAIL_EXISTS"
}
```

**429 Too Many Requests:**
```json
{
  "success": false,
  "message": "Too many authentication attempts. Please try again in 15 minutes.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 900
}
```

---

### 2. Login

**POST** `/api/users/login`

Authenticate user and receive JWT token.

**Rate Limit:** 5 requests per 15 minutes per IP+email

**Request Body:**
```json
{
  "email": "john.doe@ccis.edu",
  "password": "SecurePass123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful. Welcome back!",
  "data": {
    "user": {
      "id": 5,
      "name": "John Doe",
      "email": "john.doe@ccis.edu",
      "role": "student",
      "status": "active",
      "created_at": "2025-10-14T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

**Error Responses:**

**401 Unauthorized - Invalid Credentials:**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

**403 Forbidden - Account Suspended:**
```json
{
  "success": false,
  "message": "Your account has been suspended. Please contact support for assistance.",
  "code": "ACCOUNT_SUSPENDED"
}
```

---

### 3. Get Profile

**GET** `/api/users/profile`

Get current authenticated user's profile.

**Authentication:** Required (JWT token)

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "John Doe",
    "email": "john.doe@ccis.edu",
    "role": "student",
    "status": "active",
    "created_at": "2025-10-14T10:30:00.000Z"
  }
}
```

---

### 4. Update Profile

**PUT** `/api/users/profile`

Update user's name or email.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "John Updated Doe",
  "email": "john.updated@ccis.edu"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 5,
    "name": "John Updated Doe",
    "email": "john.updated@ccis.edu",
    "role": "student",
    "status": "active"
  }
}
```

---

### 5. Change Password

**PUT** `/api/users/change-password`

Change user's password with current password verification.

**Authentication:** Required

**Rate Limit:** 10 requests per hour

**Request Body:**
```json
{
  "currentPassword": "SecurePass123",
  "newPassword": "NewSecurePass456"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully. Please log in with your new password."
}
```

**Error Responses:**

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Current password is incorrect",
  "code": "INVALID_CURRENT_PASSWORD"
}
```

**400 Bad Request - Same Password:**
```json
{
  "success": false,
  "message": "New password must be different from current password",
  "code": "SAME_PASSWORD"
}
```

---

## JWT Token Usage

### Token Structure
```
Header.Payload.Signature
```

**Decoded Payload:**
```json
{
  "id": 5,
  "email": "john.doe@ccis.edu",
  "role": "student",
  "iat": 1697280000,
  "exp": 1697884800
}
```

### Using Tokens in Requests

**Include in Authorization Header:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example with cURL:**
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Example with JavaScript Fetch:**
```javascript
const response = await fetch('http://localhost:5000/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

## Protected Routes

### Authentication Required
All routes except `/api/users/register` and `/api/users/login` require authentication.

- ✅ `/api/items` (POST, PUT, DELETE)
- ✅ `/api/claims` (ALL routes)
- ✅ `/api/users/profile` (GET, PUT)
- ✅ `/api/users/change-password`
- ✅ `/api/admin/*` (ALL routes)

### Admin Only Routes
These routes require admin role in addition to authentication:

- ✅ `/api/admin/dashboard`
- ✅ `/api/admin/analytics`
- ✅ `/api/admin/users`
- ✅ `/api/admin/users/:id/status`
- ✅ `/api/admin/users/:id`
- ✅ `/api/admin/reports/:id/verify`
- ✅ `/api/claims/:id/status` (approve/reject claims)

---

## Error Codes

### Authentication Errors

| Code | Status | Description |
|------|--------|-------------|
| NO_AUTH_HEADER | 401 | Authorization header missing |
| NO_TOKEN | 401 | Token not provided |
| INVALID_TOKEN | 401 | Token is invalid or malformed |
| TOKEN_EXPIRED | 401 | Token has expired |
| USER_NOT_FOUND | 401 | User associated with token not found |
| ACCOUNT_SUSPENDED | 403 | User account is suspended |
| ADMIN_ONLY | 403 | Admin privileges required |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |

### Registration/Login Errors

| Code | Status | Description |
|------|--------|-------------|
| EMAIL_EXISTS | 409 | Email already registered |
| WEAK_PASSWORD | 400 | Password doesn't meet requirements |
| INVALID_CREDENTIALS | 401 | Email or password incorrect |
| INVALID_EMAIL | 400 | Email format invalid |
| MISSING_CREDENTIALS | 400 | Email or password not provided |

---

## Security Best Practices

### For Frontend Developers

1. **Store Tokens Securely**
   ```javascript
   // ❌ DON'T store in localStorage (vulnerable to XSS)
   localStorage.setItem('token', token);
   
   // ✅ DO store in memory or httpOnly cookies
   // Use state management (Redux, Context)
   const [token, setToken] = useState(null);
   ```

2. **Handle Token Expiration**
   ```javascript
   const handleApiCall = async () => {
     try {
       const response = await api.call();
       return response;
     } catch (error) {
       if (error.code === 'TOKEN_EXPIRED') {
         // Redirect to login
         logout();
         navigate('/login');
       }
     }
   };
   ```

3. **Clear Token on Logout**
   ```javascript
   const logout = () => {
     setToken(null);
     setUser(null);
     navigate('/login');
   };
   ```

4. **Validate Token Before Protected Routes**
   ```javascript
   const ProtectedRoute = ({ children }) => {
     if (!token) {
       return <Navigate to="/login" />;
     }
     return children;
   };
   ```

### For Backend Developers

1. **Never Log Passwords**
   ```javascript
   // ❌ DON'T
   console.log('Login attempt:', email, password);
   
   // ✅ DO
   console.log('Login attempt for:', email);
   ```

2. **Use Environment Variables**
   ```bash
   # .env
   JWT_SECRET=your-super-secret-key-change-in-production
   JWT_EXPIRE=7d
   ```

3. **Validate All Inputs**
   ```javascript
   // Always validate and sanitize user inputs
   const email = req.body.email.trim().toLowerCase();
   ```

4. **Monitor Failed Attempts**
   ```javascript
   // Log failed login attempts for security monitoring
   console.warn(`Failed login attempt for: ${email}`);
   ```

---

## Testing Authentication

### Register a New User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@ccis.edu",
    "password": "TestPass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ccis.edu",
    "password": "TestPass123"
  }'
```

### Access Protected Route
```bash
# Save token from login response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Test Rate Limiting
```bash
# Run this 6 times quickly to trigger rate limit
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/users/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@ccis.edu","password":"wrong"}'
done
```

---

## Environment Configuration

Required environment variables in `.env`:

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
JWT_EXPIRE=7d

# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=flirt_db
DB_USER=postgres
DB_PASSWORD=your_db_password
```

---

## Rate Limiting Details

### Authentication Endpoints
- **Window:** 15 minutes
- **Max Requests:** 5
- **Applies to:** `/api/users/register`, `/api/users/login`
- **Key:** IP + email combination

### Password Change
- **Window:** 1 hour
- **Max Requests:** 10
- **Applies to:** `/api/users/change-password`
- **Key:** User ID

### General API
- **Window:** 15 minutes
- **Max Requests:** 100
- **Applies to:** All API endpoints
- **Key:** IP address

### Rate Limit Headers
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 2025-10-14T11:00:00.000Z
```

---

## Password Hashing Details

### bcrypt Configuration
- **Algorithm:** bcrypt
- **Cost Factor:** 12 (2^12 = 4096 rounds)
- **Hash Length:** 60 characters
- **Salt:** Automatically generated

### Example Hash
```
$2b$12$K5qJ.zQ7X8Yw2lYvN3mH0OZvZ5qJ.zQ7X8Yw2lYvN3mH0OZvZ5qJ.z
```

**Hash Breakdown:**
- `$2b$` - bcrypt algorithm version
- `12$` - cost factor
- Remaining - salt + hash

---

## Security Recommendations

### Production Deployment

1. **Use HTTPS Only**
   - Never send tokens over HTTP
   - Enable HTTPS in production

2. **Secure JWT_SECRET**
   - Use a strong random secret (minimum 32 characters)
   - Never commit to version control
   - Rotate periodically

3. **Implement Token Refresh**
   - Short-lived access tokens (15 minutes)
   - Long-lived refresh tokens (7 days)
   - Refresh token rotation

4. **Add Redis for Rate Limiting**
   - Current implementation uses in-memory store
   - Use Redis in production for distributed systems

5. **Enable CORS Properly**
   ```javascript
   const corsOptions = {
     origin: process.env.CORS_ORIGIN,
     credentials: true
   };
   ```

6. **Monitor Security Events**
   - Failed login attempts
   - Rate limit violations
   - Suspicious activity patterns

7. **Implement Account Lockout**
   - Lock account after X failed attempts
   - Require email verification to unlock

8. **Add Two-Factor Authentication (2FA)**
   - SMS or authenticator app
   - Backup codes for account recovery

---

## Troubleshooting

### "Invalid token" Error
- Check token format (should start with "Bearer ")
- Verify JWT_SECRET matches between sign and verify
- Check token expiration

### "Account has been suspended"
- Admin has suspended the account
- Contact support for reactivation

### "Rate limit exceeded"
- Wait for the reset time specified in response
- Check if there's a script making too many requests

### Token Expired
- User needs to log in again
- Implement token refresh mechanism

---

## Additional Resources

- [JWT.io](https://jwt.io) - Debug and decode JWT tokens
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Password hashing library
- [OWASP Authentication Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
