export default function Header({ toggleSidebar }) {
  return (
    <header className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold tracking-wide">Mi App Pro</h1>

      {/* Navegación desktop */}
      <nav className="space-x-6 hidden md:flex">
        <a href="#" className="hover:underline transition">Inicio</a>
        <a href="#" className="hover:underline transition">Perfil</a>
        <a href="#" className="hover:underline transition">Ajustes</a>
      </nav>

      {/* Botón hamburguesa móvil */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 rounded hover:bg-indigo-500 transition"
      >
        ☰
      </button>
    </header>
  );
}
