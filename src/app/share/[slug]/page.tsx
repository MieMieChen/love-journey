import { notFound } from "next/navigation";
import Image from "next/image";

import { PaperCard } from "@/components/paper-card";
import { getSharedCollection } from "@/lib/queries";
import { formatDate } from "@/lib/site-data";

type SharePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SharePage({ params }: SharePageProps) {
  const { slug } = await params;
  const collection = await getSharedCollection(slug);

  if (!collection) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-14 sm:px-10">
      <PaperCard tone="rose" title={collection.title} description={collection.description}>
        <p className="text-sm text-[var(--ink-soft)]">
          公开分享页示例，用于展示某一组旅行或纪念相册，不暴露整个私密站点。创建于 {formatDate(collection.createdAt)}。
        </p>
      </PaperCard>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {collection.items.map((item) => (
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
              <p className="text-base font-semibold text-[var(--ink)]">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{item.caption}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
