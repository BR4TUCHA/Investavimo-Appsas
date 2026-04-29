const MATCH_THRESHOLD = 50;
const PROMPT_ROTATION_MS = 8000;

const state = {
  mode: "parent",
  allowance: 65,
  weeklyLimit: 25,
  spentThisWeek: 18,
  savePercent: 30,
  investPercent: 20,
  goalAmount: 160,
  goalProgress: 45,
  matchPercent: 50,
  profile: "balanced",
  pushEnabled: true,
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

const quizQuestions = [
  {
    question: "Kas vaikui svarbiausia gavus kišenpinigius?",
    helper: "Pagalvok ne tik apie šiandienos norą, bet ir apie įprotį ateičiai.",
    options: [
      "Viską kuo greičiau išleisti",
      "Atskirti dalį taupymui ir tik tada spręsti, ką leisti",
      "Niekada nieko neleisti",
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
      "Teisingai - rizika reiškia, kad investicijos gali svyruoti, todėl sprendimai daromi atsakingai.",
  },
  {
    question: "Kodėl tėvų limitai naudingi?",
    helper: "Atsakymas susijęs su planavimu, o ne draudimu viską pirkti.",
    options: [
      "Kad vaikas negalėtų nieko nusipirkti",
      "Kad vaikas mokytųsi valdyti sumą ir neviršytų ribos",
      "Kad būtų slepiami pinigai nuo vaiko",
    ],
    correctIndex: 1,
    feedback:
      "Teisingai - limitai padeda ugdyti savikontrolę ir suprasti, kad biudžetas turi ribas.",
  },
];

let currentQuestion = 0;
let currentPromptIndex = 0;
let promptTimer = null;

const elements = {
  roleButtons: Array.from(document.querySelectorAll("[data-role-target]")),
  parentControls: Array.from(document.querySelectorAll("[data-parent-control]")),
  profileButtons: Array.from(document.querySelectorAll("[data-profile]")),
  roleCaption: document.querySelector("#roleCaption"),
  roleDescription: document.querySelector("#roleDescription"),
  controlModeBanner: document.querySelector("#controlModeBanner"),
  allowance: document.querySelector("#allowance"),
  weeklyLimit: document.querySelector("#weeklyLimit"),
  spentThisWeek: document.querySelector("#spentThisWeek"),
  savePercent: document.querySelector("#savePercent"),
  investPercent: document.querySelector("#investPercent"),
  goalAmount: document.querySelector("#goalAmount"),
  goalProgress: document.querySelector("#goalProgress"),
  matchPercent: document.querySelector("#matchPercent"),
  allowanceValue: document.querySelector("#allowanceValue"),
  weeklyLimitValue: document.querySelector("#weeklyLimitValue"),
  spentThisWeekValue: document.querySelector("#spentThisWeekValue"),
  savePercentValue: document.querySelector("#savePercentValue"),
  investPercentValue: document.querySelector("#investPercentValue"),
  goalAmountValue: document.querySelector("#goalAmountValue"),
  goalProgressValue: document.querySelector("#goalProgressValue"),
  matchPercentValue: document.querySelector("#matchPercentValue"),
  walletAmount: document.querySelector("#walletAmount"),
  walletStatusPill: document.querySelector("#walletStatusPill"),
  heroSpend: document.querySelector("#heroSpend"),
  heroSave: document.querySelector("#heroSave"),
  heroInvest: document.querySelector("#heroInvest"),
  heroWeeklyLimit: document.querySelector("#heroWeeklyLimit"),
  heroSpent: document.querySelector("#heroSpent"),
  spendAmount: document.querySelector("#spendAmount"),
  saveAmount: document.querySelector("#saveAmount"),
  investAmount: document.querySelector("#investAmount"),
  weeklyLimitAmount: document.querySelector("#weeklyLimitAmount"),
  spentAmount: document.querySelector("#spentAmount"),
  limitStatus: document.querySelector("#limitStatus"),
  investmentProfileTitle: document.querySelector("#investmentProfileTitle"),
  investmentProfileStatus: document.querySelector("#investmentProfileStatus"),
  investmentGrid: document.querySelector("#investmentGrid"),
  savedAmount: document.querySelector("#savedAmount"),
  savedPercent: document.querySelector("#savedPercent"),
  parentContribution: document.querySelector("#parentContribution"),
  remainingAmount: document.querySelector("#remainingAmount"),
  progressFill: document.querySelector("#progressFill"),
  notificationBanner: document.querySelector("#notificationBanner"),
  pushStatus: document.querySelector("#pushStatus"),
  notificationList: document.querySelector("#notificationList"),
  assistantMessage: document.querySelector("#assistantMessage"),
  assistantTags: document.querySelector("#assistantTags"),
  nextPrompt: document.querySelector("#nextPrompt"),
  enablePush: document.querySelector("#enablePush"),
  rulesList: document.querySelector("#rulesList"),
  quizQuestion: document.querySelector("#quizQuestion"),
  quizHelper: document.querySelector("#quizHelper"),
  quizRoleNote: document.querySelector("#quizRoleNote"),
  quizOptions: document.querySelector("#quizOptions"),
  quizFeedback: document.querySelector("#quizFeedback"),
  nextQuestion: document.querySelector("#nextQuestion"),
  toastStack: document.querySelector("#toastStack"),
};

function formatCurrency(value) {
  const rounded = Math.round(value * 100) / 100;
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(2)} EUR`;
}

function clampPercentages() {
  const locked = state.savePercent + state.investPercent;
  if (locked > 100) {
    state.investPercent = Math.max(0, 100 - state.savePercent);
    elements.investPercent.value = String(state.investPercent);
  }
}

function getMetrics() {
  clampPercentages();

  const spendPercent = Math.max(0, 100 - state.savePercent - state.investPercent);
  const spendAmount = (state.allowance * spendPercent) / 100;
  const saveAmount = (state.allowance * state.savePercent) / 100;
  const investAmount = (state.allowance * state.investPercent) / 100;
  const savedAmount = (state.goalAmount * state.goalProgress) / 100;
  const thresholdReached = state.goalProgress >= MATCH_THRESHOLD;
  const parentContribution = thresholdReached ? (state.goalAmount * state.matchPercent) / 100 : 0;
  const totalCovered = Math.min(state.goalAmount, savedAmount + parentContribution);
  const remainingAmount = Math.max(0, state.goalAmount - totalCovered);
  const overLimit = state.spentThisWeek > state.weeklyLimit;
  const nearLimit = !overLimit && state.spentThisWeek >= state.weeklyLimit * 0.8;
  const remainingLimit = Math.max(0, state.weeklyLimit - state.spentThisWeek);

  return {
    spendPercent,
    spendAmount,
    saveAmount,
    investAmount,
    savedAmount,
    thresholdReached,
    parentContribution,
    remainingAmount,
    overLimit,
    nearLimit,
    remainingLimit,
  };
}

function getCurrentProfile() {
  return investmentProfiles[state.profile];
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

function buildAssistantPrompts(metrics) {
  const profile = getCurrentProfile();
  const common = [
    {
      text: `Šiuo metu aktyvus ${profile.title.toLowerCase()} - verta su vaiku aptarti, kuo skiriasi kategorijos ir rizika.`,
      tags: ["investavimas", profile.title],
    },
  ];

  if (state.mode === "parent") {
    common.unshift(
      {
        text: `Tėvų režime gali keisti limitus, o vaikui bus rodoma tik jau nustatyta riba - dabar tai ${formatCurrency(
          state.weeklyLimit,
        )} per savaitę.`,
        tags: ["tėvų kontrolė", "limitas"],
      },
      {
        text: state.pushEnabled
          ? "Push pranešimai įjungti - sistema iškart įspės, jei limitas bus viršytas arba priartės prie ribos."
          : "Push pranešimai išjungti - verta juos įjungti, kad tėvai greitai reaguotų į ribos pasiekimą.",
        tags: ["push", state.pushEnabled ? "aktyvuota" : "išjungta"],
      },
    );

    if (metrics.overLimit) {
      common.unshift({
        text: `Vaikas jau viršijo limitą ${formatCurrency(
          state.weeklyLimit,
        )}. Laikas siųsti skubų pranešimą ir peržiūrėti savaitės planą.`,
        tags: ["skubu", "viršytas limitas"],
      });
    } else if (metrics.nearLimit) {
      common.unshift({
        text: `Vaikas artėja prie savaitės ribos - liko tik ${formatCurrency(
          metrics.remainingLimit,
        )}. Tinkamas metas švelniam perspėjimui.`,
        tags: ["perspėjimas", "limitas"],
      });
    }

    if (metrics.thresholdReached) {
      common.push({
        text: `Tikslas pasiekė ${state.goalProgress}% - gali aktyvuoti ${state.matchPercent}% tėvų prisidėjimą prie pirkinio.`,
        tags: ["tikslas", "prisidėjimas"],
      });
    }
  } else {
    common.unshift(
      {
        text: `Vaiko režime limitų pakeisti negalima, bet matai savo savaitės ribą: ${formatCurrency(
          state.weeklyLimit,
        )}.`,
        tags: ["vaiko režimas", "matymas"],
      },
      {
        text: `Šią savaitę jau išleidai ${formatCurrency(
          state.spentThisWeek,
        )}. Prieš kitą pirkimą palygink, kiek liko iki tikslo.`,
        tags: ["savitvarda", "biudžetas"],
      },
    );

    if (metrics.overLimit) {
      common.unshift({
        text: "Savaitės limitas jau viršytas - metas sustoti ir pasitarti su tėvais, ką daryti toliau.",
        tags: ["stop", "limitas"],
      });
    } else if (metrics.nearLimit) {
      common.unshift({
        text: "Artėji prie limito - gal verta palaukti prieš dar vieną pirkinį ir išsaugoti dalį tikslui?",
        tags: ["perspėjimas", "tikslas"],
      });
    }
  }

  return common;
}

function renderAssistant(metrics, randomize = false) {
  const prompts = buildAssistantPrompts(metrics);
  if (randomize) {
    let nextIndex = currentPromptIndex;
    if (prompts.length > 1) {
      while (nextIndex === currentPromptIndex) {
        nextIndex = Math.floor(Math.random() * prompts.length);
      }
    }
    currentPromptIndex = nextIndex;
  } else {
    currentPromptIndex %= prompts.length;
  }

  const prompt = prompts[currentPromptIndex];
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

function buildNotificationItems(metrics) {
  const items = [];

  if (metrics.overLimit) {
    items.push({
      tone: "danger",
      title: "Skubus įspėjimas",
      text: `Viršytas savaitės limitas ${formatCurrency(state.weeklyLimit)}. Tėvams siunčiamas skubus push pranešimas.`,
    });
  } else if (metrics.nearLimit) {
    items.push({
      tone: "warning",
      title: "Ankstyvas perspėjimas",
      text: `Vaikas išleido ${formatCurrency(
        state.spentThisWeek,
      )}, todėl sistema įspėja tėvus dar prieš viršijant ribą.`,
    });
  } else {
    items.push({
      tone: "success",
      title: "Stebėjimas aktyvus",
      text: `Vaikas dar turi ${formatCurrency(metrics.remainingLimit)} iki savaitės limito.`,
    });
  }

  if (metrics.thresholdReached) {
    items.push({
      tone: "success",
      title: "Tikslas pasiektas 50%+",
      text: `Galima aktyvuoti ${state.matchPercent}% tėvų prisidėjimą prie taupymo tikslo.`,
    });
  } else {
    items.push({
      tone: "info",
      title: "Tikslo stebėjimas",
      text: `Iki tėvų prisidėjimo slenksčio dar trūksta ${MATCH_THRESHOLD - state.goalProgress}% progreso.`,
    });
  }

  items.push({
    tone: state.pushEnabled ? "info" : "warning",
    title: state.pushEnabled ? "Push aktyvūs" : "Push išjungti",
    text: state.pushEnabled
      ? "Tėvų telefonas gaus pranešimus apie limitą ir tikslą."
      : "Įspėjimai rodomi tik programėlėje, kol push pranešimai išjungti.",
  });

  return items;
}

function renderNotifications(metrics) {
  elements.notificationList.innerHTML = "";
  buildNotificationItems(metrics).forEach((item) => {
    const row = document.createElement("li");
    row.className = `notification-item ${item.tone}`;
    row.innerHTML = `
      <strong>${item.title}</strong>
      <span>${item.text}</span>
    `;
    elements.notificationList.appendChild(row);
  });

  elements.pushStatus.textContent = state.pushEnabled ? "Push aktyvūs" : "Push išjungti";
  elements.pushStatus.className = `status-pill ${state.pushEnabled ? "success" : "warning"}`;
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

  elements.profileButtons.forEach((button) => {
    const active = button.dataset.profile === state.profile;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderRules(metrics) {
  const rules = [
    `Užrakina ${state.savePercent}% taupymui ir ${state.investPercent}% investavimui, todėl ne viskas gali būti išleista iš karto.`,
    state.mode === "parent"
      ? "Tėvai šiuo metu gali valdyti limitus, procentus ir investavimo profilį."
      : "Vaiko režime visi valdymo nustatymai užrakinti - lieka tik matymas ir mokymasis.",
    metrics.overLimit
      ? "Vaikas viršijo limitą, todėl sistema sugeneruoja skubų perspėjimą."
      : metrics.nearLimit
        ? "Vaikas artėja prie limito, todėl sugeneruojamas ankstyvas push perspėjimas."
        : "Sistema stebi išlaidas ir laukia, kol bus pasiekta perspėjimo riba.",
    metrics.thresholdReached
      ? `Tikslas pasiekė ${state.goalProgress}% - tėvams rodoma galimybė padengti ${state.matchPercent}% tikslo.`
      : "Kol kas tėvų prisidėjimas laukia 50% tikslo slenksčio.",
  ];

  elements.rulesList.innerHTML = "";
  rules.forEach((rule) => {
    const item = document.createElement("li");
    item.textContent = rule;
    elements.rulesList.appendChild(item);
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
    button.disabled = !isParent;
    button.classList.toggle("locked", !isParent);
  });

  elements.roleCaption.textContent = `Aktyvus režimas: ${isParent ? "tėvai" : "vaikas"}`;
  elements.roleDescription.textContent = isParent
    ? "Tėvai nustato išlaidų ribas, investavimo kategorijas ir gauna pranešimus, o vaikai mato tik tai, kas jiems leidžiama: limitus, tikslus ir klausimus mokymuisi."
    : "Vaikas mato savo limitą, tikslą, investavimo kryptis ir klausimus. Taisyklės rodomos, bet jų pakeisti negalima.";
  elements.controlModeBanner.textContent = isParent
    ? "Tėvų režimas aktyvus - galima valdyti limitus, tikslus ir investavimo profilį."
    : "Vaiko režimas aktyvus - visi nustatymai rodomi tik skaitymui, keisti jų negalima.";
  elements.quizRoleNote.textContent = `Dabartinis režimas: ${isParent ? "tėvai" : "vaikas"}.`;

  if (metrics.overLimit) {
    elements.walletStatusPill.textContent = isParent ? "Reikia tėvų reakcijos" : "Viršytas limitas";
    elements.walletStatusPill.className = "status-pill danger";
  } else if (metrics.nearLimit) {
    elements.walletStatusPill.textContent = isParent ? "Artėja prie ribos" : "Dėmesio limitui";
    elements.walletStatusPill.className = "status-pill warning";
  } else {
    elements.walletStatusPill.textContent = isParent ? "Tėvų limitas aktyvus" : "Riba kontroliuojama";
    elements.walletStatusPill.className = "status-pill success";
  }
}

function renderSummary(metrics) {
  elements.allowanceValue.textContent = formatCurrency(state.allowance);
  elements.weeklyLimitValue.textContent = formatCurrency(state.weeklyLimit);
  elements.spentThisWeekValue.textContent = formatCurrency(state.spentThisWeek);
  elements.savePercentValue.textContent = `${state.savePercent}%`;
  elements.investPercentValue.textContent = `${state.investPercent}%`;
  elements.goalAmountValue.textContent = formatCurrency(state.goalAmount);
  elements.goalProgressValue.textContent = `${state.goalProgress}%`;
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
  elements.savedAmount.textContent = formatCurrency(metrics.savedAmount);
  elements.savedPercent.textContent = `${state.goalProgress}%`;
  elements.parentContribution.textContent = formatCurrency(metrics.parentContribution);
  elements.remainingAmount.textContent = formatCurrency(metrics.remainingAmount);
  elements.progressFill.style.width = `${Math.min(100, state.goalProgress)}%`;

  if (metrics.overLimit) {
    elements.limitStatus.textContent = "Viršytas limitas";
  } else if (metrics.nearLimit) {
    elements.limitStatus.textContent = "Artėja prie ribos";
  } else {
    elements.limitStatus.textContent = "Viskas pagal planą";
  }

  if (metrics.thresholdReached) {
    elements.notificationBanner.textContent = `Pranešimas tėvams: vaikas pasiekė ${state.goalProgress}% tikslo, todėl galima įjungti ${state.matchPercent}% prisidėjimą.`;
    elements.notificationBanner.className = "notification-banner success";
  } else {
    elements.notificationBanner.textContent = `Tėvų pranešimas dar neišsiųstas - kai vaikas pasieks ${MATCH_THRESHOLD}% tikslo, bus siūloma prisidėti.`;
    elements.notificationBanner.className = "notification-banner pending";
  }
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
        : "Dar ne visai. Pagalvok apie planavimą, limitą ir atsakingą pinigų naudojimą.";
      elements.quizFeedback.className = `quiz-feedback ${correct ? "success" : "error"}`;
    });
    elements.quizOptions.appendChild(button);
  });
}

function renderAll(options = {}) {
  const metrics = getMetrics();
  renderRoleState(metrics);
  renderSummary(metrics);
  renderInvestmentGrid();
  renderNotifications(metrics);
  renderRules(metrics);
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
    currentPromptIndex = 0;
    renderAll();
    restartPromptRotation();
    showToast(
      state.mode === "parent" ? "Įjungtas tėvų režimas." : "Įjungtas vaiko režimas.",
      "info",
    );
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

attachControl(elements.allowance, "allowance");
attachControl(elements.weeklyLimit, "weeklyLimit");
attachControl(elements.spentThisWeek, "spentThisWeek");
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
renderAll();
restartPromptRotation();
