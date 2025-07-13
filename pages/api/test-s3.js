import { uploadFileToS3 } from '../../lib/s3';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== S3 Upload Test ===');
    console.log('Environment variables:');
    console.log('- AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? `${process.env.AWS_ACCESS_KEY_ID.substring(0, 10)}...` : 'NOT SET');
    console.log('- AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? `${process.env.AWS_SECRET_ACCESS_KEY.substring(0, 10)}...` : 'NOT SET');
    console.log('- AWS_REGION:', process.env.AWS_REGION || 'NOT SET');
    console.log('- AWS_S3_BUCKET_NAME:', process.env.AWS_S3_BUCKET_NAME || 'NOT SET');
    
    // Create a simple test file
    const testContent = 'This is a test file for S3 upload';
    const testBuffer = Buffer.from(testContent, 'utf8');
    
    console.log('Attempting S3 upload...');
    const result = await uploadFileToS3(
      testBuffer,
      'test-file.txt',
      'text/plain',
      'test-uploads'
    );
    
    console.log('S3 upload test result:', result);
    
    return res.status(200).json({
      success: true,
      result: result,
      credentials: {
        access_key_id: process.env.AWS_ACCESS_KEY_ID ? `${process.env.AWS_ACCESS_KEY_ID.substring(0, 10)}...` : 'NOT SET',
        region: process.env.AWS_REGION || 'NOT SET',
        bucket: process.env.AWS_S3_BUCKET_NAME || 'NOT SET'
      }
    });
    
  } catch (error) {
    console.error('S3 test error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      errorName: error.name,
      errorCode: error.code,
      credentials: {
        access_key_id: process.env.AWS_ACCESS_KEY_ID ? `${process.env.AWS_ACCESS_KEY_ID.substring(0, 10)}...` : 'NOT SET',
        region: process.env.AWS_REGION || 'NOT SET',
        bucket: process.env.AWS_S3_BUCKET_NAME || 'NOT SET'
      }
    });
  }
} 