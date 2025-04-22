import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className="fixed flex justify-between items-center h-[20px] px-4 py-6 w-full secondary">
      <Link to="/" className="color-zinc-2 no-underline">
        <h2>Рентген</h2>
      </Link>
      <div className="flex gap-2">
        <Link
          to="/AddModel"
          className="color-zinc-2 no-underline hover:color-emerald-2"
        >
          Загрузка
        </Link>
        <Link
          to="/"
          className="color-zinc-2 no-underline hover:color-emerald-2"
        >
          Дом
        </Link>
        <Link
          to="/login"
          className="color-zinc-2 no-underline hover:color-emerald-2"
        >
          Вход
        </Link>
      </div>
    </nav>
  );
}
