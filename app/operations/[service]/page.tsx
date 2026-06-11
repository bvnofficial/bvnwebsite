import { notFound } from "next/navigation";
import { operationsServices, getOperationsService } from "@/lib/operations-services";
import { ogImage } from "@/lib/og";
import ServicePageClient from "./ServicePageClient";

export async function generateStaticParams() {
  return operationsServices.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }: { params: { service: string } }) {
  const service = getOperationsService(params.service);
  if (!service) return {};
  const canonical = `https://www.bvnofficial.com/operations/${service.slug}`;
  return {
    title: `${service.title} Philippines — BVN Operations Automation`,
    description: service.heroSubtext,
    keywords: `${service.title.toLowerCase()} Philippines, ${service.title.toLowerCase()} services Philippines, business automation Philippines`,
    openGraph: {
      title: `${service.title} Philippines — BVN Operations Automation`,
      description: service.heroSubtext,
      url: canonical,
      type: "website",
      images: [ogImage({ title: service.title, eyebrow: "Operations Service", theme: "blue" })],
    },
    alternates: {
      canonical,
    },
  };
}

export default function OperationsServicePage({ params }: { params: { service: string } }) {
  const service = getOperationsService(params.service);
  if (!service) notFound();
  return <ServicePageClient service={service} />;
}
