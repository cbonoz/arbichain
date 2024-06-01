// pages/404.js

import Link from 'next/link';

const Custom404 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-5xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-gray-600">Oops! The page you are looking for does not exist.</p>
      <Link href="/">
        <a className="mt-6 px-4 py-2 text-lg text-white bg-blue-500 rounded hover:bg-blue-600">
          Go back home
        </a>
      </Link>
    </div>
  );
};

export default Custom404;
