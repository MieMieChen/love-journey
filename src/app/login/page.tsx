import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";
import { PaperCard } from "@/components/paper-card";
import { getViewerState } from "@/lib/auth";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const viewer = await getViewerState();
  const { next } = await searchParams;

  if (viewer.user && viewer.coupleId) {
    redirect("/");
  }

  if (viewer.user && !viewer.coupleId) {
    redirect("/onboarding");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-8 px-6 py-14 sm:px-10">
      <PaperCard
        tone="rose"
        title="登录私密双人空间"
        description="使用邮箱魔法链接登录。登录成功后，如果还没加入站点，会自动进入加入流程。"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <LoginForm next={next} />
          </div>
          <div className="rounded-[26px] border border-dashed border-[var(--line)] bg-white/40 p-5 text-sm leading-7 text-[var(--ink-soft)]">
            <p className="font-medium text-[var(--ink)]">登录后会解锁：</p>
            <ul className="mt-3 space-y-2">
              <li>日记、地点、纪念日、胶囊和愿望的私密内容</li>
              <li>照片上传到 Supabase Storage</li>
              <li>只对双人成员开放的数据库内容</li>
            </ul>
          </div>
        </div>
      </PaperCard>
    </main>
  );
}
