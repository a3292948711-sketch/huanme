"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BadgeCheck,
  Heart,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { Button } from "@/components/ui/button";
import { demoProducts, money } from "@/lib/demo-data";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const product =
    demoProducts.find((item) => item.id === Number(params.id)) ?? demoProducts[0];

  return (
    <MobileShell
      title="商品详情"
      backHref="/"
      hideNav
      action={
        <button className="grid size-10 place-items-center rounded-full border border-border bg-card" aria-label="收藏">
          <Heart className="size-5" />
        </button>
      }
    >
      <div className="pb-28">
        <div className="relative aspect-square overflow-hidden bg-muted sm:aspect-[4/3]">
          <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
          <span className="absolute bottom-4 left-4 rounded-full bg-ink px-3 py-1.5 text-xs font-black text-yellow">
            AI匹配度 {product.match}%
          </span>
        </div>
        <section className="border-b border-border bg-card p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-muted-foreground">AI参考估值</p>
              <p className="mt-1 text-3xl font-black tracking-tight">{money(product.value)}</p>
            </div>
            <span className="rounded-xl bg-yellow-soft px-3 py-2 text-sm font-black">{product.condition}</span>
          </div>
          <h2 className="mt-5 text-xl font-black leading-7">{product.title}</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">{product.description}</p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
            <MapPin className="size-4" /> {product.city} · 2小时前发布
          </p>
        </section>

        <section className="m-4 rounded-3xl border border-border bg-card p-5 sm:m-6">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-full bg-ink text-lg font-black text-yellow">
              {product.seller.slice(0, 1)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 font-black">
                {product.seller} <BadgeCheck className="size-4 fill-yellow" />
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                信用分 {product.credit} · 已完成 36 次交易
              </p>
            </div>
            <button className="rounded-full border border-border px-3 py-1.5 text-xs font-bold">看主页</button>
          </div>
        </section>

        <section className="m-4 rounded-3xl border-2 border-ink bg-yellow p-5 shadow-[4px_4px_0_#111] sm:m-6">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5" />
            <h3 className="font-black">卖家想换</h3>
          </div>
          <p className="mt-3 text-lg font-black">{product.want}</p>
          <p className="mt-2 text-sm font-medium">你的 Switch OLED 与该商品高度匹配，预计对方补 ¥100。</p>
        </section>

        <section className="m-4 grid grid-cols-2 gap-3 sm:m-6">
          <div className="rounded-2xl border border-border bg-card p-4">
            <ShieldCheck className="size-6 text-emerald-600" />
            <p className="mt-2 text-sm font-black">平台担保</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">确认收货后再放款</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <BadgeCheck className="size-6 text-blue-600" />
            <p className="mt-2 text-sm font-black">支持验货</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">平台出具验货报告</p>
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/96 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl gap-2">
          <Link href="/messages" className="grid size-12 shrink-0 place-items-center rounded-2xl border border-border bg-card" aria-label="联系卖家">
            <MessageCircle className="size-5" />
          </Link>
          <Button variant="outline" className="h-12 flex-1 rounded-2xl border-2 border-ink font-black">
            直接购买
          </Button>
          <Button asChild className="h-12 flex-[1.4] rounded-2xl bg-yellow font-black text-ink hover:bg-yellow/90">
            <Link href={`/match?target=${product.id}`}>发起交换</Link>
          </Button>
        </div>
      </div>
    </MobileShell>
  );
}
