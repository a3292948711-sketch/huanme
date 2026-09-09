import { env } from "cloudflare:workers";
import { requireApiUser } from "@/lib/current-user";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  try {
    const current = await requireApiUser();
    if (!current) return Response.json({ error: "请先登录" }, { status: 401 });
    if (!env.BUCKET) {
      return Response.json({ error: "图片存储尚未连接" }, { status: 503 });
    }
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return Response.json({ error: "请选择图片" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_BYTES) {
      return Response.json(
        { error: "仅支持8MB以内的 JPG、PNG 或 WebP 图片" },
        { status: 400 },
      );
    }
    const extension =
      file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const key = `products/${current.id}/${crypto.randomUUID()}.${extension}`;
    await env.BUCKET.put(key, file.stream(), {
      httpMetadata: { contentType: file.type },
      customMetadata: { ownerId: current.id },
    });
    return Response.json({ key, imageUrl: `/api/upload/${encodeURIComponent(key)}` });
  } catch {
    return Response.json({ error: "图片上传失败，请稍后重试" }, { status: 500 });
  }
}
