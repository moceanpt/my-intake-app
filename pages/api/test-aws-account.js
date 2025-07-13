import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== AWS Account Test ===');
    console.log('Environment variables:');
    console.log('- AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? `${process.env.AWS_ACCESS_KEY_ID.substring(0, 10)}...` : 'NOT SET');
    console.log('- AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? `${process.env.AWS_SECRET_ACCESS_KEY.substring(0, 10)}...` : 'NOT SET');
    console.log('- AWS_REGION:', process.env.AWS_REGION || 'NOT SET');
    
    // Create STS client to get account information
    const stsClient = new STSClient({
      region: process.env.AWS_REGION || 'us-east-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
    
    console.log('Attempting to get caller identity...');
    const command = new GetCallerIdentityCommand({});
    const result = await stsClient.send(command);
    
    console.log('AWS Account Info:', result);
    
    return res.status(200).json({
      success: true,
      accountInfo: {
        accountId: result.Account,
        userId: result.UserId,
        arn: result.Arn,
      },
      credentials: {
        access_key_id: process.env.AWS_ACCESS_KEY_ID ? `${process.env.AWS_ACCESS_KEY_ID.substring(0, 10)}...` : 'NOT SET',
        region: process.env.AWS_REGION || 'NOT SET',
      }
    });
    
  } catch (error) {
    console.error('AWS Account test error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      errorName: error.name,
      credentials: {
        access_key_id: process.env.AWS_ACCESS_KEY_ID ? `${process.env.AWS_ACCESS_KEY_ID.substring(0, 10)}...` : 'NOT SET',
        region: process.env.AWS_REGION || 'NOT SET',
      }
    });
  }
} 