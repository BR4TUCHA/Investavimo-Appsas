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
  toastStack: document.querySelector("#toastStack"),
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
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
  quizIndex: 0,
  quizOptionOrder: [],
  quizFeedback: "",
  quizFeedbackTone: "",
  selectedQuizAnswer: null,
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
          icon: "🐷",
          title: "Trumpas tekstas",
          copy: "Vaikui rodoma mažiau sudėtingos informacijos ir daugiau aiškių žingsnių.",
        },
        {
          icon: "✨",
          title: "Emoji ir misijos",
          copy: "Prisijungus lauks mažos misijos, tikslai ir paprastesni paaiškinimai.",
        },
        {
          icon: "🔒",
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
        icon: "01",
        title: "Atskira autorizacija",
        copy: "Tėvų veiksmai atskirti nuo vaiko prisijungimo ir turi savo validaciją.",
      },
      {
        icon: "02",
        title: "Patvirtinimų centras",
        copy: "Investavimo, papildymų ir kitų jautrių veiksmų patvirtinimai atliekami per atskirą PIN modalą.",
      },
      {
        icon: "03",
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
          <span class="feature-icon">${item.icon}</span>
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
    const shareText = `KidFund pavedimo užklausa: pervesk ${formatCurrency(amount)} į ${account.title} (${account.accountNumber}).`;

    appData.requests.unshift({
      id: uid("request"),
      type: "payment-request",
      accountType: account.type,
      accountNumber: account.accountNumber,
      amount,
      status: "open",
      createdBy: state.mode || "child",
      shareText,
      createdAt: nowIso(),
    });
    recordAction("paymentRequest");
    appendFeed(`${getRoleLabel(state.mode)} sukūrė pavedimo užklausą į ${account.title} už ${formatCurrency(amount)}.`, "warning");
    saveAppData();
    void copyTextValue(shareText);
    closeConfirm();
    renderAll();
    createToast("Pavedimo užklausa sukurta ir paruošta kopijavimui.", "success");
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
    },
    {
      title: "Taupymas",
      value: formatCurrency(appData.accounts.savings),
      meta: `${appData.goals.length} aktyvūs tikslai`,
    },
    {
      title: "Investavimo kišenė",
      value: formatCurrency(appData.accounts.investPocket),
      meta: "Naudojama tik su tėvų patvirtinimu",
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
    },
  ];

  elements.homeStats.innerHTML = cards
    .map(
      (card) => `
        <article class="stat-card">
          <span class="stack-meta">${card.title}</span>
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
        <h4>📌 Šiandienos fokusas</h4>
        <p class="list-copy">Matote vaiko balansą, leidimus, investavimo prašymus ir atskiras sąskaitas vienoje vietoje.</p>
      </div>
      <div class="kid-card">
        <h4>🔔 App pranešimai</h4>
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
        <h4>🥳 Šaunu, prisijungei!</h4>
        <p class="list-copy">Mažiau teksto, daugiau aiškių mygtukų, emoji ir tavo taupymo misijų.</p>
      </div>
      <div class="kid-card">
        <h4>🎯 Šios savaitės limitas</h4>
        <p class="list-copy">${formatCurrency(appData.accounts.spentThisWeek)} iš ${formatCurrency(appData.accounts.weeklyLimit)} jau panaudota.</p>
        <div class="mini-progress"><span style="width: ${spendingPercent}%"></span></div>
      </div>
    `;
  }

  elements.partnerSpot.innerHTML = PARTNER_SPOTLIGHTS.map(
    (partner) => `
      <div class="promo-card">
        <div class="inline-row">
          <h4>${partner.title}</h4>
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
              <h4>${account.title}</h4>
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
        <h4>Gauti pavedimą</h4>
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
        <span class="feature-icon">D</span>
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
        <span class="feature-icon">I</span>
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
        <h4>🧾 Tėvų santrauka</h4>
        <p class="list-copy">Galite sekti, kiek užklausų buvo išsiųsta ir ar anti-spam taisyklės neleidžia perkrauti KidFund sistemos.</p>
      </div>
      <div class="kid-card">
        <h4>📲 Push į telefoną</h4>
        <p class="list-copy">Papildymai, investavimo sprendimai ir naujos užklausos rodomi ne tik viduje, bet ir telefono notification juostoje.</p>
      </div>
    `;
  } else {
    elements.quickActions.innerHTML = `
      <div class="stack-item">
        <span class="feature-icon">I</span>
        <div>
          <strong>🚀 Nori investuoti?</strong>
          <p class="list-copy">Pasirink aktyvą, spausk mygtuką ir tėvai gaus tavo prašymą.</p>
          <button class="button primary compact-button" type="button" data-switch-tab="invest">
            Eiti į investavimą
          </button>
        </div>
      </div>
      <div class="stack-item">
        <span class="feature-icon">T</span>
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
        <h4>🏅 Mini misija</h4>
        <p class="list-copy">Šiandien pabandyk atsakyti bent į 1 viktorinos klausimą ir pasižiūrėk, kiek jau sutaupei.</p>
        <div class="mission-row">
          <span class="mini-pill">🎯 1 klausimas</span>
          <span class="mini-pill">💰 1 tikslas</span>
          <span class="mini-pill">🧠 1 pamoka</span>
        </div>
      </div>
      <div class="kid-card">
        <h4>😎 Emoji patarimas</h4>
        <p class="list-copy">Jei nori gauti pinigų į taupyklę, nukopijuok taupyklės numerį arba sukurk pavedimo užklausą.</p>
      </div>
    `;
  }

  const preview = appData.feed.slice(0, 3);
  elements.homeFeedPreview.innerHTML = preview
    .map(
      (item) => `
        <div class="stack-item">
          <span class="feature-icon">${item.tone === "warning" ? "!" : "N"}</span>
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
          <span class="feature-icon">G</span>
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
      <span class="feature-icon">S</span>
      <div>
        <strong>Viso santaupų</strong>
        <p class="list-copy">${formatCurrency(appData.accounts.savings)}</p>
      </div>
    </div>
    <div class="stack-item">
      <span class="feature-icon">L</span>
      <div>
        <strong>Savaitės išlaidų limitas</strong>
        <p class="list-copy">${formatCurrency(appData.accounts.spentThisWeek)} iš ${formatCurrency(appData.accounts.weeklyLimit)}</p>
      </div>
    </div>
    <div class="stack-item">
      <span class="feature-icon">P</span>
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
      <span class="feature-icon">1</span>
      <div>
        <strong>Investavimo tvirtinimas</strong>
        <p class="list-copy">${appData.settings.approvalRule}</p>
      </div>
    </div>
    <div class="stack-item">
      <span class="feature-icon">2</span>
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
        <span class="feature-icon">A</span>
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
        <span class="feature-icon">N</span>
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
        <span class="feature-icon">✓</span>
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
          <span class="feature-icon">P</span>
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
        <span class="feature-icon">€</span>
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
          <span class="feature-icon">R</span>
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
      <span class="feature-icon">+</span>
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
      <span class="feature-icon">K</span>
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
      <span class="feature-icon">M</span>
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
          <span class="feature-icon">${item.tone === "warning" ? "!" : item.tone === "success" ? "✓" : "i"}</span>
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
      <span class="feature-icon">10</span>
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
            return `
              <div class="stack-item">
                <span class="feature-icon">€</span>
                <div>
                  <div class="inline-row">
                    <strong>${account.title}</strong>
                    <span class="status-tag active">Užklausa</span>
                  </div>
                  <p class="list-copy">Suma: ${formatCurrency(request.amount)}</p>
                  <p class="list-copy">${request.accountNumber}</p>
                  <div class="inline-actions">
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
              <span class="feature-icon">Q</span>
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
        <span class="feature-icon">✓</span>
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
  renderFeed();
  renderTransfers();
}

function handleActionClick(actionButton) {
  const action = actionButton.dataset.action;

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
