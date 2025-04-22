import { Music, Users, Star, Headphones } from "lucide-react";

export function StatsGrid() {
  const stats = [
    {
      label: "ALBUMS RATED",
      value: "12.4M",
      icon: Music,
      color: "bg-[#FF3B3B]",
    },
    {
      label: "ACTIVE USERS",
      value: "89.2K",
      icon: Users,
      color: "bg-[#FFE14D]",
    },
    {
      label: "AVG RATINGS",
      value: "1,242",
      icon: Star,
      color: "bg-[#00CF7F]",
    },
    {
      label: "LISTENING NOW",
      value: "3.1K",
      icon: Headphones,
      color: "bg-[#33A9FF]",
    },
  ];

  return (
    <section className="py-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} p-6 rounded-[4px] border-4 border-black hover:translate-x-1 hover:-translate-y-1 transition`}
          >
            <stat.icon className="w-8 h-8 mb-4" />
            <div className="font-black text-3xl mb-2">{stat.value}</div>
            <div className="font-mono text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
