export type ScaleCode = "PHQ9" | "GAD7" | "ISI";

export type ScaleDefinition = {
  code: ScaleCode;
  name: string;
  description: string;
  itemLabels: string[];
  options: string[];
  maxScore: number;
};

export const SCALE_DEFINITIONS: Record<ScaleCode, ScaleDefinition> = {
  PHQ9: {
    code: "PHQ9",
    name: "PHQ-9 抑郁症状筛查",
    description: "过去两周内，以下问题困扰你的频率。结果仅用于自我筛查和随访参考，不构成诊断。",
    maxScore: 27,
    options: ["完全没有", "几天", "一半以上天数", "几乎每天"],
    itemLabels: [
      "做事时提不起劲或没有兴趣",
      "感到心情低落、沮丧或绝望",
      "入睡困难、睡不安稳或睡眠过多",
      "感觉疲倦或没有活力",
      "食欲不振或吃太多",
      "觉得自己很糟，或觉得自己很失败、让自己或家人失望",
      "对事情专注有困难，例如读报纸或看电视",
      "行动或说话慢到别人已经察觉，或相反，烦躁坐立不安",
      "觉得不如死掉，或用某种方式伤害自己的念头",
    ],
  },
  GAD7: {
    code: "GAD7",
    name: "GAD-7 焦虑症状筛查",
    description: "过去两周内，以下问题困扰你的频率。结果仅用于自我筛查和随访参考，不构成诊断。",
    maxScore: 21,
    options: ["完全没有", "几天", "一半以上天数", "几乎每天"],
    itemLabels: [
      "感到紧张、焦虑或急切",
      "不能够停止或控制担忧",
      "对各种各样的事情担忧过多",
      "很难放松下来",
      "由于不安而无法静坐",
      "变得容易烦恼或急躁",
      "感到好像将有可怕的事情发生而害怕",
    ],
  },
  ISI: {
    code: "ISI",
    name: "ISI 失眠严重程度指数",
    description: "过去两周内的睡眠困难和影响。结果仅用于自我筛查和随访参考，不构成诊断。",
    maxScore: 28,
    options: ["无", "轻度", "中度", "重度", "极重度"],
    itemLabels: [
      "入睡困难",
      "维持睡眠困难",
      "早醒问题",
      "对目前睡眠模式的满意程度",
      "睡眠问题对日间功能的影响",
      "他人能察觉到你的睡眠问题造成生活质量受损",
      "你对目前睡眠问题的担忧或痛苦程度",
    ],
  },
};

export function scoreScale(scale: ScaleCode, answers: number[]) {
  const definition = SCALE_DEFINITIONS[scale];
  if (!definition) throw new Error("Unsupported scale");
  if (answers.length !== definition.itemLabels.length) {
    throw new Error("Answer count does not match scale");
  }
  const maxOption = definition.options.length - 1;
  for (const answer of answers) {
    if (!Number.isInteger(answer) || answer < 0 || answer > maxOption) {
      throw new Error("Invalid answer value");
    }
  }

  const totalScore = answers.reduce((sum, n) => sum + n, 0);
  const severity = severityFor(scale, totalScore);
  const riskFlag = scale === "PHQ9" && answers[8] > 0;
  return { totalScore, severity, riskFlag };
}

export function severityFor(scale: ScaleCode, score: number) {
  if (scale === "PHQ9") {
    if (score <= 4) return "minimal";
    if (score <= 9) return "mild";
    if (score <= 14) return "moderate";
    if (score <= 19) return "moderately_severe";
    return "severe";
  }
  if (scale === "GAD7") {
    if (score <= 4) return "minimal";
    if (score <= 9) return "mild";
    if (score <= 14) return "moderate";
    return "severe";
  }
  if (score <= 7) return "no_clinically_significant_insomnia";
  if (score <= 14) return "subthreshold";
  if (score <= 21) return "moderate";
  return "severe";
}

export const SEVERITY_LABELS: Record<string, string> = {
  minimal: "最小/无明显",
  mild: "轻度",
  moderate: "中度",
  moderately_severe: "中重度",
  severe: "重度",
  no_clinically_significant_insomnia: "无临床显著失眠",
  subthreshold: "亚阈值失眠",
};
