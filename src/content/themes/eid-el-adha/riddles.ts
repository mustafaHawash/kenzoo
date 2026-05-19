import { Station } from "@/types/station";
import { eidMissions } from "./missions";

export const eidRiddleStations: Station[] = [
    {
        id: "riddle-eid-001",

        type: "riddle",

        category: "wisdom",

        title: "🧠 لغز العيد",

        description: "لغز بسيط عن العيد.",

        theme: "eid-al-adha",

        mood: "mystery",

        difficulty: 2,

        targetAgeGroup: "adult",

        question: "شيء نسمعه في العيد ولا نراه؟",

        choices: ["التكبيرات", "أذان الفجر", "صوت الطيور", "أدعية العيد"],

        answer: "التكبيرات",

        hint: "الله أكبر، الله أكبر 📣",

        explanation:
            "التكبيرات هي الأصوات العالية التي نسمعها في العيد، وهي دليل على الفرح والشكر لله.",

        reward: {
            stars: 1,
            canUnlockTreasure: false,
        },

        tinyMissionPool: eidMissions,
    },

    // ========================================================================
    // القسم الأول: ألغاز سهلة وممتعة (Kids & Beginners) - Difficulty 1-2
    // الهدف: ألغاز محسوسة، بصرية، أو تعتمد على الملاحظة البسيطة.
    // ========================================================================

    {
        id: "riddle-kid-001",
        type: "riddle",
        category: "fun",
        title: "🌙 نور الليل",
        description: "لغز بسيط عن السماء",
        theme: "eid-al-adha",
        mood: "playful",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "شيء يتغير شكله كل ليلة، يضيء الظلام، ويراقب الأرض بهدوء؟",
        choices: ["الشمس", "القمر", "النجوم", "السحابة"],
        answer: "القمر",
        hint: "يظهر في هلال ثم يصبح بدراً 🌕",
        explanation:
            "القمر يتغير طوره كل شهر، وهو رفيقنا في ليالي العيد والسفر.",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },

    {
        id: "riddle-kid-002",
        type: "riddle",
        category: "fun",
        title: "🪡 عين بلا بصر",
        description: "لغز ذكاء يومي",
        theme: "eid-al-adha",
        mood: "mystery",
        difficulty: 2,
        targetAgeGroup: "kid",
        question: "شيء له عين ولا يرى، ويسبح في الماء ولا يغرق؟",
        choices: ["الإبرة", "السمكة", "العين الزرقاء", "القط"],
        answer: "الإبرة",
        hint: "تستخدمها أمك في الخياطة 🧵",
        explanation:
            "الإبرة تسمى 'العين' الثقب الذي يمر منه الخيط، وإذا سقطت في الماء تطفو لوزنها الخفيف.",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },

    {
        id: "riddle-adult-001",
        type: "riddle",
        category: "wisdom",
        title: "🕊️ نور بلا فتيل",
        description: "لغز قيمي وروحي",
        theme: "eid-al-adha",
        mood: "reflective",
        difficulty: 2,
        targetAgeGroup: "adult",
        question:
            "نور يضيء القلوب، ولا يحتاج لزيت ولا فتيل، يزداد بالذكر وينطفئ بالغفلة؟",
        choices: ["الإيمان", "المصباح", "الشمس", "النار"],
        answer: "الإيمان",
        hint: "سورة في القرآن تحمل اسمه 📖",
        explanation:
            "نور الإيمان يملأ الصدر بالطمأنينة والسكينة، ويقوى بالطاعات ويقرب القلب من الله.",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },

    // ========================================================================
    // القسم الثاني: ألغاز متوسطة وربط المعاني (Intermediate) - Difficulty 2-3
    // الهدف: ألغاز تتطلب تفكيراً، ربطاً بين الصور، أو فهمًا للقيم.
    // ========================================================================

    {
        id: "riddle-kid-003",
        type: "riddle",
        category: "social",
        title: "❤️ يزداد بالعطاء",
        description: "لغز عن المشاعر",
        theme: "eid-al-adha",
        mood: "cozy",
        difficulty: 2,
        targetAgeGroup: "kid",
        question:
            "شيء صغير الحجم، يفرح القلب جداً، ولا يزن كثيراً، لكنه أغلى من الألعاب؟",
        choices: ["الهدية", "الحلوى", "المال", "الهاتف"],
        answer: "الهدية",
        hint: "نقدمها في العيد مع ابتسامة 🎁",
        explanation:
            "الهدية ليست ثمنها، بل المعنى وراءها. تبادل الهدايا يزيد المحبة ويقرب القلوب.",
        reward: { stars: 1, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },

    {
        id: "riddle-adult-002",
        type: "riddle",
        category: "history",
        title: "🕋 بيت التوحيد",
        description: "لغز تاريخي وجغرافي",
        theme: "eid-al-adha",
        mood: "mystery",
        difficulty: 3,
        targetAgeGroup: "adult",
        question:
            "بيت قديم، ليس له سقف للزوار، ولا أبواب تُفتح باليد، لكن الدنيا كلها تتجه إليه كل يوم؟",
        choices: [
            "الكعبة المشرفة",
            "المسجد الأقصى",
            "برج إيفل",
            "البيت الأبيض",
        ],
        answer: "الكعبة المشرفة",
        hint: "قبلة المسلمين في الصلوات الخمس 🧭",
        explanation:
            "الكعبة هي بيت الله الحرام في مكة، يتجه إليها المسلمون في صلاتهم ويحجون إليها امتثالاً لأمر الله.",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },

    {
        id: "riddle-adult-003",
        type: "riddle",
        category: "wisdom",
        title: "⏳ يسير ولا يعود",
        description: "لغز وجودي",
        theme: "eid-al-adha",
        mood: "reflective",
        difficulty: 3,
        targetAgeGroup: "adult",
        question:
            "شيء يمشي بلا أقدام، لا ينتظر أحداً، ولا يعود أبداً، وهو أغلى ما نملك؟",
        choices: ["الوقت", "الهواء", "المال", "السمعة"],
        answer: "الوقت",
        hint: "لا يُشترى ولا يُرد إذا فات 🕰️",
        explanation:
            "الوقت هو رأس مال الإنسان. استثماره في الطاعة والبر والعلم هو أعظم مكسب في الدنيا والآخرة.",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },

    // ========================================================================
    // القسم الثالث: ألغاز صعبة ومعقدة (Expert/Legend) - Difficulty 4
    // الهدف: ألغاز منطقية، لغوية، أو تتطلب استنتاجاً دقيقاً.
    // ========================================================================

    {
        id: "riddle-kid-004",
        type: "riddle",
        category: "fun",
        title: "🌧️ ابن الماء",
        description: "لغز علمي بسيط",
        theme: "eid-al-adha",
        mood: "mystery",
        difficulty: 3, // تحدي ذكي للأطفال
        targetAgeGroup: "kid",
        question: "أنا ابن الماء، وإذا وضعوني في الماء أموت. من أنا؟",
        choices: ["الثلج", "السمك", "الملح", "الورق"],
        answer: "الثلج",
        hint: "يصبح سائلاً في الدفء ❄️💧",
        explanation:
            "الثلج ماء متجمد، فإذا وضع في ماء دافئ ذاب وفقد شكله الصلب.",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },

    {
        id: "riddle-adult-004",
        type: "riddle",
        category: "language",
        title: "📜 لغز الحروف",
        description: "لغز لفظي دقيق",
        theme: "eid-al-adha",
        mood: "cozy",
        difficulty: 4,
        targetAgeGroup: "adult",
        question:
            "أبدأ بحرف 'م'، وأنتهي بحرف 'د'، وأجمع الناس في فرحة واحدة، ما أنا؟",
        choices: ["المسجد", "المولد", "الموعد", "المشهد"],
        answer: "المسجد",
        hint: "بيت الله، وفيه تقام الصلاة والخطب 🕌",
        explanation:
            "المسجد يبدأ بالميم وينتهي بالدال، وهو مركز تجمع المسلمين في الأعياد والجمعات.",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },

    {
        id: "riddle-adult-005",
        type: "riddle",
        category: "wisdom",
        title: "🪞 لا تملك عيوناً",
        description: "لغز منطقي عميق",
        theme: "eid-al-adha",
        mood: "mystery",
        difficulty: 4,
        targetAgeGroup: "adult",
        question:
            "تظهر لك وجهك بصدق، ولا تملك عيوناً، تكسر بسهولة، لكن صدقها لا يتغير أبداً؟",
        choices: ["المرآة", "الكاميرا", "الصورة", "الذاكرة"],
        answer: "المرآة",
        hint: "تنظر إليها كل صباح 🪞",
        explanation:
            "المرآة تعكس الحقيقة كما هي دون تزييف، وتذكيرنا بأنها كالعقل الصافي يرى الأشياء بوضوح.",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },

    {
        id: "riddle-adult-006",
        type: "riddle",
        category: "islamic",
        title: "🌟 صوت لا يُرى",
        description: "لغز العيد المميز",
        theme: "eid-al-adha",
        mood: "social",
        difficulty: 2,
        targetAgeGroup: "adult",
        question:
            "نسمعه في العيد ولا نراه، يعلو في السماء، ويملأ الأذن بالجلال والخشوع؟",
        choices: ["التكبيرات", "أذان الفجر", "صوت الطيور", "أدعية العيد"],
        answer: "التكبيرات",
        hint: "الله أكبر، الله أكبر 📣",
        explanation:
            "تكبيرات العيد شعار يرفع في البي والمساجد والشوارع لإعلان فرحة المؤمنين وعظمة الله.",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },

    {
        id: "riddle-adult-007",
        type: "riddle",
        category: "social",
        title: "🤝 يربط القلوب",
        description: "لغز العلاقات الإنسانية",
        theme: "eid-al-adha",
        mood: "social",
        difficulty: 3,
        targetAgeGroup: "adult",
        question:
            "جسر لا يُبنى بالحجر، ولا يعبره الماء، لكنه يصل بين المتباعدين ويذيب الخلافات؟",
        choices: ["الاعتذار", "الرسالة", "الزيارة", "الصمت"],
        answer: "الاعتذار",
        hint: "كلمة واحدة تزيل حزناً قديماً 🕊️",
        explanation:
            "الاعتذار الصادق جسر عابر للزمن، يعيد الثقة ويصلح ما فسد من العلاقات.",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },

    {
        id: "riddle-kid-005",
        type: "riddle",
        category: "fun",
        title: "🐪 سفينة الصحراء",
        description: "لغز حيواني",
        theme: "eid-al-adha",
        mood: "playful",
        difficulty: 1,
        targetAgeGroup: "kid",
        question:
            "طويل القامة، يلبس عباءة صوفية، ويتحمل العطش والحر في الصحراء؟",
        choices: ["الجمل", "الحصان", "الزرافة", "الفيل"],
        answer: "الجمل",
        hint: "يسمى سفينة الصحراء 🐫",
        explanation:
            "الجمل حيوان فريد يتكيف مع الظروف القاسية، وكان رفيق المسافرين والتجار قديماً.",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
];
