# AWS Service Setup Guide for Speech & Text App

This guide will walk you through the process of setting up the required AWS services for the Speech & Text application.

## Prerequisites

1. An AWS account
2. AWS CLI installed and configured (optional but recommended)
3. Basic understanding of AWS services

## Step 1: Set Up Amazon Cognito User Pool

1. Go to the [Amazon Cognito Console](https://console.aws.amazon.com/cognito/home)
2. Click "Create user pool"
3. Select "Cognito user pool" as the provider type
4. For sign-in options, select "Email"
5. In the security requirements section, configure password policy as needed
6. Enable self-registration if you want users to be able to sign up themselves
7. Configure MFA if needed (optional)
8. In the "Required attributes" section, select "email" as a required attribute
9. Configure verification messages as needed
10. Create an app client for your React application
11. Review and create the user pool

After creating the user pool, note the following values:
- User Pool ID (e.g., `ap-south-1_foLEf6VSu`)
- App Client ID (e.g., `5boob6o0i4m32lh2fahkl06hij`)
- Region (e.g., `ap-south-1`)

## Step 2: Create an S3 Bucket for Audio Storage

1. Go to the [Amazon S3 Console](https://console.aws.amazon.com/s3/home)
2. Click "Create bucket"
3. Enter a unique bucket name (e.g., "your-app-audio-files")
4. Select the same region as your Cognito User Pool (e.g., ap-south-1)
5. Configure other settings as needed
6. Enable CORS for the bucket with the following configuration:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

7. Create the bucket

## Step 3: Set Up IAM Permissions

1. Go to the [IAM Console](https://console.aws.amazon.com/iam/home)
2. Create a new policy using the JSON in the `amplify-permissions-policy.json` file
3. Update the resource ARNs with your actual User Pool ID and S3 bucket name
4. Name the policy something like "SpeechTextAppPolicy"
5. Create a new IAM role 
6. Attach the policy to the role
7. Create an Identity Pool in Cognito
8. Associate the role with the authenticated users of the Identity Pool

## Step 4: Update the Application Configuration

1. Open `src/aws-config.js`
2. Update the following values:
   - `aws_project_region` with your region
   - `aws_cognito_region` with your region
   - `aws_user_pools_id` with your User Pool ID
   - `aws_user_pools_web_client_id` with your App Client ID
   - In the Storage section, replace `your-s3-bucket-name` with your actual S3 bucket name

## Step 5: Test the Application

1. Start the application with `npm start`
2. Create an account or sign in
3. Test the Speech to Text functionality by recording audio
4. Test the Text to Speech functionality by entering text

## Troubleshooting

### Common Issues

1. **Auth UserPool not configured error**: 
   - Make sure you've correctly set up the Cognito User Pool
   - Check that the User Pool ID and App Client ID are correct in `aws-config.js`

2. **S3 Permission Denied**: 
   - Verify that your IAM policy includes the necessary S3 permissions
   - Check that the S3 bucket name in `aws-config.js` matches your actual bucket

3. **Transcribe or Polly Service Errors**:
   - Ensure your IAM policy includes the required permissions for these services
   - Check that you've added the Predictions plugin in `index.js`

### Getting Help

If you continue to experience issues, consult the [AWS Amplify Documentation](https://docs.amplify.aws/) or open an issue in the project repository. 