import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const applicants = await prisma.applicant.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(applicants);
}

export async function POST(req: NextRequest) {
  const { name, email, resumeUrl } = await req.json();

  if (!name || !email) {
    return NextResponse.json(
      { error: "name y email son requeridos" },
      { status: 400 }
    );
  }

  const applicant = await prisma.applicant.create({
    data: { name, email, resumeUrl },
  });

  return NextResponse.json(applicant, { status: 201 });
}
