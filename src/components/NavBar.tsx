"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Ofertas" },
  { href: "/companies/new", label: "+ Empresa" },
  { href: "/jobs/new", label: "+ Oferta" },
  { href: "/applicants/new", label: "+ Postulante" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="border-b sticky top-0 bg-white z-10">
      <nav className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-1 overflow-x-auto">
        <Link href="/" className="font-bold mr-4 whitespace-nowrap">
          🧑‍💼 Empleo App
        </Link>
        {LINKS.map((link) => {
          const isActive =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
