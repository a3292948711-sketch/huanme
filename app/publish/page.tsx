"use client";

import { ChangeEvent, useState } from "react";
import { Camera, Check, ImagePlus, Sparkles, UploadCloud } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const defaultImage =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=84";

export default function PublishPage() {
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "数码",
    condition: "95新",
    estimatedValue: 0,
    price: 0,
    desiredItems: "",
    city: "上海",
  });

  function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setStatus("");
  }

  async function analyze() {
    setAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 850));
    setForm((current) => ({
      ...current,
      title: current.title || "Sony WH-1000XM5 头戴式降噪耳机",
      description:
        current.description ||
        "AI识别为索尼头戴式降噪耳机，外观保存良好。建议补充使用时长、配件情况和功能状态。",
      category: "数码",
      condition: "95新",
      estimatedValue: 1680,
      price: 1680,
      desiredItems: current.desiredItems || "Switch OLED、游戏掌机或同价位数码产品",
    }));
    setAnalyzing(false);
  }

  async function submit() {
    if (!form.title.trim()) {
      setStatus("请先填写商品标题");
      return;
    }
    setStatus("正在发布…");
    let imageUrl = defaultImage;
    try {
      if (file) {
        const body = new FormData();
        body.append("file", file);
        const upload = await fetch("/api/upload", { method: "POST", body });
        if (upload.ok) {
          const data = (await upload.json()) as { url?: string; imageUrl?: string };
          imageUrl = data.url ?? data.imageUrl ?? defaultImage;
        }
      }
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, imageUrl, acceptsSwap: true }),
      });
      if (!response.ok) throw new Error("offline");
      setStatus("发布成功，商品已进入智能匹配池");
    } catch {
      setStatus("内容已保留；连接云端数据库后即可真实发布");
    }
  }

  return (
    <MobileShell title="发布闲置" backHref="/">
      <div className="space-y-6 p-4 pb-8 sm:p-6">
        <section>
          <h2 className="text-lg font-black">商品图片</h2>
          <label className="relative mt-3 grid aspect-[4/3] cursor-pointer place-items-center overflow-hidden rounded-3xl border-2 border-dashed border-ink bg-card">
            {preview ? (
              <img src={preview} alt="待发布商品预览" className="h-full w-full object-cover" />
            ) : (
              <div className="text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-yellow">
                  <ImagePlus className="size-7" />
                </span>
                <p className="mt-4 font-black">拍照或上传商品图片</p>
                <p className="mt-1 text-xs text-muted-foreground">JPG、PNG、WebP，最大8MB</p>
              </div>
            )}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseImage} className="sr-only" />
          </label>
        </section>

        <section className="rounded-3xl border-2 border-ink bg-ink p-5 text-white shadow-[4px_4px_0_#ffd600]">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-yellow text-ink">
              <Sparkles className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-black">AI帮你快速发布</h2>
              <p className="mt-1 text-sm leading-6 text-white/65">识别品类、生成文案并给出参考估值。</p>
            </div>
          </div>
          <Button onClick={analyze} disabled={analyzing} className="mt-4 h-11 w-full rounded-2xl bg-yellow font-black text-ink hover:bg-yellow/90">
            {analyzing ? "正在识别…" : "开始AI识物"}
          </Button>
        </section>

        <section className="space-y-4 rounded-3xl border border-border bg-card p-5">
          <Field label="商品标题">
            <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="品牌 + 型号 + 核心特点" className="h-12 rounded-2xl" />
          </Field>
          <Field label="商品描述">
            <Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="说明使用情况、配件与瑕疵" className="min-h-28 rounded-2xl" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="分类">
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="h-12 w-full rounded-2xl border bg-background px-3 text-sm font-bold">
                <option>数码</option><option>游戏</option><option>潮玩</option><option>穿搭</option><option>其他</option>
              </select>
            </Field>
            <Field label="成色">
              <select value={form.condition} onChange={(event) => setForm({ ...form, condition: event.target.value })} className="h-12 w-full rounded-2xl border bg-background px-3 text-sm font-bold">
                <option>全新</option><option>准新</option><option>95新</option><option>9成新</option><option>8成新</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="AI估值（元）">
              <Input type="number" value={form.estimatedValue || ""} onChange={(event) => setForm({ ...form, estimatedValue: Number(event.target.value) })} className="h-12 rounded-2xl" />
            </Field>
            <Field label="直接售价（元）">
              <Input type="number" value={form.price || ""} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} className="h-12 rounded-2xl" />
            </Field>
          </div>
          <Field label="想换什么">
            <Input value={form.desiredItems} onChange={(event) => setForm({ ...form, desiredItems: event.target.value })} placeholder="例如：Switch OLED、潮玩" className="h-12 rounded-2xl" />
          </Field>
        </section>

        {status ? (
          <div className="flex items-start gap-2 rounded-2xl bg-yellow-soft p-4 text-sm font-bold">
            {status.includes("成功") ? <Check className="size-5 shrink-0" /> : <UploadCloud className="size-5 shrink-0" />}
            {status}
          </div>
        ) : null}
        <Button onClick={submit} className="h-13 w-full rounded-2xl bg-yellow text-base font-black text-ink hover:bg-yellow/90">
          <Camera className="size-5" /> 发布商品
        </Button>
      </div>
    </MobileShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">{label}</span>
      {children}
    </label>
  );
}
