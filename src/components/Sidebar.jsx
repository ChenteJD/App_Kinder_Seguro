export default function Sidebar({ isOpen }) {
  return (
    <aside
      className={`bg-white w-64 p-6 space-y-4 shadow-lg transform top-0 left-0 fixed h-full z-50 transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:shadow-none`}
    >
      <h2 className="text-xl font-semibold mb-4 text-green-700">Menú</h2>
      <ul className="space-y-3">
        <li>
          <a href="#" className="block p-2 rounded hover:bg-indigo-100 transition">
            Dashboard
          </a>
        </li>
        <li>
          <a href="#" className="block p-2 rounded hover:bg-indigo-100 transition">
            Usuarios
          </a>
        </li>
        <li>
          <a href="#" className="block p-2 rounded hover:bg-indigo-100 transition">
            Reportes
          </a>
        </li>
        <li>
          <a href="#" className="block p-2 rounded hover:bg-indigo-100 transition">
            Configuración
          </a>
        </li>
      </ul>
    </aside>
  );
}
