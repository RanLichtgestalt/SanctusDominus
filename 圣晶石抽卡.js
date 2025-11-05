// ==UserScript==
// @name         FGO抽卡卡池
// @author       米线。修改者：RR
// @version      1.2.0
// @description  在米线老师的通用抽卡系统模板下，修改完成的FGO卡池，包含大部分礼装和从者
// @timestamp    1672066028
// @license      Apache-2
// @homepageURL  https://github.com/sealdice/javascript
// ==/UserScript==

// ================================
// 配置区域 - 修改这里来创建不同的抽卡池
// ================================

// 扩展基本信息
const CONFIG = {
  // 扩展ID - 必须唯一，用于区分不同的抽卡池
  EXT_ID: 'FGO抽卡卡池',
  // 扩展显示名称
  EXT_NAME: 'FGO卡池',
  // 作者
  AUTHOR: '米线、RR',
  // 版本
  VERSION: '1.2.0',
  
  // 存储键名 - 必须唯一，避免与其他抽卡池冲突
  STORAGE_KEY: 'universalGachaData',
  
  // 卡池名称，用于显示
  POOL_NAME: 'FGO卡池',
  
  // 单抽命令名称
  SINGLE_CMD: '圣晶石单抽',
  // 十连命令名称  
  MULTI_CMD: '圣晶石十连',
  // 信息命令名称
  INFO_CMD: '查询保底次数',
  // 重置命令名称
  RESET_CMD: '重置保底',
  // 帮助命令名称
  HELP_CMD: '圣晶石抽卡help',
  // 权限检查命令名称
  PERM_CMD: '圣晶石抽卡权限',
  
  // 单抽文案模板
  SINGLE_TEXT: '{player}使用3颗圣晶石，从卡池中获得：\n{result}',
  // 十连文案模板  
  MULTI_TEXT: '{player}使用30颗圣晶石，从卡池中获得：\n{results}',
  
  // 保底配置
  PITY_CONFIG: {
    BASE_RATE: 0.004,        // 基础SSR概率 0.4%
    PITY_MAX: 330,            // 多少抽必出SSR
  },
  
  // 稀有度概率分布
  RARITY_RATES: {
    SR: 0.06,    // SR概率 6% (包含SSR概率)
    R: 0.36,     // R概率 30% (包含SR概率)
    N: 1.00      // N概率 64% (剩余概率)
  }
};

// 卡牌池配置 - 修改这里添加你的卡牌
const CARD_POOLS = {
  N: [
    "★ 阿拉什<Archer>",
    "★ 沃尔夫冈・阿马德乌斯・莫扎特<Caster>",
    "★ 佐佐木小次郎<Assassin>",
    "★ 玛塔・哈丽<Assassin>",
    "★ 斯巴达克斯<Berserker>",
    "★ 阿斯忒里俄斯<Berserker>",
    "★ 保罗・班扬<Berserker>",
    "★ 伊阿宋<Saber>",
    "★ 巴沙洛缪・罗伯茨<Rider>",
    "★ 夏洛特・科黛<Assassin>",
    "★ 织田信胜<Archer>",
    "★ 玛丽・安宁<Lancer>",
    "3★ 礼装：Azoth剑",
    "3★ 礼装：伪臣之书",
    "3★ 礼装：青之黑键",
    "3★ 礼装：绿之黑键",
    "3★ 礼装：赤之黑键",
    "3★ 礼装：凛的吊坠",
    "3★ 礼装：魔导书",
    "3★ 礼装：龙脉",
    "3★ 礼装：魔术矿石",
    "3★ 礼装：芦苇海",
    "3★ 礼装：符文石",
    "3★ 礼装：扬帆远航",
    "3★ 礼装：魔猪",
    "3★ 礼装：时钟塔",
    "3★ 礼装：柳洞寺",
    "3★ 礼装：魔力汁",
    "3★ 礼装：爱之灵药",
    "3★ 礼装：白鹤骑士",
    "3★ 礼装：阿兰若",
    "3★ 礼装：摩托・装甲骑兵",
    "3★ 礼装：狮子玩偶",
    "3★ 礼装：鲁格的光环",
    "3★ 礼装：波涛之兽",
    "3★ 礼装：自我强制证文",
    "3★ 礼装：四枝之浅滩",
    "3★ 礼装：逝去之梦",
    "3★ 礼装：特辣麻婆豆腐",
    "3★ 礼装：宝石剑泽尔里奇",
    "3★ 礼装：卡姆兰之战",
    "3★ 礼装：佛拉格拉克",
    "3★ 礼装：天之逆月",
    "3★ 礼装：许德拉匕首",
    "3★ 礼装：奇迹求道者",
    "3★ 礼装：固有结界",
    "3★ 礼装：返老还童的灵药",
    "3★ 礼装：谜之面具群",
    "3★ 礼装：自由业者",
    "3★ 礼装：瓦砾的圣堂",
    "3★ 礼装：手无寸铁慎二君",
    "3★ 礼装：阿特拉斯院",
    "3★ 礼装：幻想种",
    "3★ 礼装：神造兵器",
    "3★ 礼装：噬魂",
    "3★ 礼装：睿智之光",
    "3★ 礼装：樱的特制便当",
    "3★ 礼装：深闺丽人",
    "3★ 礼装：那日之后",
    "3★ 礼装：崇高的碎片",
    "3★ 礼装：黄金树的系谱",
    "3★ 礼装：神之舌",
    "3★ 礼装：匮乏之人",
    "3★ 礼装：不会枯萎的花",
    "3★ 礼装：唯信吾神",
    "3★ 礼装：穗群原学园学生会长",
    "3★ 礼装：龙种"
  ],
  R: [
    "★★★ 盖乌斯・尤利乌斯・恺撒<Saber>",
    "★★★ 吉尔・德・雷<Saber>",
    "★★★ 罗宾汉<Archer>",
    "★★★ 尤瑞艾莉<Archer>",
    "★★★ 库・丘林<Lancer>",
    "★★ 武藏坊弁庆<Lancer>",
    "★★★ 库・丘林〔Prototype〕<Lancer>",
    "★★ 列奥尼达一世<Lancer>",
    "★★★ 罗穆路斯<Lancer>",
    "★★★ 美杜莎<Rider>",
    "★★ 乔尔乔斯<Rider>",
    "★★ 爱德华・蒂奇<Rider>",
    "★★★ 布狄卡<Rider>",
    "★★★ 牛若丸<Rider>",
    "★★ 帕里斯<Archer>",
    "★★ 加雷斯<Lancer>",
    "★★ 陈宫<Caster>",
    "★★ 莎乐美<Berserker>",
    "★★★ 冈田以藏<Assassin>",
    "★★★ 赤兔马<Rider>",
    "★★★ 威廉・退尔<Archer>",
    "★★★ 阿斯克勒庇俄斯<Caster>",
    "★★★ 森长可<Berserker>",
    "★★★ 曼迪卡尔多<Rider>",
    "★★★ 张角<Caster>",
    "★★★ 徐福<Alterego>",
    "★★★ 杉谷善住坊<Archer>",
    "★★★ 忒修斯<Saber>",
    "4★ 礼装：钢之锻炼",
    "4★ 礼装：原始咒术",
    "4★ 礼装：投影魔术",
    "4★ 礼装：Gandr",
    "4★ 礼装：绿之破音",
    "4★ 礼装：宝石魔术・对影",
    "4★ 礼装：秉持优雅",
    "4★ 礼装：虚数魔术",
    "4★ 礼装：天之晚餐",
    "4★ 礼装：天使之诗",
    "4★ 礼装：封印制定 执行者",
    "4★ 礼装：抹大拉的圣骸布",
    "4★ 礼装：一之太刀",
    "4★ 礼装：骑士的矜持",
    "4★ 礼装：死灵魔术",
    "4★ 礼装：觉醒的意志",
    "4★ 礼装：千年黄金树",
    "4★ 礼装：记录保持者",
    "4★ 礼装：毒蛇一艺",
    "4★ 礼装：死之艺术",
    "4★ 礼装：柔软的慈爱",
    "4★ 礼装：情窦未开的千金",
    "4★ 礼装：援护射击",
    "4★ 礼装：私室警备员",
    "4★ 礼装：最后的叙述者",
    "4★ 礼装：清扫者",
    "4★ 礼装：远方的前路",
    "4★ 礼装：狂舞曲",
    "4★ 礼装：野心的嚆矢",
    "4★ 礼装：韵律诗节",
    "4★ 礼装：王者的气质",
    "4★ 礼装：宝石的魔弹",
    "4★ 礼装：虚数属性",
    "4★ 礼装：愿望之容器",
    "4★ 礼装：冬之结晶",
    "4★ 礼装：庭院的守护者",
    "4★ 礼装：花之乐土",
    "4★ 礼装：告解之迷茫地",
    "4★ 礼装：投影装填",
    "4★ 礼装：夙愿的继承",
    "4★ 礼装：代价魔术",
    "4★ 礼装：猎人之梦",
    "4★ 礼装：免许皆传",
    "4★ 礼装：圣职者的晚餐",
    "4★ 礼装：Ehre-Gandr",
    "4★ 礼装：赤色庶胤之梦",
    "4★ 礼装：八叉之血脉",
    "4★ 礼装：空白的男人",
    "4★ 礼装：天生的捕食者",
    "4★ 礼装：雾中情景",
    "4★ 礼装：紫烟的追忆",
    "4★ 礼装：凡俗之刃",
    "4★ 礼装：慎二坦克出击！",
    "4★ 礼装：逃避的起点",
    "4★ 礼装：虚假的誓约",
    "4★ 礼装：魔术师杀手的武器",
    "4★ 礼装：指令吟唱"
  ],
  SR: [
    "★★★★ 齐格飞<Saber>",
    "★★★★ 阿尔托莉雅・潘德拉贡〔Lily〕<Saber>",
    "★★★★ 尼禄・克劳狄乌斯<Saber>",
    "★★★★ 骑士迪昂<Saber>",
    "★★★★ 卫宫<Archer>",
    "★★★★ 阿塔兰忒<Archer>",
    "★★★★ 伊丽莎白・巴托里<Lancer>",
    "★★★★ 玛丽・安托瓦内特<Rider>",
    "★★★★ 玛尔达<Rider>",
    "★★★★ 斯忒诺<Assassin>",
    "★★★★ 卡米拉<Assassin>",
    "★★★★ 赫拉克勒斯<Berserker>",
    "★★★★ 兰斯洛特<Berserker>",
    "★★★★ 玉藻猫<Berserker>",
    "★★★★ 安妮・伯妮＆玛莉・瑞德<Rider>",
    "★★★★ 美狄亚〔Lily〕<Caster>",
    "★★★★ 童谣<Caster>",
    "★★★★ 弗兰肯斯坦<Berserker>",
    "★★★★ 芬恩・麦克库尔<Lancer>",
    "★★★★ 贝奥武夫<Berserker>",
    "★★★★ 阿斯托尔福<Rider>",
    "★★★★ 海伦娜・布拉瓦茨基<Caster>",
    "★★★★ 罗摩<Saber>",
    "★★★★ 托马斯・爱迪生<Caster>",
    "★★★★ 卫宫〔Assassin〕<Assassin>",
    "★★★★ 茨木童子<Berserker>",
    "★★★★ 尼托克丽丝<Caster>",
    "★★★★ 兰斯洛特<Saber>",
    "★★★★ 崔斯坦<Archer>",
    "★★★★ 高文<Saber>",
    "★★★★ 弗拉德三世〔EXTRA〕<Lancer>",
    "★★★★ 吉尔伽美什<Caster>",
    "★★★★ 美杜莎<Lancer>",
    "★★★★ 戈耳工<Avenger>",
    "★★★★ 卫宫〔Alter〕<Archer>",
    "★★★★ 黑森・罗伯<Avenger>",
    "★★★★ 燕青<Assassin>",
    "★★★★ 铃鹿御前<Saber>",
    "★★★★ 彭忒西勒亚<Berserker>",
    "★★★★ 武则天<Assassin>",
    "★★★★ 帕尔瓦蒂<Lancer>",
    "★★★★ 巴御前<Archer>",
    "★★★★ 望月千代女<Assassin>",
    "★★★★ 柳生但马守宗矩<Saber>",
    "★★★★ 加藤段藏<Assassin>",
    "★★★★ 喀耳刻<Caster>",
    "★★★★ 哪吒<Lancer>",
    "★★★★ 示巴女王<Caster>",
    "★★★★ 浅上藤乃<Archer>",
    "★★★★ 阿塔兰忒〔Alter〕<Berserker>",
    "★★★★ 瓦尔基里<Lancer>",
    "★★★★ 迪尔姆德・奥迪那<Saber>",
    "★★★★ 兰陵王<Saber>",
    "★★★★ 秦良玉<Lancer>",
    "★★★★ 虞美人<Assassin>",
    "★★★★ 美游・艾德费尔特<Caster>",
    "★★★★ 阿斯特赖亚<Ruler>",
    "★★★★ 拉克什米・芭伊<Saber>",
    "★★★★ 马嘶<Archer>",
    "★★★★ 渡边纲<Saber>",
    "★★★★ 凯妮斯<Lancer>",
    "★★★★ 鬼女红叶<Berserker>",
    "★★★★ 芝诺比阿<Archer>",
    "★★★★ 珀西瓦尔<Lancer>",
    "★★★★ 宇见津绘里濑<Lancer>",
    "★★★★ 斋藤一<Saber>",
    "★★★★ 多布雷尼亚・尼基季奇<Rider>",
    "★★★★ 赫费斯提翁<Pretender>",
    "★★★★ 罗兰<Saber>",
    "★★★★ 黄飞虎<Rider>",
    "★★★★ 特拉洛克<Pretender>",
    "★★★★ 耀星哈桑<Assassin>",
    "★★★★ 黑姬<Saber>",
    "★★★★ 喀戎<Archer>",
    "★★★★ 酒吞童子<Caster>",
    "★★★★ 灾星简<Archer>",
    "5★ 礼装：元素转换",
    "5★ 礼装：虚数环",
    "5★ 礼装：限制/零毁",
    "5★ 礼装：万华镜",
    "5★ 礼装：天之杯",
    "5★ 礼装：宇宙棱镜",
    "5★ 礼装：黑之圣杯",
    "5★ 礼装：月之胜利者",
    "5★ 礼装：另一个结局",
    "5★ 礼装：2020年碎片",
    "5★ 礼装：五百年的执着",
    "5★ 礼装：圣者凭依之躯",
    "5★ 礼装：理想的王圣",
    "5★ 礼装：月灵髓液",
    "5★ 礼装：觉醒之前",
    "5★ 礼装：起源弹",
    "5★ 礼装：魔性菩萨",
    "5★ 礼装：艳阳之下",
    "5★ 礼装：阿特拉斯的婴儿",
    "5★ 礼装：火炎伯爵",
    "5★ 礼装：黄昏的王圣",
    "5★ 礼装：祈祷救济之人",
    "5★ 礼装：黑魔术",
    "5★ 礼装：恋之诅咒",
    "5★ 礼装：重责者孤寂于此",
    "5★ 礼装：魔道元帅",
    "5★ 礼装：冬之圣女",
    "5★ 礼装：幻想公主",
    "5★ 礼装：五大元素使",
    "5★ 礼装：炽天之王",
    "5★ 礼装：逆堕之泥雨",
    "5★ 礼装：羽化之森",
    "5★ 礼装：忏悔之箱",
    "5★ 礼装：残花的迷宫",
    "5★ 礼装：奥尔良之羊",
    "5★ 礼装：未至不死之人",
    "5★ 礼装：月海原学园之王",
    "5★ 礼装：法悦净土",
    "5★ 礼装：矿石科的君主",
    "5★ 礼装：枯涸的拳",
    "5★ 礼装：固有时制御",
    "5★ 礼装：天之裂谷",
    "5★ 礼装：神秘の解体"
  ],
  SSR: [
    "★★★★★ 阿尔托莉雅・潘德拉贡<Saber>",
    "★★★★★ 阿蒂拉<Saber>",
    "★★★★★ 吉尔伽美什<Archer>",
    "★★★★★ 诸葛孔明〔埃尔梅罗Ⅱ世〕<Caster>",
    "★★★★★ 坂田金时<Berserker>",
    "★★★★★ 弗拉德三世<Berserker>",
    "★★★★★ 贞德<Ruler>",
    "★★★★★ 俄里翁<Archer>",
    "★★★★★ 玉藻前<Caster>",
    "★★★★★ 弗朗西斯・德雷克<Rider>",
    "★★★★★ 冲田总司<Saber>",
    "★★★★★ 斯卡哈<Lancer>",
    "★★★★★ 开膛手杰克<Assassin>",
    "★★★★★ 莫德雷德<Saber>",
    "★★★★★ 尼古拉・特斯拉<Archer>",
    "★★★★★ 阿周那<Archer>",
    "★★★★★ 迦尔纳<Lancer>",
    "★★★★★ 谜之女主角X<Assassin>",
    "★★★★★ 布伦希尔德<Lancer>",
    "★★★★★ 两仪式<Saber>",
    "★★★★★ 尼禄・克劳狄乌斯〔新娘〕<Saber>",
    "★★★★★ 天草四郎<Ruler>",
    "★★★★★ 岩窟王<Avenger>",
    "★★★★★ 南丁格尔<Berserker>",
    "★★★★★ 女王梅芙<Rider>",
    "★★★★★ 贞德〔Alter〕<Avenger>",
    "★★★★★ 伊斯坎达尔<Rider>",
    "★★★★★ 酒吞童子<Assassin>",
    "★★★★★ 玄奘三藏<Caster>",
    "★★★★★ 源赖光<Berserker>",
    "★★★★★ 奥斯曼狄斯<Rider>",
    "★★★★★ 莱昂纳多・达・芬奇<Caster>",
    "★★★★★ 伊莉雅丝菲尔・冯・爱因兹贝伦<Caster>",
    "★★★★★ 克娄巴特拉<Assassin>",
    "★★★★★ 伊什塔尔<Archer>",
    "★★★★★ 恩奇都<Lancer>",
    "★★★★★ 魁札尔・科亚特尔<Rider>",
    "★★★★★ 梅林<Caster>",
    "★★★★★ 宫本武藏<Saber>",
    "★★★★★ “山中老人”<Assassin>`",
    "★★★★★ 土方岁三<Berserker>",
    "★★★★★ 杀生院祈荒<Alterego>",
    "★★★★★ 山鲁佐德<Caster>",
    "★★★★★ 夏洛克・福尔摩斯<Ruler>",
    "★★★★★ 刑部姬<Assassin>",
    "★★★★★ 阿比盖尔・威廉姆斯<Foreigner>",
    "★★★★★ 埃列什基伽勒<Lancer>",
    "★★★★★ 葛饰北斋<Foreigner>",
    "★★★★★ 塞弥拉弥斯<Assassin>",
    "★★★★★ 阿纳斯塔西娅<Caster>",
    "★★★★★ 伊凡雷帝<Rider>",
    "★★★★★ 志度内<Alterego>",
    "★★★★★ 阿喀琉斯<Rider>",
    "★★★★★ 冲田总司〔Alter〕/炼狱Alter<Alterego>",
    "★★★★★ 拿破仑<Archer>",
    "★★★★★ 齐格鲁德<Saber>",
    "★★★★★ 斯卡哈・斯卡蒂<Caster>",
    "★★★★★ 项羽<Berserker>",
    "★★★★★ 布拉达曼特<Lancer>",
    "★★★★★ 红阎魔<Saber>",
    "★★★★★ 李书文<Assassin>",
    "★★★★★ 紫式部<Caster>",
    "★★★★★ Kingprotea<Alterego>",
    "★★★★★ 迦摩<Assassin>",
    "★★★★★ 司马懿〔莱妮丝〕<Rider>",
    "★★★★★ 伟大的石像神<MoonCancer>",
    "★★★★★ 阿周那〔Alter〕<Berserker>",
    "★★★★★ 织田信长<Avenger>",
    "★★★★★ 莱昂纳多・达・芬奇<Rider>",
    "★★★★★ 阿斯托尔福<Saber>",
    "★★★★★ 超人俄里翁<Archer>",
    "★★★★★ 欧罗巴<Rider>",
    "★★★★★ 杨贵妃<Foreigner>",
    "★★★★★ 清少纳言<Archer>",
    "★★★★★ 奥德修斯<Rider>",
    "★★★★★ 狄俄斯库里<Saber>",
    "★★★★★ 罗穆路斯・奎里努斯<Lancer>",
    "★★★★★ 旅行者<Foreigner>",
    "★★★★★ 阿尔托莉雅・卡斯特<Caster>",
    "★★★★★ 梵高<Foreigner>",
    "★★★★★ 芦屋道满<Alterego>",
    "★★★★★ 尼莫<Rider>",
    "★★★★★ 卑弥呼<Ruler>",
    "★★★★★ 伊吹童子<Saber>",
    "★★★★★ 弗栗多<Lancer>",
    "★★★★★ 伽拉忒亚<Berserker>",
    "★★★★★ 太公望<Rider>",
    "★★★★★ 源为朝<Archer>",
    "★★★★★ 尼托克丽丝〔Alter〕<Avenger>",
    "★★★★★ 果心居士<Assassin>",
    "★★★★★ 娄希<Berserker>",
    "★★★★★ 库库尔坎<Foreigner>",
    "★★★★★ 特斯卡特利波卡<Assassin>"
  ]
};

// UP卡牌配置 - 修改这里设置UP卡牌
const UP_CARDS = {
  // 格式: [卡牌完整名称, 权重倍数]
  SR: [
    ["5★ 礼装：天之裂谷", 2],
    ["4★ 礼装：钢之锻炼", 2]
  ],
  SSR: [
    ["★★★★★ 特斯卡特利波卡<Assassin>", 2],
    ["★★★★ 特拉洛克<Pretender>", 2]
  ]
};

// ================================
// 核心代码区域 - 一般不需要修改
// ================================

let ext = seal.ext.find(CONFIG.EXT_ID);
if (!ext) {
  ext = seal.ext.new(CONFIG.EXT_ID, CONFIG.AUTHOR, CONFIG.VERSION);
  seal.ext.register(ext);
}

// 获取群组ID
const getGroupId = (ctx) => {
  return ctx.group?.id || 'private_' + (ctx.player?.userId || 'default');
};

// 权限检查函数
const checkPermission = (ctx, requiredLevel = 50) => {
  // 权限等级说明：
  // 100: master
  // 60: owner
  // 50: admin
  // 40: inviter
  // 20: trusted
  // 0: normal
  // -30: banned
  
  if (ctx.privilegeLevel >= requiredLevel) {
    return { allowed: true, level: ctx.privilegeLevel };
  }
  
  return { allowed: false, level: ctx.privilegeLevel };
};

// 获取权限名称
const getPermissionName = (level) => {
  switch (level) {
    case 100:
      return "master";
    case 60:
      return "owner";
    case 50:
      return "admin";
    case 40:
      return "inviter";
    case 20:
      return "trusted";
    case 0:
      return "normal";
    case -30:
      return "banned";
    default:
      return `unknown (${level})`;
  }
};

// 权限检查命令
const cmdPerm = seal.ext.newCmdItemInfo();
cmdPerm.name = CONFIG.PERM_CMD;
cmdPerm.help = '查看当前用户的抽卡系统权限\n用法：.圣晶石抽卡权限';
cmdPerm.solve = (ctx, msg, cmdArgs) => {
  const perm = checkPermission(ctx, 0); // 只是检查，不限制
  const permName = getPermissionName(perm.level);
  
  let replyText = `🌙 ${CONFIG.POOL_NAME} - 权限信息\n\n`;
  replyText += `👤 用户：${ctx.player?.name || '未知'}\n`;
  replyText += `  • 权限等级：${perm.level} (${permName})\n\n`;
  
  replyText += `🎮 当前可用功能：\n`;
  replyText += `  • 抽卡功能：✅ 可用\n`;
  replyText += `  • 重置保底：${perm.level >= 50 ? '✅ 可用' : '❌ 需要admin权限'}\n`;
  
  seal.replyToSender(ctx, msg, replyText);
  return seal.ext.newCmdExecuteResult(true);
};

// 计算当前SSR概率
const calculateSSRProbability = (pityCount) => {
  const cfg = CONFIG.PITY_CONFIG;
  let baseProbability = cfg.BASE_RATE;
  
  if (pityCount >= cfg.PITY_START) {
    const additionalProbability = (pityCount - cfg.PITY_START) * cfg.RATE_INCREASE;
    baseProbability += additionalProbability;
  }
  
  return Math.min(baseProbability, 1.0);
};

// 构建权重映射
const buildWeightMap = () => {
  const weightMap = {};
  
  // 为每个稀有度构建权重数组
  for (const rarity of ['N', 'R', 'SR', 'SSR']) {
    const cards = CARD_POOLS[rarity];
    const upCardsList = UP_CARDS[rarity] || [];
    
    const weights = cards.map(card => {
      const upCard = upCardsList.find(up => up[0] === card);
      return upCard ? upCard[1] : 1;
    });
    
    weightMap[rarity] = { cards, weights };
  }
  
  return weightMap;
};

const weightMap = buildWeightMap();

// 从数组中随机选择一个元素，支持权重
const getWeightedRandomFromArray = (rarity) => {
  const { cards, weights } = weightMap[rarity];
  
  // 计算总权重
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  
  // 生成随机数
  let random = Math.random() * totalWeight;
  
  // 根据权重选择卡牌
  for (let i = 0; i < cards.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return cards[i];
    }
  }
  
  // 如果出现错误，返回随机卡牌
  return cards[Math.floor(Math.random() * cards.length)];
};

// 手动权重抽取
const manualWeightedDraw = (ctx, pityCount) => {
  const cfg = CONFIG.PITY_CONFIG;
  
  // 检查是否触发保底
  if (pityCount >= cfg.PITY_MAX - 1) {
    const result = getWeightedRandomFromArray("SSR");
    return {
      result: result,
      isSSR: true,
      pityCount: 0
    };
  }
  
  const currentProbability = calculateSSRProbability(pityCount);
  const roll = Math.random();
  
  // 检查是否概率抽中SSR
  if (roll < currentProbability) {
    const result = getWeightedRandomFromArray("SSR");
    return {
      result: result,
      isSSR: true,
      pityCount: 0
    };
  } else {
    // 普通抽取
    const rarityRoll = Math.random();
    let result;
    let rarity;
    
    if (rarityRoll < CONFIG.RARITY_RATES.SR) {
      result = getWeightedRandomFromArray("SR");
      rarity = "SR";
    } else if (rarityRoll < CONFIG.RARITY_RATES.R) {
      result = getWeightedRandomFromArray("R");
      rarity = "R";
    } else {
      result = getWeightedRandomFromArray("N");
      rarity = "N";
    }
    
    return {
      result: result,
      isSSR: false,
      pityCount: pityCount + 1,
      rarity: rarity
    };
  }
};

// 检查是否是UP卡牌
const isUpCard = (card, rarity) => {
  const upCardsList = UP_CARDS[rarity] || [];
  return upCardsList.some(up => up[0] === card && up[1] > 1);
};

// 获取UP卡牌权重
const getUpCardWeight = (card, rarity) => {
  const upCardsList = UP_CARDS[rarity] || [];
  const upCard = upCardsList.find(up => up[0] === card);
  return upCard ? upCard[1] : 1;
};

// 帮助命令 - 显示所有可用指令
const cmdHelp = seal.ext.newCmdItemInfo();
cmdHelp.name = CONFIG.HELP_CMD;
cmdHelp.help = `显示${CONFIG.POOL_NAME}的所有可用指令\n用法：.${CONFIG.HELP_CMD}`;
cmdHelp.solve = (ctx, msg, cmdArgs) => {
  let replyText = `🌙 ${CONFIG.POOL_NAME} - 抽卡系统帮助 🌙\n`;
  
  replyText += `概率设置：\n`;
  replyText += `  • 5★从者基础概率：${(CONFIG.PITY_CONFIG.BASE_RATE * 100).toFixed(2)}%\n`;
  replyText += `  • 4★从者与5★礼装概率：${(CONFIG.RARITY_RATES.SR * 100).toFixed(1)}%\n\n`;
  
  replyText += `保底机制：\n`;
  replyText += `  • ${CONFIG.PITY_CONFIG.PITY_MAX}抽必出5★从者\n`;
  
  replyText += `🎮 可用指令：\n`;
  replyText += `  • .${CONFIG.SINGLE_CMD} - 进行单次抽卡\n`;
  replyText += `  • .${CONFIG.MULTI_CMD} - 进行十连抽卡\n`;
  replyText += `  • .${CONFIG.INFO_CMD} - 查看当前保底信息\n`;
  replyText += `  • .${CONFIG.PERM_CMD} - 查看当前权限\n`;
  replyText += `  • .${CONFIG.RESET_CMD} - 重置保底计数（管理员专用）\n\n`;
  
  // 显示UP卡牌信息
  const hasUpCards = UP_CARDS.SSR.length > 0 || UP_CARDS.SR.length > 0;
  if (hasUpCards) {
    replyText += `✨ UP从者与礼装（概率提升）：\n`;
    if (UP_CARDS.SSR.length > 0) {
      replyText += `  • 从者：${UP_CARDS.SSR.map(card => `${card[0]}(${card[1]}倍)`).join("、")}\n`;
    }
    if (UP_CARDS.SR.length > 0) {
      replyText += `  • 礼装：${UP_CARDS.SR.map(card => `${card[0]}(${card[1]}倍)`).join("、")}\n`;
    }
    replyText += `\n`;
  }
  
  replyText += `💡 使用提示：\n`;
  replyText += `  • 保底计数按群组独立存储\n`;
  replyText += `  • UP从者和礼装在同稀有度中概率更高\n`;
  replyText += `  • 使用 .${CONFIG.PERM_CMD} 查看权限信息\n`;
  
  seal.replyToSender(ctx, msg, replyText);
  return seal.ext.newCmdExecuteResult(true);
};

// 单抽命令
const cmdSingle = seal.ext.newCmdItemInfo();
cmdSingle.name = CONFIG.SINGLE_CMD;
cmdSingle.help = `${CONFIG.POOL_NAME}单抽\n用法：.${CONFIG.SINGLE_CMD}`;
cmdSingle.solve = (ctx, msg, cmdArgs) => {
  const groupId = getGroupId(ctx);
  
  // 读取保底数据
  const data = JSON.parse(ext.storageGet(CONFIG.STORAGE_KEY) || '{}');
  if (!data[groupId]) {
    data[groupId] = { pityCount: 0, totalDraws: 0 };
  }
  
  const groupData = data[groupId];
  const currentPity = groupData.pityCount || 0;
  
  // 执行抽卡
  const drawResult = manualWeightedDraw(ctx, currentPity);
  
  // 更新数据
  groupData.pityCount = drawResult.pityCount;
  groupData.totalDraws = (groupData.totalDraws || 0) + 1;
  data[groupId] = groupData;
  ext.storageSet(CONFIG.STORAGE_KEY, JSON.stringify(data));
  
  // 构建回复消息
  let replyText = CONFIG.SINGLE_TEXT
    .replace('{player}', ctx.player?.name || '玩家')
    .replace('{result}', drawResult.result);
  
  replyText += `\n`;
  
  // 检查是否是UP卡牌
  const isUp = isUpCard(drawResult.result, drawResult.rarity);
  
  if (drawResult.isSSR) {
    replyText += `🎉 恭喜获得5★从者！`;
    if (isUp) {
      replyText += `✨ UP从者概率提升！`;
    }
    replyText += `\n保底计数已重置\n`;
  } else {
    const nextPity = drawResult.pityCount;
    const currentProb = (calculateSSRProbability(nextPity) * 100).toFixed(2);
    const cfg = CONFIG.PITY_CONFIG;
    
    replyText += `\n保底计数：${nextPity}/${cfg.PITY_MAX} | 当前5★从者概率：${currentProb}%`;
    if (isUp) {
      const weight = getUpCardWeight(drawResult.result, drawResult.rarity);
      replyText += `\n✨ UP从者概率提升${weight}倍！`;
    }
    
    // 提示信息
    if (nextPity >= cfg.PITY_START && nextPity < cfg.PITY_START + 10) {
      replyText += `\n💫 即将进入保底！`;
    } else if (nextPity >= cfg.PITY_START + 10 && nextPity < cfg.PITY_MAX - 1) {
      replyText += `\n✨ 5★从者概率大幅提升中！`;
    } else if (nextPity >= cfg.PITY_MAX - 1) {
      replyText += `\n🌟 下次必出5★从者！`;
    }
  }
  
  seal.replyToSender(ctx, msg, replyText);
  return seal.ext.newCmdExecuteResult(true);
};

// 十连命令
const cmdMulti = seal.ext.newCmdItemInfo();
cmdMulti.name = CONFIG.MULTI_CMD;
cmdMulti.help = `${CONFIG.POOL_NAME}十连\n用法：.${CONFIG.MULTI_CMD}`;
cmdMulti.solve = (ctx, msg, cmdArgs) => {
  const groupId = getGroupId(ctx);
  
  // 读取保底数据
  const data = JSON.parse(ext.storageGet(CONFIG.STORAGE_KEY) || '{}');
  if (!data[groupId]) {
    data[groupId] = { pityCount: 0, totalDraws: 0 };
  }
  
  const groupData = data[groupId];
  let currentPity = groupData.pityCount || 0;
  let totalSSR = 0;
  let upCardsCount = 0;
  const results = [];
  
  // 执行10次抽卡
  for (let i = 0; i < 10; i++) {
    const drawResult = manualWeightedDraw(ctx, currentPity);
    results.push(drawResult);
    currentPity = drawResult.pityCount;
    if (drawResult.isSSR) {
      totalSSR++;
    }
    
    // 统计UP卡牌
    if (isUpCard(drawResult.result, drawResult.rarity)) {
      upCardsCount++;
    }
  }
  
  // 更新数据
  groupData.pityCount = currentPity;
  groupData.totalDraws = (groupData.totalDraws || 0) + 10;
  data[groupId] = groupData;
  ext.storageSet(CONFIG.STORAGE_KEY, JSON.stringify(data));
  
  // 构建回复消息
  let resultsText = '';
  results.forEach((drawResult) => {
    const isUp = isUpCard(drawResult.result, drawResult.rarity);
    resultsText += isUp ? `✨ ${drawResult.result} ✨\n` : `${drawResult.result}\n`;
  });
  
  let replyText = CONFIG.MULTI_TEXT
    .replace('{player}', ctx.player?.name || '玩家')
    .replace('{results}', resultsText);
  
  replyText += `\n`;
  replyText += `十连结果：获得 ${totalSSR} 个5★从者！\n`;
  if (upCardsCount > 0) {
    replyText += `其中 ${upCardsCount} 张UP从者！\n`;
  }
  
  const cfg = CONFIG.PITY_CONFIG;
  const currentProb = (calculateSSRProbability(currentPity) * 100).toFixed(2);
  replyText += `保底计数：${currentPity}/${cfg.PITY_MAX} | 当前5★从者概率：${currentProb}%`;
  
  // 概率信息
  if (currentPity >= cfg.PITY_START) {
    if (currentPity >= cfg.PITY_START && currentPity < cfg.PITY_START + 10) {
      replyText += `\n💫 即将进入保底！`;
    } else if (currentPity >= cfg.PITY_START + 10 && currentPity < cfg.PITY_MAX - 1) {
      replyText += `\n✨ 5★从者概率大幅提升中！`;
    } else if (currentPity >= cfg.PITY_MAX - 1) {
      replyText += `\n🌟 下次必出5★从者！`;
    }
  }
  
  seal.replyToSender(ctx, msg, replyText);
  return seal.ext.newCmdExecuteResult(true);
};

// 查看保底信息命令
const cmdInfo = seal.ext.newCmdItemInfo();
cmdInfo.name = CONFIG.INFO_CMD;
cmdInfo.help = `查看${CONFIG.POOL_NAME}抽卡保底信息\n用法：.${CONFIG.INFO_CMD}`;
cmdInfo.solve = (ctx, msg, cmdArgs) => {
  const groupId = getGroupId(ctx);
  const data = JSON.parse(ext.storageGet(CONFIG.STORAGE_KEY) || '{}');
  const groupData = data[groupId] || { pityCount: 0, totalDraws: 0 };
  
  const pityCount = groupData.pityCount || 0;
  const totalDraws = groupData.totalDraws || 0;
  const currentProbability = (calculateSSRProbability(pityCount) * 100).toFixed(2);
  const cfg = CONFIG.PITY_CONFIG;
  
  let replyText = `🌙 ${CONFIG.POOL_NAME}抽卡信息\n`;
  replyText += `  • 保底计数：${pityCount}/${cfg.PITY_MAX}\n`;
  replyText += `  • 当前5★从者概率：${currentProbability}%\n`;
  replyText += `  • 总抽卡次数：${totalDraws}\n\n`;
  
  // 显示UP卡牌信息
  const hasUpCards = UP_CARDS.SSR.length > 0 || UP_CARDS.SR.length > 0;
  if (hasUpCards) {
    replyText += `✨ UP从者与礼装概率提升：\n`;
    if (UP_CARDS.SSR.length > 0) {
      replyText += `  从者: \n${UP_CARDS.SSR.map(card => `${card[0]}(${card[1]}倍)`).join(", ")}\n`;
    }
    if (UP_CARDS.SR.length > 0) {
      replyText += `  礼装: \n${UP_CARDS.SR.map(card => `${card[0]}(${card[1]}倍)`).join(", ")}`;
    }
    replyText += `\n\n`;
  }
  
  // 保底进度提示
  if (pityCount < cfg.PITY_START) {
    replyText += `💤 距离保底还有${cfg.PITY_START - pityCount}抽`;
  } else if (pityCount < cfg.PITY_MAX - 1) {
    const remaining = cfg.PITY_MAX - pityCount;
    replyText += `💫 ${remaining}抽后必出5★从者\n`;
  } else {
    replyText += `🌟 下次抽卡必出5★从者！`;
  }
  
  seal.replyToSender(ctx, msg, replyText);
  return seal.ext.newCmdExecuteResult(true);
};

// 重置保底命令（管理员专用）- 按照海豹权限系统重写
const cmdReset = seal.ext.newCmdItemInfo();
cmdReset.name = CONFIG.RESET_CMD;
cmdReset.help = `重置当前群组${CONFIG.POOL_NAME}保底计数（管理员专用）\n用法：.${CONFIG.RESET_CMD}`;
cmdReset.solve = (ctx, msg, cmdArgs) => {
  // 权限检查 - 需要admin(50)或以上权限
  const perm = checkPermission(ctx, 50);
  
  if (!perm.allowed) {
    const permName = getPermissionName(perm.level);
    seal.replyToSender(ctx, msg, `❌ 权限不足！需要admin(50)权限，当前权限：${perm.level} (${permName})`);
    return seal.ext.newCmdExecuteResult(true);
  }
  
  const groupId = getGroupId(ctx);
  const data = JSON.parse(ext.storageGet(CONFIG.STORAGE_KEY) || '{}');
  
  if (data[groupId]) {
    const oldPity = data[groupId].pityCount || 0;
    const oldTotal = data[groupId].totalDraws || 0;
    
    data[groupId].pityCount = 0;
    data[groupId].totalDraws = oldTotal; // 保持总抽数记录不变
    
    ext.storageSet(CONFIG.STORAGE_KEY, JSON.stringify(data));
    
    const permName = getPermissionName(perm.level);
    seal.replyToSender(ctx, msg, `✅ 已重置当前群组的${CONFIG.POOL_NAME}保底计数（${oldPity}→0）\n👤 操作者权限：${perm.level} (${permName})`);
  } else {
    seal.replyToSender(ctx, msg, `当前群组暂无${CONFIG.POOL_NAME}抽卡记录。`);
  }
  
  return seal.ext.newCmdExecuteResult(true);
};

// 注册命令
ext.cmdMap[CONFIG.HELP_CMD] = cmdHelp;
ext.cmdMap[CONFIG.PERM_CMD] = cmdPerm;
ext.cmdMap[CONFIG.SINGLE_CMD] = cmdSingle;
ext.cmdMap[CONFIG.MULTI_CMD] = cmdMulti;
ext.cmdMap[CONFIG.INFO_CMD] = cmdInfo;
ext.cmdMap[CONFIG.RESET_CMD] = cmdReset;

// 注册别名命令（可选）
ext.cmdMap['抽卡帮助'] = cmdHelp;
ext.cmdMap['抽卡权限'] = cmdPerm;
ext.cmdMap['单抽'] = cmdSingle;
ext.cmdMap['十连'] = cmdMulti;
ext.cmdMap['保底次数'] = cmdInfo;
ext.cmdMap['重置保底'] = cmdReset;