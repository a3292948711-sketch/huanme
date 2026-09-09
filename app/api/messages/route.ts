import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { messages } from "@/db/schema";
import { apiError, requireApiUser } from "@/lib/current-user";

export async function GET(request: Request) {
  try {
    const current = await requireApiUser();
    if (!current) return Response.json({ error: "请先登录" }, { status: 401 });
    const swapRequestId = Number(new URL(request.url).searchParams.get("swap") ?? 0);
    if (!swapRequestId) return Response.json({ messages: [] });
    const db = getDb();
    const rows = await db
      .select()
      .from(messages)
      .where(eq(messages.swapRequestId, swapRequestId))
      .orderBy(asc(messages.createdAt));
    return Response.json({ messages: rows });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const current = await requireApiUser();
    if (!current) return Response.json({ error: "请先登录" }, { status: 401 });
    const payload = (await request.json()) as Record<string, unknown>;
    const swapRequestId = Number(payload.swapRequestId ?? 0);
    const body = String(payload.body ?? "").trim();
    if (!swapRequestId || !body) {
      return Response.json({ error: "消息内容不能为空" }, { status: 400 });
    }
    const db = getDb();
    const [message] = await db
      .insert(messages)
      .values({ swapRequestId, senderId: current.id, body })
      .returning();
    return Response.json({ message }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
