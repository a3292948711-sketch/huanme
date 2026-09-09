import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { apiError, requireApiUser } from "@/lib/current-user";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const owner = url.searchParams.get("owner");
    const db = getDb();
    const rows = owner
      ? await db
          .select()
          .from(products)
          .where(and(eq(products.ownerId, owner), eq(products.status, "active")))
          .orderBy(desc(products.createdAt))
      : await db
          .select()
          .from(products)
          .where(eq(products.status, "active"))
          .orderBy(desc(products.createdAt))
          .limit(50);
    return Response.json({ products: rows });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const current = await requireApiUser();
    if (!current) return Response.json({ error: "请先登录" }, { status: 401 });

    const payload = (await request.json()) as Record<string, unknown>;
    const title = String(payload.title ?? "").trim();
    const imageUrl = String(payload.imageUrl ?? "").trim();
    const category = String(payload.category ?? "").trim();
    const condition = String(payload.condition ?? "").trim();
    if (!title || !imageUrl || !category || !condition) {
      return Response.json(
        { error: "标题、图片、分类和成色不能为空" },
        { status: 400 },
      );
    }

    const db = getDb();
    const [product] = await db
      .insert(products)
      .values({
        ownerId: current.id,
        title,
        imageUrl,
        category,
        condition,
        description: String(payload.description ?? "").trim(),
        price: Number(payload.price ?? 0),
        estimatedValue: Number(payload.estimatedValue ?? 0),
        city: String(payload.city ?? "上海").trim(),
        desiredItems: String(payload.desiredItems ?? "").trim(),
        acceptsSwap: payload.acceptsSwap !== false,
      })
      .returning();

    return Response.json({ product }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
