/*************************************************************
 * Global Game State
 *************************************************************/
let winningScore = 10000;  // default
let partialSelectionEnabled = false;

// Scores
let playerScore = 0;
let aiScore = 0;

// Round-specific
let diceLeft = 6;
let roundPoints = 0;
let currentRoll = [];
let isPlayerTurn = true; // track whose turn it is
let rollsCount = 0;      // for AI logic
let gameOver = false;

/*************************************************************
 * Start / Difficulty Selection
 *************************************************************/
function setDifficulty(mode) {
  // Hide start screen, show game screen
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";

  // Check for plus
  if (mode.endsWith("+")) {
    partialSelectionEnabled = true;
    mode = mode.slice(0, -1); // remove trailing '+'
  }

  // Set winningScore
  switch (mode.toLowerCase()) {
    case "e":
      winningScore = 1500;
      break;
    case "m":
      winningScore = 3000;
      break;
    case "h":
      winningScore = 5000;
      break;
    case "he":
      winningScore = 10000;
      break;
    default:
      // if invalid, default to 10000
      winningScore = 10000;
      partialSelectionEnabled = false;
  }

  // Start the first turn
  updateScoreboard();
  logMessage("Welcome to Farkle in the browser!");
  logMessage(`You must reach ${winningScore} to win.`);
  logMessage(partialSelectionEnabled
    ? "Partial selection (plus) mode is enabled."
    : "Classic mode: entire roll is auto-scored each time."
  );
  logMessage("Your turn! Click Roll or Bank (or type R/B) to begin...");
}

/*************************************************************
 * Utility: Log Messages to #game-log
 *************************************************************/
function logMessage(msg) {
  let logDiv = document.getElementById("game-log");
  logDiv.innerHTML += msg + "<br/>";
  logDiv.scrollTop = logDiv.scrollHeight; // auto-scroll to bottom
}

/*************************************************************
 * Update Scoreboard
 *************************************************************/
function updateScoreboard() {
  let sb = document.getElementById("scoreboard");
  sb.innerHTML = `
    <b>Goal:</b> ${winningScore} &nbsp; | &nbsp;
    <b>Scores:</b> You: ${playerScore} &nbsp; | &nbsp; AI: ${aiScore}
    <br/>
    <b>Current Round:</b> ${roundPoints} 
    (${isPlayerTurn ? "You" : "AI"})
  `;
}

/*************************************************************
 * Dice Rolling & ASCII
 *************************************************************/
function rollDice(n) {
  let result = [];
  for (let i = 0; i < n; i++) {
    result.push(Math.floor(Math.random() * 6) + 1);
  }
  return result;
}

const DICE_FACES = {
  1: [
    "+-------+",
    "|       |",
    "|   o   |",
    "|       |",
    "+-------+"
  ],
  2: [
    "+-------+",
    "| o     |",
    "|       |",
    "|     o |",
    "+-------+"
  ],
  3: [
    "+-------+",
    "| o     |",
    "|   o   |",
    "|     o |",
    "+-------+"
  ],
  4: [
    "+-------+",
    "| o   o |",
    "|       |",
    "| o   o |",
    "+-------+"
  ],
  5: [
    "+-------+",
    "| o   o |",
    "|   o   |",
    "| o   o |",
    "+-------+"
  ],
  6: [
    "+-------+",
    "| o   o |",
    "| o   o |",
    "| o   o |",
    "+-------+"
  ],
};

function diceToAscii(dice) {
  // Build up lines for each row
  let lines = ["", "", "", "", "", ""]; // 5 for the face + 1 for indices
  for (let row = 0; row < 5; row++) {
    let rowParts = [];
    for (let d of dice) {
      rowParts.push(DICE_FACES[d][row]);
    }
    lines[row] = rowParts.join("  ");
  }
  // index line
  let idxParts = [];
  for (let i = 0; i < dice.length; i++) {
    idxParts.push(`   (${i + 1})    `);
  }
  lines[5] = idxParts.join(" ");

  return lines.join("\n");
}

/*************************************************************
 * Scoring Logic
 *************************************************************/
function scoreRoll(dice) {
  // Returns [points, usedIndicesArray]
  // Mirror the Python logic.

  // Count occurrences
  let counts = {};
  for (let d of dice) {
    counts[d] = (counts[d] || 0) + 1;
  }
  let usedIndices = [];
  let totalPoints = 0;

  // Helper to remove a certain number of 'value' from 'dice' + 'counts'
  function removeValue(value, countToRemove) {
    let removed = 0;
    for (let i = 0; i < dice.length; i++) {
      if (removed >= countToRemove) break;
      if (dice[i] === value && !usedIndices.includes(i)) {
        usedIndices.push(i);
        removed++;
      }
    }
    counts[value] -= countToRemove;
    if (counts[value] <= 0) {
      delete counts[value];
    }
  }

  // Check 6-dice combos
  let totalDice = dice.length;
  if (totalDice === 6) {
    // 1) AAABBB => two faces each count=3 => 2500
    if (Object.keys(counts).length === 2) {
      let allVals = Object.values(counts);
      if (allVals[0] === 3 && allVals[1] === 3) {
        // All 6 used
        return [2500, dice.map((_, i) => i)];
      }
      // 2) AAAABB => [2,4] => 1500
      let sortedCounts = allVals.sort((a, b) => a - b);
      if (sortedCounts[0] === 2 && sortedCounts[1] === 4) {
        return [1500, dice.map((_, i) => i)];
      }
    }
    // 3) AABBCC => three distinct pairs => 1500
    if (Object.keys(counts).length === 3) {
      let allVals = Object.values(counts);
      if (allVals[0] === 2 && allVals[1] === 2 && allVals[2] === 2) {
        return [1500, dice.map((_, i) => i)];
      }
    }
  }

  // Otherwise, standard combos
  function canRemoveFullStraight(c) {
    for (let v = 1; v <= 6; v++) {
      if (!c[v] || c[v] < 1) return false;
    }
    return true;
  }
  function canRemove2to6(c) {
    for (let v = 2; v <= 6; v++) {
      if (!c[v] || c[v] < 1) return false;
    }
    return true;
  }
  function canRemove1to5(c) {
    for (let v = 1; v <= 5; v++) {
      if (!c[v] || c[v] < 1) return false;
    }
    return true;
  }

  // 1) Remove straights repeatedly
  while (true) {
    if (canRemoveFullStraight(counts)) {
      totalPoints += 1500;
      for (let v = 1; v <= 6; v++) removeValue(v, 1);
    } else if (canRemove2to6(counts)) {
      totalPoints += 750;
      for (let v = 2; v <= 6; v++) removeValue(v, 1);
    } else if (canRemove1to5(counts)) {
      totalPoints += 500;
      for (let v = 1; v <= 5; v++) removeValue(v, 1);
    } else {
      break;
    }
  }

  // 2) Triples / more
  const tripleValues = {
    1: 1000,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
    6: 600
  };
  for (let face = 1; face <= 6; face++) {
    if (counts[face] >= 3) {
      let base = tripleValues[face];
      let extra = counts[face] - 3; 
      // doubling for each extra die
      // 4-of-a-kind => base * 2
      // 5-of-a-kind => base * 4
      // 6-of-a-kind => base * 8
      let comboPts = base * Math.pow(2, extra);
      totalPoints += comboPts;
      removeValue(face, counts[face]);
    }
  }

  // 3) Singles for 1 or 5
  for (let face of [1, 5]) {
    if (counts[face] > 0) {
      let singlePts = (face === 1) ? 100 : 50;
      totalPoints += singlePts * counts[face];
      removeValue(face, counts[face]);
    }
  }

  return [totalPoints, usedIndices];
}

function getBestScoringText(dice) {
  let [pts, _] = scoreRoll(dice);
  return pts === 0
    ? "No scoring dice. (0 points)"
    : `This roll is worth ${pts} points in total.`;
}

/*************************************************************
 * Player Turn & AI Turn
 * We emulate the same approach from Python but event-driven.
 *************************************************************/

// Called when user clicks "Roll" or types "R"
function handleRollClick() {
  if (gameOver) return;
  if (!isPlayerTurn) return;

  // If partial selection is OFF => we auto-score each roll
  if (!partialSelectionEnabled) {
    doPlayerRollClassic();
  } else {
    doPlayerRollPlusMode();
  }
}

// Called when user clicks "Bank" or types "B"
function handleBankClick() {
  if (gameOver) return;
  if (!isPlayerTurn) return;

  // Bank
  playerScore += roundPoints;
  logMessage(`You banked ${roundPoints} points!`);
  roundPoints = 0;
  diceLeft = 6;
  currentRoll = [];
  updateScoreboard();

  // Check for win
  if (playerScore >= winningScore) {
    logMessage(`Congratulations! You reached ${winningScore} and won!`);
    gameOver = true;
    return;
  }

  // Switch turn to AI
  isPlayerTurn = false;
  rollsCount = 0;
  aiTurn();
}

function doPlayerRollClassic() {
  // Classic mode: each time you roll, we use diceLeft, auto-score the entire roll.
  if (diceLeft <= 0) diceLeft = 6; // hot dice scenario

  currentRoll = rollDice(diceLeft);
  showDice(currentRoll, true);

  let [points, usedIx] = scoreRoll(currentRoll);
  if (points === 0) {
    // bust
    logMessage("BUST! No scoring dice. Round points lost.");
    roundPoints = 0;
    diceLeft = 6;
    currentRoll = [];
    updateScoreboard();
    // End turn => AI
    isPlayerTurn = false;
    setTimeout(aiTurn, 1500);
  } else {
    roundPoints += points;
    diceLeft -= usedIx.length;
    if (diceLeft <= 0) {
      // hot dice
      diceLeft = 6;
      logMessage(`You scored ${points} (HOT DICE). Round total: ${roundPoints}.`);
      logMessage("All dice used => next roll is 6 fresh dice again.");
    } else {
      logMessage(`You scored ${points} points. Round total: ${roundPoints}. Dice left: ${diceLeft}.`);
    }
    updateScoreboard();
  }
}

function doPlayerRollPlusMode() {
  // In plus mode, we only roll if currentRoll is empty
  if (currentRoll.length === 0) {
    if (diceLeft <= 0) diceLeft = 6; // hot dice
    currentRoll = rollDice(diceLeft);
    showDice(currentRoll, true);
    logMessage(getBestScoringText(currentRoll));
  } else {
    // If currentRoll not empty, they haven't selected partial dice yet
    logMessage("You must either Bank, or select partial dice (by typing indices), or forcibly Re-roll leftover dice by pressing R again.");
  }
}

/*************************************************************
 * Handling partial picks
 * The user can type something in the text input, which we parse.
 *************************************************************/
function handleUserInput(event) {
  if (event.key === "Enter") {
    let val = event.target.value.trim();
    event.target.value = ""; // clear the input

    // If game is over or AI's turn, ignore
    if (gameOver || !isPlayerTurn) return;

    let upVal = val.toUpperCase();
    if (upVal === "R") {
      handleRollClick();
    } else if (upVal === "B") {
      handleBankClick();
    } else {
      // parse dice indices
      let parts = val.split(/\s+/).map(x => parseInt(x, 10)).filter(x => !isNaN(x));
      if (parts.length === 0) {
        logMessage("Invalid input. Enter R, B, or dice indices (like '1 3').");
        return;
      }
      // partial pick
      doPartialPick(parts);
    }
  }
}

function doPartialPick(selectedIndices) {
  // Only valid in partial selection mode
  if (!partialSelectionEnabled) {
    logMessage("You're in classic mode. Cannot pick partial dice.");
    return;
  }
  if (currentRoll.length === 0) {
    logMessage("No current roll. Click Roll first.");
    return;
  }

  // Validate
  for (let s of selectedIndices) {
    if (s < 1 || s > currentRoll.length) {
      logMessage("Invalid dice indices. Must be within 1..(length of current roll).");
      return;
    }
  }

  // Gather the chosen dice
  let keptDice = selectedIndices.map(i => currentRoll[i - 1]);
  let [pts, _] = scoreRoll(keptDice);
  if (pts === 0) {
    // bust
    logMessage("BUST! You selected dice that yield 0 points. Round points lost.");
    roundPoints = 0;
    diceLeft = 6;
    currentRoll = [];
    updateScoreboard();
    // end turn => AI
    isPlayerTurn = false;
    setTimeout(aiTurn, 1500);
  } else {
    roundPoints += pts;
    // Remove those dice from currentRoll
    for (let val of keptDice) {
      let idx = currentRoll.indexOf(val);
      if (idx >= 0) currentRoll.splice(idx, 1);
    }
    diceLeft -= keptDice.length;
    if (diceLeft <= 0) {
      diceLeft = 6;
      currentRoll = [];
      logMessage(`You scored ${pts}. Round total: ${roundPoints}.`);
      logMessage("All dice used => HOT DICE! Next roll => 6 fresh dice.");
    } else {
      logMessage(`You scored ${pts}. Round total: ${roundPoints}. Dice left: ${diceLeft}`);
    }
    updateScoreboard();
    showDice(currentRoll, true);
  }
}

/*************************************************************
 * AI Turn
 *************************************************************/
function aiTurn() {
  if (gameOver) return;
  updateScoreboard();

  // AI logic:
  // Keep rolling if (roundPoints < 300 and rollsCount < 4),
  // or if it's the first roll (diceLeft=6) and roundPoints=0, up to 4 total.
  // Otherwise, bank.

  // We'll proceed step by step with a small delay
  setTimeout(() => {
    if ((roundPoints < 300 && rollsCount < 4) || (diceLeft === 6 && roundPoints === 0 && rollsCount < 4)) {
      // roll
      doAIRoll();
    } else {
      // bank
      aiScore += roundPoints;
      logMessage(`AI banks ${roundPoints} points!`);
      roundPoints = 0;
      diceLeft = 6;
      currentRoll = [];
      updateScoreboard();
      // Check AI win
      if (aiScore >= winningScore) {
        logMessage(`AI reached ${winningScore} and wins. Better luck next time!`);
        gameOver = true;
      } else {
        // Switch back to player
        isPlayerTurn = true;
        logMessage("Your turn again!");
      }
    }
  }, 1500);
}

function doAIRoll() {
  if (diceLeft <= 0) diceLeft = 6;
  currentRoll = rollDice(diceLeft);
  showDice(currentRoll, false);
  let best = getBestScoringText(currentRoll);
  logMessage(`AI's roll: ${best}`);

  let [points, usedIx] = scoreRoll(currentRoll);
  if (points === 0) {
    // bust
    logMessage("AI BUSTS! Round points lost.");
    roundPoints = 0;
    diceLeft = 6;
    currentRoll = [];
    updateScoreboard();
    // switch to player
    isPlayerTurn = true;
    logMessage("Your turn!");
  } else {
    roundPoints += points;
    diceLeft -= usedIx.length;
    if (diceLeft <= 0) {
      diceLeft = 6;
      logMessage("AI got HOT DICE! It used all dice and will roll again.");
    } else {
      logMessage(`AI scored ${points} points. Round total: ${roundPoints}. Dice left: ${diceLeft}`);
    }
    rollsCount++;
    updateScoreboard();
    // Next decision
    aiTurn();
  }
}

/*************************************************************
 * Displaying Dice
 *************************************************************/
function showDice(dice, isPlayer) {
  let ascii = diceToAscii(dice);
  let display = document.getElementById("dice-display");
  display.textContent = ascii;

  logMessage(`${isPlayer ? "You" : "AI"} rolled:`);
  // We separate the ASCII dice from the log for neatness
}

/*************************************************************
 * "Press Enter to continue..." mimic 
 * (We show a hidden button if we ever need that flow)
 *************************************************************/
function nextStep() {
  // In a single-page approach, we might not need this often,
  // but you could reveal #continue-btn for certain “pause” steps.
}
