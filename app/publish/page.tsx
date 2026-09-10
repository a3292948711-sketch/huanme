"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  ImagePlus,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type PublishStep = 1 | 2 | "success";

export default function PublishPage() {
  const [step, setStep] = useState<PublishStep>(1);
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "数码",
    condition: "95新",
    estimatedValue: 0,
    price: 0,
    desiredItems: "",
  });

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (preview) URL.revokeObjectURL(preview);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError("");
  }

  function goNext() {
    if (!file) {
      setError("请先选择一张商品图片");
      return;
    }
    setError("");
    setStep(2);
  }

  async function analyze() {
    setAnalyzing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    setForm((current) => ({
      ...current,
      title: current.title || "Sony WH-1000XM5 头戴式降噪耳机",
      description:
        current.description ||
        "外观保存良好，功能正常，配件齐全。希望交换同价位游戏或数码产品。",
      category: "数码",
      condition: "95新",
      estimatedValue: 1680,
      price: 1680,
      desiredItems: current.desiredItems || "Switch OLED、游戏掌机或潮玩",
    }));
    setAnalyzing(false);
  }

  async function submit() {
    if (!form.title.trim()) {
      setError("请先填写商品标题");
      return;
    }
    setError("");
    setPublishing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setPublishing(false);
    setStep("success");
  }

  function reset() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview("");
    setFile(null);
    setError("");
    setForm({
      title: "",
      description: "",
      category: "数码",
      condition: "95新",
      estimatedValue: 0,
      price: 0,
      desiredItems: "",
    });
    setStep(1);
  }

  if (step === "success") {
    return (
      <MobileShell title="发布完成" hideNav>
        <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-6 pb-16 text-center">
          <div className="relative">
            <span className="grid size-28 rotate-3 place-items-center rounded-[34px] border-[3px] border-ink bg-yellow shadow-[7px_7px_0_#111]">
              <Check className="size-14" strokeWidth={3} />
            </span>
            <Sparkles className="absolute -right-8 -top-7 size-8 text-yellow" />
          </div>
          <p className="mt-10 text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">Demo Complete</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.05em]">发布成功！</h2>
          <p className="mt-3 max-w-xs text-base leading-7 text-muted-foreground">
            商品已进入智能匹配演示流程。本次内容和图片不会上传或保存。
          </p>
          <div className="mt-8 grid w-full max-w-sm gap-3">
            <Button asChild className="h-13 rounded-2xl bg-yellow text-base font-black text-ink shadow-[4px_4px_0_#111] hover:bg-yellow/90">
              <Link href="/">返回首页 <ArrowRight className="size-5" /></Link>
            </Button>
            <Button onClick={reset} variant="outline" className="h-12 rounded-2xl border-2 border-ink bg-white font-black">
              <RefreshCw className="size-4" /> 再演示一次
            </Button>
          </div>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell
      title={step === 1 ? "添加商品图片" : "填写商品信息"}
      backHref={step === 1 ? "/" : undefined}
      action={
        step === 2 ? (
          <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-1 text-sm font-black">
            <ArrowLeft className="size-4" /> 上一步
          </button>
        ) : undefined
      }
      hideNav
    >
      <div className="p-4 pb-10 sm:p-6">
        <div className="mb-6 flex items-center gap-3" aria-label={`发布进度，第${step}步，共2步`}>
          {[1, 2].map((item) => (
            <div key={item} className="flex flex-1 items-center gap-2">
              <span className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-black ${step === item ? "bg-ink text-yellow" : step > item ? "bg-yellow text-ink" : "bg-muted text-muted-foreground"}`}>
                {step > item ? <Check className="size-4" /> : item}
              </span>
              <span className={`text-sm font-black ${step === item ? "text-ink" : "text-muted-foreground"}`}>
                {item === 1 ? "选择图片" : "商品信息"}
              </span>
              {item === 1 ? <span className="ml-auto h-0.5 flex-1 bg-border" /> : null}
            </div>
          ))}
        </div>

        {step === 1 ? (
          <div>
            <section className="rounded-[28px] border-2 border-ink bg-card p-4 shadow-[5px_5px_0_#111]">
              <label className="relative grid aspect-[4/3] cursor-pointer place-items-center overflow-hidden rounded-[22px] border-2 border-dashed border-ink bg-muted">
                {preview ? (
                  <img src={preview} alt="待发布商品的本地预览" className="h-full w-full object-cover" />
                ) : (
                  <div className="px-5 text-center">
                    <span className="mx-auto grid size-16 place-items-center rounded-2xl border-2 border-ink bg-yellow shadow-[3px_3px_0_#111]">
                      <ImagePlus className="size-8" />
                    </span>
                    <p className="mt-5 text-lg font-black">拍照或选择商品图片</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">图片只在当前页面预览，不会上传到云端</p>
                  </div>
                )}
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseImage} className="sr-only" />
                {preview ? (
                  <span className="absolute bottom-3 right-3 rounded-full border-2 border-ink bg-white px-3 py-2 text-xs font-black shadow-[2px_2px_0_#111]">更换图片</span>
                ) : null}
              </label>
              {file ? (
                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-yellow-soft px-4 py-3">
                  <div className="min-w-0 text-left">
                    <p className="truncate text-sm font-black">{file.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">已生成本地预览 · 不会保存</p>
                  </div>
                  <Check className="size-5 shrink-0" />
                </div>
              ) : null}
            </section>

            {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p> : null}
            <Button onClick={goNext} className="mt-6 h-13 w-full rounded-2xl bg-yellow text-base font-black text-ink shadow-[4px_4px_0_#111] hover:bg-yellow/90">
              下一步 <ArrowRight className="size-5" />
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            <section className="flex items-center gap-4 rounded-3xl border-2 border-ink bg-card p-3 shadow-[4px_4px_0_#111]">
              <img src={preview} alt="商品图片缩略图" className="size-20 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">已选图片</p>
                <p className="mt-1 truncate font-black">{file?.name}</p>
                <button type="button" onClick={() => setStep(1)} className="mt-2 text-sm font-bold underline decoration-yellow decoration-4 underline-offset-4">重新选择</button>
              </div>
            </section>

            <section className="rounded-3xl border-2 border-ink bg-ink p-5 text-white shadow-[4px_4px_0_#ffd600]">
              <div className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-yellow text-ink"><Sparkles className="size-6" /></span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-black">AI帮你快速填写</h2>
                  <p className="mt-1 text-sm leading-6 text-white/65">演示识别品类、文案与参考估值。</p>
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

            {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p> : null}
            <Button onClick={submit} disabled={publishing} className="h-13 w-full rounded-2xl bg-yellow text-base font-black text-ink shadow-[4px_4px_0_#111] hover:bg-yellow/90">
              <Camera className="size-5" /> {publishing ? "正在完成演示…" : "确认发布"}
            </Button>
            <p className="text-center text-xs leading-5 text-muted-foreground">演示模式不会发送网络请求，也不会保存图片和商品信息</p>
          </div>
        )}
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
