import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/applications  { jobId, applicantId }
export async function POST(req: NextRequest) {
  const { jobId, applicantId } = await req.json();

  if (!jobId || !applicantId) {
    return NextResponse.json(
      { error: "jobId y applicantId son requeridos" },
      { status: 400 }
    );
  }

  try {
    const application = await prisma.application.create({
      data: { jobId, applicantId },
    });
    return NextResponse.json(application, { status: 201 });
  } catch (err: unknown) {
    // Violación del unique([jobId, applicantId]) -> ya se había postulado antes
    return NextResponse.json(
      { error: "El postulante ya aplicó a esta oferta" },
      { status: 409 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");
  const applicantId = searchParams.get("applicantId");

  const applications = await prisma.application.findMany({
    where: {
      ...(jobId ? { jobId } : {}),
      ...(applicantId ? { applicantId } : {}),
    },
    include: { job: true, applicant: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(applications);
}
