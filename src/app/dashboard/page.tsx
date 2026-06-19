import { prisma } from "@/lib/prisma";

async function getStats() {
  const [totalJobs, activeJobs, totalApplicants, totalApplications] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where: { status: "ACTIVE" } }),
    prisma.applicant.count(),
    prisma.application.count(),
  ]);
  return { totalJobs, activeJobs, totalApplicants, totalApplications };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Ofertas totales", value: stats.totalJobs },
    { label: "Ofertas activas", value: stats.activeJobs },
    { label: "Postulantes", value: stats.totalApplicants },
    { label: "Postulaciones", value: stats.totalApplications },
  ];

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-3xl font-semibold">{c.value}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
