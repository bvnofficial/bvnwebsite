import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice Generator – Create & Download PDF Invoices Free | BVN Apps",
  description:
    "Create professional invoices instantly. Add your logo, line items, taxes and download as PDF. Free, no signup required.",
};

export default function InvoiceGeneratorPage() {
  return (
    <div className="w-full h-screen pt-16 md:pt-20">
      <iframe
        src="/invoice-generator.html"
        className="w-full h-full border-0"
        title="Invoice Generator"
        loading="lazy"
      />
    </div>
  );
}
