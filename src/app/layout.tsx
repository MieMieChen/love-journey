import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "心动存档 | 私密双人恋爱日记站",
  description:
    "用于记录恋爱日常的私密双人网站，包含地图足迹、纪念日时间轴、相册分享、留言胶囊和愿望清单。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
