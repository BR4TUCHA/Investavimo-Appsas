const MATCH_THRESHOLD = 50;
const ADVISOR_ROTATION_MS = 7000;

const state = {
  mode: "parent",
  allowance: 70,
  spendLimit: 30,
  savePercent: 35,
  investPercent: 20,
  goalAmount: 180,
  goalProgress: 40,
  matchPercent: 50,
  spentSoFar: 24,
  selectedCategory: "etf",
  notificationsEnabled: true,
};

const investingCategories = {
  etf: {
    title: "ETF krepšelis",
    risk: "Žema - vidutinė rizika",
    summary: "Platesnė diversifikacija ir paprastesnis paaiškinimas vaikui apie rinkos krepšelį.",
    tip: "Tinka kaip pirmas žingsnis aiškinant, kodėl nereikia visko dėti į vieną vietą.",
  },
  stocks: {
    title: "Akcijų pažinimas",
    risk: "Vidutinė - aukštesnė rizika",
    summary: "Skirta mokytis, kaip veikia pavienės įmonės akcijos ir kodėl jų vertė svyruoja.",
    tip: "Vaikui rodoma, kad pavienės akcijos yra svyruojančios ir reikalauja daugiau atsargumo.",
  },
  green: {
    title: "Žalieji projektai",
    risk: "Vidutinė rizika",
    summary: "Investavimo kategorija, susieta su tvarumu, energija ir ilgalaikėmis temomis.",
    tip: "Padeda susieti investavimą su vaikui suprantamomis temomis, pvz., aplinka ir ateitimi.",
  },
};

const quizQuestions = [
  {
    question: "Kas vaikui svarbiausia gavus kišenpinigius?",
    helper: "Pagalvok ne tik apie išleidimą šiandien, bet ir apie įprotį ateičiai.",
    options: [
      "Viską kuo greičiau išleisti",
      "Atskirti dalį taupymui ir tik tada spręsti, ką leisti",
      "Leisti tik tada, kai tėvai pasako",
    ],
    correctIndex: 1,
    feedback:
      "Teisingai - pirmiausia atskyrus dalį taupymui, vaikas kuria sveiką finansinį įprotį.",
  },
  {
    question: "Ką reiškia investavimo rizika?",
    helper: "Čia svarbu suprasti, kad vertė ne visada kyla.",
    options: [
      "Kad pinigai visada auga vienodai",
      "Kad investicijos vertė gali ir kilti, ir kristi",
      "Kad tėvai visada padengs nuostolius",
    ],
    correctIndex: 1,
    feedback:
      "Teisingai - rizika reiškia, kad vertė gali svyruoti, todėl reikia mokytis atsakingai.",
  },
  {
    question: "Kodėl tėvų limitai naudingi?",
    helper: "Atsakymas susijęs su savikontrole ir mokymusi planuoti.",
    options: [
      "Kad vaikas negalėtų nieko nusipirkti",
      "Kad vaikas mokytųsi valdyti sumą ir neviršytų ribos",
      "Kad būtų galima slėpti pinigus nuo vaiko",
    ],
    correctIndex: 1,
    feedback:
      "Teisingai - limitai padeda ugdyti planavimą ir suprasti, kad biudžetas turi ribas.",
  },
];

const advisorPrompts = {
  parent: [
    {
      mood: "focused",
      title: "Tėvų patarimas",
      text: "Patikrink, ar savaitinis išleidimo limitas dar atitinka vaiko amžių ir tikslą.",
    },
    {
      mood: "warning",
      title: "Push rekomendacija",
      text: "Įjunk push pranešimą, jei vaikas priartėja prie limito, kad galėtum sureaguoti anksčiau.",
    },
    {
      mood: "success",
      title: "Motyvacijos momentas",
      text: "Kai vaikas pasiekia 50% tikslo, gali aktyvuoti papildomą prisidėjimą vienu paspaudimu.",
    },
  ],
  child: [
    {
      mood: "success",
      title: "Sveikas, aš Taupyk!",
      text: "Jei šiandien nieko nepirksi impulsyviai, arčiau tikslo priartėsi greičiau nei atrodo.",
    },
    {
      mood: "focused",
      title: "Mažas klausimas",
      text: "Prieš leisdamas pinigus pagalvok: ar šitas daiktas svarbesnis už tavo didįjį tikslą?",
    },
    {
      mood: "warning",
      title: "Dėmesio limitui",
      text: "Artėji prie savaitės limito - verta stabtelėti ir palyginti, kiek liko iki svajonės.",
    },
  ],
};

let currentQuestion = 0;
let advisorIndex = 0;
let advisorTimer = null;

const elements = {
  modeButtons: Array.from(document.querySelectorAll("[data-mode]")),
  parentControls: document.querySelector("#parentControls"),
  childNotice: document.querySelector("#childNotice"),
  allowance: document.querySelector("#allowance"),
  spendLimit: document.querySelector("#spendLimit"),
  savePercent: document.querySelector("#savePercent"),
  investPercent: document.querySelector("#investPercent"),
  goalAmount: document.querySelector("#goalAmount"),
  goalProgress: document.querySelector("#goalProgress"),
  matchPercent: document.querySelector("#matchPercent"),
  allowanceValue: document.querySelector("#allowanceValue"),
  spendLimitValue: document.querySelector("#spendLimitValue"),
  savePercentValue: document.querySelector("#savePercentValue"),
  investPercentValue: document.querySelector("#investPercentValue"),
  goalAmountValue: document.querySelector("#goalAmountValue"),
  goalProgressValue: document.querySelector("#goalProgressValue"),
  matchPercentValue: document.querySelector("#matchPercentValue"),
  spendAmount: document.querySelector("#spendAmount"),
  saveAmount: document.querySelector("#saveAmount"),
  investAmount: document.querySelector("#investAmount"),
  spendPercentValue: document.querySelector("#spendPercentValue"),
  savedAmount: document.querySelector("#savedAmount"),
  savedPercent: document.querySelector("#savedPercent"),
  parentContribution: document.querySelector("#parentContribution"),
  remainingAmount: document.querySelector("#remainingAmount"),
  progressFill: document.querySelector("#progressFill"),
  notificationBanner: document.querySelector("#notificationBanner"),
  walletAmount: document.querySelector("#walletAmount"),
  heroSpend: document.querySelector("#heroSpend"),
  heroSave: document.querySelector("#heroSave"),
  heroInvest: document.querySelector("#heroInvest"),
  heroRoleLabel: document.querySelector("#heroRoleLabel"),
  heroRoleDescription: document.querySelector("#heroRoleDescription"),
  roleSummaryTitle: document.querySelector("#roleSummaryTitle"),
  roleSummaryDescription: document.querySelector("#roleSummaryDescription"),
  roleAbilityList: document.querySelector("#roleAbilityList"),
  limitStatus: document.querySelector("#limitStatus"),
  limitMeta: document.querySelector("#limitMeta"),
  limitSpent: document.querySelector("#limitSpent"),
  limitRemaining: document.querySelector("#limitRemaining"),
  parentAlert: document.querySelector("#parentAlert"),
  parentAlertCopy: document.querySelector("#parentAlertCopy"),
  avatarCard: document.querySelector("#avatarCard"),
  avatarMood: document.querySelector("#avatarMood"),
  avatarTitle: document.querySelector("#avatarTitle"),
  avatarPrompt: document.querySelector("#avatarPrompt"),
  avatarMeta: document.querySelector("#avatarMeta"),
  nextTipButton: document.querySelector("#nextTipButton"),
  rulesList: document.querySelector("#rulesList"),
  categoryCards: Array.from(document.querySelectorAll(".category-card")),
  categoryTitle: document.querySelector("#categoryTitle"),
  categoryRisk: document.querySelector("#categoryRisk"),
  categorySummary: document.querySelector("#categorySummary"),
  categoryTip: document.querySelector("#categoryTip"),
  childSettingAllowance: document.querySelector("#childSettingAllowance"),
  childSettingLimit: document.querySelector("#childSettingLimit"),
  childSettingSave: document.querySelector("#childSettingSave"),
  childSettingInvest: document.querySelector("#childSettingInvest"),
  childSettingGoal: document.querySelector("#childSettingGoal"),
  childSettingMatch: document.querySelector("#childSettingMatch"),
  quizQuestion: document.querySelector("#quizQuestion"),
  quizHelper: document.querySelector("#quizHelper"),
  quizOptions: document.querySelector("#quizOptions"),
  quizFeedback: document.querySelector("#quizFeedback"),
  nextQuestion: document.querySelector("#nextQuestion"),
};

function formatCurrency(value) {
  return `${value.toFixed(2).replace(".00", "")} EUR`;
}

function clampPercentages() {
  const totalLocked = state.savePercent + state.investPercent;
  if (totalLocked > 100) {
    state.investPercent = Math.max(0, 100 - state.savePercent);
    elements.investPercent.value = String(state.investPercent);
  }
}

function getSpendPercent() {
  return Math.max(0, 100 - state.savePercent - state.investPercent);
}

function getSpendAmount() {
  return (state.allowance * getSpendPercent()) / 100;
}

function getSaveAmount() {
  return (state.allowance * state.savePercent) / 100;
}

function getInvestAmount() {
  return (state.allowance * state.investPercent) / 100;
}

function getSavedAmount() {
  return (state.goalAmount * state.goalProgress) / 100;
}

function getParentContribution() {
  return state.goalProgress >= MATCH_THRESHOLD
    ? (state.goalAmount * state.matchPercent) / 100
    : 0;
}

function buildRoleSummary() {
  if (state.mode === "parent") {
    elements.heroRoleLabel.textContent = "Tėvų režimas";
    elements.heroRoleDescription.textContent =
      "Tėvai gali nustatyti limitus, paskirstymą, gauti įspėjimus ir valdyti prisidėjimą prie tikslų.";
    elements.roleSummaryTitle.textContent = "Tėvai valdo taisykles ir pranešimus";
    elements.roleSummaryDescription.textContent =
      "Šiame režime gali keisti limitus, investavimo kategorijas ir įjungti įspėjimus, kai vaikas artėja prie ribos.";
    elements.roleAbilityList.innerHTML = `
      <li>Gali keisti išleidimo limitą ir procentus.</li>
      <li>Gali pasirinkti investavimo kategoriją.</li>
      <li>Gali matyti push įspėjimus ir aktyvuoti prisidėjimą.</li>
    `;
  } else {
    elements.heroRoleLabel.textContent = "Vaiko režimas";
    elements.heroRoleDescription.textContent =
      "Vaikas mato savo ribas, tikslus, viktorinas ir asistento patarimus, bet negali keisti nustatymų.";
    elements.roleSummaryTitle.textContent = "Vaikas mato, bet neperrašo taisyklių";
    elements.roleSummaryDescription.textContent =
      "Vaikui rodomas nustatytas limitas, investavimo kišenė ir tikslai. Keitimai palikti tik tėvams.";
    elements.roleAbilityList.innerHTML = `
      <li>Gali matyti savo limitą ir pažangą.</li>
      <li>Gali spręsti klausimus ir gauti avataro patarimus.</li>
      <li>Negali keisti tėvų nustatytų taisyklių.</li>
    `;
  }
}

function buildRules() {
  const spendPercent = getSpendPercent();
  const overLimit = state.spentSoFar > state.spendLimit;
  const nearLimit = !overLimit && state.spentSoFar >= state.spendLimit * 0.8;
  const thresholdReached = state.goalProgress >= MATCH_THRESHOLD;
  const notifications = [
    `Užrakina ${state.savePercent}% taupymui ir ${state.investPercent}% investavimo kišenei.`,
    `Tėvų režime galima keisti savaitinį išleidimo limitą iki ${formatCurrency(state.spendLimit)}.`,
    thresholdReached
      ? `Tikslas pasiekė ${state.goalProgress}%, todėl galima įjungti ${state.matchPercent}% tėvų prisidėjimą.`
      : `Kol kas pasiekta ${state.goalProgress}% tikslo, todėl prisidėjimas dar laukia ${MATCH_THRESHOLD}% ribos.`,
    overLimit
      ? "Vaikas viršijo limitą - siunčiamas skubus push pranešimas tėvams."
      : nearLimit
        ? "Vaikas artėja prie limito - siunčiamas ankstyvas perspėjimas."
        : `Vaikas dar turi saugią atsargą iki limito ir gali planuoti likusius ${formatCurrency(
            Math.max(0, state.spendLimit - state.spentSoFar),
          )}.`,
  ];

  elements.rulesList.innerHTML = "";
  notifications.forEach((rule) => {
    const item = document.createElement("li");
    item.textContent = rule;
    elements.rulesList.appendChild(item);
  });
}

function renderCategoryDetails() {
  const category = investingCategories[state.selectedCategory];
  elements.categoryTitle.textContent = category.title;
  elements.categoryRisk.textContent = category.risk;
  elements.categorySummary.textContent = category.summary;
  elements.categoryTip.textContent = category.tip;

  elements.categoryCards.forEach((card) => {
    const active = card.dataset.category === state.selectedCategory;
    card.classList.toggle("active", active);
    card.setAttribute("aria-pressed", String(active));
  });
}

function renderChildSettings() {
  elements.childSettingAllowance.textContent = formatCurrency(state.allowance);
  elements.childSettingLimit.textContent = formatCurrency(state.spendLimit);
  elements.childSettingSave.textContent = `${state.savePercent}%`;
  elements.childSettingInvest.textContent = `${state.investPercent}%`;
  elements.childSettingGoal.textContent = formatCurrency(state.goalAmount);
  elements.childSettingMatch.textContent = `${state.matchPercent}%`;
}

function renderLimitPanel() {
  const remaining = Math.max(0, state.spendLimit - state.spentSoFar);
  const overLimit = state.spentSoFar > state.spendLimit;
  const nearLimit = !overLimit && state.spentSoFar >= state.spendLimit * 0.8;

  elements.limitSpent.textContent = formatCurrency(state.spentSoFar);
  elements.limitRemaining.textContent = formatCurrency(remaining);

  if (overLimit) {
    elements.limitStatus.textContent = "Viršytas limitas";
    elements.limitStatus.className = "status-pill danger";
    elements.limitMeta.textContent = "Sistema siunčia skubų įspėjimą tėvams.";
    elements.parentAlert.textContent = "Skubus push pranešimas";
    elements.parentAlert.className = "status-pill danger";
    elements.parentAlertCopy.textContent =
      "Vaikas viršijo savaitinį limitą. Tėvai gauna push žinutę ir gali laikinai sustabdyti papildomas išlaidas.";
  } else if (nearLimit) {
    elements.limitStatus.textContent = "Artėjama prie limito";
    elements.limitStatus.className = "status-pill warning";
    elements.limitMeta.textContent = "Tėvams siunčiamas ankstyvas perspėjimas.";
    elements.parentAlert.textContent = "Perspėjimo push";
    elements.parentAlert.className = "status-pill warning";
    elements.parentAlertCopy.textContent =
      "Vaikas sunaudojo didžiąją dalį limito, todėl sistema primena sustoti ir peržiūrėti tikslą.";
  } else {
    elements.limitStatus.textContent = "Limitas kontroliuojamas";
    elements.limitStatus.className = "status-pill success";
    elements.limitMeta.textContent = "Išlaidos dar telpa į nustatytą ribą.";
    elements.parentAlert.textContent = "Stebėjimas aktyvus";
    elements.parentAlert.className = "status-pill success";
    elements.parentAlertCopy.textContent =
      "Sistema toliau stebi išlaidas ir praneš tik tada, kai vaikas priartės prie ribos.";
  }
}

function renderAdvisorPrompt(indexOverride) {
  const prompts = advisorPrompts[state.mode];
  if (typeof indexOverride === "number") {
    advisorIndex = indexOverride % prompts.length;
  }

  const activePrompt = prompts[advisorIndex];
  elements.avatarCard.className = `advisor-card ${activePrompt.mood}`;
  elements.avatarMood.textContent =
    activePrompt.mood === "warning"
      ? "Perspėjimas"
      : activePrompt.mood === "success"
        ? "Motyvacija"
        : "Patarimas";
  elements.avatarTitle.textContent = activePrompt.title;
  elements.avatarPrompt.textContent = activePrompt.text;
  elements.avatarMeta.textContent =
    state.mode === "parent"
      ? "Rodo, kokį push pranešimą ar veiksmą matytų tėvai."
      : "Rodo, kokį patarimą vaikas matytų programėlėje.";
}

function restartAdvisorRotation() {
  if (advisorTimer) {
    clearInterval(advisorTimer);
  }

  advisorTimer = setInterval(() => {
    const prompts = advisorPrompts[state.mode];
    advisorIndex = (advisorIndex + 1) % prompts.length;
    renderAdvisorPrompt();
  }, ADVISOR_ROTATION_MS);
}

function renderCalculator() {
  clampPercentages();

  const thresholdReached = state.goalProgress >= MATCH_THRESHOLD;
  const spendPercent = getSpendPercent();
  const spendAmount = getSpendAmount();
  const saveAmount = getSaveAmount();
  const investAmount = getInvestAmount();
  const savedAmount = getSavedAmount();
  const parentContribution = getParentContribution();
  const totalCovered = Math.min(state.goalAmount, savedAmount + parentContribution);
  const remainingAmount = Math.max(0, state.goalAmount - totalCovered);

  elements.allowanceValue.textContent = formatCurrency(state.allowance);
  elements.spendLimitValue.textContent = formatCurrency(state.spendLimit);
  elements.savePercentValue.textContent = `${state.savePercent}%`;
  elements.investPercentValue.textContent = `${state.investPercent}%`;
  elements.goalAmountValue.textContent = formatCurrency(state.goalAmount);
  elements.goalProgressValue.textContent = `${state.goalProgress}%`;
  elements.matchPercentValue.textContent = `${state.matchPercent}%`;

  elements.spendAmount.textContent = formatCurrency(spendAmount);
  elements.saveAmount.textContent = formatCurrency(saveAmount);
  elements.investAmount.textContent = formatCurrency(investAmount);
  elements.spendPercentValue.textContent = `${spendPercent}%`;

  elements.savedAmount.textContent = formatCurrency(savedAmount);
  elements.savedPercent.textContent = `${state.goalProgress}%`;
  elements.parentContribution.textContent = formatCurrency(parentContribution);
  elements.remainingAmount.textContent = formatCurrency(remainingAmount);
  elements.progressFill.style.width = `${Math.min(100, state.goalProgress)}%`;

  elements.walletAmount.textContent = formatCurrency(state.allowance);
  elements.heroSpend.textContent = formatCurrency(spendAmount);
  elements.heroSave.textContent = formatCurrency(saveAmount);
  elements.heroInvest.textContent = formatCurrency(investAmount);

  if (thresholdReached) {
    elements.notificationBanner.textContent = `Pranešimas tėvams: vaikas pasiekė ${state.goalProgress}% tikslo, galima aktyvuoti ${state.matchPercent}% prisidėjimą.`;
    elements.notificationBanner.className = "notification-banner success";
  } else {
    elements.notificationBanner.textContent = `Pranešimas dar neišsiųstas - tėvai bus informuoti, kai vaikas pasieks bent ${MATCH_THRESHOLD}% tikslo.`;
    elements.notificationBanner.className = "notification-banner pending";
  }

  buildRoleSummary();
  buildRules();
  renderCategoryDetails();
  renderChildSettings();
  renderLimitPanel();
}

function renderMode() {
  const isParent = state.mode === "parent";
  elements.modeButtons.forEach((button) => {
    const active = button.dataset.mode === state.mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  elements.parentControls.hidden = !isParent;
  elements.childNotice.hidden = isParent;

  [
    elements.allowance,
    elements.spendLimit,
    elements.savePercent,
    elements.investPercent,
    elements.goalAmount,
    elements.goalProgress,
    elements.matchPercent,
  ].forEach((input) => {
    input.disabled = !isParent;
  });

  elements.categoryCards.forEach((card) => {
    if (isParent) {
      card.removeAttribute("aria-disabled");
    } else {
      card.setAttribute("aria-disabled", "true");
    }
  });

  advisorIndex = 0;
  renderAdvisorPrompt(0);
  restartAdvisorRotation();
  renderCalculator();
}

function renderQuiz() {
  const item = quizQuestions[currentQuestion];
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
      Array.from(elements.quizOptions.children).forEach((optionButton, optionIndex) => {
        optionButton.classList.remove("correct", "wrong");
        if (optionIndex === item.correctIndex) {
          optionButton.classList.add("correct");
        } else if (optionIndex === index && !correct) {
          optionButton.classList.add("wrong");
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

function attachControl(input, key) {
  input.addEventListener("input", (event) => {
    if (state.mode !== "parent") {
      return;
    }

    state[key] = Number(event.target.value);
    renderCalculator();
  });
}

elements.modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    renderMode();
  });
});

elements.categoryCards.forEach((card) => {
  card.addEventListener("click", () => {
    if (state.mode !== "parent") {
      return;
    }

    state.selectedCategory = card.dataset.category;
    renderCategoryDetails();
    renderAdvisorPrompt();
  });
});

elements.nextTipButton.addEventListener("click", () => {
  const prompts = advisorPrompts[state.mode];
  advisorIndex = (advisorIndex + 1) % prompts.length;
  renderAdvisorPrompt();
  restartAdvisorRotation();
});

attachControl(elements.allowance, "allowance");
attachControl(elements.spendLimit, "spendLimit");
attachControl(elements.savePercent, "savePercent");
attachControl(elements.investPercent, "investPercent");
attachControl(elements.goalAmount, "goalAmount");
attachControl(elements.goalProgress, "goalProgress");
attachControl(elements.matchPercent, "matchPercent");

elements.nextQuestion.addEventListener("click", () => {
  currentQuestion = (currentQuestion + 1) % quizQuestions.length;
  renderQuiz();
});

renderQuiz();
renderMode();
