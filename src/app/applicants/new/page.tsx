"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewApplicantPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/applicants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, resumeUrl: resumeUrl || undefined }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Error al crear el postulante");
      return;
    }

    router.push("/");
  }

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nuevo postulante</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            className="w-full border rounded-lg p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded-lg p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Link a CV (opcional)
          </label>
          <input
            className="w-full border rounded-lg p-2"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white rounded-lg px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear postulante"}
        </button>
      </form>
    </main>
  );
}
