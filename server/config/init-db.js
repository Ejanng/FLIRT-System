const { pool } = require('./database');

/**
 * FLIRT Database Schema Initialization
 * Creates all necessary tables, constraints, indexes, and triggers
 */

async function initializeDatabase() {
  const client = await pool.connect();

  try {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   🚀 FLIRT Database Initialization                     ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    // Enable UUID extension (optional but recommended)
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);
    console.log('✅ UUID extension enabled');

    // Drop existing tables if they exist (for clean initialization)
    // Uncomment below lines only if you want to reset the database
    // console.log('\n⚠️  Dropping existing tables...');
    // await client.query('DROP TABLE IF EXISTS claims CASCADE;');
    // await client.query('DROP TABLE IF EXISTS items CASCADE;');
    // await client.query('DROP TABLE IF EXISTS users CASCADE;');
    // console.log('✅ Existing tables dropped');

    console.log('\n📋 Creating tables...\n');

    // ========================================
    // USERS TABLE
    // ========================================
    await client.query(`
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
    `);
    console.log('✅ Users table created');
    console.log('   - Primary key: id (SERIAL)');
    console.log('   - Unique constraint: email');
    console.log('   - Check constraints: email format, role, status, name length');
    console.log('   - Default role: student');
    console.log('   - Default status: active');

    // ========================================
    // ITEMS TABLE
    // ========================================
    await client.query(`
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
    `);
    console.log('✅ Items table created');
    console.log('   - Primary key: id (SERIAL)');
    console.log('   - Foreign key: user_id → users(id) [CASCADE]');
    console.log('   - Check constraints: category, status, claim_status, lengths, date validation');
    console.log('   - Default claim_status: unclaimed');

    // ========================================
    // CLAIMS TABLE
    // ========================================
    await client.query(`
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
    `);
    console.log('✅ Claims table created');
    console.log('   - Primary key: id (SERIAL)');
    console.log('   - Foreign key: item_id → items(id) [CASCADE]');
    console.log('   - Foreign key: claimant_id → users(id) [CASCADE]');
    console.log('   - Check constraints: status, message length');
    console.log('   - Unique constraint: one claim per user per item');
    console.log('   - Default status: pending');

    // ========================================
    // INDEXES FOR PERFORMANCE
    // ========================================
    console.log('\n📊 Creating indexes...\n');

    await client.query(`
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
    `);
    console.log('✅ Users indexes created (email, role, status, created_at)');
    console.log('✅ Items indexes created (user_id, category, status, location, date, full-text search)');
    console.log('✅ Claims indexes created (item_id, claimant_id, status, created_at)');

    // ========================================
    // TRIGGERS FOR AUTOMATIC UPDATED_AT
    // ========================================
    console.log('\n⚡ Creating triggers...\n');

    // Create trigger function
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    console.log('✅ Trigger function created (update_updated_at_column)');

    // Apply triggers to all tables
    await client.query(`
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
    `);
    console.log('✅ Triggers applied to users, items, claims tables');

    // ========================================
    // CREATE DEFAULT ADMIN USER
    // ========================================
    console.log('\n👤 Creating default admin user...\n');

    const bcrypt = require('bcryptjs');
    const defaultAdminPassword = 'Admin123'; // Change in production!
    const hashedPassword = await bcrypt.hash(defaultAdminPassword, 12);

    await client.query(`
      INSERT INTO users (name, email, password, role, status)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING;
    `, ['Admin User', 'admin@flirt.com', hashedPassword, 'admin', 'active']);

    console.log('✅ Default admin user created');
    console.log('   Email: admin@flirt.com');
    console.log('   Password: Admin123');
    console.log('   ⚠️  CHANGE PASSWORD IN PRODUCTION!');

    // ========================================
    // VERIFY TABLE CREATION
    // ========================================
    console.log('\n🔍 Verifying database schema...\n');

    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log('📋 Tables created:');
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    // Get table row counts
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    const itemCount = await client.query('SELECT COUNT(*) FROM items');
    const claimCount = await client.query('SELECT COUNT(*) FROM claims');

    console.log('\n📊 Current database statistics:');
    console.log(`   Users: ${userCount.rows[0].count}`);
    console.log(`   Items: ${itemCount.rows[0].count}`);
    console.log(`   Claims: ${claimCount.rows[0].count}`);

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║   ✨ Database initialization completed successfully!   ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n╔════════════════════════════════════════════════════════╗');
    console.error('║   ❌ Database initialization FAILED                    ║');
    console.error('╚════════════════════════════════════════════════════════╝\n');
    console.error('Error details:', error.message);
    console.error('\nStack trace:', error.stack);
    throw error;
  } finally {
    client.release();
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('👍 Database is ready to use!\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Fatal error during initialization:', error.message);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };
