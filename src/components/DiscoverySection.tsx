import Image from "next/image";
import Link from "next/link";

export function DiscoverySection() {
  const albums = [
    {
      id: 1,
      title: "BLONDE",
      artist: "FRANK OCEAN",
      cover: "/api/placeholder/400/400",
      rating: 4.8,
      year: 2016,
      genre: "R&B",
    },
    {
      id: 2,
      title: "TO PIMP A BUTTERFLY",
      artist: "KENDRICK LAMAR",
      cover: "/api/placeholder/400/400",
      rating: 4.9,
      year: 2015,
      genre: "HIP-HOP",
    },
    {
      id: 3,
      title: "KID A",
      artist: "RADIOHEAD",
      cover: "/api/placeholder/400/400",
      rating: 4.7,
      year: 2000,
      genre: "ALTERNATIVE",
    },
    {
      id: 4,
      title: "FETCH THE BOLT CUTTERS",
      artist: "FIONA APPLE",
      cover: "/api/placeholder/400/400",
      rating: 4.6,
      year: 2020,
      genre: "ALTERNATIVE",
    },
  ];

  return (
    <section className="py-16 bg-[#f0f0f0]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
          <div>
            <h2 className="text-4xl font-black mb-2">TRENDING THIS WEEK</h2>
            <p className="font-mono max-w-2xl">
              The most discussed and highly-rated albums from our community.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <select className="px-4 py-2 border-4 border-black rounded-[4px] bg-white font-bold focus:outline-none hover:translate-x-1 hover:-translate-y-1 transition">
              <option>ALL GENRES</option>
              <option>ROCK</option>
              <option>HIP-HOP</option>
              <option>ELECTRONIC</option>
              <option>JAZZ</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {albums.map((album) => (
            <Link href="#" key={album.id} className="group">
              <div className="bg-white p-4 rounded-[4px] border-4 border-black group-hover:translate-x-1 group-hover:-translate-y-1 transition">
                <div className="relative aspect-square mb-4 overflow-hidden rounded-[4px] border-2 border-black">
                  <Image
                    src={album.cover}
                    alt={album.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{album.title}</h3>
                  <p className="font-mono text-sm mb-2">{album.artist}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#f0f0f0] px-2 py-1 rounded-[4px] text-xs font-mono border border-black">
                        {album.year}
                      </span>
                      <span className="bg-[#f0f0f0] px-2 py-1 rounded-[4px] text-xs font-mono border border-black">
                        {album.genre}
                      </span>
                    </div>
                    <div className="bg-[#FF3B3B] text-white px-2 py-1 rounded-[4px] font-mono text-sm">
                      {album.rating}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
