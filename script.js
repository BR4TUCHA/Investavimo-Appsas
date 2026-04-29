const state = {
  allowance: 45,
  savePercent: 35,
  investPercent: 15,
  goalAmount: 120,
  goalProgress: 50,
  matchPercent: 50,
};

const MATCH_THRESHOLD = 50;

const quizQuestions = [
  {
    question: "Kam dažniausiai labiausiai tinka taupymas?",
    helper: "Pagalvok apie artimesnį, aiškų pirkimo tikslą.",
    options: [
      "Trumpesnio laikotarpio tikslams ir saugumui",
      "Tik labai rizikingiems sprendimams",
      "Tik tada, kai nori greito pelno",
    ],
    correctIndex: 0,
    feedback:
      "Teisingai - taupymas dažniausiai geriausiai tinka trumpesnio laikotarpio tikslams ir nenumatytiems atvejams.",
  },
  {
    question: "Ką vaikui svarbu suprasti apie investavimą?",
    helper: "Čia svarbi ne tik galima grąža, bet ir svyravimai.",
    options: [
      "Kad tai visada garantuotas pelnas",
      "Kad vertė gali ir kilti, ir kristi",
      "Kad tėvų priežiūra nėra reikalinga",
    ],
    correctIndex: 1,
    feedback:
      "Teisingai - investavimo vertė gali svyruoti, todėl sprendimus reikia priimti atsakingai.",
  },
  {
    question: "Ką reiškia sudėtinis augimas?",
    helper: "Pagalvok, kas nutinka, kai grąža pradeda auginti kitą grąžą.",
    options: [
      "Kai sutaupyti pinigai niekada nesikeičia",
      "Kai grąža pati pradeda generuoti papildomą grąžą",
      "Kai išleidi mažiau vieną savaitę",
    ],
    correctIndex: 1,
    feedback:
      "Teisingai - sudėtinis augimas reiškia, kad augti pradeda ne tik pradinė suma, bet ir ankstesnė grąža.",
  },
];

let currentQuestion = 0;

const elements = {
  allowance: document.querySelector("#allowance"),
  savePercent: document.querySelector("#savePercent"),
  investPercent: document.querySelector("#investPercent"),
  goalAmount: document.querySelector("#goalAmount"),
  goalProgress: document.querySelector("#goalProgress"),
  matchPercent: document.querySelector("#matchPercent"),
  allowanceValue: document.querySelector("#allowanceValue"),
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
  rulesList: document.querySelector("#rulesList"),
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

function buildRules(spendPercent) {
  const thresholdReached = state.goalProgress >= MATCH_THRESHOLD;
  const rules = [
    `Užrakina ${state.savePercent}% taupymui, kad pinigai nebūtų išleisti impulsyviai.`,
    `Skiria ${state.investPercent}% investavimo pradžiai su edukaciniais paaiškinimais.`,
    thresholdReached
      ? `Siunčia tėvams pranešimą, nes jau pasiekta ${state.goalProgress}% tikslo riba.`
      : `Rodo vaikui, kad iki tėvų pranešimo trūksta dar ${MATCH_THRESHOLD - state.goalProgress}% tikslo progreso.`,
    `Palieka ${spendPercent}% išleidimui, kad vaikas mokytųsi planuoti trumpalaikius pirkinius.`,
  ];

  elements.rulesList.innerHTML = "";
  rules.forEach((rule) => {
    const item = document.createElement("li");
    item.textContent = rule;
    elements.rulesList.appendChild(item);
  });
}

function renderCalculator() {
  clampPercentages();

  const thresholdReached = state.goalProgress >= MATCH_THRESHOLD;
  const spendPercent = Math.max(0, 100 - state.savePercent - state.investPercent);
  const spendAmount = (state.allowance * spendPercent) / 100;
  const saveAmount = (state.allowance * state.savePercent) / 100;
  const investAmount = (state.allowance * state.investPercent) / 100;
  const savedAmount = (state.goalAmount * state.goalProgress) / 100;
  const parentContribution = thresholdReached
    ? (state.goalAmount * state.matchPercent) / 100
    : 0;
  const totalCovered = Math.min(state.goalAmount, savedAmount + parentContribution);
  const remainingAmount = Math.max(0, state.goalAmount - totalCovered);

  elements.allowanceValue.textContent = formatCurrency(state.allowance);
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

  buildRules(spendPercent);
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
        : "Dar ne visai. Pabandyk pagalvoti apie laikotarpį, riziką ir ką norima pasiekti.";
      elements.quizFeedback.className = `quiz-feedback ${correct ? "success" : "error"}`;
    });
    elements.quizOptions.appendChild(button);
  });
}

function attachControl(input, key) {
  input.addEventListener("input", (event) => {
    state[key] = Number(event.target.value);
    renderCalculator();
  });
}

attachControl(elements.allowance, "allowance");
attachControl(elements.savePercent, "savePercent");
attachControl(elements.investPercent, "investPercent");
attachControl(elements.goalAmount, "goalAmount");
attachControl(elements.goalProgress, "goalProgress");
attachControl(elements.matchPercent, "matchPercent");

elements.nextQuestion.addEventListener("click", () => {
  currentQuestion = (currentQuestion + 1) % quizQuestions.length;
  renderQuiz();
});

renderCalculator();
renderQuiz();
