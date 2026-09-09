export type DemoProduct = {
  id: number;
  title: string;
  image: string;
  value: number;
  condition: string;
  want: string;
  match: number;
  city: string;
  category: string;
  description: string;
  seller: string;
  credit: number;
};

export const demoProducts: DemoProduct[] = [
  {
    id: 1,
    title: "Sony WH-1000XM5 降噪耳机",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=84",
    value: 1680,
    condition: "95新",
    want: "Switch OLED / 补差可聊",
    match: 96,
    city: "上海",
    category: "数码",
    description: "自用一年，功能正常，耳罩有轻微使用痕迹。包装、充电线与收纳盒齐全，可走平台验货。",
    seller: "阿泽的装备库",
    credit: 788,
  },
  {
    id: 2,
    title: "PlayStation 5 光驱版",
    image:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1200&q=84",
    value: 2899,
    condition: "9成新",
    want: "相机 / 掌机",
    match: 91,
    city: "杭州",
    category: "游戏",
    description: "国行光驱版，手柄无漂移，箱说齐全。可提供购买记录，优先交换微单或高性能掌机。",
    seller: "Neo玩家",
    credit: 764,
  },
  {
    id: 3,
    title: "机械键盘 透明客制化套件",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=84",
    value: 620,
    condition: "准新",
    want: "潮玩 / 耳机",
    match: 88,
    city: "南京",
    category: "数码",
    description: "透明外壳，线性轴体，卫星轴已调校。轻度使用，可交换同价位潮玩或无线耳机。",
    seller: "键圈小白",
    credit: 735,
  },
  {
    id: 4,
    title: "复古银色数码相机",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=84",
    value: 2350,
    condition: "收藏级",
    want: "PS5 / 镜头",
    match: 84,
    city: "苏州",
    category: "数码",
    description: "成色优秀，屏幕无明显划痕，闪光灯与变焦正常。适合复古直出，附电池和读卡器。",
    seller: "银盐日记",
    credit: 801,
  },
];

export const myItems = [
  {
    id: 101,
    title: "Nintendo Switch OLED 白色",
    image:
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=900&q=82",
    value: 1780,
    condition: "95新",
  },
  {
    id: 102,
    title: "Nike Dunk Low 灰白",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=82",
    value: 760,
    condition: "9成新",
  },
];

export function money(value: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }).format(value);
}
