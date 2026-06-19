import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const companies = await prisma.company.findMany({
    select: { id: true, name: true, email: true, createdAt: true, _count: { select: { jobs: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(companies);
}

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "name, email y password son requeridos" },
      { status: 400 }
    );
  }

  // TODO: hashear password (ej. bcrypt) antes de producción
  const company = await prisma.company.create({ data: { name, email, password } });

  return NextResponse.json(
    { id: company.id, name: company.name, email: company.email },
    { status: 201 }
  );
}
