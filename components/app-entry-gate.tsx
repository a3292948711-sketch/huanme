"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Gamepad2,
  KeyRound,
  Phone,
  ShieldCheck,
  Sparkles,
  ToyBrick,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const slogans = [
  "闲置换新趣，同好马上遇见",
  "不想卖？那就换。",
  "让闲置，遇见真正想要它的人",
  "旧物不落灰，好物继续发光",
  "交换喜欢，也交换新的故事",
  "你的闲置，正是别人的心头好",
];

type Stage = "splash" | "auth" | "app";
type AuthMode = "login" | "register";

export function AppEntryGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("splash");
  const [slogan, setSlogan] = useState(slogans[0]);
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    setSlogan(slogans[Math.floor(Math.random() * slogans.length)]);
  }, []);

  useEffect(() => {
    if (stage !== "splash") return;
    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setStage("auth");
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [stage]);

  function enterApp() {
    setStage("app");
    router.replace("/");
  }

  if (stage === "splash") {
    return (
      <main className="relative min-h-dvh overflow-hidden bg-yellow text-ink">
        <div className="absolute -left-24 top-28 size-64 rotate-12 rounded-[64px] border-[28px] border-ink/10" />
        <div className="absolute -right-16 bottom-32 size-56 -rotate-12 rounded-full border-[24px] border-white/35" />
        <button
          type="button"
          onClick={() => setStage("auth")}
          className="absolute right-4 top-[max(18px,env(safe-area-inset-top))] z-20 rounded-full border-2 border-ink bg-white/75 px-4 py-2 text-sm font-black shadow-[2px_2px_0_#111] backdrop-blur"
          aria-label={`跳过启动页，剩余${seconds}秒`}
        >
          跳过 {seconds}s
        </button>

        <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pb-[max(34px,env(safe-area-inset-bottom))] pt-[max(76px,calc(env(safe-area-inset-top)+68px))]">
          <div className="flex items-center gap-3">
            <span className="grid size-14 -rotate-6 place-items-center rounded-[18px] border-[3px] border-ink bg-white text-3xl font-black shadow-[4px_4px_0_#111]">换</span>
            <div>
              <p className="text-3xl font-black tracking-[-0.08em]">换么</p>
              <p className="text-xs font-black uppercase tracking-[0.26em]">HUAN ME</p>
            </div>
          </div>

          <div className="relative mt-10 h-[42vh] min-h-72 max-h-[430px]">
            <div className="absolute left-1 top-9 w-[52%] -rotate-6 overflow-hidden rounded-[28px] border-[3px] border-ink bg-white p-2 shadow-[6px_6px_0_#111]">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=82" alt="潮流耳机" className="aspect-square w-full rounded-[20px] object-cover" />
              <p className="px-2 py-3 text-sm font-black">数码好物 · 95新</p>
            </div>
            <div className="absolute right-0 top-0 w-[48%] rotate-6 overflow-hidden rounded-[26px] border-[3px] border-ink bg-ink p-2 text-white shadow-[5px_5px_0_#fff]">
              <img src="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=700&q=82" alt="游戏主机" className="aspect-[4/5] w-full rounded-[18px] object-cover" />
              <p className="px-2 py-3 text-sm font-black text-yellow">游戏同好 · 开换</p>
            </div>
            <span className="absolute bottom-4 left-[45%] grid size-20 -translate-x-1/2 rotate-12 place-items-center rounded-full border-[3px] border-ink bg-white text-4xl font-black shadow-[4px_4px_0_#111]">↔</span>
            <span className="absolute bottom-10 right-2 inline-flex items-center gap-1 rounded-full border-2 border-ink bg-yellow-soft px-3 py-2 text-xs font-black"><Sparkles className="size-4" /> AI 智能匹配</span>
          </div>

          <div className="mt-auto">
            <p className="text-[2rem] font-black leading-tight tracking-[-0.05em]">{slogan}</p>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-ink/15">
              <div className="h-full rounded-full bg-ink transition-[width] duration-1000 ease-linear" style={{ width: `${((5 - seconds) / 5) * 100}%` }} />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (stage === "auth") return <AuthScreen onComplete={enterApp} />;
  return children;
}

function AuthScreen({ onComplete }: { onComplete: () => void }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
  }

  function requestCode() {
    if (!/^1\d{10}$/.test(phone)) {
      setError("请输入正确的11位手机号");
      return;
    }
    setError("");
    setCooldown(60);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^1\d{10}$/.test(phone)) {
      setError("请输入正确的11位手机号");
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setError("请输入任意6位数字验证码");
      return;
    }
    if (mode === "register" && password.length < 6) {
      setError("请设置至少6位密码");
      return;
    }
    if (mode === "register" && !agreed) {
      setError("请先阅读并同意用户协议与隐私政策");
      return;
    }
    setError("");
    setSubmitting(true);
    window.setTimeout(onComplete, 420);
  }

  return (
    <main className="min-h-dvh bg-ink px-4 py-[max(18px,env(safe-area-inset-top))] text-ink">
      <div className="relative mx-auto flex min-h-[calc(100dvh-36px)] w-full max-w-md flex-col overflow-hidden rounded-[34px] bg-background shadow-2xl">
        <div className="relative overflow-hidden bg-yellow px-6 pb-8 pt-7">
          <div className="absolute -right-10 -top-12 size-44 rounded-full border-[22px] border-ink/10" />
          <div className="relative flex items-center gap-3">
            <span className="grid size-12 -rotate-6 place-items-center rounded-2xl border-[3px] border-ink bg-white text-2xl font-black shadow-[3px_3px_0_#111]">换</span>
            <div><p className="text-2xl font-black tracking-[-0.07em]">换么</p><p className="text-xs font-bold">年轻人的潮流换物社区</p></div>
          </div>
          <h1 className="relative mt-8 text-[2rem] font-black leading-tight tracking-[-0.05em]">登录之后，<br />让闲置开始流动。</h1>
          <div className="relative mt-5 flex gap-2 text-xs font-black">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-2 text-yellow"><Gamepad2 className="size-4" /> 游戏</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2"><ToyBrick className="size-4" /> 潮玩</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-soft px-3 py-2"><Sparkles className="size-4" /> 智能匹配</span>
          </div>
        </div>

        <div className="flex-1 px-6 py-6">
          <div className="grid grid-cols-2 rounded-2xl bg-muted p-1" role="tablist" aria-label="登录或注册">
            <button type="button" role="tab" aria-selected={mode === "login"} onClick={() => changeMode("login")} className={`rounded-xl py-3 text-sm font-black transition ${mode === "login" ? "bg-white shadow-sm" : "text-muted-foreground"}`}>验证码登录</button>
            <button type="button" role="tab" aria-selected={mode === "register"} onClick={() => changeMode("register")} className={`rounded-xl py-3 text-sm font-black transition ${mode === "register" ? "bg-white shadow-sm" : "text-muted-foreground"}`}>新用户注册</button>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-black">手机号</span>
              <span className="flex h-13 items-center gap-3 rounded-2xl border-2 border-border bg-white px-4 focus-within:border-ink">
                <Phone className="size-5 text-muted-foreground" />
                <input value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 11))} inputMode="numeric" autoComplete="tel" placeholder="请输入11位手机号" className="min-w-0 flex-1 bg-transparent text-base outline-none" />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black">验证码</span>
              <span className="flex h-13 items-center gap-3 rounded-2xl border-2 border-border bg-white px-4 focus-within:border-ink">
                <ShieldCheck className="size-5 shrink-0 text-muted-foreground" />
                <input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="任意6位数字" className="min-w-0 flex-1 bg-transparent text-base outline-none" />
                <button type="button" onClick={requestCode} disabled={cooldown > 0} className="shrink-0 text-sm font-black underline decoration-yellow decoration-4 underline-offset-4 disabled:text-muted-foreground disabled:no-underline">{cooldown > 0 ? `${cooldown}s` : "获取验证码"}</button>
              </span>
            </label>

            {mode === "register" ? (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm font-black">设置密码</span>
                  <span className="flex h-13 items-center gap-3 rounded-2xl border-2 border-border bg-white px-4 focus-within:border-ink">
                    <KeyRound className="size-5 text-muted-foreground" />
                    <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" placeholder="至少6位密码" className="h-auto border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0" />
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-6">
                  <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-1 size-4 accent-black" />
                  <span>我已阅读并同意《用户协议》和《隐私政策》</span>
                </label>
              </>
            ) : null}

            {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p> : null}
            <Button type="submit" disabled={submitting} className="h-13 w-full rounded-2xl bg-ink text-base font-black text-white shadow-[4px_4px_0_#ffd600] hover:bg-ink/90">
              {submitting ? <><Check className="size-5" /> 正在进入</> : <>{mode === "login" ? "登录并进入" : "注册并进入"}<ArrowRight className="size-5" /></>}
            </Button>
          </form>
          <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">课程演示模式 · 不会发送短信或保存账号信息</p>
        </div>
      </div>
    </main>
  );
}
