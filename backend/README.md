# Notes App - Backend Infrastructure

This directory contains the AWS CDK infrastructure code for the Notes application.

## Architecture

- **AppSync**: GraphQL API
- **DynamoDB**: NoSQL database for storing notes
- **Lambda**: Serverless functions for GraphQL resolvers

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure AWS profile (if using a named profile):

   ```bash
   export AWS_PROFILE=personal
   ```

   Or use the helper script (see below).

3. Bootstrap CDK (only needed once per account/region):

   ```bash
   # Using helper script
   ./deploy.sh bootstrap

   # Or manually
   export AWS_PROFILE=personal
   cdk bootstrap
   ```

4. Deploy the stack:

   ```bash
   # Using helper script (recommended)
   ./deploy.sh deploy

   # Or manually
   export AWS_PROFILE=personal
   npm run deploy
   ```

## Available Commands

### Using Helper Script (Recommended)

The `deploy.sh` script automatically sets the AWS profile to `personal`:

- `./deploy.sh bootstrap`: Bootstrap CDK (first time only)
- `./deploy.sh deploy`: Deploy the stack
- `./deploy.sh destroy`: Remove all resources
- `./deploy.sh synth`: Generate CloudFormation template
- `./deploy.sh diff`: Show changes before deploying

### Manual Commands

- `npm run build`: Compile TypeScript
- `npm run watch`: Watch for changes and compile
- `npm run cdk`: CDK CLI
- `npm run deploy`: Deploy the stack (requires `AWS_PROFILE=personal`)
- `npm run synth`: Synthesize CloudFormation template
- `npm run diff`: Compare deployed stack with current state

**Note**: When using manual commands, make sure to set `export AWS_PROFILE=personal` first.

## Stack Outputs

After deployment, the stack outputs:

- `GraphQLAPIURL`: The AppSync GraphQL API endpoint
- `GraphQLAPIKey`: The API key for authentication
- `Region`: The AWS region

## GraphQL Schema

The API supports:

- **Query**: `getNotes(sentiment, limit, nextToken)` - Get paginated notes with optional sentiment filter
- **Mutation**: `createNote(text, sentiment)` - Create a new note

## DynamoDB Table Structure

- **Table Name**: `Notes`
- **Partition Key**: `id` (String)
- **Sort Key**: `dateCreated` (String)
- **GSI**: `sentiment-dateCreated-index` for filtering by sentiment

## Lambda Resolvers

- `createNote`: Creates a new note with ULID and timestamp
- `getNotes`: Retrieves notes with pagination and optional sentiment filtering

## Cleanup

To remove all resources:

```bash
# Using helper script
./deploy.sh destroy

# Or manually
export AWS_PROFILE=personal
cdk destroy
```
