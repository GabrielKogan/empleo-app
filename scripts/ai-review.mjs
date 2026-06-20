// Agente autónomo de revisión de código.
// Se ejecuta en cada Pull Request (ver .github/workflows/ai-pr-review.yml):
// 1. Obtiene el diff del PR.
// 2. Le pide a Claude una revisión enfocada en bugs, seguridad y casos borde.
// 3. Publica el resultado como comentario en el PR usando la API de GitHub.

import { execSync } from "node:child_process";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPOSITORY; // "owner/repo"
const PR_NUMBER = process.env.PR_NUMBER;

if (!ANTHROPIC_API_KEY) {
  console.log("No hay ANTHROPIC_API_KEY configurada, se omite la revisión.");
  process.exit(0);
}

function getDiff() {
  try {
    return execSync(
      "git diff origin/main...HEAD -- . ':(exclude)package-lock.json'",
      { maxBuffer: 1024 * 1024 * 10 }
    ).toString();
  } catch (err) {
    console.error("No se pudo obtener el diff:", err.message);
    return "";
  }
}

async function getReview(diff) {
  const prompt = `Sos un revisor de código senior. Te paso el diff de un Pull Request
de una app Next.js + Prisma. Dame una revisión BREVE (máximo 8 líneas) en español,
enfocada solo en: bugs reales, problemas de seguridad, y casos borde no manejados.
Si no encontrás problemas, decilo en una sola línea. No repitas el diff, no
expliques cosas obvias, no halagues el código.

Diff:
${diff.slice(0, 15000)}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Anthropic API error: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

async function postComment(body) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/issues/${PR_NUMBER}/comments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: `### 🤖 Revisión automática (Claude)\n\n${body}`,
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error: ${res.status} ${text}`);
  }
}

async function main() {
  const diff = getDiff();

  if (!diff.trim()) {
    console.log("Diff vacío, nada para revisar.");
    return;
  }

  const review = await getReview(diff);
  console.log("Revisión generada:\n", review);

  if (GITHUB_TOKEN && REPO && PR_NUMBER) {
    await postComment(review);
    console.log("Comentario publicado en el PR.");
  } else {
    console.log("Faltan variables de GitHub, se omite el comentario.");
  }
}

main().catch((err) => {
  console.error("Error en el agente de revisión:", err);
  process.exit(1);
});
