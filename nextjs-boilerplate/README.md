# Next.js Boilerplate

A full-stack Next.js boilerplate with TypeScript, Tailwind CSS, API routes, and speech-to-text functionality.

## Features

### Frontend
- React with TypeScript for type safety
- Next.js App Router for routing
- Tailwind CSS for styling
- ESLint for code quality
- Reusable UI components

### Backend
- API Routes for backend logic
- Server-side rendering
- TypeScript for type safety
- Environment variable support
- File upload handling
- Speech-to-text conversion using OpenAI's Whisper API

## Project Structure

```
nextjs-boilerplate/
├── public/              # Static assets
├── src/
│   ├── app/             # App Router pages and layouts
│   │   ├── api/         # API routes
│   │   │   ├── hello/   # Sample API endpoint
│   │   │   └── transcribe/ # Speech-to-text API endpoint
│   │   ├── transcribe/  # Speech-to-text page
│   │   ├── globals.css  # Global styles
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Home page
│   ├── components/      # Reusable components
│   │   └── ui/          # UI components
│   ├── lib/             # Library code, utilities
│   │   ├── api.ts       # API client
│   │   ├── formidable.ts # File upload handling
│   │   └── openai.ts    # OpenAI API integration
│   └── utils/           # Utility functions
│       └── formatDate.ts # Date formatting utilities
├── uploads/             # Temporary storage for uploaded files
├── .env.local           # Environment variables
├── .eslintrc.json       # ESLint configuration
├── .gitignore           # Git ignore file
├── next.config.js       # Next.js configuration
├── package.json         # Project dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- OpenAI API key for speech-to-text functionality

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nextjs-boilerplate.git
   cd nextjs-boilerplate
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following:
   ```
   # API URL
   API_URL=http://localhost:3000/api
   
   # OpenAI API Key
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Speech-to-Text Feature

This boilerplate includes a speech-to-text conversion feature using OpenAI's Whisper API:

1. Navigate to `/transcribe` in your browser
2. Upload an MP3 audio file
3. Click "Transcribe Audio" to convert the speech to text
4. View the transcribed text in the result section

The API endpoint for this feature is available at `/api/transcribe` and accepts POST requests with form data containing an audio file.

## Available Scripts

- `npm run dev` - Run the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Learn More

To learn more about the technologies used in this boilerplate:

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Formidable Documentation](https://github.com/node-formidable/formidable)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
