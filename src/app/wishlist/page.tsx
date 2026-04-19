import { createWishlistAction } from "@/app/actions";
import { PaperCard } from "@/components/paper-card";
import { SiteShell } from "@/components/site-shell";
import { getViewerState } from "@/lib/auth";
import { getWishlistItems } from "@/lib/queries";

export default async function WishlistPage() {
  const [wishlist, viewer] = await Promise.all([getWishlistItems(), getViewerState()]);

  return (
    <SiteShell
      eyebrow="Wishlist"
      title="愿望清单页面原型"
      description="把未来还没发生的计划也留在站里，让关系既能回看，也能向前走。"
    >
      {viewer.configured && viewer.user && viewer.coupleId && (
        <PaperCard tone="sand" title="新增愿望" description="把还没发生的计划写下来，之后再慢慢完成。">
          <form action={createWishlistAction} className="grid gap-4 md:grid-cols-2">
            <input name="title" required placeholder="愿望标题" className="input-field" />
            <input name="city" placeholder="相关城市，可选" className="input-field" />
            <select name="status" className="input-field">
              <option value="idea">想做</option>
              <option value="planned">计划中</option>
              <option value="done">已完成</option>
            </select>
            <input type="date" name="targetDate" className="input-field" />
            <textarea name="detail" placeholder="写下这个愿望的样子" className="input-field min-h-32 md:col-span-2" />
            <div className="md:col-span-2">
              <button type="submit" className="primary-button">
                放进未来清单
              </button>
            </div>
          </form>
        </PaperCard>
      )}

      <section className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
        <PaperCard tone="sand" title="页面结构" description="愿望分为想做、计划中、已完成三类。">
          <ol className="space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
            <li>1. 愿望总览：已完成数量、进行中数量、下一项计划。</li>
            <li>2. 卡片看板：按状态分栏管理。</li>
            <li>3. 完成归档：完成后自动写入回忆成就或绑定某个地点。</li>
          </ol>
        </PaperCard>

        <PaperCard title="页面文案" description="重点是未来感和一起实现的过程。">
          <p className="text-sm leading-7 text-[var(--ink-soft)]">
            建议按钮文案：“写下下一件想一起做的事”“把它放进我们的未来”“已经实现，收进回忆里”。完成项可以显示“这件事后来真的发生了”。
          </p>
        </PaperCard>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {wishlist.map((wish) => (
          <PaperCard
            key={wish.id}
            tone={wish.status === "done" ? "sage" : wish.status === "planned" ? "rose" : "paper"}
            title={wish.title}
            description={wish.statusLabel}
          >
            <p className="leading-7 text-[var(--ink-soft)]">{wish.detail}</p>
          </PaperCard>
        ))}
      </section>
    </SiteShell>
  );
}
