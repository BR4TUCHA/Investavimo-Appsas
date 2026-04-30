const MATCH_THRESHOLD = 50;
const PROMPT_ROTATION_MS = 8000;

const state = {
  mode: "parent",
  activeTab: "home",
  allowance: 70,
  weeklyLimit: 28,
  spentThisWeek: 22,
  savePercent: 30,
  investPercent: 20,
  matchPercent: 50,
  profile: "balanced",
  pushEnabled: true,
  promptIndex: 0,
  quizIndex: 0,
  learningIndex: 0,
  goals: [
    {
      id: "goal-bike",
      title: "Dviratis",
      emoji: "🚲",
      amount: 180,
      progress: 44,
      author: "child",
    },
    {
      id: "goal-console",
      title: "Žaidimų konsolė",
      emoji: "🎮",
      amount: 250,
      progress: 20,
      author: "parent",
    },
    {
      id: "goal-camp",
      title: "Vasaros stovykla",
      emoji: "⛺",
      amount: 140,
      progress: 62,
      author: "parent",
    },
  ],
  selectedGoalId: "goal-bike",
};

const investmentProfiles = {
  safe: {
    title: "Saugus profilis",
    status: "Mažesnė rizika",
    categories: [
      {
        name: "Pinigų rinka",
        share: "40%",
        risk: "Labai žema rizika",
        description: "Padeda paaiškinti, kad dalis pinigų gali būti laikoma ramiau ir saugiau.",
      },
      {
        name: "Obligacijų fondai",
        share: "35%",
        risk: "Žema rizika",
        description: "Tinka aiškinti stabilesnio augimo idėją ir mažesnius svyravimus.",
      },
      {
        name: "Taupymo rezervas",
        share: "25%",
        risk: "Apsauga",
        description: "Primena, kad ne visi pinigai turi būti investuojami - dalis gali likti rezervui.",
      },
    ],
  },
  balanced: {
    title: "Subalansuotas profilis",
    status: "3 kryptys",
    categories: [
      {
        name: "ETF fondai",
        share: "45%",
        risk: "Žema - vidutinė rizika",
        description: "Padeda suprasti, kodėl vienas krepšelis gali būti saugesnis už vieną akciją.",
      },
      {
        name: "Technologijos",
        share: "30%",
        risk: "Vidutinė rizika",
        description: "Parodo, kad augimo sritys gali svyruoti, bet yra įdomios mokymuisi.",
      },
      {
        name: "Žalioji energija",
        share: "25%",
        risk: "Vidutinė rizika",
        description: "Susieja investavimą su vaikui suprantamomis temomis apie ateitį ir aplinką.",
      },
    ],
  },
  growth: {
    title: "Augimo profilis",
    status: "Didesnis potencialas",
    categories: [
      {
        name: "Technologijų augimas",
        share: "40%",
        risk: "Padidėjusi rizika",
        description: "Tinka aiškinti, kad didesnis augimo potencialas reiškia ir daugiau svyravimo.",
      },
      {
        name: "AI ir robotika",
        share: "35%",
        risk: "Aukštesnė rizika",
        description: "Moko apie ateities sektorius ir tai, kad naujos sritys nėra garantija.",
      },
      {
        name: "Ateities miestai",
        share: "25%",
        risk: "Vidutinė - aukštesnė rizika",
        description: "Padeda vaikui suprasti temines investavimo kryptis ir ilgalaikį mąstymą.",
      },
    ],
  },
};

function buildQuizBank() {
  const topics = [
    {
      name: "taupymo įprotį",
      helper: "Pagalvok apie veiksmą, kuris padeda nuolat artėti prie tikslo.",
      correct: "Pirmiausia atsidėti dalį pinigų tikslui",
      wrongA: "Viską išleisti tą pačią dieną",
      wrongB: "Spręsti tik tada, kai pinigų beveik nelieka",
      feedback: "Teisingai - pastovus atsidėjimas kuria stiprų taupymo įprotį.",
    },
    {
      name: "savaitės limitą",
      helper: "Atsakymas susijęs su planavimu ir savikontrole.",
      correct: "Ribą, kuri padeda neišleisti per daug per savaitę",
      wrongA: "Būdą išleisti daugiau nei planuota",
      wrongB: "Slaptą papildomą mokestį",
      feedback: "Teisingai - limitas padeda valdyti biudžetą ir planuoti išlaidas.",
    },
    {
      name: "investavimo riziką",
      helper: "Pagalvok, kas nutinka investicijų vertei laikui bėgant.",
      correct: "Kad vertė gali ir kilti, ir kristi",
      wrongA: "Kad grąža visada garantuota",
      wrongB: "Kad tėvai visada padengs nuostolius",
      feedback: "Teisingai - investavimas reiškia svyravimą, todėl reikia atsargumo.",
    },
    {
      name: "ETF fondus",
      helper: "Čia svarbi krepšelio ir diversifikacijos idėja.",
      correct: "Krepšelį, kuriame yra daugiau nei viena investicija",
      wrongA: "Vieną pavienę akciją",
      wrongB: "Taupyklę be jokios rizikos",
      feedback: "Teisingai - ETF leidžia paskirstyti riziką per daugiau nei vieną kryptį.",
    },
    {
      name: "tikslų planavimą",
      helper: "Atsakymas turi turėti sumą, kryptį ir progresą.",
      correct: "Aiškų norą susieti su suma ir žingsniais",
      wrongA: "Tiesiog norėti kažko be plano",
      wrongB: "Keisti tikslą kasdien be priežasties",
      feedback: "Teisingai - tikslas tampa realesnis, kai turi aiškią sumą ir progresą.",
    },
  ];

  const questionFrames = [
    "Kas geriausiai apibūdina",
    "Kurį atsakymą pasirinktum, jei reikėtų paaiškinti",
    "Kuris teiginys tiksliausiai nusako",
    "Ką svarbiausia suprasti apie",
    "Kaip trumpai paaiškintum",
    "Kurį variantą verta prisiminti kalbant apie",
  ];

  const helperAddons = [
    "Atsakymas susijęs su ilgalaikiu įpročiu.",
    "Pagalvok, kas padeda priimti saugesnį sprendimą.",
    "Čia svarbu planavimas, o ne impulsyvus veiksmas.",
    "Ieškok atsakymo, kuris kuria gerą finansinį įprotį.",
    "Pagalvok, kas padeda vaikui jaustis labiau pasiruošus.",
  ];

  const followUps = [
    "Šis klausimas padeda atskirti impulsyvų pasirinkimą nuo protingo sprendimo.",
    "Taip vaikas geriau supranta, kodėl biudžetas turi ribas.",
    "Tai viena svarbiausių minčių pradedant mokytis apie pinigus.",
    "Tokie klausimai ugdo ne tik žinias, bet ir finansinę savikontrolę.",
    "Būtent tokios mažos sąvokos ilgainiui kuria stiprų pinigų supratimą.",
  ];

  const bank = [];
  for (let index = 0; index < 120; index += 1) {
    const topic = topics[index % topics.length];
    const frame = questionFrames[index % questionFrames.length];
    const helperAddon = helperAddons[index % helperAddons.length];
    const followUp = followUps[index % followUps.length];
    bank.push({
      question: `Klausimas ${index + 1}. ${frame} ${topic.name}?`,
      helper: `${topic.helper} ${helperAddon}`,
      options: [topic.wrongA, topic.correct, topic.wrongB],
      correctIndex: 1,
      feedback: `${topic.feedback} ${followUp}`,
    });
  }
  return bank;
}

function buildLearningTips() {
  const themes = [
    {
      title: "Kaip veikia savaitės limitas?",
      tag: "Limitai",
      text: "Savaitės limitas padeda neperdeginti visų pinigų per kelias dienas ir išmoko planuoti iš anksto.",
    },
    {
      title: "Kodėl verta turėti tikslą?",
      tag: "Tikslai",
      text: "Tikslas padeda vaikui suprasti, kam verta atsidėti pinigus ir kaip progresas virsta motyvacija.",
    },
    {
      title: "Kuo skiriasi taupymas ir investavimas?",
      tag: "Pagrindai",
      text: "Taupymas dažniau skirtas saugumui ir artimesniam pirkiniui, o investavimas - ilgesniam laikotarpiui.",
    },
    {
      title: "Kas yra diversifikacija?",
      tag: "Investavimas",
      text: "Diversifikacija reiškia, kad pinigai paskirstomi per daugiau nei vieną kryptį, o ne dedami į vieną vietą.",
    },
    {
      title: "Kodėl tėvų kontrolė naudinga?",
      tag: "Tėvai",
      text: "Ji padeda vaikui mokytis saugioje aplinkoje ir palaipsniui geriau suprasti finansinius sprendimus.",
    },
  ];

  const openingLines = [
    "Trumpa mintis šiandienai:",
    "Mažas finansinis priminimas:",
    "Pamoka vienu sakiniu:",
    "Svarbi mintis prieš kitą sprendimą:",
    "Štai ką verta aptarti kartu:",
  ];

  const closingLines = [
    "Pabandyk šią mintį susieti su savo dabartiniu tikslu.",
    "Tokias temas geriausia aptarti prieš leidžiant pinigus.",
    "Kuo dažniau vaikas girdi tokius paaiškinimus, tuo lengviau formuojasi įprotis.",
    "Šita idėja padeda ne tik taupyti, bet ir geriau suprasti investavimą.",
    "Net trumpas pokalbis apie šį principą gali labai pakeisti sprendimų kokybę.",
  ];

  const entries = [];
  for (let index = 0; index < 120; index += 1) {
    const theme = themes[index % themes.length];
    const opening = openingLines[index % openingLines.length];
    const closing = closingLines[index % closingLines.length];
    entries.push({
      title: `${theme.title} #${index + 1}`,
      tag: theme.tag,
      text: `${opening} ${theme.text} ${closing}`,
    });
  }
  return entries;
}

const tabIntros = {
  home: {
    title: "Sveikas atvykęs į pradžios skiltį",
    text: "Čia matai greitą santrauką: aktyvų tikslą, limitų būseną ir bendrą pinigų paskirstymą.",
  },
  goals: {
    title: "Čia gyvena tikslai",
    text: "Vaikas gali sukurti naują tikslą, o tėvai jį peržiūri, koreguoja arba ištrina, jei reikia.",
  },
  limits: {
    title: "Limitų skiltis padeda kontroliuoti tempą",
    text: "Šioje vietoje aiškiai matosi savaitės limitas, išleista suma ir perspėjimai, jei artėjama prie ribos.",
  },
  invest: {
    title: "Investavimo skiltis skirta supratimui",
    text: "Čia rodoma, kaip investavimo kišenė paskirstoma tarp skirtingų kategorijų ir kokia jų rizika.",
  },
  learn: {
    title: "Mokymosi skiltyje yra daug skaitymo",
    text: "Čia sudėta daugiau nei 100 trumpų patarimų, kad kiekvieną kartą vaikas rastų naują finansinio raštingumo mintį.",
  },
  quiz: {
    title: "Viktorinos skiltis skirta praktikai",
    text: "Čia vaikas gali nuolat tikrinti, kaip supranta taupymo, limitų ir investavimo pagrindus.",
  },
};

const quizQuestions = buildQuizBank();
const learningTips = buildLearningTips();

const elements = {
  roleButtons: Array.from(document.querySelectorAll("[data-role-target]")),
  tabButtons: Array.from(document.querySelectorAll("[data-tab-target]")),
  tabPanels: Array.from(document.querySelectorAll("[data-tab-panel]")),
  parentControls: Array.from(document.querySelectorAll("[data-parent-control]")),
  profileButtons: Array.from(document.querySelectorAll("[data-profile]")),
  roleFab: document.querySelector("#roleFab"),
  roleMenu: document.querySelector("#roleFabMenu"),
  roleFabLabel: document.querySelector("#roleFabLabel"),
  tabIntroCard: document.querySelector("#sectionGuide"),
  tabIntroTitle: document.querySelector("#sectionGuideTitle"),
  tabIntroText: document.querySelector("#sectionGuideText"),
  closeTabIntro: document.querySelector("#closeSectionGuide"),
  roleCaption: document.querySelector("#roleCaption"),
  roleDescription: document.querySelector("#roleDescription"),
  heroCopy: document.querySelector("#heroCopy"),
  heroGoalName: document.querySelector("#heroGoalName"),
  heroWeeklyLimit: document.querySelector("#heroWeeklyLimit"),
  heroLibraryCount: document.querySelector("#heroLibraryCount"),
  assistantMessage: document.querySelector("#assistantMessage"),
  assistantTags: document.querySelector("#assistantTags"),
  nextPrompt: document.querySelector("#nextPrompt"),
  enablePush: document.querySelector("#enablePush"),
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
  goalsRoleDescription: document.querySelector("#goalsRoleDescription"),
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
  parentGoalForm: document.querySelector("#parentGoalForm"),
  parentGoalTitle: document.querySelector("#parentGoalTitle"),
  parentGoalEmoji: document.querySelector("#parentGoalEmoji"),
  parentGoalTarget: document.querySelector("#parentGoalTarget"),
  parentGoalSaved: document.querySelector("#parentGoalSaved"),
  saveGoalButton: document.querySelector("#saveGoalButton"),
  addParentGoalButton: document.querySelector("#addParentGoalButton"),
  deleteGoalButton: document.querySelector("#deleteGoalButton"),
  childGoalForm: document.querySelector("#childGoalForm"),
  childGoalTitle: document.querySelector("#childGoalTitle"),
  childGoalEmoji: document.querySelector("#childGoalEmoji"),
  childGoalTarget: document.querySelector("#childGoalTarget"),
  createChildGoalButton: document.querySelector("#createChildGoalButton"),
  limitsModeCopy: document.querySelector("#limitsModeCopy"),
  controlModeBanner: document.querySelector("#controlModeBanner"),
  allowance: document.querySelector("#allowance"),
  weeklyLimit: document.querySelector("#weeklyLimit"),
  spentThisWeek: document.querySelector("#spentThisWeek"),
  savePercentInput: document.querySelector("#savePercent"),
  investPercentInput: document.querySelector("#investPercent"),
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
  investmentProfileTitle: document.querySelector("#investmentProfileTitle"),
  investmentProfileStatus: document.querySelector("#investmentProfileStatus"),
  investmentGrid: document.querySelector("#investmentGrid"),
  learningLibraryMeta: document.querySelector("#learningLibraryMeta"),
  learningTitle: document.querySelector("#learningTitle"),
  learningCounter: document.querySelector("#learningCounter"),
  learningTopic: document.querySelector("#learningTopic"),
  learningText: document.querySelector("#learningText"),
  learningMeta: document.querySelector("#learningMeta"),
  nextLearningTip: document.querySelector("#nextLearningTip"),
  randomLearningTip: document.querySelector("#randomLearningTip"),
  learningPreviewList: document.querySelector("#learningPreviewList"),
  quizLibraryMeta: document.querySelector("#quizLibraryMeta"),
  quizQuestion: document.querySelector("#quizQuestion"),
  quizCounter: document.querySelector("#quizCounter"),
  quizHelper: document.querySelector("#quizHelper"),
  quizRoleNote: document.querySelector("#quizRoleNote"),
  quizOptions: document.querySelector("#quizOptions"),
  quizFeedback: document.querySelector("#quizFeedback"),
  nextQuestion: document.querySelector("#nextQuestion"),
  randomQuestion: document.querySelector("#randomQuestion"),
  toastStack: document.querySelector("#toastStack"),
};

let promptTimer = null;
let introDismissedForTab = "";

function formatCurrency(value) {
  const rounded = Math.round(Number(value) * 100) / 100;
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(2)} EUR`;
}

function showToast(message, tone = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${tone}`;
  toast.textContent = message;
  elements.toastStack.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add("hide");
  }, 2600);

  window.setTimeout(() => {
    toast.remove();
  }, 3200);
}

function clampPercentages() {
  const locked = state.savePercent + state.investPercent;
  if (locked > 100) {
    state.investPercent = Math.max(0, 100 - state.savePercent);
    elements.investPercentInput.value = String(state.investPercent);
  }
}

function getSelectedGoal() {
  return state.goals.find((goal) => goal.id === state.selectedGoalId) || state.goals[0] || null;
}

function getMetrics() {
  clampPercentages();
  const spendPercent = Math.max(0, 100 - state.savePercent - state.investPercent);
  const spendAmount = (state.allowance * spendPercent) / 100;
  const saveAmount = (state.allowance * state.savePercent) / 100;
  const investAmount = (state.allowance * state.investPercent) / 100;
  const overLimit = state.spentThisWeek > state.weeklyLimit;
  const nearLimit = !overLimit && state.spentThisWeek >= state.weeklyLimit * 0.8;
  const remainingLimit = Math.max(0, state.weeklyLimit - state.spentThisWeek);
  const currentGoal = getSelectedGoal();
  const savedAmount = currentGoal ? (currentGoal.amount * currentGoal.progress) / 100 : 0;
  const thresholdReached = currentGoal ? currentGoal.progress >= MATCH_THRESHOLD : false;
  const parentContribution = currentGoal && thresholdReached
    ? (currentGoal.amount * state.matchPercent) / 100
    : 0;
  const remainingAmount = currentGoal
    ? Math.max(0, currentGoal.amount - Math.min(currentGoal.amount, savedAmount + parentContribution))
    : 0;

  return {
    spendAmount,
    saveAmount,
    investAmount,
    overLimit,
    nearLimit,
    remainingLimit,
    currentGoal,
    savedAmount,
    thresholdReached,
    parentContribution,
    remainingAmount,
  };
}

function getCurrentProfile() {
  return investmentProfiles[state.profile];
}

function buildAssistantPrompts(metrics) {
  const prompts = [
    {
      text: `Programėlėje jau yra ${quizQuestions.length} klausimų ir ${learningTips.length} mokymosi patarimų - kiekviena dalis turi savo atskirą skiltį.`,
      tags: ["biblioteka", "100+"],
    },
    {
      text: `Aktyvus ${getCurrentProfile().title.toLowerCase()} - verta su vaiku aptarti, kuo skiriasi investavimo kryptys.`,
      tags: ["investavimas", "profilis"],
    },
  ];

  if (state.mode === "parent") {
    prompts.unshift({
      text: "Tėvų režime galima redaguoti ir trinti tikslus, o taip pat pridėti naujus tikslus vaikui.",
      tags: ["tėvai", "tikslų valdymas"],
    });
  } else {
    prompts.unshift({
      text: "Vaiko režime gali išsikelti naują tikslą, bet limitų ar investavimo taisyklių keisti negalima.",
      tags: ["vaikas", "savas tikslas"],
    });
  }

  if (metrics.overLimit) {
    prompts.unshift({
      text: "Savaitės limitas jau viršytas - sistema parodytų skubų perspėjimą tėvams.",
      tags: ["skubu", "limitas"],
    });
  } else if (metrics.nearLimit) {
    prompts.unshift({
      text: `Iki savaitės limito liko tik ${formatCurrency(metrics.remainingLimit)} - verta sustoti prieš kitą pirkinį.`,
      tags: ["perspėjimas", "savaitė"],
    });
  }

  if (metrics.currentGoal && metrics.thresholdReached) {
    prompts.push({
      text: `Tikslas "${metrics.currentGoal.title}" jau pasiekė ${metrics.currentGoal.progress}% - galima aktyvuoti tėvų prisidėjimą.`,
      tags: ["tikslas", "50%+"],
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

  elements.enablePush.textContent = state.pushEnabled
    ? "Išjungti push"
    : "Įjungti push";
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

  elements.tabIntroTitle.textContent = intro.title;
  elements.tabIntroText.textContent = intro.text;
  elements.tabIntroCard.hidden = isDismissed;
}

function renderTabs() {
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

  elements.roleButtons.forEach((button) => {
    const active = button.dataset.roleTarget === state.mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  elements.roleFabLabel.textContent = isParent ? "Tėvų režimas" : "Vaiko režimas";
  elements.roleFab.classList.toggle("child", !isParent);

  elements.parentControls.forEach((control) => {
    control.disabled = !isParent;
  });

  elements.profileButtons.forEach((button) => {
    const active = button.dataset.profile === state.profile;
    button.classList.toggle("active", active);
    button.disabled = !isParent;
  });

  elements.roleCaption.textContent = isParent ? "Tėvų režimas" : "Vaiko režimas";
  elements.roleDescription.textContent = isParent
    ? "Tėvai valdo limitus, tikslus ir investavimo profilį, o apačioje skiltys padalintos taip, kad informacija neapkrautų vieno ekrano."
    : "Vaikas mato atskiras skiltis, gali mokytis, spręsti viktoriną ir išsikelti naujus tikslus, bet tėvų taisyklių nekeičia.";
  elements.heroCopy.textContent = isParent
    ? "Tėvai gali koreguoti limitus, redaguoti ar ištrinti tikslus ir valdyti investavimo profilį."
    : "Vaikas gali sekti progresą, kurti savo tikslus ir mokytis per atskiras programėlės skiltis.";
  elements.goalsRoleDescription.textContent = isParent
    ? "Tėvų režime galima redaguoti, ištrinti arba pridėti naujus tikslus."
    : "Vaiko režime gali susikurti naują tikslą, o tėvai vėliau galės jį koreguoti.";
  elements.goalModePill.textContent = isParent ? "Valdymas aktyvus" : "Vaiko siūlomi tikslai";
  elements.goalModePill.className = `status-pill ${isParent ? "success" : "warning"}`;
  elements.limitsModeCopy.textContent = isParent
    ? "Tėvų režime galima valdyti išlaidų ribas ir paskirstymą."
    : "Vaiko režime limitų skiltis rodoma tik skaitymui - keisti nieko negalima.";
  elements.controlModeBanner.textContent = isParent
    ? "Tėvų režimas aktyvus - limitus ir paskirstymą galima keisti."
    : "Vaiko režimas aktyvus - visi limitų nustatymai rodomi tik skaitymui.";
  elements.quizRoleNote.textContent = `Dabartinis režimas: ${isParent ? "tėvai" : "vaikas"}.`;
}

function renderHome(metrics) {
  elements.heroGoalName.textContent = metrics.currentGoal ? metrics.currentGoal.title : "-";
  elements.heroWeeklyLimit.textContent = formatCurrency(state.weeklyLimit);
  elements.heroLibraryCount.textContent = `${quizQuestions.length} klaus. / ${learningTips.length} pamokų`;

  elements.spendAmount.textContent = formatCurrency(metrics.spendAmount);
  elements.saveAmount.textContent = formatCurrency(metrics.saveAmount);
  elements.investAmount.textContent = formatCurrency(metrics.investAmount);

  elements.spentAmount.textContent = formatCurrency(state.spentThisWeek);
  elements.remainingLimitAmount.textContent = formatCurrency(metrics.remainingLimit);

  if (metrics.overLimit) {
    elements.limitStatus.textContent = "Viršytas limitas";
    elements.limitDetail.textContent = "Tėvams būtų rodomas skubus push perspėjimas.";
  } else if (metrics.nearLimit) {
    elements.limitStatus.textContent = "Artėjama prie ribos";
    elements.limitDetail.textContent = "Sistema perspėtų dar prieš viršijant limitą.";
  } else {
    elements.limitStatus.textContent = "Viskas pagal planą";
    elements.limitDetail.textContent = "Vaikas dar turi saugią atsargą iki savaitės ribos.";
  }

  if (metrics.currentGoal) {
    elements.selectedGoalTitleHome.textContent = `${metrics.currentGoal.emoji} ${metrics.currentGoal.title}`;
    elements.savedAmount.textContent = formatCurrency(metrics.savedAmount);
    elements.savedPercent.textContent = `${metrics.currentGoal.progress}%`;
    elements.parentContribution.textContent = formatCurrency(metrics.parentContribution);
    elements.progressFill.style.width = `${Math.min(100, metrics.currentGoal.progress)}%`;
  } else {
    elements.selectedGoalTitleHome.textContent = "Tikslo nėra";
    elements.savedAmount.textContent = "0 EUR";
    elements.savedPercent.textContent = "0%";
    elements.parentContribution.textContent = "0 EUR";
    elements.progressFill.style.width = "0%";
  }

  if (metrics.thresholdReached) {
    elements.notificationBanner.textContent = `Tikslas "${metrics.currentGoal.title}" pasiekė ${metrics.currentGoal.progress}%, todėl galima aktyvuoti ${state.matchPercent}% tėvų prisidėjimą.`;
    elements.notificationBanner.className = "notification-banner success";
  } else {
    elements.notificationBanner.textContent = "Tėvų prisidėjimas bus siūlomas, kai pasieksite 50% tikslo.";
    elements.notificationBanner.className = "notification-banner pending";
  }
}

function renderGoalList(metrics) {
  elements.goalCountLabel.textContent = `${state.goals.length} tikslai`;
  elements.goalList.innerHTML = "";

  state.goals.forEach((goal) => {
    const selected = goal.id === state.selectedGoalId;
    const item = document.createElement("button");
    item.type = "button";
    item.className = `goal-list-item ${selected ? "active" : ""}`;
    item.innerHTML = `
      <div>
        <strong>${goal.emoji} ${goal.title}</strong>
        <span>Sukūrė: ${goal.author === "child" ? "vaikas" : "tėvai"}</span>
      </div>
      <div>
        <strong>${goal.progress}%</strong>
        <span>${formatCurrency(goal.amount)}</span>
      </div>
    `;
    item.addEventListener("click", () => {
      state.selectedGoalId = goal.id;
      renderAll();
    });
    elements.goalList.appendChild(item);
  });

  if (!metrics.currentGoal) {
    elements.goalDetailTitle.textContent = "Pasirink tikslo nėra";
    elements.goalCreatorPill.textContent = "Nėra duomenų";
    elements.goalDetailCopy.textContent = "Sukurk naują tikslą, kad čia matytum detales.";
    elements.goalDetailProgress.style.width = "0%";
    elements.goalTargetAmount.textContent = "0 EUR";
    elements.goalSavedAmount.textContent = "0 EUR";
    elements.goalRemainingAmount.textContent = "0 EUR";
    elements.goalProgressPercent.textContent = "0%";
    return;
  }

  elements.goalDetailTitle.textContent = `${metrics.currentGoal.emoji} ${metrics.currentGoal.title}`;
  elements.goalCreatorPill.textContent = metrics.currentGoal.author === "child" ? "Sukūrė vaikas" : "Sukūrė tėvai";
  elements.goalCreatorPill.className = `status-pill ${metrics.currentGoal.author === "child" ? "warning" : "success"}`;
  elements.goalDetailCopy.textContent = metrics.currentGoal.author === "child"
    ? "Tai vaiko pasiūlytas tikslas. Tėvai gali jį koreguoti arba palikti tokį, koks yra."
    : "Tai tėvų pridėtas tikslas, kurį galima toliau koreguoti ir stebėti."
  ;
  elements.goalDetailProgress.style.width = `${Math.min(100, metrics.currentGoal.progress)}%`;
  elements.goalTargetAmount.textContent = formatCurrency(metrics.currentGoal.amount);
  elements.goalSavedAmount.textContent = formatCurrency(metrics.savedAmount);
  elements.goalRemainingAmount.textContent = formatCurrency(metrics.remainingAmount);
  elements.goalProgressPercent.textContent = `${metrics.currentGoal.progress}%`;

  elements.parentGoalTitle.value = metrics.currentGoal.title;
  elements.parentGoalEmoji.value = metrics.currentGoal.emoji;
  elements.parentGoalTarget.value = String(metrics.currentGoal.amount);
  elements.parentGoalSaved.value = String(Math.round(metrics.savedAmount));

  const isParent = state.mode === "parent";
  elements.parentGoalForm.hidden = !isParent;
  elements.childGoalForm.hidden = isParent;
}

function renderLimits(metrics) {
  elements.allowanceValue.textContent = formatCurrency(state.allowance);
  elements.weeklyLimitValue.textContent = formatCurrency(state.weeklyLimit);
  elements.spentThisWeekValue.textContent = formatCurrency(state.spentThisWeek);
  elements.savePercentValue.textContent = `${state.savePercent}%`;
  elements.investPercentValue.textContent = `${state.investPercent}%`;
  elements.matchPercentValue.textContent = `${state.matchPercent}%`;

  elements.notificationList.innerHTML = "";
  const notifications = [];

  if (metrics.overLimit) {
    notifications.push({
      tone: "danger",
      title: "Skubus įspėjimas",
      text: `Viršytas savaitės limitas ${formatCurrency(state.weeklyLimit)}.`,
    });
  } else if (metrics.nearLimit) {
    notifications.push({
      tone: "warning",
      title: "Ankstyvas perspėjimas",
      text: `Vaikas išleido ${formatCurrency(state.spentThisWeek)} ir artėja prie ribos.`,
    });
  } else {
    notifications.push({
      tone: "success",
      title: "Viskas pagal planą",
      text: `Iki savaitės limito dar liko ${formatCurrency(metrics.remainingLimit)}.`,
    });
  }

  notifications.push({
    tone: state.pushEnabled ? "success" : "warning",
    title: state.pushEnabled ? "Push aktyvūs" : "Push išjungti",
    text: state.pushEnabled
      ? "Tėvų telefonas gautų limitų ir tikslo įspėjimus."
      : "Įspėjimai būtų matomi tik pačioje programėlėje.",
  });

  if (metrics.thresholdReached && metrics.currentGoal) {
    notifications.push({
      tone: "success",
      title: "Tikslas pasiekė 50%+",
      text: `Galima aktyvuoti ${state.matchPercent}% prisidėjimą prie "${metrics.currentGoal.title}".`,
    });
  }

  notifications.forEach((item) => {
    const node = document.createElement("li");
    node.className = `notification-item ${item.tone}`;
    node.innerHTML = `<strong>${item.title}</strong><span>${item.text}</span>`;
    elements.notificationList.appendChild(node);
  });

  elements.pushStatus.textContent = state.pushEnabled ? "Push aktyvūs" : "Push išjungti";
  elements.pushStatus.className = `status-pill ${state.pushEnabled ? "success" : "warning"}`;

  const rules = [
    `Užrakina ${state.savePercent}% taupymui ir ${state.investPercent}% investavimui.`,
    state.mode === "parent"
      ? "Tėvų režime galima koreguoti limitus ir paskirstymą."
      : "Vaiko režime limitų nustatymai yra tik skaitymui.",
    metrics.overLimit
      ? "Viršijus limitą būtų rodomas skubus perspėjimas."
      : metrics.nearLimit
        ? "Priartėjus prie ribos būtų rodomas ankstyvas perspėjimas."
        : "Kol kas išlaidos dar saugiai telpa į nustatytą ribą.",
  ];

  elements.rulesList.innerHTML = "";
  rules.forEach((rule) => {
    const item = document.createElement("li");
    item.textContent = rule;
    elements.rulesList.appendChild(item);
  });
}

function renderInvesting() {
  const profile = getCurrentProfile();
  elements.investmentProfileTitle.textContent = profile.title;
  elements.investmentProfileStatus.textContent = profile.status;
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
    `;
    elements.investmentGrid.appendChild(card);
  });
}

function renderLearning() {
  const tip = learningTips[state.learningIndex];
  elements.learningLibraryMeta.textContent = `Bibliotekoje yra ${learningTips.length} trumpų finansinio raštingumo patarimų.`;
  elements.learningTitle.textContent = tip.title;
  elements.learningCounter.textContent = `${state.learningIndex + 1} / ${learningTips.length}`;
  elements.learningTopic.textContent = `Tema: ${tip.tag}`;
  elements.learningText.textContent = tip.text;
  elements.learningMeta.textContent = "Trumpi patarimai skirti telefonui, kad informacija nesusikrautų viename ekrane.";

  elements.learningPreviewList.innerHTML = "";
  for (let offset = 1; offset <= 4; offset += 1) {
    const previewTip = learningTips[(state.learningIndex + offset) % learningTips.length];
    const node = document.createElement("div");
    node.className = "preview-item";
    node.innerHTML = `<strong>${previewTip.title}</strong><span>${previewTip.tag}</span>`;
    elements.learningPreviewList.appendChild(node);
  }
}

function renderQuiz() {
  const quiz = quizQuestions[state.quizIndex];
  elements.quizLibraryMeta.textContent = `Viktorinos bibliotekoje yra ${quizQuestions.length} klausimų.`;
  elements.quizQuestion.textContent = quiz.question;
  elements.quizCounter.textContent = `${state.quizIndex + 1} / ${quizQuestions.length}`;
  elements.quizHelper.textContent = quiz.helper;
  elements.quizFeedback.textContent = "";
  elements.quizFeedback.className = "quiz-feedback";
  elements.quizOptions.innerHTML = "";

  quiz.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.textContent = option;
    button.addEventListener("click", () => {
      const correct = index === quiz.correctIndex;
      Array.from(elements.quizOptions.children).forEach((candidate, candidateIndex) => {
        candidate.classList.remove("correct", "wrong");
        if (candidateIndex === quiz.correctIndex) {
          candidate.classList.add("correct");
        } else if (candidateIndex === index && !correct) {
          candidate.classList.add("wrong");
        }
      });

      elements.quizFeedback.textContent = correct
        ? quiz.feedback
        : "Dar ne visai. Pagalvok apie planavimą, tikslus ir atsakingą pinigų naudojimą.";
      elements.quizFeedback.className = `quiz-feedback ${correct ? "success" : "error"}`;
    });
    elements.quizOptions.appendChild(button);
  });
}

function renderAll(options = {}) {
  const metrics = getMetrics();
  renderTabs();
  renderRoleState(metrics);
  renderHome(metrics);
  renderGoalList(metrics);
  renderLimits(metrics);
  renderInvesting();
  renderLearning();
  renderQuiz();
  renderAssistant(metrics, Boolean(options.randomizePrompt));
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
    state.mode = button.dataset.roleTarget;
    elements.roleMenu.hidden = true;
    renderAll();
    showToast(
      state.mode === "parent" ? "Įjungtas tėvų režimas." : "Įjungtas vaiko režimas.",
      "info",
    );
  });
});

elements.tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.activeTab = button.dataset.tabTarget;
    introDismissedForTab = "";
    renderAll();
  });
});

elements.roleFab.addEventListener("click", () => {
  elements.roleMenu.hidden = !elements.roleMenu.hidden;
});

elements.closeTabIntro.addEventListener("click", () => {
  introDismissedForTab = state.activeTab;
  renderTabIntro();
});

elements.profileButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (state.mode !== "parent") {
      return;
    }
    state.profile = button.dataset.profile;
    renderAll({ randomizePrompt: true });
    showToast(`Pasirinktas ${getCurrentProfile().title.toLowerCase()}.`, "success");
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
  renderAll({ randomizePrompt: true });
  showToast(
    state.pushEnabled ? "Push pranešimai įjungti." : "Push pranešimai išjungti.",
    state.pushEnabled ? "success" : "warning",
  );
});

attachControl(elements.allowance, "allowance");
attachControl(elements.weeklyLimit, "weeklyLimit");
attachControl(elements.spentThisWeek, "spentThisWeek");
attachControl(elements.savePercentInput, "savePercent");
attachControl(elements.investPercentInput, "investPercent");
attachControl(elements.matchPercent, "matchPercent");

elements.parentGoalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (state.mode !== "parent") {
    return;
  }
  const goal = getSelectedGoal();
  if (!goal) {
    return;
  }

  const nextTitle = elements.parentGoalTitle.value.trim();
  const nextEmoji = elements.parentGoalEmoji.value.trim() || "🎯";
  const nextTarget = Number(elements.parentGoalTarget.value);
  const nextSaved = Number(elements.parentGoalSaved.value);

  if (!nextTitle || nextTarget <= 0) {
    showToast("Užpildyk pavadinimą ir teisingą tikslo sumą.", "warning");
    return;
  }

  goal.title = nextTitle;
  goal.emoji = nextEmoji;
  goal.amount = nextTarget;
  goal.progress = Math.max(0, Math.min(100, Math.round((nextSaved / nextTarget) * 100)));
  renderAll();
  showToast("Tikslas atnaujintas.", "success");
});

elements.addParentGoalButton.addEventListener("click", () => {
  if (state.mode !== "parent") {
    return;
  }

  const nextId = `goal-parent-${Date.now()}`;
  const newGoal = {
    id: nextId,
    title: "Naujas tėvų tikslas",
    emoji: "🎯",
    amount: 150,
    progress: 0,
    author: "parent",
  };
  state.goals.unshift(newGoal);
  state.selectedGoalId = nextId;
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

  state.goals = state.goals.filter((goal) => goal.id !== state.selectedGoalId);
  state.selectedGoalId = state.goals[0].id;
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
    showToast("Įrašyk tikslo pavadinimą ir teigiamą sumą.", "warning");
    return;
  }

  const nextId = `goal-child-${Date.now()}`;
  state.goals.unshift({
    id: nextId,
    title,
    emoji,
    amount: target,
    progress: 0,
    author: "child",
  });
  state.selectedGoalId = nextId;
  elements.childGoalForm.reset();
  renderAll();
  showToast("Naujas vaiko tikslas sukurtas.", "success");
});

elements.nextLearningTip.addEventListener("click", () => {
  state.learningIndex = (state.learningIndex + 1) % learningTips.length;
  renderLearning();
});

elements.randomLearningTip.addEventListener("click", () => {
  state.learningIndex = (state.learningIndex + 37) % learningTips.length;
  renderLearning();
});

elements.nextQuestion.addEventListener("click", () => {
  state.quizIndex = (state.quizIndex + 1) % quizQuestions.length;
  renderQuiz();
});

elements.randomQuestion.addEventListener("click", () => {
  state.quizIndex = (state.quizIndex + 41) % quizQuestions.length;
  renderQuiz();
});

renderAll();
restartPromptRotation();
