#!/usr/bin/env node

/**
 * Reset Admin Password - Update admin password in EverShop database
 */

import bcrypt from 'bcrypt';
import { Client } from 'pg';

async function resetAdminPassword() {
  console.log('🔐 Resetting admin password...');
  
  const client = new Client({
    host: 'localhost',
    port: 5433,
    database: 'hapas_ecommerce',
    user: 'hapas',
    password: 'hapasdev123'
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Generate new password hash
    const newPassword = '123456a@';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    console.log(`🔑 New password: ${newPassword}`);
    console.log(`🔒 Hashed password: ${hashedPassword}`);
    
    // Update admin user password
    const updateQuery = 'UPDATE admin_user SET password = $1 WHERE email = $2';
    const result = await client.query(updateQuery, [hashedPassword, 'admin@admin.com']);
    
    if (result.rowCount > 0) {
      console.log('✅ Admin password updated successfully!');
      console.log('📧 Email: admin@admin.com');
      console.log('🔑 Password: 123456a@');
    } else {
      console.log('❌ No admin user found with email admin@admin.com');
    }
    
  } catch (error) {
    console.error('❌ Error resetting password:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Run the script
resetAdminPassword();
