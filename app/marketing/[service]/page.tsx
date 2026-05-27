import { notFound } from "next/navigation";
import { marketingServices, getMarketingService } from "@/lib/marketing-services";
import ServicePageClient from "./ServicePageClient";

export async function generateStaticParams() {
  return marketingServices.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }: { params: { service: string } }) {
  const service = getMarketingService(params.service);
  if (!service) return {};
  return {
    title: `${service.title} — BVN Marketing`,
    description: service.heroSubtext,
  };
}

export default function MarketingServicePage({ params }: { params: { service: string } }) {
  const service = getMarketingService(params.service);
  if (!service) notFound();
  return <ServicePageClient service={service} />;
}
