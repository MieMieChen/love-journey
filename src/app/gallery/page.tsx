import Link from "next/link";
import Image from "next/image";

import { createShareLinkAction } from "@/app/actions";
import { PaperCard } from "@/components/paper-card";
import { SiteShell } from "@/components/site-shell";
import { getViewerState } from "@/lib/auth";
import { getGalleryHighlights } from "@/lib/queries";
import { formatDate } from "@/lib/site-data";

export default async function GalleryPage() {
  const [gallery, viewer] = await Promise.all([getGalleryHighlights(), getViewerState()]);

  return (
    <SiteShell
      eyebrow="Gallery"
      title="相册分享页面原型"
      description="相册按时间、主题和地点组织。私密可见是默认逻辑，公开分享用受控链接单独打开。"
    >
      {viewer.configured && viewer.user && viewer.coupleId && (
        <PaperCard tone="blush" title="生成公开分享页" description="为某一组回忆生成单独链接，不暴露整个私密站点。">
          <form action={createShareLinkAction} className="grid gap-4 md:grid-cols-2">
            <input name="title" required placeholder="分享页标题" className="input-field" />
            <input name="slug" placeholder="自定义链接尾巴，可留空自动生成" className="input-field" />
            <textarea name="description" placeholder="分享页简介" className="input-field min-h-28 md:col-span-2" />
            <div className="md:col-span-2">
              <button type="submit" className="primary-button">
                生成分享链接
              </button>
            </div>
          </form>
        </PaperCard>
      )}

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <PaperCard title="页面结构" description="相册不是简单文件夹，而是回忆合集。">
          <div className="grid gap-3 text-sm text-[var(--ink-soft)] md:grid-cols-2">
            <div className="rounded-[22px] border border-dashed border-[var(--line)] p-4">
              <p className="font-medium text-[var(--ink)]">按时间浏览</p>
              <p className="mt-2">按月份查看当月上传的照片和回忆主题。</p>
            </div>
            <div className="rounded-[22px] border border-dashed border-[var(--line)] p-4">
              <p className="font-medium text-[var(--ink)]">按主题浏览</p>
              <p className="mt-2">旅行、约会、日常碎片、节日、自拍、美食。</p>
            </div>
            <div className="rounded-[22px] border border-dashed border-[var(--line)] p-4">
              <p className="font-medium text-[var(--ink)]">按地点浏览</p>
              <p className="mt-2">城市和地点会与地图模块联动。</p>
            </div>
            <div className="rounded-[22px] border border-dashed border-[var(--line)] p-4">
              <p className="font-medium text-[var(--ink)]">公开分享页</p>
              <p className="mt-2">单独生成某次旅行的链接，不暴露整个站点内容。</p>
            </div>
          </div>
        </PaperCard>

        <PaperCard tone="blush" title="分享文案" description="保持温柔，不像社交平台转发。">
          <ul className="space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
            <li>相册标题：海边的那个周末 / 第一次一起过生日 / 下雨天的城市散步。</li>
            <li>按钮文案：打开这组回忆 / 生成分享链接 / 绑定到一篇日记。</li>
            <li>
              公开链接示例：
              <Link className="ml-2 text-[var(--accent-strong)]" href="/share/our-first-trip">
                /share/our-first-trip
              </Link>
            </li>
          </ul>
        </PaperCard>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {gallery.map((item) => (
          <article key={item.id} className="photo-card">
            {item.imageUrl ? (
              <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] border border-[var(--line)]">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ) : (
              <div className="photo-placeholder" aria-hidden />
            )}
            <div className="px-2 pb-2 pt-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-[var(--ink)]">{item.title}</p>
                  <p className="mt-1 text-sm text-[var(--ink-soft)]">{item.caption}</p>
                </div>
                <span className="tag">{item.theme}</span>
              </div>
              {item.albumLabel && (
                <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">{item.albumLabel}</p>
              )}
              <p className="mt-4 text-xs uppercase tracking-[0.22em] text-[var(--ink-soft)]">
                {formatDate(item.takenAt)}
              </p>
            </div>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
