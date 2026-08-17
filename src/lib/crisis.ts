export type CrisisLevel = "watch" | "urgent" | "emergency";

const EMERGENCY_TERMS = [
  "自杀",
  "想死",
  "不想活",
  "活不下去",
  "结束生命",
  "跳楼",
  "吃安眠药",
  "割腕",
  "自残",
  "伤害自己",
];

const URGENT_TERMS = ["撑不住", "崩溃", "绝望", "没有希望", "控制不住", "想消失"];

export function triageCrisis(text: string): {
  detected: boolean;
  level: CrisisLevel;
  matchedTerms: string[];
  recommendedAction: string;
} {
  const matchedEmergency = EMERGENCY_TERMS.filter((term) => text.includes(term));
  if (matchedEmergency.length > 0) {
    return {
      detected: true,
      level: "emergency",
      matchedTerms: matchedEmergency,
      recommendedAction: "请立即联系当地急救、危机热线或前往最近医院急诊；建议同时联系可信任家属或同伴陪同。",
    };
  }

  const matchedUrgent = URGENT_TERMS.filter((term) => text.includes(term));
  if (matchedUrgent.length > 0) {
    return {
      detected: true,
      level: "urgent",
      matchedTerms: matchedUrgent,
      recommendedAction: "建议尽快联系心理咨询师、精神科医生或机构值班人员，由人工进行风险复核和转介。",
    };
  }

  return {
    detected: false,
    level: "watch",
    matchedTerms: [],
    recommendedAction: "继续观察，鼓励用户使用量表筛查和联系专业支持。",
  };
}

export const DEFAULT_CRISIS_RESOURCE = {
  label: process.env.NEXT_PUBLIC_CRISIS_RESOURCE_LABEL || "988 Suicide & Crisis Lifeline",
  phone: process.env.NEXT_PUBLIC_CRISIS_PHONE || "988",
  sms: process.env.NEXT_PUBLIC_CRISIS_SMS || "988",
  chatUrl: process.env.NEXT_PUBLIC_CRISIS_CHAT_URL || "https://988lifeline.org/chat/",
  localReferralNote:
    process.env.NEXT_PUBLIC_LOCAL_REFERRAL_NOTE ||
    "本系统为演示原型。正式部署前应由项目单位核验并配置所在地心理援助热线、精神卫生中心、社区精防或医院急诊转介联系人。",
};

export function crisisResponse(level: CrisisLevel) {
  const resource = DEFAULT_CRISIS_RESOURCE;
  const urgency =
    level === "emergency"
      ? "我检测到这可能涉及紧急安全风险。请先暂停和 AI 继续深入讨论，把安全放在第一位。"
      : "我检测到你可能处在较高压力或危机状态。这个提示需要人工支持来复核。";

  return `${urgency}\n\n建议你现在做三件事：\n1. 联系可信任的人陪在你身边。\n2. 联系专业支持：${resource.label} ${resource.phone}。\n3. 如果存在立即危险，请前往最近医院急诊或联系当地急救。\n\n${resource.localReferralNote}\n\n我会把这次风险提示记录为待人工复核事件，但我不能替代医生、心理治疗师或急救服务。`;
}
