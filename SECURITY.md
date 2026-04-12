# Security Implementation Guide

## Overview

This document outlines all security enhancements implemented in the Node-Rest-Shop MERN stack application. These improvements protect against common web vulnerabilities including brute force attacks, injection attacks, CORS attacks, and XSS vulnerabilities.

---

## Security Improvements Implemented

### 1. **Rate Limiting (CRITICAL)**

**Status:** ✅ Implemented

**File:** `api/middleware/rate-limit.js`

**Details:**
- Limits authentication endpoints to **5 requests per 15 minutes per IP**
- Applies to:
  - `POST /users/signup`
  - `POST /users/login`
- Returns HTTP **429 (Too Many Requests)** with clear rate limit message
- Uses **express-rate-limit** library
- Prevents brute force and credential stuffing attacks

**Configuration:**
```javascript
Limit: 5 requests per 15 minutes per IP
Response: 429 status with rate limit info in headers
```

---

### 2. **Input Validation & Sanitization**

**Status:** ✅ Implemented

**Files:**
- `api/middleware/input-validation.js` - Validation rules
- `api/middleware/sanitize-input.js` - Sanitization functions

**Details:**

#### Email Validation
- Must be valid email format
- Automatically normalized

#### Password Validation
- Minimum 6 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain number

#### Product Name
- Maximum 100 characters
- Alphanumeric + spaces + special chars only: `- , ' & ( ) .`
- Prevents injection attacks

#### Username
- 3-30 characters
- Alphanumeric, hyphens, underscores only
- Prevents special character injection

#### Order Quantity
- Integer between 1-1000
- Prevents negative/excessive quantities

#### Sanitization Features
- Removes MongoDB operators (`$where`, `$regex`, etc.)
- Removes angle brackets for XSS prevention
- Trims whitespace
- Recursively sanitizes objects and arrays
- Protects all request inputs: body, query, params

---

### 3. **CORS Security**

**Status:** ✅ Enhanced

**File:** `app.js`

**Changes:**
- Replaced open CORS (`origin: "*"`) with whitelist
- Allowed origins:
  - `http://localhost:5173` (frontend dev)
  - `http://localhost:3000` (fallback)
  - Custom origins via `CLIENT_URL` env variable

**Credentials:** Enabled (required for JWT)

**Allowed Methods:** GET, POST, PATCH, DELETE, OPTIONS

**Allowed Headers:** Content-Type, Authorization

---

### 4. **Content Security Policy (CSP)**

**Status:** ✅ Enabled

**Configuration:**
- Default: `'self'` (same origin only)
- Styles: `'self'` + inline (required for Tailwind)
- Scripts: `'self'` only
- Images: `'self'` + data URIs + HTTPS
- Connect: `'self'` + Frontend URL

**Benefits:**
- Prevents inline script injection
- Protects against unauthorized resource loading
- Restricts data exfiltration

---

### 5. **Security Headers**

**Status:** ✅ Improved

**Implemented via Helmet.js:**

- **HSTS:** Force HTTPS, 1 year max-age, subdomains included
- **X-Frame-Options:** Implicit (clickjacking protection)
- **X-Content-Type-Options:** nosniff (MIME type sniffing prevention)
- **X-XSS-Protection:** Enabled
- **Referrer-Policy:** Implicit (safe default)
- **Permissions-Policy:** Default (restrictive)

---

### 6. **Request Size Limits**

**Status:** ✅ Reduced

**File:** `app.js`

**Changes:**
- JSON: Reduced from **10MB → 100KB**
- URL-encoded: **100KB limit**
- File uploads (Multer): **5MB limit** (images only)

**Benefits:**
- Prevents DoS attacks via large payloads
- Reduces server memory usage
- Prevents slowdown attacks

---

### 7. **Database URL Configuration**

**Status:** ✅ Secured

**File:** `app.js`

**Details:**
- MongoDB URI now REQUIRED in environment variables
- Never hardcoded in source code
- Throws error if missing on startup
- Prevents accidental credential exposure

---

### 8. **Base URL Configuration**

**Status:** ✅ Secured

**File:** `api/controllers/products.js`

**Changes:**
- Removed hardcoded `http://localhost:PORT` URLs
- Now uses `BASE_URL` environment variable
- Allows flexible deployment across environments
- Prevents hardcoded localhost in production images

---

### 9. **Password Security**

**Status:** ✅ Enhanced

**Implementation:**
- Bcrypt hashing with 10 salt rounds
- Password complexity requirements enforced
- No cleartext passwords in responses
- Secure password comparison with bcrypt

**Validation Rules:**
✅ Minimum 6 characters
✅ At least one uppercase letter
✅ At least one lowercase letter
✅ At least one number

---

### 10. **NoSQL Injection Protection**

**Status:** ✅ Implemented

**File:** `api/middleware/sanitize-input.js`

**Details:**
- Removes MongoDB operators from all inputs
- Dangerous patterns detected: `$where`, `$regex`, `$ne`, etc.
- Applied to body, query, and URL parameters
- Works alongside Mongoose schema validation

**Example:**
```javascript
// Dangerous input
{ email: { $ne: null } }

// After sanitization
{ email: "" }
```

---

### 11. **ObjectId Validation**

**Status:** ✅ Implemented

**File:** `api/middleware/input-validation.js`

**Details:**
- Validates all MongoDB ObjectId parameters
- Applied to routes:
  - `GET /products/:productId`
  - `PATCH /products/:productId`
  - `DELETE /products/:productId`
  - `GET /orders/:orderId`
  - `DELETE /orders/:orderId`

**Error Response:**
```json
{
  "success": false,
  "error": { "message": "Invalid ID format" }
}
```

---

## Environment Variables

### Backend (.env)

**Required Variables:**
```env
NODE_ENV=development
PORT=8000
MONGODB_URI=mongodb://localhost:27017/node-rest-shop
JWT_SECRET_KEY=your_secret_key
CLIENT_URL=http://localhost:5173
BASE_URL=http://localhost:8000
```

**Generation Tips:**
```bash
# Generate strong JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend (.env.local)

**Required Variables:**
```env
VITE_API_URL=http://localhost:8000
```

**Important:**
- Only `VITE_` prefixed variables are exposed to browser
- Never put API keys or secrets here
- Frontend variables are visible in compiled bundle

---

## Security Checklist

### ✅ Completed

- [x] Rate limiting on auth routes (5 req/15 min)
- [x] Input validation for all APIs
- [x] NoSQL injection sanitization
- [x] XSS prevention (sanitization + CSP)
- [x] CORS whitelist enabled
- [x] CSP headers enabled
- [x] Helmet security headers
- [x] Reduced request size limits (100KB)
- [x] Password complexity requirements
- [x] ObjectId validation
- [x] Environment variable security
- [x] No hardcoded secrets/credentials
- [x] HTTPS headers (HSTS)
- [x] Base URL externalization
- [x] .env files gitignored

### ⚠️ Recommended for Production

- [ ] Use HTTPS/TLS everywhere
- [ ] Enable rate limiting on all routes (optional)
- [ ] Implement request logging & monitoring
- [ ] Set up intrusion detection
- [ ] Use API gateway for additional protection
- [ ] Implement API versioning
- [ ] Add request signing
- [ ] Use secrets manager (AWS Secrets, Vault)
- [ ] Implement audit logging
- [ ] Enable MongoDB authentication
- [ ] Use IP whitelisting if possible
- [ ] Implement bot detection/CAPTCHA
- [ ] Add authentication headers validation
- [ ] Implement refresh token rotation
- [ ] Add request fingerprinting

---

## Testing Security

### Rate Limiting Test
```bash
# Should succeed
curl -X POST http://localhost:8000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Pass123"}'

# After 5 attempts, should return 429
curl -X POST http://localhost:8000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Pass123"}'
```

### Input Validation Test
```bash
# Invalid email - should fail
curl -X POST http://localhost:8000/users/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","password":"Pass123"}'

# Weak password - should fail
curl -X POST http://localhost:8000/users/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"weak"}'

# NoSQL injection - should be sanitized
curl -X GET "http://localhost:8000/products/{ \"\$ne\": null }"
```

### CORS Test
```bash
# From unauthorized origin - should be blocked
curl -X GET http://localhost:8000/health \
  -H "Origin: http://attacker.com"
```

---

## Vulnerability Status

### Fixed

| Vulnerability | Severity | Solution |
|---|---|---|
| No rate limiting | HIGH | express-rate-limit on auth routes |
| Missing input validation | HIGH | express-validator middleware |
| Open CORS | HIGH | Whitelist-based CORS |
| No NoSQL injection protection | MEDIUM | Input sanitization middleware |
| Disabled CSP | MEDIUM | Strict CSP policy enabled |
| Large payload limits | MEDIUM | Reduced to 100KB |
| Hardcoded localhost URLs | MEDIUM | Environment variable configuration |
| Weak password policy | LOW | Complexity requirements added |

### Remaining Risks

| Risk | Mitigation |
|---|---|
| **Transport Security** | Deploy with HTTPS/TLS in production |
| **Database Security** | Enable MongoDB user authentication |
| **API Key Exposure** | Use secure key management system |
| **Session Hijacking** | Use secure, HttpOnly, SameSite cookies |
| **Lateral Movement** | Implement principle of least privilege |

---

## Deployment Checklist

Before deploying to production:

1. **Environment Variables**
   - [ ] Set `NODE_ENV=production`
   - [ ] Change `CLIENT_URL` to production domain
   - [ ] Use strong JWT secret (32+ chars)
   - [ ] Update `BASE_URL` to production URL
   - [ ] Enable HTTPS in MongoDB URI
   - [ ] Store secrets in environment management system

2. **HTTPS/TLS**
   - [ ] Install SSL certificate
   - [ ] Redirect HTTP to HTTPS
   - [ ] Set CORS origins to HTTPS domains

3. **Database Security**
   - [ ] Enable MongoDB authentication
   - [ ] Use IP whitelisting in connection string
   - [ ] Regular backups enabled

4. **Monitoring**
   - [ ] Set up error logging
   - [ ] Monitor rate limit hits
   - [ ] Track failed authentication attempts
   - [ ] Monitor file uploads

5. **API Security**
   - [ ] Test rate limiting
   - [ ] Verify input validation
   - [ ] Test CORS restrictions
   - [ ] Check CSP headers in browser dev tools

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)
- [Helmet.js Documentation](https://helmetjs.github.io/)

---

**Last Updated:** April 2026

**Status:** ✅ Security Implementation Complete
