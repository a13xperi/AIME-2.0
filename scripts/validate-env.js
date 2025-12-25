#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * Validates that all required environment variables are set before running the app
 */

const requiredEnvVars = {
  // Required for all environments
  common: [],

  // Required for development
  development: [
    'NOTION_API_KEY',
    'NOTION_PROJECTS_DATABASE_ID',
    'NOTION_SESSIONS_DATABASE_ID',
    'REACT_APP_API_URL',
    'PORT'
  ],

  // Required for production
  production: [
    'NOTION_API_KEY',
    'NOTION_PROJECTS_DATABASE_ID',
    'NOTION_SESSIONS_DATABASE_ID',
    'REACT_APP_API_URL'
  ],

  // Required for testing
  test: []
};

const optionalEnvVars = [
  'DEBUG',
  'LOG_LEVEL',
  'ALLOWED_ORIGINS'
];

function validateEnv() {
  const env = process.env.NODE_ENV || 'development';
  const errors = [];
  const warnings = [];

  console.log(`\n🔍 Validating environment variables for: ${env}\n`);

  // Check required variables
  const required = [
    ...requiredEnvVars.common,
    ...(requiredEnvVars[env] || [])
  ];

  for (const varName of required) {
    if (!process.env[varName]) {
      errors.push(`❌ Missing required: ${varName}`);
    } else {
      // Mask sensitive values
      const value = varName.includes('KEY') || varName.includes('TOKEN') || varName.includes('SECRET')
        ? '***masked***'
        : process.env[varName];
      console.log(`✅ ${varName}: ${value}`);
    }
  }

  // Check optional variables
  console.log('\n📋 Optional variables:');
  for (const varName of optionalEnvVars) {
    if (process.env[varName]) {
      console.log(`  ✓ ${varName}: ${process.env[varName]}`);
    } else {
      console.log(`  - ${varName}: (not set)`);
    }
  }

  // Report results
  console.log('\n');

  if (errors.length > 0) {
    console.error('🚫 Environment validation failed:\n');
    errors.forEach(err => console.error(`  ${err}`));
    console.error('\n💡 Tip: Copy .env.example to .env and fill in the values\n');
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn('⚠️  Warnings:\n');
    warnings.forEach(warn => console.warn(`  ${warn}`));
    console.warn('\n');
  }

  console.log('✅ Environment validation passed!\n');
  process.exit(0);
}

// Load dotenv if available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not installed, that's okay
}

validateEnv();
