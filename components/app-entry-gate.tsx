"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, Check, KeyRound, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const slogans = [
  "不想卖，那就换",
  "闲置换新趣，同好马上遇见",
  "让闲置，遇见真正想要它的人",
  "旧物不落灰，好物继续发光",
  "交换喜欢，也交换新的故事",
  "你的闲置，正是别人的心头好",
];

type Stage = "splash" | "auth" | "app";

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
        <div className="absolute -left-20 top-[17%] size-52 rounded-full bg-[#fff0a8] sm:size-64" />
        <div className="absolute -right-20 bottom-[10%] size-48 rounded-full bg-ink sm:size-56" />

        <button
          type="button"
          onClick={() => setStage("auth")}
          className="absolute right-5 top-[max(20px,env(safe-area-inset-top))] z-20 rounded-full bg-ink/10 px-4 py-2 text-sm font-bold transition hover:bg-ink hover:text-yellow"
          aria-label={`跳过启动页，剩余${seconds}秒`}
        >
          跳过 {seconds}s
        </button>

        <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-6 pb-[max(30px,env(safe-area-inset-bottom))] pt-[max(70px,env(safe-area-inset-top))] text-center">
          <div className="-translate-y-4">
            <h1 className="text-6xl font-black tracking-[-0.12em] sm:text-7xl">换么</h1>
            <ArrowLeftRight className="mx-auto mt-4 size-16" strokeWidth={3.3} />
            <p className="mt-7 text-lg font-black tracking-tight">{slogan}</p>
          </div>
          <p className="absolute bottom-[max(28px,env(safe-area-inset-bottom))] text-xs font-black tracking-[0.12em]">
            HUANME / SWAP THE GOOD STUFF
          </p>
        </div>
      </main>
    );
  }

  if (stage === "auth") return <AuthScreen onComplete={enterApp} />;
  return children;
}

function AuthScreen({ onComplete }: { onComplete: () => void }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  function showError(text: string) {
    setSuccess(false);
    setMessage(text);
  }

  function requireAgreement() {
    if (agreed) return true;
    showError("请先勾选并同意《用户协议》和《隐私政策》");
    return false;
  }

  function requestCode() {
    if (!/^1\d{10}$/.test(phone)) {
      showError("请输入正确的11位手机号");
      return;
    }
    setMessage("验证码已发送");
    setSuccess(true);
    setCooldown(60);
  }

  function completeWith(text: string) {
    setMessage(text);
    setSuccess(true);
    setSubmitting(true);
    window.setTimeout(onComplete, 750);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!requireAgreement()) return;
    if (!/^1\d{10}$/.test(phone)) {
      showError("请输入正确的11位手机号");
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      showError("请输入6位数字验证码");
      return;
    }
    completeWith("登录 / 注册成功");
  }

  function quickLogin(provider: "微信" | "Apple") {
    if (!requireAgreement()) return;
    completeWith(`${provider}登录成功`);
  }

  function guestLogin() {
    if (!requireAgreement()) return;
    completeWith("游客登录成功");
  }

  return (
    <main className="min-h-dvh bg-[#e9e9e5] px-0 text-ink sm:px-4 sm:py-6">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-[#f8f8f5] px-6 pb-[max(26px,env(safe-area-inset-bottom))] pt-[max(32px,env(safe-area-inset-top))] sm:min-h-[calc(100dvh-48px)] sm:rounded-[34px] sm:px-7">
        <div className="absolute -right-20 -top-24 size-56 rounded-full border-[28px] border-yellow/35" />

        <header className="relative">
          <span className="grid size-14 place-items-center rounded-[18px] bg-yellow">
            <ArrowLeftRight className="size-8" strokeWidth={3} />
          </span>
          <h1 className="mt-7 text-[2rem] font-black tracking-[-0.06em]">欢迎来到换么</h1>
          <p className="mt-2 text-sm text-muted-foreground">登录后开启你的第一次交换</p>
        </header>

        <form onSubmit={submit} className="relative mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-muted-foreground">手机号</span>
            <span className="flex h-13 items-center gap-3 rounded-2xl border border-border bg-white px-4 focus-within:border-ink">
              <Phone className="size-5 text-muted-foreground" />
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 11))}
                inputMode="numeric"
                autoComplete="tel"
                placeholder="请输入手机号"
                className="min-w-0 flex-1 bg-transparent text-base outline-none"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-muted-foreground">验证码</span>
            <span className="flex h-13 items-center gap-3 rounded-2xl border border-border bg-white px-4 focus-within:border-ink">
              <ShieldCheck className="size-5 shrink-0 text-muted-foreground" />
              <input
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="请输入6位验证码"
                className="min-w-0 flex-1 bg-transparent text-base outline-none"
              />
              <button
                type="button"
                onClick={requestCode}
                disabled={cooldown > 0}
                className="shrink-0 text-sm font-black disabled:text-muted-foreground"
              >
                {cooldown > 0 ? `${cooldown}s` : "获取验证码"}
              </button>
            </span>
          </label>

          <label className="block">
            <span className="mb-2 flex items-center justify-between text-sm font-bold text-muted-foreground">
              <span>密码</span><span className="text-xs font-normal">选填</span>
            </span>
            <span className="flex h-13 items-center gap-3 rounded-2xl border border-border bg-white px-4 focus-within:border-ink">
              <KeyRound className="size-5 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                placeholder="请输入密码"
                className="h-auto border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
              />
            </span>
          </label>

          {message ? (
            <p className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
              {success ? <Check className="size-4 shrink-0" /> : null}{message}
            </p>
          ) : null}

          <Button type="submit" disabled={submitting} className="mt-2 h-13 w-full rounded-2xl bg-yellow text-base font-black text-ink hover:bg-yellow/90">
            登录 / 注册
          </Button>
        </form>

        <div className="relative my-6 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          <span>或使用以下方式</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button type="button" onClick={() => quickLogin("微信")} disabled={submitting} className="h-12 rounded-full bg-yellow text-sm font-black disabled:opacity-60">微信</button>
          <button type="button" onClick={() => quickLogin("Apple")} disabled={submitting} className="h-12 rounded-full bg-ink text-sm font-black text-white disabled:opacity-60">Apple</button>
        </div>

        <button
          type="button"
          onClick={guestLogin}
          disabled={submitting}
          className="mt-6 text-center text-sm text-muted-foreground underline underline-offset-4 transition hover:text-ink disabled:opacity-60"
        >
          游客登录
        </button>

        <label className="mt-5 flex cursor-pointer items-start justify-center gap-2 text-xs leading-5 text-muted-foreground">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => {
              setAgreed(event.target.checked);
              if (event.target.checked && !success) setMessage("");
            }}
            className="mt-0.5 size-4 shrink-0 accent-black"
          />
          <span>我已阅读并同意《用户协议》和《隐私政策》</span>
        </label>
      </div>
    </main>
  );
}
