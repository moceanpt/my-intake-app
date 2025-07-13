export default function handler(req, res) {
  console.log('Environment Variables Debug:');
  console.log('- AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? `${process.env.AWS_ACCESS_KEY_ID.substring(0, 10)}...` : 'NOT SET');
  console.log('- AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? `${process.env.AWS_SECRET_ACCESS_KEY.substring(0, 10)}...` : 'NOT SET');
  console.log('- AWS_REGION:', process.env.AWS_REGION || 'NOT SET');
  console.log('- AWS_S3_BUCKET_NAME:', process.env.AWS_S3_BUCKET_NAME || 'NOT SET');
  
  return res.status(200).json({
    aws_access_key_id: process.env.AWS_ACCESS_KEY_ID ? `${process.env.AWS_ACCESS_KEY_ID.substring(0, 10)}...` : 'NOT SET',
    aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY ? `${process.env.AWS_SECRET_ACCESS_KEY.substring(0, 10)}...` : 'NOT SET',
    aws_region: process.env.AWS_REGION || 'NOT SET',
    aws_s3_bucket_name: process.env.AWS_S3_BUCKET_NAME || 'NOT SET',
  });
} 