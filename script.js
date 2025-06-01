/* global auto‑scroll flag: off for first banner, on afterwards */
let autoScroll = false;
/* ======================  utility I/O  ====================== */
const $out  = document.getElementById("output");
const $in   = document.getElementById("userInput");

function print(txt = "") {
  $out.textContent += txt + "\n";
  // auto-scroll
  if (autoScroll) {
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
  }
}
function clearScreen() { $out.textContent = ""; }

/* prompt user – returns a Promise that resolves with the line typed */
function getLine(promptText = "") {
  return new Promise(res => {
    if (promptText) print(promptText);
    $in.disabled = false;  $in.focus();
    function handler(ev){
      if (ev.key === "Enter") {
        ev.preventDefault();
        const val = $in.value;
        $in.value = "";
        print(val);
        $in.removeEventListener("keydown", handler);
        res(val);
      }
    }
    $in.addEventListener("keydown", handler);
  });
}

/* helper delays */
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rnd    = arr => arr[Math.floor(Math.random()*arr.length)];

/* ======================  data tables  ====================== */
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

/* player progress (persist across fights) */
const insultsLearned = new Set([
  "You fight like a dairy farmer!",
  "Soon you'll be wearing my sword like a shish kebab!"
]);
const retortsLearned = new Set([
  "How appropriate. You fight like a cow.",
  "First you better stop waving it like a feather-duster."
]);

/* ======================  UI helpers  ====================== */
function displayHearts(label, lives){
  const hearts = "♥︎".repeat(lives) + "♡".repeat(3 - lives);
  print(`${label}: ${hearts}`);
}

/* countdown like original */
async function countdown(t){
  while(t){
    const m = String(Math.floor(t/60)).padStart(2,"0");
    const s = String(t%60).padStart(2,"0");
    //print(`\rStarting in ${m}:${s}`);
    await sleep(1000);
    t--;
    // overwrite previous line
    $out.textContent = $out.textContent.replace(/\r[^\n]*$/, "");
  }
  print("");
}

/* ======================  game flow  ====================== */
async function load(){
  clearScreen();
  print(`
        ----------------------------
        
        Deep In The Atlantic Ocean...
        
        The Island of Duck™        
        
        ----------------------------
  `);
  await countdown(3);
  await titleScreen();
}

/* ------- title screen -------- */
async function titleScreen(){
  while(true){
    clearScreen();
    const choice = (await getLine(`

        ████████╗██╗░░██╗███████╗  ░██████╗███████╗░█████╗░██████╗░███████╗████████╗  ░█████╗░███████╗
        ╚══██╔══╝██║░░██║██╔════╝  ██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝╚══██╔══╝  ██╔══██╗██╔════╝
        ░░░██║░░░███████║█████╗░░  ╚█████╗░█████╗░░██║░░╚═╝██████╔╝█████╗░░░░░██║░░░  ██║░░██║█████╗░░
        ░░░██║░░░██╔══██║██╔══╝░░  ░╚═══██╗██╔══╝░░██║░░██╗██╔══██╗██╔══╝░░░░░██║░░░  ██║░░██║██╔══╝░░
        ░░░██║░░░██║░░██║███████╗  ██████╔╝███████╗╚█████╔╝██║░░██║███████╗░░░██║░░░  ╚█████╔╝██║░░░░░
        ░░░╚═╝░░░╚═╝░░╚═╝╚══════╝  ╚═════╝░╚══════╝░╚════╝░╚═╝░░╚═╝╚══════╝░░░╚═╝░░░  ░╚════╝░╚═╝░░░░░

        ██████╗░██╗░░░██╗░█████╗░██╗░░██╗  ██╗░██████╗██╗░░░░░░█████╗░███╗░░██╗██████╗░██╗™
        ██╔══██╗██║░░░██║██╔══██╗██║░██╔╝  ██║██╔════╝██║░░░░░██╔══██╗████╗░██║██╔══██╗╚═╝
        ██║░░██║██║░░░██║██║░░╚═╝█████═╝░  ██║╚█████╗░██║░░░░░███████║██╔██╗██║██║░░██║░░░
        ██║░░██║██║░░░██║██║░░██╗██╔═██╗░  ██║░╚═══██╗██║░░░░░██╔══██║██║╚████║██║░░██║░░░
        ██████╔╝╚██████╔╝╚█████╔╝██║░╚██╗  ██║██████╔╝███████╗██║░░██║██║░╚███║██████╔╝██╗
        ╚═════╝░░╚═════╝░░╚════╝░╚═╝░░╚═╝  ╚═╝╚═════╝░╚══════╝╚═╝░░╚═╝╚═╝░░╚══╝╚═════╝░╚═╝
                n                                                                 :.
                E%                                                                : 5
                z  %                                                              :   
                K    :                                                           z   R
                ?     %.                                                       :^    J
                .     ^s                                                     f     :~
  ██████  █     █░ ▒█████   ██▀███  ▓█████▄      █████▒██▓  ▄████  ██░ ██ ▄▄▄█████▓ ██▓ ███▄    █   ▄████ 
▒██    ▒ ▓█░ █ ░█░▒██▒  ██▒▓██ ▒ ██▒▒██▀ ██▌   ▓██   ▒▓██▒ ██▒ ▀█▒▓██░ ██▒▓  ██▒ ▓▒▓██▒ ██ ▀█   █  ██▒ ▀█▒
░ ▓██▄   ▒█░ █ ░█ ▒██░  ██▒▓██ ░▄█ ▒░██   █▌   ▒████ ░▒██▒▒██░▄▄▄░▒██▀▀██░▒ ▓██░ ▒░▒██▒▓██  ▀█ ██▒▒██░▄▄▄░
  ▒   ██▒░█░ █ ░█ ▒██   ██░▒██▀▀█▄  ░▓█▄   ▌   ░▓█▒  ░░██░░▓█  ██▓░▓█ ░██ ░ ▓██▓ ░ ░██░▓██▒  ▐▌██▒░▓█  ██▓
▒██████▒▒░░██▒██▓ ░ ████▓▒░░██▓ ▒██▒░▒████▓    ░▒█░   ░██░░▒▓███▀▒░▓█▒░██▓  ▒██▒ ░ ░██░▒██░   ▓██░░▒▓███▀▒
▒ ▒▓▒ ▒ ░░ ▓░▒ ▒  ░ ▒░▒░▒░ ░ ▒▓ ░▒▓░ ▒▒▓  ▒     ▒ ░   ░▓   ░▒   ▒  ▒ ░░▒░▒  ▒ ░░   ░▓  ░ ▒░   ▒ ▒  ░▒   ▒ 
░ ░▒  ░ ░  ▒ ░ ░    ░ ▒ ▒░   ░▒ ░ ▒░ ░ ▒  ▒     ░      ▒ ░  ░   ░  ▒ ░▒░ ░    ░     ▒ ░░ ░░   ░ ▒░  ░   ░ 
░  ░  ░    ░   ░  ░ ░ ░ ▒    ░░   ░  ░ ░  ░     ░ ░    ▒ ░░ ░   ░  ░  ░░ ░  ░       ▒ ░   ░   ░ ░ ░ ░   ░ 
      ░      ░        ░ ░     ░        ░               ░        ░  ░  ░  ░          ░           ░       ░ 
                                s   ^*L                   z#   .* 
                                    #s   ^%L               z#   .* 
                                    #s   ^%L           z#   .r 
                                        #s   ^%.       u#   .r 
                                        #i    %.   u#   .@ 
                                            #s   ^%u#   .@ 
                                            #s x#   .* 
                                            x#    .@%.
                                            x#    .d   %. 
                                        xf~   .r  #s   %. 
                                    u   x*   .r      #s    %.  x.
                                    %Mu*   x*         #m.   %zX 
                                    :R(h x*              h..*dN.
                                u@NM5e#>                 7?dMRMh.
                                z$@M@$# #                 *  *@MM$hL
                            u@@MM8*                          *$M@Mh.
                            z$RRM8F                              N8@M$bL
                            5 RM$#                                  R88f)R
                            h.$                                      #$x*                                                                                                                                                                           
                                                                                                           
        
        -------------------
        Created and Designed by Alejandro Anguera de la Rosa
        Version 1.2.1
        -------------------

        Press 'Enter' to start.
        `)).trim();
    if(choice === "" || choice === "1"){
      autoScroll = true;   // enable bottom‑scrolling after first screen
      await intro();
      return;
    }
    print("Come on... they were simple instructions. '1', or hit 'Enter' to continue.");
    await sleep(1500);
  }
}

/* ------- intro -------- */
async function intro(){
  while(true){
    clearScreen();
    const name = (await getLine(`
█ █▄░█ ▀█▀ █▀█ █▀█ █▀▄ █░█ █▀▀ ▀█▀ █ █▀█ █▄░█
█ █░▀█ ░█░ █▀▄ █▄█ █▄▀ █▄█ █▄▄ ░█░ █ █▄█ █░▀█

You want to become a mighty pirate on The Island of Duck™.

You are here to complete the Three Legendary Quests™ that three legendary pirates have set out for you. You have already completed two of them;
the Quest of the Duckbeard's Treasure™ (Treasure-huntery) - which consisted of finding the buried treasure of the legendary pirate, Captain Duckbeard, 
and the Quest of the Golden Egg™ (Thieving) - which meant stealing the Golden Egg™ from the temple of Governor Duckley.. 
Now, you must complete the Quest of the Insult Sword Fighting™ (Insulting).
The Three Legendary Quests™ are the only way to become a true pirate, and to be able to sail the Seven C's™.

Your training with Captain Bill, has been going well.
He has advised you to fight some local pirates to get some practice.
The key to winning a sword fight, he says, is to insult your opponent with a sharp tongue.
You must learn the insults and their retorts, so you can defeat the SwordMaster™.
You will face many pirates, and learn their insults and retorts.
Lastly, you will face the SwordMaster™, who is the best insult sword fighter in the Quackribbean.

Good luck, pirate!

Please type your name, and then hit 'Enter' to continue.
>`)).trim();
    if(name){
      await regularDuel(name);
      return;
    }
    print("Type your name to start.");
    await sleep(1200);
  }
}

/* ------- main duel loop -------- */
async function regularDuel(playerName){
  while(true){
    /* pick pirate tier */
    const pirateTiers = [
      ["Scurvy Pirate", 4],
      ["Stinking Pirate", 7],
      ["Ugly Pirate", 9],
      ["Intimidating Pirate", 12],
      ["Dangerous Pirate", AVAILABLE_INSULTS.length]
    ];
    const weights = [5,4,3,2,1];
    const tier = pirateTiers[Math.floor(Math.random()*weights.reduce((a,b)=>a+b))];
    const [tierName, tierMax] = tier ?? pirateTiers[0];

    let pirateLives = 3, playerLives = 3;
    let usedInsults = [];
    let turn = "player";

    clearScreen();
    print(`A ${tierName} approaches, ${playerName}!`);
    print(`\n'My name is ${playerName}. Prepare to die!`);

    /* fight loop */
    while(pirateLives>0 && playerLives>0){
      print("");
      displayHearts("You", playerLives);
      displayHearts("Pirate", pirateLives);

      if(turn === "pirate"){
        const idx = Math.floor(Math.random()*tierMax);
        const [insult, correct] = AVAILABLE_INSULTS[idx];
        print(`\nPirate: '${insult}'\n`);
        insultsLearned.add(insult);

        const retortsArr = Array.from(retortsLearned);
        retortsArr.forEach((r,i)=>print(`  ${i+1}. ${r}`));
        const giveUp = retortsArr.length + 1;
        print(`  ${giveUp}. I give up! You win!`);
        const choice = await getLine("\nYour retort (number): ");
        if(+choice === giveUp){
          print("\nYou gave up! The pirate wins.");
          playerLives = 0;
          break;
        }
        if(retortsArr[+choice-1] === correct){
          print("\nCorrect! Pirate loses a heart.");
          pirateLives--;
          retortsLearned.add(correct);
          turn = "player";
        }else{
          print("\nWrong! You lose a heart.");
          playerLives--;
          turn = "pirate";
        }
      }else{ /* player turn to insult */
        print("\nYour turn to insult:");
        const available = Array.from(insultsLearned).filter(x=>!usedInsults.includes(x))
                       .concat(THROWAWAY_INSULTS);
        available.forEach((ins,i)=>print(`  ${i+1}. ${ins}`));
        const giveUp = available.length + 1;
        print(`  ${giveUp}. I give up! You win!`);
        const choice = await getLine("\nYour insult (number): ");
        if(+choice === giveUp){
          print("\nYou gave up! The pirate wins.");
          playerLives = 0; break;
        }
        const playerInsult = available[+choice-1];
        if(!playerInsult){
          print("\nInvalid choice! You lose a heart.");
          playerLives--; turn="pirate"; continue;
        }
        print(`\nYou: '${playerInsult}'`);
        if(!THROWAWAY_INSULTS.includes(playerInsult)) usedInsults.push(playerInsult);

        if(THROWAWAY_INSULTS.includes(playerInsult)){
          print(`Pirate: '${rnd(["Oh yeah?","I'm shaking, I'm shaking.","I am rubber, you are glue."])}'`);
          turn="pirate";
        }else{
          const correct = AVAILABLE_INSULTS.find(([ins])=>ins===playerInsult)[1];
          const idxIns = AVAILABLE_INSULTS.findIndex(([ins])=>ins===playerInsult);
          if(idxIns < tierMax){
            print(`Pirate: '${correct}'`);
            print("\nYou lose a heart.");
            playerLives--; retortsLearned.add(correct);
            turn="pirate";
          }else{
            print(`Pirate: '${rnd(["Oh yeah?","I'm shaking, I'm shaking.","I am rubber, you are glue."])}'`);
            print("\nPirate loses a heart.");
            pirateLives--; turn="player";
          }
        }
      }
      await sleep(1500); clearScreen();
    }

    /* outcome */
    if(pirateLives===0){
      print("Pirate: 'I give up! You win!'");
    }else{
      print(`${playerName}: 'I give up! You win!'`);
    }
    const learnedRatio = insultsLearned.size/AVAILABLE_INSULTS.length;
    print(`\nInsults known: ${insultsLearned.size}/${AVAILABLE_INSULTS.length}`);
    print(`Retorts known: ${retortsLearned.size}/${AVAILABLE_INSULTS.length}`);

    if(learnedRatio>0.75){
      const ans = (await getLine("\nFace the SwordMaster now? (y / Enter to skip): ")).trim().toLowerCase();
      if(ans==="y"){ await swordmaster(playerName); return; }
    }
    await getLine("\nPress 'Enter' for another pirate...");
    clearScreen();
  }
}

/* ------- SwordMaster duel -------- */
async function swordmaster(playerName){
  clearScreen();
  await getLine(`
[… long intro kept verbatim …]

Press 'Enter' to continue.
>`);
  clearScreen();

  for(const [insult, correct] of SWORDMASTER_INSULTS){
    print(`SwordMaster: '${insult}'\n`);
    const choices = Array.from(retortsLearned);
    choices.forEach((r,i)=>print(`  ${i+1}. ${r}`));
    const choice = await getLine("\nYour retort (number): ");
    if(choices[+choice-1] !== correct){
      print("\nIncorrect! The SwordMaster has bested you.\nGAME OVER");
      return;
    }
    print("\nWell played! You matched the insult.");
    await getLine("Press 'Enter' for the next round...");
    clearScreen();
  }
  await getLine(`
Victory! You have defeated the SwordMaster™ in an insult sword fight.

The SwordMaster™ nods in respect and says,
"Well it seems I underestimated you, ${playerName}…"

Press 'Enter' to revel in glory!
>`);
  clearScreen();
  print("YOU WIN!  🏴‍☠️  Refresh the page to play again.");
}

/* ======================  kick things off  ====================== */
load();