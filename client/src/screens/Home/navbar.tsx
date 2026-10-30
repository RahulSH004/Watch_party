import { Play, ArrowRight } from "lucide-react";
export default function Navbar() {
  return (
    <div>
      <header className="sticky top-0 z-50 w-full ">
        <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <a className="" href="/" aria-label="Watch Party home">
            <span className="">
              <Play size={14} fill="currentColor" aria-hidden="true" />
            </span>
            watch party
          </a>
          <div className="">
            <a href="#how-it-works">How it works</a>
            <a href="#features">Features</a>
            <a className="" href="#join">
              Log in
            </a>
            <a className="" href="#create">
              Create a room <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
        </nav>
      </header>
    </div>
  );
}
