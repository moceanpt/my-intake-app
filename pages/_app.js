// pages/_app.js
// ------------------------------
// 1. Imports your global CSS (Tailwind or plain CSS)
// 2. Provides the standard Next.js <Component … /> wrapper
// 3. Optional <Head> block gives all pages a shared meta title
// ------------------------------

import "../styles/globals.css";
import Head from "next/head";



export default function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* Shared page metadata (you can adjust) */}
      <Head>
        <title>MOCEAN • Holistic Health Intake</title>
        <meta
          name="description"
          content="Fast-Track intake form to help MOCEAN personalize your care."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      
      </Head>

       {/* 👇 JIT “seed” – invisible but forces Tailwind to emit the classes */}
       <div className="hidden bg-coast-50 text-coast-500" />

      {/* Render the actual page component */}
      <Component {...pageProps} />
    </>
  );
  
}