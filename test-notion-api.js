#!/usr/bin/env node

/**
 * Notion API Connection Test
 * Run this script to test your Notion API connection
 */

const { Client } = require('@notionhq/client');
require('dotenv').config();

async function testNotionConnection() {
  console.log('🔍 Testing Notion API Connection...\n');

  // Check environment variables
  const apiKey = process.env.NOTION_API_KEY;
  const projectsDbId = process.env.PROJECTS_DATABASE_ID;
  const sessionsDbId = process.env.SESSIONS_DATABASE_ID;

  if (!apiKey) {
    console.error('❌ NOTION_API_KEY not found in environment variables');
    console.log('💡 Make sure you have a .env file with your Notion API key');
    process.exit(1);
  }

  if (!projectsDbId) {
    console.error('❌ PROJECTS_DATABASE_ID not found in environment variables');
    process.exit(1);
  }

  if (!sessionsDbId) {
    console.error('❌ SESSIONS_DATABASE_ID not found in environment variables');
    process.exit(1);
  }

  console.log('✅ Environment variables found');
  console.log(`📊 Projects DB ID: ${projectsDbId}`);
  console.log(`📝 Sessions DB ID: ${sessionsDbId}\n`);

  // Initialize Notion client
  const notion = new Client({
    auth: apiKey,
  });

  try {
    // Test 1: Check API key validity
    console.log('🔑 Testing API key validity...');
    const user = await notion.users.me();
    console.log(`✅ API key is valid. Connected as: ${user.name || 'Unknown'}\n`);

    // Test 2: Check projects database
    console.log('📊 Testing projects database access...');
    const projectsResponse = await notion.databases.query({
      database_id: projectsDbId,
      page_size: 1,
    });
    console.log(`✅ Projects database accessible. Found ${projectsResponse.results.length} record(s)\n`);

    // Test 3: Check sessions database
    console.log('📝 Testing sessions database access...');
    const sessionsResponse = await notion.databases.query({
      database_id: sessionsDbId,
      page_size: 1,
    });
    console.log(`✅ Sessions database accessible. Found ${sessionsResponse.results.length} record(s)\n`);

    // Test 4: Check database properties
    console.log('🔍 Checking database properties...');
    const projectsDb = await notion.databases.retrieve({
      database_id: projectsDbId,
    });
    console.log(`📊 Projects DB properties: ${Object.keys(projectsDb.properties).join(', ')}`);

    const sessionsDb = await notion.databases.retrieve({
      database_id: sessionsDbId,
    });
    console.log(`📝 Sessions DB properties: ${Object.keys(sessionsDb.properties).join(', ')}\n`);

    console.log('🎉 All tests passed! Your Notion API connection is working correctly.');
    console.log('\n💡 If you\'re still experiencing issues in the app:');
    console.log('   1. Check the Notion status page: https://status.notion.so');
    console.log('   2. Verify your integration has the correct permissions');
    console.log('   3. Try restarting the server and frontend');

  } catch (error) {
    console.error('❌ Notion API test failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.code === 'unauthorized') {
      console.error('   💡 Your API key is invalid or expired');
    } else if (error.code === 'object_not_found') {
      console.error('   💡 Database not found - check your database IDs');
    } else if (error.code === 'service_unavailable') {
      console.error('   💡 Notion API is temporarily unavailable');
      console.error('   💡 Check https://status.notion.so for service status');
    } else if (error.code === 'rate_limited) {
      console.error('   💡 You\'ve hit the API rate limit');
    } else {
      console.error(`   💡 Unexpected error: ${error.code || 'unknown'}`);
    }
    
    process.exit(1);
  }
}

// Run the test
testNotionConnection().catch(console.error);
