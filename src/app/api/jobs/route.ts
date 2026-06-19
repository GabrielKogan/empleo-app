import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/jobs?status=ACTIVE&companyId=...
// Importante: este endpoint siempre devuelve TODOS los resultados que matchean
// el filtro (sin paginación), porque listamos ofertas, no miles de registros.
// Si en el futuro se agrega paginación, debe quedar como opt-in (?page=) para
// no romper a quienes esperan el dataset completo (lección aprendida en el TP anterior).
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const companyId = searchParams.get("companyId");

  const jobs = await prisma.job.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
      ...(companyId ? { companyId } : {}),
    },
    include: { company: true, _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(jobs);
}

// POST /api/jobs  { title, description, location, companyId }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, location, companyId } = body;

  if (!title || !description || !companyId) {
    return NextResponse.json(
      { error: "title, description y companyId son requeridos" },
      { status: 400 }
    );
  }

  const job = await prisma.job.create({
    data: { title, description, location, companyId },
  });

  return NextResponse.json(job, { status: 201 });
}
