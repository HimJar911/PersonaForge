export default function Features({ id }: { id?: string }) {
  const features = [
    {
      icon: "🧠",
      title: "Persona Creation",
      description:
        "Forge unique AI personas with distinct traits, expertise, and communication styles.",
    },
    {
      icon: "💬",
      title: "Smart Conversations",
      description:
        "Engage in meaningful dialogues with personas that remember context and evolve.",
    },
    {
      icon: "🎯",
      title: "Task Execution",
      description:
        "Let your personas handle specific tasks with their unique approach and expertise.",
    },
    {
      icon: "📈",
      title: "Memory & Evolution",
      description:
        "Watch your personas grow and adapt through interactions and feedback.",
    },
  ];

  return (
    <section
      id={id}
      className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 text-white"
    >
      <h2 className="text-center text-4xl md:text-5xl font-extrabold mb-16">
        Core Features
      </h2>
      <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
          >
            <div className="w-16 h-16 text-2xl flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 mb-6">
              {f.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
            <p className="text-slate-300 leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
