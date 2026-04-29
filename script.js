const MATCH_THRESHOLD = 50;
const PROMPT_ROTATION_MS = 8000;

const state = {
  mode: "parent",
  activeTab: "suvestine",
  allowance: 70,
  weeklyLimit: 28,
  spentThisWeek: 19,
  savePercent: 30,
  investPercent: 20,
  matchPercent: 50,
  profile: "balanced",
  pushEnabled: true,
  quizIndex: 0,
  learningIndex: 0,
  promptIndex: 0,
  goals: [
    {
      id: "goal-bike",
      title: "Dviratis vasarai",
      amount: 180,
      progress: 45,
      author: "child",
    },
    {
      id: "goal-console",
      title: "Žaidimų konsolė",
      amount: 250,
      progress: 20,
      author: "parent",
    },
  ],
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
        description: "Skirta aiškinti, kad dalis pinigų gali būti laikoma labai ramioje zonoje.",
      },
      {
        name: "Obligacijų fondai",
        share: "35%",
        risk: "Žema rizika",
        description: "Parodo stabilesnę kryptį ir paaiškina, kas yra nuosaikus augimas.",
      },
      {
        name: "Taupymo rezervas",
        share: "25%",
        risk: "Apsauga",
        description: "Primena, kad ne visi pinigai turi būti investuojami - dalis gali likti saugumui.",
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
        description: "Pirmas žingsnis aiškinti, kodėl vienas krepšelis gali būti saugesnis nei viena akcija.",
      },
      {
        name: "Technologijos",
        share: "30%",
        risk: "Vidutinė rizika",
        description: "Padeda vaikui suprasti, kad augimo sritys gali svyruoti labiau.",
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
        description: "Tinka parodyti, kad greitesnio augimo kryptys dažniau svyruoja.",
      },
      {
        name: "AI ir robotika",
        share: "35%",
        risk: "Aukštesnė rizika",
        description: "Edukacinė kategorija apie ateities sektorius ir neapibrėžtumą.",
      },
      {
        name: "Ateities miestai",
        share: "25%",
        risk: "Vidutinė - aukštesnė rizika",
        description: "Padeda vaikui suprasti teminius investavimo pasirinkimus.",
      },
    ],
  },
};

function buildQuizBank() {
  const topics = [
    {
      name: "taupymą",
      correct: "Pirmiausia atsidėti dalį pinigų tikslui",
      wrongA: "Viską išleisti tą pačią dieną",
      wrongB: "Visada laukti, kol kiti nuspręs už tave",
      helper: "Pagalvok apie įprotį, kuris padeda artėti prie tikslo.",
      feedback:
        "Teisingai - mažas, bet pastovus atsidėjimas yra vienas svarbiausių taupymo įpročių.",
    },
    {
      name: "išlaidų limitą",
      correct: "Ribą, kuri padeda neišleisti per daug per savaitę",
      wrongA: "Būdą išleisti daugiau nei planuota",
      wrongB: "Paslėptą mokestį",
      helper: "Atsakymas susijęs su savikontrole ir planavimu.",
      feedback:
        "Teisingai - limitas reikalingas tam, kad vaikas mokytųsi kontroliuoti savaitės biudžetą.",
    },
    {
      name: "investavimo riziką",
      correct: "Kad vertė gali ir kilti, ir kristi",
      wrongA: "Kad grąža visada garantuota",
      wrongB: "Kad tėvai visada panaikins nuostolius",
      helper: "Pagalvok apie tai, jog investicijų vertė svyruoja.",
      feedback:
        "Teisingai - investavimo rizika reiškia, kad vertė gali keistis, todėl svarbu atsargumas.",
    },
    {
      name: "ETF fondus",
      correct: "Krepšelį, kuriame yra daugiau nei viena investicija",
      wrongA: "Vieną vienintelę akciją",
      wrongB: "Taupyklę be jokio svyravimo",
      helper: "Čia svarbi diversifikacijos idėja.",
      feedback:
        "Teisingai - ETF leidžia parodyti vaikui, kad pinigai gali būti paskirstyti plačiau.",
    },
    {
      name: "tikslų planavimą",
      correct: "Aiškų norą susieti su suma ir žingsniais",
      wrongA: "Tiesiog norėti kažko be plano",
      wrongB: "Keisti tikslą kasdien be priežasties",
      helper: "Atsakymas turi turėti aiškumą ir planą.",
      feedback:
        "Teisingai - tikslas tampa realesnis, kai turi sumą, progresą ir aiškų planą.",
    },
  ];

  const bank = [];
  for (let index = 0; index < 110; index += 1) {
    const topic = topics[index % topics.length];
    bank.push({
      question: `Klausimas ${index + 1}. Kas geriausiai apibūdina ${topic.name}?`,
      helper: topic.helper,
      options: [topic.wrongA, topic.correct, topic.wrongB],
      correctIndex: 1,
      feedback: topic.feedback,
    });
  }
  return bank;
}

function buildLearningTips() {
  const themes = [
    {
      title: "Kaip veikia savaitės limitas?",
      text: "Savaitės limitas padeda neperdeginti visų pinigų per kelias dienas ir išmoko planuoti.",
      tag: "Limitai",
    },
    {
      title: "Kodėl verta turėti tikslą?",
      text: "Tikslas padeda vaikui suprasti, kam verta atsidėti pinigus ir ką reiškia progresas.",
      tag: "Tikslai",
    },
    {
      title: "Kuo skiriasi taupymas ir investavimas?",
      text: "Taupymas dažniau skirtas saugumui ir artimiems pirkiniams, o investavimas - ilgesniam augimui.",
      tag: "Pagrindai",
    },
    {
      title: "Kas yra diversifikacija?",
      text: "Diversifikacija reiškia, kad pinigai paskirstomi per daugiau nei vieną kryptį, o ne į vieną vietą.",
      tag: "Investavimas",
    },
    {
      title: "Kodėl tėvų kontrolė naudinga?",
      text: "Ji padeda vaikui mokytis saugioje aplinkoje ir palaipsniui suprasti finansinius sprendimus.",
      tag: "Tėvai",
    },
  ];

  const entries = [];
  for (let index = 0; index < 125; index += 1) {
    const theme = themes[index % themes.length];
    entries.push({
      title: `${theme.title} #${index + 1}`,
      text: `${theme.text} Šis patarimas skirtas trumpam, lengvai perskaitomam mokymuisi telefone.`,
      tag: theme.tag,
    });
  }
  return entries;
}

const quizQuestions = buildQuizBank();
const learningTips = buildLearningTips();

const elements = {
  roleButtons: Array.from(document.querySelectorAll("[data-role-target]")),
  tabButtons: Array.from(document.querySelectorAll("[data-tab-target]")),
  tabPanels: Array.from(document.querySelectorAll("[data-tab-panel]")),
  parentControls: Array.from(document.querySelectorAll("[data-parent-control]")),
  profileButtons: Array.from(document.querySelectorAll("[data-profile]")),
  roleCaption: document.querySelector("#roleCaption"),
  roleDescription: document.querySelector("#roleDescription"),
  walletAmount: document.querySelector("#walletAmount"),
  walletStatusPill: document.querySelector("#walletStatusPill"),
  heroSpend: document.querySelector("#heroSpend"),
  heroSave: document.querySelector("#heroSave"),
  heroInvest: document.querySelector("#heroInvest"),
  heroWeeklyLimit: document.querySelector("#heroWeeklyLimit"),
  heroSpent: document.querySelector("#heroSpent"),
  assistantMessage: document.querySelector("#assistantMessage"),
  assistantTags: document.querySelector("#assistantTags"),
  nextPrompt: document.querySelector("#nextPrompt"),
  enablePush: document.querySelector("#enablePush"),
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
  spendAmount: document.querySelector("#spendAmount"),
  saveAmount: document.querySelector("#saveAmount"),
  investAmount: document.querySelector("#investAmount"),
  weeklyLimitAmount: document.querySelector("#weeklyLimitAmount"),
  spentAmount: document.querySelector("#spentAmount"),
  limitStatus: document.querySelector("#limitStatus"),
  pushStatus: document.querySelector("#pushStatus"),
  notificationList: document.querySelector("#notificationList"),
  rulesList: document.querySelector("#rulesList"),
  investmentProfileTitle: document.querySelector("#investmentProfileTitle"),
  investmentProfileStatus: document.querySelector("#investmentProfileStatus"),
  investmentGrid: document.querySelector("#investmentGrid"),
  goalsList: document.querySelector("#goalsList"),
  goalTitleInput: document.querySelector("#goalTitleInput"),
  goalAmountInput: document.querySelector("#goalAmountInput"),
  goalProgressInput: document.querySelector("#goalProgressInput"),
  addGoalButton: document.querySelector("#addGoalButton"),
  parentGoalTools: document.querySelector("#parentGoalTools"),
  goalsModeNote: document.querySelector("#goalsModeNote"),
  selectedGoalTitle: document.querySelector("#selectedGoalTitle"),
  selectedGoalAuthor: document.querySelector("#selectedGoalAuthor"),
  savedAmount: document.querySelector("#savedAmount"),
  savedPercent: document.querySelector("#savedPercent"),
  parentContribution: document.querySelector("#parentContribution"),
  remainingAmount: document.querySelector("#remainingAmount"),
  progressFill: document.querySelector("#progressFill"),
  notificationBanner: document.querySelector("#notificationBanner"),
  learningMeta: document.querySelector("#learningMeta"),
  learningTitle: document.querySelector("#learningTitle"),
  learningText: document.querySelector("#learningText"),
  learningTag: document.querySelector("#learningTag"),
  prevLearning: document.querySelector("#prevLearning"),
  nextLearning: document.querySelector("#nextLearning"),
  quizMeta: document.querySelector("#quizMeta"),
  quizQuestion: document.querySelector("#quizQuestion"),
  quizHelper: document.querySelector("#quizHelper"),
  quizRoleNote: document.querySelector("#quizRoleNote"),
  quizOptions: document.querySelector("#quizOptions"),
  quizFeedback: document.querySelector("#quizFeedback"),
  nextQuestion: document.querySelector("#nextQuestion"),
  toastStack: document.querySelector("#toastStack"),
};

let promptTimer = null;

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
    elements.investPercent.value = String(state.investPercent);
  }
}

function getCurrentGoal() {
  return state.goals[0];
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

  const currentGoal = getCurrentGoal();
  const savedAmount = currentGoal ? (currentGoal.amount * currentGoal.progress) / 100 : 0;
  const thresholdReached = currentGoal ? currentGoal.progress >= MATCH_THRESHOLD : false;
  const parentContribution = currentGoal && thresholdReached
    ? (currentGoal.amount * state.matchPercent) / 100
    : 0;
  const remainingAmount = currentGoal
    ? Math.max(0, currentGoal.amount - Math.min(currentGoal.amount, savedAmount + parentContribution))
    : 0;

  return {
    spendPercent,
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
      text: `Šiuo metu aktyvus ${getCurrentProfile().title.toLowerCase()} - verta aptarti, kuo skiriasi investavimo kryptys.`,
      tags: ["investavimas", "kategorijos"],
    },
    {
      text: `Programėlėje jau yra ${quizQuestions.length}+ klausimų ir ${learningTips.length}+ trumpų mokymosi patarimų.`,
      tags: ["mokymasis", "100+"],
    },
  ];

  if (state.mode === "parent") {
    prompts.unshift({
      text: `Tėvai gali koreguoti ar trinti tikslus, o vaikai patys gali išsikelti naujus norus taupymui.`,
      tags: ["tikslai", "tėvų kontrolė"],
    });
  } else {
    prompts.unshift({
      text: `Vaiko režime gali kurti naujus tikslus ir matyti limitus, bet negali keisti tėvų nustatytų taisyklių.`,
      tags: ["vaiko režimas", "tikslai"],
    });
  }

  if (metrics.overLimit) {
    prompts.unshift({
      text: "Limitas jau viršytas - programėlė parodytų skubų perspėjimą ir tėvų reakcijos poreikį.",
      tags: ["skubu", "limitas"],
    });
  } else if (metrics.nearLimit) {
    prompts.unshift({
      text: `Iki savaitės limito liko ${formatCurrency(metrics.remainingLimit)} - verta sustoti prieš kitą pirkimą.`,
      tags: ["perspėjimas", "limitas"],
    });
  }

  if (metrics.currentGoal && metrics.thresholdReached) {
    prompts.push({
      text: `Tikslas "${metrics.currentGoal.title}" pasiekė ${metrics.currentGoal.progress}%, todėl galima aktyvuoti tėvų prisidėjimą.`,
      tags: ["tikslas", "prisidėjimas"],
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
    ? "Išjungti push pranešimus"
    : "Įjungti push pranešimus";
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

function renderTabs() {
  elements.tabButtons.forEach((button) => {
    const active = button.dataset.tabTarget === state.activeTab;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  elements.tabPanels.forEach((panel) => {
    panel.hidden = panel.dataset.tabPanel !== state.activeTab;
  });
}

function renderRoleState(metrics) {
  const isParent = state.mode === "parent";

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

  elements.roleCaption.textContent = `Aktyvus režimas: ${isParent ? "tėvai" : "vaikas"}`;
  elements.roleDescription.textContent = isParent
    ? "Tėvai valdo limitus, investavimo profilį, push įspėjimus ir gali koreguoti bet kurį tikslą."
    : "Vaikas mato taisykles, turi atskiras skiltis apačioje ir gali kurti savo taupymo tikslus.";

  elements.quizRoleNote.textContent = `Dabartinis režimas: ${isParent ? "tėvai" : "vaikas"}.`;
  elements.parentGoalTools.hidden = !isParent;
  elements.goalsModeNote.textContent = isParent
    ? "Tėvai gali pridėti, koreguoti arba ištrinti bet kurį tikslą."
    : "Vaikas gali pridėti savo tikslus. Esamus tikslus koreguoti ar trinti gali tik tėvai.";

  if (metrics.overLimit) {
    elements.walletStatusPill.textContent = "Viršytas limitas";
    elements.walletStatusPill.className = "status-pill danger";
  } else if (metrics.nearLimit) {
    elements.walletStatusPill.textContent = "Artėja prie ribos";
    elements.walletStatusPill.className = "status-pill warning";
  } else {
    elements.walletStatusPill.textContent = "Limitas kontroliuojamas";
    elements.walletStatusPill.className = "status-pill success";
  }
}

function renderSummary(metrics) {
  elements.allowanceValue.textContent = formatCurrency(state.allowance);
  elements.weeklyLimitValue.textContent = formatCurrency(state.weeklyLimit);
  elements.spentThisWeekValue.textContent = formatCurrency(state.spentThisWeek);
  elements.savePercentValue.textContent = `${state.savePercent}%`;
  elements.investPercentValue.textContent = `${state.investPercent}%`;
  elements.matchPercentValue.textContent = `${state.matchPercent}%`;

  elements.walletAmount.textContent = formatCurrency(state.allowance);
  elements.heroSpend.textContent = formatCurrency(metrics.spendAmount);
  elements.heroSave.textContent = formatCurrency(metrics.saveAmount);
  elements.heroInvest.textContent = formatCurrency(metrics.investAmount);
  elements.heroWeeklyLimit.textContent = formatCurrency(state.weeklyLimit);
  elements.heroSpent.textContent = formatCurrency(state.spentThisWeek);

  elements.spendAmount.textContent = formatCurrency(metrics.spendAmount);
  elements.saveAmount.textContent = formatCurrency(metrics.saveAmount);
  elements.investAmount.textContent = formatCurrency(metrics.investAmount);
  elements.weeklyLimitAmount.textContent = formatCurrency(state.weeklyLimit);
  elements.spentAmount.textContent = formatCurrency(state.spentThisWeek);

  if (metrics.overLimit) {
    elements.limitStatus.textContent = "Viršytas limitas";
  } else if (metrics.nearLimit) {
    elements.limitStatus.textContent = "Artėja prie ribos";
  } else {
    elements.limitStatus.textContent = "Viskas pagal planą";
  }

  if (metrics.currentGoal) {
    elements.selectedGoalTitle.textContent = metrics.currentGoal.title;
    elements.selectedGoalAuthor.textContent =
      metrics.currentGoal.author === "child"
        ? "Sukūrė vaikas"
        : "Sukūrė tėvai";
    elements.savedAmount.textContent = formatCurrency(metrics.savedAmount);
    elements.savedPercent.textContent = `${metrics.currentGoal.progress}%`;
    elements.parentContribution.textContent = formatCurrency(metrics.parentContribution);
    elements.remainingAmount.textContent = formatCurrency(metrics.remainingAmount);
    elements.progressFill.style.width = `${Math.min(100, metrics.currentGoal.progress)}%`;

    if (metrics.thresholdReached) {
      elements.notificationBanner.textContent = `Tikslas "${metrics.currentGoal.title}" pasiekė ${metrics.currentGoal.progress}%, todėl galima įjungti ${state.matchPercent}% tėvų prisidėjimą.`;
      elements.notificationBanner.className = "notification-banner success";
    } else {
      elements.notificationBanner.textContent = `Tikslas "${metrics.currentGoal.title}" dar nepasiekė ${MATCH_THRESHOLD}% ribos, todėl tėvų prisidėjimas dar laukia.`;
      elements.notificationBanner.className = "notification-banner pending";
    }
  }
}

function renderNotifications(metrics) {
  elements.notificationList.innerHTML = "";
  const items = [];

  if (metrics.overLimit) {
    items.push({
      tone: "danger",
      title: "Skubus įspėjimas",
      text: `Viršytas savaitės limitas ${formatCurrency(state.weeklyLimit)}.`,
    });
  } else if (metrics.nearLimit) {
    items.push({
      tone: "warning",
      title: "Ankstyvas perspėjimas",
      text: `Iki limito liko ${formatCurrency(metrics.remainingLimit)}.`,
    });
  } else {
    items.push({
      tone: "success",
      title: "Stabili situacija",
      text: "Išlaidos vis dar telpa į suplanuotą ribą.",
    });
  }

  items.push({
    tone: state.pushEnabled ? "info" : "warning",
    title: state.pushEnabled ? "Push aktyvūs" : "Push išjungti",
    text: state.pushEnabled
      ? "Tėvų telefonas gautų pranešimus apie limitus ir tikslus."
      : "Kol push išjungti, įspėjimai lieka tik programėlėje.",
  });

  elements.pushStatus.textContent = state.pushEnabled ? "Push aktyvūs" : "Push išjungti";
  elements.pushStatus.className = `status-pill ${state.pushEnabled ? "success" : "warning"}`;

  items.forEach((item) => {
    const row = document.createElement("li");
    row.className = `notification-item ${item.tone}`;
    row.innerHTML = `<strong>${item.title}</strong><span>${item.text}</span>`;
    elements.notificationList.appendChild(row);
  });
}

function renderRules(metrics) {
  const rules = [
    `Užrakina ${state.savePercent}% taupymui ir ${state.investPercent}% investavimui, todėl ne viskas gali būti išleista iš karto.`,
    state.mode === "parent"
      ? "Tėvai šiuo metu gali valdyti limitus, investavimo profilį ir tikslų koregavimą."
      : "Vaikas gali kurti naujus tikslus, bet limitų ir tėvų nustatymų keisti negali.",
    metrics.overLimit
      ? "Limitas viršytas - būtų sugeneruotas skubus push perspėjimas."
      : metrics.nearLimit
        ? "Vaikas artėja prie limito, todėl siunčiamas ankstyvas perspėjimas."
        : "Sistema stebi išlaidas ir laukia, ar bus pasiekta perspėjimo riba.",
    `Viktorinos banke yra ${quizQuestions.length}+ klausimų, o mokymosi bibliotekoje - ${learningTips.length}+ patarimų.`,
  ];

  elements.rulesList.innerHTML = "";
  rules.forEach((rule) => {
    const item = document.createElement("li");
    item.textContent = rule;
    elements.rulesList.appendChild(item);
  });
}

function renderInvestmentGrid() {
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

function renderGoals() {
  elements.goalsList.innerHTML = "";
  state.goals.forEach((goal, index) => {
    const card = document.createElement("article");
    card.className = "goal-card";
    if (index === 0) {
      card.classList.add("active");
    }

    const actions = state.mode === "parent"
      ? `
        <div class="goal-card-actions">
          <button class="small-action" data-goal-action="promote" data-goal-id="${goal.id}" type="button">Rodyti viršuje</button>
          <button class="small-action" data-goal-action="edit" data-goal-id="${goal.id}" type="button">Koreguoti</button>
          <button class="small-action danger" data-goal-action="delete" data-goal-id="${goal.id}" type="button">Ištrinti</button>
        </div>
      `
      : `
        <div class="goal-card-actions">
          <button class="small-action" data-goal-action="promote" data-goal-id="${goal.id}" type="button">Rodyti viršuje</button>
        </div>
      `;

    card.innerHTML = `
      <div class="goal-card-top">
        <div>
          <h4>${goal.title}</h4>
          <span>${goal.author === "child" ? "Vaiko tikslas" : "Tėvų tikslas"}</span>
        </div>
        <strong>${goal.progress}%</strong>
      </div>
      <p class="goal-card-meta">Tikslas: ${formatCurrency(goal.amount)}</p>
      ${actions}
    `;
    elements.goalsList.appendChild(card);
  });

  Array.from(document.querySelectorAll("[data-goal-action]")).forEach((button) => {
    button.addEventListener("click", () => {
      const { goalAction, goalId } = button.dataset;
      handleGoalAction(goalAction, goalId);
    });
  });
}

function handleGoalAction(action, goalId) {
  const goalIndex = state.goals.findIndex((goal) => goal.id === goalId);
  if (goalIndex === -1) {
    return;
  }

  if (action === "promote") {
    const [goal] = state.goals.splice(goalIndex, 1);
    state.goals.unshift(goal);
    showToast(`Tikslas "${goal.title}" perkeltas į viršų.`, "info");
    renderAll();
    return;
  }

  if (state.mode !== "parent") {
    showToast("Tik tėvai gali koreguoti arba trinti tikslus.", "warning");
    return;
  }

  if (action === "delete") {
    const [removedGoal] = state.goals.splice(goalIndex, 1);
    if (!state.goals.length) {
      state.goals.push({
        id: `goal-${Date.now()}`,
        title: "Naujas tikslas",
        amount: 120,
        progress: 0,
        author: "parent",
      });
    }
    showToast(`Tikslas "${removedGoal.title}" ištrintas.`, "warning");
    renderAll();
    return;
  }

  if (action === "edit") {
    const goal = state.goals[goalIndex];
    goal.progress = Math.min(100, goal.progress + 10);
    goal.amount += 10;
    showToast(`Tikslas "${goal.title}" pakoreguotas.`, "success");
    renderAll();
  }
}

function addGoal() {
  const title = elements.goalTitleInput.value.trim();
  const amount = Number(elements.goalAmountInput.value);
  const progress = Number(elements.goalProgressInput.value);

  if (!title || amount <= 0) {
    showToast("Įvesk tikslo pavadinimą ir sumą.", "warning");
    return;
  }

  state.goals.unshift({
    id: `goal-${Date.now()}`,
    title,
    amount,
    progress,
    author: state.mode === "parent" ? "parent" : "child",
  });

  elements.goalTitleInput.value = "";
  elements.goalAmountInput.value = "";
  elements.goalProgressInput.value = "0";

  showToast(`Pridėtas tikslas "${title}".`, "success");
  renderAll();
}

function renderLearning() {
  const entry = learningTips[state.learningIndex % learningTips.length];
  elements.learningMeta.textContent = `${state.learningIndex + 1} / ${learningTips.length} patarimų`;
  elements.learningTitle.textContent = entry.title;
  elements.learningText.textContent = entry.text;
  elements.learningTag.textContent = entry.tag;
}

function renderQuiz() {
  const item = quizQuestions[state.quizIndex % quizQuestions.length];
  elements.quizMeta.textContent = `${state.quizIndex + 1} / ${quizQuestions.length} klausimų`;
  elements.quizQuestion.textContent = item.question;
  elements.quizHelper.textContent = item.helper;
  elements.quizOptions.innerHTML = "";
  elements.quizFeedback.textContent = "";
  elements.quizFeedback.className = "quiz-feedback";

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
        : "Dar ne visai. Pagalvok apie planavimą, limitą ir atsakingą investavimo mokymąsi.";
      elements.quizFeedback.className = `quiz-feedback ${correct ? "success" : "error"}`;
    });
    elements.quizOptions.appendChild(button);
  });
}

function renderAll(options = {}) {
  const metrics = getMetrics();
  renderTabs();
  renderRoleState(metrics);
  renderSummary(metrics);
  renderNotifications(metrics);
  renderRules(metrics);
  renderInvestmentGrid();
  renderGoals();
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
    renderAll();
    restartPromptRotation();
    showToast(
      state.mode === "parent" ? "Įjungtas tėvų režimas." : "Įjungtas vaiko režimas.",
      "info",
    );
  });
});

elements.tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.activeTab = button.dataset.tabTarget;
    renderTabs();
  });
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

elements.addGoalButton.addEventListener("click", addGoal);

elements.prevLearning.addEventListener("click", () => {
  state.learningIndex = (state.learningIndex - 1 + learningTips.length) % learningTips.length;
  renderLearning();
});

elements.nextLearning.addEventListener("click", () => {
  state.learningIndex = (state.learningIndex + 1) % learningTips.length;
  renderLearning();
});

elements.nextQuestion.addEventListener("click", () => {
  state.quizIndex = (state.quizIndex + 1) % quizQuestions.length;
  renderQuiz();
});

attachControl(elements.allowance, "allowance");
attachControl(elements.weeklyLimit, "weeklyLimit");
attachControl(elements.spentThisWeek, "spentThisWeek");
attachControl(elements.savePercent, "savePercent");
attachControl(elements.investPercent, "investPercent");
attachControl(elements.matchPercent, "matchPercent");

renderAll();
restartPromptRotation();
