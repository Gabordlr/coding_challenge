# Testing Guide - Frontend to Backend Connection

## ✅ Setup Complete!

Your backend has been successfully deployed and your frontend is now configured to connect to it.

## 📋 Configuration Summary

### Backend (Deployed)

- **GraphQL API URL**: `https://xxwnz4u7anhm7eanxohyskvmni.appsync-api.us-east-1.amazonaws.com/graphql`
- **API Key**: `da2-3yeyqpf7lvfvjm3f2kj7jm56ja`
- **Region**: `us-east-1`

### Frontend (Configured)

- Environment variables set in `frontend/.env.local`
- GraphQL client configured
- Amplify configured to use AppSync

## 🧪 How to Test

### 1. Start the Development Server

```bash
cd /Users/gabordlr/CodeRepos/Personal/coding_challenge/frontend
npm run dev
```

The server will start at: **http://localhost:3000**

### 2. Test the Application

Open your browser and go to: **http://localhost:3000**

#### Test Creating a Note:

1. Enter some text in the textarea
2. Select a sentiment (happy, sad, neutral, or angry)
3. Click "Create Note"
4. The note should appear in the list below

#### Test Viewing Notes:

1. Notes should load automatically
2. You should see any notes you've created
3. Each note shows:
   - The sentiment (with color coding)
   - The text
   - The creation date

#### Test Filtering:

1. Click on different sentiment buttons (All, Happy, Sad, Neutral, Angry)
2. The list should filter to show only notes with that sentiment

#### Test Pagination:

1. If you have more than 10 notes, you'll see a "Load More" button
2. Click it to load the next 10 notes

## 🔍 Troubleshooting

### If notes don't appear:

1. Check the browser console (F12) for errors
2. Verify the `.env.local` file has the correct values
3. Make sure the backend is still deployed (check AWS Console)

### If you see connection errors:

1. Verify the API URL and API Key in `.env.local`
2. Check that the API key hasn't expired (valid for 365 days)
3. Ensure CORS is configured in AppSync (should be automatic)

### If the page doesn't load:

1. Make sure the dev server is running: `npm run dev`
2. Check that port 3000 is not in use
3. Look for errors in the terminal where you ran `npm run dev`

## 📝 Next Steps

Once local testing works:

1. Deploy the frontend to AWS Amplify
2. Add the same environment variables in Amplify Console
3. Test the production deployment

## 🎉 Success Indicators

You'll know everything is working when:

- ✅ You can create notes successfully
- ✅ Notes appear in the list immediately after creation
- ✅ Filtering by sentiment works
- ✅ Pagination works (if you have >10 notes)
- ✅ No errors in the browser console
