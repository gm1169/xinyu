// 认知解离训练营·入门篇（6 单元），对应产品规格书 3.2 节

export type SeedExercise = {
  id: string;
  type: "choice" | "reflection" | "slider";
  question: string;
  options?: string[];
  correctAnswer?: number;
  placeholder?: string;
};

export type SeedUnit = {
  module: string;
  order: number;
  title: string;
  description: string;
  theoryContent: { text: string; keyPoints: string[] };
  exercises: SeedExercise[];
  caseStudy: { title: string; content: string; reflectionQuestions: string[] };
  durationMinutes: number;
};

export const trainingUnits: SeedUnit[] = [
  {
    module: "intro",
    order: 1,
    title: "思维只是思维",
    description: "学习将思维「客体化」——一个念头不等于一个事实。",
    theoryContent: {
      text: "我们的大脑每天产生数万个念头，其中大部分是自动化的、重复的、甚至与现实无关。认知解离的第一步，就是从「我 = 我的想法」转变为「我 = 观察想法的人」。当你能够说『我有一个我很失败的想法』，而不是『我很失败』，自由就已经开始了。",
      keyPoints: [
        "想法是心智的产物，不是现实本身",
        "感受到的紧迫感，不等于事实的紧迫性",
        "练习「我注意到我有一个 __ 的想法」句式",
      ],
    },
    exercises: [
      {
        id: "u1_e1",
        type: "choice",
        question: "当「我不行」的想法冒出来时，以下哪个回应更符合认知解离？",
        options: [
          "强迫自己相信「我行」",
          "承认「我确实不行」",
          "注意到：『我有一个我不行的想法』",
          "转移注意力不去想",
        ],
        correctAnswer: 2,
      },
      {
        id: "u1_e2",
        type: "reflection",
        question: "请用「我注意到我有一个 __ 的想法」句式，写下你今天出现过的一个念头。",
        placeholder: "例如：我注意到我有一个「我必须让所有人都满意」的想法。",
      },
    ],
    caseStudy: {
      title: "小李的工作汇报",
      content:
        "小李下周要做一次重要汇报，脑子里反复冒出「我肯定会搞砸」。一开始他把它当成预言，越想越焦虑。练习之后他尝试说：『我注意到我有一个我会搞砸的想法』。这句话一出口，他发现——想法还在，但他已经不在想法里面了。他照常准备、照常上台，结果比预期好得多。",
      reflectionQuestions: [
        "小李并没有让负面想法消失，为什么他还是能前进？",
        "你自己有没有类似「把想法当成预言」的经历？",
      ],
    },
    durationMinutes: 15,
  },
  {
    module: "intro",
    order: 2,
    title: "思维是飘过的云",
    description: "学习观察而不抓取——念头来了让它来，去了让它去。",
    theoryContent: {
      text: "想象你躺在草地上仰望天空。云朵飘过，你不需要追它，也不需要赶它。你的想法也是这样：它们在你的心智天空中飘过。烦恼的不是云，是我们伸手去抓云的那个动作。",
      keyPoints: [
        "情绪和想法的本质是流动的",
        "抓取 = 延长；观察 = 通过",
        "练习「允许它在那里」",
      ],
    },
    exercises: [
      {
        id: "u2_e1",
        type: "choice",
        question: "以下哪种做法最接近「观察而不抓取」？",
        options: [
          "告诉自己不要去想",
          "记录下来分析为什么会有这个想法",
          "看着它出现，也看着它自然离开",
          "立刻用理性反驳它",
        ],
        correctAnswer: 2,
      },
      {
        id: "u2_e2",
        type: "slider",
        question: "做完 3 分钟的「云飘过」想象练习后，你的紧张度是多少？（1 = 非常放松，10 = 非常紧张）",
      },
    ],
    caseStudy: {
      title: "失眠夜里的云",
      content:
        "王老师连续一周失眠。她发现自己越是想「赶紧睡」，脑子越兴奋。某天她放弃抵抗，改成躺着观察念头：「哦，又来了一个关于明天会议的念头」「哦，这是一个担心女儿的念头」。她没有被每一个念头牵走，大约二十分钟后，她睡着了。",
      reflectionQuestions: [
        "「越是抵抗，越是加强」——你在哪些场景体验过这个机制？",
        "「观察而不抓取」与「压抑」有什么本质区别？",
      ],
    },
    durationMinutes: 15,
  },
  {
    module: "intro",
    order: 3,
    title: "思维是电视屏幕上的文字",
    description: "学习与思维内容保持距离——你是屏幕，不是字幕。",
    theoryContent: {
      text: "想象你的思维像电视字幕一样，一行一行从屏幕下方划过：「我完蛋了」「他是不是讨厌我」「我为什么又失败」。字幕在滚动，但屏幕本身没有变化——稳定、广阔、从容。你的本体是屏幕，不是字幕。字幕再激烈，也不能改变屏幕的完整性。",
      keyPoints: [
        "「观察者自我」是稳定不变的那部分",
        "内容会变，容器不会变",
        "练习「我是这一切体验的见证者」",
      ],
    },
    exercises: [
      {
        id: "u3_e1",
        type: "reflection",
        question: "此刻请闭眼 1 分钟，观察心里最明显的一条「字幕」，写下它。",
        placeholder: "例如：我最近做的决定是不是错的？",
      },
      {
        id: "u3_e2",
        type: "choice",
        question: "「我不是我的想法」这句话最核心的含义是？",
        options: [
          "我可以否定所有想法",
          "我比我的想法更大、更稳定",
          "想法都是错的",
          "我不应该有想法",
        ],
        correctAnswer: 1,
      },
    ],
    caseStudy: {
      title: "面试官的「眼神」",
      content:
        "陈先生面试时，看到面试官皱了下眉。他脑中立刻跳出「字幕」：「他觉得我不行」「我搞砸了」。他想起练习，把这些当成字幕，而不是事实。字幕继续滚，但他继续说自己要说的。面试结束，面试官主动加了他的联系方式。",
      reflectionQuestions: [
        "你最容易把哪种「字幕」当成事实？",
        "当你把自己看作「屏幕」而不是「字幕」时，感受有什么变化？",
      ],
    },
    durationMinutes: 18,
  },
  {
    module: "intro",
    order: 4,
    title: "思维是大海表面的波浪",
    description: "理解思维的来来去去——深海永远安静。",
    theoryContent: {
      text: "海面上有波浪，有时大有时小，有时平静有时汹涌。但深海，无论海面如何，永远是安静的。你的情绪和想法是海面的波浪，你的本我是深海。波涛汹涌时，不用假装海面平静；只要记得：你也是深海。",
      keyPoints: [
        "情绪波动是正常的",
        "不必压抑波浪，也不必被波浪定义",
        "向内沉一点，就有安静",
      ],
    },
    exercises: [
      {
        id: "u4_e1",
        type: "slider",
        question: "此刻你的「海面」波浪有多大？（1 = 完全平静，10 = 风暴）",
      },
      {
        id: "u4_e2",
        type: "reflection",
        question: "闭上眼，感受一下你的「深海」——那个始终存在的安静处。描述一下它的感觉。",
        placeholder: "例如：像胸口中间一个温暖、缓慢的地方……",
      },
    ],
    caseStudy: {
      title: "争吵后的林女士",
      content:
        "林女士和丈夫激烈争吵后，怒气翻涌。以往她会追着吵，越来越烈。这次她做了 5 分钟的「深海练习」——不是压下去怒气，而是提醒自己：「怒气是海面，我是深海。」她没有回避愤怒，但没有被它带走。半小时后她主动开口，说的是真正想说的话，而不是反击。",
      reflectionQuestions: [
        "「承认波浪 + 记得深海」比「压抑波浪」多了什么？",
        "哪些时刻你最需要这个意象？",
      ],
    },
    durationMinutes: 18,
  },
  {
    module: "intro",
    order: 5,
    title: "思维是乘客与公交车",
    description: "区分自我与思维内容——你是司机，不是乘客。",
    theoryContent: {
      text: "把你自己想象成一辆公交车的司机，你要开往「我想成为的人」这个方向。车上有各种乘客——焦虑、自我怀疑、完美主义、恐惧……它们会大喊大叫，让你停下、改道、回头。你可以听见它们，但方向盘一直在你手里。",
      keyPoints: [
        "思维乘客会一直存在，试图让你改道",
        "听见 ≠ 听从",
        "方向由你的价值决定，不由最吵的乘客决定",
      ],
    },
    exercises: [
      {
        id: "u5_e1",
        type: "reflection",
        question: "你车上最吵的一个「乘客」是谁？给它起个名字，并写下它常说的一句话。",
        placeholder: "例如：『完美先生』常说：「这样不够好，你还得再改 10 遍。」",
      },
      {
        id: "u5_e2",
        type: "choice",
        question: "当「完美先生」大喊大叫时，最符合认知解离的做法是？",
        options: [
          "把它赶下车",
          "假装没听见",
          "继续开车，允许它喊，但方向不变",
          "停车跟它辩论",
        ],
        correctAnswer: 2,
      },
    ],
    caseStudy: {
      title: "公众演讲前的张同学",
      content:
        "张同学准备上台演讲，车上的「怕出丑先生」疯狂大喊：「你会忘词！」「大家会笑你！」以前他会停车跟它辩论，越辩越焦虑。这次他说：「好的，我听到你了。我要继续开。」他上台，忘了一处词，但继续讲完了，拿了好评。",
      reflectionQuestions: [
        "「听见但不听从」与「忽视」有何不同？",
        "方向盘掌握在自己手中，需要一个锚——你的锚（价值）是什么？",
      ],
    },
    durationMinutes: 20,
  },
  {
    module: "intro",
    order: 6,
    title: "思维图书馆",
    description: "建立观察者的视角——把每个念头归档，而不是活在其中。",
    theoryContent: {
      text: "想象你的心是一座图书馆。每个念头都是一本书。你可以翻开它、读一读、然后放回书架。你不是书，你是图书管理员。有些书你翻得太多次，以至于忘了把它们放回去——那些是你反复反刍的念头。今天，练习把它们放回去。",
      keyPoints: [
        "观察者视角是可以训练的",
        "给念头命名、归档，让它回到它的位置",
        "你比任何一本书都大",
      ],
    },
    exercises: [
      {
        id: "u6_e1",
        type: "reflection",
        question: "今天你最想「归档」的一个念头是？给它一个书名。",
        placeholder: "例如：《我还不够好：第 327 版》",
      },
      {
        id: "u6_e2",
        type: "slider",
        question: "完成本次入门篇训练后，你对「我可以与思维保持距离」的信心是？（1 = 完全不行，10 = 非常有信心）",
      },
    ],
    caseStudy: {
      title: "完成入门篇的小林",
      content:
        "小林过去被「我不配」这个念头困扰了十几年。6 个单元下来，她说：「它还在，但它现在是一本书，不是一面墙。」她开始去做那些「不配做」的事——申请新工作、表达真实意见、拒绝不合理的请求。念头没变，她变了。",
      reflectionQuestions: [
        "你有哪一本「读了太多次、忘了归档」的书？",
        "完成入门篇，你想对开始时的自己说什么？",
      ],
    },
    durationMinutes: 20,
  },
];
