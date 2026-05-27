import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Compressor – Free Online Image Optimizer | BVN Apps",
  description:
    "Compress and resize images free in your browser. Supports JPEG, PNG, WebP. No upload to server, 100% private. Reduce file size instantly.",
};

export default function ImageCompressorPage() {
  return (
    <div className="w-full h-screen pt-16 md:pt-20">
      <iframe
        src="/image-compressor.html"
        className="w-full h-full border-0"
        title="Image Compressor"
        loading="lazy"
      />
    </div>
  );
}
