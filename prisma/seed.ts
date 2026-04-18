import { PrismaClient } from "@prisma/client";
import { aphorisms } from "./seed-data/aphorisms";
import { trainingUnits } from "./seed-data/training-units";
import { badges } from "./seed-data/badges";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 开始播种数据...");

  // Aphorisms
  for (const a of aphorisms) {
    await prisma.aphorism.upsert({
      where: { id: a.id },
      update: {},
      create: {
        id: a.id,
        content: a.content,
        source: a.source,
        annotations: JSON.stringify(a.annotations),
        interpretation: a.interpretation,
        psychologyAnalysis: a.psychologyAnalysis,
        applicationScenarios: JSON.stringify(a.applicationScenarios),
        tags: JSON.stringify(a.tags),
        category: a.category,
      },
    });
  }
  console.log(`✓ 写入格言 ${aphorisms.length} 条`);

  // Training units
  for (const u of trainingUnits) {
    await prisma.trainingUnit.upsert({
      where: { module_order: { module: u.module, order: u.order } },
      update: {
        title: u.title,
        description: u.description,
        theoryContent: JSON.stringify(u.theoryContent),
        exercises: JSON.stringify(u.exercises),
        caseStudy: JSON.stringify(u.caseStudy),
        durationMinutes: u.durationMinutes,
      },
      create: {
        module: u.module,
        order: u.order,
        title: u.title,
        description: u.description,
        theoryContent: JSON.stringify(u.theoryContent),
        exercises: JSON.stringify(u.exercises),
        caseStudy: JSON.stringify(u.caseStudy),
        durationMinutes: u.durationMinutes,
      },
    });
  }
  console.log(`✓ 写入训练单元 ${trainingUnits.length} 个`);

  // Badges
  for (const b of badges) {
    await prisma.badge.upsert({
      where: { code: b.code },
      update: {
        name: b.name,
        description: b.description,
        iconEmoji: b.iconEmoji,
        criteria: JSON.stringify(b.criteria),
      },
      create: {
        code: b.code,
        name: b.name,
        description: b.description,
        iconEmoji: b.iconEmoji,
        criteria: JSON.stringify(b.criteria),
      },
    });
  }
  console.log(`✓ 写入徽章 ${badges.length} 枚`);

  console.log("🌱 播种完成");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
