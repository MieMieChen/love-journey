import { createCapsuleAction } from "@/app/actions";
import { PaperCard } from "@/components/paper-card";
import { SiteShell } from "@/components/site-shell";
import { getViewerState } from "@/lib/auth";
import { getCapsules } from "@/lib/queries";
import { formatDate, formatDaysFromNow } from "@/lib/site-data";

export default async function CapsulePage() {
  const [capsules, viewer] = await Promise.all([getCapsules(), getViewerState()]);

  return (
    <SiteShell
      eyebrow="Capsule"
      title="留言胶囊页面原型"
      description="即时留言和时间胶囊是这个网站从记录工具变成情感空间的关键。"
    >
      {viewer.configured && viewer.user && viewer.coupleId && (
        <PaperCard tone="rose" title="写一封时间胶囊" description="内容会锁到设定时间，适合纪念日、生日或一年后的自己。">
          <form action={createCapsuleAction} className="grid gap-4 md:grid-cols-2">
            <input name="title" required placeholder="胶囊标题" className="input-field" />
            <input type="datetime-local" name="unlockAt" required className="input-field" />
            <textarea name="message" required placeholder="写给未来的内容" className="input-field min-h-36 md:col-span-2" />
            <div className="md:col-span-2">
              <button type="submit" className="primary-button">
                放进信封里
              </button>
            </div>
          </form>
        </PaperCard>
      )}

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <PaperCard tone="sage" title="页面结构" description="像信封、小卡片和封蜡信件，而不是聊天窗口。">
          <ol className="space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
            <li>1. 即时留言区：随时写给对方的一句小话。</li>
            <li>2. 时间胶囊区：设定某个日期或纪念日后才能开启。</li>
            <li>3. 已开启档案：回看已经打开过的信件和那天的心情。</li>
          </ol>
        </PaperCard>

        <PaperCard title="页面文案" description="突出‘留给未来的自己和对方’。">
          <p className="text-sm leading-7 text-[var(--ink-soft)]">
            推荐文案：“有些话不是现在说，是想在某个特别的日子里，被好好读到。” 页面按钮可用“写给未来”“今天偷偷放进信封里”“到那天再打开”。
          </p>
        </PaperCard>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {capsules.map((item) => (
          <PaperCard
            key={item.id}
            tone={item.status === "locked" ? "rose" : "paper"}
            title={item.title}
            description={`${item.author} · ${formatDate(item.unlockAt)} · ${formatDaysFromNow(item.unlockAt)}`}
          >
            <p className="leading-7 text-[var(--ink-soft)]">{item.preview}</p>
          </PaperCard>
        ))}
      </section>
    </SiteShell>
  );
}
