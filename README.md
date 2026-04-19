# Love Journal

一个基于 `Next.js + Tailwind CSS + Supabase` 的私密双人恋爱日记站，包含：

- 首页总览
- 恋爱日记时间线
- 地图足迹
- 纪念日时间轴
- 相册分享
- 留言胶囊
- 愿望清单

## 本地运行

1. 安装依赖

```bash
npm install
```

2. 复制环境变量

```bash
cp .env.example .env.local
```

3. 在 Supabase 项目里执行 [supabase/schema.sql](./supabase/schema.sql)

4. 填入 `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. 启动开发环境

```bash
npm run dev
```

## 数据库设计

核心表：

- `couples`: 双人站点的基础信息
- `profiles`: 与 `auth.users` 关联的用户信息
- `couple_members`: 关系成员表
- `places`: 地图打卡地点
- `moments`: 恋爱日记内容
- `moment_photos`: 相册图片
- `anniversaries`: 固定纪念日和未来计划日
- `capsules`: 留言与时间胶囊
- `wishlists`: 想做、计划中、已完成的愿望
- `share_links`: 公开分享页链接

## 现状说明

- 页面已经是完整的产品原型结构，不再是模板页。
- 没有配置 Supabase 时，页面会自动回退到本地示例数据，方便先看设计效果。
- 配置 Supabase 后，首页和各模块会优先读取数据库内容。

## 下一步建议

- 配置 Supabase Auth，补登录流程和双人邀请逻辑
- 接入真实地图 SDK，例如高德地图或 Mapbox
- 为相册上传和日记发布增加表单与写入动作
- 部署到 Vercel
