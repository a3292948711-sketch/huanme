"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ImagePlus, Send, ShieldCheck } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { Button } from "@/components/ui/button";

type ChatMessage = { id: number; mine: boolean; body: string; time: string };

export default function MessagesPage() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, mine: false, body: "你好！你的 Switch OLED 成色看起来不错，配件齐全吗？", time: "10:28" },
    { id: 2, mine: true, body: "齐全，原装底座、手柄和包装都在，可以走平台验货。", time: "10:31" },
    { id: 3, mine: false, body: "可以。按AI估值我补100元，你觉得怎么样？", time: "10:33" },
  ]);

  async function send(event: FormEvent) {
    event.preventDefault();
    const body = text.trim();
    if (!body) return;
    const next = { id: Date.now(), mine: true, body, time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }) };
    setMessages((items) => [...items, next]);
    setText("");
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ swapRequestId: 1, body }),
      });
    } catch {
      // The visible conversation remains usable while cloud setup is pending.
    }
  }

  return (
    <MobileShell
      title="阿泽的装备库"
      backHref="/"
      hideNav
      action={<span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">在线</span>}
    >
      <div className="border-b border-border bg-card p-3">
        <Link href="/match?target=1" className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl bg-yellow-soft p-3">
          <div className="grid size-10 place-items-center rounded-xl bg-yellow"><ShieldCheck className="size-5" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black">交换方案：Switch OLED ↔ Sony XM5</p>
            <p className="mt-0.5 text-xs text-muted-foreground">对方补¥100 · 平台验货</p>
          </div>
          <span className="text-xs font-black">查看</span>
        </Link>
      </div>

      <section className="mx-auto flex min-h-[calc(100dvh-190px)] max-w-xl flex-col gap-4 px-4 py-6 pb-28">
        <p className="text-center text-xs text-muted-foreground">今天 10:28</p>
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.mine ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[82%] rounded-3xl px-4 py-3 ${message.mine ? "rounded-br-md bg-yellow text-ink" : "rounded-bl-md border border-border bg-card"}`}>
              <p className="text-sm font-medium leading-6">{message.body}</p>
              <p className={`mt-1 text-[10px] ${message.mine ? "text-ink/55" : "text-muted-foreground"}`}>{message.time}</p>
            </div>
          </div>
        ))}
      </section>

      <form onSubmit={send} className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/96 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-xl items-center gap-2">
          <button type="button" className="grid size-11 shrink-0 place-items-center rounded-full border border-border" aria-label="发送图片"><ImagePlus className="size-5" /></button>
          <input value={text} onChange={(event) => setText(event.target.value)} placeholder="聊聊成色、补差和验货…" className="h-11 min-w-0 flex-1 rounded-full border bg-background px-4 text-sm outline-none focus:border-ink" />
          <Button type="submit" size="icon" className="size-11 shrink-0 rounded-full bg-yellow text-ink hover:bg-yellow/90"><Send className="size-5" /></Button>
        </div>
      </form>
    </MobileShell>
  );
}
