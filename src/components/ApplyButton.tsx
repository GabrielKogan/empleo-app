"use client";

import { useEffect, useState } from "react";

type Applicant = { id: string; name: string };

export default function ApplyButton({ jobId }: { jobId: string }) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [applicantId, setApplicantId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch("/api/applicants")
      .then((res) => res.json())
      .then((data: Applicant[]) => {
        setApplicants(data);
        if (data.length > 0) setApplicantId(data[0].id);
      });
  }, [open]);

  async function handleApply() {
    if (!applicantId) return;
    setStatus("loading");
    setMessage(null);

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, applicantId }),
    });

    if (res.ok) {
      setStatus("done");
      setMessage("¡Postulación enviada!");
    } else {
      const data = await res.json().catch(() => ({}));
      setStatus("error");
      setMessage(data.error ?? "Error al postularse");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm underline mt-2"
      >
        Postularme
      </button>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-2 text-sm">
      {applicants.length === 0 ? (
        <span className="text-gray-500">
          No hay postulantes creados todavía.{" "}
          <a href="/applicants/new" className="underline">
            Creá uno
          </a>
          .
        </span>
      ) : (
        <>
          <select
            className="border rounded p-1"
            value={applicantId}
            onChange={(e) => setApplicantId(e.target.value)}
          >
            {applicants.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleApply}
            disabled={status === "loading"}
            className="bg-black text-white rounded px-3 py-1 disabled:opacity-50"
          >
            {status === "loading" ? "Enviando..." : "Confirmar"}
          </button>
        </>
      )}
      {message && (
        <span className={status === "error" ? "text-red-600" : "text-green-700"}>
          {message}
        </span>
      )}
    </div>
  );
}
