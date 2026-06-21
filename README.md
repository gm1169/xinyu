# 心语 · XinYu

> 以中华传统智慧为魂，以循证心理技术为骨，以数字便捷为形——可随身携带的「心理药箱」。

「心语」MVP 是一个融合**中华格言智慧**与**认知行为疗法 / 接纳承诺疗法**的数字心理健康干预产品，面向轻中度焦虑抑郁、亚健康及心理成长人群。

本仓库是产品规格书所描述 MVP 的**全栈实现（Next.js 14 App Router）**——单一代码库、单命令启动、离线可运行。

## 当前覆盖的模块

| 模块 | 状态 | 说明 |
| --- | --- | --- |
| ① 每日格言智慧 | ✅ | 24 条精选格言（古语 / 诗词 / 现代）· 逐字注释 · 心理学解读 · 应用场景 · 收藏 · 感悟记录 |
| ② 认知解离训练营 | ✅ | 入门篇 6 个单元 · 理论-练习-案例三段式 · 进度追踪 · 徽章 |
| ③ 价值导向行动 | ✅ | 六大生活领域 · 价值探索 · 五要素行动计划（行为·情境·步骤·障碍·策略） |
| ④ 睡眠智慧课堂 | ✅ | 6 节内置课程（科普 / 卫生 / 放松 / 古典智慧）· 睡眠记录 · 7 日质量曲线 |
| ⑤ 我的心理档案 | ✅ | 日度情绪三维度记录（情绪 / 焦虑 / 抑郁）· 30 日趋势曲线 · 徽章墙 |
| AI 对话组件 | 🔜 | MVP 未纳入；系统提示与对话场景已在产品规格书定义，预留接入点 |
| 推送通知 | 🔜 | Web 版不内建；规格已定义，原生端实现时对接 |

## 技术栈

- **Next.js 14** · App Router · Server Components · Route Handlers
- **TypeScript**（严格模式）
- **Tailwind CSS**（严格对齐规格书第八章的竹青 / 月白 / 墨色等品牌色）
- **Prisma** ORM · **SQLite**（开发）·可一键切换至 PostgreSQL
- **jose** · JWT HTTPOnly Cookie 会话
- **bcryptjs** · 密码散列
- **zod** · 输入校验
- **recharts** · 情绪曲线
- **lucide-react** · 图标

全栈单仓库——无需额外后端服务；规格书中分离的前后端设计可在后续演进时拆分：`src/app/api/*` 即为 REST 层，迁出至 Express 或 FastAPI 不需触碰业务逻辑。

## 快速开始

```bash
# 1. 安装依赖 & 生成 Prisma Client
npm install

# 2. 准备环境变量（可直接复制示例）
cp .env.example .env

# 3. 初始化 SQLite 数据库 & 播种格言 / 训练单元 / 徽章
npm run db:push
npm run db:seed

# 4. 启动开发服务器
npm run dev
# → http://localhost:3000
```

首次使用：

1. 打开 <http://localhost:3000/register> 创建账户
2. 系统会自动登录并跳转 `/app`（主页）
3. 底部 Tab 可进入五大模块

## 项目结构

```
xinyu/
├── prisma/
│   ├── schema.prisma              # 数据模型（对齐产品规格书第五章）
│   ├── seed.ts                    # 播种入口
│   └── seed-data/
│       ├── aphorisms.ts           # 24 条格言（古语/诗词/现代）
│       ├── training-units.ts      # 认知解离入门篇 6 单元
│       └── badges.ts              # 10 枚徽章定义
├── src/
│   ├── app/
│   │   ├── page.tsx               # 营销落地页
│   │   ├── (auth)/                # 登录 / 注册
│   │   ├── app/                   # 已认证主应用（Tab 导航）
│   │   │   ├── page.tsx           # 首页仪表盘
│   │   │   ├── aphorism/          # 每日格言
│   │   │   ├── training/          # 认知解离训练营
│   │   │   ├── value/             # 价值 + 行动计划
│   │   │   ├── sleep/             # 睡眠课堂 + 记录
│   │   │   └── profile/           # 心理档案 + 情绪记录
│   │   └── api/                   # REST API（16 个端点）
│   ├── components/
│   │   ├── ui/                    # Button / Card / Input / Slider / Tag
│   │   ├── shell/                 # 底部导航
│   │   ├── aphorism/              # AphorismView
│   │   ├── training/              # TrainingUnitRunner（理论→练习→案例→完成）
│   │   └── profile/               # EmotionChart（recharts）
│   └── lib/
│       ├── prisma.ts              # Prisma 单例
│       ├── auth.ts                # JWT · bcrypt · cookie
│       ├── api.ts                 # 统一响应格式
│       ├── badges.ts              # 徽章自动授予引擎
│       ├── date.ts                # 每日格言的「日桶」分配算法
│       └── sleep-content.ts       # 睡眠课堂内置内容
└── tailwind.config.ts             # 品牌色（竹青/朱砂/月白/墨色等）
```

## API 一览

所有 API 响应统一为 `{ success: boolean, data?, error? }`。

| 方法 | 路径 | 作用 |
| --- | --- | --- |
| POST | `/api/auth/register` | 注册 |
| POST | `/api/auth/login` | 登录 |
| POST | `/api/auth/logout` | 退出 |
| GET | `/api/auth/me` | 当前用户 |
| GET | `/api/aphorisms/daily` | 每日格言（基于日期哈希分配） |
| POST | `/api/aphorisms/:id/favorite` | 收藏切换 |
| POST | `/api/aphorisms/:id/reflection` | 写感悟 |
| GET | `/api/aphorisms/favorites` | 收藏列表 |
| GET | `/api/training/modules` | 模块 + 进度 |
| GET | `/api/training/units/:id` | 单元详情 |
| POST | `/api/training/units/:id/complete` | 完成单元 + 徽章检查 |
| GET/POST | `/api/values` | 价值列表 / 新增 |
| DELETE | `/api/values/:id` | 删除价值 |
| GET/POST | `/api/action-plans` | 行动计划列表 / 新增 |
| POST | `/api/emotion-records` | 情绪打点（单日 upsert） |
| GET | `/api/emotion-records/trend` | 30 日情绪曲线 + 趋势 |
| GET/POST | `/api/sleep-records` | 睡眠记录 |

## 设计对齐

- **色彩**：完全采用规格书第 8.1 节的竹青 / 素灰 / 朱砂 / 月白 / 宣纸白 / 墨色等命名
- **排版**：格言正文走楷体大字号（`.aphorism-text`）；标题走宋体；正文走系统无衬线
- **交互**：渐入动画、卡片圆角、滑块反馈均按规格书「动画规范」执行
- **数据模型**：`schema.prisma` 的实体与规格书第五章一一对应（User / Aphorism / UserAphorism / TrainingUnit / UserTrainingProgress / EmotionRecord / SleepRecord / ValueExploration / ActionPlan / Badge / UserBadge）
- **安全**：密码走 bcrypt；会话走 HTTPOnly cookie 携带 JWT；所有受保护端点服务端校验

## 开发脚本

```bash
npm run dev          # 开发模式
npm run build        # 生产构建（含 prisma generate）
npm run start        # 生产启动
npm run db:push      # 把 schema 同步到 SQLite
npm run db:seed      # 播种
npm run db:reset     # 清库 + 重建 + 重种
```

## 后续迭代（未进入本 MVP）

按产品规格书第十二章里程碑，本次交付覆盖 Phase 1-4 的核心能力。未纳入部分：

- **AI 对话组件（Phase 5）**：Prompt 框架已在规格书第七章定义；客户端需接入 Claude API 或同类服务，并落地「危机信号拦截」安全协议
- **推送通知（Phase 6）**：Web 版不原生支持；移植到 React Native 时对接 FCM / APNs
- **成就系统扩展**：当前徽章为静态规则，未来可引入「连续 N 天使用」流数据
- **内容扩容**：格言库 24 → 500；认知解离训练营扩展进阶篇、实战篇；睡眠课堂加入音频引导

## 许可

MVP 原型，内部评估用。
