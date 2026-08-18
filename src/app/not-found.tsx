import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col items-center justify-center text-[#1A1A19] px-4 font-sans text-center">
      <h1 className="font-heading text-6xl font-bold text-[#C4653A] mb-4">404</h1>
      <h2 className="font-heading text-2xl font-bold mb-2">Store or Page Not Found</h2>
      <p className="text-[#6B6560] max-w-md mb-8">
        The store link or page you are looking for does not exist or is currently offline.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#1A1A19] text-white rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-[#1A1A19]/90 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
