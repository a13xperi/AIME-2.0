#!/usr/bin/env node
/**
 * Environment Variable Validation Script
 * Run this before starting the server to ensure all required env vars are set
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
  server: ['PORT', 'ALLOWED_ORIGINS', 'NODE_ENV'],
  client: []
};

function validateEnv(type = 'all') {
  const missing = [];
  const warnings = [];
  
  const varsToCheck = type === 'server' ? requiredVars.server : 
                      type === 'client' ? requiredVars.client :
                      [...requiredVars.server, ...requiredVars.client];
  
  // Check required variables
  varsToCheck.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });
  
  // Check optional variables
  const optionalToCheck = type === 'server' ? optionalVars.server :
                          type === 'client' ? optionalVars.client :
                          [...optionalVars.server, ...optionalVars.client];
  
  optionalToCheck.forEach(varName => {
    if (!process.env[varName]) {
      warnings.push(varName);
    }
  });
  
  // Report results
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    console.error('\n📝 Please set these in your .env file or environment');
    process.exit(1);
  }
  
  if (warnings.length > 0) {
    console.warn('⚠️  Optional environment variables not set (using defaults):');
    warnings.forEach(varName => console.warn(`   - ${varName}`));
    console.warn('');
  }
  
  console.log('✅ Environment validation passed!');
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Port: ${process.env.PORT || '3001'}`);
  if (type === 'all' || type === 'server') {
    console.log(`   Notion: ${process.env.NOTION_TOKEN ? 'Configured' : 'Missing'}`);
  }
  if (type === 'all' || type === 'client') {
    console.log(`   API URL: ${process.env.REACT_APP_API_URL || 'Not set'}`);
  }
}

// Parse command line args
const args = process.argv.slice(2);
const type = args[0] || 'all';

if (!['all', 'server', 'client'].includes(type)) {
  console.error('Usage: node validate-env.js [all|server|client]');
  process.exit(1);
}

// Run validation
require('dotenv').config();
validateEnv(type);
