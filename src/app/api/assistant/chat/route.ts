import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fail, ok, safeJson, unauthorized } from "@/lib/api";
import {
  buildUserContext,
  systemPrompt,
  detectCrisis,
  CRISIS_RESPONSE,
} from "@/lib/ai";

const Message = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});
const Body = z.object({
  messages: z.array(Message).min(1).max(40),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();

  const parsed = Body.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("参数错误");

  const last = parsed.data.messages[parsed.data.messages.length - 1];
  if (last.role !== "user") return fail("最后一条消息必须来自用户");

  if (detectCrisis(last.content)) {
    return ok({ content: CRISIS_RESPONSE, crisis: true });
  }

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) return unauthorized();
  const ctx = await buildUserContext(session.sub, user.nickname);
  const sys = systemPrompt(ctx);

  // 如果配置了 ANTHROPIC_API_KEY，直接调用 Claude；否则返回内置的本地引导（MVP 降级）
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return ok({
      content: localFallback(last.content, ctx),
      fallback: true,
    });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
        max_tokens: 800,
        system: sys,
        messages: parsed.data.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!res.ok) {
      const errTxt = await res.text();
      console.error("Claude API error:", errTxt);
      return ok({
        content: localFallback(last.content, ctx),
        fallback: true,
      });
    }

    const data = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const text =
      data.content
        ?.filter((c) => c.type === "text")
        .map((c) => c.text)
        .join("\n") ?? localFallback(last.content, ctx);

    return ok({ content: text });
  } catch (e) {
    console.error(e);
    return ok({
      content: localFallback(last.content, ctx),
      fallback: true,
    });
  }
}

// 当 Claude API 未配置时的保底回复——以古典意象进行简单回应
function localFallback(
  userText: string,
  ctx: { nickname: string; recentEmotionTrend: string },
) {
  const t = userText.toLowerCase();
  if (t.includes("焦虑") || t.includes("紧张") || t.includes("担心")) {
    return `${ctx.nickname}，我听到你了。\n\n焦虑常常来自我们试图控制那些不归我们管的事。此刻，可以先做一件小事：4 秒吸气 → 7 秒屏息 → 8 秒呼气，重复 4 次。\n\n然后回到我这里，告诉我：此刻你真正能影响的那件事，是什么？`;
  }
  if (t.includes("失眠") || t.includes("睡不着")) {
    return `「越努力越睡不着」是真实现象——老子说「无为而无不为」，用在失眠上最贴切。\n\n试着把「必须睡着」换成「安静地躺着也可以」，然后感受身体的重量一点点沉入床垫。睡不着也没关系，这份练习本身就有价值。`;
  }
  if (t.includes("练习") || t.includes("解离")) {
    return `好的，让我们一起来做一次简短的认知解离练习。\n\n闭上眼，注意此刻心中最明显的一个想法。现在，轻轻说一句：「我注意到我有一个 __ 的想法」。\n\n感受一下，当你把「想法」和「自己」拉开一点距离时，有什么变化？`;
  }
  if (t.includes("难过") || t.includes("低落") || t.includes("抑郁")) {
    return `${ctx.nickname}，你愿意说出来，已经是很大的一步。\n\n现在不需要努力变好。允许自己「此刻就是这样」——情绪是信使，不是主人。\n\n可以告诉我，今天有没有一个小得不能再小的好瞬间？哪怕只是一口温水。`;
  }
  return `我在这里。${ctx.nickname}，可以告诉我多一点吗？\n\n比如——此刻身体里最明显的感受是什么？哪怕只是一个词。`;
}
