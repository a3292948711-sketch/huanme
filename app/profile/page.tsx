import Link from "next/link";
import {
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Heart,
  MapPin,
  Package,
  Settings,
  ShieldCheck,
  Star,
  WalletCards,
} from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { UserAvatar } from "@/components/user-avatar";

const creditScore = 788;
const creditLevels = [
  { label: "低", color: "#fb7185" },
  { label: "正常", color: "#fb923c" },
  { label: "良好", color: "#facc15" },
  { label: "高", color: "#34d399" },
  { label: "极高", color: "#38bdf8" },
];
const creditLevelIndex = Math.min(4, Math.floor(creditScore / 200));

const shortcuts = [
  { label: "我的发布", value: "3", icon: Package },
  { label: "收藏", value: "12", icon: Heart },
  { label: "浏览历史", value: "28", icon: Clock3 },
  { label: "信用分", value: "788", icon: ShieldCheck },
];

export default function ProfilePage() {
  return (
    <MobileShell title="我的" action={<button className="grid size-10 place-items-center rounded-full border border-border bg-card" aria-label="设置"><Settings className="size-5" /></button>}>
      <div className="space-y-5 p-4 sm:p-6">
        <section className="relative overflow-hidden rounded-[28px] border-2 border-ink bg-ink p-5 text-white shadow-[5px_5px_0_#ffd600]">
          <div className="flex items-center gap-4">
            <UserAvatar name="换么体验官" className="size-16 border-2 border-yellow" />
            <div><h2 className="text-xl font-black">换么体验官</h2><p className="mt-1 text-sm text-white/60">上海 · 已完成12次交换</p></div>
          </div>
          <div className="mt-5 rounded-2xl bg-white/10 p-4">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-white/60">循环信用</p><p className="mt-1 text-2xl font-black text-yellow">{creditLevels[creditLevelIndex].label} · {creditScore}</p></div>
              <ShieldCheck className="size-10 text-yellow" />
            </div>
            <div className="relative mt-5" role="progressbar" aria-label="信誉分" aria-valuemin={0} aria-valuemax={1000} aria-valuenow={creditScore} aria-valuetext={`${creditScore}分，${creditLevels[creditLevelIndex].label}`}>
              <div className="grid h-2.5 grid-cols-5 gap-1 overflow-hidden rounded-full">
                {creditLevels.map((level) => <span key={level.label} style={{ backgroundColor: level.color }} />)}
              </div>
              <span className="absolute -top-1.5 h-5 w-1.5 -translate-x-1/2 rounded-full bg-white ring-2 ring-ink" style={{ left: `${creditScore / 10}%` }} />
            </div>
            <div className="mt-3 grid grid-cols-5 text-center text-xs">
              {creditLevels.map((level, index) => <span key={level.label} className={index === creditLevelIndex ? "font-black text-white" : "text-white/50"}>{level.label}</span>)}
            </div>
            <p className="mt-3 text-xs text-white/60">距离极高信誉还差 {800 - creditScore} 分</p>
          </div>
        </section>

        <section className="grid grid-cols-4 gap-2 rounded-3xl border border-border bg-card p-3">
          {shortcuts.map(({ label, value, icon: Icon }) => (
            <button key={label} className="rounded-2xl px-1 py-3 text-center hover:bg-muted"><Icon className="mx-auto size-5" /><p className="mt-2 text-lg font-black">{value}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{label}</p></button>
          ))}
        </section>

        <section className="rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center justify-between"><h2 className="font-black">我的交易</h2><Link href="/orders" className="text-xs font-bold text-muted-foreground">全部订单</Link></div>
          <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs font-bold">
            {[["待确认", CircleDollarSign], ["待发货", Package], ["运输中", MapPin], ["待评价", Star]].map(([label, Icon]) => {
              const ItemIcon = Icon as typeof Package;
              return <Link key={label as string} href="/orders" className="rounded-2xl bg-muted px-1 py-3"><ItemIcon className="mx-auto size-5" /><p className="mt-2">{label as string}</p></Link>;
            })}
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-border bg-card">
          <MenuItem href="/orders" icon={Package} label="我的换物" note="2个进行中" />
          <MenuItem href="#" icon={WalletCards} label="钱包与担保金" note="安全托管" />
          <MenuItem href="#" icon={MapPin} label="收货地址" />
          <MenuItem href="#" icon={ShieldCheck} label="实名认证与信用" note="已认证" />
        </section>
      </div>
    </MobileShell>
  );
}

function MenuItem({ href, icon: Icon, label, note }: { href: string; icon: typeof Package; label: string; note?: string }) {
  return <Link href={href} className="flex items-center gap-3 border-b border-border px-5 py-4 last:border-0"><span className="grid size-10 place-items-center rounded-2xl bg-yellow-soft"><Icon className="size-5" /></span><span className="flex-1 font-black">{label}</span>{note ? <span className="text-xs text-muted-foreground">{note}</span> : null}<ChevronRight className="size-4 text-muted-foreground" /></Link>;
}
