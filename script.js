/* script.js */
(() => {
  // ----------------------------
  // Cached DOM elements
  // ----------------------------
  const outputEl = document.getElementById('game-output');
  const inputArea = document.getElementById('input-area');
  const userInput = document.getElementById('user-input');
  const submitBtn = document.getElementById('submit-btn');

  // ----------------------------
  // Game data (porting from Python)
  // ----------------------------
  const AVAILABLE_INSULTS = [
    ["You fight like a dairy farmer!", "How appropriate. You fight like a cow."],
    ["I've heard you were a contemptible sneak!", "Too bad no one's ever heard of YOU at all."],
    ["People fall at my feet when they see me coming!", "Even BEFORE they smell your breath?"],
    ["I'm not going to take your insolence sitting down!", "Your hemorrhoids are flaring up again, eh?"],
    ["There are no words for how disgusting you are.", "Yes there are. You just never learned them."],
    ["You make me want to puke.", "You make me think somebody already did."],
    ["My handkerchief will wipe up your blood!", "So you got that job as janitor, after all."],
    ["I got this scar on my face during a mighty struggle!", "I hope now you've learned to stop picking your nose."],
    ["You're no match for my brains, you poor fool.", "I'd be in real trouble if you ever used them."],
    ["You have the manners of a beggar.", "I wanted to make sure you'd feel comfortable with me."],
    ["I once owned a dog that was smarter than you.", "He must have taught you everything you know."],
    ["Nobody's ever drawn blood from me and nobody ever will.", "You run THAT fast?"],
    ["I've spoken with apes more polite than you.", "I'm glad to hear you attended your family reunion."],
    ["Soon you'll be wearing my sword like a shish kebab!", "First you better stop waving it like a feather-duster."],
    ["This is the END for you, you gutter-crawling cur!", "And I've got a little TIP for you, get the POINT?"]
  ];

  const SWORDMASTER_INSULTS = [
    ["I've got a long, sharp lesson for you you to learn today.", "And I've got a little TIP for you. Get the POINT?"],
    ["My tongue is sharper then any sword.", "First you’d better stop waving it like a feather-duster."],
    ["My name is feared in every dirty corner of this island!", "So you got that job as janitor, after all."],
    ["My wisest enemies run away at the first sight of me!", "Even BEFORE they smell your breath?"],
    ["Only once have I met such a coward!", "He must have taught you everything you know."],
    ["If your brother's like you, better to marry a pig.", "You make me think somebody already did."],
    ["No one will ever catch ME fighting as badly as you do.", "You run THAT fast?"],
    ["I will milk every drop of blood from your body!", "How appropriate. You fight like a cow."],
    ["My last fight ended with my hands covered with blood.", "I hope now you've learned to stop picking your nose."],
    ["I hope you have a boat ready for a quick escape.", "Why, did you want to borrow one?"],
    ["My sword is famous all over the Caribbean!", "Too bad no one's ever heard of YOU at all."],
    ["I've got the courage and skill of a master swordsman!", "I'd be in real trouble if you ever used them."],
    ["Every word you say to me is stupid.", "I wanted to make sure you'd feel comfortable with me."],
    ["You are a pain in the backside, sir!", "Your hemorrhoids are flaring up again, eh?"],
    ["There are no clever moves that can help you now.", "Yes, there are. You just never learned them."],
    ["Now I know what filth and stupidity really are.", "I'm glad to hear you attended your family reunion."],
    ["I usually see people like you passed-out on tavern floors.", "Even BEFORE they smell your breath?"]
  ];

  const THROWAWAY_INSULTS = [
    "Boy are you ugly!",
    "What an idiot",
    "You call yourself a pirate!"
  ];

  // Learned insults & retorts; persist across fights
  let insultsLearned = [
    "You fight like a dairy farmer!",
    "Soon you'll be wearing my sword like a shish kebab!"
  ];
  let retortsLearned = [
    "How appropriate. You fight like a cow.",
    "First you better stop waving it like a feather-duster."
  ];

  // Pirate tiers & weights (to mimic random.choices)
  const PIRATE_TIERS = [
    { name: "Scurvy Pirate",     maxIndex: 4,  weight: 5 },
    { name: "Stinking Pirate",    maxIndex: 7,  weight: 4 },
    { name: "Ugly Pirate",        maxIndex: 9,  weight: 3 },
    { name: "Intimidating Pirate",maxIndex: 12, weight: 2 },
    { name: "Dangerous Pirate",   maxIndex: AVAILABLE_INSULTS.length, weight: 1 }
  ];

  // ----------------------------
  // State variables
  // ----------------------------
  let gameState = "splash";      // splash → title → introName → regularDuel → pirateResponse → playerResponse → postDuelChoice → swordmasterResponse → swordmasterNext
  let playerName = "";
  let currentTier = null;        // chosen pirate tier object
  let pirateLives = 0;
  let playerLives = 0;
  let usedInsultsThisPirate = [];
  let currentInsult = "";
  let currentCorrectRetort = "";
  let currentPlayerInsultOptions = []; // array of strings for player turn
  let currentPirateRound = 0;    // index into SWORDMASTER_INSULTS during swordmaster challenge

  // ----------------------------
  // Utility functions
  // ----------------------------

  function clearScreen() {
    outputEl.textContent = "";
  }

  function appendLine(text = "") {
    outputEl.textContent += text + "\n";
    // Auto-scroll to bottom
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function showInputArea() {
    inputArea.style.display = "flex";
    userInput.focus();
  }

  function hideInputArea() {
    inputArea.style.display = "none";
    userInput.value = "";
  }

  function waitForResizeThenFocus() {
    // In case the DOM reflow is needed
    setTimeout(() => userInput.focus(), 50);
  }

  function displayHearts(label, lives) {
    let hearts = "♥︎".repeat(lives) + "♡".repeat(3 - lives);
    appendLine(`${label}: ${hearts}`);
  }

  function chooseRandomPirateTier() {
    // Weighted random selection from PIRATE_TIERS
    let totalWeight = PIRATE_TIERS.reduce((sum, t) => sum + t.weight, 0);
    let pick = Math.random() * totalWeight;
    let cum = 0;
    for (let tier of PIRATE_TIERS) {
      cum += tier.weight;
      if (pick <= cum) {
        return tier;
      }
    }
    return PIRATE_TIERS[PIRATE_TIERS.length - 1];
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function getFallbackRetort() {
    const FALLBACKS = [
      "Oh yeah?",
      "I'm shaking, I'm shaking.",
      "I am rubber, you are glue."
    ];
    return FALLBACKS[getRandomInt(FALLBACKS.length)];
  }

  function promptText(textToShow, nextState) {
    clearScreen();
    appendLine(textToShow);
    appendLine("");
    appendLine("> ");
    gameState = nextState;
    showInputArea();
    waitForResizeThenFocus();
  }

  // ----------------------------
  // Game flow functions
  // ----------------------------

  function startSplash() {
    clearScreen();
    appendLine("        ----------------------------");
    appendLine("");
    appendLine("        Deep In The Atlantic Ocean...");
    appendLine("");
    appendLine("        The Island of Duck™");
    appendLine("");
    appendLine("        ----------------------------");
    appendLine("");
    appendLine("   Created and Designed by Alejandro Anguera de la Rosa");
    appendLine("              Version 0.8.0");
    appendLine("");
    appendLine("");
    appendLine("     Press Enter to start...");
    appendLine("");
    gameState = "title";
    showInputArea();
    waitForResizeThenFocus();
  }

  function startTitleScreen() {
    clearScreen();
    const titleArt = [
      "████████╗██╗░░██╗███████╗  ░██████╗███████╗░█████╗░██████╗░███████╗████████╗  ░█████╗░███████╗",
      "╚══██╔══╝██║░░██║██╔════╝  ██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝╚══██╔══╝  ██╔══██╗██╔════╝",
      "░░░██║░░░███████║█████╗░░  ╚█████╗░█████╗░░██║░░╚═╝██████╔╝█████╗░░░░░██║░░░  ██║░░██║█████╗░░",
      "░░░██║░░░██╔══██║██╔══╝░░  ░╚═══██╗██╔══╝░░██║░░██╗██╔══██╗██╔══╝░░░░░██║░░░  ██║░░██║██╔══╝░░",
      "░░░██║░░░██║░░██║███████╗  ██████╔╝███████╗╚█████╔╝██║░░██║███████╗░░░██║░░░  ╚█████╔╝██║░░░░░",
      "░░░╚═╝░░░╚═╝░░╚═╝╚══════╝  ╚═════╝░╚══════╝░╚════╝░╚═╝░░╚═╝╚══════╝░░░╚═╝░░░  ░╚════╝░╚═╝░░░░░",
      "",
      "██████╗░██╗░░░██╗░█████╗░██╗░░██╗  ██╗░██████╗██╗░░░░░░█████╗░███╗░░██╗██████╗░██╗™",
      "██╔══██╗██║░░░██║██╔══██╗██║░██╔╝  ██║██╔════╝██║░░░░░██╔══██╗████╗░██║██╔══██╗╚═╝",
      "██║░░██║██║░░░██║██║░░╚═╝█████═╝░  ██║╚█████╗░██║░░░░░███████║██╔██╗██║██║░░██║░░░",
      "██║░░██║██║░░░██║██║░░██╗██╔═██╗░  ██║░╚═══██╗██║░░░░░██╔══██║██║╚████║██║░░██║░░░",
      "██████╔╝╚██████╔╝╚█████╔╝██║░╚██╗  ██║██████╔╝███████╗██║░░██║██║░╚███║██████╔╝██╗",
      "╚═════╝░░╚═════╝░░╚════╝░╚═╝░░╚═╝  ╚═╝╚═════╝░╚══════╝╚═╝░░╚═╝╚═╝░░╚══╝╚═════╝░╚═╝"
    ];
    titleArt.forEach(line => appendLine(line));
    appendLine("");
    appendLine("Press Enter (or type '1') to continue...");
    gameState = "introNamePrompt";
    showInputArea();
    waitForResizeThenFocus();
  }

  function startIntroName() {
    clearScreen();
    appendLine("You want to become a mighty pirate on The Island of Duck™.");
    appendLine("");
    appendLine("You are here to complete the Three Legendary Quests™ that three legendary pirates have set out for you.");
    appendLine("You have already completed two of them:");
    appendLine("- Quest of the Duckbeard's Treasure™ (Treasure-huntery),");
    appendLine("- Quest of the Golden Egg™ (Thieving).");
    appendLine("");
    appendLine("Now, you must complete the Quest of the Insult Sword Fighting™ (Insulting).");
    appendLine("The Three Legendary Quests™ are the only way to become a true pirate, and to be able to sail the Seven C's™.");
    appendLine("");
    appendLine("The first quest required finding the buried treasure of Captain Duckbeard.");
    appendLine("The second, stealing the Golden Egg™ from Governor Duckley.");
    appendLine("The last quest, is to beat The SwordMaster™ in an insult sword fight.");
    appendLine("");
    appendLine("Your training with Captain Quackbeard has been going well.");
    appendLine("He has advised you to fight some local pirates to get some practice.");
    appendLine("The key to winning a sword fight, he says, is to insult your opponent.");
    appendLine("You must learn the insults and their retorts so you can defeat the SwordMaster™.");
    appendLine("");
    appendLine("Good luck, pirate!");
    appendLine("");
    appendLine("Please type your name, then hit Enter to continue.");
    appendLine("");
    appendLine("> ");
    gameState = "introName";
    showInputArea();
    waitForResizeThenFocus();
  }

  function handleIntroName(input) {
    if (!input) {
      appendLine("");
      appendLine("Type your name to start.");
      appendLine("");
      appendLine("> ");
      return;
    }
    playerName = input;
    clearScreen();
    appendLine(`Welcome, ${playerName}!`);
    appendLine("");
    setTimeout(startRegularDuel, 1000);
  }

  function startRegularDuel() {
    // Choose a random pirate tier
    currentTier = chooseRandomPirateTier();
    pirateLives = 3;
    playerLives = 3;
    usedInsultsThisPirate = [];
    clearScreen();
    appendLine(`A ${currentTier.name} approaches, ${playerName}!`);
    appendLine(`\n"My name is ${playerName}. Prepare to die!"`);
    setTimeout(() => {
      // Player starts first
      beginPlayerTurn();
    }, 1000);
  }

  function beginPirateTurn() {
    clearScreen();
    displayHearts("You", playerLives);
    displayHearts("Pirate", pirateLives);
    appendLine("");

    // Pirate picks a random insult index < tierMax
    const idx = getRandomInt(currentTier.maxIndex);
    const [insult, correctRetort] = AVAILABLE_INSULTS[idx];
    currentInsult = insult;
    currentCorrectRetort = correctRetort;

    // Pirate’s insult is always learned
    if (!insultsLearned.includes(insult)) {
      insultsLearned.push(insult);
    }

    appendLine(`Pirate: "${insult}"`);
    appendLine("");

    // Show retort options
    retortsLearned.forEach((r, i) => {
      appendLine(`  ${i + 1}. ${r}`);
    });
    const giveUpIndex = retortsLearned.length + 1;
    appendLine(`  ${giveUpIndex}. I give up! You win!`);
    appendLine("");
    appendLine("Your retort (enter number):");
    appendLine("");
    appendLine("> ");

    gameState = "pirateResponse";
    showInputArea();
    waitForResizeThenFocus();
  }

  function handlePirateResponse(input) {
    hideInputArea();
    const n = parseInt(input, 10);
    const giveUpIndex = retortsLearned.length + 1;

    if (isNaN(n) || n < 1 || n > giveUpIndex) {
      // Invalid choice: treat as wrong retort
      appendLine("");
      appendLine("Wrong! You lose a heart.");
      playerLives--;
      if (playerLives <= 0) {
        return finishDuel(false);
      }
      setTimeout(beginPirateTurn, 1000);
      return;
    }

    if (n === giveUpIndex) {
      // Player gives up
      appendLine("");
      appendLine("You gave up! The pirate wins.");
      playerLives = 0;
      return finishDuel(false);
    }

    // Check if chosen retort is correct
    const chosenRetort = retortsLearned[n - 1];
    if (chosenRetort === currentCorrectRetort) {
      appendLine("");
      appendLine("Correct! Pirate loses a heart.");
      pirateLives--;
      if (!retortsLearned.includes(currentCorrectRetort)) {
        retortsLearned.push(currentCorrectRetort);
      }
      if (pirateLives <= 0) {
        return finishDuel(true);
      }
      setTimeout(beginPlayerTurn, 1000);
    } else {
      appendLine("");
      appendLine("Wrong! You lose a heart.");
      playerLives--;
      if (playerLives <= 0) {
        return finishDuel(false);
      }
      setTimeout(beginPirateTurn, 1000);
    }
  }

  function beginPlayerTurn() {
    clearScreen();
    displayHearts("You", playerLives);
    displayHearts("Pirate", pirateLives);
    appendLine("");

    // Build available insults: learned minus already used in this duel
    const learnedOptions = insultsLearned.filter(ins => !usedInsultsThisPirate.includes(ins));
    currentPlayerInsultOptions = [...learnedOptions, ...THROWAWAY_INSULTS];

    currentPlayerInsultOptions.forEach((ins, i) => {
      appendLine(`  ${i + 1}. ${ins}`);
    });
    const giveUpIndex = currentPlayerInsultOptions.length + 1;
    appendLine(`  ${giveUpIndex}. I give up! You win!`);
    appendLine("");
    appendLine("Your insult (enter number):");
    appendLine("");
    appendLine("> ");

    gameState = "playerResponse";
    showInputArea();
    waitForResizeThenFocus();
  }

  function handlePlayerResponse(input) {
    hideInputArea();
    const n = parseInt(input, 10);
    const giveUpIndex = currentPlayerInsultOptions.length + 1;

    if (isNaN(n) || n < 1 || n > giveUpIndex) {
      // Invalid choice: lose a heart
      appendLine("");
      appendLine("Invalid choice! You lose a heart.");
      playerLives--;
      if (playerLives <= 0) {
        return finishDuel(false);
      }
      setTimeout(beginPirateTurn, 1000);
      return;
    }

    if (n === giveUpIndex) {
      // Player gives up
      appendLine("");
      appendLine("You gave up! The pirate wins.");
      playerLives = 0;
      return finishDuel(false);
    }

    const chosenInsult = currentPlayerInsultOptions[n - 1];
    appendLine("");
    appendLine(`You: "${chosenInsult}"`);

    // If it's a learned insult, mark as used
    if (insultsLearned.includes(chosenInsult)) {
      usedInsultsThisPirate.push(chosenInsult);
    }

    // If throwaway insult
    if (THROWAWAY_INSULTS.includes(chosenInsult)) {
      const fallback = getFallbackRetort();
      appendLine(`Pirate: "${fallback}"`);
      setTimeout(beginPirateTurn, 1000);
      return;
    }

    // Otherwise, find its correct retort and index in AVAILABLE_INSULTS
    const pairIndex = AVAILABLE_INSULTS.findIndex(pair => pair[0] === chosenInsult);
    if (pairIndex === -1) {
      // Should never happen if data is consistent
      const fallback = getFallbackRetort();
      appendLine(`Pirate: "${fallback}"`);
      setTimeout(beginPirateTurn, 1000);
      return;
    }

    const correctRetort = AVAILABLE_INSULTS[pairIndex][1];

    // Does the pirate know this retort? (index < tierMax)
    if (pairIndex < currentTier.maxIndex) {
      // Pirate knows how to respond
      appendLine(`Pirate: "${correctRetort}"`);
      appendLine("");
      appendLine("You lose a heart.");
      playerLives--;
      // Pirate “learns” this retort if not already learned
      if (!retortsLearned.includes(correctRetort)) {
        retortsLearned.push(correctRetort);
      }
      if (playerLives <= 0) {
        return finishDuel(false);
      }
      setTimeout(beginPirateTurn, 1000);
    } else {
      // Pirate does not know retort
      const fallback = getFallbackRetort();
      appendLine(`Pirate: "${fallback}"`);
      appendLine("");
      appendLine("Pirate loses a heart.");
      pirateLives--;
      if (pirateLives <= 0) {
        return finishDuel(true);
      }
      setTimeout(beginPlayerTurn, 1000);
    }
  }

  function finishDuel(playerWon) {
    clearScreen();
    if (playerWon) {
      appendLine('Pirate: "I give up! You win!"');
    } else {
      appendLine(`[ ${playerName} ]: "I give up! You win!"`);
    }
    appendLine("");
    const learnedRatio = insultsLearned.length / AVAILABLE_INSULTS.length;

    appendLine(`Insults known: ${insultsLearned.length}/${AVAILABLE_INSULTS.length}`);
    appendLine(`Retorts known: ${retortsLearned.length}/${AVAILABLE_INSULTS.length}`);
    appendLine("");

    if (playerWon && learnedRatio > 0.75) {
      appendLine("Wow! You are good enough to defeat the SwordMaster!");
      appendLine("");
      appendLine("Face the SwordMaster now? (type 'y' for yes, anything else to continue facing pirates)");
      appendLine("");
      appendLine("> ");
      gameState = "postDuelChoice";
      showInputArea();
      waitForResizeThenFocus();
    } else {
      appendLine("Press Enter to face another pirate...");
      appendLine("");
      appendLine("> ");
      gameState = "continuePirates";
      showInputArea();
      waitForResizeThenFocus();
    }
  }

  function handlePostDuelChoice(input) {
    hideInputArea();
    if (input.trim().toLowerCase() === "y") {
      startSwordMasterChallenge();
    } else {
      startRegularDuel();
    }
  }

  function handleContinuePirates() {
    hideInputArea();
    startRegularDuel();
  }

  // ----------------------------
  // SwordMaster™ challenge
  // ----------------------------
  function startSwordMasterChallenge() {
    clearScreen();
    appendLine("You wish to challenge the legendary SwordMaster™, the ultimate test of your insult sword fighting skills.");
    appendLine("");
    appendLine("You have faced countless pirates, and now you stand at the threshold of destiny.");
    appendLine("The SwordMaster™ resides in a secluded glade deep within the forest, where only those truly versed in wit may pass.");
    appendLine("");
    appendLine("Press Enter to continue...");
    appendLine("");
    appendLine("> ");
    gameState = "swordmasterIntro";
    showInputArea();
    waitForResizeThenFocus();
  }

  function beginSwordMasterFight() {
    clearScreen();
    currentPirateRound = 0;
    proceedSwordMasterRound();
  }

  function proceedSwordMasterRound() {
    if (currentPirateRound >= SWORDMASTER_INSULTS.length) {
      // Victory over SwordMaster
      clearScreen();
      appendLine(`Victory! You have defeated the SwordMaster™ in an insult sword fight.`);
      appendLine("");
      appendLine(`The SwordMaster™ nods in respect and says, "Well it seems I underestimated you, ${playerName}."`);
      appendLine(`"Anyway, you'll want to show this to those three pirates to prove your win."`);
      appendLine("");
      appendLine(`You are handed a shirt that reads "I beat the SwordMaster™ and all I got was this lousy t-shirt".`);
      appendLine("");
      appendLine("Press Enter to exit the game...");
      appendLine("");
      appendLine("> ");
      gameState = "swordmasterEnd";
      showInputArea();
      waitForResizeThenFocus();
      return;
    }

    const [insult, correctRetort] = SWORDMASTER_INSULTS[currentPirateRound];
    currentCorrectRetort = correctRetort;
    clearScreen();
    appendLine(`SwordMaster: "${insult}"`);
    appendLine("");
    // Show retort options
    retortsLearned.forEach((r, i) => {
      appendLine(`  ${i + 1}. ${r}`);
    });
    appendLine("");
    appendLine("Your retort (enter number):");
    appendLine("");
    appendLine("> ");
    gameState = "swordmasterResponse";
    showInputArea();
    waitForResizeThenFocus();
  }

  function handleSwordmasterResponse(input) {
    hideInputArea();
    const n = parseInt(input, 10);
    if (isNaN(n) || n < 1 || n > retortsLearned.length) {
      clearScreen();
      appendLine("Incorrect or invalid input! The Insult Master has bested you.");
      appendLine("");
      appendLine("GAME OVER");
      appendLine("");
      appendLine("Press Enter to exit...");
      appendLine("");
      appendLine("> ");
      gameState = "swordmasterEnd";
      showInputArea();
      waitForResizeThenFocus();
      return;
    }
    const chosen = retortsLearned[n - 1];
    if (chosen !== currentCorrectRetort) {
      clearScreen();
      appendLine("Incorrect! The Insult Master has bested you.");
      appendLine("");
      appendLine("GAME OVER");
      appendLine("");
      appendLine("Press Enter to exit...");
      appendLine("");
      appendLine("> ");
      gameState = "swordmasterEnd";
      showInputArea();
      waitForResizeThenFocus();
      return;
    }
    // Correct retort: proceed
    appendLine("");
    appendLine("Well played! You matched his insult.");
    appendLine("");
    currentPirateRound++;
    setTimeout(proceedSwordMasterRound, 1000);
  }

  function endSwordmasterGame() {
    // Simply disable input and show final message; user can close tab
    hideInputArea();
  }

  // ----------------------------
  // Main input handler
  // ----------------------------
  function handleInput() {
    const inputVal = userInput.value.trim();
    userInput.value = "";

    switch (gameState) {
      case "title":
        hideInputArea();
        startTitleScreen();
        break;

      case "introNamePrompt":
        hideInputArea();
        startIntroName();
        break;

      case "introName":
        handleIntroName(inputVal);
        break;

      case "pirateResponse":
        handlePirateResponse(inputVal);
        break;

      case "playerResponse":
        handlePlayerResponse(inputVal);
        break;

      case "postDuelChoice":
        handlePostDuelChoice(inputVal);
        break;

      case "continuePirates":
        handleContinuePirates();
        break;

      case "swordmasterIntro":
        hideInputArea();
        beginSwordMasterFight();
        break;

      case "swordmasterResponse":
        handleSwordmasterResponse(inputVal);
        break;

      case "swordmasterEnd":
        endSwordmasterGame();
        break;

      default:
        // Shouldn't reach here; fallback to hiding input
        hideInputArea();
        break;
    }
  }

  // Bind click + Enter key on the submit button
  submitBtn.addEventListener("click", handleInput);
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInput();
    }
  });

  // ----------------------------
  // Kick off the game
  // ----------------------------
  window.addEventListener("load", () => {
    startSplash();
  });
})();