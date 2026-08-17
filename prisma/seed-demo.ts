import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";
import { subDays, startOfDay } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  const phone = "13900000001";
  const user = await prisma.user.upsert({
    where: { phone },
    update: { nickname: "申报演示用户" },
    create: {
      phone,
      nickname: "申报演示用户",
      passwordHash: await hashPassword("Demo123456"),
    },
  });

  await prisma.consentRecord.create({
    data: {
      userId: user.id,
      consentVersion: "grant-mvp-2026-08",
      acceptedPrivacy: true,
      acceptedDisclaimer: true,
      acceptedScreening: true,
      userAgent: "seed-demo",
    },
  });

  for (let i = 13; i >= 0; i--) {
    const date = startOfDay(subDays(new Date(), i));
    await prisma.emotionRecord.upsert({
      where: { userId_recordDate: { userId: user.id, recordDate: date } },
      update: {},
      create: {
        userId: user.id,
        recordDate: date,
        emotionScore: Math.min(8, 4 + Math.floor((14 - i) / 4)),
        anxietyScore: Math.max(3, 7 - Math.floor((14 - i) / 4)),
        depressionScore: Math.max(2, 6 - Math.floor((14 - i) / 5)),
        notes: i === 0 ? "今天完成一次呼吸练习，情绪比早上稳定。" : undefined,
      },
    });
  }

  await prisma.screeningResult.createMany({
    data: [
      {
        userId: user.id,
        scale: "PHQ9",
        rawAnswers: JSON.stringify([1, 1, 1, 1, 0, 1, 0, 0, 0]),
        totalScore: 5,
        severity: "mild",
        riskFlag: false,
      },
      {
        userId: user.id,
        scale: "GAD7",
        rawAnswers: JSON.stringify([2, 1, 2, 1, 1, 1, 0]),
        totalScore: 8,
        severity: "mild",
        riskFlag: false,
      },
      {
        userId: user.id,
        scale: "ISI",
        rawAnswers: JSON.stringify([2, 2, 1, 2, 1, 1, 2]),
        totalScore: 11,
        severity: "subthreshold",
        riskFlag: false,
      },
    ],
  });

  await prisma.journalEntry.upsert({
    where: { userId_entryDate: { userId: user.id, entryDate: startOfDay(new Date()) } },
    update: { content: "演示：通过一句格言把自动想法写下来，再选择一个可执行的小行动。", mood: 7 },
    create: {
      userId: user.id,
      entryDate: startOfDay(new Date()),
      content: "演示：通过一句格言把自动想法写下来，再选择一个可执行的小行动。",
      mood: 7,
    },
  });

  await prisma.crisisEvent.create({
    data: {
      userId: user.id,
      triggerSource: "manual",
      triggerText: "演示：用户表达撑不住，需要人工复核。",
      matchedTerms: JSON.stringify(["撑不住"]),
      riskLevel: "urgent",
      recommendedAction: "建议尽快联系心理咨询师、精神科医生或机构值班人员，由人工进行风险复核和转介。",
      referralStatus: "pending",
    },
  });

  console.log("Demo user ready: 13900000001 / Demo123456");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
