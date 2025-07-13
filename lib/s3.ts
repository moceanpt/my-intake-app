import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Debug AWS configuration
console.log('AWS Configuration Debug:');
console.log('- AWS_REGION:', process.env.AWS_REGION || 'NOT SET');
console.log('- AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? `${process.env.AWS_ACCESS_KEY_ID.substring(0, 10)}...` : 'NOT SET');
console.log('- AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? `${process.env.AWS_SECRET_ACCESS_KEY.substring(0, 10)}...` : 'NOT SET');
console.log('- AWS_S3_BUCKET_NAME:', process.env.AWS_S3_BUCKET_NAME || 'NOT SET');

// S3 Client configuration - using us-east-2 to match your bucket
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2', // Changed from us-east-1 to us-east-2
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'my-intake-app-uploads';

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  fileKey?: string;
  error?: string;
}

/**
 * Upload a file to S3
 */
export async function uploadFileToS3(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  folder: string = 'uploads'
): Promise<{ url: string; key: string }> {
  try {
    console.log('Starting S3 upload...');
    console.log('- File name:', fileName);
    console.log('- Content type:', contentType);
    console.log('- Folder:', folder);
    console.log('- Buffer size:', fileBuffer.length);
    
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) {
      throw new Error('AWS_S3_BUCKET_NAME environment variable is not set');
    }
    
    console.log('- Bucket name:', bucketName);
    
    // Create a unique key for the file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const key = `${folder}/${timestamp}-${fileName}`;
    
    console.log('- S3 key:', key);
    
    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: 'private' as const, // Keep files private for security
    };
    
    console.log('Uploading to S3...');
    const command = new PutObjectCommand(uploadParams);
    const result = await s3Client.send(command);
    
    console.log('S3 upload successful:', result);
    
    // Generate a signed URL for temporary access
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    
    const signedUrl = await getSignedUrl(s3Client, getObjectCommand, {
      expiresIn: 3600, // URL expires in 1 hour
    });
    
    console.log('Generated signed URL:', signedUrl.substring(0, 100) + '...');
    
    return {
      url: signedUrl,
      key: key,
    };
    
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
}

/**
 * Generate a signed URL for an existing file
 */
export async function getSignedUrlForFile(key: string): Promise<string> {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) {
      throw new Error('AWS_S3_BUCKET_NAME environment variable is not set');
    }
    
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    
    return await getSignedUrl(s3Client, getObjectCommand, {
      expiresIn: 3600, // URL expires in 1 hour
    });
    
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
}

/**
 * Extract file key from a signed URL (for storage in database)
 */
export function extractFileKeyFromUrl(signedUrl: string): string | null {
  try {
    const url = new URL(signedUrl);
    const pathParts = url.pathname.split('/');
    // Remove the bucket name and get the rest as the file key
    return pathParts.slice(2).join('/');
  } catch (error) {
    console.error('Error extracting file key from URL:', error);
    return null;
  }
} 