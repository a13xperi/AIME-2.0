#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * Run this before starting the server to ensure all required env vars are set
 *
 * Usage: node validate-env.js [all|server|client]
 */

const requiredVars = {
  server: [
    'NOTION_TOKEN',
    'NOTION_PROJECTS_DATABASE_ID',
    'NOTION_SESSIONS_DATABASE_ID'
  ],
  client: [
    'REACT_APP_API_URL'
  ]
};

const optionalVars = {
  server: ['PORT', 'ALLOWED_ORIGINS', 'NODE_ENV', 'DEBUG', 'LOG_LEVEL'],
  client: []
};

function validateEnv(type = 'all') {
  const missing = [];
  const warnings = [];

  const varsToCheck = type === 'server' ? requiredVars.server :
                      type === 'client' ? requiredVars.client :
                      [...requiredVars.server, ...requiredVars.client];

  const env = process.env.NODE_ENV || 'development';
  console.log(`\n🔍 Validating environment variables for: ${env}\n`);

  // Check required variables
  varsToCheck.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    } else {
      // Mask sensitive values
      const value = varName.includes('TOKEN') || varName.includes('KEY') || varName.includes('SECRET')
        ? '***masked***'
        : process.env[varName];
      console.log(`✅ ${varName}: ${value}`);
    }
  });

  // Check optional variables
  const optionalToCheck = type === 'server' ? optionalVars.server :
                          type === 'client' ? optionalVars.client :
                          [...optionalVars.server, ...optionalVars.client];

  console.log('\n📋 Optional variables:');
  optionalToCheck.forEach(varName => {
    if (process.env[varName]) {
      console.log(`  ✓ ${varName}: ${process.env[varName]}`);
    } else {
      console.log(`  - ${varName}: (not set)`);
      warnings.push(varName);
    }
  });

  // Report results
  console.log('\n');

  if (missing.length > 0) {
    console.error('🚫 Missing required environment variables:\n');
    missing.forEach(varName => console.error(`   ❌ ${varName}`));
    console.error('\n💡 Tip: Copy .env.example to .env and fill in the values\n');
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn('⚠️  Some optional variables not set (using defaults)\n');
  }

  console.log('✅ Environment validation passed!\n');
  console.log(`   Environment: ${env}`);
  console.log(`   Port: ${process.env.PORT || '3001'}`);
  if (type === 'all' || type === 'server') {
    console.log(`   Notion: ${process.env.NOTION_TOKEN ? 'Configured' : 'Missing'}`);
  }
  if (type === 'all' || type === 'client') {
    console.log(`   API URL: ${process.env.REACT_APP_API_URL || 'Not set'}`);
  }
  console.log('');
}

// Parse command line args
const args = process.argv.slice(2);
const type = args[0] || 'all';

if (!['all', 'server', 'client'].includes(type)) {
  console.error('Usage: node validate-env.js [all|server|client]');
  process.exit(1);
}

// Load dotenv if available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not installed, that's okay in some environments
}

validateEnv(type);
