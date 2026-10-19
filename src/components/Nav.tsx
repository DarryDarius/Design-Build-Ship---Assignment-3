"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { focusRing } from "./styles";

const links = [
  { href: "/", label: "Today" },
  { href: "/log", label: "Log" },
  { href: "/week", label: "This week" },
];

/** Shared header: where you are, and one click back to anywhere. */
export function Nav() {
  const path = usePathname();
  return (
    <header className="border-b border-calm-border">
      <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 sm:px-6">
        <Link href="/" className={`rounded-sm font-display text-xl text-calm-text ${focusRing}`}>
          Study Log
        </Link>
        <nav aria-label="Main">
          <ul className="flex gap-1">
            {links.map((l) => {
              const current = path === l.href;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={current ? "page" : undefined}
                    className={`inline-flex min-h-9 items-center rounded-md px-3 text-sm transition ${focusRing} ${
                      current ? "bg-calm-surface font-medium text-calm-text ring-1 ring-calm-border" : "text-calm-muted hover:bg-calm-surface hover:text-calm-text"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
