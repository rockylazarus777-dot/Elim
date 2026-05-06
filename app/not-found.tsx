import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          404
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-3 text-muted">
          The page you&rsquo;re looking for doesn&rsquo;t exist or was moved.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
