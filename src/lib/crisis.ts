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
      recommendedAction: "请立即联系当地急救、心理援助热线或前往最近医院急诊；建议同时联系可信任家属或同伴陪同。",
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
  label: process.env.NEXT_PUBLIC_CRISIS_RESOURCE_LABEL || "武汉市精神卫生中心 心心语心理援助热线",
  phone: process.env.NEXT_PUBLIC_CRISIS_PHONE || "027-85844666",
  secondaryLabel: process.env.NEXT_PUBLIC_CRISIS_SECONDARY_LABEL || "全国统一心理援助热线",
  secondaryPhone: process.env.NEXT_PUBLIC_CRISIS_SECONDARY_PHONE || "12356",
  olderAdultLabel: process.env.NEXT_PUBLIC_CRISIS_OLDER_ADULT_LABEL || "银龄好心情心理热线",
  olderAdultPhone: process.env.NEXT_PUBLIC_CRISIS_OLDER_ADULT_PHONE || "027-85868899",
  hope24Label: process.env.NEXT_PUBLIC_CRISIS_HOPE24_LABEL || "希望24小时心理危机干预热线",
  hope24Phone: process.env.NEXT_PUBLIC_CRISIS_HOPE24_PHONE || "400-161-9995",
  beijingLabel:
    process.env.NEXT_PUBLIC_CRISIS_BEIJING_LABEL ||
    "北京心理危机研究与干预中心/北京市心理援助热线",
  beijingLandline: process.env.NEXT_PUBLIC_CRISIS_BEIJING_LANDLINE || "800-810-1117",
  beijingMobile: process.env.NEXT_PUBLIC_CRISIS_BEIJING_MOBILE || "010-82951332",
  emergencyPhone: process.env.NEXT_PUBLIC_EMERGENCY_PHONE || "120",
  localReferralNote:
    process.env.NEXT_PUBLIC_LOCAL_REFERRAL_NOTE ||
    "武汉示范部署配置：危机事件先提示用户联系专业热线和急诊，再记录为待人工复核事件；正式上线前由项目单位再次核验号码、服务时间和转介联系人。",
};

export function crisisResponse(level: CrisisLevel) {
  const resource = DEFAULT_CRISIS_RESOURCE;
  const urgency =
    level === "emergency"
      ? "我检测到这可能涉及紧急安全风险。请先暂停和 AI 继续深入讨论，把安全放在第一位。"
      : "我检测到你可能处在较高压力或危机状态。这个提示需要人工支持来复核。";

  return `${urgency}\n\n建议你现在做三件事：\n1. 联系可信任的人陪在你身边。\n2. 联系专业支持：${resource.label} ${resource.phone}；也可拨打 ${resource.secondaryLabel} ${resource.secondaryPhone}、${resource.hope24Label} ${resource.hope24Phone}，或 ${resource.beijingLabel} ${resource.beijingLandline}/${resource.beijingMobile}。\n3. 如果存在立即危险，请拨打 ${resource.emergencyPhone} 或前往最近医院急诊。\n\n${resource.localReferralNote}\n\n我会把这次风险提示记录为待人工复核事件，但我不能替代医生、心理治疗师或急救服务。`;
}
