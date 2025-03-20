# Next.js Boilerplate

A full-stack Next.js boilerplate with TypeScript, Tailwind CSS, and API routes.

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

## Project Structure

```
nextjs-boilerplate/
├── public/              # Static assets
├── src/
│   ├── app/             # App Router pages and layouts
│   │   ├── api/         # API routes
│   │   ├── globals.css  # Global styles
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Home page
│   ├── components/      # Reusable components
│   │   └── ui/          # UI components
│   ├── lib/             # Library code, utilities
│   │   └── api.ts       # API client
│   └── utils/           # Utility functions
│       └── formatDate.ts # Date formatting utilities
├── .eslintrc.json       # ESLint configuration
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

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Available Scripts

- `npm run dev` - Run the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Environment Variables

Create a `.env.local` file in the root directory to set environment variables:

```
# API URL
API_URL=http://localhost:3000/api
```

## Learn More

To learn more about the technologies used in this boilerplate:

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ESLint Documentation](https://eslint.org/docs/user-guide/getting-started)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
