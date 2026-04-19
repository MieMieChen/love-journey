import { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";

type SiteShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  spotlight?: ReactNode;
  children: ReactNode;
};

export function SiteShell({
  eyebrow,
  title,
  description,
  spotlight,
  children,
}: SiteShellProps) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-16 pt-10 sm:px-10">
        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--ink-soft)]">{eyebrow}</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-[var(--ink)] sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--ink-soft)]">{description}</p>
          </div>

          <div className="justify-self-end rounded-[32px] border border-dashed border-[var(--line)] bg-white/40 px-5 py-6 text-sm leading-7 text-[var(--ink-soft)]">
            <p className="font-medium text-[var(--ink)]">设计主线</p>
            <p className="mt-2">
              温柔拍立得手账风，避免婚庆模板感，用奶油白、蜜桃粉、鼠尾草绿和牛皮纸色做出长期可用的亲密氛围。
            </p>
          </div>
        </section>

        {spotlight}
        {children}
      </main>
    </>
  );
}
