import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/dashboard/stats
// Diseño deliberado: todos los counts se calculan con prisma.count()/groupBy()
// directo contra la DB. Nunca se trae una lista paginada y se cuenta su
// longitud en memoria — esa fue la causa del bug de "getDashboardStats"
// undercounting en el proyecto anterior (PHP). Acá no existe ese camino.
export async function GET() {
  const [totalJobs, activeJobs, totalApplicants, totalApplications, applicationsByStatus] =
    await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { status: "ACTIVE" } }),
      prisma.applicant.count(),
      prisma.application.count(),
      prisma.application.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
    ]);

  return NextResponse.json({
    totalJobs,
    activeJobs,
    totalApplicants,
    totalApplications,
    applicationsByStatus: applicationsByStatus.map((s) => ({
      status: s.status,
      count: s._count._all,
    })),
  });
}
