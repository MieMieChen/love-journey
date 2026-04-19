import { createPlaceAction } from "@/app/actions";
import { PaperCard } from "@/components/paper-card";
import { SiteShell } from "@/components/site-shell";
import { getViewerState } from "@/lib/auth";
import { getPlaces } from "@/lib/queries";
import { formatDate } from "@/lib/site-data";

export default async function MapPage() {
  const [places, viewer] = await Promise.all([getPlaces(), getViewerState()]);

  return (
    <SiteShell
      eyebrow="Map"
      title="地图足迹页面原型"
      description="第一版聚焦回忆地点记录，而不是实时位置共享。点击地图点位，展开地点对应的照片、日记和那天的故事。"
    >
      {viewer.configured && viewer.user && viewer.coupleId && (
        <PaperCard tone="sage" title="新增地点打卡" description="录入城市、经纬度和一句地点故事后，就会出现在足迹地图里。">
          <form action={createPlaceAction} className="grid gap-4 md:grid-cols-2">
            <input name="title" required placeholder="地点名称" className="input-field" />
            <input name="city" required placeholder="城市" className="input-field" />
            <input name="label" placeholder="标签，例如：第一次见面" className="input-field" />
            <input type="date" name="visitedOn" required className="input-field" />
            <input name="latitude" placeholder="纬度，例如：31.214" className="input-field" />
            <input name="longitude" placeholder="经度，例如：121.465" className="input-field" />
            <textarea name="note" placeholder="这地方为什么重要？" className="input-field min-h-28 md:col-span-2" />
            <div className="md:col-span-2">
              <button type="submit" className="primary-button">
                保存足迹
              </button>
            </div>
          </form>
        </PaperCard>
      )}

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <PaperCard title="地图展示区" description="用柔和底图和手写样式标记去过的城市与重要地点。">
          <div className="map-stage">
            {places.map((place, index) => (
              <div
                key={place.id}
                className="map-pin"
                style={{
                  left: `${18 + index * 19}%`,
                  top: `${20 + (index % 3) * 18}%`,
                }}
              >
                <span>{place.title}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-dashed border-[var(--line)] p-4">
              <p className="text-3xl font-semibold text-[var(--ink)]">{places.length}</p>
              <p className="text-sm text-[var(--ink-soft)]">共同打卡地点</p>
            </div>
            <div className="rounded-[22px] border border-dashed border-[var(--line)] p-4">
              <p className="text-3xl font-semibold text-[var(--ink)]">8</p>
              <p className="text-sm text-[var(--ink-soft)]">一起去过的城市</p>
            </div>
            <div className="rounded-[22px] border border-dashed border-[var(--line)] p-4">
              <p className="text-3xl font-semibold text-[var(--ink)]">3</p>
              <p className="text-sm text-[var(--ink-soft)]">最常重返的地点</p>
            </div>
          </div>
        </PaperCard>

        <PaperCard tone="sage" title="定位功能说明" description="首版建议这样设计，体验更稳定，也更符合私密恋爱站定位。">
          <ul className="space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
            <li>地点打卡：在写日记或上传照片时绑定城市、经纬度和地点故事。</li>
            <li>足迹地图：展示一起去过的地点和重复造访次数。</li>
            <li>城市收集：把每座一起去过的城市做成收藏卡。</li>
            <li>实时定位共享：作为二期功能，可在确认隐私策略后再加。</li>
          </ul>
        </PaperCard>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {places.map((place) => (
          <PaperCard
            key={place.id}
            title={place.title}
            description={`${place.city} · ${formatDate(place.visitedOn)} · ${place.label}`}
          >
            <p className="leading-7 text-[var(--ink-soft)]">{place.note}</p>
          </PaperCard>
        ))}
      </section>
    </SiteShell>
  );
}
