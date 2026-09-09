"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { Button } from "@/components/ui/button";
import { demoProducts, money, myItems } from "@/lib/demo-data";

type ModelContext = {
  registerTool?: (tool: Record<string, unknown>, options?: { signal?: AbortSignal }) => void | Promise<void>;
};

export function MatchBuilder({ targetId }: { targetId: number }) {
  const target = demoProducts.find((item) => item.id === targetId) ?? demoProducts[0];
  const [selectedId, setSelectedId] = useState(myItems[0].id);
  const [adjustment, setAdjustment] = useState(-100);
  const [mode, setMode] = useState<"inspection" | "direct">("inspection");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "offline">("idle");
  const selected = useMemo(
    () => myItems.find((item) => item.id === selectedId) ?? myItems[0],
    [selectedId],
  );

  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(
      context.registerTool(
        {
          name: "stage_swap_offer",
          title: "配置换物方案",
          description: "在当前换物页面选择我的物品、补差金额和履约方式。只配置方案，不提交交易。",
          inputSchema: {
            type: "object",
            properties: {
              offeredItemId: { type: "number", enum: myItems.map((item) => item.id) },
              cashAdjustment: { type: "number", minimum: -5000, maximum: 5000 },
              fulfillmentMode: { type: "string", enum: ["inspection", "direct"] },
            },
            required: ["offeredItemId", "cashAdjustment", "fulfillmentMode"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          execute(input: unknown) {
            const value = input as {
              offeredItemId: number;
              cashAdjustment: number;
              fulfillmentMode: "inspection" | "direct";
            };
            if (!myItems.some((item) => item.id === value.offeredItemId)) {
              throw new Error("无效的交换物品");
            }
            setSelectedId(value.offeredItemId);
            setAdjustment(Math.round(value.cashAdjustment));
            setMode(value.fulfillmentMode);
            return { staged: true, targetProductId: target.id, ...value };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => undefined);
    return () => lifecycle.abort();
  }, [target.id]);

  async function submitSwap() {
    setStatus("sending");
    try {
      const response = await fetch("/api/swaps", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          targetProductId: target.id,
          offeredProductId: selected.id,
          offeredTitle: selected.title,
          offeredImageUrl: selected.image,
          cashAdjustment: adjustment,
          fulfillmentMode: mode,
          note: "希望交换，成色和配件可以在聊天中继续确认。",
        }),
      });
      if (!response.ok) throw new Error("offline");
      setStatus("success");
    } catch {
      setStatus("offline");
    }
  }

  if (status === "success" || status === "offline") {
    return (
      <MobileShell title="交换申请" backHref={`/product/${target.id}`} hideNav>
        <div className="grid min-h-[calc(100dvh-64px)] place-items-center p-6 text-center">
          <div>
            <span className="mx-auto grid size-20 place-items-center rounded-full border-2 border-ink bg-yellow shadow-[5px_5px_0_#111]">
              <Check className="size-10" strokeWidth={3} />
            </span>
            <h2 className="mt-7 text-2xl font-black">
              {status === "success" ? "交换申请已发出" : "交换方案已准备好"}
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
              {status === "success"
                ? "对方确认后，你们可以继续协商补差与验货方式。"
                : "当前预览未连接云端数据库；接入仓库并部署后，这一步会真实写入订单。"}
            </p>
            <Button asChild className="mt-7 h-12 rounded-2xl bg-ink px-8 font-black text-white">
              <Link href="/messages">进入聊天协商</Link>
            </Button>
          </div>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell title="发起交换" backHref={`/product/${target.id}`} hideNav>
      <div className="space-y-5 p-4 pb-28 sm:p-6">
        <section>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">Target</p>
          <h2 className="mt-1 text-lg font-black">对方的商品</h2>
          <div className="mt-3 flex gap-4 rounded-3xl border border-border bg-card p-3">
            <img src={target.image} alt={target.title} className="size-24 rounded-2xl object-cover" />
            <div className="min-w-0 py-1">
              <p className="line-clamp-2 font-black">{target.title}</p>
              <p className="mt-2 text-sm font-bold text-muted-foreground">AI估值 {money(target.value)}</p>
              <span className="mt-2 inline-block rounded-lg bg-yellow-soft px-2 py-1 text-xs font-black">{target.match}%匹配</span>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">Offer</p>
              <h2 className="mt-1 text-lg font-black">选择我的交换物</h2>
            </div>
            <Link href="/publish" className="text-sm font-bold underline decoration-yellow decoration-4 underline-offset-4">新发布</Link>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {myItems.map((item) => {
              const active = selectedId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`flex gap-3 rounded-3xl border-2 p-3 text-left ${active ? "border-ink bg-yellow-soft shadow-[3px_3px_0_#111]" : "border-border bg-card"}`}
                >
                  <img src={item.image} alt={item.title} className="size-20 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1 py-1">
                    <p className="line-clamp-2 text-sm font-black">{item.title}</p>
                    <p className="mt-2 text-xs font-bold text-muted-foreground">{money(item.value)} · {item.condition}</p>
                  </div>
                  {active ? <Check className="size-5 shrink-0" /> : null}
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border-2 border-ink bg-yellow p-5 shadow-[4px_4px_0_#111]">
          <div className="flex items-center gap-2"><Sparkles className="size-5" /><h2 className="font-black">AI补差建议</h2></div>
          <p className="mt-3 text-3xl font-black">{adjustment < 0 ? `对方补 ${money(Math.abs(adjustment))}` : adjustment > 0 ? `我补 ${money(adjustment)}` : "纯物交换"}</p>
          <p className="mt-2 text-sm font-medium">综合近期成交价、成色和市场热度，建议差价区间为 -¥180 至 ¥50。</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[-100, 0, 100].map((value) => (
              <button key={value} onClick={() => setAdjustment(value)} className={`rounded-full border-2 border-ink px-4 py-2 text-sm font-black ${adjustment === value ? "bg-ink text-yellow" : "bg-white"}`}>
                {value < 0 ? "对方补¥100" : value === 0 ? "纯换" : "我补¥100"}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-black">履约方式</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button onClick={() => setMode("inspection")} className={`rounded-3xl border-2 p-4 text-left ${mode === "inspection" ? "border-ink bg-card shadow-[3px_3px_0_#111]" : "border-border bg-card"}`}>
              <ShieldCheck className="size-6 text-emerald-600" />
              <p className="mt-3 font-black">平台担保 + 验货</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">双方先寄往平台，通过后再互发</p>
            </button>
            <button onClick={() => setMode("direct")} className={`rounded-3xl border-2 p-4 text-left ${mode === "direct" ? "border-ink bg-card shadow-[3px_3px_0_#111]" : "border-border bg-card"}`}>
              <Truck className="size-6 text-blue-600" />
              <p className="mt-3 font-black">双方直接寄送</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">适合低价值商品或同城面交</p>
            </button>
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/96 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        <Button onClick={submitSwap} disabled={status === "sending"} className="mx-auto h-12 w-full max-w-3xl rounded-2xl bg-yellow font-black text-ink hover:bg-yellow/90">
          {status === "sending" ? "正在提交…" : "确认并发起交换"}
        </Button>
      </div>
    </MobileShell>
  );
}
