//  1 oyun yaradırığ həmin oyun nədən ibarətdir və necə oynanılır
//  deməli ingilis dilini öyrənmək istəyənlər üçün sadə bir oyun hazırlamağ istəyirəm
//  oyun belə olacaq ki, ekranda bir söz çıxacaq və istifadəçi həmin sözün mənasını
//  bilməlidir, əgər doğru cavab verərsə xal qazanacaq, yanlış cavab verərsə xal itirəcək
//  oyun sonunda istifadəçinin ümumi xalı göstəriləcək və ən yüksək xal qazanan istifadəçi
//  liderlər lövhəsində qeyd olunacaq
//  2 oyun üçün lazım olan sözlər və onların mənaları
//  3 oyun üçün lazım olan dəyişənlər
//  4 oyun üçün lazım olan funksiyalar
//  5 oyun başladığında ilk sözü göstərmək
//  6 saniyə qoyağ həmin saniyə içində neçə söz tapacaq
//  7 oyun bitəndə ümumi xal göstəriləcək
//  8 oyun bitəndə liderlər lövhəsi göstəriləcək
//  9 oyun üçün sadə və cəlbedici dizayn olacaq
//  10 oyun mobil və desktop üçün uyğun olacaq
//  11 oyun üçün sadə animasiyalar olacaq
//  12 oyun üçün səs effektləri olacaq
//  13 oyun üçün restart düyməsi olacaq
//  14 oyun üçün istifadəçi adı daxil etmək imkanı olacaq
//  15 oyun üçün istifadəçi adı ilə birlikdə xal qeyd olunacaq

const wordBank = {
  character: {
    Naughty: "dəcəl",
    Kind: "ürəyi açıq",
    Friendly: "səmimi",
    Rude: "kobud",
    Selfish: "eqoist",
    Brave: "cəsur",
  },
  animals: {
    Cat: "pişik",
    Dog: "it",
    Lion: "aslan",
    Bird: "quş",
    Horse: "at",
  },
  jobs: {
    Teacher: "müəllim",
    Doctor: "həkim",
    Engineer: "mühəndis",
    Chef: "aşpaz",
    Driver: "sürücü",
  },
  nature: {
    Tree: "ağac",
    Mountain: "dağ",
    River: "çay",
    Sun: "günəş",
    Rain: "yağış",
  },
};

let selectedWords = {}; // seçilmiş kateqoriyaya aid sözlər
let score = 0;
let timeLeft = 60;
let currentWord = "";
let timer;
let leaderboard = [];
let username = "";
let gameActive = false;
let correctCount = 0;
let wrongCount = 0;
let basePoints = 10;
let streak = 0;
let level = 1;

// ✅ Səslər (hazırda boş)
const correctSound = new Audio("");
const wrongSound = new Audio("");

// Başlanğıcda input və düymələr gizli
document.getElementById("answer").style.display = "none";
document.querySelector("button[onclick='checkAnswer()']").style.display =
  "none";
document.getElementById("passBtn").style.display = "none";

document
  .getElementById("darkModeToggle")
  .addEventListener("change", function () {
    document.body.dataset.theme = this.checked ? "dark" : "light";
  });

// 👤 İstifadəçi adı və kateqoriya seçimi
function setUsername() {
  const input = document.getElementById("username").value.trim();
  const difficulty = document.getElementById("difficulty").value;
  const category = document.getElementById("category").value; // kateqoriya seçimi

  if (input === "") {
    alert("İstifadəçi adı boş ola bilməz!");
    return;
  }

  username = input;
  setDifficulty(difficulty);

  // seçilmiş kateqoriyaya uyğun sözləri təyin edirik
  if (category === "all") {
    selectedWords = Object.assign({}, ...Object.values(wordBank));
  } else {
    selectedWords = wordBank[category];
  }

  document.getElementById("username-container").style.display = "none";
  document.getElementById("game-area").style.display = "block";

  document.querySelector("button[onclick='startGame()']").style.display =
    "inline-block";
  updateStatsDisplay();
}

// 🎮 Səviyyə çətinliyi
function setDifficulty(level) {
  if (level === "easy") {
    timeLeft = 60;
    basePoints = 10;
  } else if (level === "medium") {
    timeLeft = 45;
    basePoints = 15;
  } else if (level === "hard") {
    timeLeft = 30;
    basePoints = 20;
  }
}

// 🚀 Oyun başlatmaq
function startGame() {
  if (gameActive) return;

  score = 0;
  correctCount = 0;
  wrongCount = 0;
  streak = 0;
  level = 1;
  gameActive = true;

  const difficulty = document.getElementById("difficulty").value;
  setDifficulty(difficulty);

  document.getElementById("score").innerText = "Xal: " + score;
  document.getElementById("time").innerText = "Vaxt: " + timeLeft;
  document.getElementById("result").innerText = "";
  document.getElementById("leaderboard").innerHTML = "";

  document.getElementById("answer").style.display = "inline-block";
  document.getElementById("answer").disabled = false;
  document.getElementById("answer").focus();
  document.querySelector("button[onclick='checkAnswer()']").style.display =
    "inline-block";
  document.getElementById("passBtn").style.display = "inline-block";
  document.querySelector("button[onclick='startGame()']").style.display =
    "none";

  document.body.style.background = "#ffffff";

  showWord();
  clearInterval(timer);
  timer = setInterval(updateTime, 1000);
  updateStatsDisplay();
}

// 🧠 Sözü göstərmək
function showWord() {
  const keys = Object.keys(selectedWords);
  currentWord = keys[Math.floor(Math.random() * keys.length)];
  const wordEl = document.getElementById("word");
  wordEl.classList.remove("fade-in");
  void wordEl.offsetWidth; // reflow
  wordEl.classList.add("fade-in");
  wordEl.innerText = currentWord;
  document.getElementById("answer").value = "";
}

// ✅ Cavabı yoxlamaq
function checkAnswer() {
  if (!gameActive) return;

  const userAnswer = document
    .getElementById("answer")
    .value.trim()
    .toLowerCase();
  if (userAnswer === "") return;

  const correctVariants = selectedWords[currentWord]
    .split(",")
    .map((s) => s.trim().toLowerCase());

  if (correctVariants.includes(userAnswer)) {
    // ✅ Doğru cavab
    score += basePoints;
    correctCount++;
    streak++;
    correctSound.play();
    animateBackground("#9effa1");
    showWord();

    if (streak % 5 === 0) {
      score += 20;
      timeLeft += 5;
      document.getElementById(
        "result"
      ).innerText = `🎉 5 ardıcıl doğru! Bonus +20 xal və +5 saniyə!`;
    }

    if (score >= level * 100) {
      level++;
      document.getElementById("result").innerText += ` 🌟 Səviyyə ${level}!`;
      timeLeft += 10;
    }
  } else {
    wrongCount++;
    wrongSound.play();
    animateBackground("#ff9e9e");

    if (correctCount === 0) {
      document.getElementById("result").innerText =
        "❌ İlk cəhddə səhv cavab! Oyun dayandırıldı. Doğru cavab: " +
        selectedWords[currentWord];
      clearInterval(timer);
      gameActive = false;
      document.getElementById("answer").disabled = true;
      hideButtons();
      endGame();
      return;
    } else {
      score = Math.max(0, score - 5);
      streak = 0;
      document.getElementById("result").innerText =
        "⚠️ Səhv cavab! -5 xal. Doğru cavab: " + selectedWords[currentWord];
      showWord();
    }
  }

  updateStatsDisplay();
}

// 🎨 Fon rəng effekti
function animateBackground(color) {
  document.body.style.transition = "background-color 0.5s ease";
  document.body.style.backgroundColor = color;
  setTimeout(() => (document.body.style.backgroundColor = "#ffffff"), 600);
}

// ⏭️ Pass
function passWord() {
  if (!gameActive) return;
  document.getElementById("result").innerText =
    "⏭️ Keçildi! Doğru cavab: " + selectedWords[currentWord];
  showWord();
  streak = 0;
  updateStatsDisplay();
}

// ⌨️ Enter ilə cavab
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && gameActive) checkAnswer();
});

// ⏰ Taymer
function updateTime() {
  timeLeft--;
  if (timeLeft <= 0) {
    clearInterval(timer);
    endGame();
  }
  updateStatsDisplay();
}

// 🏁 Oyun sonu
function endGame() {
  gameActive = false;
  document.getElementById("word").innerText = "🕒 Oyun bitdi!";
  document.getElementById("result").innerHTML = `
    <strong>${username}</strong>, sənin nəticən: <b>${score}</b> xal<br>
    ✅ Düzgün: <b>${correctCount}</b> | ❌ Səhv: <b>${wrongCount}</b>
  `;

  hideButtons();
  document.getElementById("restartBtn").style.display = "inline-block";

  leaderboard.push({ name: username, score: score });
  leaderboard.sort((a, b) => b.score - a.score);

  let boardHTML = "<h3>Liderlər lövhəsi</h3><ol>";
  leaderboard.slice(0, 5).forEach((item) => {
    boardHTML += `<li>${item.name} — ${item.score} xal</li>`;
  });
  boardHTML += "</ol>";

  document.getElementById("leaderboard").innerHTML = boardHTML;
}

// 🔁 Yenidən başlat
function restartGame() {
  startGame();
}

// 🔒 Yardımçı
function hideButtons() {
  document.getElementById("answer").style.display = "none";
  document.querySelector("button[onclick='checkAnswer()']").style.display =
    "none";
  document.getElementById("passBtn").style.display = "none";
  document.querySelector("button[onclick='startGame()']").style.display =
    "none";
}

// 📊 Stats
function updateStatsDisplay() {
  document.getElementById("score").innerText = "Xal: " + score;
  document.getElementById("time").innerText = "Vaxt: " + timeLeft;

  if (!document.getElementById("level")) {
    const lvl = document.createElement("p");
    lvl.id = "level";
    document.getElementById("game-area").prepend(lvl);
  }
  if (!document.getElementById("streak")) {
    const st = document.createElement("p");
    st.id = "streak";
    document.getElementById("game-area").prepend(st);
  }

  document.getElementById("level").innerText = "Səviyyə: " + level;
  document.getElementById("streak").innerText = "Ardıcıl doğru: " + streak;
}
