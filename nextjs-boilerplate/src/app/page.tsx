import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Next.js Boilerplate
        </p>
      </div>

      <div className="relative flex place-items-center">
        <h1 className="text-4xl font-bold">
          Next.js Full-Stack Boilerplate
        </h1>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left gap-8">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Frontend Features
          </h2>
          <ul className="m-0 max-w-[30ch] text-sm opacity-50">
            <li>• React with TypeScript</li>
            <li>• Tailwind CSS for styling</li>
            <li>• App Router for routing</li>
            <li>• ESLint for code quality</li>
          </ul>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Backend Features
          </h2>
          <ul className="m-0 max-w-[30ch] text-sm opacity-50">
            <li>• API Routes for backend logic</li>
            <li>• Server-side rendering</li>
            <li>• TypeScript for type safety</li>
            <li>• Environment variable support</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
