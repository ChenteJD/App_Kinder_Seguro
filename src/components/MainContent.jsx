export default function MainContent() {
  const cards = [
    { title: "Usuarios activos", color: "bg-blue-500", value: 125 },
    { title: "Ventas", color: "bg-green-500", value: "$5,430" },
    { title: "Reportes pendientes", color: "bg-yellow-500", value: 12 },
    { title: "Feedback recibido", color: "bg-purple-500", value: 34 },
  ];

  return (
    <main className="flex-1 p-6 md:ml-64 transition-all duration-300">
      <h2 className="text-3xl font-semibold text-green-700 mb-5">Lezzia</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`${card.color} p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer`}
          >
            <h3 className="text-lg font-medium mb-3">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-700">{card.value}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
