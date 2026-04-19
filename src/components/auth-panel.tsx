import Link from "next/link";

import { signOutAction } from "@/app/actions";
import { getViewerState } from "@/lib/auth";

export async function AuthPanel() {
  const viewer = await getViewerState();

  if (!viewer.configured) {
    return (
      <div className="rounded-[24px] border border-dashed border-[var(--line)] bg-white/40 px-4 py-3 text-sm text-[var(--ink-soft)]">
        还没配置 Supabase，当前展示的是示例数据。
      </div>
    );
  }

  if (!viewer.user) {
    return (
      <Link href="/login" className="nav-pill">
        登录私密空间
      </Link>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="rounded-full border border-white/70 bg-white/65 px-4 py-2 text-sm text-[var(--ink-soft)]">
        {viewer.profile?.display_name || viewer.user.email}
      </div>
      {!viewer.coupleId && (
        <Link href="/onboarding" className="nav-pill">
          完成加入
        </Link>
      )}
      <form action={signOutAction}>
        <button type="submit" className="nav-pill cursor-pointer">
          退出
        </button>
      </form>
    </div>
  );
}
