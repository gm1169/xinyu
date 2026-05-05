// 格言种子数据扩展集（aph_025 - aph_050）
// 与 ./aphorisms.ts 同形结构；播种时合并

import type { SeedAphorism } from "./aphorisms";

export const aphorismsExt: SeedAphorism[] = [
  {
    id: "aph_025",
    content: "夫唯不争，故天下莫能与之争",
    source: "《道德经·第二十二章》",
    category: "classical",
    annotations: [
      { char: "夫唯", meaning: "正因为" },
      { char: "莫", meaning: "没有谁" },
    ],
    interpretation:
      "正因为不与人争，所以天下没有谁能与之争。看似退让，实为最高级的赢。",
    psychologyAnalysis:
      "对应「博弈论中的非零和思维」与「自我消耗」研究：把能量从对抗中撤回，反而获得更多支配自己人生的余地。",
    applicationScenarios: [
      "陷入「证明自己」的循环时",
      "总想压倒对方的辩论中",
      "工作中被人嫉妒、被排挤时",
    ],
    tags: ["人际", "胜负观"],
  },
  {
    id: "aph_026",
    content: "修身、齐家、治国、平天下",
    source: "《大学》",
    category: "classical",
    annotations: [
      { char: "修身", meaning: "完善自我" },
      { char: "齐家", meaning: "整理好家庭" },
    ],
    interpretation:
      "改变世界的起点是改变自己。每一个外部目标，都根植于内在秩序。",
    psychologyAnalysis:
      "对应「内控点」（Internal Locus of Control）：把改变的入口放在自己可触及之处，而不是寄托在外部世界先变好。",
    applicationScenarios: [
      "想抱怨大环境时",
      "感到「我太渺小，做什么都没用」时",
      "想把责任全推给外部时",
    ],
    tags: ["自我效能", "格局"],
  },
  {
    id: "aph_027",
    content: "士别三日，当刮目相看",
    source: "《三国志·吕蒙传》",
    category: "classical",
    annotations: [
      { char: "刮目", meaning: "擦亮眼睛重新看待" },
    ],
    interpretation:
      "几日不见，人已大不相同。提醒别用过去的眼光定义任何人——也别用过去的眼光定义自己。",
    psychologyAnalysis:
      "「成长型思维」（Carol Dweck）的古典版本：能力不是固定的，是可塑的。这一假设本身，就会改变行为。",
    applicationScenarios: [
      "被「我就是这样的人」自我设限时",
      "对他人贴了死板标签时",
      "怀疑自己能否改变时",
    ],
    tags: ["成长型思维", "自我观"],
  },
  {
    id: "aph_028",
    content: "学而不思则罔，思而不学则殆",
    source: "《论语·为政》",
    category: "classical",
    annotations: [
      { char: "罔", meaning: "迷茫、困惑" },
      { char: "殆", meaning: "危险、空虚" },
    ],
    interpretation:
      "只学不思考会迷失方向；只思考不学则陷入空想。两个动作必须互相校正。",
    psychologyAnalysis:
      "「双过程理论」的古典表达：直觉系统与分析系统都需要——单纯刷题或单纯空想，都会让人偏离实证。",
    applicationScenarios: [
      "刷再多教程仍没有进步时",
      "在脑中反复推演却不去实践时",
      "做完一件事却不复盘时",
    ],
    tags: ["学习", "反思"],
  },
  {
    id: "aph_029",
    content: "君子求诸己，小人求诸人",
    source: "《论语·卫灵公》",
    category: "classical",
    annotations: [
      { char: "诸", meaning: "之于" },
    ],
    interpretation:
      "成熟的人在自己身上找原因，不成熟的人总在别人身上找解释。",
    psychologyAnalysis:
      "对应「归因方式」研究：长期外归因与抑郁、习得性无助高度相关；适度内归因则带来掌控感与改变动力。",
    applicationScenarios: [
      "事情不顺时第一反应是「都怪 ___」时",
      "想停止情绪甩锅时",
      "建立对自己人生的责任感时",
    ],
    tags: ["归因", "成熟"],
  },
  {
    id: "aph_030",
    content: "工欲善其事，必先利其器",
    source: "《论语·卫灵公》",
    category: "classical",
    annotations: [
      { char: "利", meaning: "使……锐利" },
    ],
    interpretation:
      "想做好一件事，先得把工具准备到位。心理工具也一样——情绪稳定、思维清晰，是一切行动的工具。",
    psychologyAnalysis:
      "对应「自我管理资源」概念：意志力、注意力、情绪稳定性都是有限资源，提前蓄力才能在关键时刻使用。",
    applicationScenarios: [
      "做大事前过度焦虑、疲惫时",
      "缺少「准备」就硬上的习惯",
      "重要决策前需要养精蓄锐时",
    ],
    tags: ["准备", "自我管理"],
  },
  {
    id: "aph_031",
    content: "己所不欲，勿施于人",
    source: "《论语·颜渊》",
    category: "classical",
    annotations: [
      { char: "欲", meaning: "想要、愿意" },
      { char: "施", meaning: "施加" },
    ],
    interpretation:
      "自己不喜欢的事，不要加在别人身上。最朴素的同理心。",
    psychologyAnalysis:
      "心理学的「换位思考」（Theory of Mind）的古典原型。研究表明：日常练习这一句，能显著降低人际冲突。",
    applicationScenarios: [
      "想要批评他人前",
      "在亲密关系中起冲突时",
      "管理团队、做家长时",
    ],
    tags: ["同理心", "人际"],
  },
  {
    id: "aph_032",
    content: "知人者智，自知者明",
    source: "《道德经·第三十三章》",
    category: "classical",
    annotations: [
      { char: "明", meaning: "通透、清明" },
    ],
    interpretation:
      "了解别人是聪明，了解自己是清明。前者是社会能力，后者是更稀缺的内在能力。",
    psychologyAnalysis:
      "「自我觉察」（self-awareness）是几乎所有心理治疗的起点。它不是天生的，是可被反复训练的。",
    applicationScenarios: [
      "被自己的反应吓到时",
      "想理解「我为什么会这样」时",
      "练习元认知时",
    ],
    tags: ["自我觉察", "元认知"],
  },
  {
    id: "aph_033",
    content: "天将降大任于斯人也，必先苦其心志",
    source: "《孟子·告子下》",
    category: "classical",
    annotations: [
      { char: "斯人", meaning: "这个人" },
      { char: "苦其心志", meaning: "使其心志受苦" },
    ],
    interpretation:
      "人生中那些艰难的时刻，常常是为某个更深的承担所做的准备。",
    psychologyAnalysis:
      "「创伤后成长」（post-traumatic growth）研究表明：经历困难、并以建设性方式处理的人，常常发展出更深的人格力量。",
    applicationScenarios: [
      "正在经历低谷时",
      "怀疑「为什么是我」时",
      "重新理解过去苦难的意义时",
    ],
    tags: ["意义", "创伤后成长"],
  },
  {
    id: "aph_034",
    content: "山重水复疑无路，柳暗花明又一村",
    source: "陆游《游山西村》",
    category: "poetry",
    annotations: [
      { char: "疑", meaning: "以为" },
    ],
    interpretation:
      "看似走到尽头，转一个弯却豁然开朗。困境的尽头，往往不是终点，是路口。",
    psychologyAnalysis:
      "希望理论（Snyder's Hope Theory）的诗性表达：相信「还有路」本身，就是穿越困境的关键能源。",
    applicationScenarios: [
      "感到山穷水尽时",
      "想放弃的前一刻",
      "需要给自己一点希望时",
    ],
    tags: ["希望", "心理弹性"],
  },
  {
    id: "aph_035",
    content: "横看成岭侧成峰，远近高低各不同",
    source: "苏轼《题西林壁》",
    category: "poetry",
    annotations: [],
    interpretation:
      "同一座山，从不同角度看是不同的样子。所谓客观，常常只是某一个视角。",
    psychologyAnalysis:
      "认知行为疗法的核心：事件本身没有意义，意义来自我们对它的解读。换个视角，事件就变了。",
    applicationScenarios: [
      "和别人吵到「你根本不懂」时",
      "被一个固定看法困住时",
      "想松动一个执念时",
    ],
    tags: ["认知重构", "视角"],
  },
  {
    id: "aph_036",
    content: "醉里挑灯看剑，梦回吹角连营",
    source: "辛弃疾《破阵子》",
    category: "poetry",
    annotations: [
      { char: "挑灯", meaning: "拨亮油灯" },
    ],
    interpretation:
      "在喧嚣外的安静时刻，看见自己真正在意的事。每个人心里都有一把没拔出鞘的剑。",
    psychologyAnalysis:
      "对应「内在召唤」（inner calling）：被日常压住的核心渴望，会在静夜里浮出。承认它，是行动的起点。",
    applicationScenarios: [
      "深夜独处、突然涌起某种渴望时",
      "感到「我不是为这个活的」时",
      "重新校准方向时",
    ],
    tags: ["志向", "深层动机"],
  },
  {
    id: "aph_037",
    content: "采菊东篱下，悠然见南山",
    source: "陶渊明《饮酒·其五》",
    category: "poetry",
    annotations: [
      { char: "悠然", meaning: "从容、不刻意" },
    ],
    interpretation:
      "在寻常的劳作里，不经意地遇见美。「悠然」二字，是松弛但不空虚的状态。",
    psychologyAnalysis:
      "正念的诗性写照：不是去找一个特别的体验，是把全部注意放在此刻——一朵菊花、一座远山。",
    applicationScenarios: [
      "总是「等忙完了就……」的拖延中",
      "想从「为目的活」回到「为生活活」时",
      "练习日常正念时",
    ],
    tags: ["正念", "日常之美"],
  },
  {
    id: "aph_038",
    content: "莫听穿林打叶声，何妨吟啸且徐行",
    source: "苏轼《定风波》",
    category: "poetry",
    annotations: [
      { char: "吟啸", meaning: "吟唱长啸" },
      { char: "徐行", meaning: "缓缓前行" },
    ],
    interpretation:
      "雨打林叶的声音不必去听，不如一边吟唱一边慢慢走。同一场雨，可以让你狼狈，也可以让你从容。",
    psychologyAnalysis:
      "「关注重定向」（attention redirection）：你不能控制环境，但可以控制注意力。注意力放哪里，体验就在哪里。",
    applicationScenarios: [
      "外部环境一团糟时",
      "被坏消息淹没时",
      "想保持自己的节奏时",
    ],
    tags: ["注意力", "从容"],
  },
  {
    id: "aph_039",
    content: "千磨万击还坚劲，任尔东西南北风",
    source: "郑板桥《竹石》",
    category: "poetry",
    annotations: [
      { char: "尔", meaning: "你" },
    ],
    interpretation:
      "经历无数磨难仍然挺立，任凭四面八方的风。竹子的坚韧，来自根扎得深。",
    psychologyAnalysis:
      "心理弹性（resilience）的古典意象。研究表明：弹性强的人不是没有被吹动，而是有稳固的内在锚——价值、关系、自我认同。",
    applicationScenarios: [
      "连续遭遇打击时",
      "感到自己快要「垮」时",
      "想给自己增加心理力量时",
    ],
    tags: ["心理弹性", "意志力"],
  },
  {
    id: "aph_040",
    content: "纸上得来终觉浅，绝知此事要躬行",
    source: "陆游《冬夜读书示子聿》",
    category: "poetry",
    annotations: [
      { char: "躬行", meaning: "亲身实践" },
    ],
    interpretation:
      "书上读来的总是浅的，要真正理解必须亲自去做。",
    psychologyAnalysis:
      "对应「具身认知」（embodied cognition）：知识必须通过身体的行动才能内化。看再多自助书，不如做一个最小行动。",
    applicationScenarios: [
      "看了很多干货却没改变时",
      "「等我懂了再做」的拖延中",
      "需要从思考切换到行动时",
    ],
    tags: ["行动", "具身"],
  },
  {
    id: "aph_041",
    content: "盛年不重来，一日难再晨",
    source: "陶渊明《杂诗》",
    category: "poetry",
    annotations: [
      { char: "盛年", meaning: "年富力强的时候" },
    ],
    interpretation:
      "好的年华不会重来，今天的早晨也只有一次。提醒我们时间是不可逆的。",
    psychologyAnalysis:
      "「死亡觉察」（mortality salience）的温和表达：意识到有限，反而更愿意做真正重要的事——这是积极心理学的反复发现。",
    applicationScenarios: [
      "拖延让你重要的事一拖再拖时",
      "对「时间还多」的错觉清醒时",
      "决定从今天开始改变时",
    ],
    tags: ["时间", "行动"],
  },
  {
    id: "aph_042",
    content: "勿以恶小而为之，勿以善小而不为",
    source: "刘备《敕后主辞》",
    category: "classical",
    annotations: [],
    interpretation:
      "不要因为坏事小就去做，不要因为好事小就不做。人格是由无数微小选择累积出来的。",
    psychologyAnalysis:
      "对应「行为塑造」（behavioral shaping）：每一次选择都是对未来自我的一次投票。微小行为的累积，比偶尔的英雄壮举重要得多。",
    applicationScenarios: [
      "面对「就这一次」的诱惑时",
      "犹豫一件小好事「值不值得做」时",
      "建立小习惯时",
    ],
    tags: ["习惯", "人格"],
  },
  {
    id: "aph_043",
    content: "塞翁失马，焉知非福",
    source: "《淮南子·人间训》",
    category: "classical",
    annotations: [
      { char: "焉", meaning: "怎么、岂" },
    ],
    interpretation:
      "丢了一匹马，怎么知道不是福气？事情的好坏要拉长时间看。",
    psychologyAnalysis:
      "认知重构的经典案例。短期视角下的「不幸」，常常在长期视角下显出意义。",
    applicationScenarios: [
      "刚刚发生不愉快的事",
      "为一件小损失耿耿于怀时",
      "想拉长时间尺度看问题时",
    ],
    tags: ["认知重构", "时间视角"],
  },
  {
    id: "aph_044",
    content: "不积跬步，无以至千里",
    source: "《荀子·劝学》",
    category: "classical",
    annotations: [
      { char: "跬步", meaning: "半步、小步" },
    ],
    interpretation:
      "不积累每一小步，就无法到达千里之外。所有伟大都建立在「微小且持续」之上。",
    psychologyAnalysis:
      "对应「最小可行行动」与「复利效应」：每天 1% 的改变，一年后是巨大的差异。这与冲刺式的「彻底改变」相反。",
    applicationScenarios: [
      "目标太大、不知从哪开始时",
      "怀疑「这点小事有用吗」时",
      "建立长期习惯时",
    ],
    tags: ["复利", "习惯"],
  },
  {
    id: "aph_045",
    content: "事在人为，路在脚下",
    source: "现代谚语",
    category: "modern",
    annotations: [],
    interpretation:
      "事情成不成在人怎么去做，路在自己脚下走出来。命运不是被给的，是被走的。",
    psychologyAnalysis:
      "对应「能动性」（agency）——人类心理健康的核心要素。当你相信「我能影响自己的人生」，无力感便会松动。",
    applicationScenarios: [
      "感到「命运无常、努力无用」时",
      "想从受害者位置回到主导者位置时",
      "鼓励自己迈出第一步时",
    ],
    tags: ["能动性", "希望"],
  },
  {
    id: "aph_046",
    content: "你所抗拒的，会一直存在",
    source: "卡尔·荣格",
    category: "modern",
    annotations: [],
    interpretation:
      "你越压抑、否认的东西，越是死缠着你。承认它存在，是松动它的第一步。",
    psychologyAnalysis:
      "ACT 的核心原理：体验性回避（experiential avoidance）会延长痛苦。允许情绪存在，反而能让它通过。",
    applicationScenarios: [
      "试图「不要难过」却越来越难过时",
      "压抑某种情绪很久了",
      "练习「允许」时",
    ],
    tags: ["接纳", "ACT"],
  },
  {
    id: "aph_047",
    content: "你不必相信你想的每一个念头",
    source: "现代心理学·CBT",
    category: "modern",
    annotations: [],
    interpretation:
      "念头不是事实。许多让你痛苦的内容，只是大脑在自动播放，并不代表真相。",
    psychologyAnalysis:
      "认知行为疗法的核心信条之一。识别「自动思维」并不一定要去证伪它，光是「不必相信」就能松动很多痛苦。",
    applicationScenarios: [
      "脑中冒出「我太差了」时",
      "陷入灾难化想象时",
      "做认知解离练习时",
    ],
    tags: ["认知解离", "CBT"],
  },
  {
    id: "aph_048",
    content: "重要的不是发生了什么，而是我如何回应",
    source: "维克多·弗兰克尔",
    category: "modern",
    annotations: [],
    interpretation:
      "在刺激与反应之间，有一段空间——那段空间里有自由。",
    psychologyAnalysis:
      "斯多葛哲学 + 维克多·弗兰克尔的意义疗法：人无法控制外部，但可以选择回应方式。这个「选择空间」是治疗的核心战场。",
    applicationScenarios: [
      "对外界激烈反应后想反思时",
      "被人冒犯第一反应是反击时",
      "练习情绪调节时",
    ],
    tags: ["回应空间", "情绪调节"],
  },
  {
    id: "aph_049",
    content: "完美是优秀的敌人",
    source: "伏尔泰",
    category: "modern",
    annotations: [],
    interpretation:
      "为了等到完美，你错过了所有「足够好」。完美主义的本质，是恐惧而不是高标准。",
    psychologyAnalysis:
      "完美主义在临床上与焦虑、抑郁、拖延高度相关。降低标准到「足够好」（good enough），是反完美主义的核心干预。",
    applicationScenarios: [
      "因「还没准备好」拖延时",
      "反复打磨却不敢交付时",
      "对自己永远不满意时",
    ],
    tags: ["完美主义", "拖延"],
  },
  {
    id: "aph_050",
    content: "你不是天气，你是天空",
    source: "佩玛·丘卓",
    category: "modern",
    annotations: [],
    interpretation:
      "情绪和念头是天气——会变化、会过去；你是天空——容纳所有天气，但不被任何一种定义。",
    psychologyAnalysis:
      "「观察者自我」的现代隐喻。建立这一视角，是大多数正念与解离训练的目标。",
    applicationScenarios: [
      "被强烈情绪淹没时",
      "把暂时状态当成永久身份时",
      "练习自我抽离时",
    ],
    tags: ["观察者自我", "正念"],
  },
];
