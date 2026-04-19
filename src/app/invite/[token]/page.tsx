import { redirect } from "next/navigation";

import { acceptInviteAction } from "@/app/actions";
import { PaperCard } from "@/components/paper-card";
import { getViewerState } from "@/lib/auth";
import { getInviteByToken } from "@/lib/queries";
import { formatDate, formatDaysFromNow } from "@/lib/site-data";

type InvitePageProps = {
  params: Promise<{ token: string }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const [viewer, invite] = await Promise.all([getViewerState(), getInviteByToken(token)]);

  if (!invite) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-14 sm:px-10">
        <PaperCard
          tone="sand"
          title="这条邀请已经失效"
          description="邀请可能已经过期、被使用过，或者链接本身不正确。让对方重新生成一条新的邀请链接即可。"
        >
          <p className="text-sm leading-7 text-[var(--ink-soft)]">
            你可以回到首页重新生成邀请链接，再把新的链接发给对象。
          </p>
        </PaperCard>
      </main>
    );
  }

  if (!viewer.user) {
    redirect(`/login?next=${encodeURIComponent(`/invite/${token}`)}`);
  }

  if (viewer.coupleId === invite.coupleId) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-14 sm:px-10">
      <PaperCard
        tone="rose"
        title={`加入「${invite.coupleTitle}」`}
        description={`${invite.inviterName} 邀请你进入同一个双人空间。接受后，你就能一起查看和记录日记、相册、足迹与纪念日。`}
      >
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4 rounded-[24px] border border-dashed border-[var(--line)] bg-white/40 p-5 text-sm leading-7 text-[var(--ink-soft)]">
            <p>
              邀请有效期：
              <span className="ml-2 font-medium text-[var(--ink)]">
                {formatDate(invite.expiresAt)} · {formatDaysFromNow(invite.expiresAt)}
              </span>
            </p>
            {invite.note && (
              <div className="rounded-[18px] bg-white/70 px-4 py-3">
                <p className="text-sm font-medium text-[var(--ink)]">邀请备注</p>
                <p className="mt-2">{invite.note}</p>
              </div>
            )}
            <p>
              当前登录邮箱：
              <span className="ml-2 font-medium text-[var(--ink)]">{viewer.user.email}</span>
            </p>
          </div>

          <form action={acceptInviteAction} className="space-y-4">
            <input type="hidden" name="token" value={token} />
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--ink)]">显示名字</span>
              <input
                type="text"
                name="displayName"
                required
                defaultValue={viewer.profile?.display_name || viewer.user.email?.split("@")[0] || ""}
                className="input-field"
              />
            </label>
            <button type="submit" className="primary-button">
              接受邀请并加入
            </button>
          </form>
        </div>
      </PaperCard>
    </main>
  );
}
