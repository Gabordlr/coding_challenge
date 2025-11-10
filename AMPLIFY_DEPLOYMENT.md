# Deploy Frontend to AWS Amplify Hosting (Free Tier)

This guide will help you deploy the Next.js frontend to AWS Amplify Hosting using the free tier.

## Prerequisites

1. AWS Account (free tier eligible)
2. Backend already deployed (AppSync API, DynamoDB, Cognito)
3. GitHub repository with your code (or GitLab/Bitbucket)

## AWS Amplify Free Tier Limits

- **Build minutes**: 1,000 minutes/month
- **Hosting**: 5 GB storage, 15 GB data transfer/month
- **Concurrent builds**: 1
- **Custom domains**: 1

These limits are sufficient for development and small production apps.

## Step 1: Prepare Your Repository

Make sure your code is pushed to GitHub/GitLab/Bitbucket.

## Step 2: Deploy via AWS Amplify Console

### Option A: Deploy from GitHub (Recommended)

1. **Go to AWS Amplify Console**
   - Navigate to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Sign in to your AWS account

2. **Create New App**
   - Click "New app" → "Host web app"
   - Choose your Git provider (GitHub, GitLab, or Bitbucket)
   - Authorize AWS Amplify to access your repository
   - Select your repository and branch (usually `main` or `master`)

3. **Configure Build Settings**
   - AWS Amplify should auto-detect Next.js
   - If not, use these settings:
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - cd frontend
             - npm ci
         build:
           commands:
             - npm run build
       artifacts:
         baseDirectory: frontend/.next
         files:
           - "**/*"
       cache:
         paths:
           - frontend/node_modules/**/*
           - frontend/.next/cache/**/*
     ```

4. **Add Environment Variables**
   Click "Advanced settings" → "Environment variables" and add:
   - `NEXT_PUBLIC_APPSYNC_API_URL` - Your AppSync GraphQL API URL
   - `NEXT_PUBLIC_APPSYNC_API_KEY` - Your AppSync API Key
   - `NEXT_PUBLIC_AWS_REGION` - Your AWS region (e.g., `us-east-1`)
   - `NEXT_PUBLIC_USER_POOL_ID` - Your Cognito User Pool ID
   - `NEXT_PUBLIC_USER_POOL_CLIENT_ID` - Your Cognito User Pool Client ID

   You can find these values from your CDK deployment outputs:

   ```bash
   cd backend
   aws cloudformation describe-stacks --stack-name NotesAppStack --query "Stacks[0].Outputs"
   ```

5. **Review and Deploy**
   - Review the settings
   - Click "Save and deploy"
   - Wait for the build to complete (usually 3-5 minutes)

6. **Access Your App**
   - Once deployed, Amplify will provide a URL like: `https://main.xxxxx.amplifyapp.com`
   - Your app is now live!

### Option B: Deploy from Local Code (Manual)

If you prefer to deploy without connecting to Git:

1. **Install Amplify CLI**

   ```bash
   npm install -g @aws-amplify/cli
   ```

2. **Initialize Amplify**

   ```bash
   cd frontend
   amplify init
   ```

   - Choose your environment name
   - Select your AWS profile
   - Choose your editor
   - Select "JavaScript" for app type
   - Choose "Next.js" for framework

3. **Add Hosting**

   ```bash
   amplify add hosting
   ```

   - Choose "Hosting with Amplify Console"
   - Select "Manual deployment"

4. **Publish**
   ```bash
   amplify publish
   ```

## Step 3: Configure Custom Domain (Optional)

1. In Amplify Console, go to your app
2. Click "Domain management" → "Add domain"
3. Enter your domain name
4. Follow the DNS configuration instructions
5. Wait for SSL certificate provisioning (usually 5-10 minutes)

## Step 4: Set Up Continuous Deployment

Amplify automatically deploys when you push to your connected branch:

1. Push changes to your repository
2. Amplify detects the change
3. Builds and deploys automatically
4. You can view build logs in the Amplify Console

## Troubleshooting

### Build Fails

1. **Check build logs** in Amplify Console
2. **Verify Node.js version**: Amplify uses Node.js 18 by default. If you need Node.js 20, add to `amplify.yml`:

   ```yaml
   frontend:
     phases:
       preBuild:
         commands:
           - nvm use 20
           - cd frontend
           - npm ci
   ```

3. **Check environment variables**: Make sure all required variables are set

### App Not Loading

1. **Check browser console** for errors
2. **Verify environment variables** are correctly set
3. **Check AppSync API** is accessible (CORS settings)
4. **Verify Cognito User Pool** is configured correctly

### Environment Variables Not Working

- Make sure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding/changing environment variables
- Clear browser cache

## Cost Estimation (Free Tier)

- **Build minutes**: ~5 minutes per build × 20 builds/month = 100 minutes (well within 1,000 limit)
- **Storage**: ~50 MB (well within 5 GB limit)
- **Data transfer**: Depends on traffic, but 15 GB is generous for small apps

## Next Steps

- Set up branch previews for pull requests
- Configure custom domains
- Set up monitoring and alerts
- Configure redirects and rewrites if needed

## Additional Resources

- [AWS Amplify Hosting Documentation](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html)
- [Next.js on Amplify](https://docs.aws.amazon.com/amplify/latest/userguide/server-side-rendering-amplify.html)
- [Amplify Console Pricing](https://aws.amazon.com/amplify/pricing/)
