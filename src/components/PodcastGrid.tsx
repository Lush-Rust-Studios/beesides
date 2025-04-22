import Image from "next/image";
import Link from "next/link";

export function PodcastGrid() {
  const podcasts = [
    {
      title: "RECORD THEORY",
      author: "ALEX EDWARDS",
      image: "/api/placeholder/400/400",
      color: "bg-[#FF3B3B]/20",
    },
    {
      title: "NEW RELEASES WEEKLY",
      author: "MAYA ALEXANDER",
      image: "/api/placeholder/400/400",
      color: "bg-[#FFE14D]/20",
    },
    {
      title: "HIDDEN GEMS",
      author: "SAM HAWKINS",
      image: "/api/placeholder/400/400",
      color: "bg-[#33A9FF]/20",
    },
    {
      title: "VINYL HOUR",
      author: "JEN SIMMONS",
      image: "/api/placeholder/400/400",
      color: "bg-[#00CF7F]/20",
    },
    {
      title: "CLASSICS REVISITED",
      author: "DAVID HOWARD",
      image: "/api/placeholder/400/400",
      color: "bg-[#FF3B3B]/20",
    },
  ];

  return (
    <div className="py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-black">MUSIC PODCASTS</h2>
        <button className="bg-black text-white px-6 py-2 rounded-[4px] border-4 border-black font-bold hover:translate-x-1 hover:-translate-y-1 transition">
          EXPLORE MORE
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {podcasts.map((podcast, index) => (
          <div
            key={index}
            className={`${podcast.color} rounded-[4px] border-4 border-black p-4 hover:translate-x-1 hover:-translate-y-1 transition`}
          >
            <div className="aspect-square mb-4 rounded-[4px] border-2 border-black overflow-hidden relative">
              <Image
                src={podcast.image}
                alt={podcast.title}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="font-bold mb-1">{podcast.title}</h3>
            <p className="text-sm font-mono mb-4">BY: {podcast.author}</p>
            <Link
              href="#"
              className="block w-full bg-white rounded-[4px] py-2 text-center border-2 border-black font-bold hover:bg-black hover:text-white transition"
            >
              LISTEN NOW
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
