import CTAButton from '@/components/CTAButton';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
      <h1 className="text-3xl font-bold text-navy-900">Page not found</h1>
      <p className="mt-3 text-navy-700">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <CTAButton href="/" className="mt-6">Back to home</CTAButton>
    </div>
  );
}
