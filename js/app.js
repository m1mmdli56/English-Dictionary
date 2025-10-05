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

const words = {
  Naughty: "dəcəl",
  Nervous: "əsəbi",
  Polite: "nəzakətli",
  gallant: "nəzakətli",
  Impolite: "nəzakətsiz",
  Intelligent: "ağıllı",
  Rude: "kobud",
  Lazy: "tənbəl",
  idle: "tənbəl",
  Friendly: "səmimi",
  Unfriendly: "soyuq, səmimi olmayan",
  Selfish: "eqoist, özünü düşünən",
  silly: "axmaq, səfeh",
  foolish: "axmaq, səfeh",
  stupid: "axmaq, səfeh",
  Wise: "ağıllı",
  clever: "ağıllı",
  smart: "ağıllı",
  Fair: "düzgün, ədalətli",
  Hard: "çalışqan",
  working: "çalışqan",
  Attentive: "diqqətli",
  Inattentive: "diqqətsiz",
  Careful: "diqqətli",
  Careless: "diqqətsiz",
  Diligent: "çalışqan",
  Talented: "istedadlı",
  Calm: "sakit",
  Proud: "qürurlu",
  Hospitable: "qonaqpərvər",
  Silent: "sakit",
  Peaceful: "sakit, sülhsevər",
  Patient: "səbirli",
  Impatient: "səbirsiz",
  Honest: "düzgün, ədalətli",
  Dishonest: "vicdansız, riyakar",
  Helpful: "yardımsevər",
  Kind: "ürəyi açıq, mehriban",
  hearted: "ürəyi açıq, mehriban",
  Cheerful: "şən, gümrah",
  Serious: "ciddi",
  Brave: "cəsur",
  fearless: "cəsur",
  Greedy: "acgöz, tamahkar",
};

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

// ✅ Səslər
const correctSound = new Audio(
  "https://cdn.pixabay.com/audio/2022/03/15/audio_5c6b4e6bb1.mp3"
);
const wrongSound = new Audio(
  "https://cdn.pixabay.com/audio/2022/03/15/audio_8b3d37c69e.mp3"
);

// Başlanğıcda input və düymələr gizli
document.getElementById("answer").style.display = "none";
document.querySelector("button[onclick='checkAnswer()']").style.display =
  "none";
document.getElementById("passBtn").style.display = "none";

// İstifadəçi adı daxil etmək
function setUsername() {
  const input = document.getElementById("username").value.trim();
  const difficulty = document.getElementById("difficulty").value;

  if (input === "") {
    alert("İstifadəçi adı boş ola bilməz!");
    return;
  }

  username = input;
  setDifficulty(difficulty);

  document.getElementById("username-container").style.display = "none";
  document.getElementById("game-area").style.display = "block";

  document.querySelector("button[onclick='startGame()']").style.display =
    "inline-block";
}

// 🎮 Səviyyəyə görə vaxt və xal fərqi
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

// 🔥 Oyun başlatmaq
function startGame() {
  if (gameActive) return;

  score = 0;
  correctCount = 0;
  wrongCount = 0;
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
}

// 🧠 Sözü göstərmək
function showWord() {
  const keys = Object.keys(words);
  currentWord = keys[Math.floor(Math.random() * keys.length)];
  document.getElementById("word").innerText = currentWord;
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

  const correctVariants = words[currentWord]
    .split(",")
    .map((s) => s.trim().toLowerCase());
  const body = document.body;

  if (correctVariants.includes(userAnswer)) {
    // ✅ Doğru cavab
    score += basePoints;
    correctCount++;
    correctSound.play();
    document.getElementById("result").innerText = "✅ Doğrudur!";
    animateBackground("#9effa1");
    showWord();
  } else {
    wrongCount++;
    wrongSound.play();
    animateBackground("#ff9e9e");

    if (correctCount === 0) {
      // ❌ Əgər hələ heç düz yazmayıbsa — oyunu bitir
      document.getElementById("result").innerText =
        "❌ İlk cəhddə səhv cavab! Oyun dayandırıldı. Doğru cavab: " +
        words[currentWord];
      clearInterval(timer);
      gameActive = false;
      document.getElementById("answer").disabled = true;
      hideButtons();
      endGame();
      return;
    } else {
      // ❌ Sonradan səhv yazıbsa — xal azalır
      score = Math.max(0, score - 5);
      document.getElementById("result").innerText =
        "⚠️ Səhv cavab! -5 xal. Doğru cavab: " + words[currentWord];
      showWord();
    }
  }

  document.getElementById("score").innerText = "Xal: " + score;
  document.getElementById("answer").value = "";
}

// 🎨 Fon animasiyası
function animateBackground(color) {
  document.body.style.transition = "background-color 0.5s ease";
  document.body.style.backgroundColor = color;
  setTimeout(() => (document.body.style.backgroundColor = "#ffffff"), 600);
}

// ⏭️ Pas düyməsi funksiyası
function passWord() {
  if (!gameActive) return;
  document.getElementById("result").innerText =
    "⏭️ Keçildi! Doğru cavab: " + words[currentWord];
  showWord();
}

// 🔄 Enter ilə cavab təsdiqləmə
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && gameActive) checkAnswer();
});

// ⏰ Taymer
function updateTime() {
  timeLeft--;
  document.getElementById("time").innerText = "Vaxt: " + timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timer);
    endGame();
  }
}

// 🏁 Oyun bitmə funksiyası
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

// 🔁 Oyun yenidən başlatmaq
function restartGame() {
  startGame();
}

// 🔒 Yardımçı funksiya
function hideButtons() {
  document.getElementById("answer").style.display = "none";
  document.querySelector("button[onclick='checkAnswer()']").style.display =
    "none";
  document.getElementById("passBtn").style.display = "none";
  document.querySelector("button[onclick='startGame()']").style.display =
    "none";
}

/*  
Oyun fon rəngi dəyişir (animasiya ilə)
Düzgün/səhv cavabda səs + rəng effekti.
Səviyyəyə görə vaxt və xal fərqi.
Oyun statistikasını göstər (düzgün/səhv cavab sayı).
*/
