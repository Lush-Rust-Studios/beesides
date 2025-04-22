import { MessageCircle, Heart, BarChart2 } from "lucide-react";
import Image from "next/image";

export function CommunitySection() {
  const reviews = [
    {
      user: {
        name: "EMMA WILSON",
        avatar: "/api/placeholder/200/200",
        description: "MUSIC JOURNALIST • 342 REVIEWS",
      },
      album: {
        title: "TO PIMP A BUTTERFLY",
        artist: "KENDRICK LAMAR",
        cover: "/api/placeholder/100/100",
        rating: 5,
      },
      content:
        "A masterpiece that blends jazz, funk, and soul with powerful lyrics. One of the most important albums of the decade.",
      likes: 124,
      comments: 32,
    },
    {
      user: {
        name: "ALEX RODRIGUEZ",
        avatar: "/api/placeholder/200/200",
        description: "VINYL COLLECTOR • 187 REVIEWS",
      },
      album: {
        title: "IN RAINBOWS",
        artist: "RADIOHEAD",
        cover: "/api/placeholder/100/100",
        rating: 5,
      },
      content:
        "The band's creative peak. Perfect production and songwriting with an emotional depth that still resonates years later.",
      likes: 98,
      comments: 24,
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-black mb-4">
            JOIN OUR VIBRANT MUSIC COMMUNITY
          </h2>
          <p className="text-xl font-mono">
            Connect with fellow music enthusiasts, share your collections, and
            discover new favorites.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-[#f0f0f0] p-6 rounded-[4px] border-4 border-black hover:translate-x-1 hover:-translate-y-1 transition"
            >
              <div className="flex gap-4 mb-6">
                <div className="relative w-12 h-12 overflow-hidden rounded-[4px] border-2 border-black">
                  <Image
                    src={review.user.avatar}
                    alt={review.user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold">{review.user.name}</p>
                  <p className="text-sm font-mono">{review.user.description}</p>
                </div>
              </div>

              <div className="bg-white rounded-[4px] p-4 border-2 border-black mb-4">
                <div className="flex gap-3 mb-3">
                  <div className="relative w-16 h-16 overflow-hidden rounded-[4px] border-2 border-black">
                    <Image
                      src={review.album.cover}
                      alt={review.album.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold">{review.album.title}</p>
                    <p className="text-sm font-mono">{review.album.artist}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.album.rating
                              ? "text-[#FFE14D]"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="font-mono">"{review.content}"</p>
                <div className="flex gap-4 mt-4 text-black text-sm">
                  <div className="flex items-center gap-1">
                    <Heart size={16} className="text-[#FF3B3B]" />
                    <span>{review.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={16} />
                    <span>{review.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
