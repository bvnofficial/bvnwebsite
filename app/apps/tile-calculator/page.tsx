import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tile Calculator – Draw Your Room & Count Tiles | BVN Apps",
  description:
    "Free visual tile calculator. Draw your room or floor area on a grid, choose your tile size, and instantly see how many tiles you need — with a live tile overlay preview.",
};

export default function TileCalculatorPage() {
  return (
    <div className="w-full h-screen pt-16 md:pt-20">
      <iframe
        src="/tile-calculator.html"
        className="w-full h-full border-0"
        title="Tile Calculator"
        loading="lazy"
      />
    </div>
  );
}
