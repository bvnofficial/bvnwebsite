import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Floor Plan Designer – Free Room Planner | BVN Apps",
  description:
    "Design your floor plan online for free. Draw rooms, add furniture, label spaces and export as PNG. No signup required.",
};

export default function FloorPlanDesignerPage() {
  return (
    <div className="w-full h-screen pt-16 md:pt-20">
      <iframe
        src="/floor-plan-designer.html"
        className="w-full h-full border-0"
        title="Floor Plan Designer"
        loading="lazy"
      />
    </div>
  );
}
