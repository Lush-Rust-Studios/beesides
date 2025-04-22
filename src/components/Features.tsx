import { Star, Users, Zap, BarChart3 } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Star,
      title: "ADVANCED RATING",
      description:
        "Rate albums with nuanced criteria and track your evolving music taste over time.",
      color: "bg-[#FF3B3B]",
    },
    {
      icon: Zap,
      title: "SMART DISCOVERY",
      description:
        "Find new music with our powerful recommendation engine based on your preferences.",
      color: "bg-[#FFE14D]",
    },
    {
      icon: Users,
      title: "VIBRANT COMMUNITY",
      description:
        "Connect with like-minded music fans, share collections, and discuss your favorites.",
      color: "bg-[#00CF7F]",
    },
    {
      icon: BarChart3,
      title: "DETAILED ANALYTICS",
      description:
        "Gain insights into your listening habits with comprehensive statistics and visualizations.",
      color: "bg-[#33A9FF]",
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-black mb-4">
          WHY MUSIC ENTHUSIASTS LOVE BEESIDES
        </h2>
        <p className="text-xl font-mono">
          A next-generation platform built to enhance how you catalog, rate, and
          discover music.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-[4px] border-4 border-black hover:translate-x-1 hover:-translate-y-1 transition"
          >
            <div
              className={`${feature.color} w-12 h-12 rounded-[4px] flex items-center justify-center mb-4 border-2 border-black`}
            >
              <feature.icon className="text-black" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="font-mono">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
