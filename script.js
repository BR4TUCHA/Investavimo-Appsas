const MATCH_THRESHOLD = 50;
const PROMPT_ROTATION_MS = 9000;
const AUTH_STORAGE_KEY = "kidfund-auth";
const PARENT_ONLY_TABS = new Set(["permissions", "transfers", "controls", "goals-admin"]);

function loadAuthStore() {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return {
        pins: {
          parent: "",
          child: "",
        },
        lastRole: "parent",
      };
    }
    const parsed = JSON.parse(raw);
    return {
      pins: {
        parent: parsed?.pins?.parent || "",
        child: parsed?.pins?.child || "",
      },
      lastRole: parsed?.lastRole || "parent",
    };
  } catch (error) {
    return {
      pins: {
        parent: "",
        child: "",
      },
      lastRole: "parent",
    };
  }
}

function saveAuthStore() {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authStore));
}

function getBiometricPlugin() {
  return window.Capacitor?.Plugins?.KidFundBiometric ?? null;
}

async function refreshBiometricAvailability() {
  const plugin = getBiometricPlugin();
  if (!plugin || typeof plugin.isAvailable !== "function") {
    authSession.biometricAvailable = false;
    authSession.biometricReason = "Biometrija veikia tik Android APK versijoje";
    renderAuth();
    return;
  }

  try {
    const result = await plugin.isAvailable();
    authSession.biometricAvailable = Boolean(result?.available);
    authSession.biometricReason = result?.reason || "Biometrija neprieinama";
  } catch (error) {
    authSession.biometricAvailable = false;
    authSession.biometricReason = "Biometrija neprieinama šiame įrenginyje";
  }

  renderAuth();
}

const authStore = loadAuthStore();

const state = {
  mode: authStore.lastRole || "parent",
  activeTab: "overview",
  profile: "balanced",
  allowance: 70,
  walletBalance: 152.4,
  weeklyLimit: 28,
  spentThisWeek: 18.12,
  savePercent: 32,
  investPercent: 18,
  matchPercent: 50,
  permissionRequired: true,
  pushEnabled: true,
  promptIndex: 0,
  learningIndex: 0,
  quizIndex: 0,
  selectedGoalId: "goal-bike",
  goals: [
    {
      id: "goal-bike",
      title: "Dviratis",
      emoji: "🚲",
      target: 180,
      saved: 79.2,
      author: "child",
    },
    {
      id: "goal-camp",
      title: "Vasaros stovykla",
      emoji: "⛺",
      target: 140,
      saved: 54,
      author: "parent",
    },
    {
      id: "goal-console",
      title: "Žaidimų konsolė",
      emoji: "🎮",
      target: 250,
      saved: 32,
      author: "parent",
    },
  ],
  requests: [
    {
      id: "request-1",
      type: "withdraw",
      amount: 8,
      goalId: "goal-bike",
      reason: "Noriu nusipirkti dviračio skambutį.",
      status: "pending",
      createdBy: "child",
      createdAt: "Prieš 8 min.",
    },
    {
      id: "request-2",
      type: "deposit",
      amount: 5,
      goalId: "goal-camp",
      reason: "Noriu greičiau priartėti prie stovyklos tikslo.",
      status: "approved",
      createdBy: "child",
      createdAt: "Vakar",
    },
  ],
  feed: [
    {
      id: "feed-1",
      title: "Prašymas leidimui",
      text: "Vaikas paprašė išimti 8 EUR iš taupyklės „Dviratis“.",
      tone: "warning",
      time: "Prieš 8 min.",
    },
    {
      id: "feed-2",
      title: "Papildyta taupyklė",
      text: "Tėvai pridėjo 15 EUR į vaiko piniginę.",
      tone: "success",
      time: "Šiandien 08:12",
    },
    {
      id: "feed-3",
      title: "Patvirtintas taupymas",
      text: "Leista perkelti 5 EUR į tikslą „Vasaros stovykla“.",
      tone: "info",
      time: "Vakar 19:40",
    },
    {
      id: "feed-4",
      title: "Partnerio kampanija aktyvi",
      text: "Rodyta edukacinė reklama apie saugų taupymą.",
      tone: "info",
      time: "Vakar 14:03",
    },
  ],
};

const authSession = {
  open: true,
  role: state.mode,
  activeField: "pin",
  biometricAvailable: false,
  biometricReason: "Tik Android APK versijoje",
  biometricScanning: false,
};

const investmentProfiles = {
  safe: {
    title: "Saugus",
    badge: "Žemesnė rizika",
    categories: [
      {
        name: "Pinigų rinka",
        share: "40%",
        risk: "Labai žema rizika",
        description: "Tinka aiškinti, kad dalis lėšų laikoma labai ramiai ir saugiai.",
      },
      {
        name: "Obligacijų fondai",
        share: "35%",
        risk: "Žema rizika",
        description: "Padeda vaikui suprasti stabilesnio augimo idėją.",
      },
      {
        name: "Rezervas",
        share: "25%",
        risk: "Apsauga",
        description: "Primena, kad ne visa suma turi būti nukreipta į rizikingesnes sritis.",
      },
    ],
  },
  balanced: {
    title: "Subalansuotas",
    badge: "3 kryptys",
    categories: [
      {
        name: "ETF fondai",
        share: "45%",
        risk: "Žema - vidutinė rizika",
        description: "Parodo, kodėl vienas krepšelis gali būti saugesnis nei viena akcija.",
      },
      {
        name: "Technologijos",
        share: "30%",
        risk: "Vidutinė rizika",
        description: "Moko, kad augimo sektoriai yra įdomūs, bet turi daugiau svyravimo.",
      },
      {
        name: "Žalioji energija",
        share: "25%",
        risk: "Vidutinė rizika",
        description: "Susieja investavimą su vaikui aiškiomis ateities temomis.",
      },
    ],
  },
  growth: {
    title: "Augimo",
    badge: "Didesnis potencialas",
    categories: [
      {
        name: "Technologijų augimas",
        share: "40%",
        risk: "Padidėjusi rizika",
        description: "Aiškina, kad didesnis potencialas paprastai reiškia didesnį svyravimą.",
      },
      {
        name: "AI ir robotika",
        share: "35%",
        risk: "Aukštesnė rizika",
        description: "Padeda suprasti, kad naujos sritys nėra garantija, o tik galimybė.",
      },
      {
        name: "Ateities miestai",
        share: "25%",
        risk: "Vidutinė - aukštesnė rizika",
        description: "Parodo teminį investavimą ir ilgalaikį mąstymą.",
      },
    ],
  },
};

function buildQuizBank() {
  const topics = [
    {
      subject: "savaitės limitą",
      correct: "Aiškią ribą, kuri padeda neišleisti per daug per savaitę",
      wrongA: "Galimybę išleisti daugiau nei planuota",
      wrongB: "Slaptą mokestį už pirkinius",
      helper: "Pagalvok apie planavimą ir savikontrolę.",
      feedback:
        "Teisingai - savaitės limitas padeda vaikui suprasti, kad pinigai turi ribas.",
    },
    {
      subject: "taupymo įprotį",
      correct: "Nuoseklų atsidėjimą tikslui prieš leidžiant viską iš karto",
      wrongA: "Impulsyvų visų pinigų išleidimą",
      wrongB: "Tik atsitiktinį taupymą, kai kas nors primena",
      helper: "Ieškok atsakymo apie pastovų veiksmą, o ne momentinę nuotaiką.",
      feedback:
        "Teisingai - taupymo įprotis atsiranda tada, kai dalis pinigų atidedama nuosekliai.",
    },
    {
      subject: "leidimo prašymą iš taupyklės",
      correct: "Saugų būdą vaikui paprašyti tėvų leidimo prieš išimant ar perkeliant pinigus",
      wrongA: "Automatinį leidimą daryti ką nori be priežiūros",
      wrongB: "Būdą apeiti tėvų taisykles",
      helper: "Čia svarbu bendras susitarimas tarp vaiko ir tėvų.",
      feedback:
        "Teisingai - leidimo prašymas padeda išlaikyti kontrolę ir kartu mokytis priimti sprendimus.",
    },
    {
      subject: "investavimo riziką",
      correct: "Tai, kad vertė gali ir kilti, ir kristi",
      wrongA: "Garantuotą pelną",
      wrongB: "Tėvų pažadą visada padengti nuostolį",
      helper: "Pagalvok apie svyravimą, o ne garantiją.",
      feedback:
        "Teisingai - investavimo rizika reiškia, kad rezultatai nėra visada vienodi.",
    },
    {
      subject: "tėvų match mechaniką",
      correct: "Papildomą tėvų prisidėjimą, kai vaikas pasiekia dalį savo tikslo",
      wrongA: "Automatinį visų norų apmokėjimą",
      wrongB: "Baudą už lėtą taupymą",
      helper: "Atsakymas susijęs su paskatinimu ir motyvacija.",
      feedback:
        "Teisingai - match mechanika skatina vaiką taupyti, nes tėvai prisideda tik prie pažangos.",
    },
    {
      subject: "diversifikaciją",
      correct: "Pinigų paskirstymą per kelias skirtingas kryptis",
      wrongA: "Visų pinigų laikymą vienoje akcijoje",
      wrongB: "Tik taupymą grynaisiais",
      helper: "Pagalvok apie paskirstymą, o ne koncentraciją.",
      feedback:
        "Teisingai - diversifikacija mažina priklausomybę nuo vieno pasirinkimo.",
    },
    {
      subject: "kišenpinigių pervedimą",
      correct: "Tėvų įvykdomą pinigų davimą į vaiko piniginę ar taupyklę",
      wrongA: "Vaiko galimybę be leidimo susikurti naujus pinigus",
      wrongB: "Automatinį išlaidų panaikinimą",
      helper: "Atsakymas susijęs su tėvų veiksmu programėlėje.",
      feedback:
        "Teisingai - kišenpinigiai ar papildymas ateina iš tėvų pusės ir padeda valdyti biudžetą.",
    },
  ];

  const questionStarts = [
    "Kuris atsakymas geriausiai apibūdina",
    "Kaip trumpai paaiškintum",
    "Kurį teiginį verta prisiminti apie",
    "Kas svarbiausia suprasti kalbant apie",
    "Kuris variantas tiksliausiai nusako",
    "Kaip pradžiamoksliui paaiškintum",
    "Ką verta pasirinkti, jei kalbame apie",
  ];

  const helperAddons = [
    "Atsakymas susijęs su geru finansiniu įpročiu.",
    "Pagalvok, kas padeda vaikui priimti saugesnį sprendimą.",
    "Čia svarbiausias ne greitis, o supratimas.",
    "Ieškok atsakymo, kuris ugdo planavimą ir atsakomybę.",
    "Pagalvok, kas padeda kalbėtis su tėvais ir nesielgti impulsyviai.",
  ];

  const feedbackAddons = [
    "Tokios mažos sąvokos vėliau padeda geriau suprasti ir sudėtingesnius finansinius pasirinkimus.",
    "Šitą principą verta prisiminti kiekvieną kartą prieš išleidžiant ar atidedant pinigus.",
    "Būtent taip vaikas pradeda sieti pinigus su planu, o ne tik su momentiniu noru.",
    "Tai vienas iš kertinių žingsnių kuriant gerus finansinius įpročius nuo mažens.",
    "Kuo dažniau tokie atsakymai kartojami, tuo stipriau formuojasi finansinis raštingumas.",
  ];

  const result = [];
  for (let index = 0; index < 140; index += 1) {
    const topic = topics[index % topics.length];
    const start = questionStarts[index % questionStarts.length];
    const helperAddon = helperAddons[index % helperAddons.length];
    const feedbackAddon = feedbackAddons[index % feedbackAddons.length];
    result.push({
      question: `Klausimas ${index + 1}. ${start} ${topic.subject}?`,
      helper: `${topic.helper} ${helperAddon}`,
      options: [topic.wrongA, topic.correct, topic.wrongB],
      correctIndex: 1,
      feedback: `${topic.feedback} ${feedbackAddon}`,
    });
  }
  return result;
}

function buildLearningTips() {
  const topics = [
    {
      title: "Kodėl verta matyti savo balansą?",
      tag: "Apžvalga",
      text: "Kai vaikas mato aiškų balansą, pinigai tampa ne abstrakti mintis, o realus resursas, kurį reikia valdyti.",
    },
    {
      title: "Kam reikalingas savaitės limitas?",
      tag: "Limitai",
      text: "Savaitės limitas moko, kad ne kiekvienas noras turi būti išpildytas tą pačią dieną ir kad pinigai planuojami per laiką.",
    },
    {
      title: "Kaip veikia taupyklės tikslas?",
      tag: "Taupymas",
      text: "Tikslas susieja norą su konkrečia suma, todėl vaikui lengviau suprasti, ką reiškia progresas.",
    },
    {
      title: "Kodėl svarbus tėvų leidimas?",
      tag: "Leidimai",
      text: "Leidimų sistema ne baudžia, o sukuria trumpą sustojimą prieš priimant finansinį sprendimą.",
    },
    {
      title: "Kuo skiriasi taupymas ir investavimas?",
      tag: "Pagrindai",
      text: "Taupymas dažniau saugo artimesnį tikslą, o investavimas moko galvoti apie ilgesnį laikotarpį ir riziką.",
    },
    {
      title: "Kam reikalinga reklamos vieta?",
      tag: "Finansavimas",
      text: "Partnerio reklamos kortelė gali padėti finansuoti programėlę, jei rodomas saugus ir edukacinis turinys.",
    },
    {
      title: "Ką duoda push pranešimai?",
      tag: "Push",
      text: "Push žinutės leidžia tėvams greičiau sureaguoti, kai vaikas prašo leidimo ar priartėja prie limito.",
    },
  ];

  const openings = [
    "Trumpa mintis šiandienai:",
    "Mažas paaiškinimas pradžiamoksliui:",
    "Štai ką verta aptarti kartu:",
    "Paprastas finansinis priminimas:",
    "Svarbi idėja prieš kitą sprendimą:",
  ];

  const closings = [
    "Šią mintį verta susieti su savo aktyviu taupymo tikslu.",
    "Tokie trumpi paaiškinimai leidžia vaikui mokytis po truputį, bet nuosekliai.",
    "Kuo dažniau apie tai kalbama, tuo lengviau vaikui atsiranda finansinė savikontrolė.",
    "Net keli sakiniai per dieną padeda geriau suprasti, kaip veikia pinigai.",
    "Tai nedidelė detalė, bet ji kuria stiprų finansinio raštingumo pagrindą.",
  ];

  const result = [];
  for (let index = 0; index < 140; index += 1) {
    const topic = topics[index % topics.length];
    const opening = openings[index % openings.length];
    const closing = closings[index % closings.length];
    result.push({
      title: `${topic.title} #${index + 1}`,
      tag: topic.tag,
      text: `${opening} ${topic.text} ${closing}`,
    });
  }
  return result;
}

const tabIntros = {
  overview: {
    title: "Sveikas atvykęs į apžvalgą",
    text: "Čia matai pagrindinį balansą, reklamos vietą finansavimui ir trumpą pradžiamokslio bloką vaikui.",
  },
  savings: {
    title: "Taupyklės skiltis",
    text: "Vaikas čia gali pateikti prašymą įdėti ar išimti iš taupyklės, o tėvai gali veikti iškart be papildomų leidimų.",
  },
  permissions: {
    title: "Leidimų centras",
    text: "Šioje vietoje tėvai mato visus vaiko prašymus ir sprendžia, ką leisti, o ko ne.",
  },
  transfers: {
    title: "Tėvų pinigų veiksmai",
    text: "Čia tėvai gali duoti kišenpinigius, pervesti pinigus į vaiko piniginę arba papildyti taupyklę.",
  },
  learn: {
    title: "Mokymosi skiltis",
    text: "Čia sudėta daugiau nei 100 patarimų, kad vaikas visada turėtų ką paskaityti apie pinigus ir taupymą.",
  },
  quiz: {
    title: "Viktorinos skiltis",
    text: "Čia yra daugiau nei 100 klausimų, kurie leidžia pasitikrinti, ar vaikas supranta finansų pagrindus.",
  },
  feed: {
    title: "Push istorija",
    text: "Čia matosi, kas buvo įdėta, išimta, ko buvo paprašyta ir kaip sureagavo tėvai.",
  },
};

const quizQuestions = buildQuizBank();
const learningTips = buildLearningTips();

const elements = {
  profileFab: document.querySelector("#profileFab"),
  profileFabText: document.querySelector("#profileFabText"),
  profileMenu: document.querySelector("#profileMenu"),
  roleButtons: Array.from(document.querySelectorAll("[data-role-target]")),
  tabButtons: Array.from(document.querySelectorAll("[data-tab-target]")),
  tabPanels: Array.from(document.querySelectorAll("[data-tab-panel]")),
  parentControls: Array.from(document.querySelectorAll("[data-parent-control]")),
  parentOnlyBlocks: Array.from(document.querySelectorAll("[data-parent-only]")),
  profileButtons: Array.from(document.querySelectorAll("[data-profile]")),
  authOverlay: document.querySelector("#authOverlay"),
  authTitle: document.querySelector("#authTitle"),
  authText: document.querySelector("#authText"),
  authRoleButtons: Array.from(document.querySelectorAll("[data-auth-role]")),
  authPinSlots: document.querySelector("#authPinSlots"),
  authPinConfirmSlots: document.querySelector("#authPinConfirmSlots"),
  authPinSlotItems: Array.from(document.querySelectorAll('[data-slot-group="pin"]')),
  authPinConfirmSlotItems: Array.from(document.querySelectorAll('[data-slot-group="confirm"]')),
  authPin: document.querySelector("#authPin"),
  authPinConfirmWrap: document.querySelector("#authPinConfirmWrap"),
  authPinConfirm: document.querySelector("#authPinConfirm"),
  authStatus: document.querySelector("#authStatus"),
  authPrimaryButton: document.querySelector("#authPrimaryButton"),
  authFingerprintButton: document.querySelector("#authFingerprintButton"),
  authFingerprintHint: document.querySelector("#authFingerprintHint"),
  authResetPin: document.querySelector("#authResetPin"),
  activeProfileLabel: document.querySelector("#activeProfileLabel"),
  modeBadge: document.querySelector("#modeBadge"),
  beginnerCopy: document.querySelector("#beginnerCopy"),
  roleCaption: document.querySelector("#roleCaption"),
  roleDescription: document.querySelector("#roleDescription"),
  heroCopy: document.querySelector("#heroCopy"),
  heroGoalName: document.querySelector("#heroGoalName"),
  heroWeeklyLimit: document.querySelector("#heroWeeklyLimit"),
  heroLibraryCount: document.querySelector("#heroLibraryCount"),
  walletBalance: document.querySelector("#walletBalance"),
  walletSummary: document.querySelector("#walletSummary"),
  expenseFeed: document.querySelector("#expenseFeed"),
  assistantMessage: document.querySelector("#assistantMessage"),
  assistantTags: document.querySelector("#assistantTags"),
  nextPrompt: document.querySelector("#nextPrompt"),
  enablePush: document.querySelector("#enablePush"),
  activeGoalName: document.querySelector("#activeGoalName"),
  weeklyLimitPreview: document.querySelector("#weeklyLimitPreview"),
  libraryPreview: document.querySelector("#libraryPreview"),
  savingsBalance: document.querySelector("#savingsBalance"),
  savingsDelta: document.querySelector("#savingsDelta"),
  selectedGoalHeadline: document.querySelector("#selectedGoalHeadline"),
  selectedGoalProgress: document.querySelector("#selectedGoalProgress"),
  investmentProfileBadge: document.querySelector("#investmentProfileBadge"),
  investPocketAmount: document.querySelector("#investPocketAmount"),
  investCategoryCount: document.querySelector("#investCategoryCount"),
  spendAmount: document.querySelector("#spendAmount"),
  saveAmount: document.querySelector("#saveAmount"),
  investAmount: document.querySelector("#investAmount"),
  limitStatus: document.querySelector("#limitStatus"),
  limitDetail: document.querySelector("#limitDetail"),
  spentAmount: document.querySelector("#spentAmount"),
  remainingLimitAmount: document.querySelector("#remainingLimitAmount"),
  selectedGoalTitleHome: document.querySelector("#selectedGoalTitleHome"),
  progressFill: document.querySelector("#progressFill"),
  savedAmount: document.querySelector("#savedAmount"),
  savedPercent: document.querySelector("#savedPercent"),
  parentContribution: document.querySelector("#parentContribution"),
  notificationBanner: document.querySelector("#notificationBanner"),
  pushPreviewTitle: document.querySelector("#pushPreviewTitle"),
  pushPreviewBadge: document.querySelector("#pushPreviewBadge"),
  pushPreviewText: document.querySelector("#pushPreviewText"),
  pushPreviewTime: document.querySelector("#pushPreviewTime"),
  goalSelector: document.querySelector("#goalSelector"),
  savingsModeBadge: document.querySelector("#savingsModeBadge"),
  selectedGoalSavingsAmount: document.querySelector("#selectedGoalSavingsAmount"),
  selectedGoalRemainingAmount: document.querySelector("#selectedGoalRemainingAmount"),
  permissionPolicyLabel: document.querySelector("#permissionPolicyLabel"),
  childSavingsRequestForm: document.querySelector("#childSavingsRequestForm"),
  requestType: document.querySelector("#requestType"),
  requestAmount: document.querySelector("#requestAmount"),
  requestReason: document.querySelector("#requestReason"),
  submitSavingsRequest: document.querySelector("#submitSavingsRequest"),
  childQuickSave: document.querySelector("#childQuickSave"),
  parentAddToSavings: document.querySelector("#parentAddToSavings"),
  parentWithdrawFromSavings: document.querySelector("#parentWithdrawFromSavings"),
  permissionsCountBadge: document.querySelector("#permissionsCountBadge"),
  permissionsPolicyText: document.querySelector("#permissionsPolicyText"),
  togglePermissionPolicy: document.querySelector("#togglePermissionPolicy"),
  requestList: document.querySelector("#requestList"),
  parentTransferForm: document.querySelector("#parentTransferForm"),
  parentTransferType: document.querySelector("#parentTransferType"),
  parentTransferAmount: document.querySelector("#parentTransferAmount"),
  parentTransferGoal: document.querySelector("#parentTransferGoal"),
  parentTransferNote: document.querySelector("#parentTransferNote"),
  addWeeklyAllowance: document.querySelector("#addWeeklyAllowance"),
  allowance: document.querySelector("#allowance"),
  weeklyLimit: document.querySelector("#weeklyLimit"),
  spentThisWeek: document.querySelector("#spentThisWeek"),
  savePercent: document.querySelector("#savePercent"),
  investPercent: document.querySelector("#investPercent"),
  matchPercent: document.querySelector("#matchPercent"),
  allowanceValue: document.querySelector("#allowanceValue"),
  weeklyLimitValue: document.querySelector("#weeklyLimitValue"),
  spentThisWeekValue: document.querySelector("#spentThisWeekValue"),
  savePercentValue: document.querySelector("#savePercentValue"),
  investPercentValue: document.querySelector("#investPercentValue"),
  matchPercentValue: document.querySelector("#matchPercentValue"),
  pushStatus: document.querySelector("#pushStatus"),
  notificationList: document.querySelector("#notificationList"),
  rulesList: document.querySelector("#rulesList"),
  goalCountLabel: document.querySelector("#goalCountLabel"),
  goalModePill: document.querySelector("#goalModePill"),
  goalList: document.querySelector("#goalList"),
  goalDetailTitle: document.querySelector("#goalDetailTitle"),
  goalCreatorPill: document.querySelector("#goalCreatorPill"),
  goalDetailCopy: document.querySelector("#goalDetailCopy"),
  goalDetailProgress: document.querySelector("#goalDetailProgress"),
  goalTargetAmount: document.querySelector("#goalTargetAmount"),
  goalSavedAmount: document.querySelector("#goalSavedAmount"),
  goalRemainingAmount: document.querySelector("#goalRemainingAmount"),
  goalProgressPercent: document.querySelector("#goalProgressPercent"),
  goalsRoleDescription: document.querySelector("#goalsRoleDescription"),
  parentGoalForm: document.querySelector("#parentGoalForm"),
  parentGoalTitle: document.querySelector("#parentGoalTitle"),
  parentGoalEmoji: document.querySelector("#parentGoalEmoji"),
  parentGoalTarget: document.querySelector("#parentGoalTarget"),
  parentGoalSaved: document.querySelector("#parentGoalSaved"),
  addParentGoalButton: document.querySelector("#addParentGoalButton"),
  deleteGoalButton: document.querySelector("#deleteGoalButton"),
  childGoalForm: document.querySelector("#childGoalForm"),
  childGoalTitle: document.querySelector("#childGoalTitle"),
  childGoalEmoji: document.querySelector("#childGoalEmoji"),
  childGoalTarget: document.querySelector("#childGoalTarget"),
  investmentProfileTitle: document.querySelector("#investmentProfileTitle"),
  investmentProfileStatus: document.querySelector("#investmentProfileStatus"),
  investmentGrid: document.querySelector("#investmentGrid"),
  learningCounter: document.querySelector("#learningCounter"),
  learningTag: document.querySelector("#learningTag"),
  learningTitle: document.querySelector("#learningTitle"),
  learningText: document.querySelector("#learningText"),
  learningMeta: document.querySelector("#learningMeta"),
  learningPreviewList: document.querySelector("#learningPreviewList"),
  nextLearningTip: document.querySelector("#nextLearningTip"),
  randomLearningTip: document.querySelector("#randomLearningTip"),
  quizCounter: document.querySelector("#quizCounter"),
  quizHelper: document.querySelector("#quizHelper"),
  quizQuestion: document.querySelector("#quizQuestion"),
  quizRoleNote: document.querySelector("#quizRoleNote"),
  quizOptions: document.querySelector("#quizOptions"),
  quizFeedback: document.querySelector("#quizFeedback"),
  nextQuestion: document.querySelector("#nextQuestion"),
  randomQuestion: document.querySelector("#randomQuestion"),
  feedBadge: document.querySelector("#feedBadge"),
  notificationsFeed: document.querySelector("#notificationsFeed"),
  sectionGuide: document.querySelector("#sectionGuide"),
  sectionGuideTitle: document.querySelector("#sectionGuideTitle"),
  sectionGuideText: document.querySelector("#sectionGuideText"),
  closeSectionGuide: document.querySelector("#closeSectionGuide"),
  toastStack: document.querySelector("#toastStack"),
};

let promptTimer = null;
let introDismissedForTab = "";

function sanitizePin(value) {
  return value.replace(/\D/g, "").slice(0, 4);
}

function isParentTab(tabName) {
  return PARENT_ONLY_TABS.has(tabName);
}

function getAuthMode() {
  return authStore.pins[authSession.role] ? "login" : "register";
}

function openAuth(role) {
  authSession.role = role;
  authSession.open = true;
  authSession.activeField = "pin";
  authSession.biometricScanning = false;
  elements.authPin.value = "";
  elements.authPinConfirm.value = "";
  renderAuth();
}

function completeAuth(role, successMessage) {
  authSession.open = false;
  authStore.lastRole = role;
  saveAuthStore();
  state.mode = role;
  state.activeTab = role === "child" ? "feed" : "overview";
  elements.profileMenu.hidden = true;
  introDismissedForTab = "";
  renderAll();
  showToast(successMessage, "success");
}

function renderAuth() {
  const mode = getAuthMode();
  elements.authOverlay.hidden = !authSession.open;
  if (!authSession.open) {
    return;
  }

  elements.authRoleButtons.forEach((button) => {
    const active = button.dataset.authRole === authSession.role;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  const isRegister = mode === "register";
  elements.authTitle.textContent = isRegister ? "Sukurti PIN kodą" : "Prisijungti prie KidFund";
  elements.authText.textContent = isRegister
    ? `Pirmą kartą prisijungiant kaip ${authSession.role === "parent" ? "tėvai" : "vaikas"}, reikia susikurti 4 skaitmenų PIN kodą.`
    : `Įvesk ${authSession.role === "parent" ? "tėvų" : "vaiko"} PIN kodą arba naudok Android biometrinį patvirtinimą.`;
  elements.authPinConfirmWrap.hidden = !isRegister;
  elements.authPrimaryButton.textContent = isRegister ? "Sukurti PIN" : "Prisijungti";
  elements.authFingerprintButton.disabled = isRegister || !authSession.biometricAvailable;
  elements.authFingerprintButton.classList.toggle("scanning", authSession.biometricScanning);
  elements.authResetPin.hidden = isRegister;
  elements.authStatus.textContent = isRegister
    ? "PIN išsaugomas šiame įrenginyje ir naudojamas tik demonstracijai."
    : authSession.biometricAvailable
      ? "Prisijungti gali PIN kodu arba Android biometriniu patvirtinimu."
      : authSession.biometricReason;
  elements.authFingerprintHint.textContent = isRegister
    ? "Biometrija aktyvuosis po PIN registracijos"
    : authSession.biometricAvailable
      ? "Tikras Android biometric prompt"
      : authSession.biometricReason;

  renderPinSlots(elements.authPinSlotItems, elements.authPin.value);
  renderPinSlots(elements.authPinConfirmSlotItems, elements.authPinConfirm.value);
  elements.authPinSlots.classList.toggle("active", authSession.activeField === "pin");
  elements.authPinConfirmSlots.classList.toggle("active", authSession.activeField === "confirm");
}

function renderPinSlots(slotElements, value) {
  const normalized = sanitizePin(value);
  slotElements.forEach((slot, index) => {
    const filled = normalized[index];
    slot.textContent = filled ? "•" : "";
    slot.classList.toggle("filled", Boolean(filled));
  });
}

function updateAuthValue(field, nextValue) {
  const sanitized = sanitizePin(nextValue);
  if (field === "pin") {
    elements.authPin.value = sanitized;
    renderPinSlots(elements.authPinSlotItems, sanitized);
    if (sanitized.length === 4 && getAuthMode() === "register") {
      authSession.activeField = "confirm";
    }
  } else {
    elements.authPinConfirm.value = sanitized;
    renderPinSlots(elements.authPinConfirmSlotItems, sanitized);
  }
  renderAuth();
}

function appendDigitToActivePin(digit) {
  if (authSession.activeField === "confirm" && !elements.authPinConfirmWrap.hidden) {
    updateAuthValue("confirm", `${elements.authPinConfirm.value}${digit}`);
    return;
  }
  updateAuthValue("pin", `${elements.authPin.value}${digit}`);
}

function clearActivePin() {
  if (authSession.activeField === "confirm" && !elements.authPinConfirmWrap.hidden) {
    updateAuthValue("confirm", "");
    return;
  }
  updateAuthValue("pin", "");
}

function backspaceActivePin() {
  if (authSession.activeField === "confirm" && !elements.authPinConfirmWrap.hidden) {
    updateAuthValue("confirm", elements.authPinConfirm.value.slice(0, -1));
    return;
  }
  updateAuthValue("pin", elements.authPin.value.slice(0, -1));
}

function formatCurrency(value) {
  const rounded = Math.round(Number(value) * 100) / 100;
  return `${rounded.toFixed(2)} EUR`;
}

function showToast(message, tone = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${tone}`;
  toast.textContent = message;
  elements.toastStack.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add("hide");
  }, 2400);

  window.setTimeout(() => {
    toast.remove();
  }, 3000);
}

function getSelectedGoal() {
  return state.goals.find((goal) => goal.id === state.selectedGoalId) || state.goals[0];
}

function getGoalProgress(goal) {
  if (!goal || goal.target <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round((goal.saved / goal.target) * 100)));
}

function getMetrics() {
  const spendPercent = Math.max(0, 100 - state.savePercent - state.investPercent);
  const spendAmount = (state.allowance * spendPercent) / 100;
  const saveAmount = (state.allowance * state.savePercent) / 100;
  const investAmount = (state.allowance * state.investPercent) / 100;
  const remainingLimit = Math.max(0, state.weeklyLimit - state.spentThisWeek);
  const overLimit = state.spentThisWeek > state.weeklyLimit;
  const nearLimit = !overLimit && state.spentThisWeek >= state.weeklyLimit * 0.8;
  const goal = getSelectedGoal();
  const progress = getGoalProgress(goal);
  const thresholdReached = progress >= MATCH_THRESHOLD;
  const parentContribution = thresholdReached ? (goal.target * state.matchPercent) / 100 : 0;
  const remainingGoal = Math.max(0, goal.target - Math.min(goal.target, goal.saved + parentContribution));
  return {
    spendAmount,
    saveAmount,
    investAmount,
    remainingLimit,
    overLimit,
    nearLimit,
    goal,
    progress,
    thresholdReached,
    parentContribution,
    remainingGoal,
  };
}

function appendFeed(title, text, tone = "info", time = "Ką tik", sendPush = false) {
  state.feed.unshift({
    id: `feed-${Date.now()}-${Math.random()}`,
    title,
    text,
    tone,
    time,
  });
  state.feed = state.feed.slice(0, 20);

  if (sendPush && state.pushEnabled) {
    showToast(`Push: ${title}`, tone === "danger" ? "warning" : tone);
  }
}

function getCurrentProfile() {
  return investmentProfiles[state.profile];
}

function buildAssistantPrompts(metrics) {
  const prompts = [
    {
      text: "Šitas ekranas specialiai padalintas į trumpas skiltis, kad vaikui nereikėtų visko skaityti viename ilgame puslapyje.",
      tags: ["mobile", "trumpai"],
    },
    {
      text: `Programėlėje jau yra ${quizQuestions.length} klausimų ir ${learningTips.length} patarimų, todėl kiekvieną kartą galima rasti ką nors naujo.`,
      tags: ["140+", "mokymasis"],
    },
    {
      text: "Reklamos vieta gali būti naudojama saugiam partneriui, kuris finansuoja programėlę ir remia edukacinį turinį.",
      tags: ["partneris", "ads"],
    },
  ];

  if (state.mode === "parent") {
    prompts.unshift({
      text: "Tėvų režime galima duoti pinigus, pildyti taupyklę, priimti leidimų sprendimus ir valdyti visus nustatymus.",
      tags: ["tėvai", "pilna kontrolė"],
    });
  } else {
    prompts.unshift({
      text: "Vaiko režime galima pateikti prašymą įdėti ar išimti iš taupyklės, stebėti pranešimus ir mokytis per viktoriną.",
      tags: ["vaikas", "prašymai"],
    });
  }

  if (metrics.overLimit) {
    prompts.unshift({
      text: "Savaitės limitas jau viršytas - tėvams būtų parodytas skubus push perspėjimas apie išlaidas.",
      tags: ["skubu", "limitas"],
    });
  } else if (metrics.nearLimit) {
    prompts.unshift({
      text: `Iki savaitės limito liko ${formatCurrency(metrics.remainingLimit)} - verta sustoti prieš kitą pirkinį.`,
      tags: ["perspėjimas", "biudžetas"],
    });
  }

  if (state.requests.some((request) => request.status === "pending")) {
    prompts.unshift({
      text: "Šiuo metu yra laukiančių leidimų prašymų, todėl verta atsidaryti skiltį „Leidimai“.",
      tags: ["leidimai", "pending"],
    });
  }

  return prompts;
}

function renderAssistant(metrics, randomize = false) {
  const prompts = buildAssistantPrompts(metrics);
  if (randomize) {
    state.promptIndex = (state.promptIndex + 1) % prompts.length;
  } else {
    state.promptIndex %= prompts.length;
  }

  const prompt = prompts[state.promptIndex];
  elements.assistantMessage.textContent = prompt.text;
  elements.assistantTags.innerHTML = "";
  prompt.tags.forEach((tag) => {
    const badge = document.createElement("span");
    badge.className = "assistant-tag";
    badge.textContent = tag;
    elements.assistantTags.appendChild(badge);
  });
  elements.enablePush.textContent = state.pushEnabled ? "Išjungti push" : "Įjungti push";
  elements.enablePush.disabled = state.mode !== "parent";
}

function restartPromptRotation() {
  if (promptTimer) {
    clearInterval(promptTimer);
  }
  promptTimer = window.setInterval(() => {
    renderAssistant(getMetrics(), true);
  }, PROMPT_ROTATION_MS);
}

function renderTabIntro() {
  const intro = tabIntros[state.activeTab];
  const isDismissed = introDismissedForTab === state.activeTab;
  elements.sectionGuideTitle.textContent = intro.title;
  elements.sectionGuideText.textContent = intro.text;
  elements.sectionGuide.hidden = isDismissed;
}

function renderTabs() {
  elements.tabButtons.forEach((button) => {
    const hideForChild = state.mode !== "parent" && button.hasAttribute("data-parent-only");
    button.hidden = hideForChild;
  });

  elements.tabButtons.forEach((button) => {
    const active = button.dataset.tabTarget === state.activeTab;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  elements.tabPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.tabPanel === state.activeTab);
  });

  renderTabIntro();
}

function renderRoleState(metrics) {
  const isParent = state.mode === "parent";

  elements.parentOnlyBlocks.forEach((block) => {
    block.hidden = !isParent;
  });

  elements.roleButtons.forEach((button) => {
    const active = button.dataset.roleTarget === state.mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  elements.parentControls.forEach((control) => {
    control.disabled = !isParent;
  });

  elements.profileButtons.forEach((button) => {
    const active = button.dataset.profile === state.profile;
    button.classList.toggle("active", active);
    button.disabled = !isParent;
  });

  elements.profileFabText.textContent = isParent ? "Tėvai" : "Vaikas";
  elements.profileFab.classList.toggle("child-mode", !isParent);
  elements.activeProfileLabel.textContent = isParent ? "Augustas Vaičiulis" : "Augustas - vaiko vaizdas";
  elements.modeBadge.textContent = isParent ? "Tėvų režimas" : "Vaiko režimas";
  elements.roleCaption.textContent = isParent ? "Tėvų režimas" : "Vaiko režimas";
  elements.roleDescription.textContent = isParent
    ? "Tėvai valdo limitus, leidimus ir pervedimus, o vaikas turi aiškiai suskaidytas skiltis mokymuisi ir taupymui."
    : "Vaikas mato tik savo veiksmus, push pranešimus apie pakeitimus, taupyklę, mokymąsi ir klausimus. Tėvų valdymo blokai paslėpti.";
  elements.heroCopy.textContent = isParent
    ? "Tėvai gali duoti pinigus, pildyti taupyklę, tvirtinti prašymus ir valdyti investavimo profilį."
    : "Vaikas gali pateikti taupyklės prašymus ir sekti progresą, kol tėvai priima sprendimus leidimų skiltyje.";
  elements.beginnerCopy.textContent = isParent
    ? "Pirmas žingsnis tėvams - parodyti vaikui, kiek pinigų turi, kokia riba ir kodėl dalis lėšų keliauja į taupymą."
    : "Pirmas žingsnis vaikui - pamatyti savo balansą, tikslą ir išmokti, kad dalis pinigų skiriama ateičiai.";
  elements.walletSummary.textContent = isParent
    ? "Tėvai gali stebėti, kam leidžiami pinigai ir kokių leidimų šiuo metu laukia vaikas."
    : "Vaikas mato balansą, nes taip lengviau suprasti, kiek gali leisti ir kiek verta atsidėti.";
  elements.goalsRoleDescription.textContent = isParent
    ? "Tėvų režime galima pridėti, redaguoti ir ištrinti tikslus."
    : "Vaiko režime galima siūlyti naujus tikslus, o tėvai vėliau juos peržiūri.";
  elements.goalModePill.textContent = isParent ? "Tėvų valdymas" : "Vaiko siūlymai";
  elements.goalModePill.className = `badge-pill ${isParent ? "success" : "warning"}`;
  elements.savingsModeBadge.textContent = state.permissionRequired
    ? "Leidimai aktyvūs"
    : "Automatinis patvirtinimas";
  elements.permissionsPolicyText.textContent = state.permissionRequired
    ? "Taip, visada"
    : "Ne, leidimo nereikia";
}

function renderOverview(metrics) {
  elements.walletBalance.textContent = formatCurrency(state.walletBalance);
  elements.heroGoalName.textContent = `${metrics.goal.emoji} ${metrics.goal.title}`;
  elements.heroWeeklyLimit.textContent = formatCurrency(state.weeklyLimit);
  elements.heroLibraryCount.textContent = `${quizQuestions.length} klaus. / ${learningTips.length} patarimų`;
  elements.activeGoalName.textContent = `${metrics.goal.emoji} ${metrics.goal.title}`;
  elements.weeklyLimitPreview.textContent = formatCurrency(state.weeklyLimit);
  elements.libraryPreview.textContent = `${quizQuestions.length} klaus. / ${learningTips.length} patarimų`;
  elements.savingsBalance.textContent = formatCurrency(state.goals.reduce((sum, goal) => sum + goal.saved, 0));
  elements.savingsDelta.textContent = `+${formatCurrency(metrics.saveAmount)} per mėnesio ciklą`;
  elements.selectedGoalHeadline.textContent = `${metrics.goal.emoji} ${metrics.goal.title}`;
  elements.selectedGoalProgress.textContent = `${metrics.progress}%`;
  elements.investmentProfileBadge.textContent = getCurrentProfile().title;
  elements.investPocketAmount.textContent = formatCurrency(metrics.investAmount);
  elements.investCategoryCount.textContent = getCurrentProfile().badge;

  elements.spendAmount.textContent = formatCurrency(metrics.spendAmount);
  elements.saveAmount.textContent = formatCurrency(metrics.saveAmount);
  elements.investAmount.textContent = formatCurrency(metrics.investAmount);
  elements.spentAmount.textContent = formatCurrency(state.spentThisWeek);
  elements.remainingLimitAmount.textContent = formatCurrency(metrics.remainingLimit);

  if (metrics.overLimit) {
    elements.limitStatus.textContent = "Viršytas limitas";
    elements.limitDetail.textContent = "Tėvams siunčiamas skubus pranešimas apie per dideles išlaidas.";
  } else if (metrics.nearLimit) {
    elements.limitStatus.textContent = "Artėjama prie ribos";
    elements.limitDetail.textContent = "Sistema perspėja dar prieš viršijant savaitės ribą.";
  } else {
    elements.limitStatus.textContent = "Viskas pagal planą";
    elements.limitDetail.textContent = "Vaikas dar turi saugų rezervą iki savaitės limito.";
  }

  elements.selectedGoalTitleHome.textContent = `${metrics.goal.emoji} ${metrics.goal.title}`;
  elements.savedAmount.textContent = formatCurrency(metrics.goal.saved);
  elements.savedPercent.textContent = `${metrics.progress}%`;
  elements.parentContribution.textContent = formatCurrency(metrics.parentContribution);
  elements.progressFill.style.width = `${metrics.progress}%`;
  if (metrics.thresholdReached) {
    elements.notificationBanner.textContent = `Tikslas "${metrics.goal.title}" jau pasiekė ${metrics.progress}%, todėl tėvai gali pridėti papildomą match.`;
    elements.notificationBanner.className = "notification-banner success";
  } else {
    elements.notificationBanner.textContent = "Tėvų prisidėjimas siūlomas tik tada, kai aktyvus tikslas pasiekia 50%.";
    elements.notificationBanner.className = "notification-banner pending";
  }

  elements.expenseFeed.innerHTML = "";
  state.feed.slice(0, 3).forEach((item) => {
    const row = document.createElement("div");
    row.className = "expense-row";
    row.innerHTML = `
      <span>${item.title}</span>
      <strong>${item.tone === "danger" ? "-" : "+"}${item.time}</strong>
    `;
    elements.expenseFeed.appendChild(row);
  });

  const latestPush = state.feed[0];
  elements.pushPreviewTitle.textContent = latestPush ? latestPush.title : "Push aktyvūs";
  elements.pushPreviewText.textContent = latestPush
    ? latestPush.text
    : "Čia bus rodoma paskutinė svarbi push žinutė apie taupyklę, leidimus ar pervedimus.";
  elements.pushPreviewTime.textContent = latestPush ? latestPush.time : "Ką tik";
  elements.pushPreviewBadge.textContent = state.pushEnabled ? "Push įjungti" : "Push išjungti";
  elements.pushPreviewBadge.className = `badge-pill ${state.pushEnabled ? "success" : "warning"}`;
}

function renderGoalSelector() {
  elements.goalSelector.innerHTML = "";
  state.goals.forEach((goal) => {
    const selected = goal.id === state.selectedGoalId;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `goal-chip ${selected ? "active" : ""}`;
    button.textContent = `${goal.emoji} ${goal.title}`;
    button.addEventListener("click", () => {
      state.selectedGoalId = goal.id;
      renderAll();
    });
    elements.goalSelector.appendChild(button);
  });
}

function renderSavings(metrics) {
  elements.selectedGoalSavingsAmount.textContent = formatCurrency(metrics.goal.saved);
  elements.selectedGoalRemainingAmount.textContent = formatCurrency(metrics.remainingGoal);
  elements.permissionPolicyLabel.textContent = state.permissionRequired
    ? "Reikia tėvų leidimo"
    : "Tvirtinama automatiškai";
}

function renderRequests() {
  const pendingCount = state.requests.filter((request) => request.status === "pending").length;
  elements.permissionsCountBadge.textContent = `${pendingCount} laukia`;
  elements.requestList.innerHTML = "";

  state.requests.forEach((request) => {
    const goal = state.goals.find((item) => item.id === request.goalId);
    const isPending = request.status === "pending";
    const card = document.createElement("article");
    card.className = `request-card ${request.status}`;
    card.innerHTML = `
      <div class="request-card-top">
        <div>
          <p class="request-title">${request.type === "deposit" ? "Įdėti į taupyklę" : "Išimti iš taupyklės"}</p>
          <p class="request-meta">${goal ? `${goal.emoji} ${goal.title}` : "Tikslas nerastas"} · ${request.createdAt}</p>
        </div>
        <span class="request-status ${request.status}">${
          request.status === "pending"
            ? "Laukia"
            : request.status === "approved"
              ? "Leista"
              : "Neleista"
        }</span>
      </div>
      <p class="request-amount">${formatCurrency(request.amount)}</p>
      <p class="request-copy">${request.reason}</p>
    `;

    if (state.mode === "parent" && isPending) {
      const actionRow = document.createElement("div");
      actionRow.className = "action-row";
      const approve = document.createElement("button");
      approve.type = "button";
      approve.className = "button primary";
      approve.textContent = "Leisti";
      approve.addEventListener("click", () => {
        request.status = "approved";
        applyRequestEffect(request);
        appendFeed(
          "Prašymas patvirtintas",
          `Leista ${request.type === "deposit" ? "įdėti" : "išimti"} ${formatCurrency(request.amount)} ${
            goal ? `tikslui „${goal.title}“` : "iš taupyklės"
          }.`,
          "success",
          "Ką tik",
          true,
        );
        renderAll({ randomizePrompt: true });
        showToast("Prašymas patvirtintas.", "success");
      });

      const deny = document.createElement("button");
      deny.type = "button";
      deny.className = "button secondary";
      deny.textContent = "Neleisti";
      deny.addEventListener("click", () => {
        request.status = "denied";
        appendFeed(
          "Prašymas atmestas",
          `Neleista atlikti veiksmo su ${formatCurrency(request.amount)}.`,
          "warning",
          "Ką tik",
          true,
        );
        renderAll({ randomizePrompt: true });
        showToast("Prašymas atmestas.", "warning");
      });

      actionRow.append(approve, deny);
      card.appendChild(actionRow);
    }

    elements.requestList.appendChild(card);
  });
}

function renderTransfers() {
  elements.parentTransferGoal.innerHTML = "";
  state.goals.forEach((goal) => {
    const option = document.createElement("option");
    option.value = goal.id;
    option.textContent = `${goal.emoji} ${goal.title}`;
    elements.parentTransferGoal.appendChild(option);
  });
}

function renderLimits(metrics) {
  elements.allowanceValue.textContent = formatCurrency(state.allowance);
  elements.weeklyLimitValue.textContent = formatCurrency(state.weeklyLimit);
  elements.spentThisWeekValue.textContent = formatCurrency(state.spentThisWeek);
  elements.savePercentValue.textContent = `${state.savePercent}%`;
  elements.investPercentValue.textContent = `${state.investPercent}%`;
  elements.matchPercentValue.textContent = `${state.matchPercent}%`;
  elements.pushStatus.textContent = state.pushEnabled ? "Push aktyvūs" : "Push išjungti";
  elements.pushStatus.className = `badge-pill ${state.pushEnabled ? "success" : "warning"}`;

  elements.notificationList.innerHTML = "";
  const notices = [];
  if (metrics.overLimit) {
    notices.push({
      tone: "danger",
      title: "Skubus įspėjimas",
      text: `Vaikas viršijo savaitės limitą ${formatCurrency(state.weeklyLimit)}.`,
    });
  } else if (metrics.nearLimit) {
    notices.push({
      tone: "warning",
      title: "Ankstyvas perspėjimas",
      text: `Iki limito liko tik ${formatCurrency(metrics.remainingLimit)}.`,
    });
  } else {
    notices.push({
      tone: "success",
      title: "Viskas kontroliuojama",
      text: `Savaitės riboje dar liko ${formatCurrency(metrics.remainingLimit)}.`,
    });
  }

  if (state.requests.some((request) => request.status === "pending")) {
    notices.push({
      tone: "warning",
      title: "Laukia leidimo",
      text: "Yra bent vienas vaiko prašymas, kurį tėvai turi patvirtinti arba atmesti.",
    });
  }

  notices.push({
    tone: state.pushEnabled ? "info" : "warning",
    title: state.pushEnabled ? "Push žinutės aktyvios" : "Push žinutės išjungtos",
    text: state.pushEnabled
      ? "Tėvams būtų siunčiami pranešimai apie leidimus, taupyklės pakeitimus ir limitus."
      : "Pranešimai rodomi tik programėlės viduje, kol push išjungti.",
  });

  notices.forEach((item) => {
    const node = document.createElement("li");
    node.className = `notification-item ${item.tone}`;
    node.innerHTML = `<strong>${item.title}</strong><span>${item.text}</span>`;
    elements.notificationList.appendChild(node);
  });

  const rules = [
    `Iš mėnesio sumos ${state.savePercent}% keliauja į taupymą, o ${state.investPercent}% į investavimo kišenę.`,
    state.permissionRequired
      ? "Vaiko taupyklės veiksmai pirmiausia keliauja į leidimų skiltį."
      : "Vaiko taupyklės veiksmai patvirtinami iškart be papildomo leidimo.",
    metrics.thresholdReached
      ? `Aktyvus tikslas jau pasiekė ${metrics.progress}%, todėl tėvų match gali būti aktyvuotas.`
      : "Tėvų match aktyvuosis tik tada, kai aktyvus tikslas pasieks bent 50%.",
  ];

  elements.rulesList.innerHTML = "";
  rules.forEach((rule) => {
    const item = document.createElement("li");
    item.textContent = rule;
    elements.rulesList.appendChild(item);
  });
}

function renderInvesting(metrics) {
  const profile = getCurrentProfile();
  elements.investmentProfileTitle.textContent = `${profile.title} profilis`;
  elements.investmentProfileStatus.textContent = profile.badge;
  elements.investmentGrid.innerHTML = "";

  profile.categories.forEach((category) => {
    const card = document.createElement("article");
    card.className = "investment-card";
    card.innerHTML = `
      <div class="investment-card-header">
        <h4>${category.name}</h4>
        <span>${category.share}</span>
      </div>
      <p class="investment-risk">${category.risk}</p>
      <p class="investment-description">${category.description}</p>
      <p class="investment-pocket">Iš šio mėnesio investavimo kišenės: ${formatCurrency(
        (metrics.investAmount * Number(category.share.replace("%", ""))) / 100,
      )}</p>
    `;
    elements.investmentGrid.appendChild(card);
  });
}

function renderLearning() {
  const tip = learningTips[state.learningIndex];
  elements.learningCounter.textContent = `${state.learningIndex + 1} / ${learningTips.length}`;
  elements.learningTag.textContent = `Tema: ${tip.tag}`;
  elements.learningTitle.textContent = tip.title;
  elements.learningText.textContent = tip.text;
  elements.learningMeta.textContent =
    "Trumpi tekstai skirti skaitymui telefone, kad mokymasis būtų greitas ir nuoseklus.";
  elements.learningPreviewList.innerHTML = "";

  for (let offset = 1; offset <= 4; offset += 1) {
    const item = learningTips[(state.learningIndex + offset) % learningTips.length];
    const node = document.createElement("div");
    node.className = "preview-item";
    node.innerHTML = `<strong>${item.title}</strong><span>${item.tag}</span>`;
    elements.learningPreviewList.appendChild(node);
  }
}

function renderQuiz() {
  const item = quizQuestions[state.quizIndex];
  elements.quizCounter.textContent = `${state.quizIndex + 1} / ${quizQuestions.length}`;
  elements.quizHelper.textContent = item.helper;
  elements.quizQuestion.textContent = item.question;
  elements.quizRoleNote.textContent = `Dabartinis režimas: ${state.mode === "parent" ? "tėvai" : "vaikas"}.`;
  elements.quizFeedback.textContent = "";
  elements.quizFeedback.className = "quiz-feedback";
  elements.quizOptions.innerHTML = "";

  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.textContent = option;
    button.addEventListener("click", () => {
      const correct = index === item.correctIndex;
      Array.from(elements.quizOptions.children).forEach((candidate, candidateIndex) => {
        candidate.classList.remove("correct", "wrong");
        if (candidateIndex === item.correctIndex) {
          candidate.classList.add("correct");
        } else if (candidateIndex === index && !correct) {
          candidate.classList.add("wrong");
        }
      });
      elements.quizFeedback.textContent = correct
        ? item.feedback
        : "Dar ne visai. Pagalvok apie planavimą, limitus, leidimus ir atsakingą finansinį sprendimą.";
      elements.quizFeedback.className = `quiz-feedback ${correct ? "success" : "error"}`;
    });
    elements.quizOptions.appendChild(button);
  });
}

function renderFeed() {
  elements.feedBadge.textContent = `${state.feed.length} įvykiai`;
  elements.notificationsFeed.innerHTML = "";
  state.feed.forEach((item) => {
    const node = document.createElement("article");
    node.className = `feed-item ${item.tone}`;
    node.innerHTML = `
      <div class="feed-top">
        <strong>${item.title}</strong>
        <span>${item.time}</span>
      </div>
      <p>${item.text}</p>
    `;
    elements.notificationsFeed.appendChild(node);
  });
}

function renderGoalManagement(metrics) {
  elements.goalCountLabel.textContent = `${state.goals.length} tikslai`;
  elements.goalList.innerHTML = "";
  state.goals.forEach((goal) => {
    const selected = goal.id === state.selectedGoalId;
    const progress = getGoalProgress(goal);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `goal-list-item ${selected ? "active" : ""}`;
    button.innerHTML = `
      <div>
        <strong>${goal.emoji} ${goal.title}</strong>
        <span>${goal.author === "child" ? "Vaiko tikslas" : "Tėvų tikslas"}</span>
      </div>
      <div>
        <strong>${progress}%</strong>
        <span>${formatCurrency(goal.target)}</span>
      </div>
    `;
    button.addEventListener("click", () => {
      state.selectedGoalId = goal.id;
      renderAll();
    });
    elements.goalList.appendChild(button);
  });

  elements.goalDetailTitle.textContent = `${metrics.goal.emoji} ${metrics.goal.title}`;
  elements.goalCreatorPill.textContent = metrics.goal.author === "child" ? "Sukūrė vaikas" : "Sukūrė tėvai";
  elements.goalCreatorPill.className = `badge-pill ${metrics.goal.author === "child" ? "warning" : "success"}`;
  elements.goalDetailCopy.textContent = metrics.goal.author === "child"
    ? "Tai vaiko iškeltas tikslas. Tėvai gali jį pakoreguoti, palaikyti arba ištrinti."
    : "Tai tėvų sukurtas tikslas, kurį galima laisvai valdyti ir pildyti.";
  elements.goalDetailProgress.style.width = `${metrics.progress}%`;
  elements.goalTargetAmount.textContent = formatCurrency(metrics.goal.target);
  elements.goalSavedAmount.textContent = formatCurrency(metrics.goal.saved);
  elements.goalRemainingAmount.textContent = formatCurrency(metrics.remainingGoal);
  elements.goalProgressPercent.textContent = `${metrics.progress}%`;

  elements.parentGoalTitle.value = metrics.goal.title;
  elements.parentGoalEmoji.value = metrics.goal.emoji;
  elements.parentGoalTarget.value = String(metrics.goal.target);
  elements.parentGoalSaved.value = String(metrics.goal.saved);

  const isParent = state.mode === "parent";
  elements.parentGoalForm.hidden = !isParent;
  elements.childGoalForm.hidden = isParent;
}

function renderAll(options = {}) {
  if (state.mode !== "parent" && isParentTab(state.activeTab)) {
    state.activeTab = "feed";
  }
  const metrics = getMetrics();
  renderTabs();
  renderRoleState(metrics);
  renderAssistant(metrics, Boolean(options.randomizePrompt));
  renderOverview(metrics);
  renderGoalSelector();
  renderSavings(metrics);
  renderRequests();
  renderTransfers();
  renderLimits(metrics);
  renderInvesting(metrics);
  renderLearning();
  renderQuiz();
  renderFeed();
  renderGoalManagement(metrics);
}

function applyRequestEffect(request) {
  const goal = state.goals.find((item) => item.id === request.goalId);
  if (!goal) {
    return;
  }
  if (request.type === "deposit") {
    goal.saved += request.amount;
    state.walletBalance = Math.max(0, state.walletBalance - request.amount);
  } else {
    goal.saved = Math.max(0, goal.saved - request.amount);
    state.walletBalance += request.amount;
  }
}

function createRequest(type, amount, reason) {
  const request = {
    id: `request-${Date.now()}-${Math.random()}`,
    type,
    amount,
    goalId: state.selectedGoalId,
    reason,
    status: state.permissionRequired ? "pending" : "approved",
    createdBy: "child",
    createdAt: "Ką tik",
  };
  state.requests.unshift(request);

  if (state.permissionRequired) {
    appendFeed(
      "Naujas leidimo prašymas",
      `Vaikas pateikė prašymą ${type === "deposit" ? "įdėti" : "išimti"} ${formatCurrency(amount)}.`,
      "warning",
      "Ką tik",
      true,
    );
  } else {
    applyRequestEffect(request);
    appendFeed(
      type === "deposit" ? "Papildyta taupyklė" : "Pinigai išimti iš taupyklės",
      `Automatiškai atliktas vaiko veiksmas: ${type === "deposit" ? "įdėta" : "išimta"} ${formatCurrency(
        amount,
      )}.`,
      "success",
      "Ką tik",
      true,
    );
  }
}

function attachControl(input, key) {
  input.addEventListener("input", (event) => {
    if (state.mode !== "parent") {
      return;
    }
    state[key] = Number(event.target.value);
    renderAll();
  });
}

elements.roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openAuth(button.dataset.roleTarget);
    elements.profileMenu.hidden = true;
  });
});

elements.profileFab.addEventListener("click", () => {
  if (authSession.open) {
    return;
  }
  const isHidden = elements.profileMenu.hidden;
  elements.profileMenu.hidden = !isHidden;
  elements.profileFab.setAttribute("aria-expanded", String(isHidden));
});

elements.tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.activeTab = button.dataset.tabTarget;
    introDismissedForTab = "";
    renderTabs();
  });
});

elements.closeSectionGuide.addEventListener("click", () => {
  introDismissedForTab = state.activeTab;
  renderTabIntro();
});

elements.authRoleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    authSession.role = button.dataset.authRole;
    authSession.activeField = "pin";
    elements.authPin.value = "";
    elements.authPinConfirm.value = "";
    renderAuth();
  });
});

elements.authPinSlots.addEventListener("click", () => {
  authSession.activeField = "pin";
  renderAuth();
});

elements.authPinConfirmSlots.addEventListener("click", () => {
  authSession.activeField = "confirm";
  renderAuth();
});

elements.authPin.addEventListener("input", () => {
  updateAuthValue("pin", elements.authPin.value);
});

elements.authPinConfirm.addEventListener("input", () => {
  updateAuthValue("confirm", elements.authPinConfirm.value);
});

Array.from(document.querySelectorAll("[data-keypad-value]")).forEach((button) => {
  button.addEventListener("click", () => {
    appendDigitToActivePin(button.dataset.keypadValue);
  });
});

Array.from(document.querySelectorAll("[data-keypad-action]")).forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.keypadAction === "clear") {
      clearActivePin();
    } else {
      backspaceActivePin();
    }
  });
});

elements.authPrimaryButton.addEventListener("click", () => {
  const mode = getAuthMode();
  const pin = elements.authPin.value.trim();

  if (!/^\d{4}$/.test(pin)) {
    elements.authStatus.textContent = "PIN kodas turi būti tiksliai 4 skaitmenų.";
    return;
  }

  if (mode === "register") {
    const confirmation = elements.authPinConfirm.value.trim();
    if (pin !== confirmation) {
      elements.authStatus.textContent = "PIN kodai nesutampa. Pabandyk dar kartą.";
      return;
    }

    authStore.pins[authSession.role] = pin;
    saveAuthStore();
    completeAuth(authSession.role, "PIN sukurtas ir prisijungimas sėkmingas.");
    return;
  }

  if (authStore.pins[authSession.role] !== pin) {
    elements.authStatus.textContent = "Neteisingas PIN kodas. Pabandyk dar kartą.";
    return;
  }

  completeAuth(authSession.role, "Prisijungimas su PIN sėkmingas.");
});

elements.authFingerprintButton.addEventListener("click", () => {
  if (!authStore.pins[authSession.role]) {
    elements.authStatus.textContent = "Pirmiausia susikurk PIN kodą šiai rolei.";
    return;
  }

  if (!authSession.biometricAvailable) {
    elements.authStatus.textContent = authSession.biometricReason;
    return;
  }

  const plugin = getBiometricPlugin();
  if (!plugin || typeof plugin.authenticate !== "function") {
    elements.authStatus.textContent = "Biometrinis prisijungimas neprieinamas šiame režime.";
    return;
  }

  authSession.biometricScanning = true;
  elements.authStatus.textContent = "Laukiama biometrinio patvirtinimo...";
  renderAuth();

  plugin
    .authenticate({
      title: "KidFund prisijungimas",
      subtitle: authSession.role === "parent" ? "Patvirtinkite tėvų prisijungimą" : "Patvirtinkite vaiko prisijungimą",
      description: "Patvirtinkite savo tapatybę biometriniu būdu",
      cancelTitle: "Atšaukti",
    })
    .then(() => {
      authSession.biometricScanning = false;
      completeAuth(authSession.role, "Biometrinis prisijungimas sėkmingas.");
    })
    .catch((error) => {
      authSession.biometricScanning = false;
      elements.authStatus.textContent = error?.message || "Biometrinis prisijungimas nepavyko.";
      renderAuth();
    });
});

elements.authResetPin.addEventListener("click", () => {
  authStore.pins[authSession.role] = "";
  saveAuthStore();
  elements.authPin.value = "";
  elements.authPinConfirm.value = "";
  renderAuth();
  elements.authStatus.textContent = "Senas PIN pašalintas. Gali registruoti naują.";
});

elements.profileButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (state.mode !== "parent") {
      return;
    }
    state.profile = button.dataset.profile;
    renderAll({ randomizePrompt: true });
    showToast(`Pasirinktas ${getCurrentProfile().title.toLowerCase()} profilis.`, "success");
  });
});

elements.nextPrompt.addEventListener("click", () => {
  renderAll({ randomizePrompt: true });
  restartPromptRotation();
});

elements.enablePush.addEventListener("click", () => {
  if (state.mode !== "parent") {
    return;
  }
  state.pushEnabled = !state.pushEnabled;
  appendFeed(
    state.pushEnabled ? "Push įjungti" : "Push išjungti",
    state.pushEnabled
      ? "Tėvai vėl gaus pranešimus apie taupyklę ir leidimus."
      : "Push pranešimai išjungti - informacija lieka tik programėlėje.",
    state.pushEnabled ? "success" : "warning",
    "Ką tik",
  );
  renderAll({ randomizePrompt: true });
});

attachControl(elements.allowance, "allowance");
attachControl(elements.weeklyLimit, "weeklyLimit");
attachControl(elements.spentThisWeek, "spentThisWeek");
attachControl(elements.savePercent, "savePercent");
attachControl(elements.investPercent, "investPercent");
attachControl(elements.matchPercent, "matchPercent");

elements.childSavingsRequestForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const amount = Number(elements.requestAmount.value);
  const reason = elements.requestReason.value.trim() || "Vaiko prašymas";
  if (amount <= 0) {
    showToast("Įvesk teigiamą sumą prašymui.", "warning");
    return;
  }
  createRequest(elements.requestType.value, amount, reason);
  elements.childSavingsRequestForm.reset();
  renderAll({ randomizePrompt: true });
  showToast(
    state.permissionRequired ? "Prašymas išsiųstas tėvams." : "Veiksmas atliktas iškart.",
    state.permissionRequired ? "warning" : "success",
  );
});

elements.childQuickSave.addEventListener("click", () => {
  createRequest("deposit", 5, "Greitas vaiko papildymas taupyklei");
  renderAll({ randomizePrompt: true });
  showToast(
    state.permissionRequired ? "Greitas prašymas pateiktas." : "5 EUR perkelta į taupyklę.",
    state.permissionRequired ? "warning" : "success",
  );
});

elements.parentAddToSavings.addEventListener("click", () => {
  const goal = getSelectedGoal();
  goal.saved += 10;
  appendFeed("Tėvai papildė taupyklę", `Į tikslą „${goal.title}“ pridėta 10 EUR.`, "success", "Ką tik", true);
  renderAll();
  showToast("10 EUR pridėta į taupyklę.", "success");
});

elements.parentWithdrawFromSavings.addEventListener("click", () => {
  const goal = getSelectedGoal();
  goal.saved = Math.max(0, goal.saved - 10);
  appendFeed("Tėvai nuėmė iš taupyklės", `Iš tikslo „${goal.title}“ nuimta 10 EUR.`, "warning", "Ką tik", true);
  renderAll();
  showToast("10 EUR nuimta iš taupyklės.", "warning");
});

elements.togglePermissionPolicy.addEventListener("click", () => {
  if (state.mode !== "parent") {
    return;
  }
  state.permissionRequired = !state.permissionRequired;
  appendFeed(
    "Pakeista leidimų politika",
    state.permissionRequired
      ? "Vaiko taupyklės veiksmai vėl reikalauja tėvų patvirtinimo."
      : "Vaiko taupyklės veiksmai dabar gali būti patvirtinami automatiškai.",
    state.permissionRequired ? "warning" : "success",
    "Ką tik",
    true,
  );
  renderAll();
});

elements.parentTransferForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (state.mode !== "parent") {
    return;
  }

  const type = elements.parentTransferType.value;
  const amount = Number(elements.parentTransferAmount.value);
  const goalId = elements.parentTransferGoal.value;
  const note = elements.parentTransferNote.value.trim() || "Tėvų pervedimas";
  const goal = state.goals.find((item) => item.id === goalId);

  if (amount <= 0) {
    showToast("Įvesk teigiamą pervedimo sumą.", "warning");
    return;
  }

  if (type === "wallet") {
    state.walletBalance += amount;
    appendFeed("Papildyta vaiko piniginė", `${formatCurrency(amount)} pervesta į vaiko piniginę. ${note}`, "success", "Ką tik", true);
  } else if (type === "savings" && goal) {
    goal.saved += amount;
    appendFeed("Papildyta taupyklė", `${formatCurrency(amount)} įdėta į tikslą „${goal.title}“. ${note}`, "success", "Ką tik", true);
  } else if (type === "bonus" && goal) {
    goal.saved += amount;
    appendFeed("Skirta premija", `${formatCurrency(amount)} pridėta kaip papildomas paskatinimas tikslui „${goal.title}“.`, "success", "Ką tik", true);
  }

  elements.parentTransferForm.reset();
  renderAll();
  showToast("Tėvų veiksmas įvykdytas.", "success");
});

elements.addWeeklyAllowance.addEventListener("click", () => {
  if (state.mode !== "parent") {
    return;
  }
  state.walletBalance += 20;
  appendFeed("Savaitės kišenpinigiai", "Tėvai pervedė 20 EUR į vaiko piniginę.", "success", "Ką tik", true);
  renderAll();
  showToast("Pridėta 20 EUR kišenpinigių.", "success");
});

elements.parentGoalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (state.mode !== "parent") {
    return;
  }

  const goal = getSelectedGoal();
  const title = elements.parentGoalTitle.value.trim();
  const emoji = elements.parentGoalEmoji.value.trim() || "🎯";
  const target = Number(elements.parentGoalTarget.value);
  const saved = Number(elements.parentGoalSaved.value);

  if (!title || target <= 0) {
    showToast("Užpildyk tikslo pavadinimą ir teisingą tikslinę sumą.", "warning");
    return;
  }

  goal.title = title;
  goal.emoji = emoji;
  goal.target = target;
  goal.saved = Math.max(0, saved);
  appendFeed("Tikslas atnaujintas", `Tėvai pakoregavo tikslą „${goal.title}“.`, "info", "Ką tik");
  renderAll();
  showToast("Tikslas atnaujintas.", "success");
});

elements.addParentGoalButton.addEventListener("click", () => {
  if (state.mode !== "parent") {
    return;
  }
  const nextId = `goal-parent-${Date.now()}`;
  state.goals.unshift({
    id: nextId,
    title: "Naujas tėvų tikslas",
    emoji: "🎯",
    target: 150,
    saved: 0,
    author: "parent",
  });
  state.selectedGoalId = nextId;
  appendFeed("Pridėtas tikslas", "Tėvai sukūrė naują taupymo tikslą.", "success", "Ką tik");
  renderAll();
  showToast("Pridėtas naujas tėvų tikslas.", "success");
});

elements.deleteGoalButton.addEventListener("click", () => {
  if (state.mode !== "parent") {
    return;
  }
  if (state.goals.length <= 1) {
    showToast("Reikia palikti bent vieną tikslą.", "warning");
    return;
  }

  const goal = getSelectedGoal();
  state.goals = state.goals.filter((item) => item.id !== goal.id);
  state.selectedGoalId = state.goals[0].id;
  appendFeed("Tikslas ištrintas", `Tėvai ištrynė tikslą „${goal.title}“.`, "warning", "Ką tik");
  renderAll();
  showToast("Tikslas ištrintas.", "warning");
});

elements.childGoalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (state.mode !== "child") {
    return;
  }

  const title = elements.childGoalTitle.value.trim();
  const emoji = elements.childGoalEmoji.value.trim() || "🌟";
  const target = Number(elements.childGoalTarget.value);

  if (!title || target <= 0) {
    showToast("Įrašyk tikslą ir teigiamą sumą.", "warning");
    return;
  }

  const nextId = `goal-child-${Date.now()}`;
  state.goals.unshift({
    id: nextId,
    title,
    emoji,
    target,
    saved: 0,
    author: "child",
  });
  state.selectedGoalId = nextId;
  elements.childGoalForm.reset();
  appendFeed("Naujas vaiko tikslas", `Vaikas sukūrė tikslą „${title}“.`, "info", "Ką tik");
  renderAll();
  showToast("Vaiko tikslas sukurtas.", "success");
});

elements.nextLearningTip.addEventListener("click", () => {
  state.learningIndex = (state.learningIndex + 1) % learningTips.length;
  renderLearning();
});

elements.randomLearningTip.addEventListener("click", () => {
  state.learningIndex = Math.floor(Math.random() * learningTips.length);
  renderLearning();
});

elements.nextQuestion.addEventListener("click", () => {
  state.quizIndex = (state.quizIndex + 1) % quizQuestions.length;
  renderQuiz();
});

elements.randomQuestion.addEventListener("click", () => {
  state.quizIndex = Math.floor(Math.random() * quizQuestions.length);
  renderQuiz();
});

renderAll();
restartPromptRotation();
openAuth(state.mode);
refreshBiometricAvailability();
