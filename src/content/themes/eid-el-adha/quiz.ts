import { Station } from "@/types/station";
import { eidMissions } from "./missions";

export const eidQuizStations: Station[] = [
    {
        id: "quiz-001",

        type: "quiz",

        category: "islamic",

        title: "🌙 حكمة الأضحية",

        description: "تفكير بسيط حول معنى الأضحية",

        theme: "eid-al-adha",

        mood: "reflective",

        difficulty: 2,

        targetAgeGroup: "adult",

        question: "ما الأقرب لمعنى الأضحية؟",

        choices: ["الطاعة", "القوة", "الشهرة", "السفر"],

        answer: "الطاعة",

        hint: "فكر في قصة سيدنا إسماعيل عليه السلام",

        explanation: "الأضحية مرتبطة بالطاعة والثقة بالله.",

        reward: {
            stars: 1,
            canUnlockTreasure: true,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "quiz-002",

        type: "quiz",

        category: "history",

        title: "🕋 رحلة هاجر",

        description: "محطة عن أم سيدنا إسماعيل",

        theme: "eid-al-adha",

        mood: "reflective",

        difficulty: 3,

        targetAgeGroup: "adult",

        question: "ما الصفة الأبرز في قصة السيدة هاجر؟",

        choices: ["الصبر", "الشجاعة", "الاعتماد على الله", "كل ما سبق"],

        answer: "كل ما سبق",

        hint: "فكر في المواقف الصعبة اللي مرت بيها هاجر في الصحراء",

        explanation:
            "بمجرد ما عرفت انه امر الله، صبرت على الابتلاء، اعتمدت على الله، وكانت شجاعة في مواجهة الصحراء.",

        reward: {
            stars: 2,
            canUnlockTreasure: true,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "quiz-003",

        type: "quiz",

        category: "language",

        title: "📚 لغة ومعنى",

        description: "سؤال لغوي بسيط",

        theme: "eid-al-adha",

        mood: "cozy",

        difficulty: 2,

        targetAgeGroup: "kid",

        question: 'ما معنى كلمة "سكينة" ؟',

        choices: ["الهدوء", "السرعة", "القوة", "الحزن"],

        answer: "الهدوء",

        hint: " الشعور اللي بيجي مع رمضان والعبادة",

        explanation:
            "السكينة تعني الهدوء والطمأنينة اللي بيحس بيها الإنسان لما يكون قريب من الله.",

        reward: {
            stars: 1,
            canUnlockTreasure: false,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "quiz-004",

        type: "quiz",

        category: "history",

        title: "🕋 مناسك الحج",

        description: "محطة فضول ومعرفة",

        theme: "eid-al-adha",

        mood: "mystery",

        difficulty: 3,

        targetAgeGroup: "adult",

        question: "ما أول مناسك الحج الكبرى يوم النحر؟",

        choices: ["رمي جمرة العقبة", "السعي", "طواف الوداع", "الحلق"],

        answer: "رمي جمرة العقبة",

        hint: "ابليس انت بتعيط ؟ ",

        explanation:
            "الجمرة الأولى هي رمي جمرة العقبة، وهي أول مناسك الحج الكبرى يوم النحر.",

        reward: {
            stars: 2,
            canUnlockTreasure: true,
        },

        tinyMissionPool: eidMissions,
    },

    // ========================================================================
    // القسم الأول: أسئلة أساسية وسهلة (Kids & Beginners) - Difficulty 1-2
    // الهدف: ترسيخ المعلومات الأساسية بطريقة ممتعة وبسيطة.
    //=======================================================================
    {
        id: "quiz-basic-kid-001",
        type: "quiz",
        category: "islamic",
        title: "🐑 فدية إسماعيل",
        description: "بداية قصة العيد",
        theme: "eid-al-adha",
        mood: "cozy",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "ماذا ذبح سيدنا إبراهيم بدلاً من ابنه إسماعيل؟",
        choices: ["جمل", "كبش", "بقرة", "دجاجة"],
        answer: "كبش",
        hint: "حيوان له صوف ويصوت مeee 🐑",
        explanation: "فدى الله إسماعيل بكبش عظيم، ومن هنا جاءت سنة الأضحية.",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },

    {
        id: "quiz-basic-kid-002",
        type: "quiz",
        category: "social",
        title: "👗 ملابس العيد",
        description: "سنن العيد الجميلة",
        theme: "eid-al-adha",
        mood: "playful",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "ماذا نلبس في يوم العيد؟",
        choices: ["ملابس النوم", "أجمل ثيابنا", "ملابس المدرسة", "لا شيء"],
        answer: "أجمل ثيابنا",
        hint: "ثياب نظيفة وجميلة ✨",
        explanation:
            "من السنة أن نتجميل ونلبس أحسن ملابسنا في العيد لإظهار الفرحة.",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },

    {
        id: "quiz-basic-adult-001",
        type: "quiz",
        category: "islamic",
        title: "🕌 صلاة العيد",
        description: "أين نصلي؟",
        theme: "eid-al-adha",
        mood: "social",
        difficulty: 1,
        targetAgeGroup: "adult",
        question: "أين يفضل أداء صلاة عيد الأضحى؟",
        choices: [
            "في البيت",
            "في المصلى الخارجي أو المسجد الكبير",
            "في السيارة",
            "في العمل",
        ],
        answer: "في المصلى الخارجي أو المسجد الكبير",
        hint: "مكان يتسع لجميع المسلمين 🕌",
        explanation:
            "السنة أن تصلى صلاة العيد في مصلى واسع أو مسجد كبير لاجتماع المسلمين.",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },

    {
        id: "quiz-basic-gen-001",
        type: "quiz",
        category: "fun",
        title: "🍉 فاكهة الصيف",
        description: "لغز بسيط",
        theme: "eid-al-adha",
        mood: "playful",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "فاكهة خضراء من الخارج وحمراء من الداخل، ما هي؟",
        choices: ["تفاح", "بطيخ", "موز", "برتقال"],
        answer: "بطيخ",
        hint: "بـ *** ـة (5 حروف)",
        explanation: "إنه البطيخ! فاكهة منعشة نحبها في الصيف والعيد.",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },

    // ========================================================================
    // القسم الثاني: أسئلة متوسطة وربط القيم (Intermediate) - Difficulty 2-3
    // الهدف: فهم المعاني والربط بين الأحداث والشخصيات.
    // ========================================================================

    {
        id: "quiz-mid-story-001",
        type: "quiz",
        category: "wisdom",
        title: "🤲 طاعة إسماعيل",
        description: "موقف عظيم من الابن",
        theme: "eid-al-adha",
        mood: "reflective",
        difficulty: 2,
        targetAgeGroup: "adult",
        question: "ماذا قال سيدنا إسماعيل لأبيه عندما أخبره بالرؤيا؟",
        choices: [
            "لا تفعل يا أبت",
            "اصبر يا أبت",
            "افعل ما تؤمر ستجدني من الصابرين",
            "دعنا نهرب",
        ],
        answer: "افعل ما تؤمر ستجدني من الصابرين",
        hint: "كلمات تدل على قمة التسليم 📖",
        explanation:
            "قالها إسماعيل مواسياً لأبه ومسلماً لأمر الله، وهي أعظم درس في البر.",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },

    {
        id: "quiz-mid-hajj-001",
        type: "quiz",
        category: "history",
        title: "🏃 سعي هاجر",
        description: "بين الصفا والمروة",
        theme: "eid-al-adha",
        mood: "mystery",
        difficulty: 2,
        targetAgeGroup: "kid",
        question: "من هي السيدة التي سعت بين الصفا والمروة؟",
        choices: ["سارة", "هاجر", "مريم", "آسية"],
        answer: "هاجر",
        hint: "أم سيدنا إسماعيل 👩‍👦",
        explanation:
            "سعي السيدة هاجر بحثاً عن الماء لابنها هو أصل لمنسك السعي في الحج.",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },

    {
        id: "quiz-mid-sunnah-001",
        type: "quiz",
        category: "social",
        title: "🤝 تهاني الصحابة",
        description: "كيف كانوا يحيون بعضهم؟",
        theme: "eid-al-adha",
        mood: "social",
        difficulty: 3,
        targetAgeGroup: "adult",
        question: "ما هو الدعاء الذي كان الصحابة يقوله بعضهم لبعض في العيد؟",
        choices: [
            "عيد سعيد",
            "كل عام وأنتم بخير",
            "تقبل الله منا ومنكم",
            "مبروك العيد",
        ],
        answer: "تقبل الله منا ومنكم",
        hint: "الدعاء بالقبول هو الأجمل 🤲",
        explanation:
            "كان الصحابة إذا التقوا يوم العيد يقول بعضهم لبعض: تقبل الله منا ومنكم.",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },

    {
        id: "quiz-mid-gen-001",
        type: "quiz",
        category: "language",
        title: "📚 ضد الكلمات",
        description: "تحدي لغوي بسيط",
        theme: "eid-al-adha",
        mood: "cozy",
        difficulty: 2,
        targetAgeGroup: "kid",
        question: "ما هو عكس كلمة 'فرح'؟",
        choices: ["سرور", "حزن", "نوم", "جوع"],
        answer: "حزن",
        hint: "شعور نحتاج فيه لاحتضان 🫂",
        explanation:
            "عكس الفرح هو الحزن. ونحن في العيد نحاول أن ندخل السرور على الجميع.",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },

    // ========================================================================
    // القسم الثالث: أسئلة صعبة جداً ومعقدة (Expert/Legend) - Difficulty 4
    // الهدف: تحدي المعلومات الدقيقة والفقه العميق والألغاز المعقدة.
    // ========================================================================

    {
        id: "quiz-hard-fiqh-001",
        type: "quiz",
        category: "islamic",
        title: "⚖️ حكم الأضحية",
        description: "دقة فقهية",
        theme: "eid-al-adha",
        mood: "reflective",
        difficulty: 4,
        targetAgeGroup: "adult",
        question: "ما هو الوقت الأقصى لذبح الأضحية عند جمهور العلماء؟",
        choices: [
            "حتى غروب شمس يوم العيد",
            "حتى غروب شمس آخر يوم من أيام التشريق (13 ذي الحجة)",
            "حتى نهاية شهر ذي الحجة",
            "قبل صلاة العيد بيوم",
        ],
        answer: "حتى غروب شمس آخر يوم من أيام التشريق (13 ذي الحجة)",
        hint: "أيام النحر أربعة أيام 🗓️",
        explanation:
            "وقت الأضحية يمتد لأربعة أيام: يوم العيد وثلاثة أيام بعده (أيام التشريق).",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },

    {
        id: "quiz-hard-history-001",
        type: "quiz",
        category: "history",
        title: "🕋 خطبة الوداع",
        description: "تاريخ دقيق",
        theme: "eid-al-adha",
        mood: "mystery",
        difficulty: 4,
        targetAgeGroup: "adult",
        question: "في أي يوم بالضبط ألقى النبي ﷺ خطبة الوداع؟",
        choices: [
            "يوم التروية",
            "يوم عرفة",
            "يوم النحر",
            "اليوم الثاني من التشريق",
        ],
        answer: "يوم عرفة",
        hint: "اليوم الذي يكمل فيه الدين 📜",
        explanation:
            "ألقى النبي خطبته العظيمة في يوم عرفة، ونزل فيه قول الله: 'اليوم أكملت لكم دينكم'.",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },

    {
        id: "quiz-hard-quran-001",
        type: "quiz",
        category: "wisdom",
        title: "⚛️ معادن القرآن",
        description: "إعجاز علمي دقيق",
        theme: "eid-al-adha",
        mood: "reflective",
        difficulty: 4,
        targetAgeGroup: "adult",
        question: "كم عدد المعادن التي ذُكرت باسمها صراحة في القرآن الكريم؟",
        choices: ["3 معادن", "6 معادن", "10 معادن", "12 معدناً"],
        answer: "6 معادن",
        hint: "الذهب، الفضة، الحديد، النحاس، الرصاص، القصدير 🔩",
        explanation:
            "ذكر القرآن 6 معادن صراحة: الذهب، الفضة، الحديد، النحاس، الرصاص، والقصدير.",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },

    {
        id: "quiz-hard-riddle-001",
        type: "quiz",
        category: "fun",
        title: "🧠 لغز العقل",
        description: "لغز منطقي معقد",
        theme: "eid-al-adha",
        mood: "mystery",
        difficulty: 4,
        targetAgeGroup: "adult",
        question: "ما هو الشيء الذي كلما أخذت منه كبر؟",
        choices: ["الحفرة", "العمر", "المال", "المعرفة"],
        answer: "الحفرة",
        hint: "تحفر في الأرض 🕳️",
        explanation:
            "الحفرة تكبر كلما أخذت (حفرت) منها تراباً أكثر. لغز يتطلب تفكيراً خارج الصندوق.",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },

    {
        id: "quiz-hard-prophet-001",
        type: "quiz",
        category: "history",
        title: "☀️ سنة النبي في العيد",
        description: "تفاصيل دقيقة من السيرة",
        theme: "eid-al-adha",
        mood: "cozy",
        difficulty: 4,
        targetAgeGroup: "adult",
        question: "كيف كان طريق النبي ﷺ في يوم العيد؟",
        choices: [
            "يذهب ويعود من نفس الطريق",
            "يذهب من طريق ويعود من طريق آخر",
            "يركب دابته فقط",
            "يمشي ماشياً فقط",
        ],
        answer: "يذهب من طريق ويعود من طريق آخر",
        hint: "ليظهر شعائر الإسلام في أكبر مساحة 🛣️",
        explanation:
            "كان النبي ﷺ يخالف الطريق ذهاباً وإياباً ليكثر من السلام وليظهر شعائر الإسلام في أنحاء المدينة.",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },

    // --- أسئلة عامة صعبة للأطفال (تحدي الذكاء) ---

    {
        id: "quiz-hard-kid-001",
        type: "quiz",
        category: "fun",
        title: "🌍 كوكبنا الأزرق",
        description: "معلومة جيولوجية",
        theme: "eid-al-adha",
        mood: "mystery",
        difficulty: 3, // صعب نسبياً للطفل
        targetAgeGroup: "kid",
        question: "ما هو أكبر محيط في العالم؟",
        choices: [
            "المحيط الأطلسي",
            "المحيط الهندي",
            "المحيط الهادئ",
            "البحر المتوسط",
        ],
        answer: "المحيط الهادئ",
        hint: "اسمه يوحي بالهدوء لكنه الأكبر 🌊",
        explanation: "المحيط الهادئ هو أكبر مسطح مائي على وجه الأرض.",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
];
