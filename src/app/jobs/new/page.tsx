"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Company = { id: string; name: string };

export default function NewJobPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/companies")
      .then((res) => res.json())
      .then((data: Company[]) => {
        setCompanies(data);
        if (data.length > 0) setCompanyId(data[0].id);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, location, companyId }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Error al crear la oferta");
      return;
    }

    router.push("/");
  }

  return (
    <main className="p-8 max-w-md mx-auto">
      <Link href="/" className="text-sm text-gray-500 hover:underline">
        ← Volver al inicio
      </Link>
      <h1 className="text-2xl font-bold mb-6 mt-2">Nueva oferta de empleo</h1>

      {companies.length === 0 && (
        <p className="text-sm text-gray-500 mb-4">
          No hay empresas todavía.{" "}
          <a href="/companies/new" className="underline">
            Creá una primero
          </a>
          .
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Empresa</label>
          <select
            className="w-full border rounded-lg p-2"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            required
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            className="w-full border rounded-lg p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            className="w-full border rounded-lg p-2"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ubicación</label>
          <input
            className="w-full border rounded-lg p-2"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Remoto, Neuquén, etc."
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading || companies.length === 0}
          className="bg-black text-white rounded-lg px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear oferta"}
        </button>
      </form>
    </main>
  );
}
