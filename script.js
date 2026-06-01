const AUTH_STORAGE_KEY = "kidfund-auth-store-v3";
const APP_STORAGE_KEY = "kidfund-app-state-v3";
const PARENT_ONLY_TABS = new Set(["transfers"]);
const APP_NAME = "Taupytukas";
const APP_DEEP_LINK_SCHEME = "taupytukas";
const LEGACY_DEEP_LINK_SCHEMES = ["kidfund"];

const TAB_META = {
  home: {
    title: "Pagrindinis",
    copy: "Balansas, aktyvus tikslas ir svarbiausi pranešimai — be perteklinių skilčių.",
  },
  savings: {
    title: "Taupymas",
    copy: "Pinigų balansas, savaitės limitas ir pagrindinio tikslo progresas.",
  },
  learn: {
    title: "Mokymasis",
    copy: "Pamokos ir viktorina apie taupymą, limitus ir XP — be žaidimų ir tėvų užduočių.",
  },
  missions: {
    title: "Misijos",
    copy: "Tėvų užduotys, progresas ir trumpi žaidimai. Atlikti žaidimai lieka pažymėti.",
  },
  feed: {
    title: "Pranešimai",
    copy: "Papildymai, tikslai, XP ir pavedimų istorija vienoje vietoje.",
  },
  transfers: {
    title: "Duoti pinigų",
    copy: "Tik tėvams: papildyk vaiko piniginę ir tvarkyk pavedimo užklausas.",
  },
};

const LESSONS = [
  {
    title: "Kodėl dalis pinigų lieka taupyklei?",
    copy: "Ne viską reikia išleisti šiandien — dalis pinigų gali dirbti tavo tikslui.",
  },
  {
    title: "Kas yra savaitės limitas?",
    copy: "Limitas padeda planuoti išlaidas ir neperšokti biudžeto per vieną pirkimą.",
  },
  {
    title: "Kodėl tėvai patvirtina veiksmus?",
    copy: "Svarbūs sprendimai (papildymai, misijos) vyksta tik su tėvų PIN — taip saugiau.",
  },
];

const QUIZ_QUESTIONS = [
  {
    question: "Kam labiausiai tinka taupymas?",
    helper: "Pagalvok apie artimą tikslą.",
    options: ["Trumpam tikslui, pvz. dviračiui", "Tik saldumynams šiandien", "Niekam"],
    correctIndex: 0,
    feedback: "Teisingai — taupymas padeda pasiekti konkretų tikslą.",
  },
  {
    question: "Ką daryti gavus kišenpinigius?",
    helper: "Protingiausias pirmas žingsnis.",
    options: [
      "Paskirstyti: dalį taupyti, dalį leisti",
      "Išleisti viską iškart",
      "Paslėpti ir niekur nerašyti",
    ],
    correctIndex: 0,
    feedback: "Teisingai — paskirstymas yra geras įprotis.",
  },
  {
    question: "Kas yra XP misijoje?",
    helper: "Tėvai mato tavo pastangą.",
    options: [
      "Taškai už atliktą tėvų tikslą",
      "Tik dekoracija be reikšmės",
      "Baudos taškai",
    ],
    correctIndex: 0,
    feedback: "Teisingai — XP rodo, kad įvyklei sutartą misiją.",
  },
];

const ACTION_LIMITS = {
  parentTransferWallet: {
    cooldownMs: 20 * 1000,
    windowMs: 10 * 60 * 1000,
    maxInWindow: 8,
    label: "pinigų papildymai",
  },
  paymentRequest: {
    cooldownMs: 40 * 1000,
    windowMs: 10 * 60 * 1000,
    maxInWindow: 4,
    label: "pavedimo užklausos",
  },
  parentAddGoal: {
    cooldownMs: 15 * 1000,
    windowMs: 10 * 60 * 1000,
    maxInWindow: 6,
    label: "nauji tikslai",
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
  homeHeroGoal: document.querySelector("#homeHeroGoal"),
  homeStats: document.querySelector("#homeStats"),
  homeXpTitle: document.querySelector("#homeXpTitle"),
  accountHub: document.querySelector("#accountHub"),
  kidMissionSpot: document.querySelector("#kidMissionSpot"),
  homeFeedPreview: document.querySelector("#homeFeedPreview"),
  savingsHeroGoal: document.querySelector("#savingsHeroGoal"),
  missionsPanelTitle: document.querySelector("#missionsPanelTitle"),
  missionsPanelCopy: document.querySelector("#missionsPanelCopy"),
  missionsGoalsList: document.querySelector("#missionsGoalsList"),
  parentGoalsForm: document.querySelector("#parentGoalsForm"),
  savingsSummary: document.querySelector("#savingsSummary"),
  permissionPolicyList: document.querySelector("#permissionPolicyList"),
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
      parentReserve: 260,
      weeklyLimit: 25,
      spentThisWeek: 12,
      walletAccountNumber: "KF-2710-0001-4455",
      savingsAccountNumber: "KF-2710-9999-1200",
    },
    childProgress: {
      xp: 24,
      level: 1,
      miniGames: {
        points: 0,
        level: 1,
        piggyTaps: 0,
        piggyRewarded: false,
        choiceAnswered: false,
        choiceSelected: null,
        choiceRewarded: false,
        budgetChoice: null,
        budgetRewarded: false,
      },
    },
    goals: [
      {
        id: "goal-bike",
        title: "Dviratis vasarai",
        target: 180,
        saved: 96,
        xpReward: 50,
        status: "active",
      },
      {
        id: "goal-room",
        title: "Sutvarkyti kambarį",
        target: 0,
        saved: 0,
        xpReward: 30,
        status: "active",
        missionOnly: true,
      },
    ],
    settings: {
      approvalRule: "Papildymai ir naujos misijos patvirtinami tėvų PIN.",
      savingsPolicy: "Vaikas mato balansą, tikslus ir XP. Tėvų politika paslėpta.",
    },
    requests: [],
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
        tone: "success",
        message: "Dviračio tikslas: sukaupta 96 EUR iš 180 EUR (53%).",
        createdAt: nowIso(),
      },
      {
        id: "feed-3",
        tone: "success",
        message: "Vaikas turi 24 XP už atliktas misijas.",
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

  const goals = (Array.isArray(raw.goals) && raw.goals.length ? raw.goals : fallback.goals).map(
    (goal) => ({
      ...goal,
      xpReward: Number(goal.xpReward) || 25,
      status: goal.status === "completed" ? "completed" : "active",
      missionOnly: Boolean(goal.missionOnly) || Number(goal.target) === 0,
    }),
  );

  const requests = (Array.isArray(raw.requests) ? raw.requests : []).filter(
    (request) => request.type !== "investment",
  );

  return {
    accounts: {
      ...fallback.accounts,
      ...(raw.accounts || {}),
    },
    childProgress: {
      ...fallback.childProgress,
      ...(raw.childProgress || {}),
      miniGames: {
        ...fallback.childProgress.miniGames,
        ...(raw.childProgress?.miniGames || {}),
      },
    },
    goals,
    settings: {
      ...fallback.settings,
      ...(raw.settings || {}),
    },
    requests,
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

const defaultMiniGamesState = () => ({
  points: 0,
  level: 1,
  piggyTaps: 0,
  piggyRewarded: false,
  choiceAnswered: false,
  choiceSelected: null,
  choiceRewarded: false,
  budgetChoice: null,
  budgetRewarded: false,
});

function loadMiniGamesState() {
  return {
    ...defaultMiniGamesState(),
    ...(appData.childProgress?.miniGames || {}),
  };
}

function persistMiniGamesState() {
  appData.childProgress = appData.childProgress || { xp: 0, level: 1 };
  appData.childProgress.miniGames = { ...state.miniGames };
  saveAppData();
}

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
  goalDraft: {
    title: "",
    target: 50,
    xpReward: 25,
    missionOnly: false,
  },
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
  miniGames: loadMiniGamesState(),
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

function sanitizeNonNegativeAmount(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 0;
  }
  return Math.max(0, Math.round(number));
}

function getChildXp() {
  return Math.max(0, Number(appData.childProgress?.xp) || 0);
}

function syncChildLevel() {
  const xp = getChildXp();
  const level = 1 + Math.floor(xp / 100);
  appData.childProgress = appData.childProgress || { xp: 0, level: 1 };
  appData.childProgress.xp = xp;
  appData.childProgress.level = level;
  return level;
}

function awardChildXp(amount, feedMessage) {
  const xpGain = Math.max(0, Math.round(Number(amount) || 0));
  if (!xpGain) {
    return;
  }

  appData.childProgress = appData.childProgress || { xp: 0, level: 1 };
  appData.childProgress.xp = getChildXp() + xpGain;
  syncChildLevel();
  if (feedMessage) {
    appendFeed(feedMessage, "success");
  }
  saveAppData();
}

function getActiveGoals() {
  return appData.goals.filter((goal) => goal.status !== "completed");
}

function getPrimaryGoal() {
  const active = getActiveGoals();
  if (!active.length) {
    return appData.goals[0] || null;
  }

  return active.reduce((best, goal) => {
    const bestProgress = getGoalProgress(best).percent;
    const goalProgress = getGoalProgress(goal).percent;
    if (goal.missionOnly && !best.missionOnly) {
      return best;
    }
    if (!goal.missionOnly && best.missionOnly) {
      return goal;
    }
    return goalProgress > bestProgress ? goal : best;
  }, active[0]);
}

function getGoalProgress(goal) {
  if (!goal) {
    return { percent: 0, remaining: 0, saved: 0, target: 0, readyToComplete: false };
  }

  if (goal.missionOnly || Number(goal.target) <= 0) {
    return {
      percent: goal.status === "completed" ? 100 : 0,
      remaining: 0,
      saved: 0,
      target: 0,
      readyToComplete: goal.status === "active",
    };
  }

  const target = Math.max(1, Number(goal.target) || 1);
  const saved = Math.max(0, Number(goal.saved) || 0);
  const percent = Math.min(100, Math.round((saved / target) * 100));
  const remaining = Math.max(0, target - saved);

  return {
    percent,
    remaining,
    saved,
    target,
    readyToComplete: goal.status === "active" && saved >= target,
  };
}

function renderGoalHeroCard(goal, options = {}) {
  if (!goal) {
    return `
      <div class="card-header goal-hero-head">
        <div>
          <p class="eyebrow">Tikslas</p>
          <h3 class="goal-hero-title">Dar nėra aktyvaus tikslo</h3>
          <p class="list-copy">${options.emptyCopy || "Tėvai gali pridėti misiją skiltyje Taupyti."}</p>
        </div>
      </div>
    `;
  }

  const progress = getGoalProgress(goal);
  const isMission = goal.missionOnly || progress.target <= 0;

  return `
    <div class="card-header goal-hero-head">
      <div>
        <p class="eyebrow">${options.eyebrow || "Aktyvus tikslas"}</p>
        <h3 class="goal-hero-title">${escapeHtml(goal.title)}</h3>
        <div class="goal-hero-meta">
          <span class="mini-pill">${goal.status === "completed" ? "✅ Atlikta" : "🎯 Vykdoma"}</span>
          <span class="mini-pill">⭐ +${goal.xpReward || 25} XP</span>
          ${isMission ? '<span class="mini-pill">Misija</span>' : ""}
        </div>
      </div>
      ${renderUiIcon("target", "feature-icon")}
    </div>
    ${
      isMission
        ? `<p class="list-copy">Kai atliksi užduotį, tėvai patvirtins ir gausi XP. Jie mato tavo progresą čia.</p>`
        : `<p class="list-copy">Sukaupta <strong>${formatCurrency(progress.saved)}</strong> iš <strong>${formatCurrency(progress.target)}</strong></p>`
    }
    <div class="goal-hero-progress">
      <div class="inline-row">
        <span class="stack-meta">${progress.percent}%</span>
        <span class="stack-meta">${
          isMission
            ? "Laukia tėvų patvirtinimo"
            : `Liko ${formatCurrency(progress.remaining)}`
        }</span>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width: ${progress.percent}%"></div></div>
    </div>
    <div class="goal-hero-stats">
      <div class="goal-hero-stat">
        <strong>${progress.percent}%</strong>
        <span>Pažanga</span>
      </div>
      <div class="goal-hero-stat">
        <strong>${isMission ? "—" : formatCurrency(progress.remaining)}</strong>
        <span>${isMission ? "Pinigų tikslas ne" : "Dar trūksta"}</span>
      </div>
      <div class="goal-hero-stat">
        <strong>${getChildXp()} XP</strong>
        <span>Lygis ${syncChildLevel()}</span>
      </div>
    </div>
  `;
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
          ? `Susikurk trumpą PIN ir pirmyn į ${APP_NAME}`
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
        : `Prisijunkite prie ${APP_NAME} valdymo centro`,
    copy:
      state.authMode === "register"
        ? "Tėvų paskyra skirta misijoms, papildymams ir pranešimų kontrolei."
        : "Aiškus valdymas ir atskiras PIN kiekvienam jautriam veiksmui.",
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
        copy: "Papildymų, misijų ir kitų jautrių veiksmų patvirtinimai atliekami per atskirą PIN modalą.",
      },
      {
        icon: "bank",
        title: `${APP_NAME} partneriai ir paskyros`,
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

function extractPaymentDeepLink(value) {
  if (!value) {
    return "";
  }

  const text = String(value).trim();
  if (
    [APP_DEEP_LINK_SCHEME, ...LEGACY_DEEP_LINK_SCHEMES].some((scheme) =>
      text.startsWith(`${scheme}://pay/review`),
    )
  ) {
    return text;
  }

  const match = text.match(/(?:taupytukas|kidfund):\/\/pay\/review[^\s<>"']*/i);
  return match ? match[0] : "";
}

function getBarcodeDeepLink(barcode) {
  if (!barcode || typeof barcode !== "object") {
    return "";
  }

  return (
    extractPaymentDeepLink(barcode.rawValue) ||
    extractPaymentDeepLink(barcode.displayValue) ||
    extractPaymentDeepLink(barcode.urlBookmark?.url)
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
  setScannerMessage(`Atidaroma kamera ${APP_NAME} QR skenavimui...`, "");
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
      setScannerMessage(`QR nuskaitytas, bet tai ne ${APP_NAME} mokėjimo QR kodas.`, "warning");
      renderAll();
      createToast(`Nuskaitytas QR nėra ${APP_NAME} mokėjimo užklausa.`, "warning");
      return;
    }

    setScannerMessage(`QR nuskaitytas. Atidaromas ${APP_NAME} review ekranas.`, "success");
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
    recipientName: request.recipientName || APP_NAME,
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
    recipientName: payload.recipientName || APP_NAME,
    accountTitle: payload.accountTitle || getAccountConfig(payload.accountType || "wallet").title,
    requestDate: payload.requestDate || nowIso(),
  });
  return `${APP_DEEP_LINK_SCHEME}://pay/review?${params.toString()}`;
}

function buildPaymentShareTextFromPayload(payload) {
  if (!payload) {
    return "";
  }

  return [
    `${APP_NAME} pavedimo užklausa`,
    `Suma: ${formatCurrency(payload.amount)}`,
    `Gavėjas: ${payload.recipientName || APP_NAME}`,
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
      recipientName: parsed.searchParams.get("recipientName") || APP_NAME,
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
      recipientName: APP_NAME,
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

  elements.paymentReviewTitle.textContent = `${APP_NAME} payment review`;
  elements.paymentReviewCopy.textContent =
    safeStatus === "completed"
      ? "Ši užklausa jau buvo patvirtinta. Gali peržiūrėti detales arba uždaryti ekraną."
      : "Po scan pirmiausia rodomas review ekranas. Tik paspaudus patvirtinimą įvykdoma demo pervedimo logika.";
  elements.paymentReviewBankCard.innerHTML = `
    <div class="bank-card-top">
      <div>
        <p class="eyebrow">${APP_NAME} review</p>
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
      <span class="mini-pill">🔗 ${escapeHtml(state.paymentReview.source === "deep-link" ? "Deep link / QR" : `${APP_NAME} vidus`)}</span>
      <span class="mini-pill">📅 ${escapeHtml(requestDate)}</span>
      <span class="mini-pill">🏦 ${escapeHtml(payload.accountBadge || APP_NAME)}</span>
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

  elements.shareRequestTitle.textContent = `${APP_NAME} mokėjimo kortelė`;
  elements.shareRequestCopy.textContent =
    "Gavėjas gali nuskenuoti QR, atidaryti review ekraną, nukopijuoti duomenis arba gauti šią užklausą per share.";
  elements.shareRequestBankCard.innerHTML = `
    <div class="bank-card-top">
      <div>
        <p class="eyebrow">${APP_NAME} transfer request</p>
        <h4>${escapeHtml(account.title)}</h4>
      </div>
      ${renderUiIcon("bank", "feature-icon bank-icon")}
    </div>
    <div class="bank-card-amount">${formatCurrency(request.amount)}</div>
    <div class="bank-card-meta">
      <div>
        <span class="stack-meta">Gavėjas</span>
        <strong>${APP_NAME}</strong>
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
      <span class="mini-pill">👤 Gavėjas: ${APP_NAME}</span>
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
    awardChildXp(points, `Vaikas surinko +${points} XP mini žaidime.`);
    persistMiniGamesState();
  }
}

function renderMiniGames() {
  if (!elements.miniGamesBoard) {
    return;
  }

  const primaryGoal = getPrimaryGoal();
  const goalTitle = primaryGoal?.title || "tavo tikslą";
  const piggyDone = state.miniGames.piggyRewarded;
  const choiceDone = state.miniGames.choiceRewarded;
  const budgetDone = state.miniGames.budgetRewarded;
  const budgetOptions = [
    { id: "split", label: "Paskirstyti: išleisti + taupyti", correct: true },
    { id: "all-spend", label: "Išleisti viską iškart", correct: false },
  ];
  const choiceOptions = [
    { id: "snack", label: "Užkandis šiandien", correct: false },
    { id: "bike", label: goalTitle, correct: true },
    { id: "skin", label: "Žaidimo skin dabar", correct: false },
  ];
  const xpIntoLevel = getChildXp() % 100;
  const xpToNext = 100 - xpIntoLevel || 100;

  const renderGameCard = (title, score, bodyHtml, done) => `
    <div class="game-card ${done ? "done" : ""}">
      <div class="inline-row">
        <h4>${title}</h4>
        <span class="game-score">${done ? "✅ Atlikta" : score}</span>
      </div>
      ${bodyHtml}
    </div>
  `;

  elements.miniGamesBoard.innerHTML = `
    <div class="game-card game-summary-card">
      <div class="inline-row">
        <h4>⭐ Tavo XP</h4>
        <span class="game-score">Lygis ${syncChildLevel()}</span>
      </div>
      <p class="list-copy">Didžiausi XP — už tėvų misijas. Žaidimai duoda mažesnę dovaną.</p>
      <div class="mission-row">
        <span class="mini-pill">${getChildXp()} XP</span>
        <span class="mini-pill">Iki kito lygio ${xpToNext} XP</span>
      </div>
      <div class="mini-progress"><span style="width: ${xpIntoLevel}%"></span></div>
    </div>
    ${renderGameCard(
      "🐷 Tap tap taupyklė",
      piggyDone ? "+5 XP" : `${state.miniGames.piggyTaps}/8`,
      piggyDone
        ? `<p class="list-copy">Šis žaidimas jau atliktas. XP įskaitytas.</p>`
        : `<p class="list-copy">8 paspaudimai = +5 XP (kartą).</p>
           <button class="button primary compact-button" type="button" data-action="mini-piggy-tap">Spausti taupyklę</button>`,
      piggyDone,
    )}
    ${renderGameCard(
      "🎯 Kas artina tikslą?",
      choiceDone ? "+8 XP" : "Laukia",
      choiceDone
        ? `<p class="list-copy">Atsakei teisingai — žaidimas užbaigtas.</p>`
        : `<div class="answer-grid">${choiceOptions
            .map((option) => {
              const optionState =
                state.miniGames.choiceAnswered && state.miniGames.choiceSelected === option.id
                  ? option.correct
                    ? "correct"
                    : "wrong"
                  : "";
              return `<button class="game-button ${optionState}" type="button" data-action="mini-choice" data-choice-id="${option.id}">${option.label}</button>`;
            })
            .join("")}</div>`,
      choiceDone,
    )}
    ${renderGameCard(
      "🧠 Kišenpinigių pasirinkimas",
      budgetDone ? "+10 XP" : "Laukia",
      budgetDone
        ? `<p class="list-copy">Teisingas pasirinkimas — žaidimas užbaigtas.</p>`
        : `<div class="answer-grid">${budgetOptions
            .map((option) => {
              const optionState =
                state.miniGames.budgetChoice === option.id
                  ? option.correct
                    ? "correct"
                    : "wrong"
                  : "";
              return `<button class="game-button ${optionState}" type="button" data-action="mini-budget" data-budget-id="${option.id}">${option.label}</button>`;
            })
            .join("")}</div>`,
      budgetDone,
    )}
  `;
}

function renderMissionGoalItem(goal) {
  const progress = getGoalProgress(goal);
  const isMission = goal.missionOnly || progress.target <= 0;
  const parentActions =
    state.mode === "parent" && goal.status === "active"
      ? `<div class="inline-actions">
          <button class="button primary compact-button" type="button" data-action="open-complete-goal-confirm" data-goal-id="${goal.id}" ${!isMission && !progress.readyToComplete ? "disabled" : ""}>
            Patvirtinti atlikimą (+${goal.xpReward} XP)
          </button>
        </div>`
      : "";

  return `
    <div class="stack-item">
      ${renderUiIcon(goal.status === "completed" ? "check" : "target")}
      <div>
        <div class="inline-row">
          <strong>${escapeHtml(goal.title)}</strong>
          <span class="status-tag ${goal.status === "completed" ? "approved" : progress.readyToComplete || isMission ? "active" : "pending"}">
            ${
              goal.status === "completed"
                ? "Atlikta"
                : isMission
                  ? "Užduotis"
                  : progress.readyToComplete
                    ? "Galima užbaigti"
                    : "Vykdoma"
            }
          </span>
        </div>
        <p class="list-copy">${
          goal.status === "completed"
            ? `Užbaigta · gauta +${goal.xpReward} XP`
            : isMission
              ? `Tėvų užduotis · atlygis +${goal.xpReward} XP`
              : `Sukaupta ${formatCurrency(progress.saved)} iš ${formatCurrency(progress.target)} · liko ${formatCurrency(progress.remaining)}`
        }</p>
        ${
          !isMission && goal.status !== "completed"
            ? `<div class="progress-track"><div class="progress-fill" style="width: ${progress.percent}%"></div></div>
               <p class="list-copy">${progress.percent}%</p>`
            : ""
        }
        ${parentActions}
      </div>
    </div>
  `;
}

function renderMissions() {
  if (elements.missionsPanelTitle) {
    elements.missionsPanelTitle.textContent =
      state.mode === "parent" ? "Vaiko užduotys ir žaidimai" : "Tėvų užduotys";
  }
  if (elements.missionsPanelCopy) {
    elements.missionsPanelCopy.textContent =
      state.mode === "parent"
        ? "Čia kuriate užduotis vaikui ir matote, kurie žaidimai jau atlikti."
        : "Atlik tėvų užduotis — gausi XP. Žemiau trumpi žaidimai (atlikti lieka pažymėti).";
  }

  const activeGoals = appData.goals.filter((goal) => goal.status !== "completed");
  const completedGoals = appData.goals.filter((goal) => goal.status === "completed");

  if (elements.missionsGoalsList) {
    const activeBlock = activeGoals.length
      ? `<p class="eyebrow">Aktyvios</p>${activeGoals.map(renderMissionGoalItem).join("")}`
      : `<div class="stack-item">${renderUiIcon("sparkle")}<div><strong>Kol kas nėra aktyvių užduočių</strong><p class="list-copy">${state.mode === "parent" ? "Pridėk naują užduotį žemiau." : "Paprašyk tėvų pridėti misiją."}</p></div></div>`;

    const doneBlock = completedGoals.length
      ? `<p class="eyebrow">Atliktos</p>${completedGoals.map(renderMissionGoalItem).join("")}`
      : "";

    elements.missionsGoalsList.innerHTML = activeBlock + doneBlock;
  }

  if (elements.parentGoalsForm) {
    const draft = state.goalDraft;
    elements.parentGoalsForm.innerHTML = `
      <div class="stack-item">
        ${renderUiIcon("target")}
        <div>
          <label class="field-label" for="goalTitleInput">Užduoties pavadinimas</label>
          <input id="goalTitleInput" class="number-input" type="text" maxlength="60" value="${escapeHtml(draft.title)}" placeholder="Pvz. Sutvarkyti kambarį" />
          <label class="field-label" for="goalTargetInput">Taupymo suma (EUR)</label>
          <input id="goalTargetInput" class="number-input" type="number" min="0" step="1" value="${draft.missionOnly ? 0 : draft.target}" ${draft.missionOnly ? "disabled" : ""} />
          <label class="field-label" for="goalXpInput">XP atlygis</label>
          <input id="goalXpInput" class="number-input" type="number" min="5" step="5" value="${draft.xpReward}" />
          <div class="mission-row">
            <button class="chip-button ${draft.missionOnly ? "active" : ""}" type="button" data-action="toggle-goal-mission-only">
              Tik užduotis (be EUR)
            </button>
          </div>
          <button class="button primary compact-button" type="button" data-action="open-add-goal-confirm">Pridėti užduotį</button>
        </div>
      </div>
    `;
  }

  renderMiniGames();
}

function getPinKey(role) {
  return role === "parent" ? "parentPin" : "childPin";
}

function getPinForRole(role) {
  return authStore[getPinKey(role)] || "";
}

function isParentOnlyTab(tab) {
  return PARENT_ONLY_TABS.has(tab);
}

function ensureChildSafeTab() {
  if (state.activeTab === "invest") {
    state.activeTab = "home";
  }
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
  const title = tone === "warning" ? `${APP_NAME} perspėjimas` : `${APP_NAME} pranešimas`;
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
        ? "Įvesk PIN ir iškart pateksi į savo taupymo misijas."
        : `Susikurk 4 skaičių PIN, kad galėtum prisijungti prie ${APP_NAME}.`
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

function executeConfirmAction() {
  const action = state.confirm.action;
  if (!action) {
    return;
  }

  if (action.type === "parent-add-goal") {
    const rateLimitMessage = getRateLimitMessage("parentAddGoal");
    if (rateLimitMessage) {
      setConfirmMessage(rateLimitMessage, "error");
      renderConfirmModal();
      return;
    }

    const title = String(action.title || "").trim();
    if (title.length < 2) {
      setConfirmMessage("Įrašyk trumpą misijos pavadinimą.", "error");
      renderConfirmModal();
      return;
    }

    const missionOnly = Boolean(action.missionOnly);
    const target = missionOnly ? 0 : sanitizeAmount(action.target);
    const xpReward = Math.max(5, sanitizeAmount(action.xpReward));

    appData.goals.unshift({
      id: uid("goal"),
      title,
      target,
      saved: 0,
      xpReward,
      status: "active",
      missionOnly,
      createdAt: nowIso(),
    });
    recordAction("parentAddGoal");
    appendFeed(`Tėvai sukūrė misiją „${title}“ (+${xpReward} XP).`, "success");
    saveAppData();
    closeConfirm();
    renderAll();
    createToast("Nauja misija sukurta.", "success");
    return;
  }

  if (action.type === "parent-complete-goal") {
    const goal = appData.goals.find((item) => item.id === action.goalId);
    if (!goal || goal.status === "completed") {
      closeConfirm();
      createToast("Ši misija jau užbaigta.", "warning");
      renderAll();
      return;
    }

    const progress = getGoalProgress(goal);
    if (!goal.missionOnly && progress.saved < progress.target) {
      setConfirmMessage("Dar nepasiektas taupymo tikslas — patvirtink tik kai sukaupta pakanka.", "error");
      renderConfirmModal();
      return;
    }

    goal.status = "completed";
    goal.completedAt = nowIso();
    awardChildXp(goal.xpReward, `Misija „${goal.title}“ atlikta: +${goal.xpReward} XP.`);
    closeConfirm();
    renderAll();
    createToast(`Misija patvirtinta. Vaikas gavo +${goal.xpReward} XP.`, "success");
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
      recipientName: APP_NAME,
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
      ? "Kurk misijas, matyk vaiko XP ir papildyk piniginę."
      : "Matyk tikslą, kiek dar liko, ir rink XP už atliktas misijas.";
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
  const primaryGoal = getPrimaryGoal();

  if (elements.homeHeroGoal) {
    elements.homeHeroGoal.innerHTML = renderGoalHeroCard(primaryGoal, {
      eyebrow: state.mode === "parent" ? "Vaiko aktyvus tikslas" : "Tavo tikslas",
      emptyCopy:
        state.mode === "parent"
          ? "Pridėk misiją skiltyje Taupyti."
          : "Paprašyk tėvų pridėti naują misiją.",
    });
  }

  const cards = [
    {
      title: "Piniginė",
      value: formatCurrency(appData.accounts.wallet),
      meta: `Likutis išleisti: ${formatCurrency(remainingLimit)}`,
      icon: "wallet",
    },
    {
      title: "Taupyklė",
      value: formatCurrency(appData.accounts.savings),
      meta: `${getActiveGoals().length} aktyvios misijos`,
      icon: "piggy",
    },
    {
      title: state.mode === "parent" ? "Vaiko XP" : "Savaitės limitas",
      value:
        state.mode === "parent"
          ? `${getChildXp()} XP`
          : `${formatCurrency(appData.accounts.spentThisWeek)} / ${formatCurrency(appData.accounts.weeklyLimit)}`,
      meta:
        state.mode === "parent"
          ? `Lygis ${syncChildLevel()} · rezervas ${formatCurrency(appData.accounts.parentReserve)}`
          : "Išleista šią savaitę",
      icon: state.mode === "parent" ? "star" : "target",
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

  if (elements.homeXpTitle) {
    elements.homeXpTitle.textContent =
      state.mode === "parent" ? "Vaiko XP ir misijos" : "Tavo XP";
  }

  elements.kidMissionSpot.innerHTML =
    state.mode === "parent"
      ? `
        <div class="kid-card">
          <div class="inline-row">
            <h4>Vaikas: ${getChildXp()} XP</h4>
            ${renderUiIcon("star", "feature-icon subtle-icon")}
          </div>
          <p class="list-copy">Kai patvirtinsi misiją „atlikta“, vaikas gaus XP ir tai matysi čia bei pranešimuose.</p>
          <button class="button secondary compact-button" type="button" data-switch-tab="missions">Atidaryti misijas</button>
        </div>
      `
      : `
        <div class="kid-card">
          <div class="inline-row">
            <h4>${getChildXp()} XP · lygis ${syncChildLevel()}</h4>
            ${renderUiIcon("sparkle", "feature-icon subtle-icon")}
          </div>
          <p class="list-copy">Žaisk trumpas misijas skiltyje Misijos arba atlik tėvų užduotį.</p>
          <button class="button secondary compact-button" type="button" data-switch-tab="missions">Eiti į misijas</button>
        </div>
      `;

  const walletAccount = getAccountConfig("wallet");
  const savingsAccount = getAccountConfig("savings");
  const selectedRequestAccount = getAccountConfig(state.paymentRequestAccount);
  const selectedRequestCopy = `${APP_NAME} pavedimo užklausa: pervesk ${formatCurrency(state.paymentRequestAmount)} į ${selectedRequestAccount.title} (${selectedRequestAccount.accountNumber}).`;

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
  const primaryGoal = getPrimaryGoal();
  if (elements.savingsHeroGoal) {
    elements.savingsHeroGoal.innerHTML = renderGoalHeroCard(primaryGoal, {
      eyebrow: "Pagrindinis taupymo tikslas",
    });
  }

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
        <strong>Tėvų patvirtinimai</strong>
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
        <p class="list-copy">Atidaro tikrą telefono kamerą programėlės viduje. Nuskenavus ${APP_NAME} QR, iškart atsidaro payment review ekranas.</p>
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

  const queueItems = appData.requests.filter((request) => request.type === "payment-request");

  elements.transferQueue.innerHTML = queueItems.length
    ? queueItems
        .map((request) => {
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
        })
        .join("")
    : `
      <div class="stack-item">
        ${renderUiIcon("check")}
        <div>
          <strong>Nėra pavedimo užklausų</strong>
          <p class="list-copy">Kai sukursite pavedimo užklausą, ji bus rodoma čia.</p>
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
  renderLearn();
  renderQuiz();
  renderMissions();
  renderFeed();
  renderTransfers();
}

function handleActionClick(actionButton) {
  const action = actionButton.dataset.action;

  if (action === "mini-piggy-tap") {
    state.miniGames.piggyTaps += 1;
    if (state.miniGames.piggyTaps >= 8) {
      awardMiniGamePoints("piggyRewarded", 5);
    } else {
      persistMiniGamesState();
    }
    renderMissions();
    return;
  }

  if (action === "mini-choice") {
    state.miniGames.choiceAnswered = true;
    state.miniGames.choiceSelected = actionButton.dataset.choiceId;
    if (state.miniGames.choiceSelected === "bike") {
      awardMiniGamePoints("choiceRewarded", 8);
    }
    renderMissions();
    return;
  }

  if (action === "mini-budget") {
    state.miniGames.budgetChoice = actionButton.dataset.budgetId;
    if (state.miniGames.budgetChoice === "split") {
      awardMiniGamePoints("budgetRewarded", 10);
    }
    renderMissions();
    return;
  }

  if (action === "toggle-goal-mission-only") {
    state.goalDraft.missionOnly = !state.goalDraft.missionOnly;
    if (state.goalDraft.missionOnly) {
      state.goalDraft.target = 0;
    }
    renderMissions();
    return;
  }

  if (action === "open-add-goal-confirm") {
    if (state.mode !== "parent") {
      createToast("Misijas gali kurti tik tėvai.", "warning");
      return;
    }

    const titleInput = document.querySelector("#goalTitleInput");
    const targetInput = document.querySelector("#goalTargetInput");
    const xpInput = document.querySelector("#goalXpInput");
    const title = titleInput?.value?.trim() || state.goalDraft.title;
    const missionOnly = state.goalDraft.missionOnly;
    const target = missionOnly ? 0 : sanitizeAmount(targetInput?.value || state.goalDraft.target);
    const xpReward = Math.max(5, sanitizeAmount(xpInput?.value || state.goalDraft.xpReward));

    openConfirm({
      role: "parent",
      title: "Pridėti naują misiją",
      copy: `Įvesk tėvų PIN, kad sukurtum misiją „${title}“ (+${xpReward} XP).`,
      action: {
        type: "parent-add-goal",
        title,
        target,
        xpReward,
        missionOnly,
      },
      buttonLabel: "Sukurti misiją",
    });
    return;
  }

  if (action === "open-complete-goal-confirm") {
    if (state.mode !== "parent") {
      createToast("Misiją gali patvirtinti tik tėvai.", "warning");
      return;
    }

    const goal = appData.goals.find((item) => item.id === actionButton.dataset.goalId);
    if (!goal) {
      return;
    }

    openConfirm({
      role: "parent",
      title: "Patvirtinti misiją atlikta",
      copy: `Įvesk tėvų PIN. Vaikas gaus +${goal.xpReward} XP už „${goal.title}“.`,
      action: {
        type: "parent-complete-goal",
        goalId: goal.id,
      },
      buttonLabel: "Patvirtinti ir duoti XP",
    });
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
      `${APP_NAME} pavedimo užklausa: pervesk ${formatCurrency(state.paymentRequestAmount)} į ${getAccountConfig(state.paymentRequestAccount).title} (${getAccountConfig(state.paymentRequestAccount).accountNumber}).`;
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

}

function handleQuizAnswer(index) {
  const question = QUIZ_QUESTIONS[state.quizIndex];
  const originalIndex = state.quizOptionOrder[index];
  state.selectedQuizAnswer = index;

  if (originalIndex === question.correctIndex) {
    state.quizFeedback = question.feedback;
    state.quizFeedbackTone = "success";
  } else {
    state.quizFeedback = "Dar ne visai. Pagalvok apie taupymą, limitą ir XP misijas.";
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
        title: `${APP_NAME} pavedimo užklausa`,
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
  if (target.id === "goalTitleInput") {
    state.goalDraft.title = target.value;
  }
  if (target.id === "goalTargetInput") {
    state.goalDraft.target = sanitizeNonNegativeAmount(target.value);
  }
  if (target.id === "goalXpInput") {
    state.goalDraft.xpReward = sanitizeAmount(target.value);
  }
  if (target.id === "paymentRequestAmountInput") {
    state.paymentRequestAmount = sanitizeAmount(target.value);
    const preview = document.querySelector("#paymentRequestPreview");
    const account = getAccountConfig(state.paymentRequestAccount);
    if (preview) {
      preview.textContent = `${APP_NAME} pavedimo užklausa: pervesk ${formatCurrency(state.paymentRequestAmount)} į ${account.title} (${account.accountNumber}).`;
    }
  }
});

resetQuizQuestion(0);
renderAll();
void initDeepLinkHandling();
void initBarcodeScanner();
