const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_PROJECTS_DATABASE_ID;

async function test() {
  try {
    console.log('🔑 Token:', process.env.NOTION_TOKEN ? 'Found' : 'Not found');
    console.log('📁 Database ID:', DATABASE_ID);
    console.log('🔍 Testing Notion API...\n');

    console.log('Available methods on notion.databases:', Object.keys(notion.databases));
    console.log('typeof notion.databases.query:', typeof notion.databases.query);
    
    if (typeof notion.databases.query === 'function') {
      const response = await notion.databases.query({
        database_id: DATABASE_ID,
      });
      console.log('\n✅ Success! Found', response.results.length, 'projects');
      console.log('First project:', response.results[0]?.properties?.Name?.title?.[0]?.plain_text);
    } else {
      console.log('\n❌ notion.databases.query is not a function');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

test();


