import { notFound } from "next/navigation";
import { marketingServices, getMarketingService } from "@/lib/marketing-services";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema, serviceSchema, faqSchema, jsonLdScript } from "@/lib/jsonld";
import { buildServiceFaqs } from "@/lib/service-faqs";
import ServiceFAQ from "@/components/ui/ServiceFAQ";
import ServicePageClient from "./ServicePageClient";

export async function generateStaticParams() {
  return marketingServices.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }: { params: { service: string } }) {
  const service = getMarketingService(params.service);
  if (!service) return {};
  const canonical = `https://www.bvnofficial.com/marketing/${service.slug}`;
  return {
    title: `${service.title} Philippines — BVN Marketing Agency`,
    description: service.heroSubtext,
    keywords: `${service.title.toLowerCase()} Philippines, ${service.title.toLowerCase()} agency Philippines, ${service.title.toLowerCase()} services Philippines`,
    openGraph: {
      title: `${service.title} Philippines — BVN Marketing Agency`,
      description: service.heroSubtext,
      url: canonical,
      type: "website",
      images: [ogImage({ title: service.title, eyebrow: "Marketing Service", theme: "orange" })],
    },
    alternates: {
      canonical,
    },
  };
}

export default function MarketingServicePage({ params }: { params: { service: string } }) {
  const service = getMarketingService(params.service);
  if (!service) notFound();

  const path = `/marketing/${service.slug}`;
  const breadcrumb = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Marketing", path: "/marketing" },
    { name: service.title, path },
  ]);
  const serviceLd = serviceSchema({
    name: service.title,
    description: service.shortDesc,
    path,
    category: "Digital Marketing",
  });
  const faqs = buildServiceFaqs(service, "Marketing");
  const faqLd = faqSchema(faqs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(serviceLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumb)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqLd)} />
      <ServicePageClient service={service} />
      <ServiceFAQ faqs={faqs} accent="orange" heading={`${service.title} — FAQs`} />
    </>
  );
}
