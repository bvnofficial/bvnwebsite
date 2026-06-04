import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EQ 80th — Script Prompter",
  robots: { index: false, follow: false },
};

export default function EQPrompterPage() {
  return (
    <div className="fixed inset-0 z-[9999]">
      <iframe
        src="/scripts/EQ_Final_Prompter.html"
        className="w-full h-full"
        style={{ border: "none", display: "block" }}
      />
    </div>
  );
}
