import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-display font-extrabold text-8xl gradient-text mb-4">404</h1>
      <p className="text-2xl font-semibold mb-2">Page not found</p>
      <p className="text-gray-400 max-w-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="btn-primary text-white font-semibold px-8 py-3.5 rounded-full flex items-center gap-2"
      >
        Back to Home <ArrowRight size={18} />
      </Link>
    </div>
  );
}
