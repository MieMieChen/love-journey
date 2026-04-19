"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

import { createMomentAction } from "@/app/actions";

type DiaryEntryFormProps = {
  places: Array<{
    id: string;
    title: string;
    city: string;
  }>;
};

function PublishButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="primary-button" disabled={pending}>
      {pending ? "上传并发布中..." : "发布这一天"}
    </button>
  );
}

export function DiaryEntryForm({ places }: DiaryEntryFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0];

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!nextFile) {
      setPreviewUrl(null);
      setFileName("");
      return;
    }

    setFileName(nextFile.name);
    setPreviewUrl(URL.createObjectURL(nextFile));
  }

  return (
    <form action={createMomentAction} className="grid gap-4 md:grid-cols-2">
      <input
        name="title"
        required
        placeholder="标题，例如：海边那天的晚霞"
        className="input-field md:col-span-2"
      />
      <textarea
        name="summary"
        required
        placeholder="一句摘要，之后会出现在时间线卡片里"
        className="input-field min-h-28 md:col-span-2"
      />
      <textarea
        name="body"
        placeholder="详细内容，可选"
        className="input-field min-h-32 md:col-span-2"
      />
      <input
        name="mood"
        placeholder="心情标签，例如：开心、平静、想念"
        className="input-field"
      />
      <input
        name="weather"
        placeholder="天气，例如：小雨、晴天"
        className="input-field"
      />
      <input type="date" name="happenedAt" required className="input-field" />
      <select name="placeId" className="input-field">
        <option value="">暂时不绑定地点</option>
        {places.map((place) => (
          <option key={place.id} value={place.id}>
            {place.city} · {place.title}
          </option>
        ))}
      </select>
      <input name="caption" placeholder="照片备注，可选" className="input-field" />
      <div className="space-y-3 md:col-span-2">
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleFileChange}
          className="input-field file:mr-4 file:rounded-full file:border-0 file:bg-[var(--paper-sand)] file:px-4 file:py-2 file:text-sm"
        />
        <p className="text-sm text-[var(--ink-soft)]">
          支持常见图片格式，建议单张 10MB 以内。当前服务端接收上限已放宽到 12MB。{fileName ? ` 当前选择：${fileName}` : ""}
        </p>
      </div>

      {previewUrl && (
        <div className="md:col-span-2">
          <div className="upload-preview">
            <div className="upload-preview__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="上传预览" className="upload-preview__image" />
            </div>
            <div>
              <p className="text-base font-semibold text-[var(--ink)]">上传预览</p>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                这张照片会跟随这篇日记一起写入相册，并在首页和图库中作为回忆封面展示。
              </p>
            </div>
          </div>
        </div>
      )}

      <label className="inline-flex items-center gap-3 text-sm text-[var(--ink-soft)]">
        <input type="checkbox" name="isFeatured" className="h-4 w-4" />
        设为重要时刻
      </label>
      <div className="md:col-span-2">
        <PublishButton />
      </div>
    </form>
  );
}
