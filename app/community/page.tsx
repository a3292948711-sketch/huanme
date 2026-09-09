"use client";

import { useState } from "react";
import { Heart, MessageCircle, MoreHorizontal, Plus, Share2 } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";

const posts = [
  {
    id: 1,
    author: "Momo的掌机仓",
    avatar: "M",
    time: "12分钟前",
    body: "终于用闲置相机换到了想要很久的限定掌机！平台验货比想象中快，整个过程三天完成。",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1200&q=84",
    tag: "#本周换物战绩",
    likes: 128,
    comments: 23,
  },
  {
    id: 2,
    author: "玩具星球Leo",
    avatar: "L",
    time: "1小时前",
    body: "求换：收藏级积木套装，想换同价位潮玩或游戏周边。上海可面交，外地走担保。",
    image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=1200&q=84",
    tag: "#潮玩交换",
    likes: 76,
    comments: 18,
  },
];

export default function CommunityPage() {
  const [liked, setLiked] = useState<number[]>([]);
  return (
    <MobileShell
      title="换圈"
      action={<button className="grid size-10 place-items-center rounded-full border-2 border-ink bg-yellow shadow-[2px_2px_0_#111]" aria-label="发布动态"><Plus className="size-5" /></button>}
    >
      <div className="sticky top-16 z-30 flex gap-6 border-b border-border bg-background/95 px-4 py-3 text-sm font-black backdrop-blur sm:px-6">
        <button className="border-b-4 border-yellow pb-2">推荐</button><button className="pb-2 text-muted-foreground">关注</button><button className="pb-2 text-muted-foreground">同城</button><button className="pb-2 text-muted-foreground">潮玩</button>
      </div>
      <div className="space-y-4 p-4 sm:p-6">
        {posts.map((post) => (
          <article key={post.id} className="overflow-hidden rounded-3xl border border-border bg-card">
            <div className="flex items-center gap-3 p-4">
              <span className="grid size-10 place-items-center rounded-full bg-ink font-black text-yellow">{post.avatar}</span>
              <div className="min-w-0 flex-1"><p className="font-black">{post.author}</p><p className="text-xs text-muted-foreground">{post.time}</p></div>
              <button aria-label="更多"><MoreHorizontal className="size-5" /></button>
            </div>
            <p className="px-4 pb-4 text-sm font-medium leading-6">{post.body}</p>
            <img src={post.image} alt="换物动态配图" className="aspect-[4/3] w-full object-cover" />
            <div className="p-4">
              <span className="rounded-full bg-yellow-soft px-3 py-1.5 text-xs font-black">{post.tag}</span>
              <div className="mt-4 flex items-center gap-6 text-sm font-bold">
                <button onClick={() => setLiked((items) => items.includes(post.id) ? items.filter((id) => id !== post.id) : [...items, post.id])} className="flex items-center gap-1.5"><Heart className={`size-5 ${liked.includes(post.id) ? "fill-red-500 text-red-500" : ""}`} />{post.likes + (liked.includes(post.id) ? 1 : 0)}</button>
                <button className="flex items-center gap-1.5"><MessageCircle className="size-5" />{post.comments}</button>
                <button className="ml-auto"><Share2 className="size-5" /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </MobileShell>
  );
}
