/**
 * Insult Sword Fighting™ — Browser Version
 * Ported from insultFightingNew.py
 * 
 * Usage:
 *   Simply open index.html in a modern browser.
 *   All game logic and UI lives here.
 */

(() => {
  // ─── DATA DEFINITIONS ───────────────────────────────────────────────────────

  // All “real” insults with their matching retorts (for pirate‐tiers).
  const AVAILABLE_INSULTS = [
    { insult: "You fight like a dairy farmer!", retort: "How appropriate. You fight like a cow." },
    { insult: "I've heard you were a contemptible sneak!", retort: "Too bad no one's ever heard of YOU at all." },
    { insult: "People fall at my feet when they see me coming!", retort: "Even BEFORE they smell your breath?" },
    { insult: "I'm not going to take your insolence sitting down!", retort: "Your hemorrhoids are flaring up again, eh?" },
    { insult: "There are no words for how disgusting you are.", retort: "Yes there are. You just never learned them." },
    { insult: "You make me want to puke.", retort: "You make me think somebody already did." },
    { insult: "My handkerchief will wipe up your blood!", retort: "So you got that job as janitor, after all." },
    { insult: "I got this scar on my face during a mighty struggle!", retort: "I hope now you've learned to stop picking your nose." },
    { insult: "You're no match for my brains, you poor fool.", retort: "I'd be in real trouble if you ever used them." },
    { insult: "You have the manners of a beggar.", retort: "I wanted to make sure you'd feel comfortable with me." },
  ];

  // Some “throwaway” insults that aren’t in AVAILABLE_INSULTS but pirates will fallback to retort.
  const THROWAWAY_INSULTS = [
    "Boy are you ugly!",
    "What an idiot",
    "You call yourself a pirate!"
  ];

  // SWORDMASTER uses a fixed list of insult/retort pairs, sequentially.
  const SWORDMASTER_INSULTS = [
    { insult: "I've got a long, sharp lesson for you you to learn today.", retort: "And I've got a little TIP for you. Get the POINT?" },
    { insult: "My tongue is sharper then any sword.", retort: "First you’d better stop waving it like a feather-duster." },
    { insult: "My name is feared in every dirty corner of this island!", retort: "So you got that job as janitor, after all." },
    { insult: "My wisest enemies run away at the first sight of me!", retort: "Even BEFORE they smell your breath?" },
    { insult: "Only once have I met such a coward!", retort: "He must have taught you everything you know." },
    { insult: "If your brother's like you, better to marry a pig.", retort: "You make me think somebody already did." },
    { insult: "No one will ever catch ME fighting as badly as you do.", retort: "You run THAT fast?" },
    { insult: "I will milk every drop of blood from your body!", retort: "How appropriate. You fight like a cow." },
    { insult: "My last fight ended with my hands covered with blood.", retort: "I hope now you've learned to stop picking your nose." },
    { insult: "I hope you have a boat ready for a quick escape.", retort: "Why, did you want to borrow one?" },
    { insult: "My sword is famous all over the Caribbean!", retort: "Too bad no one's ever heard of YOU at all." },
    { insult: "I've got the courage and skill of a master swordsman!", retort: "I'd be in real trouble if you ever used them." },
    { insult: "Every word you say to me is stupid.", retort: "I wanted to make sure you'd feel comfortable with me." },
    { insult: "You are a pain in the backside, sir!", retort: "Your hemorrhoids are flaring up again, eh?" },
    { insult: "There are no clever moves that can help you now.", retort: "Yes, there are. You just never learned them." },
    { insult: "Now I know what filth and stupidity really are.", retort: "I'm glad to hear you attended your family reunion." },
    { insult: "I usually see people like you passed-out on tavern floors.", retort: "Even BEFORE they smell your breath?" }
  ];

  // Pirate tiers (name + how many insults they “know” from AVAILABLE_INSULTS).
  // Weights [5,4,3,2,1] → more “Scurvy” than “Stinking”, etc.
  const PIRATE_TIERS = [
    { name: "Scurvy Pirate",     tierMax: 4,  weight: 5 },
    { name: "Stinking Pirate",   tierMax: 7,  weight: 4 },
    { name: "Ugly Pirate",       tierMax: 9,  weight: 3 },
    { name: "Intimidating Pirate", tierMax: 12, weight: 2 },
    { name: "Dangerous Pirate",  tierMax: AVAILABLE_INSULTS.length, weight: 1 }
  ];

  // Fallback retorts for when someone “does not know” the correct retort.
  const FALLBACK_RETORTS = [
    "Oh yeah?",
    "I...ing, I'm shaking.",
    "I am rubber, you are glue."
  ];

  // ─── STATE ───────────────────────────────────────────────────────────────────
  let state = {
    playerName: "",
    insultsLearned: [  // Start with two learned from the Python script
      "You fight like a dairy farmer!",
      "Soon you'll be wearing my sword like a shish kebab!"
    ],
    retortsLearned: [ // Start with two learned retorts from the Python
      "How appropriate. You fight like a cow.",
      "First you better stop waving it like a feather-duster."
    ],
    inGame: false,
    phase: "title",   // one of: title, intro, regular, swordmaster
    // REGULAR DUEL VARIABLES:
    pirateLives: 0,
    playerLives: 0,
    currentPirateTier: null,
    usedInsultsForThisPirate: [],
    turn: "player",   // "player" or "pirate"
    // SWORDMASTER VARIABLES:
    swordmasterIndex: 0
  };

  // ─── REFERENCE TO DOM ELEMENTS ────────────────────────────────────────────────
  let gameContainer;   // The main wrapper div
  let textArea;        // Where all text is printed
  let inputArea;       // The bottom region (text input or choice buttons)
  let textInput;       // For free‐text or number input
  let submitButton;    // For “press Enter” or “Submit”
  
  // ─── UTILITY / UI HELPERS ────────────────────────────────────────────────────
  
  // Append (or replace) the #game-container with the basic structure.
  function initUI() {
    gameContainer.innerHTML = "";

    // 1) A large text area (scrollable) for story/dialog.
    textArea = document.createElement("div");
    textArea.id = "text-area";
    textArea.innerText = "";
    gameContainer.appendChild(textArea);

    // 2) An area for inputs (buttons or text + button).
    inputArea = document.createElement("div");
    inputArea.id = "input-area";
    gameContainer.appendChild(inputArea);
  }

  // Clear the text area completely.
  function clearScreen() {
    textArea.innerText = "";
    inputArea.innerHTML = "";
    // In case a scroll was present, scroll back up.
    textArea.scrollTop = 0;
  }

  // Append a line of text (with a newline).
  function println(str = "") {
    textArea.innerText += str + "\n";
    // Always auto-scroll to bottom.
    textArea.scrollTop = textArea.scrollHeight;
  }

  // Show a big block of multi‐line text at once.
  function showBlockOfText(block) {
    textArea.innerText = block;
    textArea.scrollTop = textArea.scrollHeight;
  }

  // Display hearts (colored) for “lives”.
  function displayHearts(label, lives) {
    let full = "♥︎".repeat(lives);
    let empty = "♡".repeat(3 - lives);
    println(`${label}: ` + full.split("").map(ch => `<span class="heart-full">${ch}</span>`).join("") +
            empty.split("").map(ch => `<span class="heart-empty">${ch}</span>`).join(""));
  }

  // Pause then call callback (ms). Use setTimeout.
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Pick a random integer between [0, max-1].
  function randInt(max) {
    return Math.floor(Math.random() * max);
  }

  // Weighted random choice from PIRATE_TIERS based on “weight” field.
  function choosePirateTier() {
    const totalWeight = PIRATE_TIERS.reduce((sum, p) => sum + p.weight, 0);
    let pick = Math.random() * totalWeight;
    for (let p of PIRATE_TIERS) {
      if (pick < p.weight) return p;
      pick -= p.weight;
    }
    // Fallback, though we should never reach here
    return PIRATE_TIERS[0];
  }

  // Show a prompt that only expects the user to press Enter (or click “Continue”).
  function expectEnter(callback) {
    inputArea.innerHTML = "";
    // No text input; show a single “Continue” button.
    let btn = document.createElement("button");
    btn.innerText = "Continue";
    btn.onclick = () => {
      callback();
    };
    inputArea.appendChild(btn);
  }

  // Show a text‐input field + “Submit” button. After user types, call onSubmit(value).
  function expectTextInput(placeholderText, onSubmit) {
    inputArea.innerHTML = "";
    textInput = document.createElement("input");
    textInput.type = "text";
    textInput.id = "text-input";
    textInput.placeholder = placeholderText;
    textInput.autofocus = true;
    inputArea.appendChild(textInput);

    submitButton = document.createElement("button");
    submitButton.innerText = "Submit";
    submitButton.onclick = () => {
      let val = textInput.value.trim();
      onSubmit(val);
    };
    inputArea.appendChild(submitButton);

    textInput.addEventListener("keyup", (ev) => {
      if (ev.key === "Enter") {
        submitButton.click();
      }
    });
  }

  // Present a list of string‐choices. onChoice(index) will be called (zero‐based) when clicked.
  function showChoices(options, onChoice) {
    inputArea.innerHTML = "";
    let ul = document.createElement("ul");
    ul.className = "choice-list";
    options.forEach((opt, idx) => {
      let li = document.createElement("li");
      let btn = document.createElement("button");
      btn.className = "choice-button";
      btn.innerText = `${idx+1}) ${opt}`;
      btn.onclick = () => { onChoice(idx); };
      li.appendChild(btn);
      ul.appendChild(li);
    });
    gameContainer.appendChild(ul);
    inputArea.appendChild(ul);
  }

  // Show a “game-over” screen.
  function gameOver(message) {
    clearScreen();
    println(message);
    println("\n--- GAME OVER ---");
    println("Refresh page to play again.");
    inputArea.innerHTML = "";
  }

  // ─── PHASE 1: TITLE SCREEN & INTRO ───────────────────────────────────────────

  function showTitleScreen() {
    state.phase = "title";
    clearScreen();

    // ASCII‐style banner (abbreviated for brevity). You can inject the full ASCII if desired.
    const asciiBanner = `
████████╗██╗  ██╗███████╗  ██████╗███████╗ █████╗ ██████╗ ███████╗████████╗  █████╗ ███████╗
╚══██╔══╝██║  ██║██╔════╝  ██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝╚══██╔══╝  ██╔══██╗██╔════╝
   ██║   ███████║█████╗    ╚█████╗ █████╗  ███████║██║  ██║█████╗     ██║     ██║  ██║█████╗  
   ██║   ██╔══██║██╔══╝    ╚═══██╗██╔══╝  ██╔══██║██║  ██║██╔══╝     ██║     ██║  ██║██╔══╝  
   ██║   ██║  ██║███████╗  ██████╔╝███████╗██║  ██║██████╔╝███████╗   ██║     ╚█████╔╝██║     
   ╚═╝   ╚═╝  ╚═╝╚══════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝   ╚═╝      ╚════╝ ╚═╝     

         Deep In The Atlantic Ocean...
                The Island of Duck™
    
       Created and Designed by Alejandro Anguera de la Rosa
                  Version 0.8.0
    `;
    showBlockOfText(asciiBanner + "\nPress “Continue” to begin.\n");
    expectEnter(showIntro);
  }

  function showIntro() {
    state.phase = "intro";
    clearScreen();
    let introText = `
█ █▄░█ ▀█▀ █▀█ █▀█ █▀▄ █░█ █▀▀ ▀█▀ █ █▀█ █▄░█
█ █░▀█ ░█░ █▀▄ █▄█ █▄▀ █▄█ █▄▄ ░█░ █ █▄█ █░▀█

You want to become a mighty pirate on The Island of Duck™.

You are here to complete the Three Legendary Quests™ that have been set out for you.
You have already completed two of them: the Quest of the Duckbeard's Treasure™ (Treasure-huntery)
and the Quest of the Golden Egg™ (Thieving).
Now, you must complete the Quest of the Insult Sword Fighting™ (Insulting).
The Three Legendary Quests™ are the only way to become a true pirate, and to be able to sail the Seven C's™.

Type your name, then press “Submit” to begin your duel:
    `;
    showBlockOfText(introText);
    expectTextInput("Your name…", (val) => {
      if (!val) {
        // Must enter a name
        showBlockOfText("You must type a name to continue.\n\nType your name, then press “Submit”.");
        expectTextInput("Your name…", arguments.callee);
      } else {
        state.playerName = val;
        showBlockOfText(`Welcome, ${val}! Press “Continue” to begin your first duel…`);
        expectEnter(() => {
          startRegularDuel();
        });
      }
    });
  }

  // ─── PHASE 2: REGULAR DUELS AGAINST PIRATES ───────────────────────────────────

  async function startRegularDuel() {
    state.phase = "regular";
    clearScreen();

    // Loop forever (or until player gives up / completes).
    while (true) {
      // 1) Choose a random pirate tier (weighted).
      const tier = choosePirateTier();
      state.currentPirateTier = tier;
      state.pirateLives = 3;
      state.playerLives = 3;
      state.usedInsultsForThisPirate = [];
      state.turn = "player";

      // 2) Show a short “Get ready…” prompt:
      showBlockOfText(`A new challenger approaches: ${tier.name}!\nPress “Continue” to face them.`);
      await new Promise(r => expectEnter(r));

      // 3) Start the turn‐based loop:
      while (state.pirateLives > 0 && state.playerLives > 0) {
        clearScreen();
        // Show current life bars:
        displayHearts("You", state.playerLives);
        displayHearts("Pirate", state.pirateLives);
        println("");

        if (state.turn === "player") {
          // Build list of available insults:
          const available = [
            ...state.insultsLearned.filter(i => !state.usedInsultsForThisPirate.includes(i)),
            ...THROWAWAY_INSULTS
          ];

          // Display “Your turn to insult” and choices:
          println("Your turn to insult:");
          showChoices(available.concat(["I give up! You lose."]), (choiceIdx) => {
            const giveUpIndex = available.length; // last index
            if (choiceIdx === giveUpIndex) {
              // Player gave up immediately
              state.playerLives = 0;
            } else {
              const playerInsult = available[choiceIdx];
              // If it is a “learned” insult, mark it used:
              if (state.insultsLearned.includes(playerInsult)) {
                state.usedInsultsForThisPirate.push(playerInsult);
              }
              println(`\nYou: "${playerInsult}"\n`);

              // Now check if this insult is “throwaway”:
              if (THROWAWAY_INSULTS.includes(playerInsult)) {
                // Pirate fallback retort, no life lost by pirate:
                const fallback = FALLBACK_RETORTS[randInt(FALLBACK_RETORTS.length)];
                println(`Pirate: "${fallback}"`);
                state.turn = "pirate";
              } else {
                // It’s a “real” insult. Look up correct retort:
                const pair = AVAILABLE_INSULTS.find(p => p.insult === playerInsult);
                const idxIns = AVAILABLE_INSULTS.findIndex(p => p.insult === playerInsult);
                let correctRetort = pair ? pair.retort : null;

                if (idxIns >= 0 && idxIns < tier.tierMax) {
                  // Pirate “knows” the retort:
                  println(`Pirate: "${correctRetort}"`);
                  println("\nYou lose a heart.");
                  state.playerLives -= 1;
                  // Pirate teaches you the retort if you didn’t already have it:
                  if (correctRetort && !state.retortsLearned.includes(correctRetort)) {
                    state.retortsLearned.push(correctRetort);
                  }
                  state.turn = "pirate";
                } else {
                  // Pirate does NOT know the retort → fallback + pirate loses a heart:
                  const fallback = FALLBACK_RETORTS[randInt(FALLBACK_RETORTS.length)];
                  println(`Pirate: "${fallback}"`);
                  println("\nPirate loses a heart.");
                  state.pirateLives -= 1;
                  state.turn = "player";
                }
              }
            }
            proceedAfterChoice(); // wrapper to continue the loop
          });
          return; // wait for choice callback to resume loop

        } else {
          // Pirate’s turn to insult:
          const idx = randInt(tier.tierMax);
          const pirateInsult = AVAILABLE_INSULTS[idx].insult;
          const correctRetort = AVAILABLE_INSULTS[idx].retort;

          // Pirate uses that insult:
          println(`Pirate: "${pirateInsult}"\n`);
          // You learn it (if you didn’t already)
          if (!state.insultsLearned.includes(pirateInsult)) {
            state.insultsLearned.push(pirateInsult);
          }

          // Present your known retorts:
          if (state.retortsLearned.length === 0) {
            // You literally know no retorts → automatic loss
            println("You have no retorts to defend yourself!");
            state.playerLives = 0;
            proceedAfterChoice();
            return;
          }

          showChoices(
            state.retortsLearned.concat(["I give up! Pirate wins."]),
            (choiceIdx) => {
              const giveUpIndex = state.retortsLearned.length; 
              if (choiceIdx === giveUpIndex) {
                state.playerLives = 0; // gave up
              } else {
                const yourRetort = state.retortsLearned[choiceIdx];
                if (yourRetort === correctRetort) {
                  println("\nCorrect! Pirate loses a heart.");
                  state.pirateLives -= 1;
                  // You “learn” this retort (but you already know it).
                } else {
                  println("\nWrong! You lose a heart.");
                  state.playerLives -= 1;
                }
                state.turn = (yourRetort === correctRetort ? "player" : "pirate");
              }
              proceedAfterChoice();
            }
          );
          return; // wait for choice callback
        }
      } // end while-turn‐loop

      // Once we exit that loop, either pirateLives ≤ 0 (you win) or playerLives ≤ 0 (you lost).
      clearScreen();
      if (state.playerLives <= 0) {
        // You lost to this pirate.
        println(`You have been defeated by the ${tier.name}...`);
        println("\n--- GAME OVER ---\n");
        println("Refresh to try again.");
        inputArea.innerHTML = "";
        return; // end the entire game
      } else {
        // You defeated this pirate!
        println(`Victory! You have defeated the ${tier.name}!`);
        // Show how many insults/retorts you now know:
        const knownCount = state.retortsLearned.length;
        const totalCount = AVAILABLE_INSULTS.length;
        println(`Retorts known: ${knownCount}/${totalCount}\n`);
        // Check if you're ready for SwordMaster:
        if (knownCount / totalCount > 0.75) {
          println("You feel ready to face the SwordMaster™.");
          showChoices(["Yes, challenge the SwordMaster™", "No, fight another pirate"], (idx) => {
            if (idx === 0) {
              startSwordmasterChallenge();
            } else {
              startRegularDuel(); // re‐enter another pirate loop
            }
          });
          return;
        } else {
          println("Press “Continue” to face another pirate.");
          await new Promise(r => expectEnter(r));
          // and loop ===> next pirate
        }
      }
    } // end “while(true)” loop
  }

  // Resume control after a choice‐callback. We simply restart the same turn‐loop
  function proceedAfterChoice() {
    // We need to call startRegularDuel's inner loop again.
    // Easiest: just re‐invoke startRegularDuel, but we must preserve state.
    if (state.phase === "regular") {
      // A brief delay so that the text shows up before clearing/reprinting.
      setTimeout(startRegularDuel.bind(null), 100);
    }
  }

  // ─── PHASE 3: SWORDMASTER CHALLENGE ──────────────────────────────────────────

  async function startSwordmasterChallenge() {
    state.phase = "swordmaster";
    state.swordmasterIndex = 0;
    clearScreen();

    const promptIntro = `
You wish to challenge the legendary SwordMaster™, the ultimate test of your insult sword fighting skills.
The SwordMaster™ resides in a secluded glade deep within the forest, where only those truly versed in wit may pass.

You approach the SwordMaster™, who looks up at you and says:
"So, you are ${state.playerName}? If you ever hope to sail the Seven C's™, you'll have to defeat me in an insult sword fight."

Press “Continue” when you are ready.
    `;
    showBlockOfText(promptIntro);
    await new Promise(r => expectEnter(r));

    // Loop over SWORDMASTER_INSULTS sequentially:
    while (state.swordmasterIndex < SWORDMASTER_INSULTS.length) {
      clearScreen();
      const { insult, retort } = SWORDMASTER_INSULTS[state.swordmasterIndex];
      println(`SwordMaster: "${insult}"\n`);
      if (state.retortsLearned.length === 0) {
        println("You have no retorts to defend yourself!");
        gameOver("The Insult Master has bested you. You have no retorts left.");
        return;
      }
      showChoices(
        state.retortsLearned,
        (choiceIdx) => {
          const yourRet = state.retortsLearned[choiceIdx];
          if (yourRet !== retort) {
            clearScreen();
            println(`\nIncorrect! The Insult Master has bested you.`);
            println("\n--- GAME OVER ---\n");
            inputArea.innerHTML = "";
            return;
          } else {
            // Correct: move to next insult
            println("\nWell played! You matched his insult.");
            state.swordmasterIndex++;
            if (state.swordmasterIndex < SWORDMASTER_INSULTS.length) {
              showBlockOfText(`Press “Continue” for the next round against the SwordMaster™.`);
              expectEnter(() => {
                // recursing into the same while loop
                setTimeout(startSwordmasterChallenge.bind(null), 100);
              });
            } else {
              // All insults matched → Victory.
              setTimeout(() => {
                clearScreen();
                println(`Victory! You have defeated the SwordMaster™ in an insult sword fight.`);
                println(`\nThe SwordMaster™ nods in respect and says, "Well, it seems I underestimated you."`);
                println(`You are handed a shirt that reads "I beat the SwordMaster™ and all I got was this lousy T-shirt."`);
                println(`\n--- You are a true pirate now! ---\n`);
                inputArea.innerHTML = "";
              }, 200);
            }
          }
        }
      );
      return; // wait for choice callback before continuing
    }
  }

  // ─── BOOTSTRAP ONCE DOM IS READY ──────────────────────────────────────────────

  window.addEventListener("DOMContentLoaded", () => {
    gameContainer = document.getElementById("game-container");
    initUI();
    showTitleScreen();
  });
})();