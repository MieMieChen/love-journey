import Image from "next/image";

import { DiaryEntryForm } from "@/components/diary-entry-form";
import { PaperCard } from "@/components/paper-card";
import { SiteShell } from "@/components/site-shell";
import { getViewerState } from "@/lib/auth";
import { getDiaryMoments, getPlaces } from "@/lib/queries";
import { formatDate } from "@/lib/site-data";

export default async function DiaryPage() {
  const [moments, viewer, places] = await Promise.all([
    getDiaryMoments(),
    getViewerState(),
    getPlaces(),
  ]);

  return (
    <SiteShell
      eyebrow="Moments / Diary"
      title="恋爱日记页面原型"
      description="按时间线记录日常、约会、旅行和那些想在很多年后再回看的小情绪。"
    >
      {viewer.configured && viewer.user && viewer.coupleId && (
        <PaperCard
          tone="rose"
          title="写一篇新的恋爱日记"
          description="支持文字、地点、心情和一张照片一起提交，现在可以直接从已有足迹里选地点并预览图片。"
        >
          <DiaryEntryForm places={places.map(({ id, title, city }) => ({ id, title, city }))} />
        </PaperCard>
      )}

      <section className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <PaperCard tone="blush" title="页面结构" description="这个模块是站点内容中心。">
          <ol className="space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
            <li>1. 顶部筛选区：月份、地点、情绪、是否重要时刻。</li>
            <li>2. 发布入口：写文字、加照片、选地点、选天气和心情标签。</li>
            <li>3. 纵向时间线：每条日记像贴在手账里的卡片。</li>
            <li>4. 特殊样式：重要时刻置顶，只对彼此可见的私密内容单独标识。</li>
          </ol>
        </PaperCard>

        <PaperCard title="文案结构" description="让记录是轻盈的，不像在写表单。">
          <div className="grid gap-3 text-sm text-[var(--ink-soft)] md:grid-cols-2">
            <div className="rounded-[22px] border border-dashed border-[var(--line)] p-4">
              <p className="font-medium text-[var(--ink)]">发布框提示语</p>
              <p className="mt-2">今天想记下什么？可以是一顿晚饭、一段散步路线，或者一句突然想对你说的话。</p>
            </div>
            <div className="rounded-[22px] border border-dashed border-[var(--line)] p-4">
              <p className="font-medium text-[var(--ink)]">时间线说明</p>
              <p className="mt-2">每一页都是关系里真实发生过的一天，不追求完美，只保留温度。</p>
            </div>
          </div>
        </PaperCard>
      </section>

      <section className="space-y-5">
        {moments.map((moment, index) => (
          <article key={moment.id} className="grid gap-4 md:grid-cols-[120px_1fr]">
            <div className="flex items-start gap-3 md:block">
              <div className="timeline-dot">{index + 1}</div>
              <div className="md:mt-3">
                <p className="text-sm font-medium text-[var(--ink)]">{formatDate(moment.happenedAt)}</p>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--ink-soft)]">{moment.mood}</p>
              </div>
            </div>

            <PaperCard
              tone={moment.featured ? "rose" : "paper"}
              title={moment.title}
              description={`${moment.author} · ${moment.weather} · ${moment.place}`}
            >
              {moment.imageUrl && (
                <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-[24px] border border-[var(--line)]">
                  <Image
                    src={moment.imageUrl}
                    alt={moment.photoCaption || moment.title}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                </div>
              )}
              <p className="leading-7 text-[var(--ink-soft)]">{moment.summary}</p>
              {moment.photoCaption && (
                <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
                  照片备注：{moment.photoCaption}
                </p>
              )}
              <div className="mt-5 flex flex-wrap gap-2">
                {moment.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </PaperCard>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
