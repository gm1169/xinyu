// 格言种子数据（MVP：精选 24 条，覆盖古语/诗词/现代哲思三类）
// 结构与产品规格书「每日格言智慧」章节一致

export type SeedAphorism = {
  id: string;
  content: string;
  source: string;
  category: "classical" | "poetry" | "modern";
  annotations: { char: string; meaning: string }[];
  interpretation: string;
  psychologyAnalysis: string;
  applicationScenarios: string[];
  tags: string[];
};

export const aphorisms: SeedAphorism[] = [
  {
    id: "aph_001",
    content: "上善若水，水善利万物而不争",
    source: "《道德经·第八章》",
    category: "classical",
    annotations: [
      { char: "上善", meaning: "最高境界的善" },
      { char: "若", meaning: "如同、像" },
      { char: "利", meaning: "滋养、造福" },
    ],
    interpretation:
      "最高的善就像水一样：滋养万物却从不与万物争高下。这不是软弱，而是一种深沉的力量——顺势而为、不执着于对抗。",
    psychologyAnalysis:
      "认知行为疗法中的「认知重构」强调：对抗性思维往往制造更多痛苦。水的意象提供一种「接纳—顺势」的替代策略，与接纳承诺疗法（ACT）的核心理念一致。",
    applicationScenarios: [
      "在人际冲突中，想要争辩或证明自己时",
      "面对无法改变的现实而感到愤怒时",
      "被同事/家人误解，第一反应是反击时",
    ],
    tags: ["接纳", "人际", "情绪调节"],
  },
  {
    id: "aph_002",
    content: "不以物喜，不以己悲",
    source: "范仲淹《岳阳楼记》",
    category: "classical",
    annotations: [
      { char: "物", meaning: "外在事物、环境" },
      { char: "己", meaning: "自身的境遇" },
    ],
    interpretation:
      "不因外物顺遂而过度欢喜，也不因自身失意而过度悲伤。这是一种稳定的内在状态，情绪不再被外界牵着走。",
    psychologyAnalysis:
      "这正是「情绪调节」与「正念观察」的古典表述。当代心理学发现：情绪强度与外部事件的关联，远小于我们赋予事件的意义。稳定的自我是可训练的。",
    applicationScenarios: [
      "获得好成绩/好评后感到飘飘然时",
      "失败、被拒绝后陷入自我否定时",
      "情绪随着股价、点赞数、他人评价起伏时",
    ],
    tags: ["情绪调节", "正念", "稳定"],
  },
  {
    id: "aph_003",
    content: "知者不惑，仁者不忧，勇者不惧",
    source: "《论语·子罕》",
    category: "classical",
    annotations: [
      { char: "知", meaning: "通「智」，智慧" },
      { char: "惑", meaning: "困惑、迷茫" },
      { char: "忧", meaning: "忧愁、担心" },
    ],
    interpretation:
      "真正的智慧让人不再困惑，真正的仁爱让人不再忧愁，真正的勇气让人不再恐惧。三者从不同路径通向内在安稳。",
    psychologyAnalysis:
      "对应认知疗法的三条路径：改变认知（智）、建立温暖的自我关系（仁）、行为暴露与承诺行动（勇）。这是一份两千年前的综合性治疗处方。",
    applicationScenarios: [
      "不知道下一步怎么走、反复纠结时",
      "为尚未发生的事情过度焦虑时",
      "想做某件事却被恐惧卡住时",
    ],
    tags: ["勇气", "智慧", "综合"],
  },
  {
    id: "aph_004",
    content: "行到水穷处，坐看云起时",
    source: "王维《终南别业》",
    category: "poetry",
    annotations: [
      { char: "水穷处", meaning: "溪水的尽头" },
      { char: "云起", meaning: "云雾升腾" },
    ],
    interpretation:
      "走到水流的尽头，看似无路了——此时坐下来看云慢慢升起。所谓绝境，常常是视角转换的入口。",
    psychologyAnalysis:
      "对应「认知解离」技术：当思维告诉你「完了、没出路了」，练习从思维内容中抽身，观察它、而不相信它。现实从未穷尽，穷尽的是当下的心智框架。",
    applicationScenarios: [
      "工作/学业陷入瓶颈感到绝望时",
      "感情/关系走入死胡同时",
      "脑子里反复出现「我不行了」的念头时",
    ],
    tags: ["认知解离", "视角", "希望"],
  },
  {
    id: "aph_005",
    content: "竹密不妨流水过，山高岂碍白云飞",
    source: "《景德传灯录》",
    category: "classical",
    annotations: [
      { char: "妨", meaning: "阻挡、妨碍" },
      { char: "岂", meaning: "怎么、难道" },
    ],
    interpretation:
      "竹林再密，也挡不住流水穿过；山再高，也挡不住白云飞越。外在的阻碍从不是真正的阻碍，只要你选对了「流动」的方式。",
    psychologyAnalysis:
      "提醒我们区分「真实障碍」与「思维障碍」。大多数让人停滞的不是现实，而是对现实的灾难化预期。这条格言用意象直接绕过了语言式反刍。",
    applicationScenarios: [
      "被「这事不可能」的念头困住时",
      "感到自己渺小、无力改变环境时",
      "陷入「我只能这样了」的限定性思维时",
    ],
    tags: ["认知解离", "灵活性"],
  },
  {
    id: "aph_006",
    content: "欲穷千里目，更上一层楼",
    source: "王之涣《登鹳雀楼》",
    category: "poetry",
    annotations: [
      { char: "穷", meaning: "看尽、达到极致" },
      { char: "千里目", meaning: "千里之外的景象" },
    ],
    interpretation:
      "想看得更远，就再往上走一层。视野的局限，往往不是眼睛的问题，而是所处位置的问题。",
    psychologyAnalysis:
      "对应「元认知」训练：从「想法里」跳到「想法外」——从被情绪淹没的当事人，变成观察情绪的观察者。视角一变，问题的大小就变了。",
    applicationScenarios: [
      "反复纠结同一件小事无法放下时",
      "视野被眼前的困境占满时",
      "想要突破当前局面时",
    ],
    tags: ["元认知", "视角", "成长"],
  },
  {
    id: "aph_007",
    content: "人生如逆旅，我亦是行人",
    source: "苏轼《临江仙·送钱穆父》",
    category: "poetry",
    annotations: [
      { char: "逆旅", meaning: "旅店，人生短暂停留之地" },
      { char: "行人", meaning: "过客" },
    ],
    interpretation:
      "人生就像一家旅馆，我也不过是一个过客。所有的得失荣辱，终究只是路过。",
    psychologyAnalysis:
      "死亡觉察（mortality salience）在积极心理学中被证实能降低琐事带来的痛苦。把时间尺度放大，许多当下的烦恼会自然缩小。",
    applicationScenarios: [
      "被职场琐事、人情往来消耗时",
      "为「别人怎么看我」感到压迫时",
      "想回归内心真正重要的事情时",
    ],
    tags: ["生命意义", "接纳"],
  },
  {
    id: "aph_008",
    content: "宠辱不惊，看庭前花开花落",
    source: "陈继儒《小窗幽记》",
    category: "classical",
    annotations: [
      { char: "宠", meaning: "受到赏识、夸奖" },
      { char: "辱", meaning: "受到轻视、批评" },
    ],
    interpretation:
      "无论被宠爱还是被轻慢都不动摇，像看着院子里的花自然开落一样看待起伏。",
    psychologyAnalysis:
      "正念观察的经典画面。关键不是「不起情绪」，而是「允许情绪如花开花落」——来了不抗拒，去了不挽留。",
    applicationScenarios: [
      "突然被领导表扬或批评后心神不定时",
      "被夸奖后反而焦虑「下次做不到怎么办」时",
      "想练习不被外界评价左右时",
    ],
    tags: ["正念", "情绪调节"],
  },
  {
    id: "aph_009",
    content: "尽人事，听天命",
    source: "李汝珍《镜花缘》",
    category: "classical",
    annotations: [
      { char: "尽", meaning: "竭尽全力" },
      { char: "天命", meaning: "不受个人控制的那部分" },
    ],
    interpretation:
      "把自己能做的全部做到，然后把不能控制的部分交出去。这不是消极，而是最成熟的主动。",
    psychologyAnalysis:
      "经典的「控制二分法」（斯多葛哲学也有完全一致的表述）。焦虑的来源，80% 是试图控制那些根本不归我们管的事。",
    applicationScenarios: [
      "考试、面试、交付前夜失眠时",
      "为他人的选择、评价焦虑时",
      "结果尚未揭晓、反复推演时",
    ],
    tags: ["焦虑", "控制感", "接纳"],
  },
  {
    id: "aph_010",
    content: "千里之行，始于足下",
    source: "《道德经·第六十四章》",
    category: "classical",
    annotations: [
      { char: "千里", meaning: "极远的距离" },
      { char: "足下", meaning: "脚下第一步" },
    ],
    interpretation:
      "再长的路，也是从脚下这一步开始的。真正能推进目标的，从来不是想法，而是一个动作。",
    psychologyAnalysis:
      "行为激活（Behavioral Activation）是治疗抑郁的核心技术之一：当思维陷入停滞，先启动一个最小可行动作，情绪会被行动带动。",
    applicationScenarios: [
      "目标太大、望而却步时",
      "「等我准备好了再开始」已经拖了很久时",
      "每天都在思考却没有开始行动时",
    ],
    tags: ["行为激活", "拖延", "价值行动"],
  },
  {
    id: "aph_011",
    content: "心静则神清，神清则智慧",
    source: "《菜根谭》",
    category: "classical",
    annotations: [
      { char: "神", meaning: "精神、心神" },
      { char: "清", meaning: "清明、不混浊" },
    ],
    interpretation:
      "心安静下来，精神就清明；精神清明了，智慧自然浮现。许多「想不通」，本质上是「心太吵」。",
    psychologyAnalysis:
      "与正念研究吻合：短短 10 分钟的静心，能显著降低前额叶皮层的「默认模式网络」过度激活——也就是我们俗称的「胡思乱想」。",
    applicationScenarios: [
      "思绪像乱麻、做不出决定时",
      "睡前脑子停不下来时",
      "需要做重要判断前",
    ],
    tags: ["正念", "睡眠", "决策"],
  },
  {
    id: "aph_012",
    content: "一念放下，万般自在",
    source: "佛家语",
    category: "classical",
    annotations: [
      { char: "一念", meaning: "一个念头" },
      { char: "自在", meaning: "自由、轻松" },
    ],
    interpretation:
      "放下一个执着的念头，就能换来万般轻松。束缚我们的从来不是事情本身，而是紧紧抓住事情的那只手。",
    psychologyAnalysis:
      "ACT（接纳承诺疗法）把这称为「认知解离」——你不是你的想法。把「我失败了」看作一个思维，而不是一个事实，痛苦会立即松动。",
    applicationScenarios: [
      "反复琢磨过去某件事无法放下时",
      "对某个人/某个结果执念过深时",
      "发现自己在与一个想法「较劲」时",
    ],
    tags: ["认知解离", "放下"],
  },
  {
    id: "aph_013",
    content: "祸兮福之所倚，福兮祸之所伏",
    source: "《道德经·第五十八章》",
    category: "classical",
    annotations: [
      { char: "倚", meaning: "依靠、紧挨着" },
      { char: "伏", meaning: "潜藏" },
    ],
    interpretation:
      "灾祸中常依傍着福气，福气中常潜藏着灾祸。事情从来不是它当下的样子，一切都在流动中。",
    psychologyAnalysis:
      "认知重构的经典范式：一件事的好坏取决于时间尺度与评价框架。短期的坏事常是长期的种子，这种视角本身就是一种心理弹性。",
    applicationScenarios: [
      "遭遇挫折、裁员、感情变故时",
      "一帆风顺反而不安时",
      "被单一事件定义心情时",
    ],
    tags: ["认知重构", "心理弹性"],
  },
  {
    id: "aph_014",
    content: "仰不愧于天，俯不怍于人",
    source: "《孟子·尽心上》",
    category: "classical",
    annotations: [
      { char: "怍", meaning: "惭愧" },
    ],
    interpretation:
      "抬头看天无愧于心，低头见人无愧于心。做人的安稳感，最终建立在自我一致之上。",
    psychologyAnalysis:
      "自我一致性（self-congruence）是自尊的根基。当行为与价值观一致，人不需要外部肯定也能安定——这比任何「自我肯定练习」都更深层。",
    applicationScenarios: [
      "在利益诱惑前摇摆时",
      "做了让自己不舒服的妥协后",
      "重新确认自己价值方向时",
    ],
    tags: ["价值观", "自我一致"],
  },
  {
    id: "aph_015",
    content: "此心安处是吾乡",
    source: "苏轼《定风波·南海归赠王定国侍人寓娘》",
    category: "poetry",
    annotations: [
      { char: "吾乡", meaning: "我的故乡、归宿" },
    ],
    interpretation:
      "心安稳的地方，就是我的故乡。所谓归宿，不在一个地方，而在一种状态。",
    psychologyAnalysis:
      "内在的「心理家园感」（psychological home）被研究证实对抗焦虑有显著作用。它不依赖外部条件，是可以内建的资源。",
    applicationScenarios: [
      "漂泊、迁居、缺乏归属感时",
      "感到「没有一个地方是我的」时",
      "向外寻找安全感却总落空时",
    ],
    tags: ["安全感", "归属"],
  },
  {
    id: "aph_016",
    content: "世事洞明皆学问，人情练达即文章",
    source: "《红楼梦》",
    category: "classical",
    annotations: [
      { char: "洞明", meaning: "看得透彻" },
      { char: "练达", meaning: "熟练通达" },
    ],
    interpretation:
      "世间的事看明白了都是学问，人情世故处理好了都是文章。生活本身就是最大的修行场。",
    psychologyAnalysis:
      "把「日常琐事」重新框定为「技能训练」，可显著减少「生活消耗感」。同一件事，是负担还是练习，由命名决定。",
    applicationScenarios: [
      "感到「每天都在处理烦人小事」时",
      "觉得生活没有意义、只是在消耗时",
      "想让平凡日子有「成长感」时",
    ],
    tags: ["意义重构", "成长"],
  },
  {
    id: "aph_017",
    content: "海纳百川，有容乃大",
    source: "林则徐联",
    category: "modern",
    annotations: [
      { char: "纳", meaning: "接纳、容纳" },
      { char: "乃", meaning: "才能" },
    ],
    interpretation:
      "大海接纳所有的河流，正因为它能容纳，所以才成其为大。容量，就是力量。",
    psychologyAnalysis:
      "接纳不等于认同。高容量的心理结构允许相反的情绪、矛盾的想法同时存在——这正是心理成熟的核心标志。",
    applicationScenarios: [
      "难以接受自己「不该有」的情绪时",
      "在矛盾想法之间撕裂时",
      "想扩大自己的心理承载力时",
    ],
    tags: ["接纳", "心理韧性"],
  },
  {
    id: "aph_018",
    content: "岂能尽如人意，但求无愧我心",
    source: "刘伯温诗",
    category: "classical",
    annotations: [
      { char: "尽", meaning: "全部" },
      { char: "愧", meaning: "有愧、亏欠" },
    ],
    interpretation:
      "怎么可能让所有人都满意，只求对得起自己的本心。放下讨好的冲动，回到内在标准。",
    psychologyAnalysis:
      "对应「讨好型人格」的解药：把评价权从「他人」迁回「自己」。这不是自私，而是一种必要的心理边界建设。",
    applicationScenarios: [
      "为「没让别人满意」自责时",
      "反复复盘「我是不是说错了什么」时",
      "想建立健康的自我边界时",
    ],
    tags: ["边界", "自我价值"],
  },
  {
    id: "aph_019",
    content: "人这一生，不过是过往云烟",
    source: "现代哲思",
    category: "modern",
    annotations: [
      { char: "云烟", meaning: "容易消散的事物" },
    ],
    interpretation:
      "拉长视角看，大多数让我们耿耿于怀的事，几年后根本记不起来。",
    psychologyAnalysis:
      "「时间旅行」是认知行为疗法的简单有效技术：把现在的事放到 5 年、10 年后再看，情绪权重会自然下降。",
    applicationScenarios: [
      "为一次争吵、一次失误反复回放时",
      "想从当下的情绪中抽离时",
      "被「面子」压力困住时",
    ],
    tags: ["时间视角", "情绪调节"],
  },
  {
    id: "aph_020",
    content: "活在当下",
    source: "现代心理学·正念",
    category: "modern",
    annotations: [
      { char: "当下", meaning: "此时此刻" },
    ],
    interpretation:
      "过去已经过去，未来尚未到来，唯一真实存在的只有此刻。把注意力带回来，生活才真正开始。",
    psychologyAnalysis:
      "正念的基石。研究显示：人平均 47% 的时间处于「走神」，而走神与不快乐高度相关。把注意力拉回当下，本身就是一种治疗。",
    applicationScenarios: [
      "陷入对过去的反刍时",
      "对未来的灾难化想象时",
      "吃饭、走路、洗澡时感到心不在此处",
    ],
    tags: ["正念", "当下"],
  },
  {
    id: "aph_021",
    content: "做最好的自己，比成为任何人都重要",
    source: "现代哲思",
    category: "modern",
    annotations: [],
    interpretation:
      "比较是快乐的终点。把目光从「别人如何」转回「我自己在成长」，内耗会自然消散。",
    psychologyAnalysis:
      "社会比较理论表明：向上比较带来焦虑，向下比较带来虚假的优越。只有「与昨天的自己比」是真正有建设性的参照系。",
    applicationScenarios: [
      "刷朋友圈感到焦虑时",
      "看到同龄人「成功」陷入自我怀疑时",
      "想找到健康的动力来源时",
    ],
    tags: ["自我比较", "成长"],
  },
  {
    id: "aph_022",
    content: "所有的焦虑，都来自对无法控制的事的执着",
    source: "现代哲思",
    category: "modern",
    annotations: [],
    interpretation:
      "试图控制无法控制的东西，就是焦虑的配方。辨认哪些归你管、哪些不归你管，焦虑会显著减轻。",
    psychologyAnalysis:
      "斯多葛哲学与接纳承诺疗法的核心一致：能量应全部投给「可影响区」，而不是「关注区」。这个划分本身就是疗愈。",
    applicationScenarios: [
      "为他人的情绪、决定焦虑时",
      "为未知的未来反复推演时",
      "想找到焦虑的根源时",
    ],
    tags: ["焦虑", "控制感"],
  },
  {
    id: "aph_023",
    content: "情绪是信使，不是主人",
    source: "现代心理学",
    category: "modern",
    annotations: [],
    interpretation:
      "情绪是在告诉你一些信息——身体的、关系的、价值的。听它说，但不被它指挥。",
    psychologyAnalysis:
      "情绪智力的关键：允许情绪存在，同时保留行动的选择权。这正是「情绪调节」与「压抑」的根本区别。",
    applicationScenarios: [
      "被强烈情绪驱使想冲动行事时",
      "想「消灭」某种负面情绪时",
      "练习与情绪共处时",
    ],
    tags: ["情绪调节", "自我觉察"],
  },
  {
    id: "aph_024",
    content: "能休即休，能了即了",
    source: "《菜根谭》",
    category: "classical",
    annotations: [
      { char: "休", meaning: "停下" },
      { char: "了", meaning: "了结、放下" },
    ],
    interpretation:
      "能停下的就停下，能了结的就了结。不要无谓地延长一件已经失效的事。",
    psychologyAnalysis:
      "「沉没成本谬误」的古典解药。大量焦虑来自「舍不得停」的事——关系、工作、想法。按停止键，本身是一种能力。",
    applicationScenarios: [
      "明知不合适却放不下时",
      "一个话题/反刍已经无意义了却停不下时",
      "做决定「是否该停」时",
    ],
    tags: ["决策", "放下"],
  },
];
