import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to intake form after a brief delay
    const timer = setTimeout(() => {
      router.push('/intake');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <Head>
        <title>MOCEAN • Holistic Health Intake</title>
        <meta name="description" content="Fast-Track intake form to help MOCEAN personalize your care." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <Card.Header>
            <h1 className="text-3xl font-bold mb-2 text-secondary-900">
              Welcome to MOCEAN
            </h1>
            <p className="text-lg text-secondary-600">
              Holistic Health & Wellness
            </p>
          </Card.Header>
          
          <Card.Body>
            <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌊</span>
            </div>
            
            <div className="space-y-4">
              <p className="text-secondary-700">
                Redirecting you to the intake form...
              </p>
              <div className="flex justify-center">
                <div 
                  className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
                ></div>
              </div>
              <p className="text-sm text-secondary-500">
                <a 
                  href="/intake" 
                  className="underline hover:opacity-80 transition-opacity text-primary-600"
                >
                  Click here if you're not redirected automatically
                </a>
              </p>
            </div>
          </Card.Body>
          
          <Card.Footer>
            <a 
              href="/staff/dashboard" 
              className="text-sm hover:opacity-80 transition-opacity text-secondary-400"
            >
              Staff Dashboard →
            </a>
          </Card.Footer>
        </Card>
      </div>
    </>
  );
} 