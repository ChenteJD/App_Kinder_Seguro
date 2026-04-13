export default function Header({ toggleSidebar }) {
  return (
    <header className="bg-white-200 text-green-600 p-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold tracking-wide">Kinddo</h1>

      {/* Navegación desktop */}
      <nav className="space-x-6 hidden md:flex">
        <a href="#" className="hover:underline transition">Inicio</a>
        <a href="#" className="hover:underline transition">Perfil</a>
        <a href="#" className="hover:underline transition">Ajustes</a>
      </nav>

      {/* Botón hamburguesa móvil */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 rounded hover:bg-white transition"
      >
        ☰
      </button>
    </header>
  );
}
