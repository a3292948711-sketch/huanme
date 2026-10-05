"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Gamepad2,
  Grid2X2,
  Heart,
  Home,
  Laptop,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  Shirt,
  Sparkles,
  ToyBrick,
  UserRound,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationIcon } from "@/components/navigation-icon";
import { demoProducts, money } from "@/lib/demo-data";

const categories = [
  { label: "数码", icon: Laptop },
  { label: "游戏", icon: Gamepad2 },
  { label: "潮玩", icon: ToyBrick },
  { label: "穿搭", icon: Shirt },
  { label: "全部", icon: Grid2X2 },
];

const products = demoProducts.map((product) => ({ ...product, value: money(product.value) }));
const cardGradients: Record<string, string> = {
  数码: "linear-gradient(145deg, #ffffff 0%, #eef5ff 60%, #e6edff 100%)",
  游戏: "linear-gradient(145deg, #ffffff 0%, #f3efff 60%, #e8e0ff 100%)",
  潮玩: "linear-gradient(145deg, #ffffff 0%, #fff4e4 60%, #ffe8cc 100%)",
  穿搭: "linear-gradient(145deg, #ffffff 0%, #eefaf2 60%, #dff3e8 100%)",
};

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("全部");
  const [liked, setLiked] = useState<number[]>([]);

  const visibleProducts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return products.filter((product) =>
      (activeCategory === "全部" || product.category === activeCategory) &&
      (!keyword || `${product.title}${product.want}${product.city}${product.category}`.toLowerCase().includes(keyword)),
    ).sort((left, right) => right.match - left.match);
  }, [query, activeCategory]);

  function toggleLike(id: number) {
    setLiked((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
  }

  useEffect(() => {
    const context = (document as Document & {
      modelContext?: {
        registerTool?: (
          tool: Record<string, unknown>,
          options?: { signal?: AbortSignal },
        ) => void | Promise<void>;
      };
    }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(
      context.registerTool(
        {
          name: "search_products",
          title: "搜索换物商品",
          description: "按关键词搜索当前换么商品目录，返回匹配商品和AI估值。",
          inputSchema: {
            type: "object",
            properties: { query: { type: "string", minLength: 1, maxLength: 60 } },
            required: ["query"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: true, untrustedContentHint: true },
          execute(input: unknown) {
            const keyword = String((input as { query?: string }).query ?? "").trim().toLowerCase();
            if (!keyword) throw new Error("搜索词不能为空");
            return {
              products: products
                .filter((product) => `${product.title}${product.want}${product.city}`.toLowerCase().includes(keyword))
                .map(({ id, title, value, match }) => ({ id, title, value, match })),
            };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1180px]">
        <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r border-border bg-card px-5 py-7 lg:flex">
          <Brand />
          <nav className="mt-12 space-y-2" aria-label="主导航">
            <DesktopNavItem icon={Home} label="首页" active />
            <DesktopNavItem icon={Sparkles} label="换圈" />
            <DesktopNavItem icon={Plus} label="发布" />
            <DesktopNavItem icon={MessageCircle} label="消息" badge="3" />
            <DesktopNavItem icon={UserRound} label="我的" />
          </nav>
          <div className="mt-auto rounded-3xl bg-ink p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow">
              AI Match
            </p>
            <p className="mt-2 text-base font-black leading-snug">
              让闲置找到真正想要它的人
            </p>
            <Button asChild className="mt-4 w-full rounded-full bg-yellow text-ink hover:bg-yellow/90">
              <Link href="/publish">发布闲置</Link>
            </Button>
          </div>
        </aside>

        <section className="min-w-0 flex-1 pb-24 lg:pb-10">
          <header className="sticky top-0 z-30 border-b border-border/70 bg-background/92 px-4 pb-3 pt-[max(14px,env(safe-area-inset-top))] backdrop-blur-xl sm:px-7 lg:px-10">
            <div className="flex items-center justify-between lg:hidden">
              <Brand />
              <button
                className="grid size-10 place-items-center rounded-full border border-border bg-card"
                aria-label="通知"
              >
                <Bell className="size-5" />
              </button>
            </div>
            <div className="mt-4 flex gap-2 lg:mt-0">
              <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border-2 border-ink bg-card px-4 py-3 shadow-[3px_3px_0_#111] focus-within:shadow-[1px_1px_0_#111]">
                <Search className="size-5 shrink-0" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-muted-foreground"
                  placeholder="搜你想换的数码、游戏、潮玩"
                  aria-label="搜索商品"
                />
              </label>
              <button
                className="hidden size-12 place-items-center rounded-2xl border-2 border-ink bg-yellow shadow-[3px_3px_0_#111] lg:grid"
                aria-label="通知"
              >
                <Bell className="size-5" />
              </button>
            </div>
          </header>

          <div className="px-4 sm:px-7 lg:px-10">
            <section className="relative mt-5 overflow-hidden rounded-[28px] border-2 border-ink bg-yellow p-5 shadow-[5px_5px_0_#111] sm:p-7">
              <div className="relative z-10 max-w-lg">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-black text-yellow">
                  <Zap className="size-3.5 fill-current" /> 双向匹配上线
                </span>
                <h1 className="mt-4 max-w-[12ch] text-[2rem] font-black leading-[1.02] tracking-[-0.05em] sm:text-5xl">
                  不想卖？那就换。
                </h1>
                <p className="mt-3 max-w-sm text-sm font-semibold leading-6 sm:text-base">
                  告诉我们你有什么、想要什么，AI帮你找到高匹配交换对象。
                </p>
                <Button asChild className="mt-5 h-11 rounded-full bg-ink px-5 font-black text-white hover:bg-ink/90">
                  <Link href="/match?target=1"><Sparkles className="size-4" /> 开始智能匹配</Link>
                </Button>
              </div>
              <div className="absolute -bottom-10 -right-8 size-40 rotate-12 rounded-[38px] border-[18px] border-ink/10 sm:size-56" />
              <div className="absolute right-8 top-6 text-5xl font-black text-ink/10 sm:text-7xl">
                ↔
              </div>
            </section>

            <section className="mt-7" aria-labelledby="category-title">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                    Explore
                  </p>
                  <h2 id="category-title" className="mt-1 text-xl font-black">
                    逛分类
                  </h2>
                </div>
                <button onClick={() => { setActiveCategory("全部"); setQuery(""); }} className="text-sm font-bold underline decoration-yellow decoration-4 underline-offset-4">
                  查看全部
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {categories.map(({ label, icon: Icon }) => {
                  const active = activeCategory === label;
                  return (
                    <button
                      key={label}
                      onClick={() => setActiveCategory(label)}
                      aria-pressed={active}
                      className={`flex min-w-0 flex-col items-center gap-2 rounded-2xl border px-1 py-3 text-xs font-bold transition active:scale-95 sm:text-sm ${
                        active
                          ? "border-ink bg-ink text-white"
                          : "border-border bg-card hover:border-ink"
                      }`}
                    >
                      <Icon className={`size-5 ${active ? "text-yellow" : ""}`} />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="mt-8" aria-labelledby="recommend-title">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 id="recommend-title" className="text-xl font-black">
                    为你匹配
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {activeCategory === "全部" ? "按你的想换清单和信用偏好排序" : `${activeCategory}好物 · 按匹配度为你推荐`}
                  </p>
                </div>
                <span className="rounded-full bg-yellow-soft px-3 py-1.5 text-xs font-black">
                  {visibleProducts.length} 件
                </span>
              </div>

              {visibleProducts.length ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
                  {visibleProducts.map((product) => (
                    <article
                      key={product.id}
                      className="group overflow-hidden rounded-[22px] border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:border-ink hover:shadow-[4px_4px_0_#111]"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        <Link href={`/product/${product.id}`} className="block h-full w-full">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        </Link>
                        <button
                          onClick={() => toggleLike(product.id)}
                          className="absolute right-2.5 top-2.5 grid size-9 place-items-center rounded-full border border-black/10 bg-white/90 backdrop-blur"
                          aria-label={liked.includes(product.id) ? "取消收藏" : "收藏"}
                        >
                          <Heart
                            className={`size-4.5 ${liked.includes(product.id) ? "fill-red-500 text-red-500" : ""}`}
                          />
                        </button>
                        <span className="absolute bottom-2.5 left-2.5 rounded-full bg-ink px-2.5 py-1 text-[11px] font-black text-yellow">
                          {product.match}% 匹配
                        </span>
                      </div>
                      <div className="p-3.5 sm:p-4" style={{ background: cardGradients[product.category] }}>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                          <span>{product.condition}</span>
                          <span className="size-1 rounded-full bg-border" />
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="size-3" /> {product.city}
                          </span>
                        </div>
                        <h3 className="mt-2 line-clamp-2 min-h-10 text-sm font-black leading-5 sm:text-base">
                          <Link href={`/product/${product.id}`}>{product.title}</Link>
                        </h3>
                        <div className="mt-3 flex items-end justify-between gap-2">
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground">AI估值</p>
                            <p className="text-base font-black">{product.value}</p>
                          </div>
                          <span className="rounded-lg bg-yellow-soft px-2 py-1 text-[10px] font-bold">
                            可换
                          </span>
                        </div>
                        <p className="mt-3 truncate border-t border-dashed border-border pt-3 text-xs text-muted-foreground">
                          想换：{product.want}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border-2 border-dashed border-border bg-card px-6 py-14 text-center">
                  <Search className="mx-auto size-8 text-muted-foreground" />
                  <p className="mt-3 font-black">没有找到相关商品</p>
                  <button
                    onClick={() => { setQuery(""); setActiveCategory("全部"); }}
                    className="mt-2 text-sm font-bold text-muted-foreground underline"
                  >
                    查看全部商品
                  </button>
                </div>
              )}
            </section>
          </div>
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/96 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden" aria-label="底部导航">
        <div className="mx-auto grid max-w-md grid-cols-5 px-2">
          <MobileNavItem icon={Home} label="首页" active />
          <MobileNavItem icon={Sparkles} label="换圈" />
          <Link
            href="/publish"
            className="group -mt-7 flex flex-col items-center gap-1 text-xs font-bold"
            aria-label="发布闲置"
          >
            <span className="grid size-14 place-items-center rounded-full bg-white shadow-[0_2px_12px_#f5cc1933] transition group-active:scale-95">
              <NavigationIcon label="发布" className="size-12" />
            </span>
            发布
          </Link>
          <MobileNavItem icon={MessageCircle} label="消息" badge="3" />
          <MobileNavItem icon={UserRound} label="我的" />
        </div>
      </nav>
    </main>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2" aria-label="换么">
      <span className="grid size-9 rotate-[-4deg] place-items-center rounded-xl border-2 border-ink bg-yellow text-xl font-black shadow-[2px_2px_0_#111]">
        换
      </span>
      <span className="text-xl font-black tracking-[-0.08em]">换么</span>
    </div>
  );
}

function DesktopNavItem({
  label,
  active,
  badge,
}: {
  icon: typeof Home;
  label: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <Link
      href={label === "首页" ? "/" : label === "换圈" ? "/community" : label === "发布" ? "/publish" : label === "消息" ? "/messages" : "/profile"}
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-black ${
        active ? "bg-yellow text-ink" : "hover:bg-muted"
      }`}
    >
      <NavigationIcon label={label} className="size-8 shrink-0" />
      <span>{label}</span>
      {badge ? (
        <span className="ml-auto grid size-5 place-items-center rounded-full bg-ink text-[10px] text-yellow">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

function MobileNavItem({
  label,
  active,
  badge,
}: {
  icon: typeof Home;
  label: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <Link href={label === "首页" ? "/" : label === "换圈" ? "/community" : label === "消息" ? "/messages" : "/profile"} className={`relative flex flex-col items-center gap-1 py-1 text-[11px] font-bold ${active ? "text-ink" : "text-muted-foreground"}`}>
      <span className={`grid size-10 place-items-center rounded-xl ${active ? "bg-yellow/10" : ""}`}>
        <NavigationIcon label={label} className="size-9" />
      </span>
      {label}
      {badge ? (
        <span className="absolute right-[22%] top-0 grid size-4 place-items-center rounded-full bg-red-500 text-[9px] text-white">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
