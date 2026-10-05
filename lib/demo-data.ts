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
  {
    id: 5,
    title: "Nintendo Switch OLED 白色套装",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1000&q=84",
    value: 1780, condition: "95新", want: "降噪耳机 / 微单相机", match: 93,
    city: "上海", category: "游戏",
    description: "OLED版本，屏幕无明显划痕，手柄操作正常。原装底座、充电器和收纳包齐全，适合家庭和通勤游戏。",
    seller: "Momo的掌机仓", credit: 816,
  },
  {
    id: 6,
    title: "双手柄游戏套装 黑白配色",
    image: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=1000&q=84",
    value: 480, condition: "9成新", want: "机械键盘 / 游戏周边", match: 86,
    city: "杭州", category: "游戏",
    description: "两只手柄打包交换，按键回弹正常，摇杆无漂移，轻度使用痕迹。适合双人合作游戏。",
    seller: "Neo玩家", credit: 764,
  },
  {
    id: 7,
    title: "收藏级积木套装 创意拼搭系列",
    image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=1000&q=84",
    value: 560, condition: "准新", want: "潮玩盲盒 / 掌机配件", match: 92,
    city: "上海", category: "潮玩",
    description: "收藏级积木套装，零件已分类整理，附拼搭说明书。拆封展示后妥善收纳，适合喜欢创意拼搭的同好。",
    seller: "玩具星球Leo", credit: 825,
  },
  {
    id: 8,
    title: "桌面小汽车模型 收藏组合",
    image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=1000&q=84",
    value: 320, condition: "95新", want: "积木套装 / 桌面摆件", match: 87,
    city: "南京", category: "潮玩",
    description: "桌面收藏汽车模型组合，细节精致，长期放在展示柜中。适合交换其他模型或同价位潮玩。",
    seller: "玩具星球Leo", credit: 825,
  },
  {
    id: 9,
    title: "Nike 运动鞋 红色复古款",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=84",
    value: 760, condition: "9成新", want: "潮流卫衣 / 降噪耳机", match: 90,
    city: "苏州", category: "穿搭",
    description: "红色运动鞋，尺码42，鞋底磨损较轻，已清洁整理。保留原鞋盒，喜欢复古穿搭的朋友可以交流。",
    seller: "银盐日记", credit: 801,
  },
  {
    id: 10,
    title: "百搭帆布鞋 黑白经典款",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=84",
    value: 260, condition: "95新", want: "潮玩 / 单肩包", match: 85,
    city: "杭州", category: "穿搭",
    description: "经典帆布鞋，尺码39，穿着次数少，鞋面和内衬保持干净。适合日常通勤与休闲穿搭。",
    seller: "Momo的掌机仓", credit: 816,
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
