import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className="fixed flex justify-between items-center h-[20px] px-4 py-6 w-full secondary">
      <Link to="/" className="color-zinc-2 no-underline">
        <h2>Rentgen</h2>
      </Link>
      <div className="flex gap-2">
        <Link
          to="/AddModel"
          className="color-zinc-2 no-underline hover:color-emerald-2"
        >
          Upload
        </Link>
        <Link
          to="/"
          className="color-zinc-2 no-underline hover:color-emerald-2"
        >
          Home
        </Link>
        <Link
          to="/login"
          className="color-zinc-2 no-underline hover:color-emerald-2"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
