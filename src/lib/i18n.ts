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

import { UI_CHROME } from "./i18n-chrome"
import { UI_PAGES } from "./i18n-pages"

// Interface strings across every offered language; anything missing falls
// back to English via pick(). Generated with a localization pass. Chrome
// (footer/dock/menus) and inner-page strings live in sibling modules and
// merge here so sweeps don't collide in one file.
const UI_CORE = {
  nav_home: { en: "Home", nl: "Home", zh: "首页", hi: "होम", es: "Inicio", fr: "Accueil", ar: "الرئيسية", pt: "Início", ru: "Главная", de: "Startseite", ja: "ホーム" },
  nav_explore: { en: "Explore", nl: "Verkennen", zh: "探索", hi: "अन्वेषण", es: "Explorar", fr: "Explorer", ar: "استكشاف", pt: "Explorar", ru: "Обзор", de: "Entdecken", ja: "探索" },
  nav_knowledge: { en: "Knowledge", nl: "Kennis", zh: "知识", hi: "ज्ञान", es: "Conocimiento", fr: "Savoir", ar: "المعرفة", pt: "Conhecimento", ru: "Знание", de: "Wissen", ja: "知識" },
  nav_learn: { en: "Learn", nl: "Leren", zh: "学习", hi: "सीखें", es: "Aprender", fr: "Apprendre", ar: "التعلّم", pt: "Aprender", ru: "Учиться", de: "Lernen", ja: "学ぶ" },
  nav_apply: { en: "Apply", nl: "Toepassen", zh: "应用", hi: "लागू करें", es: "Aplicar", fr: "Appliquer", ar: "التطبيق", pt: "Aplicar", ru: "Применение", de: "Anwenden", ja: "実践" },
  nav_evidence: { en: "Evidence", nl: "Onderbouwing", zh: "证据", hi: "प्रमाण", es: "Evidencia", fr: "Preuves", ar: "الأدلة", pt: "Evidência", ru: "Доказательства", de: "Belege", ja: "エビデンス" },
  nav_community: { en: "Community", nl: "Gemeenschap", zh: "社区", hi: "समुदाय", es: "Comunidad", fr: "Communauté", ar: "المجتمع", pt: "Comunidade", ru: "Сообщество", de: "Gemeinschaft", ja: "コミュニティ" },
  nav_about: { en: "About", nl: "Over", zh: "关于", hi: "परिचय", es: "Acerca de", fr: "À propos", ar: "حول", pt: "Sobre", ru: "О проекте", de: "Über", ja: "概要" },
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
  crownJewel: { en: "The crown jewel", nl: "Het kroonjuweel", zh: "皇冠上的明珠", hi: "मुकुट का रत्न", es: "La joya de la corona", fr: "Le joyau de la couronne", ar: "جوهرة التاج", pt: "A joia da coroa", ru: "Жемчужина", de: "Das Kronjuwel", ja: "王冠の宝石" },
  graphHeadline: { en: "Every idea is a node. Every relationship, a living thread.", nl: "Elk idee is een knoop. Elke relatie een levende draad.", zh: "每个想法都是节点，每段关系都是活的丝线。", hi: "हर विचार एक नोड है। हर संबंध, एक जीवित धागा।", es: "Cada idea es un nodo. Cada relación, un hilo vivo.", fr: "Chaque idée est un nœud. Chaque relation, un fil vivant.", ar: "كل فكرة عقدة، وكل علاقة خيط حي.", pt: "Cada ideia é um nó. Cada relação, um fio vivo.", ru: "Каждая идея — узел. Каждая связь — живая нить.", de: "Jede Idee ist ein Knoten. Jede Beziehung ein lebendiger Faden.", ja: "すべてのアイデアはノード。すべての関係は生きた糸。" },
  openFullGraph: { en: "Open full graph", nl: "Open volledige graaf", zh: "打开完整图谱", hi: "पूरा ग्राफ़ खोलें", es: "Abrir el grafo completo", fr: "Ouvrir le graphe complet", ar: "افتح الرسم الكامل", pt: "Abrir o grafo completo", ru: "Открыть весь граф", de: "Ganzen Graphen öffnen", ja: "全体グラフを開く" },
  phil1t: { en: "Everything is connected", nl: "Alles is verbonden", zh: "万物相连", hi: "सब कुछ जुड़ा है", es: "Todo está conectado", fr: "Tout est relié", ar: "كل شيء مترابط", pt: "Tudo está conectado", ru: "Всё связано", de: "Alles ist verbunden", ja: "すべてはつながっている" },
  phil1b: { en: "No page is an island. Each concept links outward, so curiosity always has somewhere to go.", nl: "Geen pagina is een eiland. Elk concept verwijst verder, dus nieuwsgierigheid kan altijd ergens heen.", zh: "没有一页是孤岛。每个概念都向外连接，好奇心总有去处。", hi: "कोई पृष्ठ द्वीप नहीं है। हर अवधारणा बाहर की ओर जुड़ती है, इसलिए जिज्ञासा को हमेशा राह मिलती है।", es: "Ninguna página es una isla. Cada concepto enlaza hacia fuera, así la curiosidad siempre tiene adónde ir.", fr: "Aucune page n'est une île. Chaque concept relie vers l'extérieur : la curiosité a toujours où aller.", ar: "لا صفحة جزيرة معزولة. كل مفهوم يرتبط بغيره، فلا يقف الفضول أبداً.", pt: "Nenhuma página é uma ilha. Cada conceito liga para fora, e a curiosidade sempre tem para onde ir.", ru: "Ни одна страница не остров. Каждое понятие ведёт дальше — любопытству всегда есть куда идти.", de: "Keine Seite ist eine Insel. Jedes Konzept verweist nach außen — Neugier hat immer ein Ziel.", ja: "孤島のページはありません。概念は外へつながり、好奇心には常に行き先があります。" },
  phil2t: { en: "Knowledge behaves like nature", nl: "Kennis gedraagt zich als natuur", zh: "知识如自然", hi: "ज्ञान प्रकृति की तरह है", es: "El conocimiento se comporta como la naturaleza", fr: "Le savoir se comporte comme la nature", ar: "المعرفة تسلك سلوك الطبيعة", pt: "O conhecimento se comporta como a natureza", ru: "Знание ведёт себя как природа", de: "Wissen verhält sich wie Natur", ja: "知識は自然のようにふるまう" },
  phil2b: { en: "Interconnected, evolving, adaptive and beautiful — organized the way an ecosystem organizes itself.", nl: "Verbonden, evoluerend, adaptief en mooi — geordend zoals een ecosysteem zichzelf ordent.", zh: "互联、演化、自适应而美丽——像生态系统那样自我组织。", hi: "परस्पर जुड़ा, विकसित होता, अनुकूल और सुंदर — जैसे कोई पारितंत्र स्वयं को व्यवस्थित करता है।", es: "Interconectado, evolutivo, adaptable y bello — organizado como se organiza un ecosistema.", fr: "Interconnecté, évolutif, adaptatif et beau — organisé comme s'organise un écosystème.", ar: "مترابطة، متطورة، متكيفة وجميلة — منظمة كما ينظم النظام البيئي نفسه.", pt: "Interligado, evolutivo, adaptável e belo — organizado como um ecossistema se organiza.", ru: "Взаимосвязано, эволюционирует, адаптивно и красиво — устроено как экосистема.", de: "Vernetzt, evolvierend, anpassungsfähig und schön — geordnet wie ein Ökosystem sich selbst ordnet.", ja: "相互につながり、進化し、適応し、美しい——生態系が自らを組織するように。" },
  phil3t: { en: "Open by design", nl: "Open van opzet", zh: "生而开放", hi: "स्वभाव से खुला", es: "Abierto por diseño", fr: "Ouvert par conception", ar: "مفتوح بالتصميم", pt: "Aberto por concepção", ru: "Открытость в основе", de: "Offen von Grund auf", ja: "設計から開かれている" },
  phil3b: { en: "Every article is editable on GitHub, peer-reviewed and freely licensed. This is knowledge as a commons.", nl: "Elk artikel is bewerkbaar op GitHub, peer-reviewed en vrij gelicentieerd. Dit is kennis als gemeengoed.", zh: "每篇文章都可在 GitHub 上编辑、经同行评审并自由授权。这是作为公共资源的知识。", hi: "हर लेख GitHub पर संपादन योग्य, समीक्षित और मुक्त लाइसेंस वाला है। यह साझा संपदा के रूप में ज्ञान है।", es: "Cada artículo es editable en GitHub, revisado por pares y con licencia libre. Es el conocimiento como bien común.", fr: "Chaque article est modifiable sur GitHub, relu par des pairs et sous licence libre. C'est le savoir comme bien commun.", ar: "كل مقال قابل للتحرير على GitHub، ومراجع، ومرخص بحرية. إنها المعرفة كمشاع.", pt: "Cada artigo é editável no GitHub, revisado por pares e com licença livre. É o conhecimento como bem comum.", ru: "Каждая статья редактируется на GitHub, рецензируется и свободно лицензируется. Знание как общее достояние.", de: "Jeder Artikel ist auf GitHub editierbar, peer-reviewed und frei lizenziert. Wissen als Gemeingut.", ja: "すべての記事は GitHub で編集でき、査読され、自由なライセンスの下にあります。知識はコモンズです。" },
  ribbonLabel: { en: "Living ribbon", nl: "Levend lint", zh: "流动缎带", hi: "जीवित रिबन", es: "Cinta viva", fr: "Ruban vivant", ar: "شريط حي", pt: "Fita viva", ru: "Живая лента", de: "Lebendes Band", ja: "生きたリボン" },
  ribbonBody: { en: "Every domain, drifting past like a current. Hover to pause and pick a thread.", nl: "Elk domein drijft voorbij als een stroming. Beweeg eroverheen om te pauzeren en een draad te kiezen.", zh: "每个领域如水流般漂过。悬停暂停，择线而入。", hi: "हर क्षेत्र धारा की तरह बहता है। रुकने और धागा चुनने के लिए होवर करें।", es: "Cada dominio pasa como una corriente. Pasa el cursor para pausar y elegir un hilo.", fr: "Chaque domaine défile comme un courant. Survolez pour suspendre et saisir un fil.", ar: "كل مجال يمر كتيار. مرر المؤشر للتوقف واختيار خيط.", pt: "Cada domínio passa como uma corrente. Passe o mouse para pausar e escolher um fio.", ru: "Каждая область проплывает как течение. Наведите, чтобы остановить и выбрать нить.", de: "Jeder Bereich zieht vorbei wie eine Strömung. Zum Anhalten und Fadenwählen darüberfahren.", ja: "すべての分野が流れのように過ぎていきます。ホバーで止めて糸を選んでください。" },
  domainsLabel: { en: "Twenty-four domains", nl: "Vierentwintig domeinen", zh: "二十四个领域", hi: "चौबीस क्षेत्र", es: "Veinticuatro dominios", fr: "Vingt-quatre domaines", ar: "أربعة وعشرون مجالاً", pt: "Vinte e quatro domínios", ru: "Двадцать четыре области", de: "Vierundzwanzig Bereiche", ja: "24の分野" },
  domainsHeadline: { en: "Begin anywhere. Arrive everywhere.", nl: "Begin waar je wilt. Kom overal uit.", zh: "从任意处启程，抵达每一处。", hi: "कहीं से भी शुरू करें। हर जगह पहुँचें।", es: "Empieza en cualquier parte. Llega a todas.", fr: "Commencez n'importe où. Arrivez partout.", ar: "ابدأ من أي مكان، وستصل إلى كل مكان.", pt: "Comece em qualquer lugar. Chegue a todos.", ru: "Начните где угодно — придёте всюду.", de: "Beginne irgendwo. Komme überall an.", ja: "どこから始めても、すべてへ辿り着く。" },
  allCategories: { en: "All categories", nl: "Alle categorieën", zh: "所有类别", hi: "सभी श्रेणियाँ", es: "Todas las categorías", fr: "Toutes les catégories", ar: "كل الفئات", pt: "Todas as categorias", ru: "Все категории", de: "Alle Kategorien", ja: "すべてのカテゴリー" },
  featuredLabel: { en: "From the field", nl: "Uit het veld", zh: "来自田野", hi: "मैदान से", es: "Desde el campo", fr: "Sur le terrain", ar: "من الميدان", pt: "Do campo", ru: "С полей", de: "Aus dem Feld", ja: "フィールドから" },
  featuredHeadline: { en: "Reading that rewards the curious.", nl: "Leesvoer dat nieuwsgierigheid beloont.", zh: "让好奇心得到回报的阅读。", hi: "ऐसा पठन जो जिज्ञासा का प्रतिफल दे।", es: "Lecturas que premian la curiosidad.", fr: "Des lectures qui récompensent les curieux.", ar: "قراءة تكافئ الفضوليين.", pt: "Leituras que recompensam os curiosos.", ru: "Чтение, вознаграждающее любопытных.", de: "Lektüre, die Neugier belohnt.", ja: "好奇心に報いる読みもの。" },
  successionLabel: { en: "How ecosystems assemble", nl: "Hoe ecosystemen zich vormen", zh: "生态系统如何形成", hi: "पारितंत्र कैसे बनते हैं", es: "Cómo se ensamblan los ecosistemas", fr: "Comment les écosystèmes s'assemblent", ar: "كيف تتشكل النظم البيئية", pt: "Como os ecossistemas se formam", ru: "Как собираются экосистемы", de: "Wie Ökosysteme entstehen", ja: "生態系はいかに組み上がるか" },
  successionHeadline: { en: "From bare ground to forest.", nl: "Van kale grond naar bos.", zh: "从裸地到森林。", hi: "नंगी ज़मीन से जंगल तक।", es: "Del suelo desnudo al bosque.", fr: "Du sol nu à la forêt.", ar: "من أرض جرداء إلى غابة.", pt: "Do solo nu à floresta.", ru: "От голой земли до леса.", de: "Vom nackten Boden zum Wald.", ja: "裸地から森へ。" },
  successionBody: { en: "Scroll to watch a landscape rebuild itself, one stage at a time — the slow choreography of ecological succession.", nl: "Scroll en zie een landschap zichzelf herbouwen, stap voor stap — de trage choreografie van ecologische successie.", zh: "滚动观看一片土地一步步重建自己——生态演替的缓慢编舞。", hi: "स्क्रॉल करें और देखें कि परिदृश्य चरण-दर-चरण खुद को फिर बनाता है — पारिस्थितिक अनुक्रमण की धीमी नृत्यकला।", es: "Desplázate y mira un paisaje reconstruirse, etapa a etapa: la lenta coreografía de la sucesión ecológica.", fr: "Faites défiler et regardez un paysage se reconstruire, étape par étape — la lente chorégraphie de la succession écologique.", ar: "مرر لتشاهد المشهد يعيد بناء نفسه مرحلة بعد مرحلة — رقصة التعاقب البيئي البطيئة.", pt: "Role para ver uma paisagem se reconstruir, etapa por etapa — a lenta coreografia da sucessão ecológica.", ru: "Прокрутите и наблюдайте, как ландшафт восстанавливает себя, стадия за стадией — медленная хореография сукцессии.", de: "Scrolle und sieh zu, wie sich eine Landschaft Stufe um Stufe neu aufbaut — die langsame Choreografie der Sukzession.", ja: "スクロールして、風景が一段階ずつ自らを再生する様子を——生態遷移の緩やかな振り付けを見てください。" },
  readFullArticle: { en: "Read the full article", nl: "Lees het volledige artikel", zh: "阅读全文", hi: "पूरा लेख पढ़ें", es: "Leer el artículo completo", fr: "Lire l'article complet", ar: "اقرأ المقال كاملاً", pt: "Ler o artigo completo", ru: "Читать статью целиком", de: "Ganzen Artikel lesen", ja: "記事全文を読む" },
  pathsLabel: { en: "Guided journeys", nl: "Begeleide routes", zh: "引导之旅", hi: "मार्गदर्शित यात्राएँ", es: "Viajes guiados", fr: "Parcours guidés", ar: "رحلات موجهة", pt: "Jornadas guiadas", ru: "Путеводные маршруты", de: "Geführte Reisen", ja: "ガイド付きの旅" },
  pathsHeadline: { en: "Learning paths that follow the grain of nature.", nl: "Leerpaden die de nerf van de natuur volgen.", zh: "顺应自然纹理的学习路径。", hi: "प्रकृति की बनावट का अनुसरण करते सीखने के पथ।", es: "Rutas de aprendizaje que siguen la veta de la naturaleza.", fr: "Des parcours d'apprentissage qui suivent le fil de la nature.", ar: "مسارات تعلم تسير مع نسيج الطبيعة.", pt: "Trilhas de aprendizado que seguem o veio da natureza.", ru: "Учебные пути, следующие волокну природы.", de: "Lernpfade, die der Maserung der Natur folgen.", ja: "自然の木目に沿った学びの道。" },
  allPaths: { en: "All paths", nl: "Alle routes", zh: "所有路径", hi: "सभी पथ", es: "Todas las rutas", fr: "Tous les parcours", ar: "كل المسارات", pt: "Todas as trilhas", ru: "Все маршруты", de: "Alle Pfade", ja: "すべてのパス" },
  hours: { en: "hours", nl: "uur", zh: "小时", hi: "घंटे", es: "horas", fr: "heures", ar: "ساعات", pt: "horas", ru: "часов", de: "Stunden", ja: "時間" },
  steps: { en: "steps", nl: "stappen", zh: "步", hi: "चरण", es: "pasos", fr: "étapes", ar: "خطوات", pt: "passos", ru: "шагов", de: "Schritte", ja: "ステップ" },
  beginPath: { en: "Begin the path", nl: "Begin de route", zh: "开始路径", hi: "पथ शुरू करें", es: "Comenzar la ruta", fr: "Commencer le parcours", ar: "ابدأ المسار", pt: "Começar a trilha", ru: "Начать путь", de: "Pfad beginnen", ja: "パスを始める" },
  ctaHeadline: { en: "Help grow the world's knowledge of living systems.", nl: "Help de wereldkennis over levende systemen te laten groeien.", zh: "帮助壮大世界对生命系统的认知。", hi: "जीवित तंत्रों के विश्व-ज्ञान को बढ़ाने में मदद करें।", es: "Ayuda a hacer crecer el conocimiento mundial sobre los sistemas vivos.", fr: "Aidez à faire grandir le savoir mondial sur les systèmes vivants.", ar: "ساعد في تنمية معرفة العالم بالأنظمة الحية.", pt: "Ajude a expandir o conhecimento mundial sobre sistemas vivos.", ru: "Помогите растить мировое знание о живых системах.", de: "Hilf mit, das Weltwissen über lebende Systeme wachsen zu lassen.", ja: "生きているシステムについての世界の知識を育てましょう。" },
  ctaBody: { en: "Equilibrium is open source and built in public. Write, edit, review or translate — every contribution strengthens the whole ecosystem.", nl: "Equilibrium is open source en wordt in het openbaar gebouwd. Schrijf, bewerk, review of vertaal — elke bijdrage versterkt het hele ecosysteem.", zh: "Equilibrium 开源并公开构建。撰写、编辑、评审或翻译——每一次贡献都让整个生态更强健。", hi: "Equilibrium ओपन सोर्स है और सार्वजनिक रूप से बनता है। लिखें, संपादित करें, समीक्षा करें या अनुवाद करें — हर योगदान पूरे पारितंत्र को मज़बूत करता है।", es: "Equilibrium es de código abierto y se construye en público. Escribe, edita, revisa o traduce: cada contribución fortalece todo el ecosistema.", fr: "Equilibrium est open source et construit en public. Écrivez, éditez, relisez ou traduisez — chaque contribution renforce tout l'écosystème.", ar: "Equilibrium مفتوح المصدر ويبنى علناً. اكتب أو حرر أو راجع أو ترجم — كل مساهمة تقوي المنظومة كلها.", pt: "O Equilibrium é open source e construído em público. Escreva, edite, revise ou traduza — cada contribuição fortalece todo o ecossistema.", ru: "Equilibrium — открытый код, создаваемый публично. Пишите, правьте, рецензируйте или переводите — каждый вклад укрепляет экосистему.", de: "Equilibrium ist Open Source und entsteht öffentlich. Schreibe, bearbeite, prüfe oder übersetze — jeder Beitrag stärkt das ganze Ökosystem.", ja: "Equilibrium はオープンソースで、公開の場で作られています。執筆・編集・レビュー・翻訳——あらゆる貢献が生態系全体を強くします。" },
  becomeContributor: { en: "Become a contributor", nl: "Word bijdrager", zh: "成为贡献者", hi: "योगदानकर्ता बनें", es: "Conviértete en colaborador", fr: "Devenir contributeur", ar: "كن مساهماً", pt: "Torne-se colaborador", ru: "Стать участником", de: "Mitwirkende:r werden", ja: "コントリビューターになる" },
  wanderGraph: { en: "Wander the graph", nl: "Dwaal door de graaf", zh: "漫游图谱", hi: "ग्राफ़ में विचरें", es: "Vagar por el grafo", fr: "Flâner dans le graphe", ar: "تجول في الرسم البياني", pt: "Vagar pelo grafo", ru: "Побродить по графу", de: "Durch den Graphen streifen", ja: "グラフをさまよう" },
  man1a: { en: "Nature is", nl: "Natuur is", zh: "自然即", hi: "प्रकृति ही", es: "La naturaleza es", fr: "La nature est", ar: "الطبيعة هي", pt: "A natureza é", ru: "Природа —", de: "Natur ist", ja: "自然は" },
  man1b: { en: "infrastructure.", nl: "infrastructuur.", zh: "基础设施。", hi: "आधारभूत ढाँचा है।", es: "infraestructura.", fr: "infrastructure.", ar: "بنية تحتية.", pt: "infraestrutura.", ru: "инфраструктура.", de: "Infrastruktur.", ja: "インフラである。" },
  man2pre: { en: "Living systems learn from ", nl: "Levende systemen leren van ", zh: "生命系统从", hi: "जीवित तंत्र ", es: "Los sistemas vivos aprenden de las ", fr: "Les systèmes vivants apprennent des ", ar: "تتعلم الأنظمة الحية من ", pt: "Sistemas vivos aprendem com ", ru: "Живые системы учатся у ", de: "Lebende Systeme lernen aus ", ja: "生きているシステムは" },
  man2em: { en: "relationships", nl: "relaties", zh: "关系", hi: "संबंधों", es: "relaciones", fr: "relations", ar: "العلاقات", pt: "relações", ru: "связей", de: "Beziehungen", ja: "関係" },
  man2post: { en: ", not isolated parts.", nl: ", niet van losse delen.", zh: "中学习，而非孤立的部分。", hi: " से सीखते हैं, अलग-थलग हिस्सों से नहीं।", es: ", no de partes aisladas.", fr: ", non de parties isolées.", ar: "، لا من الأجزاء المعزولة.", pt: ", não com partes isoladas.", ru: ", а не отдельных частей.", de: ", nicht aus isolierten Teilen.", ja: "から学ぶ——切り離された部分からではなく。" },
  man3pre: { en: "Equilibrium exists to make ecological intelligence ", nl: "Equilibrium bestaat om ecologische intelligentie ", zh: "Equilibrium 的存在是为了让生态智慧", hi: "Equilibrium इसलिए है ताकि पारिस्थितिक बुद्धिमत्ता ", es: "Equilibrium existe para hacer la inteligencia ecológica ", fr: "Equilibrium existe pour rendre l'intelligence écologique ", ar: "وجد Equilibrium ليجعل الذكاء البيئي ", pt: "O Equilibrium existe para tornar a inteligência ecológica ", ru: "Equilibrium существует, чтобы сделать экологический интеллект ", de: "Equilibrium existiert, um ökologische Intelligenz ", ja: "Equilibrium は、生態学的知性を" },
  man3em: { en: "accessible", nl: "toegankelijk", zh: "触手可及", hi: "सुलभ", es: "accesible", fr: "accessible", ar: "متاحاً", pt: "acessível", ru: "доступным", de: "zugänglich", ja: "身近" },
  man3post: { en: ", structured, beautiful and practical.", nl: ", gestructureerd, mooi en praktisch te maken.", zh: "、有序、美观且实用。", hi: ", संरचित, सुंदर और व्यावहारिक बनाए।", es: ", estructurada, bella y práctica.", fr: ", structurée, belle et pratique.", ar: "، منظماً، جميلاً وعملياً.", pt: ", estruturada, bela e prática.", ru: ", структурированным, красивым и практичным.", de: ", strukturiert, schön und praktisch zu machen.", ja: "で、構造化され、美しく、実用的なものにするために存在します。" },
} satisfies Record<string, L>

export const UI = { ...UI_CORE, ...UI_CHROME, ...UI_PAGES }
