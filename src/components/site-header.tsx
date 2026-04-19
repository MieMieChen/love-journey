import Link from "next/link";

import { AuthPanel } from "@/components/auth-panel";

const navItems = [
  ["首页", "/"],
  ["日记", "/diary"],
  ["地图", "/map"],
  ["纪念日", "/anniversary"],
  ["相册", "/gallery"],
  ["胶囊", "/capsule"],
  ["愿望", "/wishlist"],
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 mx-auto w-full max-w-6xl px-6 pt-6 sm:px-10">
      <div className="rounded-full border border-white/70 bg-white/60 px-5 py-3 shadow-[var(--shadow-soft)] backdrop-blur-md">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--paper-rose)] text-sm font-semibold text-[var(--ink)]">
              LJ
            </span>
            <div>
              <p className="text-base font-semibold text-[var(--ink)]">心动存档</p>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--ink-soft)]">
                scrapbook style couple journal
              </p>
            </div>
          </Link>

          <div className="flex flex-col gap-3 lg:items-end">
            <nav className="flex flex-wrap gap-2">
              {navItems.map(([label, href]) => (
                <Link key={href} href={href} className="nav-pill">
                  {label}
                </Link>
              ))}
            </nav>
            <AuthPanel />
          </div>
        </div>
      </div>
    </header>
  );
}
