# FLIRT Backend Setup Guide

## Prerequisites

Before setting up the FLIRT backend, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

## Installation Steps

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Database Setup

#### Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE flirt_db;

# Exit psql
\q
```

#### Initialize Database Schema

Run the SQL schema file to create all necessary tables:

```bash
psql -U postgres -d flirt_db -f SQL_QUERIES.sql
```

Or manually run the schema from `SQL_QUERIES.sql` in your PostgreSQL client.

### 3. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and update the following variables:

```env
# Database credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=flirt_db
DB_USER=postgres
DB_PASSWORD=your_actual_password

# JWT Secret (use a secure random string)
JWT_SECRET=generate_a_secure_random_string_here

# Server port
PORT=5000
```

**Important:** Never commit your `.env` file to version control!

### 4. Create Upload Directory

```bash
mkdir uploads
```

This directory will store uploaded item images.

### 5. Start the Server

#### Development Mode (with auto-reload)

```bash
npm run dev
```

#### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## Testing the API

### Test Database Connection

```bash
node config/init-db.js
```

This should display database connection information if successful.

### API Endpoints

The backend provides the following routes:

- **Items API**: `http://localhost:5000/api/items`
- **Users API**: `http://localhost:5000/api/users`
- **Claims API**: `http://localhost:5000/api/claims`
- **Admin API**: `http://localhost:5000/api/admin`

See `TEST_API.md` for detailed endpoint documentation.

## Common Issues

### Port Already in Use

If port 5000 is already in use, change the `PORT` in your `.env` file:

```env
PORT=5001
```

### Database Connection Failed

1. Check PostgreSQL is running:
   ```bash
   sudo service postgresql status
   ```

2. Verify database credentials in `.env`

3. Ensure the database exists:
   ```bash
   psql -U postgres -l
   ```

### Permission Denied for Uploads

```bash
chmod 755 uploads/
```

## Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a secure random string
- [ ] Update `DB_PASSWORD` to a strong password
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper CORS origins
- [ ] Enable HTTPS
- [ ] Review and adjust rate limiting settings
- [ ] Set up proper database backups
- [ ] Configure environment-specific logging

## Development Tips

### Watch for Changes

The development server uses nodemon to automatically restart on file changes.

### View Logs

Logs are written to the console. For production, consider using a logging service.

### Database Migrations

When schema changes are needed:

1. Update `SQL_QUERIES.sql`
2. Create a migration script
3. Test on development database first
4. Document the changes

## Next Steps

- Read `AUTHENTICATION.md` for user authentication details
- Read `CLAIMS_API.md` for claims management
- Read `DATABASE_SCHEMA.md` for database structure
- Check `TEST_API.md` for API testing examples

## Support

For issues or questions about the FLIRT backend setup, please check the documentation files in the `/server` directory or create an issue in the project repository.
