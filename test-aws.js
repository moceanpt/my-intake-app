const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

console.log('Testing AWS connection...');
console.log('Region:', process.env.AWS_REGION);
console.log('Access Key ID (first 10 chars):', process.env.AWS_ACCESS_KEY_ID ? process.env.AWS_ACCESS_KEY_ID.substring(0, 10) + '...' : 'NOT SET');
console.log('Secret Key (first 10 chars):', process.env.AWS_SECRET_ACCESS_KEY ? process.env.AWS_SECRET_ACCESS_KEY.substring(0, 10) + '...' : 'NOT SET');
console.log('Bucket:', process.env.AWS_S3_BUCKET_NAME);

async function testConnection() {
  try {
    const command = new ListBucketsCommand({});
    const result = await s3Client.send(command);
    console.log('✅ AWS connection successful!');
    console.log('Available buckets:', result.Buckets?.map(b => b.Name) || []);
    
    // Test specific bucket access
    if (process.env.AWS_S3_BUCKET_NAME) {
      console.log('\nTesting bucket access...');
      const { HeadBucketCommand } = require('@aws-sdk/client-s3');
      const headCommand = new HeadBucketCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME });
      await s3Client.send(headCommand);
      console.log('✅ Bucket access successful!');
    }
  } catch (error) {
    console.log('❌ AWS connection failed:');
    console.log('Error name:', error.name);
    console.log('Error message:', error.message);
    console.log('Error code:', error.$metadata ? error.$metadata.httpStatusCode : 'Unknown');
    
    // Common error solutions
    if (error.name === 'InvalidAccessKeyId') {
      console.log('\n💡 Solution: Check your AWS_ACCESS_KEY_ID');
    } else if (error.name === 'SignatureDoesNotMatch') {
      console.log('\n💡 Solution: Check your AWS_SECRET_ACCESS_KEY');
    } else if (error.name === 'NoSuchBucket') {
      console.log('\n💡 Solution: Check your AWS_S3_BUCKET_NAME');
    } else if (error.name === 'AccessDenied') {
      console.log('\n💡 Solution: Check IAM permissions for S3 access');
    }
  }
}

testConnection(); 