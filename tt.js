// Define constants
const TIME_LIMIT = 60;
const quotesArray = [
  "Push yourself, because no one else is going to do it for you.",
  "Failure is the condiment that gives success its flavor.",
  "Wake up with determination. Go to bed with satisfaction.",
  "It's going to be hard, but hard does not mean impossible.",
  "Learning never exhausts the mind.",
  "The only way to do great work is to love what you do."
];

// Select required elements
const timerText = document.querySelector(".curr_time");
const accuracyText = document.querySelector(".curr_accuracy");
const errorText = document.querySelector(".curr_errors");
const cpmText = document.querySelector(".curr_cpm");
const wpmText = document.querySelector(".curr_wpm");
const quoteText = document.querySelector(".quote");
const inputArea = document.querySelector(".input_area");
const restartButton = document.querySelector(".restart_btn");
const cpmGroup = document.querySelector(".cpm");
const wpmGroup = document.querySelector(".wpm");

// Game state variables
let timeLeft = TIME_LIMIT;
let timeElapsed = 0;
let totalErrors = 0;
let errors = 0;
let accuracy = 0;
let charactersTyped = 0;
let currentQuote = "";
let quoteIndex = 0;
let timer = null;

// Initialize the game
function startGame() {
  resetValues();
  updateQuote();

  // Start the timer
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
}

// Reset game values
function resetValues() {
  timeLeft = TIME_LIMIT;
  timeElapsed = 0;
  errors = 0;
  totalErrors = 0;
  charactersTyped = 0;
  accuracy = 100;
  quoteIndex = 0;

  inputArea.disabled = false;
  inputArea.value = "";
  quoteText.textContent = "Click on the area below to start the game.";
  timerText.textContent = `${TIME_LIMIT}s`;
  errorText.textContent = "0";
  accuracyText.textContent = "100";
  restartButton.style.display = "none";
  cpmGroup.style.display = "none";
  wpmGroup.style.display = "none";
}

// Update the quote
function updateQuote() {
  quoteText.textContent = ""; // Clear current quote
  currentQuote = quotesArray[quoteIndex];

  // Create span elements for each character
  currentQuote.split("").forEach((char) => {
    const charSpan = document.createElement("span");
    charSpan.innerText = char;
    quoteText.appendChild(charSpan);
  });

  // Move to the next quote
  quoteIndex = (quoteIndex + 1) % quotesArray.length;
}

// Process the input text
function processCurrentText() {
  const currInput = inputArea.value;
  const currInputArray = currInput.split("");

  charactersTyped++;
  errors = 0;

  const quoteSpanArray = quoteText.querySelectorAll("span");

  // Compare each character in the quote
  quoteSpanArray.forEach((char, index) => {
    const typedChar = currInputArray[index];

    if (typedChar == null) {
      char.classList.remove("correct_char", "incorrect_char");
    } else if (typedChar === char.innerText) {
      char.classList.add("correct_char");
      char.classList.remove("incorrect_char");
    } else {
      char.classList.add("incorrect_char");
      char.classList.remove("correct_char");
      errors++;
    }
  });

  // Update error count
  errorText.textContent = totalErrors + errors;

  // Update accuracy
  const correctCharacters = charactersTyped - (totalErrors + errors);
  accuracy = (correctCharacters / charactersTyped) * 100;
  accuracyText.textContent = Math.round(accuracy);

  // Check if the entire quote is typed
  if (currInput.length === currentQuote.length) {
    totalErrors += errors;
    inputArea.value = ""; // Clear the input area
    updateQuote(); // Load the next quote
  }
}

// Update the timer
function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeElapsed++;
    timerText.textContent = `${timeLeft}s`;
  } else {
    finishGame();
  }
}

// End the game
function finishGame() {
  clearInterval(timer);

  inputArea.disabled = true; // Disable input
  quoteText.textContent = "Click on restart to start a new game.";
  restartButton.style.display = "block";

  // Calculate CPM and WPM
  const cpm = Math.round((charactersTyped / timeElapsed) * 60);
  const wpm = Math.round((charactersTyped / 5 / timeElapsed) * 60);

  cpmText.textContent = cpm;
  wpmText.textContent = wpm;

  cpmGroup.style.display = "block";
  wpmGroup.style.display = "block";
}

// Attach event listeners
inputArea.addEventListener("focus", startGame);
inputArea.addEventListener("input", processCurrentText);
restartButton.addEventListener("click", resetValues);
