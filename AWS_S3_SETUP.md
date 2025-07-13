# AWS S3 Setup for File Storage

This app now supports uploading device reports to AWS S3 for persistent storage and retrieval.

## Required Environment Variables

Add these to your `.env` file:

```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
AWS_REGION="us-east-2"
AWS_S3_BUCKET_NAME="my-intake-app-uploads"
```

## AWS Setup Steps

### 1. Create an S3 Bucket (Required)

**Option A: Using AWS Console (Recommended)**
1. Go to [AWS S3 Console](https://console.aws.amazon.com/s3/)
2. Click "Create bucket"
3. **Bucket name**: `my-intake-app-uploads`
4. **Region**: `us-east-2` (or your preferred region)
5. **Keep default settings** for now
6. Click "Create bucket"

**Option B: Using AWS CLI**
```bash
# Install AWS CLI first, then run:
aws s3 mb s3://my-intake-app-uploads --region us-east-2
```

### 2. Create IAM User (if not done already)
1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Create a new user for your app
3. Attach the `AmazonS3FullAccess` policy (or create a custom policy with minimal permissions)
4. Generate access keys for the user

### 3. Test the Setup
1. Restart your development server: `npm run dev`
2. Upload a file using the AI Document Upload component
3. Check your S3 bucket to see the uploaded file

## Troubleshooting

### "InvalidAccessKeyId" Error
- Verify your AWS credentials are correct in `.env`
- Make sure the IAM user has S3 permissions
- Check that the bucket exists in the correct region

### "NoSuchBucket" Error
- Create the S3 bucket first (see step 1 above)
- Verify the bucket name matches `AWS_S3_BUCKET_NAME` in your `.env`

### Data Not Filling in Forms
- The AI extraction is working correctly
- Field names have been updated to match the form schemas
- Try uploading a file and check the browser console for any errors

## File Organization

Files are stored in S3 with this structure:
```
my-intake-app-uploads/
├── device-reports/
│   ├── inbody/
│   ├── auracom/
│   ├── heartmath/
│   ├── exbody/
│   └── omnifit/
```

## Security Notes

- Keep your AWS credentials secure
- Consider using IAM roles for production
- The bucket is public by default - adjust permissions as needed
- Files are accessible via signed URLs for 24 hours

## Features

- **Automatic Upload:** Files are uploaded to S3 when AI extraction is performed
- **Database Storage:** File references are stored in the database with submission associations
- **Signed URLs:** Files are accessed via temporary signed URLs (24-hour expiry)
- **File Preview:** Uploaded files are displayed in the UI for staff verification
- **Device Organization:** Files are organized by device type in S3 folders

## File Structure in S3

```
my-intake-app-uploads/
├── device-reports/
│   ├── inbody/
│   ├── auracom/
│   ├── heartmath/
│   ├── exbody/
│   └── omnifit/
└── uploads/
```

## Security

- Files are stored with private ACL by default
- Access is provided via signed URLs with 24-hour expiry
- File keys are stored in the database for future reference
- No public access to uploaded files

## Database Schema

The app now includes an `UploadedFile` model that stores:
- File metadata (name, size, type)
- S3 file key and signed URL
- Association with submission and device type
- Upload timestamp 