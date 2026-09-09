import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { swapRequests } from "@/db/schema";
import { apiError, requireApiUser } from "@/lib/current-user";

export async function GET() {
  try {
    const current = await requireApiUser();
    if (!current) return Response.json({ error: "请先登录" }, { status: 401 });
    const db = getDb();
    const rows = await db
      .select()
      .from(swapRequests)
      .where(eq(swapRequests.initiatorId, current.id))
      .orderBy(desc(swapRequests.updatedAt));
    return Response.json({ swaps: rows });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const current = await requireApiUser();
    if (!current) return Response.json({ error: "请先登录" }, { status: 401 });
    const payload = (await request.json()) as Record<string, unknown>;
    const targetProductId = Number(payload.targetProductId ?? 0);
    const offeredTitle = String(payload.offeredTitle ?? "").trim();
    const offeredImageUrl = String(payload.offeredImageUrl ?? "").trim();
    if (!targetProductId || !offeredTitle || !offeredImageUrl) {
      return Response.json({ error: "交换方案信息不完整" }, { status: 400 });
    }

    const db = getDb();
    const [swap] = await db
      .insert(swapRequests)
      .values({
        initiatorId: current.id,
        targetProductId,
        offeredProductId: payload.offeredProductId
          ? Number(payload.offeredProductId)
          : null,
        offeredTitle,
        offeredImageUrl,
        cashAdjustment: Number(payload.cashAdjustment ?? 0),
        note: String(payload.note ?? "").trim(),
        fulfillmentMode: String(payload.fulfillmentMode ?? "inspection"),
      })
      .returning();
    return Response.json({ swap }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
