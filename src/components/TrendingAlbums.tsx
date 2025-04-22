import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function TrendingAlbums() {
  const albums = [
    {
      title: "IN RAINBOWS",
      artist: "RADIOHEAD",
      rating: "4.89",
      image: "/api/placeholder/400/400", // Using a placeholder image
    },
    {
      title: "BLONDE",
      artist: "FRANK OCEAN",
      rating: "4.85",
      image: "/api/placeholder/400/400", // Using a placeholder image
    },
    {
      title: "VESPERTINE",
      artist: "BJÖRK",
      rating: "4.82",
      image: "/api/placeholder/400/400", // Using a placeholder image
    },
  ];

  return (
    <section className="py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-black">TOP RATED THIS WEEK</h2>
        <Button className="bg-black text-white px-6 py-2 rounded-[4px] font-bold hover:translate-x-1 hover:-translate-y-1 transition">
          VIEW ALL
        </Button>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {albums.map((album, index) => (
          <Link href="#" key={index} className="group cursor-pointer">
            <div className="bg-[#f0f0f0] p-4 rounded-[4px] border-4 border-black group-hover:translate-x-1 group-hover:-translate-y-1 transition">
              <div className="aspect-square mb-4 overflow-hidden rounded-[4px] border-2 border-black relative">
                <Image
                  src={album.image}
                  alt={album.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{album.title}</h3>
                  <p className="font-mono text-sm">{album.artist}</p>
                </div>
                <div className="bg-[#FF3B3B] text-white px-3 py-1 rounded-[4px] font-mono text-sm">
                  {album.rating}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
