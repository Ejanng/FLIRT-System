-- ============================================
-- FLIRT Database Schema
-- PostgreSQL Complete SQL Script
-- ============================================

-- Enable UUID extension (optional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS users (
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

COMMENT ON TABLE users IS 'Stores user account information for students, staff, and administrators';
COMMENT ON COLUMN users.id IS 'Auto-incrementing primary key';
COMMENT ON COLUMN users.email IS 'Unique email address (validated format)';
COMMENT ON COLUMN users.password IS 'bcrypt hashed password (never store plain text)';
COMMENT ON COLUMN users.role IS 'User role: student, admin, or staff';
COMMENT ON COLUMN users.status IS 'Account status: active, suspended, or deleted';

-- ============================================
-- ITEMS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS items (
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

COMMENT ON TABLE items IS 'Stores reported lost and found items';
COMMENT ON COLUMN items.user_id IS 'ID of user who reported the item';
COMMENT ON COLUMN items.status IS 'Whether item is lost or found';
COMMENT ON COLUMN items.claim_status IS 'Whether item has been claimed (unclaimed/claimed)';
COMMENT ON COLUMN items.image_url IS 'Path to uploaded image file';

-- ============================================
-- CLAIMS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS claims (
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

COMMENT ON TABLE claims IS 'Stores ownership claims for lost/found items';
COMMENT ON COLUMN claims.verification_message IS 'Claimant\'s proof of ownership message';
COMMENT ON COLUMN claims.status IS 'Claim status: pending, approved, or rejected';
COMMENT ON COLUMN claims.admin_notes IS 'Admin\'s notes about verification decision';

-- ============================================
-- INDEXES
-- ============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Items indexes
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_claim_status ON items(claim_status);
CREATE INDEX IF NOT EXISTS idx_items_location ON items(location);
CREATE INDEX IF NOT EXISTS idx_items_date ON items(date DESC);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_items_search ON items USING gin(to_tsvector('english', name || ' ' || description));

-- Claims indexes
CREATE INDEX IF NOT EXISTS idx_claims_item_id ON claims(item_id);
CREATE INDEX IF NOT EXISTS idx_claims_claimant_id ON claims(claimant_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
CREATE INDEX IF NOT EXISTS idx_claims_created_at ON claims(created_at DESC);

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_items_updated_at ON items;
CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_claims_updated_at ON claims;
CREATE TRIGGER update_claims_updated_at
  BEFORE UPDATE ON claims
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================

-- Insert sample admin user (password: Admin123)
-- INSERT INTO users (name, email, password, role, status)
-- VALUES ('Admin User', 'admin@flirt.com', '$2b$12$hashed_password_here', 'admin', 'active');

-- Insert sample student users
-- INSERT INTO users (name, email, password, role) VALUES
-- ('Alice Johnson', 'alice@ccis.edu', '$2b$12$hashed_password', 'student'),
-- ('Bob Smith', 'bob@ccis.edu', '$2b$12$hashed_password', 'student'),
-- ('Carol Davis', 'carol@ccis.edu', '$2b$12$hashed_password', 'student');

-- Insert sample lost items
-- INSERT INTO items (user_id, name, description, category, status, location, date) VALUES
-- (2, 'iPhone 13', 'Silver iPhone with blue case', 'electronics', 'lost', 'Library 2nd Floor', '2025-10-14'),
-- (3, 'Black Backpack', 'North Face black backpack with laptop', 'bags', 'found', 'CS Building Room 101', '2025-10-13'),
-- (2, 'Textbook', 'Data Structures textbook with notes', 'books', 'lost', 'Cafeteria', '2025-10-12');

-- Insert sample claims
-- INSERT INTO claims (item_id, claimant_id, verification_message) VALUES
-- (1, 3, 'This is my iPhone. It has my photos and my name in settings.'),
-- (2, 2, 'This is my backpack. It has my student ID in the front pocket.');

-- ============================================
-- USEFUL QUERIES
-- ============================================

-- Get all unclaimed lost items
-- SELECT i.*, u.name as reporter_name 
-- FROM items i
-- JOIN users u ON i.user_id = u.id
-- WHERE i.status = 'lost' AND i.claim_status = 'unclaimed'
-- ORDER BY i.created_at DESC;

-- Get pending claims with item details
-- SELECT c.*, i.name as item_name, i.description,
--        claimant.name as claimant_name,
--        reporter.name as reporter_name
-- FROM claims c
-- JOIN items i ON c.item_id = i.id
-- JOIN users claimant ON c.claimant_id = claimant.id
-- JOIN users reporter ON i.user_id = reporter.id
-- WHERE c.status = 'pending'
-- ORDER BY c.created_at ASC;

-- Search items by keyword
-- SELECT * FROM items
-- WHERE to_tsvector('english', name || ' ' || description) 
--       @@ to_tsquery('english', 'phone')
-- ORDER BY created_at DESC;

-- User's activity summary
-- SELECT 
--   u.id,
--   u.name,
--   u.email,
--   COUNT(DISTINCT i.id) as items_reported,
--   COUNT(DISTINCT c.id) as claims_made
-- FROM users u
-- LEFT JOIN items i ON u.id = i.user_id
-- LEFT JOIN claims c ON u.id = c.claimant_id
-- WHERE u.id = 1
-- GROUP BY u.id, u.name, u.email;
