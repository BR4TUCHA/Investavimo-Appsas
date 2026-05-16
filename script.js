const AUTH_STORAGE_KEY = "kidfund-auth-store-v3";
const APP_STORAGE_KEY = "kidfund-app-state-v3";
const PARENT_ONLY_TABS = new Set(["transfers"]);

const TAB_META = {
  home: {
    title: "Pagrindinis vaizdas",
    copy:
      "Čia rodoma visa pagrindinė vaiko pinigų, taupymo ir investavimo informacija su greitais veiksmais.",
  },
  savings: {
    title: "Taupymo skiltis",
    copy:
      "Tikslai, pažanga ir taupymo likutis. Vaikas mato savo progresą, o tėvų leidimų politika rodoma tik tėvams.",
  },
  invest: {
    title: "Investavimo skiltis",
    copy:
      "Vaikas gali siųsti investavimo prašymą į akcijas ar kriptovaliutas, bet pats negali jo patvirtinti.",
  },
  learn: {
    title: "Mokymosi skiltis",
    copy:
      "Trumpi finansinio raštingumo paaiškinimai ir viktorina, kad būtų aišku kodėl svarbu taupyti ir investuoti atsakingai.",
  },
  feed: {
    title: "Pranešimų istorija",
    copy:
      "Visi programėlės veiksmai ir atsakymai: prašymai, patvirtinimai, papildymai bei sistemos žinutės.",
  },
  transfers: {
    title: "Duoti pinigų",
    copy:
      "Ši skiltis skirta tik tėvams. Čia galima papildyti vaiko piniginę ar investavimo kišenę ir tvarkyti laukiančius prašymus.",
  },
};

const INVESTMENTS = [
  {
    id: "baltic-tech",
    name: "Baltic Tech ETF",
    type: "Akcijos",
    risk: "Vidutinė",
    min: 5,
    description:
      "Platesnis technologijų krepšelis, skirtas pradėti nuo mažesnės rizikos nei viena pavienė akcija.",
  },
  {
    id: "green-energy",
    name: "Green Energy Fund",
    type: "Akcijos",
    risk: "Vidutinė",
    min: 5,
    description:
      "Fondų tipo pasirinkimas, kuris leidžia kalbėti apie ilgalaikį augimą ir atsakingą diversifikaciją.",
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    type: "Kriptovaliuta",
    risk: "Aukšta",
    min: 10,
    description:
      "Didelio svyravimo pavyzdys, parodantis kodėl kripto sprendimams reikalingas aiškus tėvų leidimas.",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    type: "Kriptovaliuta",
    risk: "Aukšta",
    min: 10,
    description:
      "Naudojamas kaip edukacinis pavyzdys, kai kalbama apie skirtingus investavimo aktyvus ir jų riziką.",
  },
];

const LESSONS = [
  {
    title: "Kodėl dalis kišenpinigių lieka užrakinta?",
    copy:
      "Taip vaikas iškart mato, kad ne visi pinigai skirti išleisti šiandien, dalis turi dirbti ateities tikslams.",
  },
  {
    title: "Kuo skiriasi taupymas ir investavimas?",
    copy:
      "Taupymas tinka artimiems tikslams, o investavimas padeda kalbėti apie ilgesnį laiką ir galimus vertės svyravimus.",
  },
  {
    title: "Kas yra rizika?",
    copy:
      "Rizika reiškia, kad investicijos vertė gali ne tik kilti, bet ir kristi, todėl sprendimai turi būti apgalvoti.",
  },
  {
    title: "Kodėl reikalingas leidimas?",
    copy:
      "Vaikas gali mokytis priimti sprendimus, tačiau tėvai patvirtina didesnės atsakomybės reikalaujančius veiksmus.",
  },
  {
    title: "Kas yra diversifikacija?",
    copy:
      "Vietoj vienos idėjos galima rinktis skirtingus aktyvus, kad vieno pasirinkimo kritimas neveiktų visų pinigų vienodai.",
  },
  {
    title: "Kodėl limitas irgi svarbus?",
    copy:
      "Išlaidų limitas padeda vaikui suprasti planavimą ir padeda neperdeginti visos savaitės biudžeto vienu pirkiniu.",
  },
];

const QUIZ_QUESTIONS = [
  {
    question: "Kam dažniausiai labiausiai tinka taupymas?",
    helper: "Pagalvok apie artimą, aiškų tikslą ir mažesnę riziką.",
    options: [
      "Trumpesnio laikotarpio tikslams ir saugumui",
      "Tik greitam pelnui",
      "Tik kriptovaliutoms",
    ],
    correctIndex: 0,
    feedback:
      "Teisingai - taupymas dažniausiai labiausiai tinka artimiems tikslams ir nenumatytiems atvejams.",
  },
  {
    question: "Kodėl vaiko investavimui reikalingas tėvų leidimas?",
    helper: "Svarbu ne tik uždirbti, bet ir suprasti riziką.",
    options: [
      "Nes investicijos gali svyruoti ir reikia priežiūros",
      "Nes investicijos visada garantuotos",
      "Nes pinigų niekada negalima investuoti",
    ],
    correctIndex: 0,
    feedback:
      "Teisingai - vertė gali keistis, todėl tėvų patvirtinimas padeda mokytis atsakingai.",
  },
  {
    question: "Ką reiškia diversifikacija?",
    helper: "Pagalvok, kodėl geriau nepasikliauti tik viena idėja.",
    options: [
      "Visus pinigus laikyti viename aktyve",
      "Paskirstyti pinigus tarp kelių aktyvų",
      "Vengti bet kokio taupymo",
    ],
    correctIndex: 1,
    feedback:
      "Teisingai - diversifikacija reiškia paskirstymą, kad vienas pasirinkimas nelemia viso rezultato.",
  },
];

const PARTNER_SPOTLIGHTS = [
  {
    title: "Partnerio vieta: Junior Bank",
    copy: "Vaikiška bankininkystė, tėvų kontrolė ir saugios pirmos finansų pamokos vienoje vietoje.",
    badge: "Partneriai",
  },
  {
    title: "Rėmėjo vieta: EduCrypto Lab",
    copy: "Trumpi paaiškinimai apie kripto riziką ir saugų investavimo pradžios supratimą.",
    badge: "Edukacija",
  },
];

const ACTION_LIMITS = {
  childInvestRequest: {
    cooldownMs: 45 * 1000,
    windowMs: 10 * 60 * 1000,
    maxInWindow: 4,
    label: "investavimo prašymai",
  },
  parentTransferWallet: {
    cooldownMs: 20 * 1000,
    windowMs: 10 * 60 * 1000,
    maxInWindow: 8,
    label: "pinigų papildymai",
  },
  parentTopupInvestPocket: {
    cooldownMs: 20 * 1000,
    windowMs: 10 * 60 * 1000,
    maxInWindow: 8,
    label: "investavimo kišenės papildymai",
  },
  paymentRequest: {
    cooldownMs: 40 * 1000,
    windowMs: 10 * 60 * 1000,
    maxInWindow: 4,
    label: "pavedimo užklausos",
  },
};

const UI_ICONS = {
  piggy:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4c-3.3 0-6 1.5-7.2 4H3v2h1.2c0 .8.2 1.5.5 2.2L3 14v2h3.2l1 2h2l.5-1.1c.8.2 1.6.3 2.3.3 4.4 0 8-2.7 8-6.1 0-2.6-2.1-4.9-5.2-5.7-.2-1-.9-1.4-1.8-1.4zm3 5.2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM8 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path></svg>',
  bell:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0-6 6v2.1c0 .7-.2 1.4-.6 2L4 16v1h16v-1l-1.4-2.9a4.7 4.7 0 0 1-.6-2V9a6 6 0 0 0-6-6zm0 19a3 3 0 0 0 2.8-2H9.2A3 3 0 0 0 12 22z"></path></svg>',
  wallet:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19v3h-2.5a2.5 2.5 0 0 0 0 5H19v4.5a2.5 2.5 0 0 1-2.5 2.5h-10A2.5 2.5 0 0 1 4 17.5zm12.5 2a1 1 0 0 0 0 2H20v-2z"></path></svg>',
  savings:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5zm0 4.2a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2zm0 11.2c-2.2 0-4.1-1.1-5.2-2.8.1-1.7 3.5-2.6 5.2-2.6s5.1.9 5.2 2.6c-1.1 1.7-3 2.8-5.2 2.8z"></path></svg>',
  target:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9h-2.2a6.8 6.8 0 1 1-2-4.8L15.5 8.5A4.5 4.5 0 1 0 16.5 12H19a7 7 0 0 0-1.1-3.8L21 5v6h-6l2.3-2.3A8.9 8.9 0 0 0 12 3z"></path></svg>',
  send:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 20 18-8L3 4v6l12 2-12 2z"></path></svg>',
  chart:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17l4.5-4.5 3 3L19 9v4h2V5h-8v2h4.6l-5.1 5.1-3-3L3 15.5z"></path></svg>',
  gift:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7h-2.2c.1-.3.2-.7.2-1 0-1.7-1.3-3-3-3-1.2 0-2.2.7-3 1.8C11.2 3.7 10.2 3 9 3 7.3 3 6 4.3 6 6c0 .3.1.7.2 1H4v4h1v9h14v-9h1zm-5-2a1 1 0 1 1 0 2h-2.3c.4-1.1 1.2-2 2.3-2zM8 6a1 1 0 0 1 1-1c1.1 0 1.9.9 2.3 2H9A1 1 0 0 1 8 6zm9 13h-4v-8h4zm-6 0H7v-8h4z"></path></svg>',
  qr:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h8v8H3zm2 2v4h4V5zm8-2h8v8h-8zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zm11-2h2v2h-2zm-3 0h2v5h-2zm5 2h3v2h-3zm-3 3h2v3h-2zm3 1h3v2h-3z"></path></svg>',
  bank:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2 8v2h20V8zm-7 9h2v6H5zm4 0h2v6H9zm4 0h2v6h-2zm4 0h2v6h-2zM3 20h18v2H3z"></path></svg>',
  copy:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8V4h12v12h-4v4H4V8zm2 0h6v6h2V6h-8zm-4 2v8h8v-8z"></path></svg>',
  shield:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 5 5v6c0 5 3.4 9.7 7 11 3.6-1.3 7-6 7-11V5zm-1 14-3-3 1.4-1.4L11 13.2l3.6-3.6L16 11z"></path></svg>',
  rocket:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3c2.8 0 5 2.2 5 5 0 1.7-.8 3.2-2 4.1V17l-3 1-3 3-2-2 3-3 1-3h4.9A4.97 4.97 0 0 0 19 8c0-2.8-2.2-5-5-5zM7 14l3 3-4 4H3v-3zm10-8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"></path></svg>',
  sparkle:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8zM5 16l.9 2.1L8 19l-2.1.9L5 22l-.9-2.1L2 19l2.1-.9zm14-2 1.1 2.5L23 17.6l-2.9 1.2L19 21l-1.1-2.2L15 17.6l2.9-1.1z"></path></svg>',
  learn:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6.5c-3.8 0-7 1.1-9 2.5v10c2-1.4 5.2-2.5 9-2.5s7 1.1 9 2.5V9c-2-1.4-5.2-2.5-9-2.5zm0 2c2.6 0 5 .5 7 1.4v6.1c-2-.9-4.4-1.4-7-1.4s-5 .5-7 1.4V9.9c2-.9 4.4-1.4 7-1.4z"></path></svg>',
  clock:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 5h-2v6l5 3 1-1.7-4-2.3z"></path></svg>',
  check:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"></path></svg>',
  warning:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1 21h22L12 2zm12-3h-2v2h2zm0-6h-2v5h2z"></path></svg>',
  lock:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zm-6 0V6a2 2 0 1 1 4 0v2z"></path></svg>',
  star:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 17.3-6.2 3.7 1.6-7L2 9.2l7.1-.6L12 2l2.9 6.6 7.1.6-5.4 4.8 1.6 7z"></path></svg>',
  level:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19h16v2H4zm2-2V7h3l3 4 3-6 5 12z"></path></svg>',
  camera:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4 7.2 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.2L15 4zm3 4.5A4.5 4.5 0 1 1 7.5 13 4.5 4.5 0 0 1 12 8.5z"></path></svg>',
};

function renderUiIcon(iconName, className = "feature-icon") {
  return `<span class="${className}" aria-hidden="true">${UI_ICONS[iconName] || UI_ICONS.sparkle}</span>`;
}

function getToneIconName(tone) {
  if (tone === "warning") {
    return "warning";
  }
  if (tone === "success") {
    return "check";
  }
  return "sparkle";
}

const elements = {
  authScreen: document.querySelector("#authScreen"),
  authRoleSwitch: document.querySelector("#authRoleSwitch"),
  authModeSwitch: document.querySelector("#authModeSwitch"),
  authRoleBadge: document.querySelector("#authRoleBadge"),
  authTitle: document.querySelector("#authTitle"),
  authCopy: document.querySelector("#authCopy"),
  authBrandEyebrow: document.querySelector("#authBrandEyebrow"),
  authBrandTitle: document.querySelector("#authBrandTitle"),
  authBrandCopy: document.querySelector("#authBrandCopy"),
  authEmojiRow: document.querySelector("#authEmojiRow"),
  authFeatureList: document.querySelector("#authFeatureList"),
  authPinSlots: document.querySelector("#authPinSlots"),
  authMessage: document.querySelector("#authMessage"),
  authSubmitButton: document.querySelector("#authSubmitButton"),
  authClearButton: document.querySelector("#authClearButton"),
  authKeypad: document.querySelector("#authKeypad"),
  appShell: document.querySelector("#appShell"),
  activeRoleChip: document.querySelector("#activeRoleChip"),
  headerSubtitle: document.querySelector("#headerSubtitle"),
  logoutButton: document.querySelector("#logoutButton"),
  sectionBannerTitle: document.querySelector("#sectionBannerTitle"),
  sectionBannerCopy: document.querySelector("#sectionBannerCopy"),
  bottomNav: document.querySelector("#bottomNav"),
  homeStats: document.querySelector("#homeStats"),
  homeMoodTitle: document.querySelector("#homeMoodTitle"),
  homeMoodSpot: document.querySelector("#homeMoodSpot"),
  partnerSpot: document.querySelector("#partnerSpot"),
  accountHub: document.querySelector("#accountHub"),
  quickActions: document.querySelector("#quickActions"),
  kidMissionSpot: document.querySelector("#kidMissionSpot"),
  homeFeedPreview: document.querySelector("#homeFeedPreview"),
  goalsList: document.querySelector("#goalsList"),
  savingsSummary: document.querySelector("#savingsSummary"),
  permissionPolicyList: document.querySelector("#permissionPolicyList"),
  investmentCatalog: document.querySelector("#investmentCatalog"),
  investPanelTitle: document.querySelector("#investPanelTitle"),
  investActionPanel: document.querySelector("#investActionPanel"),
  portfolioList: document.querySelector("#portfolioList"),
  parentInvestControls: document.querySelector("#parentInvestControls"),
  lessonGrid: document.querySelector("#lessonGrid"),
  quizQuestion: document.querySelector("#quizQuestion"),
  quizHelper: document.querySelector("#quizHelper"),
  quizOptions: document.querySelector("#quizOptions"),
  quizFeedback: document.querySelector("#quizFeedback"),
  nextQuestionButton: document.querySelector("#nextQuestionButton"),
  miniGamesBoard: document.querySelector("#miniGamesBoard"),
  feedList: document.querySelector("#feedList"),
  transferActions: document.querySelector("#transferActions"),
  transferQueue: document.querySelector("#transferQueue"),
  confirmModal: document.querySelector("#confirmModal"),
  confirmTitle: document.querySelector("#confirmTitle"),
  confirmCopy: document.querySelector("#confirmCopy"),
  confirmPinSlots: document.querySelector("#confirmPinSlots"),
  confirmMessage: document.querySelector("#confirmMessage"),
  confirmSubmitButton: document.querySelector("#confirmSubmitButton"),
  confirmCancelButton: document.querySelector("#confirmCancelButton"),
  confirmKeypad: document.querySelector("#confirmKeypad"),
  shareRequestModal: document.querySelector("#shareRequestModal"),
  shareRequestTitle: document.querySelector("#shareRequestTitle"),
  shareRequestCopy: document.querySelector("#shareRequestCopy"),
  shareRequestBankCard: document.querySelector("#shareRequestBankCard"),
  shareRequestMeta: document.querySelector("#shareRequestMeta"),
  shareQrCode: document.querySelector("#shareQrCode"),
  shareRequestReviewButton: document.querySelector("#shareRequestReviewButton"),
  shareRequestScanButton: document.querySelector("#shareRequestScanButton"),
  shareRequestSystemButton: document.querySelector("#shareRequestSystemButton"),
  shareRequestCopyButton: document.querySelector("#shareRequestCopyButton"),
  shareRequestCloseButton: document.querySelector("#shareRequestCloseButton"),
  paymentReviewModal: document.querySelector("#paymentReviewModal"),
  paymentReviewTitle: document.querySelector("#paymentReviewTitle"),
  paymentReviewCopy: document.querySelector("#paymentReviewCopy"),
  paymentReviewBankCard: document.querySelector("#paymentReviewBankCard"),
  paymentReviewMeta: document.querySelector("#paymentReviewMeta"),
  paymentReviewConfirmButton: document.querySelector("#paymentReviewConfirmButton"),
  paymentReviewCancelButton: document.querySelector("#paymentReviewCancelButton"),
  toastStack: document.querySelector("#toastStack"),
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function nowIso() {
  return new Date().toISOString();
}

function buildDefaultAppData() {
  return {
    accounts: {
      wallet: 48,
      savings: 126,
      investPocket: 32,
      parentReserve: 260,
      weeklyLimit: 25,
      spentThisWeek: 12,
      walletAccountNumber: "KF-2710-0001-4455",
      savingsAccountNumber: "KF-2710-9999-1200",
    },
    goals: [
      {
        id: "goal-bike",
        title: "Dviratis vasarai",
        target: 180,
        saved: 96,
        parentMatchAvailable: true,
      },
      {
        id: "goal-console",
        title: "Žaidimų konsolė",
        target: 90,
        saved: 28,
        parentMatchAvailable: false,
      },
    ],
    settings: {
      cryptoEnabled: true,
      maxSingleInvest: 20,
      approvalRule: "Visi investavimo veiksmai privalo būti patvirtinti tėvų PIN.",
      savingsPolicy: "Vaikas mato balansą ir progresą, bet leidimų politikos nekeičia.",
    },
    portfolio: [
      {
        id: "holding-1",
        assetId: "baltic-tech",
        amount: 12,
        status: "active",
        updatedAt: nowIso(),
      },
    ],
    requests: [
      {
        id: "request-1",
        type: "investment",
        assetId: "green-energy",
        amount: 8,
        status: "pending",
        createdBy: "child",
        createdAt: nowIso(),
      },
    ],
    actionAudit: [],
    feed: [
      {
        id: "feed-1",
        tone: "success",
        message: "Tėvai papildė vaiko piniginę 15 EUR.",
        createdAt: nowIso(),
      },
      {
        id: "feed-2",
        tone: "warning",
        message: "Vaikas išsiuntė investavimo prašymą į Green Energy Fund.",
        createdAt: nowIso(),
      },
      {
        id: "feed-3",
        tone: "success",
        message: "Pasiektas 53% dviračio taupymo tikslas.",
        createdAt: nowIso(),
      },
    ],
  };
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function normalizeAppData(raw) {
  const fallback = buildDefaultAppData();
  if (!raw || typeof raw !== "object") {
    return fallback;
  }

  return {
    accounts: {
      ...fallback.accounts,
      ...(raw.accounts || {}),
    },
    goals: Array.isArray(raw.goals) && raw.goals.length ? raw.goals : fallback.goals,
    settings: {
      ...fallback.settings,
      ...(raw.settings || {}),
    },
    portfolio: Array.isArray(raw.portfolio) ? raw.portfolio : fallback.portfolio,
    requests: Array.isArray(raw.requests) ? raw.requests : fallback.requests,
    actionAudit: Array.isArray(raw.actionAudit) ? raw.actionAudit : fallback.actionAudit,
    feed: Array.isArray(raw.feed) && raw.feed.length ? raw.feed : fallback.feed,
  };
}

const authStore = {
  childPin: "",
  parentPin: "",
  ...loadJson(AUTH_STORAGE_KEY, {}),
};

const appData = normalizeAppData(loadJson(APP_STORAGE_KEY, buildDefaultAppData()));

const state = {
  mode: null,
  activeTab: "home",
  authRole: authStore.childPin ? "child" : "child",
  authMode: authStore.childPin ? "login" : "register",
  authPinBuffer: "",
  authMessage: "",
  authMessageTone: "",
  confirm: {
    open: false,
    role: "parent",
    title: "",
    copy: "",
    buttonLabel: "Patvirtinti",
    pinBuffer: "",
    message: "",
    messageTone: "",
    action: null,
  },
  selectedInvestmentId: INVESTMENTS[0].id,
  selectedInvestmentAmount: 10,
  paymentRequestAccount: "wallet",
  paymentRequestAmount: 15,
  shareRequestId: null,
  paymentReview: {
    open: false,
    payload: null,
    source: "",
  },
  scanner: {
    busy: false,
    message: "",
    messageTone: "",
    pendingStartAfterInstall: false,
  },
  quizIndex: 0,
  quizOptionOrder: [],
  quizFeedback: "",
  quizFeedbackTone: "",
  selectedQuizAnswer: null,
  miniGames: {
    points: 0,
    level: 1,
    piggyTaps: 0,
    piggyRewarded: false,
    choiceAnswered: false,
    choiceSelected: null,
    choiceRewarded: false,
    cardPick: null,
    cardRewarded: false,
    budgetChoice: null,
    budgetRewarded: false,
    memoryStep: 0,
    memorySolved: false,
    memoryRewarded: false,
  },
};

function saveAuthStore() {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authStore));
}

function saveAppData() {
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(appData));
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

function formatCurrency(value) {
  const amount = Number(value) || 0;
  return `${amount.toFixed(2).replace(/\.00$/, "")} EUR`;
}

function formatDate(value) {
  const date = new Date(value);
  return date.toLocaleString("lt-LT", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sanitizePin(value) {
  return String(value).replace(/\D/g, "").slice(0, 4);
}

function sanitizeAmount(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 0;
  }
  return Math.max(1, Math.round(number));
}

function shuffleArray(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function resetQuizQuestion(index = state.quizIndex) {
  state.quizIndex = index;
  state.quizOptionOrder = shuffleArray(
    QUIZ_QUESTIONS[index].options.map((_, optionIndex) => optionIndex),
  );
  state.selectedQuizAnswer = null;
  state.quizFeedback = "";
  state.quizFeedbackTone = "";
}

function getRoleLabel(role) {
  return role === "parent" ? "Tėvai" : "Vaikas";
}

function getAuthBrandContent() {
  if (state.authRole === "child") {
    return {
      eyebrow: state.authMode === "register" ? "🎮 Vaiko startas" : "🎉 Sveikas sugrįžęs",
      title:
        state.authMode === "register"
          ? "Susikurk trumpą PIN ir pirmyn į KidFund"
          : "Įrašyk 4 skaičius ir pirmyn į savo misijas",
      copy:
        state.authMode === "register"
          ? "Trumpai ir aiškiai: susikurk 4 skaičių kodą, kad galėtum taupyti, siųsti prašymus ir rinkti savo progresą."
          : "Jokių ilgų tekstų - tik tavo PIN, emoji ir kelios aiškios užduotys.",
      emojis: ["🎯 Taupau", "🪙 Kaupiu", "🚀 Augu"],
      features: [
        {
          icon: "piggy",
          title: "Trumpas tekstas",
          copy: "Vaikui rodoma mažiau sudėtingos informacijos ir daugiau aiškių žingsnių.",
        },
        {
          icon: "sparkle",
          title: "Emoji ir misijos",
          copy: "Prisijungus lauks mažos misijos, tikslai ir paprastesni paaiškinimai.",
        },
        {
          icon: "lock",
          title: "Saugus PIN",
          copy: "Jautrūs veiksmai turi atskirą patvirtinimo langą, todėl viskas išlieka saugu.",
        },
      ],
    };
  }

  return {
    eyebrow: "🛡️ Tėvų prieiga",
    title:
      state.authMode === "register"
        ? "Sukurkite saugų tėvų PIN valdymui"
        : "Prisijunkite prie KidFund valdymo centro",
    copy:
      state.authMode === "register"
        ? "Tėvų paskyra skirta leidimams, papildymams, investavimo patvirtinimams ir pranešimų kontrolei."
        : "Profesionalesnis valdymas, aiški kontrolė ir atskiras PIN kiekvienam jautriam veiksmui.",
    emojis: ["👨‍👩‍👧 Šeima", "📊 Kontrolė", "🔔 Pranešimai"],
    features: [
      {
        icon: "shield",
        title: "Atskira autorizacija",
        copy: "Tėvų veiksmai atskirti nuo vaiko prisijungimo ir turi savo validaciją.",
      },
      {
        icon: "check",
        title: "Patvirtinimų centras",
        copy: "Investavimo, papildymų ir kitų jautrių veiksmų patvirtinimai atliekami per atskirą PIN modalą.",
      },
      {
        icon: "bank",
        title: "KidFund partneriai ir paskyros",
        copy: "Papildytas pagrindinis ekranas su partnerių vieta, sąskaitų numeriais ir pavedimo užklausa.",
      },
    ],
  };
}

function getAccountConfig(accountType) {
  if (accountType === "savings") {
    return {
      type: "savings",
      title: "Taupyklės sąskaita",
      badge: "Taupyklė",
      accountNumber: appData.accounts.savingsAccountNumber,
      description: "Šis numeris skirtas kaupti tiesiai į taupyklę ir ilgalaikiams tikslams.",
    };
  }

  return {
    type: "wallet",
    title: "Pagrindinė mokėjimų sąskaita",
    badge: "Pagrindinė",
    accountNumber: appData.accounts.walletAccountNumber,
    description: "Šis numeris skirtas pagrindiniams papildymams į vaiko piniginę.",
  };
}

function formatRelativeSeconds(milliseconds) {
  const seconds = Math.max(1, Math.ceil(milliseconds / 1000));
  return `${seconds} s`;
}

function pruneActionAudit() {
  const maxWindow = Math.max(...Object.values(ACTION_LIMITS).map((limit) => limit.windowMs));
  const threshold = Date.now() - maxWindow;
  appData.actionAudit = appData.actionAudit.filter((entry) => entry.at >= threshold);
}

function getRateLimitMessage(actionKey) {
  const limit = ACTION_LIMITS[actionKey];
  if (!limit) {
    return "";
  }

  pruneActionAudit();
  const now = Date.now();
  const matchingEntries = appData.actionAudit
    .filter((entry) => entry.key === actionKey)
    .sort((left, right) => right.at - left.at);

  const recentEntry = matchingEntries[0];
  if (recentEntry && now - recentEntry.at < limit.cooldownMs) {
    return `Anti-spam: palauk ${formatRelativeSeconds(limit.cooldownMs - (now - recentEntry.at))} prieš kitą veiksmą.`;
  }

  const inWindow = matchingEntries.filter((entry) => now - entry.at <= limit.windowMs).length;
  if (inWindow >= limit.maxInWindow) {
    return `Anti-spam: pasiektas ${limit.label} limitas. Pabandyk vėliau.`;
  }

  return "";
}

function recordAction(actionKey) {
  pruneActionAudit();
  appData.actionAudit.unshift({
    key: actionKey,
    at: Date.now(),
  });
  appData.actionAudit = appData.actionAudit.slice(0, 100);
  saveAppData();
}

async function copyTextValue(value) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}

function updateModalBodyLock() {
  const hasOpenModal = state.confirm.open || Boolean(state.shareRequestId) || state.paymentReview.open;
  document.body.classList.toggle("modal-open", hasOpenModal);
  document.documentElement.classList.toggle("modal-open", hasOpenModal);
}

function setScannerMessage(message, tone = "") {
  state.scanner.message = message;
  state.scanner.messageTone = tone;
}

function setScannerBusy(isBusy) {
  state.scanner.busy = isBusy;
}

function getBarcodeScannerPlugin() {
  return window.Capacitor?.Plugins?.BarcodeScanner || null;
}

function extractKidFundDeepLink(value) {
  if (!value) {
    return "";
  }

  const text = String(value).trim();
  if (text.startsWith("kidfund://pay/review")) {
    return text;
  }

  const match = text.match(/kidfund:\/\/pay\/review[^\s<>"']*/i);
  return match ? match[0] : "";
}

function getBarcodeDeepLink(barcode) {
  if (!barcode || typeof barcode !== "object") {
    return "";
  }

  return (
    extractKidFundDeepLink(barcode.rawValue) ||
    extractKidFundDeepLink(barcode.displayValue) ||
    extractKidFundDeepLink(barcode.urlBookmark?.url)
  );
}

async function ensureScannerModuleReady(scanner) {
  if (!scanner) {
    return false;
  }

  const platform = window.Capacitor?.getPlatform?.();
  if (platform !== "android" || !scanner.isGoogleBarcodeScannerModuleAvailable || !scanner.installGoogleBarcodeScannerModule) {
    return true;
  }

  try {
    const availability = await scanner.isGoogleBarcodeScannerModuleAvailable();
    if (availability?.available) {
      return true;
    }

    state.scanner.pendingStartAfterInstall = true;
    setScannerBusy(false);
    setScannerMessage("Diegiamas telefono QR skenerio modulis. Kai baigsis diegimas, kamera atsidarys automatiškai.", "warning");
    renderAll();
    await scanner.installGoogleBarcodeScannerModule();
    return false;
  } catch (error) {
    setScannerBusy(false);
    setScannerMessage("Nepavyko paruošti telefono QR skenerio modulio.", "error");
    renderAll();
    createToast("Nepavyko paruošti telefono QR skenerio.", "warning");
    return false;
  }
}

async function startInAppQrScan() {
  const scanner = getBarcodeScannerPlugin();
  if (!scanner?.scan || !scanner?.isSupported) {
    setScannerBusy(false);
    setScannerMessage("Šioje aplinkoje kamera QR skenavimui nepalaikoma.", "warning");
    renderAll();
    createToast("In-app QR skeneris šiame įrenginyje nepalaikomas.", "warning");
    return;
  }

  if (state.shareRequestId) {
    closeShareRequest();
  }
  if (state.paymentReview.open) {
    closePaymentReview();
  }

  setScannerBusy(true);
  setScannerMessage("Atidaroma kamera KidFund QR skenavimui...", "");
  renderAll();

  try {
    const support = await scanner.isSupported();
    if (!support?.supported) {
      setScannerBusy(false);
      setScannerMessage("Šiame įrenginyje QR skeneris nepalaikomas.", "warning");
      renderAll();
      createToast("QR skeneris šiame įrenginyje nepalaikomas.", "warning");
      return;
    }

    const moduleReady = await ensureScannerModuleReady(scanner);
    if (!moduleReady) {
      return;
    }

    const result = await scanner.scan({
      formats: ["QR_CODE"],
      autoZoom: true,
    });
    const barcode = result?.barcodes?.[0] || null;
    const deepLink = getBarcodeDeepLink(barcode);

    setScannerBusy(false);

    if (!barcode) {
      setScannerMessage("Skenavimas uždarytas arba QR kodas nerastas.", "warning");
      renderAll();
      createToast("QR skenavimas nutrauktas arba nieko nerasta.", "warning");
      return;
    }

    if (!deepLink) {
      setScannerMessage("QR nuskaitytas, bet tai ne KidFund mokėjimo QR kodas.", "warning");
      renderAll();
      createToast("Nuskaitytas QR nėra KidFund mokėjimo užklausa.", "warning");
      return;
    }

    setScannerMessage("QR nuskaitytas. Atidaromas KidFund review ekranas.", "success");
    renderAll();
    handleIncomingDeepLink(deepLink);
  } catch (error) {
    setScannerBusy(false);
    setScannerMessage("QR skenerio paleisti nepavyko. Pabandyk dar kartą.", "error");
    renderAll();
    createToast("Nepavyko paleisti in-app QR skenerio.", "warning");
  }
}

async function initBarcodeScanner() {
  const scanner = getBarcodeScannerPlugin();
  if (!scanner?.addListener) {
    return;
  }

  if (window.Capacitor?.getPlatform?.() === "android") {
    try {
      await scanner.addListener("googleBarcodeScannerModuleInstallProgress", (event) => {
        const progress = Number.isFinite(event?.progress) ? Math.round(event.progress) : 0;
        const stateCode = event?.state;

        if (stateCode === 4) {
          setScannerMessage("Telefono QR skenerio modulis paruoštas.", "success");
          renderAll();
          if (state.scanner.pendingStartAfterInstall) {
            state.scanner.pendingStartAfterInstall = false;
            void startInAppQrScan();
          }
          return;
        }

        if (stateCode === 5 || stateCode === 3) {
          state.scanner.pendingStartAfterInstall = false;
          setScannerBusy(false);
          setScannerMessage(
            stateCode === 3 ? "QR skenerio modulio diegimas atšauktas." : "QR skenerio modulio diegimas nepavyko.",
            "error",
          );
          renderAll();
          return;
        }

        if (stateCode === 2) {
          setScannerMessage(`Atsiunčiamas telefono QR skenerio modulis: ${progress}%.`, "warning");
        } else if (stateCode === 6) {
          setScannerMessage("Diegiamas telefono QR skenerio modulis...", "warning");
        } else if (stateCode === 1) {
          setScannerMessage("Paruoštas QR skenerio modulio diegimas...", "warning");
        } else if (stateCode === 7) {
          setScannerMessage("QR skenerio modulio atsiuntimas pristabdytas.", "warning");
        }
        renderAll();
      });
    } catch (error) {
      // Ignore listener failures on unsupported platforms.
    }
  }
}

function getPaymentRequestById(requestId) {
  return appData.requests.find((request) => request.id === requestId) || null;
}

function buildPaymentReviewPayloadFromRequest(request) {
  if (!request) {
    return null;
  }

  const account = getAccountConfig(request.accountType || "wallet");
  return {
    requestId: request.id,
    amount: sanitizeAmount(request.amount),
    accountType: account.type,
    accountTitle: account.title,
    accountBadge: account.badge,
    accountNumber: request.accountNumber || account.accountNumber,
    recipientName: request.recipientName || "KidFund",
    requestDate: request.createdAt || nowIso(),
    requestStatus: request.status || "open",
    source: "request",
  };
}

function buildPaymentDeepLink(payload) {
  if (!payload) {
    return "";
  }

  const params = new URLSearchParams({
    requestId: payload.requestId || uid("scan"),
    amount: String(sanitizeAmount(payload.amount)),
    accountType: payload.accountType || "wallet",
    accountNumber: payload.accountNumber || getAccountConfig(payload.accountType || "wallet").accountNumber,
    recipientName: payload.recipientName || "KidFund",
    accountTitle: payload.accountTitle || getAccountConfig(payload.accountType || "wallet").title,
    requestDate: payload.requestDate || nowIso(),
  });
  return `kidfund://pay/review?${params.toString()}`;
}

function buildPaymentShareTextFromPayload(payload) {
  if (!payload) {
    return "";
  }

  return [
    "KidFund pavedimo užklausa",
    `Suma: ${formatCurrency(payload.amount)}`,
    `Gavėjas: ${payload.recipientName || "KidFund"}`,
    `Sąskaita: ${payload.accountNumber}`,
    `Skiltis: ${payload.accountTitle}`,
    `Review nuoroda: ${buildPaymentDeepLink(payload)}`,
  ].join("\n");
}

function getPaymentDeepLink(request) {
  const payload = buildPaymentReviewPayloadFromRequest(request);
  if (!payload) {
    return "";
  }

  return request.deepLink || buildPaymentDeepLink(payload);
}

function parsePaymentReviewUrl(url) {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    const pathName = (parsed.pathname || "").replace(/\/+$/, "");
    if (parsed.protocol !== "kidfund:" || parsed.host !== "pay" || pathName !== "/review") {
      return null;
    }

    const accountType = parsed.searchParams.get("accountType") || "wallet";
    const fallbackAccount = getAccountConfig(accountType);
    return {
      requestId: parsed.searchParams.get("requestId") || uid("scan"),
      amount: sanitizeAmount(parsed.searchParams.get("amount")),
      accountType,
      accountTitle: parsed.searchParams.get("accountTitle") || fallbackAccount.title,
      accountBadge: fallbackAccount.badge,
      accountNumber: parsed.searchParams.get("accountNumber") || fallbackAccount.accountNumber,
      recipientName: parsed.searchParams.get("recipientName") || "KidFund",
      requestDate: parsed.searchParams.get("requestDate") || nowIso(),
      requestStatus: "open",
      source: "deep-link",
    };
  } catch (error) {
    return null;
  }
}

function getShareRequestText(request) {
  if (!request) {
    const account = getAccountConfig(state.paymentRequestAccount);
    return buildPaymentShareTextFromPayload({
      requestId: uid("preview"),
      amount: state.paymentRequestAmount,
      accountType: account.type,
      accountTitle: account.title,
      accountNumber: account.accountNumber,
      recipientName: "KidFund",
      requestDate: nowIso(),
    });
  }
  return request.shareText || buildPaymentShareTextFromPayload(buildPaymentReviewPayloadFromRequest(request));
}

function openPaymentReview(payload, source = "manual") {
  if (!payload) {
    return;
  }

  state.paymentReview = {
    open: true,
    payload: {
      ...payload,
      amount: sanitizeAmount(payload.amount),
      requestStatus: payload.requestStatus || "open",
    },
    source,
  };
  renderPaymentReviewModal();
}

function closePaymentReview() {
  state.paymentReview = {
    open: false,
    payload: null,
    source: "",
  };
  renderPaymentReviewModal();
}

function openPaymentReviewForRequest(requestId) {
  const request = getPaymentRequestById(requestId);
  if (!request) {
    createToast("Ši pavedimo užklausa nerasta.", "warning");
    return;
  }

  if (state.shareRequestId) {
    state.shareRequestId = null;
    renderShareRequestModal();
  }

  openPaymentReview(buildPaymentReviewPayloadFromRequest(request), "request");
}

function renderPaymentReviewModal() {
  const isOpen = state.paymentReview.open && state.paymentReview.payload;
  elements.paymentReviewModal.classList.toggle("hidden", !isOpen);
  elements.paymentReviewModal.setAttribute("aria-hidden", String(!isOpen));
  updateModalBodyLock();

  if (!isOpen) {
    elements.paymentReviewBankCard.innerHTML = "";
    elements.paymentReviewMeta.innerHTML = "";
    return;
  }

  const payload = state.paymentReview.payload;
  const safeStatus = payload.requestStatus === "completed" ? "completed" : "open";
  const statusLabel = safeStatus === "completed" ? "Patvirtinta" : "Laukia review";
  const statusClass = safeStatus === "completed" ? "success" : "active";
  const requestDate = formatDate(payload.requestDate);

  elements.paymentReviewTitle.textContent = "KidFund payment review";
  elements.paymentReviewCopy.textContent =
    safeStatus === "completed"
      ? "Ši užklausa jau buvo patvirtinta. Gali peržiūrėti detales arba uždaryti ekraną."
      : "Po scan pirmiausia rodomas review ekranas. Tik paspaudus patvirtinimą įvykdoma demo pervedimo logika.";
  elements.paymentReviewBankCard.innerHTML = `
    <div class="bank-card-top">
      <div>
        <p class="eyebrow">KidFund review</p>
        <h4>${escapeHtml(payload.accountTitle)}</h4>
      </div>
      ${renderUiIcon("qr", "feature-icon bank-icon")}
    </div>
    <div class="bank-card-amount">${formatCurrency(payload.amount)}</div>
    <div class="bank-card-meta">
      <div>
        <span class="stack-meta">Gavėjas</span>
        <strong>${escapeHtml(payload.recipientName)}</strong>
      </div>
      <div>
        <span class="stack-meta">Sąskaita</span>
        <strong>${escapeHtml(payload.accountNumber)}</strong>
      </div>
      <div>
        <span class="stack-meta">Request ID</span>
        <strong>${escapeHtml(payload.requestId)}</strong>
      </div>
      <div>
        <span class="stack-meta">Statusas</span>
        <strong>${statusLabel}</strong>
      </div>
    </div>
  `;
  elements.paymentReviewMeta.innerHTML = `
    <div class="share-meta-header">
      ${renderUiIcon("shield", "feature-icon subtle-icon")}
      <div>
        <h4>Review prieš mokėjimą</h4>
        <p class="list-copy">Taip atrodo saugus srautas po scan: peržiūra, tada patvirtinimas.</p>
      </div>
    </div>
    <div class="mission-row">
      <span class="mini-pill">🔗 ${escapeHtml(state.paymentReview.source === "deep-link" ? "Deep link / QR" : "KidFund vidus")}</span>
      <span class="mini-pill">📅 ${escapeHtml(requestDate)}</span>
      <span class="mini-pill">🏦 ${escapeHtml(payload.accountBadge || "KidFund")}</span>
    </div>
    <div class="review-status-row">
      <span class="status-tag ${statusClass}">${statusLabel}</span>
      <span class="list-copy">Mokėjimas nebus atliktas vien tik po scan.</span>
    </div>
    <span class="account-number review-link">${escapeHtml(buildPaymentDeepLink(payload))}</span>
  `;
  elements.paymentReviewConfirmButton.disabled = safeStatus === "completed";
}

function handleIncomingDeepLink(url) {
  const payload = parsePaymentReviewUrl(url);
  if (!payload) {
    return false;
  }

  const existingRequest = getPaymentRequestById(payload.requestId);
  openPaymentReview(existingRequest ? buildPaymentReviewPayloadFromRequest(existingRequest) : payload, "deep-link");
  createToast("Atidarytas mokėjimo review ekranas po scan.", "success");
  return true;
}

async function initDeepLinkHandling() {
  handleIncomingDeepLink(window.location.href);

  const appPlugin = window.Capacitor?.Plugins?.App;
  if (!appPlugin?.addListener) {
    return;
  }

  try {
    await appPlugin.addListener("appUrlOpen", ({ url }) => {
      handleIncomingDeepLink(url);
    });
  } catch (error) {
    // Ignore if the plugin is unavailable on the current platform.
  }

  if (appPlugin.getLaunchUrl) {
    try {
      const launchData = await appPlugin.getLaunchUrl();
      if (launchData?.url) {
        handleIncomingDeepLink(launchData.url);
      }
    } catch (error) {
      // Ignore missing launch URL support.
    }
  }
}

function openShareRequest(requestId) {
  state.shareRequestId = requestId;
  renderShareRequestModal();
}

function closeShareRequest() {
  state.shareRequestId = null;
  renderShareRequestModal();
}

function renderShareRequestModal() {
  const request = state.shareRequestId ? getPaymentRequestById(state.shareRequestId) : null;
  const isOpen = Boolean(request);
  elements.shareRequestModal.classList.toggle("hidden", !isOpen);
  elements.shareRequestModal.setAttribute("aria-hidden", String(!isOpen));
  updateModalBodyLock();

  if (!isOpen) {
    elements.shareQrCode.innerHTML = "";
    elements.shareRequestBankCard.innerHTML = "";
    elements.shareRequestMeta.innerHTML = "";
    return;
  }

  const account = getAccountConfig(request.accountType || "wallet");
  const shareText = getShareRequestText(request);
  const deepLink = getPaymentDeepLink(request);
  const requestDate = formatDate(request.createdAt);

  elements.shareRequestTitle.textContent = `KidFund mokėjimo kortelė`;
  elements.shareRequestCopy.textContent =
    "Gavėjas gali nuskenuoti QR, atidaryti review ekraną, nukopijuoti duomenis arba gauti šią užklausą per share.";
  elements.shareRequestBankCard.innerHTML = `
    <div class="bank-card-top">
      <div>
        <p class="eyebrow">KidFund transfer request</p>
        <h4>${escapeHtml(account.title)}</h4>
      </div>
      ${renderUiIcon("bank", "feature-icon bank-icon")}
    </div>
    <div class="bank-card-amount">${formatCurrency(request.amount)}</div>
    <div class="bank-card-meta">
      <div>
        <span class="stack-meta">Gavėjas</span>
        <strong>KidFund</strong>
      </div>
      <div>
        <span class="stack-meta">Sąskaita</span>
        <strong>${escapeHtml(account.accountNumber)}</strong>
      </div>
      <div>
        <span class="stack-meta">Request ID</span>
        <strong>${escapeHtml(request.id)}</strong>
      </div>
      <div>
        <span class="stack-meta">Data</span>
        <strong>${requestDate}</strong>
      </div>
    </div>
  `;
  elements.shareRequestMeta.innerHTML = `
    <div class="share-meta-header">
      ${renderUiIcon("copy", "feature-icon subtle-icon")}
      <div>
        <h4>Tekstas pavedimui</h4>
        <p class="list-copy">Šį tekstą gali kopijuoti arba siųsti tam, kas atliks pervedimą. QR atidaro review ekraną.</p>
      </div>
    </div>
    <span class="account-number" id="shareRequestText">${escapeHtml(shareText)}</span>
    <div class="mission-row">
      <span class="mini-pill">👤 Gavėjas: KidFund</span>
      <span class="mini-pill">💸 Suma: ${formatCurrency(request.amount)}</span>
      <span class="mini-pill">🏦 ${account.badge}</span>
    </div>
    <span class="account-number review-link">${escapeHtml(deepLink)}</span>
  `;
  elements.shareQrCode.innerHTML = "";

  if (typeof window.QRCode === "function") {
    // qrcodejs renders a real QR image/canvas directly into the target element.
    const qrInstance = new window.QRCode(elements.shareQrCode, {
      text: deepLink,
      width: 180,
      height: 180,
      colorDark: "#08101c",
      colorLight: "#ffffff",
      correctLevel: window.QRCode.CorrectLevel?.M || 0,
    });

    // Prefer the original canvas on Android WebView because the generated
    // PNG fallback image can appear blank even when the canvas was drawn.
    const qrDrawing = qrInstance?._oDrawing;
    if (qrDrawing?._elCanvas) {
      qrDrawing._elCanvas.style.display = "block";
    }
    if (qrDrawing?._elImage) {
      qrDrawing._elImage.style.display = "none";
      qrDrawing._elImage.removeAttribute("src");
    }
  } else {
    elements.shareQrCode.innerHTML = '<div class="list-copy">QR nepavyko įkelti.</div>';
  }
}

function syncMiniGameProgress() {
  state.miniGames.level = 1 + Math.floor(state.miniGames.points / 30);
}

function awardMiniGamePoints(flagKey, points) {
  if (!state.miniGames[flagKey]) {
    state.miniGames.points += points;
    state.miniGames[flagKey] = true;
    syncMiniGameProgress();
  }
}

function renderMiniGames() {
  const piggyRewardReached = state.miniGames.piggyTaps >= 8;
  const budgetOptions = [
    { id: "split", label: "Paskirstyti: išleisti + taupyti", correct: true },
    { id: "all-spend", label: "Išleisti viską iškart", correct: false },
    { id: "hide", label: "Paslėpti ir nematyti", correct: false },
  ];
  const memorySequence = ["🐷", "🪙", "🚀"];
  const levelProgress = Math.min(100, ((state.miniGames.points % 30) / 30) * 100);
  const choiceOptions = [
    { id: "snack", label: "Užkandis šiandien", correct: false },
    { id: "bike", label: "Dviratis vasarai", correct: true },
    { id: "skin", label: "Žaidimo skin dabar", correct: false },
  ];
  const luckyCards = [
    { id: "coin", emoji: "🪙", label: "Gavai +1 taupymo žvaigždę!" },
    { id: "rocket", emoji: "🚀", label: "Laikas peržiūrėti investavimo pamoką!" },
    { id: "piggy", emoji: "🐷", label: "Patikrink savo taupyklės progresą!" },
  ];
  const pointsIntoLevel = state.miniGames.points % 30;
  const pointsToNextLevel = 30 - pointsIntoLevel || 30;

  elements.miniGamesBoard.innerHTML = `
    <div class="game-card game-summary-card">
      <div class="inline-row">
        <h4>🎮 KidFund žaidimų progresas</h4>
        <span class="game-score">Lygis ${state.miniGames.level}</span>
      </div>
      <p class="list-copy">Rink taškus, pereik užduotis ir paversk taupymą mažais laimėjimais.</p>
      <div class="mission-row">
        <span class="mini-pill">⭐ ${state.miniGames.points} taškų</span>
        <span class="mini-pill">🏆 Lygis ${state.miniGames.level}</span>
        <span class="mini-pill">🎯 Iki kito lygio ${pointsToNextLevel} tšk.</span>
      </div>
      <div class="mini-progress"><span style="width: ${levelProgress}%"></span></div>
    </div>
    <div class="game-card">
      <div class="inline-row">
        <h4>🐷 Tap tap taupyklė</h4>
        <span class="game-score">${state.miniGames.piggyTaps} tap · ${state.miniGames.piggyRewarded ? "+10 tšk." : "0 tšk."}</span>
      </div>
      <p class="list-copy">Paspausk taupyklę kelis kartus ir surink mažą motyvacinę žinutę.</p>
      <div class="copy-row">
        <button class="button primary compact-button" type="button" data-action="mini-piggy-tap">
          Spausti taupyklę
        </button>
        <span class="mini-pill">${piggyRewardReached ? "🎉 Super!" : "💫 Dar keli paspaudimai"}</span>
      </div>
      <p class="list-copy">${piggyRewardReached ? "Šaunu! Tu jau įrodei, kad mažais žingsniais galima nueiti toli." : "Kiekvienas mažas įdėjimas į taupyklę artina prie didelio tikslo."}</p>
    </div>
    <div class="game-card">
      <div class="inline-row">
        <h4>🎯 Greitas pasirinkimas</h4>
        <span class="game-score">${state.miniGames.choiceAnswered ? (state.miniGames.choiceRewarded ? "+12 tšk." : "Atsakyta") : "Laukia"}</span>
      </div>
      <p class="list-copy">Kas labiau tinka taupymo tikslui, o ne momentiniam norui?</p>
      <div class="answer-grid">
        ${choiceOptions
          .map((option) => {
            const optionState =
              state.miniGames.choiceAnswered && state.miniGames.choiceSelected === option.id
                ? option.correct
                  ? "correct"
                  : "wrong"
                : state.miniGames.choiceAnswered && option.correct
                  ? "correct"
                  : "";
            return `
              <button class="game-button ${optionState}" type="button" data-action="mini-choice" data-choice-id="${option.id}">
                ${option.label}
              </button>
            `;
          })
          .join("")}
      </div>
      <p class="list-copy">${
        state.miniGames.choiceAnswered
          ? state.miniGames.choiceSelected === "bike"
            ? "Teisingai! Didesnis tikslas paprastai geriau tinka taupymui."
            : "Ne visai - ilgalaikiam taupymui geriau rinktis didesnį tikslą."
          : "Pasirink vieną variantą."
      }</p>
    </div>
    <div class="game-card">
      <div class="inline-row">
        <h4>🎁 Laimės korta</h4>
        <span class="game-score">${state.miniGames.cardPick ? (state.miniGames.cardRewarded ? "+8 tšk." : "Atverta") : "Uždaryta"}</span>
      </div>
      <p class="list-copy">Pasirink vieną kortą ir gauk mažą KidFund dienos misiją.</p>
      <div class="answer-grid">
        ${luckyCards
          .map(
            (card) => `
              <button class="game-button ${state.miniGames.cardPick === card.id ? "active" : ""}" type="button" data-action="mini-card-pick" data-card-id="${card.id}">
                <span class="big-emoji">${state.miniGames.cardPick === card.id ? card.emoji : "❓"}</span>
              </button>
            `,
          )
          .join("")}
      </div>
      <p class="list-copy">${
        state.miniGames.cardPick
          ? luckyCards.find((card) => card.id === state.miniGames.cardPick)?.label || ""
          : "Atverk vieną kortą."
      }</p>
    </div>
    <div class="game-card">
      <div class="inline-row">
        <h4>🧠 Biudžeto sprintas</h4>
        <span class="game-score">${state.miniGames.budgetChoice ? (state.miniGames.budgetRewarded ? "+15 tšk." : "Bandyk dar") : "Laukia"}</span>
      </div>
      <p class="list-copy">Kuris pasirinkimas yra protingiausias gavus kišenpinigių?</p>
      <div class="answer-grid">
        ${budgetOptions
          .map((option) => {
            const optionState =
              state.miniGames.budgetChoice === option.id
                ? option.correct
                  ? "correct"
                  : "wrong"
                : state.miniGames.budgetChoice && option.correct
                  ? "correct"
                  : "";
            return `
              <button class="game-button ${optionState}" type="button" data-action="mini-budget" data-budget-id="${option.id}">
                ${option.label}
              </button>
            `;
          })
          .join("")}
      </div>
      <p class="list-copy">${
        state.miniGames.budgetChoice
          ? state.miniGames.budgetChoice === "split"
            ? "Teisingai! Paskirstymas tarp išleidimo ir taupymo yra protingas startas."
            : "Dar ne. Geriausia pinigus paskirstyti, o ne išleisti visus iškart."
          : "Pasirink vieną variantą."
      }</p>
    </div>
    <div class="game-card">
      <div class="inline-row">
        <h4>🚀 Emoji seka</h4>
        <span class="game-score">${state.miniGames.memorySolved ? "+20 tšk." : `Žingsnis ${Math.min(state.miniGames.memoryStep + 1, memorySequence.length)}/${memorySequence.length}`}</span>
      </div>
      <p class="list-copy">Paspausk emoji tokia tvarka: ${memorySequence.join(" → ")}</p>
      <div class="answer-grid">
        ${shuffleArray(memorySequence)
          .map(
            (emoji) => `
              <button class="game-button" type="button" data-action="mini-memory" data-memory-emoji="${emoji}">
                <span class="big-emoji">${emoji}</span>
              </button>
            `,
          )
          .join("")}
      </div>
      <p class="list-copy">${
        state.miniGames.memorySolved
          ? "Puiku! Seka užbaigta ir tavo lygis auga."
          : state.miniGames.memoryStep > 0
            ? `Teisingai, tęsk toliau.`
            : "Pradėk nuo pirmo emoji."
      }</p>
    </div>
  `;
}

function getPinKey(role) {
  return role === "parent" ? "parentPin" : "childPin";
}

function getPinForRole(role) {
  return authStore[getPinKey(role)] || "";
}

function getSelectedInvestment() {
  return INVESTMENTS.find((investment) => investment.id === state.selectedInvestmentId) || INVESTMENTS[0];
}

function isParentOnlyTab(tab) {
  return PARENT_ONLY_TABS.has(tab);
}

function ensureChildSafeTab() {
  if (state.mode === "child" && isParentOnlyTab(state.activeTab)) {
    state.activeTab = "home";
  }
}

function createToast(message, tone = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${tone}`;
  toast.textContent = message;
  elements.toastStack.appendChild(toast);
  window.setTimeout(() => {
    toast.remove();
  }, 3200);
}

async function ensureNotificationPermission() {
  const localNotifications = window.Capacitor?.Plugins?.LocalNotifications;
  if (localNotifications?.checkPermissions && localNotifications?.requestPermissions) {
    try {
      let permissions = await localNotifications.checkPermissions();
      if (permissions.display !== "granted") {
        permissions = await localNotifications.requestPermissions();
      }
      return permissions.display === "granted";
    } catch (error) {
      return false;
    }
  }

  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      return true;
    }
    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
  }

  return false;
}

async function sendDeviceNotification(message, tone = "success") {
  const title = tone === "warning" ? "KidFund perspėjimas" : "KidFund pranešimas";
  const localNotifications = window.Capacitor?.Plugins?.LocalNotifications;

  if (localNotifications?.schedule) {
    const granted = await ensureNotificationPermission();
    if (!granted) {
      return;
    }

    try {
      await localNotifications.schedule({
        notifications: [
          {
            id: Date.now() % 2147483000,
            title,
            body: message,
            schedule: {
              at: new Date(Date.now() + 250),
            },
          },
        ],
      });
      return;
    } catch (error) {
      // Fall through to browser notifications if available.
    }
  }

  if ("Notification" in window) {
    const granted = await ensureNotificationPermission();
    if (granted) {
      new Notification(title, { body: message });
    }
  }
}

function appendFeed(message, tone = "success", options = {}) {
  appData.feed.unshift({
    id: uid("feed"),
    tone,
    message,
    createdAt: nowIso(),
  });
  appData.feed = appData.feed.slice(0, 40);
  saveAppData();

  if (!options.skipDeviceNotification) {
    void sendDeviceNotification(message, tone);
  }
}

function renderPinSlots(container, buffer) {
  container.innerHTML = "";
  const safeBuffer = sanitizePin(buffer);
  Array.from({ length: 4 }, (_, index) => {
    const slot = document.createElement("div");
    slot.className = `pin-slot ${index < safeBuffer.length ? "filled" : ""}`;
    slot.textContent = index < safeBuffer.length ? "•" : "";
    container.appendChild(slot);
  });
}

function renderKeypad(container, keypadName) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"];
  container.innerHTML = "";

  keys.forEach((key) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `key-button ${key === "clear" || key === "back" ? "secondary-key" : ""}`;
    button.dataset.keypad = keypadName;
    button.dataset.key = key;
    button.textContent = key === "clear" ? "C" : key === "back" ? "⌫" : key;
    container.appendChild(button);
  });
}

function setAuthMessage(message, tone = "") {
  state.authMessage = message;
  state.authMessageTone = tone;
}

function setConfirmMessage(message, tone = "") {
  state.confirm.message = message;
  state.confirm.messageTone = tone;
}

function renderAuth() {
  const hasPin = Boolean(getPinForRole(state.authRole));
  const brand = getAuthBrandContent();
  const authText =
    state.authRole === "child"
      ? state.authMode === "login"
        ? "Įvesk PIN ir iškart pateksi į savo taupymo bei investavimo nuotykius."
        : "Susikurk 4 skaičių PIN, kad galėtum prisijungti prie KidFund."
      : state.authMode === "login"
        ? "Prisijunkite su PIN ir iškart pateksite į tėvų valdymo ekraną."
        : "Sukurkite 4 skaitmenų PIN tėvų paskyrai ir patvirtinimų valdymui.";

  elements.authScreen.classList.toggle("hidden", Boolean(state.mode));
  elements.appShell.classList.toggle("hidden", !state.mode);

  Array.from(elements.authRoleSwitch.querySelectorAll("[data-auth-role]")).forEach((button) => {
    button.classList.toggle("active", button.dataset.authRole === state.authRole);
  });

  Array.from(elements.authModeSwitch.querySelectorAll("[data-auth-mode]")).forEach((button) => {
    button.classList.toggle("active", button.dataset.authMode === state.authMode);
  });

  elements.authRoleBadge.textContent = `${getRoleLabel(state.authRole)} paskyra`;
  elements.authBrandEyebrow.textContent = brand.eyebrow;
  elements.authBrandTitle.textContent = brand.title;
  elements.authBrandCopy.textContent = brand.copy;
  elements.authEmojiRow.innerHTML = brand.emojis
    .map((emoji) => `<span class="emoji-chip">${emoji}</span>`)
    .join("");
  elements.authFeatureList.innerHTML = brand.features
    .map(
      (item) => `
        <div class="feature-item">
          ${renderUiIcon(item.icon)}
          <div>
            <strong>${item.title}</strong>
            <p>${item.copy}</p>
          </div>
        </div>
      `,
    )
    .join("");
  elements.authTitle.textContent =
    state.authMode === "login"
      ? `Prisijungti kaip ${getRoleLabel(state.authRole).toLowerCase()}`
      : `Registruotis kaip ${getRoleLabel(state.authRole).toLowerCase()}`;
  elements.authCopy.textContent = hasPin
    ? authText
    : `Šiai rolei PIN dar nesukurtas. Rinkis „Registruotis“ ir išsaugok 4 skaitmenų kodą.`;
  elements.authSubmitButton.textContent =
    state.authRole === "child"
      ? state.authMode === "login"
        ? "Pirmyn"
        : "Susikurti PIN"
      : state.authMode === "login"
        ? "Prisijungti"
        : "Registruoti paskyrą";
  elements.authSubmitButton.disabled = state.authPinBuffer.length !== 4;
  renderPinSlots(elements.authPinSlots, state.authPinBuffer);
  elements.authMessage.textContent = state.authMessage;
  elements.authMessage.className = `validation-text ${state.authMessageTone}`.trim();
}

function completeAuth(role, message) {
  state.mode = role;
  state.authRole = role;
  state.authPinBuffer = "";
  setAuthMessage("", "");
  ensureChildSafeTab();
  void ensureNotificationPermission();
  renderAll();
  createToast(message, "success");
}

function submitAuth() {
  const pin = sanitizePin(state.authPinBuffer);
  const pinKey = getPinKey(state.authRole);
  const existingPin = authStore[pinKey];

  if (pin.length !== 4) {
    setAuthMessage("Įvesk tiksliai 4 skaitmenų PIN.", "error");
    renderAuth();
    return;
  }

  if (state.authMode === "register") {
    if (existingPin) {
      setAuthMessage("Šiai rolei PIN jau sukurtas. Rinkis prisijungimą.", "error");
      renderAuth();
      return;
    }

    authStore[pinKey] = pin;
    saveAuthStore();
    completeAuth(state.authRole, `${getRoleLabel(state.authRole)} paskyra užregistruota.`);
    return;
  }

  if (!existingPin) {
    setAuthMessage("Šiai rolei dar nėra registruoto PIN. Pirmiausia susikurk paskyrą.", "error");
    renderAuth();
    return;
  }

  if (existingPin !== pin) {
    setAuthMessage("Neteisingas PIN. Pabandyk dar kartą.", "error");
    renderAuth();
    return;
  }

  completeAuth(state.authRole, `${getRoleLabel(state.authRole)} prisijungė sėkmingai.`);
}

function handleKeypadInput(keypadName, key) {
  if (keypadName === "auth") {
    if (key === "clear") {
      state.authPinBuffer = "";
      setAuthMessage("", "");
    } else if (key === "back") {
      state.authPinBuffer = state.authPinBuffer.slice(0, -1);
    } else if (state.authPinBuffer.length < 4) {
      state.authPinBuffer = `${state.authPinBuffer}${key}`;
    }
    renderAuth();
    return;
  }

  if (keypadName === "confirm") {
    if (key === "clear") {
      state.confirm.pinBuffer = "";
      setConfirmMessage("", "");
    } else if (key === "back") {
      state.confirm.pinBuffer = state.confirm.pinBuffer.slice(0, -1);
    } else if (state.confirm.pinBuffer.length < 4) {
      state.confirm.pinBuffer = `${state.confirm.pinBuffer}${key}`;
    }
    renderConfirmModal();
  }
}

function logout() {
  const previousRole = state.mode || state.authRole;
  state.mode = null;
  state.authRole = previousRole;
  state.authMode = getPinForRole(previousRole) ? "login" : "register";
  state.authPinBuffer = "";
  setAuthMessage("", "");
  closeConfirm();
  closeShareRequest();
  renderAll();
}

function openConfirm(config) {
  state.confirm = {
    open: true,
    role: config.role,
    title: config.title,
    copy: config.copy,
    buttonLabel: config.buttonLabel || "Patvirtinti",
    pinBuffer: "",
    message: "",
    messageTone: "",
    action: deepClone(config.action),
  };
  renderConfirmModal();
}

function closeConfirm() {
  state.confirm.open = false;
  state.confirm.buttonLabel = "Patvirtinti";
  state.confirm.pinBuffer = "";
  state.confirm.message = "";
  state.confirm.messageTone = "";
  state.confirm.action = null;
  renderConfirmModal();
}

function addPortfolioHolding(assetId, amount) {
  const existingHolding = appData.portfolio.find(
    (holding) => holding.assetId === assetId && holding.status === "active",
  );

  if (existingHolding) {
    existingHolding.amount += amount;
    existingHolding.updatedAt = nowIso();
    return;
  }

  appData.portfolio.unshift({
    id: uid("holding"),
    assetId,
    amount,
    status: "active",
    updatedAt: nowIso(),
  });
}

function executeConfirmAction() {
  const action = state.confirm.action;
  if (!action) {
    return;
  }

  if (action.type === "child-invest-request") {
    const rateLimitMessage = getRateLimitMessage("childInvestRequest");
    if (rateLimitMessage) {
      setConfirmMessage(rateLimitMessage, "error");
      renderConfirmModal();
      return;
    }

    const asset = getSelectedInvestment();
    const amount = sanitizeAmount(action.amount);

    if (amount < asset.min) {
      setConfirmMessage(`Mažiausia suma šiam aktyvui yra ${asset.min} EUR.`, "error");
      renderConfirmModal();
      return;
    }

    if (amount > appData.settings.maxSingleInvest) {
      setConfirmMessage(
        `Vieno investavimo prašymo limitas yra ${appData.settings.maxSingleInvest} EUR.`,
        "error",
      );
      renderConfirmModal();
      return;
    }

    if (asset.type === "Kriptovaliuta" && !appData.settings.cryptoEnabled) {
      setConfirmMessage("Kriptovaliutų investavimas šiuo metu tėvų išjungtas.", "error");
      renderConfirmModal();
      return;
    }

    appData.requests.unshift({
      id: uid("request"),
      type: "investment",
      assetId: asset.id,
      amount,
      status: "pending",
      createdBy: "child",
      createdAt: nowIso(),
    });
    recordAction("childInvestRequest");
    appendFeed(`Vaikas pateikė investavimo prašymą į ${asset.name} už ${formatCurrency(amount)}.`, "warning");
    saveAppData();
    closeConfirm();
    renderAll();
    createToast("Investavimo prašymas išsiųstas tėvams.", "success");
    return;
  }

  if (action.type === "payment-request") {
    const rateLimitMessage = getRateLimitMessage("paymentRequest");
    if (rateLimitMessage) {
      setConfirmMessage(rateLimitMessage, "error");
      renderConfirmModal();
      return;
    }

    const account = getAccountConfig(action.accountType);
    const amount = sanitizeAmount(action.amount);
    const requestId = uid("request");
    const createdAt = nowIso();
    const payload = {
      requestId,
      amount,
      accountType: account.type,
      accountTitle: account.title,
      accountNumber: account.accountNumber,
      recipientName: "KidFund",
      requestDate: createdAt,
    };
    const shareText = buildPaymentShareTextFromPayload(payload);
    const deepLink = buildPaymentDeepLink(payload);

    appData.requests.unshift({
      id: requestId,
      type: "payment-request",
      accountType: account.type,
      accountNumber: account.accountNumber,
      amount,
      status: "open",
      createdBy: state.mode || "child",
      shareText,
      deepLink,
      createdAt,
    });
    const createdRequest = appData.requests[0];
    recordAction("paymentRequest");
    appendFeed(`${getRoleLabel(state.mode)} sukūrė pavedimo užklausą į ${account.title} už ${formatCurrency(amount)}.`, "warning");
    saveAppData();
    closeConfirm();
    openShareRequest(createdRequest.id);
    renderAll();
    createToast("Pavedimo užklausa sukurta. Gali rodyti QR arba dalintis tekstu.", "success");
    return;
  }

  if (action.type === "parent-approve-request") {
    const request = appData.requests.find((item) => item.id === action.requestId);
    if (!request || request.status !== "pending") {
      closeConfirm();
      createToast("Šis prašymas jau nebeaktyvus.", "warning");
      renderAll();
      return;
    }

    if (appData.accounts.investPocket < request.amount) {
      setConfirmMessage("Investavimo kišenėje nepakanka lėšų šiam patvirtinimui.", "error");
      renderConfirmModal();
      return;
    }

    request.status = "approved";
    request.decisionAt = nowIso();
    appData.accounts.investPocket -= request.amount;
    addPortfolioHolding(request.assetId, request.amount);

    const asset = INVESTMENTS.find((item) => item.id === request.assetId);
    appendFeed(
      `Tėvai patvirtino investavimą į ${asset ? asset.name : "pasirinktą aktyvą"} už ${formatCurrency(request.amount)}.`,
      "success",
    );
    saveAppData();
    closeConfirm();
    renderAll();
    createToast("Prašymas patvirtintas.", "success");
    return;
  }

  if (action.type === "parent-reject-request") {
    const request = appData.requests.find((item) => item.id === action.requestId);
    if (!request || request.status !== "pending") {
      closeConfirm();
      createToast("Šis prašymas jau nebeaktyvus.", "warning");
      renderAll();
      return;
    }

    request.status = "rejected";
    request.decisionAt = nowIso();
    const asset = INVESTMENTS.find((item) => item.id === request.assetId);
    appendFeed(
      `Tėvai atmetė investavimo prašymą į ${asset ? asset.name : "pasirinktą aktyvą"}.`,
      "warning",
    );
    saveAppData();
    closeConfirm();
    renderAll();
    createToast("Prašymas atmestas.", "success");
    return;
  }

  if (action.type === "parent-transfer-wallet") {
    const rateLimitMessage = getRateLimitMessage("parentTransferWallet");
    if (rateLimitMessage) {
      setConfirmMessage(rateLimitMessage, "error");
      renderConfirmModal();
      return;
    }

    const amount = sanitizeAmount(action.amount);
    if (appData.accounts.parentReserve < amount) {
      setConfirmMessage("Tėvų rezervas per mažas šiam papildymui.", "error");
      renderConfirmModal();
      return;
    }

    appData.accounts.parentReserve -= amount;
    appData.accounts.wallet += amount;
    recordAction("parentTransferWallet");
    appendFeed(`Tėvai davė vaikui ${formatCurrency(amount)} į piniginę.`, "success");
    saveAppData();
    closeConfirm();
    renderAll();
    createToast("Vaiko piniginė papildyta.", "success");
    return;
  }

  if (action.type === "parent-topup-invest-pocket") {
    const rateLimitMessage = getRateLimitMessage("parentTopupInvestPocket");
    if (rateLimitMessage) {
      setConfirmMessage(rateLimitMessage, "error");
      renderConfirmModal();
      return;
    }

    const amount = sanitizeAmount(action.amount);
    if (appData.accounts.parentReserve < amount) {
      setConfirmMessage("Tėvų rezervas per mažas investavimo kišenei papildyti.", "error");
      renderConfirmModal();
      return;
    }

    appData.accounts.parentReserve -= amount;
    appData.accounts.investPocket += amount;
    recordAction("parentTopupInvestPocket");
    appendFeed(`Tėvai papildė investavimo kišenę ${formatCurrency(amount)}.`, "success");
    saveAppData();
    closeConfirm();
    renderAll();
    createToast("Investavimo kišenė papildyta.", "success");
    return;
  }

  if (action.type === "parent-toggle-crypto") {
    appData.settings.cryptoEnabled = !appData.settings.cryptoEnabled;
    appendFeed(
      appData.settings.cryptoEnabled
        ? "Tėvai įjungė kriptovaliutų investavimo prašymus."
        : "Tėvai išjungė kriptovaliutų investavimo prašymus.",
      "warning",
    );
    saveAppData();
    closeConfirm();
    renderAll();
    createToast("Investavimo nustatymas atnaujintas.", "success");
  }
}

function submitConfirm() {
  const pin = sanitizePin(state.confirm.pinBuffer);
  const expectedPin = getPinForRole(state.confirm.role);

  if (pin.length !== 4) {
    setConfirmMessage("Patvirtinimui reikia 4 skaitmenų PIN.", "error");
    renderConfirmModal();
    return;
  }

  if (!expectedPin) {
    setConfirmMessage("Šiai rolei dar nesukurtas PIN, todėl patvirtinti negalima.", "error");
    renderConfirmModal();
    return;
  }

  if (pin !== expectedPin) {
    setConfirmMessage("Patvirtinimo PIN neteisingas.", "error");
    renderConfirmModal();
    return;
  }

  executeConfirmAction();
}

function renderRoleState() {
  ensureChildSafeTab();

  document.querySelectorAll("[data-parent-only]").forEach((element) => {
    element.hidden = state.mode !== "parent";
  });

  elements.activeRoleChip.textContent = `Aktyvu: ${getRoleLabel(state.mode)}`;
  elements.headerSubtitle.textContent =
    state.mode === "parent"
      ? "Tėvų režimas leidžia papildyti pinigus, valdyti leidimus ir patvirtinti investavimo prašymus."
      : "Vaiko režimas rodo tik saugias skiltis: progresą, mokymąsi ir investavimo prašymo pateikimą.";
}

function renderTabs() {
  Array.from(elements.bottomNav.querySelectorAll("[data-tab]")).forEach((button) => {
    const tab = button.dataset.tab;
    button.hidden = state.mode !== "parent" && isParentOnlyTab(tab);
    button.classList.toggle("active", tab === state.activeTab);
  });

  Array.from(document.querySelectorAll(".tab-panel")).forEach((panel) => {
    const panelName = panel.dataset.panel;
    panel.hidden = state.mode !== "parent" && isParentOnlyTab(panelName);
    panel.classList.toggle("active", panelName === state.activeTab && !panel.hidden);
  });
}

function renderSectionBanner() {
  const meta = TAB_META[state.activeTab];
  elements.sectionBannerTitle.textContent = meta.title;
  elements.sectionBannerCopy.textContent = meta.copy;
}

function renderHome() {
  const remainingLimit = Math.max(0, appData.accounts.weeklyLimit - appData.accounts.spentThisWeek);
  const cards = [
    {
      title: "Vaiko piniginė",
      value: formatCurrency(appData.accounts.wallet),
      meta: `Išleidimui liko ${formatCurrency(remainingLimit)} šią savaitę`,
      icon: "wallet",
    },
    {
      title: "Taupymas",
      value: formatCurrency(appData.accounts.savings),
      meta: `${appData.goals.length} aktyvūs tikslai`,
      icon: "piggy",
    },
    {
      title: "Investavimo kišenė",
      value: formatCurrency(appData.accounts.investPocket),
      meta: "Naudojama tik su tėvų patvirtinimu",
      icon: "chart",
    },
    {
      title: state.mode === "parent" ? "Tėvų rezervas" : "Savaitės limitas",
      value:
        state.mode === "parent"
          ? formatCurrency(appData.accounts.parentReserve)
          : `${formatCurrency(appData.accounts.spentThisWeek)} / ${formatCurrency(appData.accounts.weeklyLimit)}`,
      meta:
        state.mode === "parent"
          ? "Iš šios sumos galima papildyti vaiką"
          : "Išleista prieš savaitinį limitą",
      icon: state.mode === "parent" ? "bank" : "target",
    },
  ];

  elements.homeStats.innerHTML = cards
    .map(
      (card) => `
        <article class="stat-card">
          <div class="inline-row">
            ${renderUiIcon(card.icon, "feature-icon subtle-icon")}
            <span class="stack-meta">${card.title}</span>
          </div>
          <strong>${card.value}</strong>
          <p class="list-copy">${card.meta}</p>
        </article>
      `,
    )
    .join("");

  if (state.mode === "parent") {
    elements.homeMoodTitle.textContent = "Tėvų valdymas be triukšmo";
    elements.homeMoodSpot.innerHTML = `
      <div class="kid-card">
        <div class="inline-row">
          <h4>Šiandienos fokusas</h4>
          ${renderUiIcon("target", "feature-icon subtle-icon")}
        </div>
        <p class="list-copy">Matote vaiko balansą, leidimus, investavimo prašymus ir atskiras sąskaitas vienoje vietoje.</p>
      </div>
      <div class="kid-card">
        <div class="inline-row">
          <h4>App pranešimai</h4>
          ${renderUiIcon("bell", "feature-icon subtle-icon")}
        </div>
        <p class="list-copy">Kiekvienas KidFund feed pranešimas siunčiamas ir kaip telefono notification, kai tik leidimai suteikti.</p>
      </div>
    `;
  } else {
    const spendingPercent = Math.min(
      100,
      Math.round((appData.accounts.spentThisWeek / appData.accounts.weeklyLimit) * 100),
    );
    elements.homeMoodTitle.textContent = "Tavo vaikiškas startas";
    elements.homeMoodSpot.innerHTML = `
      <div class="kid-card">
        <div class="inline-row">
          <h4>Šaunu, prisijungei!</h4>
          ${renderUiIcon("sparkle", "feature-icon subtle-icon")}
        </div>
        <p class="list-copy">Mažiau teksto, daugiau aiškių mygtukų, emoji ir tavo taupymo misijų.</p>
      </div>
      <div class="kid-card">
        <div class="inline-row">
          <h4>Šios savaitės limitas</h4>
          ${renderUiIcon("clock", "feature-icon subtle-icon")}
        </div>
        <p class="list-copy">${formatCurrency(appData.accounts.spentThisWeek)} iš ${formatCurrency(appData.accounts.weeklyLimit)} jau panaudota.</p>
        <div class="mini-progress"><span style="width: ${spendingPercent}%"></span></div>
      </div>
    `;
  }

  elements.partnerSpot.innerHTML = PARTNER_SPOTLIGHTS.map(
    (partner) => `
      <div class="promo-card">
        <div class="inline-row">
          <div class="inline-row">
            ${renderUiIcon("sparkle", "feature-icon subtle-icon")}
            <h4>${partner.title}</h4>
          </div>
          <span class="promo-badge">${partner.badge}</span>
        </div>
        <p class="list-copy">${partner.copy}</p>
        <div class="copy-row">
          <button class="button secondary compact-button" type="button" data-switch-tab="learn">
            Peržiūrėti
          </button>
          <button class="button secondary compact-button" type="button" data-switch-tab="feed">
            Rodyti naujienose
          </button>
        </div>
      </div>
    `,
  ).join("");

  const walletAccount = getAccountConfig("wallet");
  const savingsAccount = getAccountConfig("savings");
  const selectedRequestAccount = getAccountConfig(state.paymentRequestAccount);
  const selectedRequestCopy = `KidFund pavedimo užklausa: pervesk ${formatCurrency(state.paymentRequestAmount)} į ${selectedRequestAccount.title} (${selectedRequestAccount.accountNumber}).`;

  elements.accountHub.innerHTML = `
    ${[walletAccount, savingsAccount]
      .map(
        (account) => `
          <div class="account-card">
            <div class="inline-row">
              <div class="inline-row">
                ${renderUiIcon(account.type === "wallet" ? "wallet" : "piggy", "feature-icon subtle-icon")}
                <h4>${account.title}</h4>
              </div>
              <span class="account-tag">${account.badge}</span>
            </div>
            <p class="list-copy">${account.description}</p>
            <span class="account-number">${account.accountNumber}</span>
            <div class="copy-row">
              <button class="button secondary compact-button" type="button" data-action="copy-account" data-account-type="${account.type}">
                Kopijuoti numerį
              </button>
              <button class="button secondary compact-button" type="button" data-action="set-request-account" data-account-type="${account.type}">
                Naudoti užklausai
              </button>
            </div>
          </div>
        `,
      )
      .join("")}
    <div class="account-card">
      <div class="inline-row">
        <div class="inline-row">
          ${renderUiIcon("qr", "feature-icon subtle-icon")}
          <h4>Gauti pavedimą</h4>
        </div>
        <span class="account-tag">Užklausa</span>
      </div>
      <p class="list-copy">Pasirink sąskaitą, įrašyk sumą ir sugeneruok pavedimo užklausą be sistemos apkrovimo.</p>
      <div class="mission-row">
        <button class="chip-button ${state.paymentRequestAccount === "wallet" ? "active" : ""}" type="button" data-action="set-request-account" data-account-type="wallet">
          Pagrindinė
        </button>
        <button class="chip-button ${state.paymentRequestAccount === "savings" ? "active" : ""}" type="button" data-action="set-request-account" data-account-type="savings">
          Taupyklė
        </button>
      </div>
      <label class="field-label" for="paymentRequestAmountInput">Užklausos suma</label>
      <input id="paymentRequestAmountInput" class="number-input" type="number" min="1" step="1" value="${state.paymentRequestAmount}" />
      <span class="account-number" id="paymentRequestPreview">${selectedRequestCopy}</span>
      <div class="copy-row">
        <button class="button primary compact-button" type="button" data-action="open-payment-request-confirm">
          Sukurti užklausą
        </button>
        <button class="button secondary compact-button" type="button" data-action="copy-request-text">
          Kopijuoti užklausą
        </button>
      </div>
    </div>
  `;

  if (state.mode === "parent") {
    elements.quickActions.innerHTML = `
      <div class="stack-item">
        ${renderUiIcon("gift")}
        <div>
          <strong>Greitai duoti 10 EUR</strong>
          <p class="list-copy">Papildymas bus patvirtintas atskirame PIN modal lange.</p>
          <div class="inline-actions">
            <button class="button primary compact-button" type="button" data-action="open-transfer-confirm" data-amount="10">
              Duoti 10 EUR
            </button>
            <button class="button secondary compact-button" type="button" data-switch-tab="transfers">
              Atverti „Duoti“
            </button>
          </div>
        </div>
      </div>
      <div class="stack-item">
        ${renderUiIcon("chart")}
        <div>
          <strong>Peržiūrėti investavimo prašymus</strong>
          <p class="list-copy">Patvirtinimai ir atmetimai atliekami tik tėvų režime.</p>
          <button class="button secondary compact-button" type="button" data-switch-tab="invest">
            Atverti investavimą
          </button>
        </div>
      </div>
    `;
    elements.kidMissionSpot.innerHTML = `
      <div class="kid-card">
        <div class="inline-row">
          <h4>Tėvų santrauka</h4>
          ${renderUiIcon("bank", "feature-icon subtle-icon")}
        </div>
        <p class="list-copy">Galite sekti, kiek užklausų buvo išsiųsta ir ar anti-spam taisyklės neleidžia perkrauti KidFund sistemos.</p>
      </div>
      <div class="kid-card">
        <div class="inline-row">
          <h4>Push į telefoną</h4>
          ${renderUiIcon("bell", "feature-icon subtle-icon")}
        </div>
        <p class="list-copy">Papildymai, investavimo sprendimai ir naujos užklausos rodomi ne tik viduje, bet ir telefono notification juostoje.</p>
      </div>
    `;
  } else {
    elements.quickActions.innerHTML = `
      <div class="stack-item">
        ${renderUiIcon("rocket")}
        <div>
          <strong>🚀 Nori investuoti?</strong>
          <p class="list-copy">Pasirink aktyvą, spausk mygtuką ir tėvai gaus tavo prašymą.</p>
          <button class="button primary compact-button" type="button" data-switch-tab="invest">
            Eiti į investavimą
          </button>
        </div>
      </div>
      <div class="stack-item">
        ${renderUiIcon("piggy")}
        <div>
          <strong>🐷 Peržiūrėti taupymą</strong>
          <p class="list-copy">Čia matai tik savo progresą, o tėvų valdymo dalys lieka paslėptos.</p>
          <button class="button secondary compact-button" type="button" data-switch-tab="savings">
            Eiti į taupymą
          </button>
        </div>
      </div>
    `;
    elements.kidMissionSpot.innerHTML = `
      <div class="kid-card">
        <div class="inline-row">
          <h4>Mini misija</h4>
          ${renderUiIcon("star", "feature-icon subtle-icon")}
        </div>
        <p class="list-copy">Šiandien pabandyk atsakyti bent į 1 viktorinos klausimą ir pasižiūrėk, kiek jau sutaupei.</p>
        <div class="mission-row">
          <span class="mini-pill">🎯 1 klausimas</span>
          <span class="mini-pill">💰 1 tikslas</span>
          <span class="mini-pill">🧠 1 pamoka</span>
        </div>
      </div>
      <div class="kid-card">
        <div class="inline-row">
          <h4>Emoji patarimas</h4>
          ${renderUiIcon("rocket", "feature-icon subtle-icon")}
        </div>
        <p class="list-copy">Jei nori gauti pinigų į taupyklę, nukopijuok taupyklės numerį arba sukurk pavedimo užklausą.</p>
      </div>
    `;
  }

  const preview = appData.feed.slice(0, 3);
  elements.homeFeedPreview.innerHTML = preview
    .map(
      (item) => `
        <div class="stack-item">
          ${renderUiIcon(getToneIconName(item.tone))}
          <div>
            <strong>${item.message}</strong>
            <p class="list-copy">${formatDate(item.createdAt)}</p>
          </div>
        </div>
      `,
    )
    .join("");
}

function renderSavings() {
  elements.goalsList.innerHTML = appData.goals
    .map((goal) => {
      const progress = Math.min(100, Math.round((goal.saved / goal.target) * 100));
      return `
        <div class="stack-item">
          ${renderUiIcon("target")}
          <div>
            <div class="inline-row">
              <strong>${goal.title}</strong>
              <span class="status-tag ${goal.parentMatchAvailable ? "approved" : "pending"}">
                ${goal.parentMatchAvailable ? "Galimas match" : "Dar kaupiama"}
              </span>
            </div>
            <p class="list-copy">Sukaupta ${formatCurrency(goal.saved)} iš ${formatCurrency(goal.target)}</p>
            <div class="progress-track">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  elements.savingsSummary.innerHTML = `
    <div class="stack-item">
      ${renderUiIcon("savings")}
      <div>
        <strong>Viso santaupų</strong>
        <p class="list-copy">${formatCurrency(appData.accounts.savings)}</p>
      </div>
    </div>
    <div class="stack-item">
      ${renderUiIcon("clock")}
      <div>
        <strong>Savaitės išlaidų limitas</strong>
        <p class="list-copy">${formatCurrency(appData.accounts.spentThisWeek)} iš ${formatCurrency(appData.accounts.weeklyLimit)}</p>
      </div>
    </div>
    <div class="stack-item">
      ${renderUiIcon("sparkle")}
      <div>
        <strong>${state.mode === "parent" ? "Tėvų komentaras" : "Pastaba vaikui"}</strong>
        <p class="list-copy">
          ${state.mode === "parent"
            ? "Leidimų politika valdoma žemiau ir vaikui nerodoma."
            : "Žemiau nematysi tėvų leidimų politikos ar kitų tėvų valdymo funkcijų."}
        </p>
      </div>
    </div>
  `;

  elements.permissionPolicyList.innerHTML = `
    <div class="stack-item">
      ${renderUiIcon("shield")}
      <div>
        <strong>Investavimo tvirtinimas</strong>
        <p class="list-copy">${appData.settings.approvalRule}</p>
      </div>
    </div>
    <div class="stack-item">
      ${renderUiIcon("learn")}
      <div>
        <strong>Vaiko rodoma informacija</strong>
        <p class="list-copy">${appData.settings.savingsPolicy}</p>
      </div>
    </div>
  `;
}

function renderInvestmentCatalog() {
  elements.investmentCatalog.innerHTML = INVESTMENTS.map((investment) => {
    const isSelected = investment.id === state.selectedInvestmentId;
    const cryptoBlocked = investment.type === "Kriptovaliuta" && !appData.settings.cryptoEnabled;
    return `
      <article class="asset-card ${isSelected ? "selected" : ""}">
        <div class="inline-row">
          <strong>${investment.name}</strong>
          <span class="type-pill">${investment.type}</span>
        </div>
        <div class="asset-meta">
          <span class="risk-pill">Rizika: ${investment.risk}</span>
          <span class="stack-meta">Min. ${formatCurrency(investment.min)}</span>
          ${
            cryptoBlocked
              ? '<span class="status-tag rejected">Kripto išjungta</span>'
              : '<span class="status-tag approved">Galima prašyti</span>'
          }
        </div>
        <p class="list-copy">${investment.description}</p>
        <div class="action-row">
          <button class="button secondary compact-button" type="button" data-action="select-asset" data-asset-id="${investment.id}">
            ${isSelected ? "Pasirinkta" : "Rinktis"}
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function renderInvestActionPanel() {
  const selectedInvestment = getSelectedInvestment();
  const pendingRequests = appData.requests.filter(
    (request) => request.type === "investment" && request.status === "pending",
  );

  if (state.mode === "child") {
    elements.investPanelTitle.textContent = "Siųsti prašymą tėvams";
    elements.investActionPanel.innerHTML = `
      <div class="stack-item">
        ${renderUiIcon("chart")}
        <div>
          <strong>Pasirinktas aktyvas: ${selectedInvestment.name}</strong>
          <p class="list-copy">Tipas: ${selectedInvestment.type}. Mažiausia suma: ${formatCurrency(selectedInvestment.min)}.</p>
        </div>
      </div>
      <div>
        <label class="field-label" for="investmentAmountInput">Prašoma suma</label>
        <input
          id="investmentAmountInput"
          class="number-input"
          type="number"
          min="${selectedInvestment.min}"
          step="1"
          value="${state.selectedInvestmentAmount}"
        />
      </div>
      <div class="choice-row">
        ${[selectedInvestment.min, 10, 15, 20]
          .filter((amount, index, values) => values.indexOf(amount) === index)
          .map(
            (amount) => `
              <button
                class="chip-button ${state.selectedInvestmentAmount === amount ? "active" : ""}"
                type="button"
                data-amount-choice="${amount}"
              >
                ${amount} EUR
              </button>
            `,
          )
          .join("")}
      </div>
      <button class="button primary" type="button" data-action="open-invest-request">
        Siųsti investavimo prašymą
      </button>
      <div class="stack-item">
        ${renderUiIcon("lock")}
        <div>
          <strong>Taisyklė</strong>
          <p class="list-copy">Vaikas gali tik pateikti prašymą. Patvirtinimo mygtukų čia nėra.</p>
        </div>
      </div>
    `;
    return;
  }

  elements.investPanelTitle.textContent = "Laukiantys tėvų sprendimo";

  if (!pendingRequests.length) {
    elements.investActionPanel.innerHTML = `
      <div class="stack-item">
        ${renderUiIcon("check")}
        <div>
          <strong>Nėra laukiančių prašymų</strong>
          <p class="list-copy">Kai vaikas pateiks investavimo prašymą, jis bus rodomas čia.</p>
        </div>
      </div>
    `;
    return;
  }

  elements.investActionPanel.innerHTML = pendingRequests
    .map((request) => {
      const asset = INVESTMENTS.find((investment) => investment.id === request.assetId);
      return `
        <div class="stack-item">
          ${renderUiIcon("bell")}
          <div>
            <div class="inline-row">
              <strong>${asset ? asset.name : "Aktyvas"}</strong>
              <span class="status-tag pending">Laukia</span>
            </div>
            <p class="list-copy">Prašoma investuoti ${formatCurrency(request.amount)}.</p>
            <p class="list-copy">${formatDate(request.createdAt)}</p>
            <div class="inline-actions">
              <button class="button primary compact-button" type="button" data-action="approve-request" data-request-id="${request.id}">
                Patvirtinti
              </button>
              <button class="button secondary compact-button" type="button" data-action="reject-request" data-request-id="${request.id}">
                Atmesti
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderPortfolio() {
  const rows = appData.portfolio.map((holding) => {
    const asset = INVESTMENTS.find((investment) => investment.id === holding.assetId);
    return `
      <div class="stack-item">
        ${renderUiIcon("chart")}
        <div>
          <div class="inline-row">
            <strong>${asset ? asset.name : "Investicija"}</strong>
            <span class="status-tag active">Aktyvi</span>
          </div>
          <p class="list-copy">Suma: ${formatCurrency(holding.amount)}</p>
          <p class="list-copy">Atnaujinta: ${formatDate(holding.updatedAt)}</p>
        </div>
      </div>
    `;
  });

  const requestHistory = appData.requests
    .filter((request) => request.type === "investment")
    .slice(0, 4)
    .map((request) => {
      const asset = INVESTMENTS.find((investment) => investment.id === request.assetId);
      return `
        <div class="stack-item">
          ${renderUiIcon("send")}
          <div>
            <div class="inline-row">
              <strong>${asset ? asset.name : "Investavimo prašymas"}</strong>
              <span class="status-tag ${request.status}">${
                request.status === "approved"
                  ? "Patvirtinta"
                  : request.status === "rejected"
                    ? "Atmesta"
                    : "Laukia"
              }</span>
            </div>
            <p class="list-copy">${formatCurrency(request.amount)} · ${formatDate(request.createdAt)}</p>
          </div>
        </div>
      `;
    });

  elements.portfolioList.innerHTML = [...rows, ...requestHistory].join("");
}

function renderParentInvestControls() {
  elements.parentInvestControls.innerHTML = `
    <div class="stack-item">
      ${renderUiIcon("gift")}
      <div>
        <strong>Papildyti investavimo kišenę</strong>
        <p class="list-copy">Dabartinis likutis: ${formatCurrency(appData.accounts.investPocket)}</p>
        <div class="inline-actions">
          <button class="button primary compact-button" type="button" data-action="open-topup-confirm" data-amount="10">
            +10 EUR
          </button>
          <button class="button secondary compact-button" type="button" data-action="open-topup-confirm" data-amount="20">
            +20 EUR
          </button>
        </div>
      </div>
    </div>
    <div class="stack-item">
      ${renderUiIcon("lock")}
      <div>
        <strong>Kriptovaliutų leidimas</strong>
        <p class="list-copy">${
          appData.settings.cryptoEnabled
            ? "Šiuo metu vaikas gali siųsti kripto prašymus."
            : "Kripto prašymai šiuo metu užblokuoti."
        }</p>
        <button class="button secondary compact-button" type="button" data-action="toggle-crypto-setting">
          ${appData.settings.cryptoEnabled ? "Išjungti kripto" : "Įjungti kripto"}
        </button>
      </div>
    </div>
    <div class="stack-item">
      ${renderUiIcon("target")}
      <div>
        <strong>Maksimalus vieno prašymo limitas</strong>
        <p class="list-copy">${formatCurrency(appData.settings.maxSingleInvest)}</p>
      </div>
    </div>
  `;
}

function renderInvest() {
  renderInvestmentCatalog();
  renderInvestActionPanel();
  renderPortfolio();
  renderParentInvestControls();
}

function renderLearn() {
  elements.lessonGrid.innerHTML = LESSONS.map(
    (lesson, index) => `
      <article class="asset-card">
        <div class="inline-row">
          <strong>${lesson.title}</strong>
          <span class="type-pill">Pamoka ${index + 1}</span>
        </div>
        <p class="list-copy">${lesson.copy}</p>
      </article>
    `,
  ).join("");
}

function renderQuiz() {
  const question = QUIZ_QUESTIONS[state.quizIndex];
  elements.quizQuestion.textContent = question.question;
  elements.quizHelper.textContent = question.helper;
  elements.quizFeedback.textContent = state.quizFeedback;
  elements.quizFeedback.className = `validation-text ${state.quizFeedbackTone}`.trim();
  elements.quizOptions.innerHTML = state.quizOptionOrder
    .map((optionIndex, shuffledIndex) => {
      const option = question.options[optionIndex];
      let optionClass = "";
      if (state.selectedQuizAnswer !== null) {
        if (optionIndex === question.correctIndex) {
          optionClass = "correct";
        } else if (shuffledIndex === state.selectedQuizAnswer) {
          optionClass = "wrong";
        }
      }

      return `
        <button class="quiz-option ${optionClass}" type="button" data-quiz-option="${shuffledIndex}">
          ${option}
        </button>
      `;
    })
    .join("");
}

function renderFeed() {
  elements.feedList.innerHTML = appData.feed
    .map(
      (item) => `
        <div class="stack-item">
          ${renderUiIcon(getToneIconName(item.tone))}
          <div>
            <strong>${item.message}</strong>
            <p class="list-copy">${formatDate(item.createdAt)}</p>
          </div>
        </div>
      `,
    )
    .join("");
}

function renderTransfers() {
  elements.transferActions.innerHTML = `
    <div class="stack-item">
      ${renderUiIcon("camera")}
      <div>
        <strong>In-app QR skeneris</strong>
        <p class="list-copy">Atidaro tikrą telefono kamerą programėlės viduje. Nuskenavus KidFund QR, iškart atsidaro payment review ekranas.</p>
        <div class="inline-actions">
          <button class="button primary compact-button" type="button" data-action="scan-payment-qr" ${state.scanner.busy ? "disabled" : ""}>
            ${state.scanner.busy ? "Atidaroma kamera..." : "Skenuoti QR su kamera"}
          </button>
        </div>
        <p class="${`validation-text ${state.scanner.messageTone}`.trim()}">${escapeHtml(state.scanner.message)}</p>
      </div>
    </div>
    <div class="stack-item">
      ${renderUiIcon("gift")}
      <div>
        <strong>Greitas papildymas į piniginę</strong>
        <p class="list-copy">Papildymai atliekami tik per atskirą patvirtinimo modal langą.</p>
        <div class="inline-actions">
          <button class="button primary compact-button" type="button" data-action="open-transfer-confirm" data-amount="10">
            Duoti 10 EUR
          </button>
          <button class="button secondary compact-button" type="button" data-action="open-transfer-confirm" data-amount="20">
            Duoti 20 EUR
          </button>
          <button class="button secondary compact-button" type="button" data-action="open-transfer-confirm" data-amount="30">
            Duoti 30 EUR
          </button>
        </div>
      </div>
    </div>
  `;

  const queueItems = appData.requests.filter(
    (request) => request.status === "pending" || request.type === "payment-request",
  );

  elements.transferQueue.innerHTML = queueItems.length
    ? queueItems
        .map((request) => {
          if (request.type === "payment-request") {
            const account = getAccountConfig(request.accountType);
            const requestStatusLabel = request.status === "completed" ? "Patvirtinta" : "Užklausa";
            const requestStatusClass = request.status === "completed" ? "success" : "active";
            return `
              <div class="stack-item">
                ${renderUiIcon("qr")}
                <div>
                  <div class="inline-row">
                    <strong>${account.title}</strong>
                    <span class="status-tag ${requestStatusClass}">${requestStatusLabel}</span>
                  </div>
                  <p class="list-copy">Suma: ${formatCurrency(request.amount)}</p>
                  <p class="list-copy">${request.accountNumber}</p>
                  <div class="inline-actions">
                    <button class="button primary compact-button" type="button" data-action="open-share-request" data-request-id="${request.id}">
                      Rodyti QR
                    </button>
                    <button class="button secondary compact-button" type="button" data-action="open-payment-review" data-request-id="${request.id}">
                      Review
                    </button>
                    <button class="button secondary compact-button" type="button" data-action="copy-request-text" data-request-id="${request.id}">
                      Kopijuoti tekstą
                    </button>
                  </div>
                </div>
              </div>
            `;
          }

          const asset = INVESTMENTS.find((investment) => investment.id === request.assetId);
          return `
            <div class="stack-item">
              ${renderUiIcon("chart")}
              <div>
                <strong>${asset ? asset.name : "Prašymas"}</strong>
                <p class="list-copy">Investavimo prašymas: ${formatCurrency(request.amount)}</p>
                <div class="inline-actions">
                  <button class="button primary compact-button" type="button" data-action="approve-request" data-request-id="${request.id}">
                    Patvirtinti
                  </button>
                  <button class="button secondary compact-button" type="button" data-action="reject-request" data-request-id="${request.id}">
                    Atmesti
                  </button>
                </div>
              </div>
            </div>
          `;
        })
        .join("")
    : `
      <div class="stack-item">
        ${renderUiIcon("check")}
        <div>
          <strong>Nėra laukiančių prašymų</strong>
          <p class="list-copy">Kai vaikas pateiks naują investavimo prašymą, jis atsiras čia.</p>
        </div>
      </div>
    `;
}

function renderConfirmModal() {
  elements.confirmModal.classList.toggle("hidden", !state.confirm.open);
  elements.confirmModal.setAttribute("aria-hidden", String(!state.confirm.open));
  updateModalBodyLock();
  elements.confirmTitle.textContent = state.confirm.title;
  elements.confirmCopy.textContent = state.confirm.copy;
  elements.confirmSubmitButton.disabled = state.confirm.pinBuffer.length !== 4;
  elements.confirmSubmitButton.textContent = state.confirm.buttonLabel || "Patvirtinti";
  elements.confirmMessage.textContent = state.confirm.message;
  elements.confirmMessage.className = `validation-text ${state.confirm.messageTone}`.trim();
  renderPinSlots(elements.confirmPinSlots, state.confirm.pinBuffer);
}

function renderAll() {
  renderAuth();
  renderConfirmModal();
  renderShareRequestModal();
  renderPaymentReviewModal();

  if (!state.mode) {
    return;
  }

  renderRoleState();
  renderTabs();
  renderSectionBanner();
  renderHome();
  renderSavings();
  renderInvest();
  renderLearn();
  renderQuiz();
  renderMiniGames();
  renderFeed();
  renderTransfers();
}

function handleActionClick(actionButton) {
  const action = actionButton.dataset.action;

  if (action === "mini-piggy-tap") {
    state.miniGames.piggyTaps += 1;
    if (state.miniGames.piggyTaps >= 8) {
      awardMiniGamePoints("piggyRewarded", 10);
    }
    renderMiniGames();
    return;
  }

  if (action === "mini-choice") {
    state.miniGames.choiceAnswered = true;
    state.miniGames.choiceSelected = actionButton.dataset.choiceId;
    if (state.miniGames.choiceSelected === "bike") {
      awardMiniGamePoints("choiceRewarded", 12);
    }
    renderMiniGames();
    return;
  }

  if (action === "mini-card-pick") {
    state.miniGames.cardPick = actionButton.dataset.cardId;
    awardMiniGamePoints("cardRewarded", 8);
    renderMiniGames();
    return;
  }

  if (action === "mini-budget") {
    state.miniGames.budgetChoice = actionButton.dataset.budgetId;
    if (state.miniGames.budgetChoice === "split") {
      awardMiniGamePoints("budgetRewarded", 15);
    }
    renderMiniGames();
    return;
  }

  if (action === "mini-memory") {
    if (state.miniGames.memorySolved) {
      return;
    }

    const expectedEmoji = ["🐷", "🪙", "🚀"][state.miniGames.memoryStep];
    const selectedEmoji = actionButton.dataset.memoryEmoji;

    if (selectedEmoji === expectedEmoji) {
      state.miniGames.memoryStep += 1;
      if (state.miniGames.memoryStep >= 3) {
        state.miniGames.memorySolved = true;
        awardMiniGamePoints("memoryRewarded", 20);
      }
    } else {
      state.miniGames.memoryStep = 0;
      state.miniGames.memorySolved = false;
      createToast("Ups, emoji seka nutrūko. Bandyk dar kartą!", "warning");
    }

    renderMiniGames();
    return;
  }

  if (action === "select-asset") {
    state.selectedInvestmentId = actionButton.dataset.assetId || INVESTMENTS[0].id;
    renderAll();
    return;
  }

  if (action === "set-request-account") {
    state.paymentRequestAccount = actionButton.dataset.accountType || "wallet";
    renderAll();
    return;
  }

  if (action === "copy-account") {
    const account = getAccountConfig(actionButton.dataset.accountType || "wallet");
    void copyTextValue(account.accountNumber).then((copied) => {
      createToast(
        copied
          ? `${account.title} numeris nukopijuotas.`
          : "Nepavyko nukopijuoti automatiškai, bet numeris rodomas ekrane.",
        copied ? "success" : "warning",
      );
    });
    return;
  }

  if (action === "copy-request-text") {
    const requestId = actionButton.dataset.requestId;
    const request = requestId
      ? appData.requests.find((item) => item.id === requestId)
      : null;
    const requestText =
      request?.shareText ||
      `KidFund pavedimo užklausa: pervesk ${formatCurrency(state.paymentRequestAmount)} į ${getAccountConfig(state.paymentRequestAccount).title} (${getAccountConfig(state.paymentRequestAccount).accountNumber}).`;
    void copyTextValue(requestText).then((copied) => {
      createToast(copied ? "Pavedimo užklausos tekstas nukopijuotas." : "Nepavyko nukopijuoti teksto.", copied ? "success" : "warning");
    });
    return;
  }

  if (action === "open-share-request") {
    const requestId = actionButton.dataset.requestId;
    if (requestId) {
      openShareRequest(requestId);
    }
    return;
  }

  if (action === "scan-payment-qr") {
    void startInAppQrScan();
    return;
  }

  if (action === "open-payment-review") {
    const requestId = actionButton.dataset.requestId || state.shareRequestId;
    if (requestId) {
      openPaymentReviewForRequest(requestId);
    }
    return;
  }

  if (action === "open-payment-request-confirm") {
    const account = getAccountConfig(state.paymentRequestAccount);
    openConfirm({
      role: state.mode === "parent" ? "parent" : "child",
      title: "Sukurti pavedimo užklausą",
      copy: `Įvesk ${state.mode === "parent" ? "tėvų" : "vaiko"} PIN, kad sugeneruotum užklausą į ${account.title}.`,
      action: {
        type: "payment-request",
        accountType: state.paymentRequestAccount,
        amount: state.paymentRequestAmount,
      },
      buttonLabel: "Sukurti užklausą",
    });
    return;
  }

  if (action === "open-invest-request") {
    if (state.mode !== "child") {
      createToast("Investavimo prašymą gali teikti tik vaiko režimas.", "warning");
      return;
    }

    const investment = getSelectedInvestment();
    openConfirm({
      role: "child",
      title: "Patvirtinti investavimo prašymą",
      copy: `Įvesk vaiko PIN, kad išsiųstum prašymą į ${investment.name}. Tai nėra prisijungimo langas, o atskiras patvirtinimas.`,
      action: {
        type: "child-invest-request",
        amount: state.selectedInvestmentAmount,
      },
      buttonLabel: "Siųsti prašymą",
    });
    return;
  }

  if (action === "open-transfer-confirm") {
    openConfirm({
      role: "parent",
      title: "Patvirtinti papildymą vaikui",
      copy: "Įvesk tėvų PIN, kad papildytum vaiko piniginę.",
      action: {
        type: "parent-transfer-wallet",
        amount: Number(actionButton.dataset.amount || "0"),
      },
      buttonLabel: "Patvirtinti papildymą",
    });
    return;
  }

  if (action === "open-topup-confirm") {
    openConfirm({
      role: "parent",
      title: "Papildyti investavimo kišenę",
      copy: "Įvesk tėvų PIN, kad vaikui būtų skirta daugiau investavimo lėšų.",
      action: {
        type: "parent-topup-invest-pocket",
        amount: Number(actionButton.dataset.amount || "0"),
      },
      buttonLabel: "Papildyti kišenę",
    });
    return;
  }

  if (action === "toggle-crypto-setting") {
    openConfirm({
      role: "parent",
      title: "Keisti kripto leidimą",
      copy: "Įvesk tėvų PIN, kad įjungtum arba išjungtum kriptovaliutų prašymus.",
      action: {
        type: "parent-toggle-crypto",
      },
      buttonLabel: "Patvirtinti nustatymą",
    });
    return;
  }

  if (action === "approve-request") {
    const request = appData.requests.find((item) => item.id === actionButton.dataset.requestId);
    const asset = request ? INVESTMENTS.find((item) => item.id === request.assetId) : null;
    openConfirm({
      role: "parent",
      title: "Patvirtinti investavimo prašymą",
      copy: `Įvesk tėvų PIN, kad patvirtintum ${asset ? asset.name : "pasirinktą aktyvą"} už ${request ? formatCurrency(request.amount) : formatCurrency(0)}.`,
      action: {
        type: "parent-approve-request",
        requestId: actionButton.dataset.requestId,
      },
      buttonLabel: "Patvirtinti prašymą",
    });
    return;
  }

  if (action === "reject-request") {
    const request = appData.requests.find((item) => item.id === actionButton.dataset.requestId);
    const asset = request ? INVESTMENTS.find((item) => item.id === request.assetId) : null;
    openConfirm({
      role: "parent",
      title: "Atmesti investavimo prašymą",
      copy: `Įvesk tėvų PIN, kad atmestum ${asset ? asset.name : "pasirinktą aktyvą"} prašymą.`,
      action: {
        type: "parent-reject-request",
        requestId: actionButton.dataset.requestId,
      },
      buttonLabel: "Atmesti prašymą",
    });
  }
}

function handleQuizAnswer(index) {
  const question = QUIZ_QUESTIONS[state.quizIndex];
  const originalIndex = state.quizOptionOrder[index];
  state.selectedQuizAnswer = index;

  if (originalIndex === question.correctIndex) {
    state.quizFeedback = question.feedback;
    state.quizFeedbackTone = "success";
  } else {
    state.quizFeedback =
      "Dar ne visai. Pagalvok apie laikotarpį, riziką ir kodėl reikalinga tėvų priežiūra.";
    state.quizFeedbackTone = "error";
  }

  renderQuiz();
}

renderKeypad(elements.authKeypad, "auth");
renderKeypad(elements.confirmKeypad, "confirm");

elements.authClearButton.addEventListener("click", () => {
  state.authPinBuffer = "";
  setAuthMessage("", "");
  renderAuth();
});

elements.authSubmitButton.addEventListener("click", submitAuth);
elements.logoutButton.addEventListener("click", logout);
elements.confirmCancelButton.addEventListener("click", closeConfirm);
elements.confirmSubmitButton.addEventListener("click", submitConfirm);
elements.shareRequestCloseButton.addEventListener("click", closeShareRequest);
elements.shareRequestReviewButton.addEventListener("click", () => {
  if (state.shareRequestId) {
    openPaymentReviewForRequest(state.shareRequestId);
  }
});
elements.shareRequestScanButton.addEventListener("click", () => {
  void startInAppQrScan();
});
elements.shareRequestCopyButton.addEventListener("click", () => {
  const request = state.shareRequestId ? getPaymentRequestById(state.shareRequestId) : null;
  if (!request) {
    return;
  }

  void copyTextValue(getShareRequestText(request)).then((copied) => {
    createToast(copied ? "Užklausos tekstas nukopijuotas." : "Nepavyko nukopijuoti teksto.", copied ? "success" : "warning");
  });
});
elements.shareRequestSystemButton.addEventListener("click", async () => {
  const request = state.shareRequestId ? getPaymentRequestById(state.shareRequestId) : null;
  if (!request) {
    return;
  }

  const shareText = getShareRequestText(request);
  if (navigator.share) {
    try {
      await navigator.share({
        title: "KidFund pavedimo užklausa",
        text: shareText,
      });
      createToast("Pavedimo užklausa pasidalinta.", "success");
      return;
    } catch (error) {
      // Fallback to copy.
    }
  }

  const copied = await copyTextValue(shareText);
  createToast(copied ? "Share nepalaikomas - tekstas nukopijuotas." : "Nepavyko pasidalinti užklausa.", copied ? "success" : "warning");
});
elements.paymentReviewCancelButton.addEventListener("click", closePaymentReview);
elements.paymentReviewConfirmButton.addEventListener("click", () => {
  const payload = state.paymentReview.payload;
  if (!payload) {
    closePaymentReview();
    return;
  }

  const request = getPaymentRequestById(payload.requestId);
  if (request && request.status === "completed") {
    createToast("Ši užklausa jau patvirtinta.", "warning");
    renderPaymentReviewModal();
    return;
  }

  const amount = sanitizeAmount(payload.amount);
  if (payload.accountType === "savings") {
    appData.accounts.savings += amount;
  } else {
    appData.accounts.wallet += amount;
  }

  if (request) {
    request.status = "completed";
  }

  appendFeed(
    `Mock Stripe review patvirtintas: ${formatCurrency(amount)} įkrito į ${
      payload.accountType === "savings" ? "taupyklę" : "piniginę"
    } per ${state.paymentReview.source === "deep-link" ? "deep link scan" : "review ekraną"}.`,
    "success",
  );
  saveAppData();
  openPaymentReview(
    {
      ...payload,
      requestStatus: "completed",
    },
    state.paymentReview.source,
  );
  renderAll();
  createToast("Review patvirtintas. Demo papildymas įvykdytas tik po tavo confirm.", "success");
});

elements.nextQuestionButton.addEventListener("click", () => {
  resetQuizQuestion((state.quizIndex + 1) % QUIZ_QUESTIONS.length);
  renderQuiz();
});

elements.authRoleSwitch.addEventListener("click", (event) => {
  const button = event.target.closest("[data-auth-role]");
  if (!button) {
    return;
  }

  state.authRole = button.dataset.authRole;
  state.authMode = getPinForRole(state.authRole) ? "login" : "register";
  state.authPinBuffer = "";
  setAuthMessage("", "");
  renderAuth();
});

elements.authModeSwitch.addEventListener("click", (event) => {
  const button = event.target.closest("[data-auth-mode]");
  if (!button) {
    return;
  }

  state.authMode = button.dataset.authMode;
  state.authPinBuffer = "";
  setAuthMessage("", "");
  renderAuth();
});

elements.bottomNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tab]");
  if (!button) {
    return;
  }

  const tab = button.dataset.tab;
  if (state.mode !== "parent" && isParentOnlyTab(tab)) {
    state.activeTab = "home";
    createToast("Ši skiltis vaikui nerodoma.", "warning");
    renderAll();
    return;
  }

  state.activeTab = tab;
  renderAll();
});

document.addEventListener("click", (event) => {
  const keypadButton = event.target.closest("[data-keypad][data-key]");
  if (keypadButton) {
    handleKeypadInput(keypadButton.dataset.keypad, keypadButton.dataset.key);
    return;
  }

  const switchTabButton = event.target.closest("[data-switch-tab]");
  if (switchTabButton) {
    state.activeTab = switchTabButton.dataset.switchTab;
    ensureChildSafeTab();
    renderAll();
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (actionButton) {
    handleActionClick(actionButton);
    return;
  }

  const quizButton = event.target.closest("[data-quiz-option]");
  if (quizButton) {
    handleQuizAnswer(Number(quizButton.dataset.quizOption));
  }
});

document.addEventListener("input", (event) => {
  const target = event.target;
  if (target.id === "investmentAmountInput") {
    state.selectedInvestmentAmount = sanitizeAmount(target.value);
  }
  if (target.id === "paymentRequestAmountInput") {
    state.paymentRequestAmount = sanitizeAmount(target.value);
    const preview = document.querySelector("#paymentRequestPreview");
    const account = getAccountConfig(state.paymentRequestAccount);
    if (preview) {
      preview.textContent = `KidFund pavedimo užklausa: pervesk ${formatCurrency(state.paymentRequestAmount)} į ${account.title} (${account.accountNumber}).`;
    }
  }
});

document.addEventListener("click", (event) => {
  const choiceButton = event.target.closest("[data-amount-choice]");
  if (!choiceButton) {
    return;
  }

  state.selectedInvestmentAmount = sanitizeAmount(choiceButton.dataset.amountChoice);
  renderAll();
});

resetQuizQuestion(0);
renderAll();
void initDeepLinkHandling();
void initBarcodeScanner();
