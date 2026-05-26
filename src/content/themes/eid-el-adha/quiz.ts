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
/**
 * Kenzoo — Eid Al-Adha Quiz Pack v1
 * Rich replayable family-friendly quiz content
 */


    // =====================================================
    // KIDS — LEVEL 1
    // =====================================================

    {
        id: "q-k-001",

        type: "quiz",

        category: "islamic",

        title: "🐋 الحوت الكبير",

        description:
            "السؤال ده عن نبي معروف 👀",

        theme: "eid-al-adha",

        mood: "playful",

        difficulty: 1,

        targetAgeGroup: "kid",

        question:
            "مين النبي اللي بلعه الحوت؟",

        choices: [
            "سيدنا يونس",
            "سيدنا موسى",
            "سيدنا يوسف",
            "سيدنا نوح",
        ],

        answer:
            "سيدنا يونس",

        hint:
            "🐋🌙",

        explanation:
            "الله نجّى سيدنا يونس بعد ما بلعه الحوت ✨",

        reward: {
            stars: 1,
            canUnlockTreasure: false,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "q-k-002",

        type: "quiz",

        category: "animals",

        title: "🦒 رقبة طويلة",

        description:
            "الحيوان ده معروف جدًا 😄",

        theme: "eid-al-adha",

        mood: "playful",

        difficulty: 1,

        targetAgeGroup: "kid",

        question:
            "مين الحيوان اللي رقبته طويلة؟",

        choices: [
            "الزرافة",
            "الفيل",
            "الأسد",
            "الحصان",
        ],

        answer:
            "الزرافة",

        hint:
            "🦒",

        explanation:
            "الزرافة من أطول الحيوانات في العالم 👀",

        reward: {
            stars: 1,
            canUnlockTreasure: false,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "q-k-003",

        type: "quiz",

        category: "fun",

        title: "🌈 بعد المطر",

        description:
            "السؤال ده فيه ألوان كتير ✨",

        theme: "eid-al-adha",

        mood: "cozy",

        difficulty: 1,

        targetAgeGroup: "kid",

        question:
            "إيه اللي ممكن يظهر بعد المطر؟",

        choices: [
            "قوس قزح",
            "الثلج",
            "الدخان",
            "النجوم",
        ],

        answer:
            "قوس قزح",

        hint:
            "🌧️🌈",

        explanation:
            "قوس قزح بيظهر بعد المطر مع ضوء الشمس ✨",

        reward: {
            stars: 1,
            canUnlockTreasure: false,
        },

        tinyMissionPool: eidMissions,
    },

    // =====================================================
    // KIDS — LEVEL 2
    // =====================================================

    {
        id: "q-k-004",

        type: "quiz",

        category: "islamic",

        title: "🕌 صلاة العيد",

        description:
            "سؤال صغير عن يوم العيد 🌙",

        theme: "eid-al-adha",

        mood: "warm",

        difficulty: 2,

        targetAgeGroup: "kid",

        question:
            "بنروح فين نصلي صلاة العيد؟",

        choices: [
            "المسجد",
            "السوق",
            "المدرسة",
            "البيت",
        ],

        answer:
            "المسجد",

        hint:
            "🕌👨‍👩‍👧",

        explanation:
            "صلاة العيد بتجمع ناس كتير في جو جميل ✨",

        reward: {
            stars: 2,
            canUnlockTreasure: false,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "q-k-005",

        type: "quiz",

        category: "animals",

        title: "🐆 سريع جدًا",

        description:
            "في حيوان سريع جدًا 😄",

        theme: "eid-al-adha",

        mood: "playful",

        difficulty: 2,

        targetAgeGroup: "kid",

        question:
            "مين أسرع حيوان على الأرض؟",

        choices: [
            "الفهد",
            "الفيل",
            "الأرنب",
            "الدب",
        ],

        answer:
            "الفهد",

        hint:
            "🐆💨",

        explanation:
            "الفهد يجري بسرعة كبيرة جدًا 👀",

        reward: {
            stars: 2,
            canUnlockTreasure: false,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "q-k-006",

        type: "quiz",

        category: "science",

        title: "☀️ في الشمس",

        description:
            "واضح إن في حاجة هتدوب 👀",

        theme: "eid-al-adha",

        mood: "curious",

        difficulty: 2,

        targetAgeGroup: "kid",

        question:
            "إيه اللي بيحصل للتلج في الشمس؟",

        choices: [
            "بيدوب",
            "بيتجمد",
            "بيكبر",
            "بيطير",
        ],

        answer:
            "بيدوب",

        hint:
            "☀️🧊",

        explanation:
            "حرارة الشمس بتخلي التلج يدوب 💧",

        reward: {
            stars: 2,
            canUnlockTreasure: false,
        },

        tinyMissionPool: eidMissions,
    },

    // =====================================================
    // KIDS — LEVEL 3
    // =====================================================

    {
        id: "q-k-007",

        type: "quiz",

        category: "islamic",

        title: "🌟 خليل الله",

        description:
            "السؤال ده عن نبي عظيم 🌙",

        theme: "eid-al-adha",

        mood: "warm",

        difficulty: 3,

        targetAgeGroup: "kid",

        question:
            "مين النبي اللي كان يُسمى خليل الله؟",

        choices: [
            "سيدنا إبراهيم",
            "سيدنا موسى",
            "سيدنا يوسف",
            "سيدنا يونس",
        ],

        answer:
            "سيدنا إبراهيم",

        hint:
            "🕋🔥",

        explanation:
            "سيدنا إبراهيم من أعظم الأنبياء ✨",

        reward: {
            stars: 3,
            canUnlockTreasure: true,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "q-k-008",

        type: "quiz",

        category: "mystery",

        title: "😄 أسنان كثيرة",

        description:
            "لغز صغير وسهل 👀",

        theme: "eid-al-adha",

        mood: "playful",

        difficulty: 3,

        targetAgeGroup: "kid",

        question:
            "إيه اللي له أسنان لكنه لا يعض؟",

        choices: [
            "المشط",
            "الأسد",
            "التمساح",
            "الذئب",
        ],

        answer:
            "المشط",

        hint:
            "🪮",

        explanation:
            "المشط له أسنان كثيرة… لكنه لا يعض 😄",

        reward: {
            stars: 3,
            canUnlockTreasure: true,
        },

        tinyMissionPool: eidMissions,
    },

    // =====================================================
    // KIDS — LEVEL 4
    // =====================================================

    {
        id: "q-k-009",

        type: "quiz",

        category: "islamic",

        title: "🕋 أبو الأنبياء",

        description:
            "سؤال مشهور جدًا 🌙",

        theme: "eid-al-adha",

        mood: "warm",

        difficulty: 4,

        targetAgeGroup: "kid",

        question:
            "مين النبي اللي يُسمى أبو الأنبياء؟",

        choices: [
            "سيدنا إبراهيم",
            "سيدنا آدم",
            "سيدنا موسى",
            "سيدنا يوسف",
        ],

        answer:
            "سيدنا إبراهيم",

        hint:
            "🕋✨",

        explanation:
            "كثير من الأنبياء جاءوا من نسل سيدنا إبراهيم 👀",

        reward: {
            stars: 4,
            canUnlockTreasure: true,
        },

        tinyMissionPool: eidMissions,
    },

    // =====================================================
    // ADULT — LEVEL 1
    // =====================================================

    {
        id: "q-a-001",

        type: "quiz",

        category: "geography",

        title: "🌍 عاصمة مشهورة",

        description:
            "سؤال سريع من الجغرافيا 👀",

        theme: "eid-al-adha",

        mood: "curious",

        difficulty: 1,

        targetAgeGroup: "adult",

        question:
            "ما عاصمة تركيا؟",

        choices: [
            "أنقرة",
            "إسطنبول",
            "بيروت",
            "دبي",
        ],

        answer:
            "أنقرة",

        hint:
            "🇹🇷",

        explanation:
            "إسطنبول أشهر مدينة… لكن العاصمة الرسمية هي أنقرة ✨",

        reward: {
            stars: 1,
            canUnlockTreasure: false,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "q-a-002",

        type: "quiz",

        category: "islamic",

        title: "🕌 أول مؤذن",

        description:
            "سؤال سريع من السيرة 🌙",

        theme: "eid-al-adha",

        mood: "warm",

        difficulty: 1,

        targetAgeGroup: "adult",

        question:
            "من أول مؤذن في الإسلام؟",

        choices: [
            "بلال بن رباح",
            "عمر بن الخطاب",
            "عثمان بن عفان",
            "أبو بكر الصديق",
        ],

        answer:
            "بلال بن رباح",

        hint:
            "🕌🔊",

        explanation:
            "بلال بن رباح كان أول من رفع الأذان في الإسلام ✨",

        reward: {
            stars: 1,
            canUnlockTreasure: false,
        },

        tinyMissionPool: eidMissions,
    },

    // =====================================================
    // ADULT — LEVEL 2
    // =====================================================

    {
        id: "q-a-003",

        type: "quiz",

        category: "science",

        title: "🧠 عضو مهم",

        description:
            "الجسم يستهلك طاقة كبيرة هنا 👀",

        theme: "eid-al-adha",

        mood: "curious",

        difficulty: 2,

        targetAgeGroup: "adult",

        question:
            "أي عضو يستهلك أكبر قدر من الطاقة في جسم الإنسان؟",

        choices: [
            "المخ",
            "القلب",
            "المعدة",
            "الرئتين",
        ],

        answer:
            "المخ",

        hint:
            "🧠⚡",

        explanation:
            "المخ يستهلك طاقة كبيرة رغم حجمه الصغير ✨",

        reward: {
            stars: 2,
            canUnlockTreasure: true,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "q-a-004",

        type: "quiz",

        category: "history",

        title: "⚔️ أول معركة",

        description:
            "سؤال سريع من التاريخ الإسلامي 🌙",

        theme: "eid-al-adha",

        mood: "epic",

        difficulty: 2,

        targetAgeGroup: "adult",

        question:
            "ما أول معركة كبرى في الإسلام؟",

        choices: [
            "بدر",
            "أحد",
            "الخندق",
            "اليرموك",
        ],

        answer:
            "بدر",

        hint:
            "⚔️",

        explanation:
            "غزوة بدر من أهم الأحداث في بداية الإسلام ✨",

        reward: {
            stars: 2,
            canUnlockTreasure: true,
        },

        tinyMissionPool: eidMissions,
    },

    // =====================================================
    // ADULT — LEVEL 3
    // =====================================================

    {
        id: "q-a-005",

        type: "quiz",

        category: "psychology",

        title: "👃 ذكريات قديمة",

        description:
            "الموضوع ده بيحصل مع ناس كتير 👀",

        theme: "eid-al-adha",

        mood: "cozy",

        difficulty: 3,

        targetAgeGroup: "adult",

        question:
            "ما أكثر حاسة مرتبطة بالذكريات عند الإنسان؟",

        choices: [
            "الشم",
            "السمع",
            "اللمس",
            "التذوق",
        ],

        answer:
            "الشم",

        hint:
            "🧠👃",

        explanation:
            "الروائح مرتبطة بقوة بالذاكرة والمشاعر ✨",

        reward: {
            stars: 3,
            canUnlockTreasure: true,
        },

        tinyMissionPool: eidMissions,
    },

    {
        id: "q-a-006",

        type: "quiz",

        category: "islamic",

        title: "🕊️ معنى الإحرام",

        description:
            "سؤال بسيط لكن معناه مهم 🌙",

        theme: "eid-al-adha",

        mood: "peaceful",

        difficulty: 3,

        targetAgeGroup: "adult",

        question:
            "ما الحكمة الأساسية من ارتداء الحجاج ملابس متشابهة؟",

        choices: [
            "إلغاء الفوارق بين الناس",
            "تقليل التكاليف",
            "تمييز الحجاج",
            "تسهيل السفر",
        ],

        answer:
            "إلغاء الفوارق بين الناس",

        hint:
            "👥⚖️",

        explanation:
            "الإحرام يذكّر الناس أن الجميع متساوون ✨",

        reward: {
            stars: 3,
            canUnlockTreasure: true,
        },

        tinyMissionPool: eidMissions,
    },

        // ========================
    // محطات الأطفال (5-7 سنوات) - 50 سؤال
    // ========================
    {
        id: "quiz-k-001",
        type: "quiz",
        category: "islamic",
        title: "🐳 صاحب الحوت",
        description: "قصة نبي جميل",
        theme: "eid-al-adha",
        mood: "mystic",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "مين النبي اللي بلعه الحوت وعاش جواه؟",
        choices: ["يونس عليه السلام", "موسى عليه السلام", "نوح عليه السلام", "إبراهيم عليه السلام"],
        answer: "يونس عليه السلام",
        hint: "🐳 حوت كبير",
        explanation: "سيدنا يونس فضل يسبح ربنا جوه بطن الحوت لحد ما خرج بالسلامة [1], [2], [3].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-002",
        type: "quiz",
        category: "fun",
        title: "🦷 لغز السنان",
        description: "حاجة بنستخدمها كل يوم",
        theme: "eid-al-adha",
        mood: "playful",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "إيه اللي له أسنان كتير لكن مش بيعض؟",
        choices: ["التمساح", "المشط", "المنشار", "الأسد"],
        answer: "المشط",
        hint: "💇 تسريح الشعر",
        explanation: "المشط بنسرح بيه بس مش بيعض أبداً [4], [5], [6].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-003",
        type: "quiz",
        category: "animals",
        title: "🦒 الزرافة الهادية",
        description: "معلومات عن الحيوانات",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 2,
        targetAgeGroup: "kid",
        question: "عارف الزرافة صوتها عامل إزاي؟",
        choices: ["بتنونو", "بتزأر", "مش ليها صوت", "بتهوهو"],
        answer: "مش ليها صوت",
        hint: "🔇 هدوء خالص",
        explanation: "الزرافة حيوان أبكم مش بيطلع صوت خالص [7], [8].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-004",
        type: "quiz",
        category: "nature",
        title: "☀️ شروق الشمس",
        description: "بص للسما",
        theme: "eid-al-adha",
        mood: "peaceful",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "الشمس بتطلع كل يوم منين؟",
        choices: ["الشرق", "الغرب", "الشمال", "الجنوب"],
        answer: "الشرق",
        hint: "⬅️ جهة اليمين",
        explanation: "الشمس بتنور الدنيا لما تطلع من جهة الشرق كل صبح [9], [10].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-005",
        type: "quiz",
        category: "islamic",
        title: "🚢 سفينة نوح",
        description: "معجزة كبيرة",
        theme: "eid-al-adha",
        mood: "epic",
        difficulty: 2,
        targetAgeGroup: "kid",
        question: "مين النبي اللي ربنا أمره يبني سفينة ضخمة؟",
        choices: ["آدم عليه السلام", "نوح عليه السلام", "عيسى عليه السلام", "يوسف عليه السلام"],
        answer: "نوح عليه السلام",
        hint: "🌊 طوفان وموج",
        explanation: "سيدنا نوح بنى السفينة عشان ينقذ المؤمنين والحيوانات [11], [12], [13].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-006",
        type: "quiz",
        category: "animals",
        title: "🏃 أسرع واحد",
        description: "سباق الغابة",
        theme: "eid-al-adha",
        mood: "playful",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "مين أسرع حيوان بيمشي على الأرض؟",
        choices: ["الفهد", "الحصان", "اأرنب", "الكلب"],
        answer: "الفهد",
        hint: "🐆 سريع جداً",
        explanation: "الفهد هو أسرع حيوان بري في العالم كله [14], [23٨], [10].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-007",
        type: "quiz",
        category: "riddles",
        title: "☁️ الغيمة الباكية",
        description: "فكر شوية",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 3,
        targetAgeGroup: "kid",
        question: "إيه اللي بيمشي من غير رجلين ويبكي من غير عينين؟",
        choices: ["السمكة", "السحاب", "العربية", "الوردة"],
        answer: "السحاب",
        hint: "🌧️ مطر جميل",
        explanation: "السحاب بيمشي مع الهوا وبينزل مطر كأنه بيبكي [4], [5], [32٩].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-00٨",
        type: "quiz",
        category: "islamic",
        title: "🕌 أحلى صلاة",
        description: "بكلم ربنا",
        theme: "eid-al-adha",
        mood: "peaceful",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "بنصلي كام مرة في اليوم؟",
        choices: ["3 مرات", "5 مرات", "10 مرات", "مرة واحدة"],
        answer: "5 مرات",
        hint: "🖐️ صوابع ايدك",
        explanation: "المسلم بيصلي 5 صلوات في اليوم عشان يفضل قريب من ربنا [15], [12٩], [16].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-00٩",
        type: "quiz",
        category: "animals",
        title: "🐘 الفيل الصديق",
        description: "حيوان ضخم",
        theme: "eid-al-adha",
        mood: "playful",
        difficulty: 2,
        targetAgeGroup: "kid",
        question: "تعرف الفيل بيستخدم إيه عشان يحك ودنه؟",
        choices: ["رجله", "زلومته", "ديله", "الحجر"],
        answer: "زلومته",
        hint: "👃 مناخيره الطويلة",
        explanation: "الفيل بيستخدم زلومته الذكية في حاجات كتير زي اأكل وحك جسمه [٨٩], [٩1].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-010",
        type: "quiz",
        category: "nature",
        title: "🌈 ألوان قوس قزح",
        description: "بعد المطر",
        theme: "eid-al-adha",
        mood: "warm",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "قوس قزح الجميل فيه كام لون؟",
        choices: ["3 ألوان", "7 ألوان", "5 ألوان", "10 ألوان"],
        answer: "7 ألوان",
        hint: "7️⃣ رقم سبعة",
        explanation: "قوس قزح بيظهر بـ 7 ألوان روعة بعد ما الدنيا تمطر [٩], [٩٨], [17].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-011",
        type: "quiz",
        category: "islamic",
        title: "🔥 برد وسلام",
        description: "قصة سيدنا إبراهيم",
        theme: "eid-al-adha",
        mood: "mystic",
        difficulty: 3,
        targetAgeGroup: "kid",
        question: "مين النبي اللي النار مأذتوش وكانت باردة عليه؟",
        choices: ["يحيى عليه السلام", "إبراهيم عليه السلام", "داود عليه السلام", "آدم عليه السلام"],
        answer: "إبراهيم عليه السلام",
        hint: "🕋 باني الكعبة",
        explanation: "ربنا أمر النار تكون برد وسلام على سيدنا إبراهيم ومنورتهوش [6٩], [3].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-012",
        type: "quiz",
        category: "riddles",
        title: "🍳 لغز البيضة",
        description: "حاجة في المطبخ",
        theme: "eid-al-adha",
        mood: "playful",
        difficulty: 2,
        targetAgeGroup: "kid",
        question: "إيه الحاجة اللي لازم تتكسر قبل ما ناكلها؟",
        choices: ["البسكوت", "البيضة", "التفاحة", "الموزة"],
        answer: "البيضة",
        hint: "🐔 جاية من الفرخة",
        explanation: "البيضة لازم نكسر قشرتها عشان نعرف نطبخها وناكلها [18], [19].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-013",
        type: "quiz",
        category: "animals",
        title: "🐢 السلحفاة الصبورة",
        description: "على مهلها",
        theme: "eid-al-adha",
        mood: "cozy",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "السلحفاة بتشيل إيه فوق ظهرها؟",
        choices: ["شنطة", "بيتها", "أكلها", "أصحابها"],
        answer: "بيتها",
        hint: "🏠 مكان تنام فيه",
        explanation: "السلحفاة ربنا خلق لها درع صلب بيحميها كأنه بيتها المتنقل [20], [42٨].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-014",
        type: "quiz",
        category: "islamic",
        title: "🐜 صوت النملة",
        description: "نبي بيفهم الحيوانات",
        theme: "eid-al-adha",
        mood: "mystic",
        difficulty: 2,
        targetAgeGroup: "kid",
        question: "مين النبي اللي سمع صوت النملة وهي بتتكلم؟",
        choices: ["سليمان عليه السلام", "صالح عليه السلام", "هود عليه السلام", "شعيب عليه السلام"],
        answer: "سليمان عليه السلام",
        hint: "👑 ملك عظيم",
        explanation: "سيدنا سليمان كان بيفهم لغة الطيور والحشرات وحتى النمل [2], [21].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-015",
        type: "quiz",
        category: "science",
        title: "🍏 الجاذبية",
        description: "لي اأشياء بتقع؟",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 3,
        targetAgeGroup: "kid",
        question: "ليه لما بنرمي كورة لفوق بتقع تاني على الأرض؟",
        choices: ["عشان خايفة", "بسبب الجاذبية", "عشان الهوا", "عشان تقيلة"],
        answer: "بسبب الجاذبية",
        hint: "🧲 مغناطيس الأرض",
        explanation: "الجاذبية هي اللي بتشد كل حاجة ناحية الأرض عشان متطرش [22], [32٨].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-016",
        type: "quiz",
        category: "animals",
        title: "👑 ملك الغابة",
        description: "زئير قوي",
        theme: "eid-al-adha",
        mood: "playful",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "مين الحيوان اللي بيلقب بـ 'ملك الغابة'؟",
        choices: ["الفيل", "الأسد", "النمر", "الزرافة"],
        answer: "الأسد",
        hint: "🦁 شعره كتير",
        explanation: "الأسد بقوته وشجاعته هو ملك الغابة المعروف [2٩7], [23].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-017",
        type: "quiz",
        category: "islamic",
        title: "💧 ماء زمزم",
        description: "بئر مبارك",
        theme: "eid-al-adha",
        mood: "warm",
        difficulty: 2,
        targetAgeGroup: "kid",
        question: "إيه اسم الميّة اللي طلعت تحت رجل سيدنا إسماعيل وهو صغير؟",
        choices: ["ميّة النيل", "ماء زمزم", "ميّة البحر", "ماء المطر"],
        answer: "ماء زمزم",
        hint: "🕋 في مكة",
        explanation: "ماء زمزم طلع بمعجزة عشان سيدنا إسماعيل وأمه هاجر يشربوا [24], [25].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-01٨",
        type: "quiz",
        category: "riddles",
        title: "👣 لغز الطريق",
        description: "حاجة ثابتة",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 2,
        targetAgeGroup: "kid",
        question: "إيه اللي بيوديك المدرسة ويرجعك البيت من غير ما يتحرك؟",
        choices: ["العربية", "العجلة", "الطريق", "الطيارة"],
        answer: "الطريق",
        hint: "🛣️ بنمشي عليه",
        explanation: "الطريق بيفضل في مكانه واحنا اللي بنمشي عليه للوصول [٨٩], [8].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-01٩",
        type: "quiz",
        category: "animals",
        title: "🐪 سفينة الصحراء",
        description: "صبر كبير",
        theme: "eid-al-adha",
        mood: "warm",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "مين الحيوان اللي بنسميه 'سفينة الصحراء'؟",
        choices: ["الحصان", "الجمل", "الحمار", "الغزالة"],
        answer: "الجمل",
        hint: "🐫 عنده سنام",
        explanation: "الجمل بيقدر يمشي في الرمل ويستحمل العطش وقت طويل [2٩7], [26٩].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-020",
        type: "quiz",
        category: "nature",
        title: "🍯 عسل نحل",
        description: "حاجة طعمها حلو",
        theme: "eid-al-adha",
        mood: "playful",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "مين الحشرة اللي بتصنع لنا العسل؟",
        choices: ["الدبانة", "النحلة", "الناموسة", "النملة"],
        answer: "النحلة",
        hint: "🐝 بتطير وتزن",
        explanation: "النحل الشاطر بيمتص رحيق الورد ويحوله لعسل لذيذ [23٨], [26٩].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-021",
        type: "quiz",
        category: "islamic",
        title: "🌿 أول إنسان",
        description: "بداية الحكاية",
        theme: "eid-al-adha",
        mood: "mystic",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "مين أول واحد ربنا خلقه وعاش على الأرض؟",
        choices: ["سيدنا محمد", "سيدنا آدم", "سيدنا عيسى", "سيدنا يوسف"],
        answer: "سيدنا آدم",
        hint: "🍎 أبو البشر",
        explanation: "سيدنا آدم هو أول إنسان خلقه ربنا وعاش هو وستنا حواء [26], [٨7], [12٩].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-022",
        type: "quiz",
        category: "science",
        title: "🖐️ حواسنا",
        description: "جسمنا الجميل",
        theme: "eid-al-adha",
        mood: "warm",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "إحنا عندنا كام حاسة؟ (زي الشم والسمع)",
        choices: ["حاسة واحدة", "5 حواس", "3 حواس", "10 حواس"],
        answer: "5 حواس",
        hint: "🖐️ ايد كاملة",
        explanation: "عندنا 5 حواس: البصر والسمع والشم والتذوق واللمس [27], [28].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-023",
        type: "quiz",
        category: "animals",
        title: "🐙 قلوب الأخطبوط",
        description: "تحت الميّة",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 4,
        targetAgeGroup: "kid",
        question: "تعرف الأخطبوط عنده كام قلب جوه جسمه؟",
        choices: ["قلب واحد", "3 قلوب", "5 قلوب", "مفيش"],
        answer: "3 قلوب",
        hint: "3️⃣ رقم تلاتة",
        explanation: "الأخطبوط حيوان غريب وعنده 3 قلوب بدل واحد [٩٨], [29].",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-024",
        type: "quiz",
        category: "riddles",
        title: "🕰️ عقرب مش بيعض",
        description: "لغز سريع",
        theme: "eid-al-adha",
        mood: "playful",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "إيه العقرب اللي مش بيقرص ولا بيخوف؟",
        choices: ["عقرب الرمل", "عقرب الساعة", "عقرب البحر", "مفيش"],
        answer: "عقرب الساعة",
        hint: "⏰ بنعرف بيها الوقت",
        explanation: "الساعة فيها عقارب بتلف عشان تقولنا الساعة كام [4], [30].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-025",
        type: "quiz",
        category: "islamic",
        title: "🕋 الكعبة المشرفة",
        description: "بيت ربنا",
        theme: "eid-al-adha",
        mood: "peaceful",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "الكعبة موجودة في أنهي مدينة؟",
        choices: ["القاهرة", "مكة المكرمة", "القدس", "المدينة"],
        answer: "مكة المكرمة",
        hint: "🇸🇦 في السعودية",
        explanation: "الكعبة هي قبلة المسلمين وموجودة في مكة المكرمة [26], [٨6], [12٩].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-026",
        type: "quiz",
        category: "nature",
        title: "🍎 فاكهة لذيذة",
        description: "أكل صحي",
        theme: "eid-al-adha",
        mood: "cozy",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "أنهي فاكهة القرد بيحب ياكلها أوي؟",
        choices: ["التفاح", "الموز", "البطيخ", "العنب"],
        answer: "الموز",
        hint: "🍌 لونها أصفر",
        explanation: "الموز فاكهة طاقة والقرد بيحبها جداً [2٩٨], [31].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-027",
        type: "quiz",
        category: "animals",
        title: "🐰 الأرنب الشاطر",
        description: "بيحب الخضار",
        theme: "eid-al-adha",
        mood: "playful",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "إيه اأكلة المفضلة للأرنب؟",
        choices: ["اللحمة", "الجزر", "السمك", "العيش"],
        answer: "الجزر",
        hint: "🥕 لونه برتقالي",
        explanation: "الأرانب بتحب تقرقض الجزر عشان يقوي نظرها [34٨], [2٩٨].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-02٨",
        type: "quiz",
        category: "riddles",
        title: "👂 لغز الصوت",
        description: "حاجة حوالينا",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 3,
        targetAgeGroup: "kid",
        question: "إيه اللي بيمشي من غير رجلين وبيدخل الودن؟",
        choices: ["النملة", "الصوت", "الميّة", "الهوا"],
        answer: "الصوت",
        hint: "📢 بنسمعه بس",
        explanation: "الصوت بينتقل في الهوا وبنسمعه بوداننا من غير ما نشوفه [٩5], [32].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-02٩",
        type: "quiz",
        category: "islamic",
        title: "📖 كتاب ربنا",
        description: "كلام جميل",
        theme: "eid-al-adha",
        mood: "mystic",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "إيه اسم الكتاب اللي ربنا أنزله على سيدنا محمد؟",
        choices: ["الإنجيل", "القرآن الكريم", "التوراة", "الزبور"],
        answer: "القرآن الكريم",
        hint: "📗 بنقرأه كل يوم",
        explanation: "القرآن هو كلام ربنا المعجز اللي نزل على نبينا محمد [33], [12٩], [16].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-030",
        type: "quiz",
        category: "animals",
        title: "🕸️ بيت العنكبوت",
        description: "بيت صغير",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 2,
        targetAgeGroup: "kid",
        question: "العنكبوت عنده كام رجل؟",
        choices: ["4 رجول", "٨ رجول", "6 رجول", "2 بس"],
        answer: "٨ رجول",
        hint: "٨️⃣ رقم تمانية",
        explanation: "العنكبوت عنده ٨ رجول بيستخدمهم عشان يبني شبكته [٩٩], [26٩], [10].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-031",
        type: "quiz",
        category: "nature",
        title: "❄️ لغز الثلج",
        description: "حاجة باردة",
        theme: "eid-al-adha",
        mood: "playful",
        difficulty: 2,
        targetAgeGroup: "kid",
        question: "إيه الحاجة اللي لو حطيناها في الميّة بتموت؟",
        choices: ["السمكة", "الثلج", "السفينة", "الوردة"],
        answer: "الثلج",
        hint: "🧊 بيسيح بسرعة",
        explanation: "الثلج لو نزل في الميّة الدافية بيدوب ويتحول لميّة [٩2], [35٨].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-032",
        type: "quiz",
        category: "islamic",
        title: "🐘 عام الفيل",
        description: "ميلاد النبي",
        theme: "eid-al-adha",
        mood: "epic",
        difficulty: 2,
        targetAgeGroup: "kid",
        question: "النبي محمد اتولد في عام اسمه إيه؟",
        choices: ["عام الفرح", "عام الفيل", "عام الحزن", "عام النصر"],
        answer: "عام الفيل",
        hint: "🐘 حيوان ضخم",
        explanation: "اتولد النبي صلى الله عليه وسلم في العام اللي أبرهة حاول فيه يهدم الكعبة [34], [16].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-033",
        type: "quiz",
        category: "animals",
        title: "🐟 السمك الشاطر",
        description: "بيعيش فين؟",
        theme: "eid-al-adha",
        mood: "playful",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "السمك بيقدر يتنفس فين؟",
        choices: ["في الهوا", "تحت الميّة", "في الرمل", "فوق الشجر"],
        answer: "تحت الميّة",
        hint: "🌊 بحر ونهر",
        explanation: "السمك عنده خياشيم بتخليه يتنفس اأكسجين وهو جوه الميّة [35], [17].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-034",
        type: "quiz",
        category: "riddles",
        title: "🧼 صابونة صغيرة",
        description: "وقت الحماية",
        theme: "eid-al-adha",
        mood: "playful",
        difficulty: 2,
        targetAgeGroup: "kid",
        question: "حاجة كل ما نستحمى بيها تصغر؟",
        choices: ["الليفة", "الصابونة", "الميّة", "الفوطة"],
        answer: "الصابونة",
        hint: "🛁 رغاو ي كتير",
        explanation: "الصابونة بتدوب شوية بشوية واحنا بنغسل جسمنا لحد ما تخلص [6].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-035",
        type: "quiz",
        category: "nature",
        title: "🌗 القمر المنور",
        description: "في الليل",
        theme: "eid-al-adha",
        mood: "mystic",
        difficulty: 3,
        targetAgeGroup: "kid",
        question: "هو القمر منور من نفسه ولا بيعكس ضوء حاجة تانية؟",
        choices: ["منور لوحده", "بيعكس ضوء الشمس", "عنده لمبات", "بينور بالكهرباء"],
        answer: "بيعكس ضوء الشمس",
        hint: "☀️ مراية كبيرة",
        explanation: "القمر جسم مظلم بس بيعكس ضوء الشمس لينا فبيبان منور [26٨], [36].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-036",
        type: "quiz",
        category: "islamic",
        title: "🕊️ غار ثور",
        description: "وقت الهجرة",
        theme: "eid-al-adha",
        mood: "mystic",
        difficulty: 4,
        targetAgeGroup: "kid",
        question: "مين اللي بنى عش قدام الغار عشان يحمي النبي؟",
        choices: ["الأسد", "الحمامة", "العنكبوت", "النحلة"],
        answer: "الحمامة",
        hint: "🐦 طائر السلام",
        explanation: "الحمامة بنت عشها والعنكبوت نسج خيوطه عشان المشركين ميشوفوش النبي [37], [38].",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-037",
        type: "quiz",
        category: "animals",
        title: "🐕 الوفاء",
        description: "صديق الإنسان",
        theme: "eid-al-adha",
        mood: "warm",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "أنهي حيوان مشهور بوفائه لصاحبه؟",
        choices: ["القطة", "الكلب", "الفار", "الديب"],
        answer: "الكلب",
        hint: "🐶 بيهزه ديله",
        explanation: "الكلب بيحب صاحبه جداً وبيحرسه ودايماً وفي ليه [39].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-03٨",
        type: "quiz",
        category: "riddles",
        title: "🕯️ شمعة طيبة",
        description: "بتنور المكان",
        theme: "eid-al-adha",
        mood: "peaceful",
        difficulty: 2,
        targetAgeGroup: "kid",
        question: "حاجة بتحرق نفسها عشان تنور للناس؟",
        choices: ["اللمبة", "الشمعة", "الشمس", "النار"],
        answer: "الشمعة",
        hint: "🔥 بتسيح بالراحة",
        explanation: "الشمعة بتخلص وهي بتدينا ضوء في الضلمة [23], [6], [35٩].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-03٩",
        type: "quiz",
        category: "islamic",
        title: "🐫 ناقة صالح",
        description: "معجزة من الصخر",
        theme: "eid-al-adha",
        mood: "mystic",
        difficulty: 3,
        targetAgeGroup: "kid",
        question: "مين النبي اللي معجزته كانت ناقة خرجت من الصخرة؟",
        choices: ["سيدنا هود", "سيدنا صالح", "سيدنا شعيب", "سيدنا لوط"],
        answer: "سيدنا صالح",
        hint: "🐪 جمل ضخم",
        explanation: "ربنا طلع الناقة من وسط الصخرة كمعجزة لقوم سيدنا صالح [2], [40].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-040",
        type: "quiz",
        category: "nature",
        title: "🍉 بطيخة حمراء",
        description: "فاكهة الصيف",
        theme: "eid-al-adha",
        mood: "playful",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "البطيخة لونها إيه من جوه؟",
        choices: ["أصفر", "أحمر", "أخضر", "أزرق"],
        answer: "أحمر",
        hint: "❤️ زي القلب",
        explanation: "البطيخ بيبقى لونه أخضر من بره وأحمر جميل من جوه [2٩٨].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-041",
        type: "quiz",
        category: "animals",
        title: "🦉 بومة سهرانة",
        description: "طيور الليل",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 2,
        targetAgeGroup: "kid",
        question: "أنهي طائر بيقدر يشوف كويس بالليل؟",
        choices: ["العصفور", "البومة", "الحمامة", "البطة"],
        answer: "البومة",
        hint: "🦉 عين واسعة",
        explanation: "البومة ربنا خلق لها عين بتشوف بيها في الضلمة عشان تصطاد [41].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-042",
        type: "quiz",
        category: "islamic",
        title: "🍎 طعام الجنة",
        description: "حاجة حلوة",
        theme: "eid-al-adha",
        mood: "warm",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "مين أول واحدة أكلت من شجر الجنة؟",
        choices: ["آمنة", "حواء", "خديجة", "فاطمة"],
        answer: "حواء",
        hint: "👩 أمنا كلنا",
        explanation: "ستنا حواء وسيدنا آدم أكلوا من الشجرة في الجنة قبل ما ينزلوا الأرض [26], [42].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-043",
        type: "quiz",
        category: "riddles",
        title: "👣 لغز الحفرة",
        description: "حاجة غريبة",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 4,
        targetAgeGroup: "kid",
        question: "إيه الحاجة اللي كل ما ناخد منها تكبر أكتر؟",
        choices: ["الشنطة", "الحفرة", "الحصالة", "العلبة"],
        answer: "الحفرة",
        hint: "🕳️ في الأرض",
        explanation: "الحفرة لما بنشيل منها تراب بتوسع وتكبر أكتر [15٨], [35٩].",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-044",
        type: "quiz",
        category: "animals",
        title: "🐧 بطريق سباح",
        description: "طائر مش بيطير",
        theme: "eid-al-adha",
        mood: "cozy",
        difficulty: 2,
        targetAgeGroup: "kid",
        question: "البطريق بيعيش في الحر ولا في الثلج؟",
        choices: ["في الحر", "في الثلج", "في الغابة", "في البيت"],
        answer: "في الثلج",
        hint: "❄️ مكان بارد",
        explanation: "البطريق بيحب اأماكن الباردة والثلج وبيعرف يسبح شاطر جداً [41].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-045",
        type: "quiz",
        category: "islamic",
        title: "🕊️ أول مؤذن",
        description: "صوت الحق",
        theme: "eid-al-adha",
        mood: "epic",
        difficulty: 2,
        targetAgeGroup: "kid",
        question: "مين أول واحد أذن في الإسلام؟",
        choices: ["أبو بكر", "بلال بن رباح", "عمر بن الخطاب", "علي بن أبي طالب"],
        answer: "بلال بن رباح",
        hint: "🗣️ صوت جميل",
        explanation: "سيدنا بلال كان صوته روعة وهو أول واحد نادى للصالة [43], [28], [16].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-046",
        type: "quiz",
        category: "nature",
        title: "🌳 ورق الشجر",
        description: "لون الطبيعة",
        theme: "eid-al-adha",
        mood: "peaceful",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "ورق الشجر لونه إيه في الربيع؟",
        choices: ["أحمر", "أخضر", "أصفر", "أبيض"],
        answer: "أخضر",
        hint: "🌿 لون الزرع",
        explanation: "الشجر بيبقى لونه أخضر جميل بفضل مادة اسمها الكلوروفيل [44].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-047",
        type: "quiz",
        category: "animals",
        title: "🦋 فراشة رقيقة",
        description: "ألوان كتير",
        theme: "eid-al-adha",
        mood: "playful",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "الفراشة كانت إيه قبل ما تبقى فراشة؟",
        choices: ["نملة", "دودة", "عصفورة", "نحلة"],
        answer: "دودة",
        hint: "🐛 بتزحف",
        explanation: "الفراشة بتبدأ حياتها دودة صغيرة وبعدين بتتحول لفراشة بتطير [41].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-04٨",
        type: "quiz",
        category: "riddles",
        title: "🧤 لغز الجوانتي",
        description: "لإيدين",
        theme: "eid-al-adha",
        mood: "cozy",
        difficulty: 3,
        targetAgeGroup: "kid",
        question: "إيه اللي له 5 صوابع بس ملوش لحم وال عظم؟",
        choices: ["اإيد", "الجوانتي", "الشراب", "الجزمة"],
        answer: "الجوانتي",
        hint: "🧤 بنلبسه في الشتا",
        explanation: "الجوانتي متفصل على شكل اإيد بس طبعاً ملوش عضم [45].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-04٩",
        type: "quiz",
        category: "islamic",
        title: "👶 أصغر صحابي",
        description: "شجاعة كبيرة",
        theme: "eid-al-adha",
        mood: "epic",
        difficulty: 3,
        targetAgeGroup: "kid",
        question: "مين أول واحد آمن بالنبي من الأطفال؟",
        choices: ["عمر بن الخطاب", "علي بن أبي طالب", "خالد بن الوليد", "زيد بن ثابت"],
        answer: "علي بن أبي طالب",
        hint: "🦁 ابن عم النبي",
        explanation: "سيدنا علي كان لسه طفل صغير لما آمن بسيدنا محمد [46], [43].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-k-050",
        type: "quiz",
        category: "nature",
        title: "🥛 لبن مفيد",
        description: "عشان نكبر",
        theme: "eid-al-adha",
        mood: "warm",
        difficulty: 1,
        targetAgeGroup: "kid",
        question: "بناخد اللبن من أنهي حيوان؟",
        choices: ["القطة", "البقرة", "الكلب", "اأرنب"],
        answer: "البقرة",
        hint: "🐄 بتقول مووو",
        explanation: "البقرة بتدينا لبن مفيد بيقوي عضمنا وسناننا [22٨].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },

    // ========================
    // محطات الكبار (Adult) - 50 سؤال
    // ========================
    {
        id: "quiz-a-001",
        type: "quiz",
        category: "science",
        title: "🧠 طاقة الدماغ",
        description: "معلومة طبية مدهشة",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 2,
        targetAgeGroup: "adult",
        question: "كم يستهلك الدماغ البشري من إجمالي طاقة الجسم اليومية؟",
        choices: ["5%", "20%", "50%", "80%"],
        answer: "20%",
        hint: "💡 خمس الطاقة",
        explanation: "رغم صغر حجمه، يستهلك الدماغ نحو 20% من الطاقة ليعمل بكفاءة [47], [1٨7].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-002",
        type: "quiz",
        category: "history",
        title: "📖 أول جامعة",
        description: "منارات العلم",
        theme: "eid-al-adha",
        mood: "epic",
        difficulty: 3,
        targetAgeGroup: "adult",
        question: "ما هي أول جامعة تأسست في التاريخ وما زالت تعمل؟",
        choices: ["جامعة أكسفورد", "جامعة هارفارد", "جامعة القرويين", "جامعة الأزهر"],
        answer: "جامعة القرويين",
        hint: "🇲🇦 في المغرب",
        explanation: "تأسست جامعة القرويين عام 859م في مدينة فاس المغربية [48].",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-003",
        type: "quiz",
        category: "geography",
        title: "🌍 أصغر دولة",
        description: "على خريطة العالم",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 1,
        targetAgeGroup: "adult",
        question: "ما هي أصغر دولة في العالم من حيث المساحة؟",
        choices: ["موناكو", "دولة الفاتيكان", "البحرين", "سان مارينو"],
        answer: "دولة الفاتيكان",
        hint: "🇮🇹 داخل إيطاليا",
        explanation: "تعتبر الفاتيكان هي الدولة الأصغر عالمياً وتقع في قلب روما [49], [٩٨], [50].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-004",
        type: "quiz",
        category: "islamic",
        title: "📜 أول سفير",
        description: "رجال حول الرسول",
        theme: "eid-al-adha",
        mood: "epic",
        difficulty: 3,
        targetAgeGroup: "adult",
        question: "من هو الصحابي الذي لُقب بأول سفير في الإسلام؟",
        choices: ["عمر بن الخطاب", "مصعب بن عمير", "أبو بكر الصديق", "خالد بن الوليد"],
        answer: "مصعب بن عمير",
        hint: "🕌 إلى المدينة",
        explanation: "أرسله النبي إلى المدينة ليعلم أهلها القرآن قبل الهجرة [51], [16].",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-005",
        type: "quiz",
        category: "science",
        title: "🐟 ذاكرة السمك",
        description: "حقيقة أم أسطورة؟",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 4,
        targetAgeGroup: "adult",
        question: "ما هي المدة الحقيقية لذاكرة السمكة الذهبية؟",
        choices: ["3 ثوانٍ", "يوم واحد", "أشهر وسنوات", "ساعة واحدة"],
        answer: "أشهر وسنوات",
        hint: "🧠 ذاكرة قوية",
        explanation: "أثبتت الأبحاث أن ذاكرتها تمتد لأشهر ويمكن تدريبها أيضاً [52], [53], [54].",
        reward: { stars: 4, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-006",
        type: "quiz",
        category: "geography",
        title: "📏 أطول دولة",
        description: "امتداد جغرافي",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 2,
        targetAgeGroup: "adult",
        question: "ما هي الدولة الأطول في العالم من الشمال إلى الجنوب؟",
        choices: ["روسيا", "تشيلي", "البرازيل", "الأرجنتين"],
        answer: "تشيلي",
        hint: "🌎 أمريكا الجنوبية",
        explanation: "تمتد تشيلي بشكل طولي فريد بين المحيط وجبال الأنديز [49], [55], [56].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-007",
        type: "quiz",
        category: "psychology",
        title: "📱 إدمان الدوبامين",
        description: "سيكولوجية الهاتف",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 3,
        targetAgeGroup: "adult",
        question: "ما هو الهرمون المسؤول عن الشعور بالمكافأة عند وصول إشعار على هاتفك؟",
        choices: ["الأدرينالين", "الدوبامين", "الأنسولين", "الكورتيزول"],
        answer: "الدوبامين",
        hint: "🧠 ناقل عصبي",
        explanation: "تعتمد تطبيقات التواصل على تحفيز الدوبامين لإبقائك متصلاً لفترة أطول [57], [58].",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-00٨",
        type: "quiz",
        category: "islamic",
        title: "🛡️ معركة أجنادين",
        description: "فتوحات الشام",
        theme: "eid-al-adha",
        mood: "epic",
        difficulty: 3,
        targetAgeGroup: "adult",
        question: "من القائد الذي حسم معركة أجنادين ضد الروم؟",
        choices: ["عمرو بن العاص", "خالد بن الوليد", "شرحبيل بن حسنة", "يزيد بن أبي سفيان"],
        answer: "خالد بن الوليد",
        hint: "⚔️ سيف الله",
        explanation: "قاد خالد بن الوليد جيوش المسلمين لتحقيق نصر ساحق في أجنادين [59], [60].",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-00٩",
        type: "quiz",
        category: "science",
        title: "💧 مكونات الدماغ",
        description: "أهمية الترطيب",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 2,
        targetAgeGroup: "adult",
        question: "كم تبلغ نسبة الماء في حجم الدماغ البشري؟",
        choices: ["20%", "50%", "75-80%", "95%"],
        answer: "75-80%",
        hint: "🌊 النسبة الأكبر",
        explanation: "يتكون الدماغ بنسبة كبيرة من الماء، لذا الجفاف يؤثر فوراً على التركيز [61], [1٨7].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-010",
        type: "quiz",
        category: "history",
        title: "⌛ الحرب الأقصر",
        description: "زمن قياسي",
        theme: "eid-al-adha",
        mood: "epic",
        difficulty: 4,
        targetAgeGroup: "adult",
        question: "كم استمرت أقصر حرب في التاريخ (بين إنجلترا وزنجبار)؟",
        choices: ["أسبوع واحد", "40 دقيقة تقريباً", "يومين", "ساعة واحدة"],
        answer: "40 دقيقة تقريباً",
        hint: "⏱️ أقل من ساعة",
        explanation: "انتهت الحرب في زمن يتراوح بين 38 إلى 45 دقيقة فقط [62], [63].",
        reward: { stars: 4, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-011",
        type: "quiz",
        category: "islamic",
        title: "📜 جمع القرآن",
        description: "حفظ الوحي",
        theme: "eid-al-adha",
        mood: "peaceful",
        difficulty: 3,
        targetAgeGroup: "adult",
        question: "من هو الصحابي الذي كلفه أبو بكر الصديق بجمع القرآن في مصحف واحد؟",
        choices: ["زيد بن ثابت", "عبد الله بن مسعود", "أبي بن كعب", "عثمان بن عفان"],
        answer: "زيد بن ثابت",
        hint: "🖋️ كاتب الوحي",
        explanation: "تم اختيار زيد بن ثابت لدقته وأمانته في تتبع آيات القرآن [46], [6٩7].",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-012",
        type: "quiz",
        category: "geography",
        title: "🏞️ أطول نهر",
        description: "شريان الحياة",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 1,
        targetAgeGroup: "adult",
        question: "ما هو أطول نهر في العالم؟",
        choices: ["نهر الأمازون", "نهر النيل", "نهر المسيسيبي", "نهر الدانوب"],
        answer: "نهر النيل",
        hint: "🇪🇬 في مصر والسودان",
        explanation: "يعتبر نهر النيل هو الأطول عالمياً ويمر عبر عدة دول أفريقية [49], [50], [32٨].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-013",
        type: "quiz",
        category: "science",
        title: "🌌 الغاز الأكثر وفرة",
        description: "في الهواء الجوي",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 3,
        targetAgeGroup: "adult",
        question: "ما هو الغاز الأكثر انتشاراً في الغلاف الجوي للأرض؟",
        choices: ["الأكسجين", "النيتروجين", "ثاني أكسيد الكربون", "الهيدروجين"],
        answer: "النيتروجين",
        hint: "💨 78% من الهواء",
        explanation: "يشكل النيتروجين النسبة الكبرى من الهواء الجوي بنحو 78% [٩٩], [56].",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-014",
        type: "quiz",
        category: "history",
        title: "🎨 الموناليزا",
        description: "أشهر لوحة",
        theme: "eid-al-adha",
        mood: "mystic",
        difficulty: 2,
        targetAgeGroup: "adult",
        question: "ما هو الاسم الآخر المشهور للوحة 'الموناليزا'؟",
        choices: ["المرأة الباسمة", "لا جيوكوندا", "سيدة الجبل", "سر الابتسامة"],
        answer: "لا جيوكوندا",
        hint: "🎨 اسم إيطالي",
        explanation: "اللوحة التي رسمها دافنشي تُعرف تاريخياً باسم 'لا جيوكوندا' [23٩].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-015",
        type: "quiz",
        category: "islamic",
        title: "🛡️ معركة اليرموك",
        description: "منعطف تاريخي",
        theme: "eid-al-adha",
        mood: "epic",
        difficulty: 4,
        targetAgeGroup: "adult",
        question: "كم كان عدد جيش المسلمين تقريباً في معركة اليرموك؟",
        choices: ["10 آلاف", "36-40 ألفاً", "100 ألف", "200 ألف"],
        answer: "36-40 ألفاً",
        hint: "⚔️ أقل من الروم بكثير",
        explanation: "واجه جيش المسلمين الصغير قوات الروم الضخمة وحقق نصراً تاريخياً [64], [74٨].",
        reward: { stars: 4, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-016",
        type: "quiz",
        category: "geography",
        title: "🇦🇺 عاصمة أستراليا",
        description: "مدن عالمية",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 2,
        targetAgeGroup: "adult",
        question: "ما هي عاصمة دولة أستراليا؟",
        choices: ["سيدني", "ملبورن", "كانبرا", "بيرث"],
        answer: "كانبرا",
        hint: "🏙️ ليست سيدني",
        explanation: "كانبرا هي العاصمة السياسية لأستراليا رغم شهرة سيدني العالمية [٩7], [56].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-017",
        type: "quiz",
        category: "science",
        title: "🧪 جائزة نوبل",
        description: "علماء عرب",
        theme: "eid-al-adha",
        mood: "epic",
        difficulty: 2,
        targetAgeGroup: "adult",
        question: "من هو العالم العربي الحاصل على جائزة نوبل في الكيمياء؟",
        choices: ["أحمد زويل", "نجيب محفوظ", "مجدي يعقوب", "فاروق الباز"],
        answer: "أحمد زويل",
        hint: "🔬 الفيمتو ثانية",
        explanation: "حصل العالم المصري أحمد زويل على الجائزة لأبحاثه في الفيمتو ثانية [٩], [56].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-01٨",
        type: "quiz",
        category: "history",
        title: "⚔️ القائد الفاتح",
        description: "فتح القسطنطينية",
        theme: "eid-al-adha",
        mood: "epic",
        difficulty: 3,
        targetAgeGroup: "adult",
        question: "من هو القائد العثماني الذي لقب بـ 'الفاتح'؟",
        choices: ["سليمان القانوني", "محمد الثاني", "أرطغرل", "سليم الأول"],
        answer: "محمد الثاني",
        hint: "🇹🇷 محمد الفاتح",
        explanation: "السلطان محمد الفاتح هو من حقق النبوءة وفتح القسطنطينية [65], [66].",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-01٩",
        type: "quiz",
        category: "psychology",
        title: "📊 قاعدة 80/20",
        description: "الإنتاجية والفعالية",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 3,
        targetAgeGroup: "adult",
        question: "ما هو الاسم العلمي للقاعدة التي تقول إن 80% من النتائج تأتي من 20% من الأسباب؟",
        choices: ["قانون نيوتن", "مبدأ باريتو", "نظرية فيثاغورس", "قانون ميلر"],
        answer: "مبدأ باريتو",
        hint: "📈 التركيز على الأهم",
        explanation: "مبدأ باريتو يستخدم في الإدارة والحياة لتحسين التركيز والنتائج [٨42].",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-020",
        type: "quiz",
        category: "islamic",
        title: "🕋 الحجر الأسود",
        description: "عبادة فريدة",
        theme: "eid-al-adha",
        mood: "mystic",
        difficulty: 4,
        targetAgeGroup: "adult",
        question: "ما هي العبادة التي لا يفعلها في اللحظة نفسها إلا شخص واحد فقط في العالم؟",
        choices: ["الصلاة", "تقبيل الحجر الأسود", "الصيام", "قراءة الفاتحة"],
        answer: "تقبيل الحجر الأسود",
        hint: "🕋 في الكعبة",
        explanation: "بسبب ضيق المكان، لا يستطيع تقبيله فعلياً إلا شخص واحد في نفس الثانية [67], [68].",
        reward: { stars: 4, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-021",
        type: "quiz",
        category: "geography",
        title: "🏜️ هضبة التبت",
        description: "تضاريس عملاقة",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 3,
        targetAgeGroup: "adult",
        question: "ما هو اللقب الجغرافي الذي يطلق على هضبة التبت؟",
        choices: ["أرض النار", "سقف العالم", "وادي النور", "هضبة الشمس"],
        answer: "سقف العالم",
        hint: "🏔️ أعلى هضبة",
        explanation: "تعتبر هضبة التبت هي الأعلى في العالم لذا تلقب بسقف العالم [69], [1٨7], [70].",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-022",
        type: "quiz",
        category: "science",
        title: "⚙️ مخترع الهاتف",
        description: "تواصل تاريخي",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 1,
        targetAgeGroup: "adult",
        question: "من هو مخترع الهاتف؟",
        choices: ["توماس أديسون", "ألكسندر جرام بيل", "نيكولا تيسلا", "ألبرت أينشتاين"],
        answer: "ألكسندر جرام بيل",
        hint: "📞 رنة الهاتف",
        explanation: "ألكسندر جرام بيل هو صاحب أول براءة اختراع للهاتف العملي [٩٨].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-023",
        type: "quiz",
        category: "history",
        title: "🚢 تيتانيك",
        description: "كارثة بحرية",
        theme: "eid-al-adha",
        mood: "epic",
        difficulty: 2,
        targetAgeGroup: "adult",
        question: "في أي محيط غرقت سفينة تيتانيك الشهيرة عام 1912؟",
        choices: ["المحيط الهادي", "المحيط الأطلسي", "المحيط الهندي", "المحيط المتجمد"],
        answer: "المحيط الأطلسي",
        hint: "🚢 شمال المحيط",
        explanation: "اصطدمت السفينة بجبل جليدي في شمال المحيط الأطلسي [1٨7].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-024",
        type: "quiz",
        category: "islamic",
        title: "🛡️ ذي النورين",
        description: "ألقاب الصحابة",
        theme: "eid-al-adha",
        mood: "warm",
        difficulty: 1,
        targetAgeGroup: "adult",
        question: "من هو الصحابي الذي لقب بـ 'ذي النورين'؟",
        choices: ["أبو بكر الصديق", "عمر بن الخطاب", "عثمان بن عفان", "علي بن أبي طالب"],
        answer: "عثمان بن عفان",
        hint: "💍 ثالث الخلفاء",
        explanation: "لقب بذي النورين لأنه تزوج من ابنتي النبي رقية وأم كلثوم [6٨].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-025",
        type: "quiz",
        category: "science",
        title: "🍎 الجاذبية والنيوتن",
        description: "قوانين الطبيعة",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 1,
        targetAgeGroup: "adult",
        question: "من هو العالم الذي اكتشف قوانين الجاذبية والحركة؟",
        choices: ["إسحاق نيوتن", "جاليليو", "كابلر", "فيثاغورس"],
        answer: "إسحاق نيوتن",
        hint: "🍎 التفاحة",
        explanation: "وضع نيوتن حجر الأساس للفيزياء الكلاسيكية باكتشاف الجاذبية [71], [32٨].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-026",
        type: "quiz",
        category: "history",
        title: "🗽 التفاحة الكبيرة",
        description: "ألقاب المدن",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 4,
        targetAgeGroup: "adult",
        question: "أي مدينة عالمية تشتهر بلقب 'التفاحة الكبيرة' (Big Apple)؟",
        choices: ["لندن", "باريس", "نيويورك", "طوكيو"],
        answer: "نيويورك",
        hint: "🇺🇸 في أمريكا",
        explanation: "هذا اللقب شاع لوصف مدينة نيويورك منذ عشرينيات القرن الماضي [72], [70].",
        reward: { stars: 4, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-027",
        type: "quiz",
        category: "islamic",
        title: "🛡️ معركة بدر",
        description: "الفرقان",
        theme: "eid-al-adha",
        mood: "epic",
        difficulty: 2,
        targetAgeGroup: "adult",
        question: "في أي عام هجري وقعت معركة بدر الكبرى؟",
        choices: ["1 هـ", "2 هـ", "3 هـ", "5 هـ"],
        answer: "2 هـ",
        hint: "🗓️ السنة الثانية",
        explanation: "وقعت أول معركة كبرى في الإسلام في رمضان من السنة الثانية للهجرة [73], [43], [74].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-02٨",
        type: "quiz",
        category: "science",
        title: "🦷 عدد الأسنان",
        description: "تشريح الجسم",
        theme: "eid-al-adha",
        mood: "warm",
        difficulty: 1,
        targetAgeGroup: "adult",
        question: "كم عدد الأسنان لدى الإنسان البالغ؟",
        choices: ["20", "2٨", "32", "36"],
        answer: "32",
        hint: "🦷 كاملة بالضروس",
        explanation: "يمتلك الإنسان البالغ عادة 32 سناً تشمل ضروس العقل [٩7], [71], [10].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-02٩",
        type: "quiz",
        category: "geography",
        title: "❄️ أبرد مكان",
        description: "أرض الجليد",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 3,
        targetAgeGroup: "adult",
        question: "ما هي الدولة التي تُعرف بلقب 'أرض النار والجليد'؟",
        choices: ["النرويج", "كندا", "أيسلندا", "روسيا"],
        answer: "أيسلندا",
        hint: "🌋 براكين وجليد",
        explanation: "لقبت أيسلندا بذلك لوجود البراكين النشطة بجانب الأنهار الجليدية [72].",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-030",
        type: "quiz",
        category: "psychology",
        title: "🕯️ نصل أوكام",
        description: "نماذج عقلية",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 4,
        targetAgeGroup: "adult",
        question: "ماذا يقترح نموذج 'نصل أوكام' العقلي عند وجود تفسيرين لظاهرة ما؟",
        choices: ["التفسير الأكثر تعقيداً", "التفسير الأبسط هو الأرجح", "إهمال التفسيرين", "التفسير الأقدم"],
        answer: "التفسير الأبسط هو الأرجح",
        hint: "✂️ قاعدة البساطة",
        explanation: "عندما تتساوى جميع العوامل، يكون التفسير الذي يتطلب افتراضات أقل هو الصحيح غالباً [٨43].",
        reward: { stars: 4, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-031",
        type: "quiz",
        category: "islamic",
        title: "🛡️ أمين الأمة",
        description: "ألقاب الصحابة",
        theme: "eid-al-adha",
        mood: "warm",
        difficulty: 3,
        targetAgeGroup: "adult",
        question: "من هو الصحابي الذي لقبه النبي بـ 'أمين هذه الأمة'؟",
        choices: ["أبو بكر الصديق", "أبو عبيدة بن الجراح", "عمر بن الخطاب", "سعد بن معاذ"],
        answer: "أبو عبيدة بن الجراح",
        hint: "🛡️ فاتح الشام",
        explanation: "قال عنه النبي صلى الله عليه وسلم: 'لكل أمة أمين، وأمين هذه الأمة أبو عبيدة' [46].",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-032",
        type: "quiz",
        category: "science",
        title: "💓 لغز القلوب",
        description: "كائنات بحرية",
        theme: "eid-al-adha",
        mood: "playful",
        difficulty: 2,
        targetAgeGroup: "adult",
        question: "أي حيوان يمتلك قلباً في رأسه؟",
        choices: ["الأخطبوط", "الجمبري (الروبيان)", "الحوت", "القرش"],
        answer: "الجمبري (الروبيان)",
        hint: "🦐 قشريات",
        explanation: "من الحقائق الغريبة أن قلب الجمبري يقع فعلياً في منطقة الرأس [29].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-033",
        type: "quiz",
        category: "history",
        title: "📜 حجر رشيد",
        description: "فك الرموز",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 3,
        targetAgeGroup: "adult",
        question: "ما هي اللغة التي ساعد 'حجر رشيد' في فك رموزها؟",
        choices: ["اللغة اللاتينية", "اللغة الهيروغليفية", "اللغة السومرية", "اللغة اليونانية"],
        answer: "اللغة الهيروغليفية",
        hint: "🇪🇬 قدماء المصريين",
        explanation: "بفضل حجر رشيد، استطاع العلماء فهم كتابات المصريين القدماء [10٨].",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-034",
        type: "quiz",
        category: "geography",
        title: "🌊 أعمق نقطة",
        description: "تحت سطح البحر",
        theme: "eid-al-adha",
        mood: "mystic",
        difficulty: 4,
        targetAgeGroup: "adult",
        question: "ما هو اسم أعمق مكان على سطح الأرض؟",
        choices: ["بئر كولا", "خندق ماريانا", "البحر الميت", "جراند كانيون"],
        answer: "خندق ماريانا",
        hint: "🌊 في المحيط الهادي",
        explanation: "خندق ماريانا هو أعمق نقطة في المحيطات، ويصل عمقه لنحو 11 كم [70].",
        reward: { stars: 4, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-035",
        type: "quiz",
        category: "islamic",
        title: "📜 صلح الحديبية",
        description: "فتح مبين",
        theme: "eid-al-adha",
        mood: "peaceful",
        difficulty: 3,
        targetAgeGroup: "adult",
        question: "من هو الصحابي الذي أصر على كتابة 'محمد رسول الله' في الصلح رغم اعتراض قريش؟",
        choices: ["عمر بن الخطاب", "علي بن أبي طالب", "أبو بكر الصديق", "عثمان بن عفان"],
        answer: "علي بن أبي طالب",
        hint: "🖋️ كاتب الصلح",
        explanation: "رفض علي بن أبي طالب محو صفة الرسول من العقد لشدة حبه وإيمانه [75].",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-036",
        type: "quiz",
        category: "science",
        title: "⚡ مخترع المصباح",
        description: "عالم التنوير",
        theme: "eid-al-adha",
        mood: "warm",
        difficulty: 1,
        targetAgeGroup: "adult",
        question: "من هو العالم الذي اخترع المصباح الكهربائي؟",
        choices: ["توماس أديسون", "نيكولا تيسلا", "جراهام بيل", "آينشتاين"],
        answer: "توماس أديسون",
        hint: "💡 نور البيت",
        explanation: "توماس أديسون هو من أهدى العالم الضوء من خلال اختراع المصباح [49].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-037",
        type: "quiz",
        category: "history",
        title: "🏛️ عجائب بابل",
        description: "تاريخ قديم",
        theme: "eid-al-adha",
        mood: "mystic",
        difficulty: 2,
        targetAgeGroup: "adult",
        question: "أين تقع 'الحدائق المعلقة' إحدى عجائب الدنيا السبع القديمة؟",
        choices: ["مصر", "العراق", "اليونان", "سوريا"],
        answer: "العراق",
        hint: "🇮🇶 في مدينة بابل",
        explanation: "بنيت الحدائق المعلقة في مدينة بابل التاريخية في بلاد الرافدين [63].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-03٨",
        type: "quiz",
        category: "geography",
        title: "🗺️ قناة السويس",
        description: "ممر عالمي",
        theme: "eid-al-adha",
        mood: "epic",
        difficulty: 1,
        targetAgeGroup: "adult",
        question: "ما هي القناة التي تربط بين البحر الأحمر والبحر المتوسط؟",
        choices: ["قناة بنما", "قناة السويس", "قناة كيل", "قناة كورنث"],
        answer: "قناة السويس",
        hint: "🇪🇬 في مصر",
        explanation: "قناة السويس هي أهم ممر ملاحي يربط الشرق بالغرب عبر مصر [76].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-03٩",
        type: "quiz",
        category: "psychology",
        title: "🧠 الذاكرة العاملة",
        description: "سعة التذكر",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 4,
        targetAgeGroup: "adult",
        question: "ما هو عدد العناصر التي تستطيع الذاكرة قصيرة المدى حفظها في نفس الوقت (قانون ميلر)؟",
        choices: ["3 فقط", "7 (زائد أو ناقص 2)", "20 عنصر", "100 عنصر"],
        answer: "7 (زائد أو ناقص 2)",
        hint: "🔢 رقم سحري",
        explanation: "تستوعب ذاكرتنا قصيرة المدى ما بين 5 إلى 9 عناصر فقط في اللحظة الواحدة [77].",
        reward: { stars: 4, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-040",
        type: "quiz",
        category: "islamic",
        title: "🕌 المسجد الأقصى",
        description: "أولى القبلتين",
        theme: "eid-al-adha",
        mood: "mystic",
        difficulty: 2,
        targetAgeGroup: "adult",
        question: "في أي دولة عربية يوجد المسجد الأقصى المبارك؟",
        choices: ["الأردن", "فلسطين", "السعودية", "مصر"],
        answer: "فلسطين",
        hint: "🇵🇸 القدس الشريف",
        explanation: "يقع المسجد الأقصى في مدينة القدس بدولة فلسطين [26].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-041",
        type: "quiz",
        category: "science",
        title: "🦷 أصغر عظمة",
        description: "في جسم الإنسان",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 3,
        targetAgeGroup: "adult",
        question: "أين تقع أصغر عظمة في جسم الإنسان؟",
        choices: ["في إصبع القدم", "في الأنف", "في الأذن الوسطى", "في اليد"],
        answer: "في الأذن الوسطى",
        hint: "👂 حاسة السمع",
        explanation: "عظمة 'الركاب' الموجودة في الأذن هي الأصغر في هيكلنا العظمي [78], [79], [10].",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-042",
        type: "quiz",
        category: "history",
        title: "⚔️ صلاح الدين",
        description: "تحرير القدس",
        theme: "eid-al-adha",
        mood: "epic",
        difficulty: 2,
        targetAgeGroup: "adult",
        question: "ما هي المعركة الشهيرة التي انتصر فيها صلاح الدين على الصليبيين؟",
        choices: ["معركة اليرموك", "معركة حطين", "معركة القادسية", "معركة عين جالوت"],
        answer: "معركة حطين",
        hint: "⚔️ تحرير بيت المقدس",
        explanation: "فتح نصر حطين الطريق أمام صلاح الدين الأيوبي لاستعادة القدس [69], [6٩].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-043",
        type: "quiz",
        category: "geography",
        title: "🇧🇿 أكبر دولة عربية",
        description: "من حيث المساحة",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 1,
        targetAgeGroup: "adult",
        question: "ما هي أكبر دولة عربية من حيث المساحة حالياً؟",
        choices: ["مصر", "السعودية", "الجزائر", "السودان"],
        answer: "الجزائر",
        hint: "🇩🇿 في شمال أفريقيا",
        explanation: "أصبحت الجزائر هي الأكبر مساحة عربياً وأفريقياً بعد تقسيم السودان [49].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-044",
        type: "quiz",
        category: "psychology",
        title: "💡 انحياز التوافر",
        description: "خداع العقل",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 4,
        targetAgeGroup: "adult",
        question: "ما هو 'انحياز التوافر' (Availability Bias)؟",
        choices: ["تذكر الأشياء القديمة فقط", "الحكم بناءً على أحدث التجارب السهلة للتذكر", "توقع المستقبل دائماً", "حب الأشياء المتوفرة في السوق"],
        answer: "الحكم بناءً على أحدث التجارب السهلة للتذكر",
        hint: "🧠 الذاكرة الحديثة",
        explanation: "يميل عقلنا للمبالغة في أهمية المعلومات التي نتذكرها بسهولة مؤخراً [٨45].",
        reward: { stars: 4, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-045",
        type: "quiz",
        category: "islamic",
        title: "🕌 أول مسجد",
        description: "تاريخ البناء",
        theme: "eid-al-adha",
        mood: "warm",
        difficulty: 1,
        targetAgeGroup: "adult",
        question: "ما هو أول مسجد بُني في الإسلام؟",
        choices: ["المسجد الحرام", "المسجد النبوي", "مسجد قباء", "المسجد الأقصى"],
        answer: "مسجد قباء",
        hint: "🕌 قبل المدينة",
        explanation: "بناه النبي صلى الله عليه وسلم عند وصوله إلى قباء قبل دخول المدينة [12٩].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-046",
        type: "quiz",
        category: "science",
        title: "🧪 الأنسولين",
        description: "هرمونات الجسم",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 2,
        targetAgeGroup: "adult",
        question: "أي عضو في جسم الإنسان هو المسؤول عن إنتاج هرمون الأنسولين؟",
        choices: ["الكبد", "البنكرياس", "الكلى", "المعدة"],
        answer: "البنكرياس",
        hint: "🧪 تنظيم السكر",
        explanation: "يقوم البنكرياس بإنتاج الأنسولين لتنظيم مستوى السكر في الدم [٩٨], [56].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-047",
        type: "quiz",
        category: "history",
        title: "🏛️ الأهرامات",
        description: "بناء خالد",
        theme: "eid-al-adha",
        mood: "epic",
        difficulty: 1,
        targetAgeGroup: "adult",
        question: "من هم بناة أهرامات الجيزة في مصر؟",
        choices: ["الرومان", "قدماء المصريين", "اليونان", "البابليون"],
        answer: "قدماء المصريين",
        hint: "🇪🇬 الفراعنة",
        explanation: "بنيت الأهرامات كمقابر للملوك خوفو وخفرع ومنقرع في مصر القديمة [44].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-04٨",
        type: "quiz",
        category: "geography",
        title: "⛰️ قمة العالم",
        description: "أعلى جبل",
        theme: "eid-al-adha",
        mood: "epic",
        difficulty: 1,
        targetAgeGroup: "adult",
        question: "ما هي أعلى قمة جبلية في العالم؟",
        choices: ["جبل كليمنجارو", "جبل إيفرست", "جبل سانت كاترين", "جبل السودة"],
        answer: "جبل إيفرست",
        hint: "🏔️ في الهملايا",
        explanation: "جبل إيفرست هو القمة الأعلى على مستوى سطح البحر في العالم [1٨7], [44], [70].",
        reward: { stars: 1, canUnlockTreasure: false },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-04٩",
        type: "quiz",
        category: "psychology",
        title: "🤝 المعاملة بالمثل",
        description: "قواعد الإقناع",
        theme: "eid-al-adha",
        mood: "curious",
        difficulty: 3,
        targetAgeGroup: "adult",
        question: "لماذا نشعر برغبة قوية في رد الجميل لمن قدم لنا هدية؟",
        choices: ["بسبب الخوف", "قاعدة 'المعاملة بالمثل'", "بسبب الطمع", "مجرد صدفة"],
        answer: "قاعدة 'المعاملة بالمثل'",
        hint: "🎁 هات وخد",
        explanation: "هذا ميل نفسي طبيعي يجعلنا نريد موازنة العالقة مع الآخرين [٨71].",
        reward: { stars: 3, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },
    {
        id: "quiz-a-050",
        type: "quiz",
        category: "islamic",
        title: "📜 ليلة القدر",
        description: "ليلة مباركة",
        theme: "eid-al-adha",
        mood: "mystic",
        difficulty: 2,
        targetAgeGroup: "adult",
        question: "العبادة في 'ليلة القدر' خير من كم شهر؟",
        choices: ["100 شهر", "1000 شهر", "سنة واحدة", "10 سنوات"],
        answer: "1000 شهر",
        hint: "🌙 في رمضان",
        explanation: "قال تعالى: 'ليلة القدر خير من ألف شهر' لعظم أجرها [1], [11٩].",
        reward: { stars: 2, canUnlockTreasure: true },
        tinyMissionPool: eidMissions,
    },

];
