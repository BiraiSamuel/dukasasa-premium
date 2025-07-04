import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-lg font-semibold bg-[#ff5b00] text-white border border-black py-2 rounded-full w-16 mx-auto">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-700">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6 max-[350px]:flex-col max-[350px]:gap-y-5">
          <Link
            href="/"
            className="rounded-md bg-[#ff5b00] border border-black px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#cc4400] transition"
          >
            Go back home
          </Link>
          <Link
            href="/contact"
            className="text-sm font-semibold text-[#ff5b00] hover:underline hover:underline-offset-4"
          >
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}