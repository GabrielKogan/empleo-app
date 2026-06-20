import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ApplyButton from "@/components/ApplyButton";

export const dynamic = "force-dynamic";

async function getJobs() {
  return prisma.job.findMany({
    where: { status: "ACTIVE" },
    include: { company: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function Home() {
  const jobs = await getJobs();

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Ofertas de empleo</h1>
        <nav className="flex gap-4 text-sm">
          <Link href="/companies/new" className="underline">
            + Empresa
          </Link>
          <Link href="/jobs/new" className="underline">
            + Oferta
          </Link>
          <Link href="/applicants/new" className="underline">
            + Postulante
          </Link>
          <Link href="/dashboard" className="underline">
            Dashboard
          </Link>
        </nav>
      </header>

      {jobs.length === 0 && (
        <p className="text-gray-500">
          No hay ofertas activas todavía. Creá una desde <code>POST /api/jobs</code>.
        </p>
      )}

      <ul className="space-y-4">
        {jobs.map((job) => (
          <li key={job.id} className="border rounded-lg p-4">
            <h2 className="font-semibold">{job.title}</h2>
            <p className="text-sm text-gray-500">{job.company.name} · {job.location ?? "Remoto"}</p>
            <p className="mt-2 text-sm">{job.description}</p>
            <ApplyButton jobId={job.id} />
          </li>
        ))}
      </ul>
    </main>
  );
}
