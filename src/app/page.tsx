import Image from "next/image";
import Link from "next/link";

import { createInviteAction } from "@/app/actions";
import { PaperCard } from "@/components/paper-card";
import { SiteShell } from "@/components/site-shell";
import { getBaseUrl, getViewerState } from "@/lib/auth";
import {
  getAnniversaryCards,
  getGalleryHighlights,
  getHomepageSnapshot,
  getPlaces,
  getWishlistItems,
} from "@/lib/queries";
import { formatDate, formatDaysFromNow } from "@/lib/site-data";

type HomePageProps = {
  searchParams: Promise<{ inviteToken?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const [snapshot, anniversaries, gallery, places, wishes, viewer] = await Promise.all([
    getHomepageSnapshot(),
    getAnniversaryCards(),
    getGalleryHighlights(),
    getPlaces(),
    getWishlistItems(),
    getViewerState(),
  ]);
  const { inviteToken } = await searchParams;

  const nextAnniversary = anniversaries[0];
  const inviteUrl = inviteToken ? `${getBaseUrl()}/invite/${inviteToken}` : null;

  return (
    <SiteShell
      eyebrow="私密双人恋爱日记站"
      title="把每一个普通的日子，认真收进两个人的手账里。"
      description="首页像一本打开的恋爱剪贴簿，展示相爱天数、下一个纪念日、最近上传的照片、共同足迹和只属于彼此的小纸条。"
      spotlight={
        <div className="grid gap-4 sm:grid-cols-3">
          <PaperCard tone="rose" className="sm:col-span-2">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--ink-soft)]">
              Today&apos;s Story
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-[1.3fr_1fr]">
              <div>
                <h2 className="text-3xl font-semibold text-[var(--ink)]">
                  今天是我们相爱的第 {snapshot.daysTogether} 天
                </h2>
                <p className="mt-3 max-w-xl leading-7 text-[var(--ink-soft)]">
                  {snapshot.heroMessage}
                </p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--ink-soft)]">
                  <span className="tag">共同城市 {snapshot.cityCount}</span>
                  <span className="tag">照片 {snapshot.photoCount}</span>
                  <span className="tag">心愿完成 {snapshot.completedWishlist}</span>
                </div>
              </div>
              <div className="rounded-[28px] border border-white/70 bg-white/70 p-5 shadow-[var(--shadow-soft)]">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--ink-soft)]">
                  下一次纪念
                </p>
                <h3 className="mt-3 text-xl font-semibold text-[var(--ink)]">
                  {nextAnniversary?.title ?? "未来计划"}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                  {nextAnniversary
                    ? `${formatDate(nextAnniversary.eventDate)} · ${formatDaysFromNow(
                        nextAnniversary.eventDate,
                      )}`
                    : "把下一次旅行、生日和相识纪念都写进关系时间线里。"}
                </p>
                <Link className="mt-5 inline-flex text-sm font-medium text-[var(--accent-strong)]" href="/anniversary">
                  打开纪念日时间轴
                </Link>
              </div>
            </div>
          </PaperCard>

          <PaperCard tone="sage" className="rotate-[-1.5deg]">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--ink-soft)]">
              今日便签
            </p>
            <p className="mt-4 text-lg leading-8 text-[var(--ink)]">
              “{snapshot.notePreview}”
            </p>
            <p className="mt-6 text-sm text-[var(--ink-soft)]">来自留言胶囊模块，可设定未来某天再打开。</p>
          </PaperCard>
        </div>
      }
    >
      {viewer.configured && viewer.user && !viewer.coupleId && (
        <PaperCard tone="sand" title="还差一步就能进入私密空间" description="你已经登录成功，但还没加入默认站点。">
          <Link href="/onboarding" className="primary-button">
            去完成加入设置
          </Link>
        </PaperCard>
      )}

      {viewer.configured && viewer.user && viewer.coupleId && (
        <PaperCard
          tone="blush"
          title="邀请对象加入同一个双人空间"
          description="生成一条专属邀请链接，对方打开后登录并确认加入，就会进入和你同一个恋爱手账空间。"
        >
          <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <form action={createInviteAction} className="space-y-4">
              <textarea
                name="note"
                placeholder="可选：给这条邀请留一句话，比如‘点开后就能一起写我们的日记了’"
                className="input-field min-h-28"
              />
              <select name="expiresInDays" className="input-field">
                <option value="3">3 天后过期</option>
                <option value="7">7 天后过期</option>
                <option value="14">14 天后过期</option>
              </select>
              <button type="submit" className="primary-button">
                生成邀请链接
              </button>
            </form>

            <div className="rounded-[24px] border border-dashed border-[var(--line)] bg-white/45 p-5 text-sm leading-7 text-[var(--ink-soft)]">
              <p className="font-medium text-[var(--ink)]">使用方式</p>
              <p className="mt-2">
                生成后，把链接发给对象。对象打开邀请页后，如果还没登录，会先进入登录页，登录成功后会自动回到邀请页并加入同一个空间。
              </p>
              <p className="mt-3">
                当前网站基地址：
                <span className="mt-2 block rounded-[16px] bg-white/70 px-3 py-2 font-mono text-xs text-[var(--ink)]">
                  {getBaseUrl()}
                </span>
              </p>
              {inviteUrl && (
                <div className="mt-4 rounded-[18px] border border-white/70 bg-white/75 p-4">
                  <p className="text-sm font-medium text-[var(--ink)]">刚生成的邀请链接</p>
                  <p className="mt-2 break-all font-mono text-xs text-[var(--ink-soft)]">
                    {inviteUrl}
                  </p>
                </div>
              )}
            </div>
          </div>
        </PaperCard>
      )}

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <PaperCard title="首页原型结构" description="作为情绪入口，首页不是功能目录，而是一本刚翻开的手账。">
          <div className="grid gap-3 text-sm text-[var(--ink-soft)] sm:grid-cols-2">
            <div className="rounded-[22px] border border-dashed border-[var(--line)] p-4">
              <p className="font-medium text-[var(--ink)]">1. 头图欢迎区</p>
              <p className="mt-2">网站名字、昵称、相爱天数、下个纪念日倒计时。</p>
            </div>
            <div className="rounded-[22px] border border-dashed border-[var(--line)] p-4">
              <p className="font-medium text-[var(--ink)]">2. 随机旧回忆</p>
              <p className="mt-2">每天随机翻出一张旧照片和一句日记片段。</p>
            </div>
            <div className="rounded-[22px] border border-dashed border-[var(--line)] p-4">
              <p className="font-medium text-[var(--ink)]">3. 足迹预览</p>
              <p className="mt-2">显示最近一次打卡地点和累计去过的城市数。</p>
            </div>
            <div className="rounded-[22px] border border-dashed border-[var(--line)] p-4">
              <p className="font-medium text-[var(--ink)]">4. 心愿进度</p>
              <p className="mt-2">完成数量、即将实现的愿望、未来计划。</p>
            </div>
          </div>
        </PaperCard>

        <PaperCard tone="sand" title="首页文案方向" description="整体像在翻一本写满便签和日期印章的回忆簿。">
          <ul className="space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
            <li>主标语：把每一个普通的日子，认真收进两个人的手账里。</li>
            <li>副文案：这里存放散步的路线、旅行的车票、突然想说的话和所有值得纪念的小事。</li>
            <li>按钮文案：写一篇日记 / 上传一组照片 / 看看我们的足迹 / 给未来留一封信。</li>
          </ul>
        </PaperCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <PaperCard title="最近上传的相册" description="拍立得相片、短标题和一句当时的心情。">
          <div className="grid gap-4 md:grid-cols-3">
            {gallery.map((item) => (
              <article
                key={item.id}
                className="group rounded-[26px] border border-white/70 bg-white/70 p-3 shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-1"
              >
                {item.imageUrl ? (
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] border border-[var(--line)]">
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
                  <div
                    className="aspect-[4/5] rounded-[20px] border border-[var(--line)] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_rgba(239,200,194,0.8))]"
                    aria-hidden
                  />
                )}
                <div className="px-2 pb-2 pt-4">
                  <p className="text-base font-semibold text-[var(--ink)]">{item.title}</p>
                  <p className="mt-1 text-sm text-[var(--ink-soft)]">{item.caption}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[var(--ink-soft)]">
                    {formatDate(item.takenAt)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </PaperCard>

        <div className="grid gap-6">
          <PaperCard tone="blush" title="地图足迹预览" description="最近的共同地点会先在首页轻轻露面。">
            <div className="grid gap-3">
              {places.slice(0, 3).map((place, index) => (
                <div
                  key={place.id}
                  className="flex items-start justify-between rounded-[20px] border border-white/70 bg-white/65 px-4 py-3"
                >
                  <div>
                    <p className="text-base font-medium text-[var(--ink)]">
                      {index + 1}. {place.title}
                    </p>
                    <p className="text-sm text-[var(--ink-soft)]">
                      {place.city} · {formatDate(place.visitedOn)}
                    </p>
                  </div>
                  <span className="tag">{place.label}</span>
                </div>
              ))}
            </div>
          </PaperCard>

          <PaperCard title="愿望清单预览" description="保留一些还没发生的期待，让网站不只记录过去。">
            <div className="space-y-3">
              {wishes.slice(0, 3).map((wish) => (
                <div key={wish.id} className="rounded-[20px] border border-dashed border-[var(--line)] px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium text-[var(--ink)]">{wish.title}</p>
                    <span className="tag">{wish.statusLabel}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{wish.detail}</p>
                </div>
              ))}
            </div>
          </PaperCard>
        </div>
      </section>
    </SiteShell>
  );
}
