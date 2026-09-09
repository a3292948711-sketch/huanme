"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Home,
  MessageCircle,
  Plus,
  Sparkles,
  UserRound,
} from "lucide-react";

const navItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/community", label: "换圈", icon: Sparkles },
  { href: "/publish", label: "发布", icon: Plus, primary: true },
  { href: "/messages", label: "消息", icon: MessageCircle },
  { href: "/profile", label: "我的", icon: UserRound },
];

export function MobileShell({
  title,
  children,
  backHref,
  action,
  hideNav = false,
}: {
  title: string;
  children: React.ReactNode;
  backHref?: string;
  action?: React.ReactNode;
  hideNav?: boolean;
}) {
  return (
    <main className="min-h-dvh bg-background pb-24 text-foreground">
      <div className="mx-auto min-h-dvh w-full max-w-3xl border-x-0 border-border bg-background sm:border-x">
        <header className="sticky top-0 z-40 flex min-h-16 items-center gap-3 border-b border-border/80 bg-background/94 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
          {backHref ? (
            <Link
              href={backHref}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-card"
              aria-label="返回"
            >
              <ArrowLeft className="size-5" />
            </Link>
          ) : null}
          <h1 className="min-w-0 flex-1 truncate text-xl font-black tracking-tight">
            {title}
          </h1>
          {action}
        </header>
        {children}
      </div>
      {!hideNav ? <BottomNav /> : null}
    </main>
  );
}

function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/96 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl" aria-label="底部导航">
      <div className="mx-auto grid max-w-md grid-cols-5 px-2">
        {navItems.map(({ href, label, icon: Icon, primary }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          if (primary) {
            return (
              <Link key={href} href={href} className="group -mt-7 flex flex-col items-center gap-1 text-xs font-bold">
                <span className="grid size-14 place-items-center rounded-full border-2 border-ink bg-yellow shadow-[3px_3px_0_#111] transition group-active:translate-x-0.5 group-active:translate-y-0.5 group-active:shadow-none">
                  <Icon className="size-7" strokeWidth={2.5} />
                </span>
                {label}
              </Link>
            );
          }
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 py-1 text-[11px] font-bold ${active ? "text-ink" : "text-muted-foreground"}`}
            >
              <span className={`grid size-7 place-items-center rounded-lg ${active ? "bg-yellow" : ""}`}>
                <Icon className="size-[18px]" strokeWidth={active ? 2.7 : 2} />
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
