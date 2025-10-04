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

const words = {
  apple: "alma",
  book: "kitab",
  dog: "it",
  cat: "pişik",
  car: "maşın",
  house: "ev",
  water: "su",
  friend: "dost",
  school: "məktəb",
  sun: "günəş",
};

let score = 0;
let timeLeft = 60;
let currentWord = "";
let timer;
let leaderboard = [];

function startGame() {
  score = 0;
  timeLeft = 60;
  document.getElementById("score").innerText = "Xal: " + score;
  document.getElementById("time").innerText = "Vaxt: " + timeLeft;
  document.getElementById("result").innerText = "";
  document.getElementById("leaderboard").innerHTML = "";

  showWord();
  clearInterval(timer);
  timer = setInterval(updateTime, 1000);
}

function showWord() {
  const keys = Object.keys(words);
  currentWord = keys[Math.floor(Math.random() * keys.length)];
  document.getElementById("word").innerText = currentWord;
  document.getElementById("answer").value = "";
}

function checkAnswer() {
  const userAnswer = document
    .getElementById("answer")
    .value.trim()
    .toLowerCase();
  if (userAnswer === words[currentWord]) {
    score += 10;
    document.getElementById("result").innerText = "✅ Doğrudur!";
  } else {
    score -= 5;
    document.getElementById("result").innerText =
      "❌ Səhvdir! Doğru cavab: " + words[currentWord];
  }
  document.getElementById("score").innerText = "Xal: " + score;
  showWord();
}

function updateTime() {
  timeLeft--;
  document.getElementById("time").innerText = "Vaxt: " + timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timer);
    endGame();
  }
}

function endGame() {
  document.getElementById("word").innerText = "Oyun bitdi!";
  document.getElementById("result").innerText =
    "Sizin nəticəniz: " + score + " xal";

  leaderboard.push(score);
  leaderboard.sort((a, b) => b - a);

  let boardHTML = "<h3>Liderlər lövhəsi</h3><ol>";
  leaderboard.slice(0, 5).forEach((x) => {
    boardHTML += "<li>" + x + " xal</li>";
  });
  boardHTML += "</ol>";

  document.getElementById("leaderboard").innerHTML = boardHTML;
}
