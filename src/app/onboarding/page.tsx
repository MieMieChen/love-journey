import { redirect } from "next/navigation";

import { completeOnboardingAction } from "@/app/actions";
import { PaperCard } from "@/components/paper-card";
import { getDefaultCoupleSlug, getViewerState } from "@/lib/auth";

export default async function OnboardingPage() {
  const viewer = await getViewerState();

  if (!viewer.user) {
    redirect("/login");
  }

  if (viewer.coupleId) {
    redirect("/");
  }

  const defaultSlug = getDefaultCoupleSlug();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-14 sm:px-10">
      <PaperCard
        tone="sage"
        title="完成你的加入设置"
        description="第一次登录后，需要建立个人资料并加入默认的双人空间。"
      >
        <form action={completeOnboardingAction} className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[var(--ink)]">显示名字</span>
            <input
              type="text"
              name="displayName"
              required
              defaultValue={viewer.user.email?.split("@")[0] ?? ""}
              className="w-full rounded-[18px] border border-[var(--line)] bg-white/85 px-4 py-3 text-sm outline-none focus:border-[var(--accent-strong)]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[var(--ink)]">站点代号</span>
            <input
              type="text"
              name="coupleSlug"
              defaultValue={defaultSlug}
              className="w-full rounded-[18px] border border-[var(--line)] bg-white/85 px-4 py-3 text-sm outline-none focus:border-[var(--accent-strong)]"
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              完成加入
            </button>
          </div>
        </form>
      </PaperCard>
    </main>
  );
}
