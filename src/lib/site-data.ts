export type HomepageSnapshot = {
  daysTogether: number;
  cityCount: number;
  photoCount: number;
  completedWishlist: number;
  heroMessage: string;
  notePreview: string;
};

export type DiaryMoment = {
  id: string;
  title: string;
  author: string;
  summary: string;
  mood: string;
  weather: string;
  place: string;
  happenedAt: string;
  featured: boolean;
  tags: string[];
  imageUrl?: string;
  photoCaption?: string;
};

export type PlaceCard = {
  id: string;
  title: string;
  city: string;
  visitedOn: string;
  label: string;
  note: string;
  latitude: number;
  longitude: number;
};

export type AnniversaryCard = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  recurring: boolean;
};

export type GalleryCard = {
  id: string;
  title: string;
  caption: string;
  theme: string;
  takenAt: string;
  imageUrl?: string;
  albumLabel?: string;
};

export type CapsuleCard = {
  id: string;
  title: string;
  author: string;
  preview: string;
  unlockAt: string;
  status: "locked" | "opened";
};

export type WishlistCard = {
  id: string;
  title: string;
  detail: string;
  status: "idea" | "planned" | "done";
  statusLabel: string;
};

export type SharedCollection = {
  slug: string;
  title: string;
  description: string;
  createdAt: string;
  items: GalleryCard[];
};

export const fallbackSnapshot: HomepageSnapshot = {
  daysTogether: 428,
  cityCount: 8,
  photoCount: 312,
  completedWishlist: 12,
  heroMessage:
    "这里存放散步回家的路、一起吃过的小店、旅行时的车票、没来得及当面说的话，还有每个值得被认真纪念的普通日子。",
  notePreview: "今天风有点大，但和你一起走回去的时候，觉得路特别长也特别好。",
};

export const fallbackMoments: DiaryMoment[] = [
  {
    id: "m1",
    title: "海边那天的晚霞",
    author: "共同记录",
    summary:
      "原本只是想去吹吹风，结果在堤岸边待到了天黑。回去的路上买了两支冰淇淋，鞋子里都是沙子，但谁都没有急着回家。",
    mood: "开心",
    weather: "多云转晴",
    place: "厦门环岛路",
    happenedAt: "2026-04-06",
    featured: true,
    tags: ["旅行", "晚霞", "重要时刻"],
  },
  {
    id: "m2",
    title: "一起做晚饭的周三",
    author: "我写的",
    summary:
      "本来只是想简单煮面，最后多炒了一个番茄鸡蛋。厨房很热，窗外在下雨，但那顿饭莫名让人觉得很安稳。",
    mood: "平静",
    weather: "小雨",
    place: "家里",
    happenedAt: "2026-04-10",
    featured: false,
    tags: ["日常", "做饭", "下雨天"],
  },
  {
    id: "m3",
    title: "第一次一起逛花市",
    author: "TA 写的",
    summary:
      "你挑了一束白色郁金香，说想让家里像春天一样。我一直记得那天你回头看我的样子，特别认真。",
    mood: "想念",
    weather: "晴天",
    place: "武康路花店",
    happenedAt: "2026-03-21",
    featured: false,
    tags: ["约会", "花店", "春天"],
  },
];

export const fallbackPlaces: PlaceCard[] = [
  {
    id: "p1",
    title: "第一次见面的咖啡馆",
    city: "上海",
    visitedOn: "2025-02-14",
    label: "第一次见面",
    note: "桌边的灯有点暗，但你笑起来的时候，我一下就记住了那天的气味和声音。",
    latitude: 31.214,
    longitude: 121.465,
  },
  {
    id: "p2",
    title: "看日落的堤岸",
    city: "厦门",
    visitedOn: "2026-04-06",
    label: "海边散步",
    note: "后来每次提起旅行，都会先想到这里的风和那天的晚霞。",
    latitude: 24.441,
    longitude: 118.112,
  },
  {
    id: "p3",
    title: "那家总去的小店",
    city: "上海",
    visitedOn: "2026-04-12",
    label: "常去餐厅",
    note: "菜单已经熟到不用看，但每次坐下来还是觉得像在约会。",
    latitude: 31.228,
    longitude: 121.452,
  },
  {
    id: "p4",
    title: "夜骑的江边",
    city: "杭州",
    visitedOn: "2025-10-02",
    label: "旅行足迹",
    note: "车轮声音和江风混在一起，那段路后来总让人想重走一遍。",
    latitude: 30.245,
    longitude: 120.177,
  },
];

export const fallbackAnniversaries: AnniversaryCard[] = [
  {
    id: "a1",
    title: "恋爱纪念日",
    description: "每年都要好好庆祝的那一天，可以关联一组照片和一篇纪念小作文。",
    eventDate: "2026-05-06",
    recurring: true,
  },
  {
    id: "a2",
    title: "第一次一起旅行",
    description: "把第一次远行的路线、照片和那天的心情都放在同一张卡片里。",
    eventDate: "2026-07-12",
    recurring: true,
  },
  {
    id: "a3",
    title: "今年想一起跨年",
    description: "未来计划日也应该被写进时间轴，因为期待本身就是关系的一部分。",
    eventDate: "2026-12-31",
    recurring: false,
  },
];

export const fallbackGallery: GalleryCard[] = [
  {
    id: "g1",
    title: "海边周末",
    caption: "风很大，头发很乱，但那张背影照还是想保留下来。",
    theme: "旅行",
    takenAt: "2026-04-06",
    albumLabel: "来自日记：海边那天的晚霞",
  },
  {
    id: "g2",
    title: "下雨天回家",
    caption: "鞋边有一点泥点子，路边灯牌刚好亮起来。",
    theme: "日常",
    takenAt: "2026-04-10",
    albumLabel: "来自日记：一起做晚饭的周三",
  },
  {
    id: "g3",
    title: "花市约会",
    caption: "白色郁金香装进纸袋里，像一张电影截图。",
    theme: "约会",
    takenAt: "2026-03-21",
    albumLabel: "来自日记：第一次一起逛花市",
  },
  {
    id: "g4",
    title: "生日那天",
    caption: "蛋糕上的蜡烛歪了一点，但笑容是正的。",
    theme: "节日",
    takenAt: "2026-02-08",
    albumLabel: "来自日记：生日那天",
  },
];

export const fallbackCapsules: CapsuleCard[] = [
  {
    id: "c1",
    title: "写给下一次纪念日",
    author: "我写的",
    preview: "等到那天再打开，应该会比现在更知道怎么爱你。",
    unlockAt: "2026-05-06",
    status: "locked",
  },
  {
    id: "c2",
    title: "生日前夜的小纸条",
    author: "TA 写的",
    preview: "那天其实准备了两版祝福，最后还是想用最简单的那一句。",
    unlockAt: "2026-02-08",
    status: "opened",
  },
];

export const fallbackWishlist: WishlistCard[] = [
  {
    id: "w1",
    title: "一起去看极光",
    detail: "想在很冷的地方牵手等一场特别慢的天光。",
    status: "idea",
    statusLabel: "想做",
  },
  {
    id: "w2",
    title: "拍一组情侣写真",
    detail: "最好是在傍晚街头，穿最日常的衣服，不要太正式。",
    status: "planned",
    statusLabel: "计划中",
  },
  {
    id: "w3",
    title: "学会一道一起做的菜",
    detail: "已经完成，后来变成了下雨天默认菜单。",
    status: "done",
    statusLabel: "已完成",
  },
];

export const fallbackShares: SharedCollection[] = [
  {
    slug: "our-first-trip",
    title: "第一次一起旅行",
    description: "从出发前一晚的打包，到最后一张回程车窗照片，都放在这里。",
    createdAt: "2026-04-18",
    items: fallbackGallery.slice(0, 3),
  },
];

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export function formatDaysFromNow(value: string) {
  const target = new Date(value).getTime();
  const now = Date.now();
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "就是今天";
  if (diff > 0) return `还有 ${diff} 天`;
  return `已经过去 ${Math.abs(diff)} 天`;
}
