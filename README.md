# MOCEAN Health Intake App

A modern, professional health intake application for clinics and wellness centers. Built with Next.js, React, Prisma, AWS S3, and OpenAI Vision, it features a clean blue/white "Modern Medical" UI, multi-page PDF upload, auto-extraction of health metrics, and secure cloud storage.

## Features
- Clean, modern medical UI (blue/white, rounded cards, professional typography)
- Multi-step intake form (Goals, Medical History, Health Check, Lifestyle, etc.)
- Upload and extract data from scanned health reports (PDF, image)
- Auto-fill device metrics (InBody, ExBody, OmniFit, Auracom, HeartMath)
- AWS S3 file storage
- PostgreSQL database via Prisma
- Staff dashboard for reviewing and entering metrics
- Responsive and accessible design

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- PostgreSQL database
- AWS S3 bucket

### Installation
```sh
git clone https://github.com/moceanpt/my-intake-app.git
cd my-intake-app
npm install
```

### Environment Variables
Create a `.env` file in the project root with the following:
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=your-region
AWS_S3_BUCKET=your-bucket-name
OPENAI_API_KEY=your-openai-api-key
```

### Running Locally
```sh
npm run dev
```

### Database Migrations
```sh
npx prisma migrate dev
```

## Deployment
This app can be deployed to Vercel, AWS Amplify, or any platform supporting Next.js. For Vercel:
1. Push your repo to GitHub
2. Connect your repo on [Vercel](https://vercel.com/)
3. Set environment variables in the Vercel dashboard
4. Deploy!

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
MIT 

## Reference Charts

For all clinical reference values, scoring bands, and color logic used in this app—including InBody, ExBody, and OmniFit (PPG & EEG)—see [REFERENCE_CHARTS.md](./REFERENCE_CHARTS.md). This file is the single source of truth for all objective test scoring and interpretation. 