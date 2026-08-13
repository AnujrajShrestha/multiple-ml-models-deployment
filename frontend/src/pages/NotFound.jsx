import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="grid min-h-[calc(100vh-73px)] place-items-center px-5 text-center">
      <div>
        <p className="text-7xl font-black text-indigo-400/30">404</p>
        <h1 className="mt-3 text-2xl font-bold text-white">Page not found</h1>
        <Link to="/" className="mt-6 inline-block rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-400">
          Back home
        </Link>
      </div>
    </main>
  );
}
