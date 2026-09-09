import { Check, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { demoProducts, money, myItems } from "@/lib/demo-data";

const timeline = [
  { title: "上海质检中心已发出", time: "今天 10:32", done: true },
  { title: "平台验货通过", time: "今天 08:18", done: true },
  { title: "商品到达质检中心", time: "昨天 17:06", done: true },
  { title: "等待双方确认收货", time: "预计明天", done: false },
];

export default function OrdersPage() {
  const target = demoProducts[0];
  const offered = myItems[0];
  return (
    <MobileShell title="订单与物流" backHref="/profile">
      <div className="space-y-5 p-4 sm:p-6">
        <section className="rounded-3xl border-2 border-ink bg-yellow p-5 shadow-[4px_4px_0_#111]">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-ink text-yellow"><Truck className="size-6" /></span>
            <div>
              <p className="text-sm font-bold">交换进行中</p>
              <h2 className="text-xl font-black">双方商品正在配送</h2>
            </div>
          </div>
          <p className="mt-4 rounded-2xl bg-white/70 p-3 text-sm font-bold">预计明天送达 · 顺丰 SF1328567209</p>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5">
          <h2 className="font-black">交换商品</h2>
          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
            <div><img src={offered.image} alt={offered.title} className="aspect-square w-full rounded-2xl object-cover" /><p className="mt-2 line-clamp-2 text-xs font-black">{offered.title}</p></div>
            <span className="grid size-10 place-items-center rounded-full bg-yellow text-xl font-black">↔</span>
            <div><img src={target.image} alt={target.title} className="aspect-square w-full rounded-2xl object-cover" /><p className="mt-2 line-clamp-2 text-xs font-black">{target.title}</p></div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-muted p-3 text-sm"><span className="font-bold text-muted-foreground">补差价</span><strong>对方补 {money(100)}</strong></div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center gap-2"><ShieldCheck className="size-5 text-emerald-600" /><h2 className="font-black">验货与物流进度</h2></div>
          <div className="mt-5 space-y-0">
            {timeline.map((item, index) => (
              <div key={item.title} className="grid grid-cols-[28px_1fr] gap-3">
                <div className="flex flex-col items-center">
                  <span className={`grid size-7 place-items-center rounded-full border-2 ${item.done ? "border-ink bg-yellow" : "border-border bg-card"}`}>{item.done ? <Check className="size-4" strokeWidth={3} /> : <PackageCheck className="size-3.5 text-muted-foreground" />}</span>
                  {index < timeline.length - 1 ? <span className="h-12 w-0.5 bg-border" /> : null}
                </div>
                <div className="pb-5"><p className={`text-sm font-black ${item.done ? "" : "text-muted-foreground"}`}>{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.time}</p></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MobileShell>
  );
}
