import { notFound } from "next/navigation";
import { operationsServices, getOperationsService } from "@/lib/operations-services";
import ServicePageClient from "./ServicePageClient";

export async function generateStaticParams() {
  return operationsServices.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }: { params: { service: string } }) {
  const service = getOperationsService(params.service);
  if (!service) return {};
  return {
    title: `${service.title} — BVN Operations`,
    description: service.heroSubtext,
  };
}

export default function OperationsServicePage({ params }: { params: { service: string } }) {
  const service = getOperationsService(params.service);
  if (!service) notFound();
  return <ServicePageClient service={service} />;
}
