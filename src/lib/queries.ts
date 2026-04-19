import {
  fallbackAnniversaries,
  fallbackCapsules,
  fallbackGallery,
  fallbackMoments,
  fallbackPlaces,
  fallbackShares,
  fallbackSnapshot,
  fallbackWishlist,
  type AnniversaryCard,
  type CapsuleCard,
  type DiaryMoment,
  type GalleryCard,
  type HomepageSnapshot,
  type PlaceCard,
  type SharedCollection,
  type WishlistCard,
} from "@/lib/site-data";
import { getStorageBucketName } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function createSignedUrlMap(
  supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>>,
  paths: string[],
) {
  const uniquePaths = [...new Set(paths.filter(Boolean))];

  if (!uniquePaths.length) {
    return new Map<string, string>();
  }

  const signed = await supabase.storage
    .from(getStorageBucketName())
    .createSignedUrls(uniquePaths, 60 * 60);

  const signedMap = new Map<string, string>();
  signed.data?.forEach((item, index) => {
    const path = uniquePaths[index];
    if (path && item.signedUrl) {
      signedMap.set(path, item.signedUrl);
    }
  });

  return signedMap;
}

function supabaseReady() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function getHomepageSnapshot(): Promise<HomepageSnapshot> {
  if (!supabaseReady()) return fallbackSnapshot;

  const supabase = await createServerSupabaseClient();
  if (!supabase) return fallbackSnapshot;

  const [couplesResult, placesResult, photosResult, wishlistResult] = await Promise.all([
    supabase.from("couples").select("started_on").limit(1).maybeSingle(),
    supabase.from("places").select("id", { count: "exact", head: true }),
    supabase.from("moment_photos").select("id", { count: "exact", head: true }),
    supabase
      .from("wishlists")
      .select("id", { count: "exact", head: true })
      .eq("status", "done"),
  ]);

  const startedOn = couplesResult.data?.started_on;
  const diffDays = startedOn
    ? Math.max(
        1,
        Math.ceil((Date.now() - new Date(startedOn).getTime()) / (1000 * 60 * 60 * 24)),
      )
    : fallbackSnapshot.daysTogether;

  return {
    ...fallbackSnapshot,
    daysTogether: diffDays,
    cityCount: placesResult.count ?? fallbackSnapshot.cityCount,
    photoCount: photosResult.count ?? fallbackSnapshot.photoCount,
    completedWishlist: wishlistResult.count ?? fallbackSnapshot.completedWishlist,
  };
}

export async function getDiaryMoments(): Promise<DiaryMoment[]> {
  if (!supabaseReady()) return fallbackMoments;

  const supabase = await createServerSupabaseClient();
  if (!supabase) return fallbackMoments;

  const { data, error } = await supabase
    .from("moments")
    .select("id,title,summary,mood,weather,happened_at,is_featured,place_id")
    .order("happened_at", { ascending: false })
    .limit(12);

  if (error || !data?.length) return fallbackMoments;

  const momentIds = data.map((item) => item.id);
  const placeIds = data.map((item) => item.place_id).filter(Boolean);

  const [{ data: photos }, { data: places }] = await Promise.all([
    supabase
      .from("moment_photos")
      .select("id,moment_id,file_path,caption,taken_at")
      .in("moment_id", momentIds)
      .order("sort_order", { ascending: true }),
    placeIds.length
      ? supabase.from("places").select("id,title,city").in("id", placeIds)
      : Promise.resolve({ data: [] as Array<{ id: string; title: string; city: string }> }),
  ]);

  const signedMap = await createSignedUrlMap(
    supabase,
    (photos ?? []).map((item) => item.file_path),
  );
  const firstPhotoByMoment = new Map<
    string,
    { file_path: string; caption: string | null; taken_at: string | null }
  >();
  (photos ?? []).forEach((photo) => {
    if (!firstPhotoByMoment.has(photo.moment_id)) {
      firstPhotoByMoment.set(photo.moment_id, photo);
    }
  });
  const placeMap = new Map((places ?? []).map((place) => [place.id, place]));

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    author: "共同记录",
    summary: item.summary ?? "",
    mood: item.mood ?? "日常",
    weather: item.weather ?? "天气未记录",
    place: item.place_id
      ? `${placeMap.get(item.place_id)?.city ?? ""} ${placeMap.get(item.place_id)?.title ?? ""}`.trim() ||
        "已绑定地点"
      : "未绑定地点",
    happenedAt: item.happened_at,
    featured: item.is_featured ?? false,
    tags: [item.mood ?? "数据库内容", item.place_id ? "已绑定地点" : "仅文字记录"],
    imageUrl: firstPhotoByMoment.get(item.id)?.file_path
      ? signedMap.get(firstPhotoByMoment.get(item.id)!.file_path)
      : undefined,
    photoCaption: firstPhotoByMoment.get(item.id)?.caption ?? undefined,
  }));
}

export async function getPlaces(): Promise<PlaceCard[]> {
  if (!supabaseReady()) return fallbackPlaces;

  const supabase = await createServerSupabaseClient();
  if (!supabase) return fallbackPlaces;

  const { data, error } = await supabase
    .from("places")
    .select("id,title,city,visited_on,label,note,latitude,longitude")
    .order("visited_on", { ascending: false })
    .limit(12);

  if (error || !data?.length) return fallbackPlaces;

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    city: item.city,
    visitedOn: item.visited_on,
    label: item.label ?? "共同地点",
    note: item.note ?? "",
    latitude: item.latitude ?? 0,
    longitude: item.longitude ?? 0,
  }));
}

export async function getAnniversaryCards(): Promise<AnniversaryCard[]> {
  if (!supabaseReady()) return fallbackAnniversaries;

  const supabase = await createServerSupabaseClient();
  if (!supabase) return fallbackAnniversaries;

  const { data, error } = await supabase
    .from("anniversaries")
    .select("id,title,description,event_date,recurring")
    .order("event_date", { ascending: true })
    .limit(12);

  if (error || !data?.length) return fallbackAnniversaries;

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description ?? "",
    eventDate: item.event_date,
    recurring: item.recurring ?? false,
  }));
}

export async function getGalleryHighlights(): Promise<GalleryCard[]> {
  if (!supabaseReady()) return fallbackGallery;

  const supabase = await createServerSupabaseClient();
  if (!supabase) return fallbackGallery;

  const { data, error } = await supabase
    .from("moment_photos")
    .select("id,moment_id,caption,taken_at,file_path")
    .order("taken_at", { ascending: false })
    .limit(12);

  if (error || !data?.length) return fallbackGallery;

  const momentIds = [...new Set(data.map((item) => item.moment_id).filter(Boolean))];
  const { data: moments } = momentIds.length
    ? await supabase
        .from("moments")
        .select("id,title,mood")
        .in("id", momentIds)
    : { data: [] as Array<{ id: string; title: string; mood: string | null }> };

  const momentMap = new Map((moments ?? []).map((moment) => [moment.id, moment]));
  const signedMap = await createSignedUrlMap(
    supabase,
    data.map((item) => item.file_path),
  );

  return data.map((item, index) => ({
    id: item.id,
    title: momentMap.get(item.moment_id)?.title ?? `照片 ${index + 1}`,
    caption: item.caption ?? "来自已上传相册",
    theme: momentMap.get(item.moment_id)?.mood ?? "数据库照片",
    takenAt: item.taken_at ?? new Date().toISOString(),
    imageUrl: item.file_path ? signedMap.get(item.file_path) : undefined,
    albumLabel: momentMap.get(item.moment_id)?.title
      ? `来自日记：${momentMap.get(item.moment_id)?.title}`
      : "暂未绑定日记标题",
  }));
}

export async function getCapsules(): Promise<CapsuleCard[]> {
  if (!supabaseReady()) return fallbackCapsules;

  const supabase = await createServerSupabaseClient();
  if (!supabase) return fallbackCapsules;

  const { data, error } = await supabase
    .from("capsules")
    .select("id,title,preview,unlock_at,status")
    .order("unlock_at", { ascending: true })
    .limit(12);

  if (error || !data?.length) return fallbackCapsules;

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    author: "共同记录",
    preview: item.preview ?? "",
    unlockAt: item.unlock_at,
    status: item.status === "opened" ? "opened" : "locked",
  }));
}

export async function getWishlistItems(): Promise<WishlistCard[]> {
  if (!supabaseReady()) return fallbackWishlist;

  const supabase = await createServerSupabaseClient();
  if (!supabase) return fallbackWishlist;

  const { data, error } = await supabase
    .from("wishlists")
    .select("id,title,detail,status")
    .order("created_at", { ascending: false })
    .limit(12);

  if (error || !data?.length) return fallbackWishlist;

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    detail: item.detail ?? "",
    status: item.status,
    statusLabel:
      item.status === "done" ? "已完成" : item.status === "planned" ? "计划中" : "想做",
  }));
}

export async function getSharedCollection(slug: string): Promise<SharedCollection | null> {
  if (!supabaseReady()) {
    return fallbackShares.find((item) => item.slug === slug) ?? null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return fallbackShares.find((item) => item.slug === slug) ?? null;

  const { data: shareLink, error } = await supabase
    .from("share_links")
    .select("slug,title,description,created_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !shareLink) {
    return fallbackShares.find((item) => item.slug === slug) ?? null;
  }

  const items = await getGalleryHighlights();

  return {
    slug: shareLink.slug,
    title: shareLink.title,
    description: shareLink.description ?? "一组公开分享的回忆照片。",
    createdAt: shareLink.created_at,
    items: items.slice(0, 6),
  };
}
