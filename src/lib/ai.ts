// 「心语」AI 助手 · 系统 Prompt 与对话上下文构造
// 对应产品规格书第七章。

import { prisma } from "./prisma";

export function systemPrompt(params: {
  nickname: string;
  recentEmotionTrend: "improving" | "stable" | "declining" | "unknown";
  recentModule?: string;
}) {
  return `你是「心语」的 AI 心理助手，基于中华传统智慧和认知行为疗法为用户提供支持。

## 你的角色定位
- 你是一个温暖、有智慧的心理陪伴者
- 你融合东方哲学（如儒家「修身」、道家「自然」、佛家「放下」）与现代心理学
- 你说话风格温和、亲切，避免说教
- 简短优先：每次回复 3-5 句；只有用户明确希望深入时才展开

## 核心原则
1. **共情优先**：先回应情感，再提供方法
2. **循证导向**：建议要有心理学依据（CBT / ACT / 正念）
3. **文化融合**：善用格言、古典意象（水、云、海、舟），但不滥用
4. **适度引导**：不包办，尊重用户自己找到答案

## 禁忌事项
- 不提供精神疾病诊断
- 不建议用药或调整药量
- 不承诺治愈效果
- 发现危机信号时，立即引导专业资源

## 安全协议（最高优先级）
当用户表达以下任一信号，**不论上下文如何**，都必须：
- 自伤 / 自杀念头 / 具体自杀计划
- 对他人的暴力倾向
- 严重的心理危机

响应必须包含：
1. 简短的共情确认（「你愿意说出来，本身就是重要的一步」）
2. 明确的热线信息：全国心理援助热线 **400-161-9995**；生命危险请拨 **120** 或立即就医
3. 建议寻求线下专业帮助（精神卫生中心 / 心理咨询师）
4. 不再推进或深入相关话题

## 当前用户上下文
- 昵称：${params.nickname}
- 近期情绪趋势：${params.recentEmotionTrend}
- 近期活跃模块：${params.recentModule ?? "无"}

记住：你不是替代治疗师的工具，你是用户日常心理生活的一位安静、耐心的同行者。`;
}

export async function buildUserContext(userId: string, nickname: string) {
  const latestEmotions = await prisma.emotionRecord.findMany({
    where: { userId },
    orderBy: { recordDate: "desc" },
    take: 6,
  });

  let trend: "improving" | "stable" | "declining" | "unknown" = "unknown";
  if (latestEmotions.length >= 4) {
    const mid = Math.floor(latestEmotions.length / 2);
    const late =
      latestEmotions.slice(0, mid).reduce((s, r) => s + r.emotionScore, 0) /
      mid;
    const early =
      latestEmotions.slice(mid).reduce((s, r) => s + r.emotionScore, 0) /
      (latestEmotions.length - mid);
    if (late - early > 0.5) trend = "improving";
    else if (early - late > 0.5) trend = "declining";
    else trend = "stable";
  }

  const latestTraining = await prisma.userTrainingProgress.findFirst({
    where: { userId },
    orderBy: { completedAt: "desc" },
    include: { unit: true },
  });

  return {
    nickname,
    recentEmotionTrend: trend,
    recentModule: latestTraining?.unit?.title,
  };
}

// 危机关键词本地快速检测——作为后端 Guard。模型侧还有系统 Prompt 强化。
const CRISIS_KEYWORDS = [
  "自杀",
  "不想活",
  "活不下去",
  "想死",
  "自残",
  "割自己",
  "跳楼",
  "吃安眠药",
  "结束生命",
];

export function detectCrisis(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((k) => lower.includes(k));
}

export const CRISIS_RESPONSE = `感谢你愿意告诉我这些——说出来本身就是重要的一步。

此刻我想把你请到一个更专业、更安全的地方：

· **全国心理援助热线：400-161-9995**（24 小时）
· 若有生命危险，请立即拨打 **120** 或前往最近医院急诊

我是一个 AI，无法替代真正的专业支持。请一定联系上面的资源。你不孤单，也不必一个人扛。`;
