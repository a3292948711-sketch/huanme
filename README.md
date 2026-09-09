# 换么 Web App

“换么”是面向 18—30 岁年轻用户的全品类闲置交换平台。项目采用移动端优先设计，以“物品 A → 物品 B”与“物品 A + 差价 → 物品 B”为核心，并支持 AI 估价、双向匹配、担保验货、聊天与订单履约。

## 已实现

- 移动端优先的响应式首页、分类、搜索和收藏交互
- 商品详情、卖家信用、AI 估值与想换信息
- 选择交换物、AI 补差建议、担保/验货方案
- 商品图片上传与 AI 快速发布表单
- 聊天协商、换物方案卡片
- 订单与物流进度
- 换圈社区和个人中心
- Cloudflare D1 数据模型与 R2 图片上传接口
- 商品、交换申请、消息和图片 API
- Web App Manifest 与手机安全区适配
- WebMCP 商品搜索和换物方案配置工具

## 本地运行

需要 Node.js 22.13 或更高版本。

```bash
npm run install:ci
npm run dev
```

访问 `http://localhost:5173`。

## 数据库迁移

```bash
npm run db:generate
```

迁移文件位于 `drizzle/`。部署时由平台应用到 D1 数据库。图片文件保存在 R2，元数据保存在 D1。

## 构建

```bash
npm run build
```

生产 Worker 入口位于 `dist/server/index.js`。

## 部署说明

项目已适配 Cloudflare Worker/D1/R2。接入 GitHub 后，可由支持 Cloudflare Workers 的部署平台构建；账号体系默认使用托管环境提供的用户身份头。本地开发自动使用 `demo-user`，便于课堂展示。

如果改用独立公网身份服务，需要在部署阶段接入对应认证提供商，并将 `lib/current-user.ts` 替换为该提供商的服务端会话校验。
