import type { NextPage } from "next";
import { notFound } from "next/navigation";

import TenantDetailComponent from "@/components/dashboard/property-owner-dashboard/tenants/tenant-detail";

interface TenantDetailPageProps {
  params: Promise<{ id: string }>;
}

const TenantDetailPage: NextPage<TenantDetailPageProps> = async ({
  params,
}) => {
  const { id } = await params;

  // Server-side validation
  const tenantId = Number.parseInt(id);
  if (isNaN(tenantId) || tenantId <= 0) {
    notFound();
  }

  return <TenantDetailComponent tenantId={tenantId} />;
};

export default TenantDetailPage;
