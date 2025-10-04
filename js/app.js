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
  Polite,
  galiant: "nəzakətli",
  İmpolite: "nəzakətsiz",
  İntelligent: "ağıllı",
  Rude: "kobud",
  Lazy,
  idle: "tənbəl",
  Friendly: "səmimi",
  Unfriendly: "soyuq, səmimi olmayan",
  Selfish,
  silly,
  foolish,
  stupid: "axmaq , səfeh",
  Wise,
  clever,
  smart: "ağıllı",
  Fair: "düzgün, ədalətli",
  Hard,
  working: "çalışqan",
  Attentive: "diqqətli",
  İnattentive: "diqqətsiz",
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
  İmpatient: "səbirsiz",
  Honest: "düzgün, ədalətli",
  Dishonest: "vicdansız, riyakar",
  Helpful: "yardımsevər",
  Kind,
  hearted: "ürəyi açıq",
  Cheerful: "şən, gümrah",
  Kind: "mehriban",
  Serious: "ciddi",
  Brave,
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

// Başlanğıcda input və təsdiqlə gizli
document.getElementById("answer").style.display = "none";
document.querySelector("button[onclick='checkAnswer()']").style.display =
  "none";

// İstifadəçi adı daxil etmək
function setUsername() {
  const input = document.getElementById("username").value.trim();
  if (input === "") {
    alert("İstifadəçi adı boş ola bilməz!");
    return;
  }
  username = input;
  document.getElementById("username-container").style.display = "none";
  document.getElementById("game-area").style.display = "block";

  // Başla düyməsi görünür
  document.querySelector("button[onclick='startGame()']").style.display =
    "inline-block";
}

// Oyun başlatmaq
function startGame() {
  if (gameActive) return; // oyun artıq aktivdirsə başlamağa icazə yoxdur

  score = 0;
  timeLeft = 60;
  gameActive = true;

  document.getElementById("score").innerText = "Xal: " + score;
  document.getElementById("time").innerText = "Vaxt: " + timeLeft;
  document.getElementById("result").innerText = "";
  document.getElementById("leaderboard").innerHTML = "";

  // Input və təsdiqlə görünür və aktivdir
  document.getElementById("answer").style.display = "inline-block";
  document.getElementById("answer").disabled = false;
  document.getElementById("answer").focus();
  document.querySelector("button[onclick='checkAnswer()']").style.display =
    "inline-block";

  // Başla düyməsi gizlədilir
  document.querySelector("button[onclick='startGame()']").style.display =
    "none";

  showWord();
  clearInterval(timer);
  timer = setInterval(updateTime, 1000);
}

// Sözü göstərmək
function showWord() {
  const keys = Object.keys(words);
  currentWord = keys[Math.floor(Math.random() * keys.length)];
  document.getElementById("word").innerText = currentWord;
  document.getElementById("answer").value = "";
}

// Cavabı yoxlamaq
function checkAnswer() {
  if (!gameActive) return;

  const userAnswer = document
    .getElementById("answer")
    .value.trim()
    .toLowerCase();
  if (userAnswer === words[currentWord]) {
    score += 10;
    document.getElementById("result").innerText = "✅ Doğrudur!";
    document.getElementById("correctSound")?.play();
  } else {
    score -= 5;
    document.getElementById("result").innerText =
      "❌ Səhvdir! Doğru cavab: " + words[currentWord];
    document.getElementById("wrongSound")?.play();
  }
  document.getElementById("score").innerText = "Xal: " + score;
  showWord();
}

// Enter düyməsi ilə cavab təsdiqləmə
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

// Taymer
function updateTime() {
  timeLeft--;
  document.getElementById("time").innerText = "Vaxt: " + timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timer);
    endGame();
  }
}

// Oyun bitmə funksiyası
function endGame() {
  gameActive = false;
  document.getElementById("word").innerText = "Oyun bitdi!";
  document.getElementById("result").innerText =
    username + ", sənin nəticən: " + score + " xal";

  // Input və təsdiqlə gizlədilir
  document.getElementById("answer").style.display = "none";
  document.querySelector("button[onclick='checkAnswer()']").style.display =
    "none";

  // Başla düyməsi gizlədilir
  document.querySelector("button[onclick='startGame()']").style.display =
    "none";

  // Yenidən düyməsi görünür
  document.getElementById("restartBtn").style.display = "inline-block";

  // Liderlər lövhəsi
  leaderboard.push({ name: username, score: score });
  leaderboard.sort((a, b) => b.score - a.score);

  let boardHTML = "<h3>Liderlər lövhəsi</h3><ol>";
  leaderboard.slice(0, 5).forEach((item) => {
    boardHTML += "<li>" + item.name + " — " + item.score + " xal</li>";
  });
  boardHTML += "</ol>";

  document.getElementById("leaderboard").innerHTML = boardHTML;
}

// Restart düyməsi
function restartGame() {
  startGame();
}
