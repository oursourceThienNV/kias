#!/usr/bin/env node

/**
 * Create Admin User in EverShop Database
 */

import pkg from 'pg';
const { Client } = pkg;
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  console.log('🔐 Creating admin user...\n');
  
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'evershop',
    user: 'postgres',
    password: 'postgres'
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Check if admin_user table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_user'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('❌ admin_user table does not exist. Run migrations first.');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await client.query(
      'SELECT email FROM admin_user WHERE email = $1',
      ['admin@admin.com']
    );

    if (existingAdmin.rows.length > 0) {
      console.log('ℹ️  Admin user already exists. Updating password...');
      
      // Update password
      const hashedPassword = await bcrypt.hash('123456a@', 10);
      await client.query(
        'UPDATE admin_user SET password = $1 WHERE email = $2',
        [hashedPassword, 'admin@admin.com']
      );
      
      console.log('✅ Admin password updated!');
    } else {
      console.log('📝 Creating new admin user...');
      
      // Create new admin
      const hashedPassword = await bcrypt.hash('123456a@', 10);
      const result = await client.query(`
        INSERT INTO admin_user (uuid, status, email, password, full_name)
        VALUES (gen_random_uuid(), true, $1, $2, $3)
        RETURNING admin_user_id, email, full_name
      `, ['admin@admin.com', hashedPassword, 'Admin User']);
      
      console.log('✅ Admin user created!');
      console.log('   Email:', result.rows[0].email);
      console.log('   Name:', result.rows[0].full_name);
    }

    console.log('\n📋 Login credentials:');
    console.log('   Email: admin@admin.com');
    console.log('   Password: 123456a@');
    console.log('   URL: http://localhost:3000/admin\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createAdminUser();

