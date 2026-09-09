import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { users } from "@/db/schema";

export type CurrentUser = {
  id: string;
  email: string;
  displayName: string;
};

export async function requireApiUser(): Promise<CurrentUser | null> {
  const signedIn = await getChatGPTUser();
  const isLocal = process.env.NODE_ENV !== "production";
  if (!signedIn && !isLocal) return null;

  const current = signedIn
    ? {
        id: signedIn.userId,
        email: signedIn.email,
        displayName: signedIn.displayName,
      }
    : {
        id: "demo-user",
        email: "demo@huanme.local",
        displayName: "换么体验官",
      };

  const db = getDb();
  await db
    .insert(users)
    .values({
      id: current.id,
      email: current.email,
      displayName: current.displayName,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: { email: current.email, displayName: current.displayName },
    });

  return current;
}

export function apiError(error: unknown) {
  const message = error instanceof Error ? error.message : "服务暂时不可用";
  const unavailable =
    message.includes("binding `DB`") ||
    message.includes("no such table") ||
    message.includes("D1_ERROR");

  return Response.json(
    {
      error: unavailable
        ? "云端数据库尚未连接，请稍后重试。"
        : "请求处理失败，请稍后重试。",
    },
    { status: unavailable ? 503 : 500 },
  );
}
