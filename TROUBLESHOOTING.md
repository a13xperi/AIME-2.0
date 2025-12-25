# Agent Alex Troubleshooting Guide

## Notion API Connection Issues

If you're experiencing crashes or connection issues with the Notion API, here are the solutions:

### 1. **Immediate Fixes**

#### Check Notion API Status
- Visit [Notion's Status Page](https://status.notion.so) to check if there are any ongoing issues
- If Notion is experiencing outages, wait for them to resolve

#### Verify Your API Configuration
1. Check your `.env` file has the correct values:
   ```
   NOTION_API_KEY=your_notion_integration_token_here
   PROJECTS_DATABASE_ID=your_projects_database_id
   SESSIONS_DATABASE_ID=your_sessions_database_id
   ```

2. Ensure your Notion integration has the correct permissions:
   - Read access to your databases
   - Write access if you want to create/update records

#### Network Issues
- Check your internet connection
- Try accessing Notion directly in your browser
- If using a VPN, try disabling it temporarily

### 2. **Offline Mode**

The app now includes an offline mode that activates when Notion API is unavailable:
- Shows a user-friendly error message
- Provides retry functionality
- Includes troubleshooting tips
- Allows the app to continue functioning with limited features

### 3. **Server-Side Error Handling**

The server now includes:
- Timeout handling (10-second timeout for API calls)
- Retry logic for failed requests
- Graceful error responses
- Better error logging

### 4. **Development Mode**

If you're in development:
1. Restart the server: `cd server && npm run dev`
2. Restart the frontend: `cd .. && npm start`
3. Clear browser cache and reload

### 5. **Production Deployment**

For production deployment:
1. Ensure all environment variables are set correctly
2. Check that your Notion integration is properly configured
3. Monitor server logs for any API errors
4. Consider implementing a backup data source

### 6. **Common Error Messages**

#### "Notion API service temporarily unavailable"
- **Cause**: Notion API is down or experiencing issues
- **Solution**: Wait and retry, check Notion status page

#### "Request timeout"
- **Cause**: Network connectivity issues or slow response
- **Solution**: Check internet connection, retry

#### "Invalid API key"
- **Cause**: Incorrect or expired Notion API key
- **Solution**: Verify your API key in the `.env` file

#### "Database not found"
- **Cause**: Incorrect database IDs
- **Solution**: Verify database IDs in your `.env` file

### 7. **Prevention Strategies**

1. **Implement Caching**: Store frequently accessed data locally
2. **Add Retry Logic**: Automatically retry failed requests
3. **Use Fallback Data**: Provide default data when API is unavailable
4. **Monitor API Limits**: Track your Notion API usage
5. **Implement Circuit Breaker**: Temporarily stop API calls after repeated failures

### 8. **Getting Help**

If you continue to experience issues:
1. Check the browser console for error messages
2. Check the server logs for detailed error information
3. Verify your Notion workspace permissions
4. Test your API key with a simple Notion API call
5. Contact support with specific error messages and logs

### 9. **Alternative Solutions**

If Notion API continues to be unreliable:
1. **Local Database**: Implement a local SQLite database
2. **File Storage**: Use JSON files for data storage
3. **Other APIs**: Consider alternative project management APIs
4. **Hybrid Approach**: Use Notion for data entry, local storage for app functionality

## Quick Fixes

### Restart Everything
```bash
# Stop all processes
# Then restart server
cd server && npm run dev

# In another terminal, restart frontend
cd .. && npm start
```

### Clear Cache
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Check Environment
```bash
# Verify your .env file exists and has correct values
cat .env

# Test your Notion API key
curl -X GET 'https://api.notion.com/v1/users/me' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Notion-Version: 2022-06-28'
```
