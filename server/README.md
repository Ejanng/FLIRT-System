# FLIRT Backend Server

Backend API for the FLIRT (Finding and Locating lost Items to Return to Their rightful owners) Lost and Found System.

## 📁 Folder Structure

```
server/
├── config/
│   ├── database.js         # PostgreSQL configuration and connection pool
│   └── init-db.js          # Database initialization script
├── controllers/
│   ├── adminController.js  # Admin dashboard and management logic
│   ├── claimController.js  # Claim processing logic
│   ├── itemController.js   # Lost/Found items logic
│   └── userController.js   # User authentication and profile logic
├── middleware/
│   ├── auth.js             # JWT authentication and authorization
│   ├── errorHandler.js     # Global error handling
│   └── validator.js        # Request validation middleware
├── routes/
│   ├── adminRoutes.js      # /api/admin endpoints
│   ├── claimRoutes.js      # /api/claims endpoints
│   ├── itemRoutes.js       # /api/items endpoints
│   └── userRoutes.js       # /api/users endpoints
├── .env.example            # Environment variables template
├── package.json            # Dependencies and scripts
├── README.md               # This file
└── server.js               # Main application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your database credentials and settings.

3. **Initialize the database:**
   ```bash
   npm run init-db
   ```

4. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📋 API Endpoints

### Authentication (`/api/users`)
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (auth required)
- `PUT /api/users/profile` - Update user profile (auth required)
- `PUT /api/users/change-password` - Change password (auth required)
- `GET /api/users/stats` - Get user statistics (auth required)

### Items (`/api/items`)
- `GET /api/items` - Get all items (with filters)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item (auth required)
- `PUT /api/items/:id` - Update item (auth required)
- `DELETE /api/items/:id` - Delete item (auth required)
- `GET /api/items/user/my-items` - Get user's items (auth required)

### Claims (`/api/claims`)
- `POST /api/claims` - Create new claim (auth required)
- `GET /api/claims` - Get all claims (auth required)
- `GET /api/claims/:id` - Get single claim (auth required)
- `PUT /api/claims/:id/status` - Update claim status (admin only)
- `DELETE /api/claims/:id` - Delete claim (auth required)

### Admin (`/api/admin`)
- `GET /api/admin/dashboard` - Get dashboard statistics (admin only)
- `GET /api/admin/analytics` - Get analytics data (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/:id/status` - Update user status (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- `PUT /api/admin/reports/:id/verify` - Verify report (admin only)

### Health Check
- `GET /health` - Server health status
- `GET /` - API information

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## 🗄️ Database Schema

### Users Table
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- email (VARCHAR UNIQUE)
- password (VARCHAR - hashed)
- role (VARCHAR - 'student' or 'admin')
- status (VARCHAR - 'active' or 'suspended')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Items Table
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER FK)
- name (VARCHAR)
- description (TEXT)
- category (VARCHAR)
- status (VARCHAR - 'lost' or 'found')
- location (VARCHAR)
- date (DATE)
- image_url (VARCHAR)
- claim_status (VARCHAR - 'claimed' or 'unclaimed')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Claims Table
```sql
- id (SERIAL PRIMARY KEY)
- item_id (INTEGER FK)
- claimant_id (INTEGER FK)
- verification_message (TEXT)
- status (VARCHAR - 'pending', 'approved', 'rejected')
- admin_notes (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🔧 Environment Variables

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=flirt_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

## 🛡️ Security Features

- Helmet.js for security headers
- CORS protection
- JWT authentication
- Password hashing with bcrypt
- SQL injection prevention (parameterized queries)
- Input validation
- Error handling without exposing sensitive data

## 📝 Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Initialize database
npm run init-db
```

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Validate all inputs
4. Write meaningful commit messages
5. Test endpoints before committing

## 📄 License

MIT License - FLIRT Team
