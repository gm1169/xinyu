export type SeedBadge = {
  code: string;
  name: string;
  description: string;
  iconEmoji: string;
  criteria: Record<string, unknown>;
};

export const badges: SeedBadge[] = [
  {
    code: "first_step",
    name: "初心萌动",
    description: "阅读第一条格言",
    iconEmoji: "🌱",
    criteria: { type: "aphorism_read_count", value: 1 },
  },
  {
    code: "aphorism_reader",
    name: "格言达人",
    description: "累计阅读 30 条格言",
    iconEmoji: "📖",
    criteria: { type: "aphorism_read_count", value: 30 },
  },
  {
    code: "reflector",
    name: "心有所感",
    description: "记录 10 次阅读感悟",
    iconEmoji: "✍️",
    criteria: { type: "reflection_count", value: 10 },
  },
  {
    code: "defusion_novice",
    name: "解离新手",
    description: "完成第一个认知解离训练单元",
    iconEmoji: "🧘",
    criteria: { type: "training_completed", value: 1 },
  },
  {
    code: "defusion_adept",
    name: "解离高手",
    description: "完成入门篇全部 6 个训练单元",
    iconEmoji: "🏮",
    criteria: { type: "training_module_completed", module: "intro" },
  },
  {
    code: "streak_7",
    name: "七日之心",
    description: "连续 7 天使用「心语」",
    iconEmoji: "🔥",
    criteria: { type: "streak_days", value: 7 },
  },
  {
    code: "streak_30",
    name: "三十日不辍",
    description: "连续 30 天使用「心语」",
    iconEmoji: "🌟",
    criteria: { type: "streak_days", value: 30 },
  },
  {
    code: "value_seeker",
    name: "价值探索者",
    description: "完成价值探索的 3 个生活领域",
    iconEmoji: "🧭",
    criteria: { type: "value_domains", value: 3 },
  },
  {
    code: "action_taker",
    name: "千里之行",
    description: "制定并开始执行第一个行动计划",
    iconEmoji: "👣",
    criteria: { type: "action_plan_started", value: 1 },
  },
  {
    code: "sleep_keeper",
    name: "良夜守护者",
    description: "记录 7 天睡眠",
    iconEmoji: "🌙",
    criteria: { type: "sleep_records", value: 7 },
  },
];
