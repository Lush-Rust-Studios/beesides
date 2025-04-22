import { Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeaturedSection() {
  return (
    <div className="bg-[#FFE14D] rounded-[4px] border-4 border-black p-6 relative overflow-hidden">
      <div className="absolute top-4 right-4 flex gap-2">
        <span className="bg-[#FF3B3B] text-white font-mono text-sm px-3 py-1 rounded-[4px] border-2 border-black">
          LIVE BETA
        </span>
        <span className="bg-white text-black font-mono text-sm px-3 py-1 rounded-[4px] border-2 border-black flex items-center gap-1">
          <Eye size={14} />
          3.67K USERS
        </span>
      </div>
      <div className="mt-16">
        <h1 className="text-4xl font-black mb-4 leading-tight">
          RATE YOUR RECORDS.
          <br />
          DISCOVER NEW SOUNDS.
          <br />
          JOIN THE CONVERSATION.
        </h1>
        <p className="font-mono mb-6">
          Beesides is the ultimate platform for music enthusiasts, collectors,
          and critics.
        </p>
        <Button className="bg-black text-white font-bold px-8 py-3 rounded-[4px] inline-flex items-center gap-2 hover:translate-x-1 hover:-translate-y-1 transition">
          BECOME A MEMBER
          <ArrowRight size={16} />
        </Button>
      </div>
      <div className="mt-12 pt-8 border-t border-black/20">
        <div className="flex items-center justify-between">
          <button className="text-sm font-bold">LEARN MORE</button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF3B3B] rounded-[4px] border-2 border-black flex items-center justify-center text-white text-sm font-bold">
              295
            </div>
            <span className="font-mono text-sm">NEW REVIEWS TODAY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
