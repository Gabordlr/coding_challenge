# Deployment Guide

This guide explains how to deploy the Notes application to AWS.

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI configured with credentials
3. Node.js 20+ installed
4. CDK CLI installed (`npm install -g aws-cdk`)

## Step 1: Deploy Backend Infrastructure

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Bootstrap CDK (only needed once per account/region):

   ```bash
   cdk bootstrap
   ```

4. Deploy the stack:

   ```bash
   npm run deploy
   ```

5. After deployment, note the outputs:
   - `GraphQLAPIURL`: The AppSync GraphQL API endpoint
   - `GraphQLAPIKey`: The API key for authentication
   - `Region`: The AWS region

## Step 2: Configure Frontend

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Create a `.env.local` file with the values from the CDK outputs:

   ```bash
   cp .env.local.example .env.local
   ```

3. Update `.env.local` with the actual values:
   ```
   NEXT_PUBLIC_APPSYNC_API_URL=<GraphQLAPIURL from CDK output>
   NEXT_PUBLIC_APPSYNC_API_KEY=<GraphQLAPIKey from CDK output>
   NEXT_PUBLIC_AWS_REGION=<Region from CDK output>
   ```

## Step 3: Deploy Frontend to AWS Amplify

### Option A: Using AWS Amplify Console

1. Go to AWS Amplify Console
2. Click "New app" > "Host web app"
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: `cd frontend && npm run build`
   - Output directory: `frontend/.next`
5. Add environment variables:
   - `NEXT_PUBLIC_APPSYNC_API_URL`
   - `NEXT_PUBLIC_APPSYNC_API_KEY`
   - `NEXT_PUBLIC_AWS_REGION`
6. Deploy

### Option B: Using Amplify CLI

1. Install Amplify CLI:

   ```bash
   npm install -g @aws-amplify/cli
   ```

2. Initialize Amplify:

   ```bash
   cd frontend
   amplify init
   ```

3. Add hosting:

   ```bash
   amplify add hosting
   ```

4. Publish:
   ```bash
   amplify publish
   ```

## Step 4: Run Analytics Notebook (Optional)

1. Install required Python packages:

   ```bash
   pip install boto3 pandas matplotlib seaborn jupyter
   ```

2. Configure AWS credentials (if not already configured)

3. Open the notebook:

   ```bash
   jupyter notebook analytics.ipynb
   ```

4. Run all cells to generate visualizations

## Troubleshooting

### Frontend can't connect to AppSync

- Verify environment variables are set correctly
- Check that the API key hasn't expired
- Ensure CORS is configured correctly in AppSync

### CDK deployment fails

- Ensure AWS credentials are configured
- Check that you have permissions to create resources
- Verify the region is correct

### Lambda resolvers fail

- Check CloudWatch logs for errors
- Verify DynamoDB table exists and has correct permissions
- Ensure Lambda functions have correct IAM roles

## Cleanup

To remove all resources:

```bash
cd backend
cdk destroy
```

Then manually delete the Amplify app from the AWS Console.
