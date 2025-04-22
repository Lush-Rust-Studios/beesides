import Link from "next/link";
import { ArrowRight, Disc } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="py-12">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-black text-white p-8 rounded-[4px] border-4 border-black relative overflow-hidden">
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="bg-[#FF3B3B] px-4 py-1 rounded-[4px] text-sm font-mono">
              LIVE BETA
            </span>
            <span className="bg-[#FFE14D] text-black px-4 py-1 rounded-[4px] text-sm font-mono">
              24.1K USERS
            </span>
          </div>
          <div className="mt-16">
            <h1 className="text-5xl font-black mb-6 leading-tight">
              RATE MUSIC.
              <br />
              DISCOVER MORE.
              <br />
              GET WEIRD.
            </h1>
            <p className="text-lg mb-8 font-mono">
              The next evolution of music cataloging. No algorithms, just vibes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-[#FF3B3B] text-white px-8 py-3 rounded-[4px] font-bold hover:translate-x-1 hover:-translate-y-1 transition">
                START RATING
              </Button>
              <Button className="bg-white text-black px-8 py-3 rounded-[4px] font-bold flex items-center gap-2 hover:translate-x-1 hover:-translate-y-1 transition">
                EXPLORE LIBRARY <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-[#FFE14D] p-8 rounded-[4px] border-4 border-black">
          <div className="font-mono mb-4">CURRENTLY TRENDING</div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white p-4 rounded-[4px] border-2 border-black flex items-center gap-4 hover:translate-x-1 hover:-translate-y-1 transition cursor-pointer"
              >
                <Disc className="w-12 h-12" />
                <div>
                  <div className="font-bold">TOP ALBUM #{item}</div>
                  <div className="font-mono text-sm">
                    4,231 ratings this week
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
