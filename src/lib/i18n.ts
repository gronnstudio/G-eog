// Bilingual-plus interface strings. Every user-facing chrome string is a
// Localized pair keyed by locale; English is required and used as the
// fallback for any language that hasn't been translated yet, so the
// switcher can offer the world's most-spoken languages without every
// string existing in all of them.

export type Locale =
  | "en"
  | "zh"
  | "hi"
  | "es"
  | "fr"
  | "ar"
  | "pt"
  | "ru"
  | "de"
  | "ja"
  | "nl"

// English is mandatory; the rest are optional and fall back to English.
export type L = { en: string } & Partial<Record<Locale, string>>

export interface LocaleMeta {
  locale: Locale
  /** Endonym — the language's own name, as shown in the picker. */
  name: string
  /** Regional flag emoji used as the language's glyph. */
  flag: string
  /** Right-to-left script (Arabic). */
  rtl?: boolean
}

// Ordered by number of speakers worldwide, with Dutch kept at the end as
// GRØNN Studio's second language. Flags are the conventional language
// proxies (a language is not a country, but these read instantly).
export const LOCALES: LocaleMeta[] = [
  { locale: "en", name: "English", flag: "🇬🇧" },
  { locale: "zh", name: "中文", flag: "🇨🇳" },
  { locale: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { locale: "es", name: "Español", flag: "🇪🇸" },
  { locale: "fr", name: "Français", flag: "🇫🇷" },
  { locale: "ar", name: "العربية", flag: "🇸🇦", rtl: true },
  { locale: "pt", name: "Português", flag: "🇵🇹" },
  { locale: "ru", name: "Русский", flag: "🇷🇺" },
  { locale: "de", name: "Deutsch", flag: "🇩🇪" },
  { locale: "ja", name: "日本語", flag: "🇯🇵" },
  { locale: "nl", name: "Nederlands", flag: "🇳🇱" },
]

export const LOCALE_BY_CODE = new Map(LOCALES.map((l) => [l.locale, l]))

export const DEFAULT_LOCALE: Locale = "en"

export const LOCALE_KEY = "eog-locale"

const VALID = new Set(LOCALES.map((l) => l.locale))

export function isLocale(value: string | null): value is Locale {
  return value != null && VALID.has(value as Locale)
}

/** Resolve a Localized string, falling back to English when untranslated. */
export function pick(l: L, locale: Locale): string {
  return l[locale] ?? l.en
}

// Interface strings across every offered language; anything missing falls
// back to English via pick(). Generated with a localization pass.
export const UI = {
  nav_home: { en: "Home", nl: "Home", zh: "首页", hi: "होम", es: "Inicio", fr: "Accueil", ar: "الرئيسية", pt: "Início", ru: "Главная", de: "Startseite", ja: "ホーム" },
  nav_explore: { en: "Explore", nl: "Verkennen", zh: "探索", hi: "अन्वेषण", es: "Explorar", fr: "Explorer", ar: "استكشاف", pt: "Explorar", ru: "Обзор", de: "Entdecken", ja: "探索" },
  nav_knowledge: { en: "Knowledge", nl: "Kennis", zh: "知识", hi: "ज्ञान", es: "Conocimiento", fr: "Savoir", ar: "المعرفة", pt: "Conhecimento", ru: "Знание", de: "Wissen", ja: "知識" },
  nav_learn: { en: "Learn", nl: "Leren", zh: "学习", hi: "सीखें", es: "Aprender", fr: "Apprendre", ar: "التعلّم", pt: "Aprender", ru: "Учиться", de: "Lernen", ja: "学ぶ" },
  nav_community: { en: "Community", nl: "Gemeenschap", zh: "社区", hi: "समुदाय", es: "Comunidad", fr: "Communauté", ar: "المجتمع", pt: "Comunidade", ru: "Сообщество", de: "Gemeinschaft", ja: "コミュニティ" },
  nav_about: { en: "About", nl: "Over", zh: "关于", hi: "परिचय", es: "Acerca de", fr: "À propos", ar: "حول", pt: "Sobre", ru: "О проекте", de: "Über", ja: "概要" },
  nav_stories: { en: "Stories", nl: "Verhalen", zh: "故事", hi: "कहानियाँ", es: "Historias", fr: "Récits", ar: "قصص", pt: "Histórias", ru: "Истории", de: "Geschichten", ja: "ストーリー" },
  search: { en: "Search", nl: "Zoeken", zh: "搜索", hi: "खोज", es: "Buscar", fr: "Rechercher", ar: "بحث", pt: "Buscar", ru: "Поиск", de: "Suchen", ja: "検索" },
  exploreGraph: { en: "Explore the Graph", nl: "Verken de graaf", zh: "探索知识图谱", hi: "ग्राफ़ का अन्वेषण करें", es: "Explorar el grafo", fr: "Explorer le graphe", ar: "استكشف الرسم البياني", pt: "Explorar o grafo", ru: "Исследовать граф", de: "Den Graphen entdecken", ja: "グラフを探索する" },
  menu: { en: "Menu", nl: "Menu", zh: "菜单", hi: "मेन्यू", es: "Menú", fr: "Menu", ar: "القائمة", pt: "Menu", ru: "Меню", de: "Menü", ja: "メニュー" },
  close: { en: "Close", nl: "Sluiten", zh: "关闭", hi: "बंद करें", es: "Cerrar", fr: "Fermer", ar: "إغلاق", pt: "Fechar", ru: "Закрыть", de: "Schließen", ja: "閉じる" },
  navigate: { en: "Navigate the system", nl: "Navigeer door het systeem", zh: "浏览系统", hi: "सिस्टम में नेविगेट करें", es: "Navega por el sistema", fr: "Naviguer dans le système", ar: "تصفّح النظام", pt: "Navegue pelo sistema", ru: "Навигация по системе", de: "Durch das System navigieren", ja: "システムを巡る" },
  language: { en: "Language", nl: "Taal", zh: "语言", hi: "भाषा", es: "Idioma", fr: "Langue", ar: "اللغة", pt: "Idioma", ru: "Язык", de: "Sprache", ja: "言語" },
  theme: { en: "Theme", nl: "Thema", zh: "主题", hi: "थीम", es: "Tema", fr: "Thème", ar: "المظهر", pt: "Tema", ru: "Тема", de: "Design", ja: "テーマ" },
  auto: { en: "Auto", nl: "Automatisch", zh: "自动", hi: "स्वतः", es: "Automático", fr: "Auto", ar: "تلقائي", pt: "Automático", ru: "Авто", de: "Automatisch", ja: "自動" },
  heroKicker: { en: "The living knowledge ecosystem", nl: "Het levende kennisecosysteem", zh: "生生不息的知识生态", hi: "जीवंत ज्ञान पारितंत्र", es: "El ecosistema vivo del conocimiento", fr: "L’écosystème vivant du savoir", ar: "منظومة المعرفة الحيّة", pt: "O ecossistema vivo do conhecimento", ru: "Живая экосистема знаний", de: "Das lebendige Wissensökosystem", ja: "生きた知の生態系" },
  heroHeadline: { en: "Knowledge grows when everything connects.", nl: "Kennis groeit wanneer alles verbonden raakt.", zh: "万物相连，知识生长。", hi: "जब सब कुछ जुड़ता है, तब ज्ञान पनपता है।", es: "El conocimiento crece cuando todo se conecta.", fr: "Le savoir grandit lorsque tout se relie.", ar: "تنمو المعرفة حين يتّصل كلُّ شيء.", pt: "O conhecimento cresce quando tudo se conecta.", ru: "Знание растёт, когда всё соединяется.", de: "Wissen wächst, wenn sich alles verbindet.", ja: "すべてがつながるとき、知は育つ。" },
  heroBody: { en: "Equilibrium makes humanity's ecological knowledge freely accessible, beautifully organized and endlessly connected. Explore soil, water, forests, fungi and climate as one living graph.", nl: "Equilibrium maakt de ecologische kennis van de mensheid vrij toegankelijk, prachtig geordend en eindeloos verbonden. Verken bodem, water, bossen, schimmels en klimaat als één levende graaf.", zh: "Equilibrium 让人类的生态知识自由开放、井然有序、无尽相连。将土壤、水、森林、真菌与气候作为一张生生不息的图谱来探索。", hi: "Equilibrium मानवता के पारिस्थितिक ज्ञान को स्वतंत्र रूप से सुलभ, सुंदर ढंग से व्यवस्थित और अनंत रूप से जुड़ा हुआ बनाता है। मिट्टी, जल, वन, कवक और जलवायु को एक जीवंत ग्राफ़ के रूप में जानें।", es: "Equilibrium hace que el conocimiento ecológico de la humanidad sea libremente accesible, bellamente organizado e infinitamente conectado. Explora el suelo, el agua, los bosques, los hongos y el clima como un solo grafo vivo.", fr: "Equilibrium rend le savoir écologique de l’humanité librement accessible, magnifiquement organisé et infiniment relié. Explorez le sol, l’eau, les forêts, les champignons et le climat comme un seul graphe vivant.", ar: "يجعل Equilibrium معرفة البشرية البيئية متاحةً بحرية، ومنظّمةً بجمال، ومترابطةً بلا حدود. استكشف التربة والماء والغابات والفطريات والمناخ كرسمٍ بيانيٍّ حيٍّ واحد.", pt: "O Equilibrium torna o conhecimento ecológico da humanidade livremente acessível, lindamente organizado e infinitamente conectado. Explore solo, água, florestas, fungos e clima como um único grafo vivo.", ru: "Equilibrium делает экологические знания человечества свободно доступными, изящно упорядоченными и бесконечно связанными. Исследуйте почву, воду, леса, грибы и климат как единый живой граф.", de: "Equilibrium macht das ökologische Wissen der Menschheit frei zugänglich, wunderbar geordnet und endlos vernetzt. Erkunde Boden, Wasser, Wälder, Pilze und Klima als einen lebendigen Graphen.", ja: "Equilibrium は、人類の生態学的知識を自由に開かれ、美しく整理され、限りなくつながったものにします。土壌、水、森林、菌類、気候を一つの生きたグラフとして探索しましょう。" },
  startLearning: { en: "Start learning", nl: "Begin met leren", zh: "开始学习", hi: "सीखना शुरू करें", es: "Empezar a aprender", fr: "Commencer à apprendre", ar: "ابدأ التعلّم", pt: "Começar a aprender", ru: "Начать обучение", de: "Loslernen", ja: "学びを始める" },
  contribute: { en: "Contribute", nl: "Bijdragen", zh: "参与贡献", hi: "योगदान दें", es: "Contribuir", fr: "Contribuer", ar: "ساهم", pt: "Contribuir", ru: "Внести вклад", de: "Mitwirken", ja: "貢献する" },
  statArticles: { en: "Articles", nl: "Artikelen", zh: "文章", hi: "लेख", es: "Artículos", fr: "Articles", ar: "مقالات", pt: "Artigos", ru: "Статьи", de: "Artikel", ja: "記事" },
  statDomains: { en: "Domains", nl: "Domeinen", zh: "领域", hi: "क्षेत्र", es: "Dominios", fr: "Domaines", ar: "مجالات", pt: "Domínios", ru: "Области", de: "Bereiche", ja: "分野" },
  statConnections: { en: "Connections", nl: "Verbindingen", zh: "连接", hi: "संबंध", es: "Conexiones", fr: "Connexions", ar: "روابط", pt: "Conexões", ru: "Связи", de: "Verbindungen", ja: "つながり" },
  featuredArticle: { en: "Featured article", nl: "Uitgelicht artikel", zh: "精选文章", hi: "विशेष लेख", es: "Artículo destacado", fr: "Article à la une", ar: "مقال مميّز", pt: "Artigo em destaque", ru: "Избранная статья", de: "Empfohlener Artikel", ja: "注目の記事" },
  searchEcosystem: { en: "Search the ecosystem", nl: "Doorzoek het ecosysteem", zh: "搜索生态系统", hi: "पारितंत्र में खोजें", es: "Buscar en el ecosistema", fr: "Rechercher dans l’écosystème", ar: "ابحث في المنظومة", pt: "Buscar no ecossistema", ru: "Поиск по экосистеме", de: "Das Ökosystem durchsuchen", ja: "生態系を検索する" },
  previous: { en: "Previous", nl: "Vorige", zh: "上一个", hi: "पिछला", es: "Anterior", fr: "Précédent", ar: "السابق", pt: "Anterior", ru: "Назад", de: "Zurück", ja: "前へ" },
  next: { en: "Next", nl: "Volgende", zh: "下一个", hi: "अगला", es: "Siguiente", fr: "Suivant", ar: "التالي", pt: "Próximo", ru: "Далее", de: "Weiter", ja: "次へ" },
  allDomains: { en: "All domains", nl: "Alle domeinen", zh: "所有领域", hi: "सभी क्षेत्र", es: "Todos los dominios", fr: "Tous les domaines", ar: "جميع المجالات", pt: "Todos os domínios", ru: "Все области", de: "Alle Bereiche", ja: "すべての分野" },
} satisfies Record<string, L>
