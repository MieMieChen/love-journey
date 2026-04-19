import { createAnniversaryAction } from "@/app/actions";
import { PaperCard } from "@/components/paper-card";
import { SiteShell } from "@/components/site-shell";
import { getViewerState } from "@/lib/auth";
import { getAnniversaryCards } from "@/lib/queries";
import { formatDate, formatDaysFromNow } from "@/lib/site-data";

export default async function AnniversaryPage() {
  const [anniversaries, viewer] = await Promise.all([
    getAnniversaryCards(),
    getViewerState(),
  ]);

  return (
    <SiteShell
      eyebrow="Anniversary"
      title="纪念日时间轴页面原型"
      description="这个页面不只是倒计时，而是完整的关系时间线。每一个日期都可以绑定一组照片和一篇小作文。"
    >
      {viewer.configured && viewer.user && viewer.coupleId && (
        <PaperCard tone="sand" title="新增纪念日" description="可以添加固定纪念日、阶段性里程碑或未来计划日。">
          <form action={createAnniversaryAction} className="grid gap-4 md:grid-cols-2">
            <input name="title" required placeholder="纪念日标题" className="input-field" />
            <input type="date" name="eventDate" required className="input-field" />
            <textarea name="description" placeholder="写一句关于这个日子的说明" className="input-field min-h-28 md:col-span-2" />
            <label className="inline-flex items-center gap-3 text-sm text-[var(--ink-soft)]">
              <input type="checkbox" name="recurring" defaultChecked className="h-4 w-4" />
              每年重复提醒
            </label>
            <div className="md:col-span-2">
              <button type="submit" className="primary-button">
                写入时间轴
              </button>
            </div>
          </form>
        </PaperCard>
      )}

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <PaperCard tone="rose" title="页面结构" description="用仪式感呈现关系里那些被记住的节点。">
          <ol className="space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
            <li>1. 关系概览：相爱天数、下次纪念日、今年已经庆祝了几次。</li>
            <li>2. 纪念日卡片：固定纪念日、周期纪念日、未来计划日。</li>
            <li>3. 年表视图：从相识到每次旅行、每个第一次，按时间顺序排开。</li>
            <li>4. 提醒机制：纪念日前 7 天、3 天和当天提醒。</li>
          </ol>
        </PaperCard>

        <PaperCard title="页面文案" description="要有庆祝感，但不过度像节日营销页面。">
          <p className="text-sm leading-7 text-[var(--ink-soft)]">
            文案建议围绕“被认真记住”的感觉来写，例如：“有些日子因为你，变成了以后每年都会想起的日子。”
          </p>
        </PaperCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {anniversaries.map((item) => (
          <PaperCard
            key={item.id}
            tone={item.recurring ? "sand" : "paper"}
            title={item.title}
            description={`${formatDate(item.eventDate)} · ${formatDaysFromNow(item.eventDate)}`}
          >
            <p className="leading-7 text-[var(--ink-soft)]">{item.description}</p>
          </PaperCard>
        ))}
      </section>
    </SiteShell>
  );
}
