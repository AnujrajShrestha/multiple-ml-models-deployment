import { Link } from "react-router-dom";
import { Activity } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/70 bg-[#050816]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center px-5">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold tracking-tight"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/20">
            <Activity size={19} />
          </span>

          <span>
            ML<span className="text-indigo-400">Predict</span>
          </span>
        </Link>
      </div>
    </header>
  );
}