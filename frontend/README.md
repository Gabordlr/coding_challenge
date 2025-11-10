# Notes App - Frontend

This is the frontend application for the Notes with Sentiment app, built with Next.js, React, and Tailwind CSS.

## Features

- Create notes with text and sentiment (happy, sad, neutral, angry)
- View notes with pagination (10 per page)
- Filter notes by sentiment
- Display creation date for each note

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in the AppSync API URL, API Key, and AWS Region from the CDK deployment outputs

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```bash
npm run build
npm start
```

## Environment Variables

- `NEXT_PUBLIC_APPSYNC_API_URL`: The AppSync GraphQL API endpoint
- `NEXT_PUBLIC_APPSYNC_API_KEY`: The API key for authentication
- `NEXT_PUBLIC_AWS_REGION`: The AWS region (e.g., us-east-1)

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── CreateNoteForm.tsx # Form for creating notes
│   └── NotesList.tsx      # List of notes with filtering
├── lib/                   # Utilities and configuration
│   ├── amplify-config.ts  # Amplify configuration
│   └── graphql/           # GraphQL queries and types
│       ├── client.ts      # GraphQL client
│       ├── queries.ts     # GraphQL queries and mutations
│       └── types.ts       # TypeScript types
└── public/                # Static assets
```

## Technologies

- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **AWS Amplify**: For GraphQL API integration
- **TypeScript**: Type safety
