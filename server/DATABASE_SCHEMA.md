# FLIRT Database Schema Documentation

## Overview
PostgreSQL database schema for the FLIRT (Finding and Locating Items to Return to Their rightful owners) Lost and Found system.

---

## Database Design Principles

- **Normalization:** 3NF (Third Normal Form)
- **Referential Integrity:** Foreign keys with CASCADE
- **Data Validation:** CHECK constraints
- **Performance:** Strategic indexing
- **Audit Trail:** Automatic timestamps
- **Security:** Password hashing, role-based access

---

## Tables

### 1. Users Table

Stores user account information for students, staff, and administrators.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'student',
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  CONSTRAINT users_role_check CHECK (role IN ('student', 'admin', 'staff')),
  CONSTRAINT users_status_check CHECK (status IN ('active', 'suspended', 'deleted')),
  CONSTRAINT users_name_length CHECK (length(trim(name)) >= 2)
);
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing user ID |
| name | VARCHAR(100) | NOT NULL | User's full name (min 2 chars) |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email address (validated format) |
| password | VARCHAR(255) | NOT NULL | bcrypt hashed password |
| role | VARCHAR(50) | NOT NULL, DEFAULT 'student' | User role (student/admin/staff) |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'active' | Account status (active/suspended/deleted) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW | Account creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW | Last update timestamp |

**Constraints:**
- `users_email_format`: Email must match valid format
- `users_role_check`: Role must be 'student', 'admin', or 'staff'
- `users_status_check`: Status must be 'active', 'suspended', or 'deleted'
- `users_name_length`: Name must be at least 2 characters

**Indexes:**
- `idx_users_email`: On LOWER(email) for case-insensitive searches
- `idx_users_role`: On role for filtering
- `idx_users_status`: On status for filtering
- `idx_users_created_at`: On created_at DESC for sorting

---

### 2. Items Table

Stores reported lost and found items.

```sql
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  image_url VARCHAR(500),
  claim_status VARCHAR(50) NOT NULL DEFAULT 'unclaimed',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  CONSTRAINT items_user_fk FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  
  -- Constraints
  CONSTRAINT items_category_check CHECK (category IN ('electronics', 'clothing', 'accessories', 'bags', 'keys', 'books', 'other')),
  CONSTRAINT items_status_check CHECK (status IN ('lost', 'found')),
  CONSTRAINT items_claim_status_check CHECK (claim_status IN ('unclaimed', 'claimed')),
  CONSTRAINT items_name_length CHECK (length(trim(name)) >= 3),
  CONSTRAINT items_description_length CHECK (length(trim(description)) >= 10),
  CONSTRAINT items_location_length CHECK (length(trim(location)) >= 3),
  CONSTRAINT items_date_not_future CHECK (date <= CURRENT_DATE)
);
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing item ID |
| user_id | INTEGER | NOT NULL, FK | Reporter's user ID |
| name | VARCHAR(255) | NOT NULL | Item name (min 3 chars) |
| description | TEXT | NOT NULL | Item description (min 10 chars) |
| category | VARCHAR(100) | NOT NULL | Item category |
| status | VARCHAR(50) | NOT NULL | Lost or found |
| location | VARCHAR(255) | NOT NULL | Where item was lost/found (min 3 chars) |
| date | DATE | NOT NULL | When item was lost/found (not future) |
| image_url | VARCHAR(500) | NULLABLE | Path to uploaded image |
| claim_status | VARCHAR(50) | NOT NULL, DEFAULT 'unclaimed' | Whether item is claimed |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW | Report creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW | Last update timestamp |

**Foreign Keys:**
- `items_user_fk`: user_id → users(id) [CASCADE DELETE/UPDATE]

**Constraints:**
- `items_category_check`: Must be electronics, clothing, accessories, bags, keys, books, or other
- `items_status_check`: Must be 'lost' or 'found'
- `items_claim_status_check`: Must be 'unclaimed' or 'claimed'
- `items_name_length`: Name must be at least 3 characters
- `items_description_length`: Description must be at least 10 characters
- `items_location_length`: Location must be at least 3 characters
- `items_date_not_future`: Date cannot be in the future

**Indexes:**
- `idx_items_user_id`: On user_id for filtering by reporter
- `idx_items_category`: On category for filtering
- `idx_items_status`: On status for filtering (lost/found)
- `idx_items_claim_status`: On claim_status for filtering
- `idx_items_location`: On location for searching
- `idx_items_date`: On date DESC for sorting
- `idx_items_created_at`: On created_at DESC for sorting
- `idx_items_search`: Full-text search on name + description (GIN index)

---

### 3. Claims Table

Stores ownership claims for items.

```sql
CREATE TABLE claims (
  id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL,
  claimant_id INTEGER NOT NULL,
  verification_message TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  CONSTRAINT claims_item_fk FOREIGN KEY (item_id) 
    REFERENCES items(id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  
  CONSTRAINT claims_claimant_fk FOREIGN KEY (claimant_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  
  -- Constraints
  CONSTRAINT claims_status_check CHECK (status IN ('pending', 'approved', 'rejected')),
  CONSTRAINT claims_verification_length CHECK (length(trim(verification_message)) >= 10),
  
  -- Unique constraint: one user can only have one claim per item
  CONSTRAINT claims_unique_user_item UNIQUE (item_id, claimant_id)
);
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing claim ID |
| item_id | INTEGER | NOT NULL, FK | ID of claimed item |
| claimant_id | INTEGER | NOT NULL, FK | ID of user claiming item |
| verification_message | TEXT | NOT NULL | Proof of ownership (min 10 chars) |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'pending' | Claim status |
| admin_notes | TEXT | NULLABLE | Admin's verification notes |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW | Claim submission timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW | Last update timestamp |

**Foreign Keys:**
- `claims_item_fk`: item_id → items(id) [CASCADE DELETE/UPDATE]
- `claims_claimant_fk`: claimant_id → users(id) [CASCADE DELETE/UPDATE]

**Constraints:**
- `claims_status_check`: Must be 'pending', 'approved', or 'rejected'
- `claims_verification_length`: Verification message must be at least 10 characters
- `claims_unique_user_item`: One user can only submit one claim per item

**Indexes:**
- `idx_claims_item_id`: On item_id for filtering by item
- `idx_claims_claimant_id`: On claimant_id for filtering by claimant
- `idx_claims_status`: On status for filtering
- `idx_claims_created_at`: On created_at DESC for sorting

---

## Relationships

### Entity Relationship Diagram

```
┌──────────────┐
│    USERS     │
│              │
│ • id (PK)    │
│ • name       │
│ • email      │
│ • password   │
│ • role       │
│ • status     │
└──────┬───────┘
       │
       │ 1:N (reporter)
       │
       ▼
┌──────────────┐         ┌──────────────┐
│    ITEMS     │    N:1  │   CLAIMS     │
│              │◄────────│              │
│ • id (PK)    │         │ • id (PK)    │
│ • user_id(FK)│         │ • item_id(FK)│
│ • name       │         │ • claimant_id│
│ • category   │         │ • status     │
│ • status     │         │ • proof      │
└──────────────┘         └──────┬───────┘
                                │
                                │ N:1 (claimant)
                                │
                         ┌──────▼───────┐
                         │    USERS     │
                         └──────────────┘
```

### Relationship Details

**Users → Items (1:N)**
- One user can report many items
- Foreign key: items.user_id → users.id
- CASCADE: Deleting user deletes their items

**Items → Claims (1:N)**
- One item can have many claims
- Foreign key: claims.item_id → items.id
- CASCADE: Deleting item deletes all claims

**Users → Claims (1:N)**
- One user can make many claims
- Foreign key: claims.claimant_id → users.id
- CASCADE: Deleting user deletes their claims

**Business Rule:**
- One user can only make one claim per item (UNIQUE constraint)

---

## Triggers

### Automatic Updated_at Trigger

Automatically updates the `updated_at` timestamp on any UPDATE operation.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claims_updated_at
  BEFORE UPDATE ON claims
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## Sample Data

### Insert Sample User
```sql
INSERT INTO users (name, email, password, role) 
VALUES ('John Doe', 'john.doe@ccis.edu', '$2b$12$hashedpassword...', 'student');
```

### Insert Sample Item
```sql
INSERT INTO items (user_id, name, description, category, status, location, date) 
VALUES (
  1, 
  'iPhone 13', 
  'Silver iPhone with blue case', 
  'electronics', 
  'lost', 
  'Library 2nd Floor', 
  '2025-10-14'
);
```

### Insert Sample Claim
```sql
INSERT INTO claims (item_id, claimant_id, verification_message) 
VALUES (
  1, 
  2, 
  'This is my phone. It has my photos and my name in settings.'
);
```

---

## Common Queries

### Get all lost items with reporter info
```sql
SELECT i.*, u.name as reporter_name, u.email as reporter_email
FROM items i
JOIN users u ON i.user_id = u.id
WHERE i.status = 'lost' AND i.claim_status = 'unclaimed'
ORDER BY i.created_at DESC;
```

### Get pending claims for an item
```sql
SELECT c.*, u.name as claimant_name, u.email as claimant_email
FROM claims c
JOIN users u ON c.claimant_id = u.id
WHERE c.item_id = 1 AND c.status = 'pending'
ORDER BY c.created_at ASC;
```

### Get user's reported items
```sql
SELECT * FROM items 
WHERE user_id = 1 
ORDER BY created_at DESC;
```

### Get user's claims
```sql
SELECT c.*, i.name as item_name, i.description, i.location
FROM claims c
JOIN items i ON c.item_id = i.id
WHERE c.claimant_id = 1
ORDER BY c.created_at DESC;
```

### Full-text search on items
```sql
SELECT * FROM items
WHERE to_tsvector('english', name || ' ' || description) @@ to_tsquery('english', 'phone')
ORDER BY created_at DESC;
```

---

## Database Maintenance

### Backup Database
```bash
pg_dump -U postgres -d flirt_db -F c -f flirt_backup.dump
```

### Restore Database
```bash
pg_restore -U postgres -d flirt_db -c flirt_backup.dump
```

### Vacuum and Analyze
```sql
VACUUM ANALYZE users;
VACUUM ANALYZE items;
VACUUM ANALYZE claims;
```

### Check Table Sizes
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Performance Optimization

### Index Usage Analysis
```sql
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### Slow Query Analysis
```sql
-- Enable pg_stat_statements extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- View slow queries
SELECT 
  mean_exec_time,
  calls,
  query
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

---

## Security Considerations

1. **Password Storage**
   - Never store plain text passwords
   - Use bcrypt with cost factor 12+
   - Hash before INSERT/UPDATE

2. **SQL Injection Prevention**
   - Use parameterized queries
   - Never concatenate user input
   - Validate all inputs

3. **Access Control**
   - Use role-based permissions
   - Implement row-level security if needed
   - Audit sensitive operations

4. **Data Encryption**
   - Use SSL/TLS for connections
   - Encrypt sensitive data at rest
   - Secure backups

---

## Migration Strategy

### Adding New Columns
```sql
ALTER TABLE items ADD COLUMN verified BOOLEAN DEFAULT false;
```

### Adding New Constraints
```sql
ALTER TABLE items ADD CONSTRAINT items_verified_by_admin 
  CHECK (verified = false OR user_id IS NOT NULL);
```

### Creating New Indexes
```sql
CREATE INDEX idx_items_verified ON items(verified) WHERE verified = true;
```

---

## Database Connection

### Connection String Format
```
postgresql://username:password@host:port/database
```

### Example Connection
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'flirt_db',
  user: 'postgres',
  password: 'your_password',
  max: 20, // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

---

## Initialization

### Run Database Initialization
```bash
cd server
npm run init-db
```

### Expected Output
```
✅ UUID extension enabled
✅ Users table created
✅ Items table created
✅ Claims table created
✅ Indexes created
✅ Triggers created
✅ Default admin user created
✨ Database initialization completed successfully!
```

---

## Default Admin Account

After initialization, use these credentials:

- **Email:** admin@flirt.com
- **Password:** Admin123
- **Role:** admin

⚠️ **IMPORTANT:** Change this password immediately in production!

---

## Support

For database-related issues:
1. Check connection settings in `.env`
2. Verify PostgreSQL is running
3. Check database logs
4. Review error messages in console
