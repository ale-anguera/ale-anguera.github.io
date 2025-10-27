#!/usr/bin/env python3

import os
import random
import time
import sys

# --- UI functions (new) ----------------------------------------------------

def load():
    clear_screen()
    print("""
        ----------------------------
        
        Deep In The Atlantic Ocean...
        
        The Island of Duck™        
        
        ----------------------------
        """)
    countdown(5)
    Title_screen()


def Title_screen():
    clear_screen()
    choice = None
    while choice is None:
        user_input = input("""

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
                E%                                                                :"5
                z  %                                                              :" `
                K   ":                                                           z   R
                ?     %.                                                       :^    J
                ".    ^s                                                     f     :~
  ██████  █     █░ ▒█████   ██▀███  ▓█████▄      █████▒██▓  ▄████  ██░ ██ ▄▄▄█████▓ ██▓ ███▄    █   ▄████ 
▒██    ▒ ▓█░ █ ░█░▒██▒  ██▒▓██ ▒ ██▒▒██▀ ██▌   ▓██   ▒▓██▒ ██▒ ▀█▒▓██░ ██▒▓  ██▒ ▓▒▓██▒ ██ ▀█   █  ██▒ ▀█▒
░ ▓██▄   ▒█░ █ ░█ ▒██░  ██▒▓██ ░▄█ ▒░██   █▌   ▒████ ░▒██▒▒██░▄▄▄░▒██▀▀██░▒ ▓██░ ▒░▒██▒▓██  ▀█ ██▒▒██░▄▄▄░
  ▒   ██▒░█░ █ ░█ ▒██   ██░▒██▀▀█▄  ░▓█▄   ▌   ░▓█▒  ░░██░░▓█  ██▓░▓█ ░██ ░ ▓██▓ ░ ░██░▓██▒  ▐▌██▒░▓█  ██▓
▒██████▒▒░░██▒██▓ ░ ████▓▒░░██▓ ▒██▒░▒████▓    ░▒█░   ░██░░▒▓███▀▒░▓█▒░██▓  ▒██▒ ░ ░██░▒██░   ▓██░░▒▓███▀▒
▒ ▒▓▒ ▒ ░░ ▓░▒ ▒  ░ ▒░▒░▒░ ░ ▒▓ ░▒▓░ ▒▒▓  ▒     ▒ ░   ░▓   ░▒   ▒  ▒ ░░▒░▒  ▒ ░░   ░▓  ░ ▒░   ▒ ▒  ░▒   ▒ 
░ ░▒  ░ ░  ▒ ░ ░    ░ ▒ ▒░   ░▒ ░ ▒░ ░ ▒  ▒     ░      ▒ ░  ░   ░  ▒ ░▒░ ░    ░     ▒ ░░ ░░   ░ ▒░  ░   ░ 
░  ░  ░    ░   ░  ░ ░ ░ ▒    ░░   ░  ░ ░  ░     ░ ░    ▒ ░░ ░   ░  ░  ░░ ░  ░       ▒ ░   ░   ░ ░ ░ ░   ░ 
      ░      ░        ░ ░     ░        ░               ░        ░  ░  ░  ░          ░           ░       ░ 
                                "s   ^*L                   z#   .*"
                                    #s   ^%L               z#   .*"
                                    #s   ^%L           z#   .r"
                                        #s   ^%.       u#   .r"
                                        #i   '%.   u#   .@"
                                            #s   ^%u#   .@"
                                            #s x#   .*"
                                            x#`  .@%.
                                            x#`  .d"  "%.
                                        xf~  .r" #s   "%.
                                    u   x*`  .r"     #s   "%.  x.
                                    %Mu*`  x*"         #m.  "%zX"
                                    :R(h x*              "h..*dN.
                                u@NM5e#>                 7?dMRMh.
                                z$@M@$#"#"                 *""*@MM$hL
                            u@@MM8*                          "*$M@Mh.
                            z$RRM8F"                             "N8@M$bL
                            5`RM$#                                  'R88f)R
                            'h.$"                                     #$x*                                                                                                                                                                             
                                                                                                           
        
        -------------------
        Created and Designed by Alejandro Anguera de la Rosa
        Version 0.8.0
        -------------------

        Press 'Enter' to start.
        > """)
        if user_input == "" or user_input == "1":
            choice = 1
            Intro()
        else:
            clear_screen()
            print("Come on... they were simple instructions. '1', or hit 'Enter' to continue.")


def Intro():
    clear_screen()
    choice = None
    while choice is None:
        user_input = input("""

        █ █▄░█ ▀█▀ █▀█ █▀█ █▀▄ █░█ █▀▀ ▀█▀ █ █▀█ █▄░█
        █ █░▀█ ░█░ █▀▄ █▄█ █▄▀ █▄█ █▄▄ ░█░ █ █▄█ █░▀█

        You want to become a mighty pirate on The Island of Duck™.
        
        You are here to complete the Three Legendary Quests™ that three legendary pirates have set out for you. You have already completed two of them;
        the Quest of the Duckbeard's Treasure™ (Treasure-huntery), and the Quest of the Golden Egg™ (Thieving). 
        Now, you must complete the Quest of the Insult Sword Fighting™ (Insulting).
        The Three Legendary Quests™ are the only way to become a true pirate, and to be able to sail the Seven C's™.
        
        The first quest required finding the buried treasure of the legendary pirate, Captain Duckbeard.
        The second, stealing the Golden Egg™ from the temple of Governor Duckley.
        The last quest, is to beat the legendary pirate, The SwordMaster™, in an insult sword fight.
        
        Your training with Captain Quackbeard, has been going well. 
        He has advised you to fight some local pirates to get some practice.
        The key to winning a sword fight, he says, is to insult your opponent.
        You must learn the insults and their retorts, so you can defeat the SwordMaster™.
        You will face many pirates, and learn their insults and retorts.
        You will also face the SwordMaster™, who is the best insult sword fighter in the Quackribbean.
        
        Good luck, pirate!

        Please type your name, and then hit 'Enter' to continue.
    
        > """)
        if user_input:
            player_name = user_input
            clear_screen()
            print(f"Welcome, {player_name}!")
            choice = "1"
            #title_menu(player_name)
            regular_duel(player_name)
        else:
            clear_screen()
            print("Type your name to start.")

# --- Utility functions ------------------------------------------------------

def clear_screen():
    """Clear the console screen."""
    os.system('cls' if os.name == 'nt' else 'clear') #type: ignore

def countdown(t):
    """Simple countdown timer (in seconds)."""
    while t:
        mins, secs = divmod(t, 60)
        timer = '{:02d}:{:02d}'.format(mins, secs)
        print(f"\rStarting in {timer}", end='', flush=True)
        time.sleep(1)
        t -= 1
    print()

# --- Data -------------------------------------------------------------------

# All insult/retort pairs (regular opponents)
AVAILABLE_INSULTS = [
    ("You fight like a dairy farmer!", "How appropriate. You fight like a cow."),
    ("I've heard you were a contemptible sneak!", "Too bad no one's ever heard of YOU at all."),
    ("People fall at my feet when they see me coming!", "Even BEFORE they smell your breath?"),
    ("I'm not going to take your insolence sitting down!", "Your hemorrhoids are flaring up again, eh?"),
    ("There are no words for how disgusting you are.", "Yes there are. You just never learned them."),
    ("You make me want to puke.", "You make me think somebody already did."),
    ("My handkerchief will wipe up your blood!", "So you got that job as janitor, after all."),
    ("I got this scar on my face during a mighty struggle!", "I hope now you've learned to stop picking your nose."),
    ("You're no match for my brains, you poor fool.", "I'd be in real trouble if you ever used them."),
    ("You have the manners of a beggar.", "I wanted to make sure you'd feel comfortable with me."),
    ("I once owned a dog that was smarter than you.", "He must have taught you everything you know."),
    ("Nobody's ever drawn blood from me and nobody ever will.", "You run THAT fast?"),
    ("I've spoken with apes more polite than you.", "I'm glad to hear you attended your family reunion."),
    ("Soon you'll be wearing my sword like a shish kebab!", "First you better stop waving it like a feather-duster."),
    ("This is the END for you, you gutter-crawling cur!", "And I've got a little TIP for you, get the POINT?")
]

SWORDMASTER_INSULTS = [
    ("I've got a long, sharp lesson for you you to learn today.", "And I've got a little TIP for you. Get the POINT?"),
    ("My tongue is sharper then any sword.", "First you’d better stop waving it like a feather-duster."),
    ("My name is feared in every dirty corner of this island!", "So you got that job as janitor, after all."),
    ("My wisest enemies run away at the first sight of me!", "Even BEFORE they smell your breath?"),
    ("Only once have I met such a coward!", "He must have taught you everything you know."),
    ("If your brother's like you, better to marry a pig.", "You make me think somebody already did."),
    ("No one will ever catch ME fighting as badly as you do.", "You run THAT fast?"),
    ("I will milk every drop of blood from your body!", "How appropriate. You fight like a cow."),
    ("My last fight ended with my hands covered with blood.", "I hope now you've learned to stop picking your nose."),
    ("I hope you have a boat ready for a quick escape.", "Why, did you want to borrow one?"),
    ("My sword is famous all over the Caribbean!", "Too bad no one's ever heard of YOU at all."),
    ("I've got the courage and skill of a master swordsman!", "I'd be in real trouble if you ever used them."),
    ("Every word you say to me is stupid.", "I wanted to make sure you'd feel comfortable with me."),
    ("You are a pain in the backside, sir!", "Your hemorrhoids are flaring up again, eh?"),
    ("There are no clever moves that can help you now.", "Yes, there are. You just never learned them."),
    ("Now I know what filth and stupidity really are.", "I'm glad to hear you attended your family reunion."),
    ("I usually see people like you passed-out on tavern floors.", "Even BEFORE they smell your breath?")
]

THROWAWAY_INSULTS = [
    "Boy are you ugly!",
    "What an idiot",
    "You call yourself a pirate!"
]

# Learned insults and retorts persist across pirate fights
insults_learned = ["You fight like a dairy farmer!", "Soon you'll be wearing my sword like a shish kebab!"]
retorts_learned = ["How appropriate. You fight like a cow.", "First you better stop waving it like a feather-duster."]

# Display heart-based life bars
def display_hearts(label, lives):
    hearts_display = '♥︎' * lives + '♡' * (3 - lives)
    print(f"{label}: {hearts_display}")

# Extract all retorts for player to choose from
ALL_RETORTS = [retort for _, retort in AVAILABLE_INSULTS]

# --- Game logic -------------------------------------------------------------


def get_player_name():
    clear_screen()
    name = ''
    while not name.strip():
        name = input("Please type your name, then press 'Enter': ").strip()
        if not name:
            print("You must enter a name to continue.")
    return name

def title_menu(player_name):
    while True:
        clear_screen()
        print(f"Welcome, {player_name}!\n")
        print("Choose your challenge:")
        print("  1) Regular Duel")
        print("  2) SwordMaster Challenge")
        print("  Q) Quit")
        choice = input("\n> ").strip().lower()
        if choice == '1':
            regular_duel(player_name)
        elif choice == '2':
            swordmaster_challenge(player_name)
        elif choice == 'q':
            clear_screen()
            print(f"Fair winds and following seas, {player_name}!")
            sys.exit()
        else:
            print("Invalid choice. Please enter 1, 2, or Q.")
            time.sleep(1)

def regular_duel(player_name):
    clear_screen()
    #print("Fight other pirates, and learn insults & retorts until you're ready for the SwordMaster.\n")
    #input("Press Enter to begin...")

    while True:
        # Track insults used in this match so they cannot be reused
        # (Moved to inside pirate block below for per-pirate reset)
        # used_insults = []
        pirate_tiers = [
            ('Scurvy Pirate', 4),
            ('Stinking Pirate', 7),
            ('Ugly Pirate', 9),
            ('Intimidating Pirate', 12),
            ('Dangerous Pirate', len(AVAILABLE_INSULTS))
        ]
        weights = [5, 4, 3, 2, 1]  # Corresponding probabilities out of 15
        tier_name, tier_max = random.choices(pirate_tiers, weights=weights, k=1)[0] #type: ignore
        pirate_lives = 3
        player_lives = 3
        # Reset used insults for this pirate
        used_insults = []
        clear_screen()
        print(f"A {tier_name} approaches, {player_name}!")
        print(f"\n'My name is {player_name}. Prepare to die!")

        # First turn: player starts insulting
        turn = 'player'
        while pirate_lives > 0 and player_lives > 0:
            print()
            display_hearts("You", player_lives)
            display_hearts("Pirate", pirate_lives)
            if turn == 'pirate':
                # Pirate chooses an insult from their known pool
                idx = random.randrange(tier_max)
                insult, correct_retort = AVAILABLE_INSULTS[idx]
                print(f"\nPirate: '{insult}'\n")
                # Always learn pirate's insult
                if insult not in insults_learned:
                    insults_learned.append(insult)
                for i, r in enumerate(retorts_learned, 1):
                    print(f"  {i}. {r}")
                giveup_index = len(retorts_learned) + 1
                print(f"  {giveup_index}. I give up! You win!")
                choice = input("\nYour retort (number): ").strip()
                if choice.isdigit() and int(choice) == giveup_index:
                    print("\nYou gave up! The pirate wins.")
                    player_lives = 0
                    break
                if choice.isdigit() and 1 <= int(choice) <= len(retorts_learned) and retorts_learned[int(choice)-1] == correct_retort:
                    print("\nCorrect! Pirate loses a heart.")
                    pirate_lives -= 1
                    if correct_retort not in retorts_learned:
                        retorts_learned.append(correct_retort)
                    turn = 'player'
                else:
                    print("\nWrong! You lose a heart.")
                    player_lives -= 1
                    turn = 'pirate'
            else:
                print("\nYour turn to insult:")
                # Build list of available insults excluding those already used
                available_insults = [ins for ins in insults_learned if ins not in used_insults]
                # Append throwaway insults at end
                for tw in THROWAWAY_INSULTS:
                    available_insults.append(tw)
                for i, ins in enumerate(available_insults, 1):
                    print(f"  {i}. {ins}")
                giveup_index = len(available_insults) + 1
                print(f"  {giveup_index}. I give up! You win!")
                choice = input("\nYour insult (number): ").strip()
                if choice.isdigit() and int(choice) == giveup_index:
                    print("\nYou gave up! The pirate wins.")
                    player_lives = 0
                    break
                if choice.isdigit() and 1 <= int(choice) <= len(available_insults):
                    player_insult = available_insults[int(choice)-1]
                    print(f"\nYou: '{player_insult}'")
                    # Mark this insult as used if it's from learned insults
                    if player_insult in insults_learned:
                        used_insults.append(player_insult)
                    # Check if this is a throwaway insult
                    if player_insult in THROWAWAY_INSULTS:
                        # Advance dialogue: pirate retorts with fallback, no lives change
                        fallback = random.choice(["Oh yeah?", "I'm shaking, I'm shaking.", "I am rubber, you are glue."]) #type: ignore
                        print(f"Pirate: '{fallback}'")
                        turn = 'pirate'
                    else:
                        # Determine correct retort from AVAILABLE_INSULTS
                        correct_retort = next((ret for ins, ret in AVAILABLE_INSULTS if ins == player_insult), None)
                        # Check pirate knowledge based on tier
                        idx_ins = next((i for i, (ins, _) in enumerate(AVAILABLE_INSULTS) if ins == player_insult), None)
                        if idx_ins is not None and idx_ins < tier_max:
                            # Pirate knows the retort
                            print(f"Pirate: '{correct_retort}'")
                            print("\nYou lose a heart.")
                            player_lives -= 1
                            # Learn the retort from pirate
                            if correct_retort not in retorts_learned:
                                retorts_learned.append(correct_retort) #type: ignore
                            turn = 'pirate'
                        else:
                            # Pirate does not know the retort, uses fallback
                            fallback = random.choice(["Oh yeah?", "I'm shaking, I'm shaking.", "I am rubber, you are glue."]) #type: ignore
                            print(f"Pirate: '{fallback}'")
                            print("\nPirate loses a heart.")
                            pirate_lives -= 1
                            turn = 'player'
                else:
                    print("\nInvalid choice! You lose a heart.")
                    player_lives -= 1
                    turn = 'pirate'
            time.sleep(2)
            clear_screen()

        # After the fight
        if pirate_lives == 0:
            print("Pirate: 'I give up! You win!'")
            learned_ratio = len(insults_learned) / len(AVAILABLE_INSULTS)
            if learned_ratio > 0.75:
                print("\nWow! You are good enough to defeat the SwordMaster!")
        else:
            print(f"{player_name}: 'I give up! You win!'")
            learned_ratio = len(insults_learned) / len(AVAILABLE_INSULTS)

        print(f"\nInsults known: {len(insults_learned)}/{len(AVAILABLE_INSULTS)}")
        print(f"Retorts known: {len(retorts_learned)}/{len(AVAILABLE_INSULTS)}")

        if learned_ratio > 0.75:
            choice = input("\nFace the SwordMaster now? \n('y' to face the SwordMaster, or just press 'Enter' to continue facing pirates): ").strip().lower()
            if choice == 'y':
                swordmaster_challenge(player_name)
            else:
                print("\nA new pirate approaches!")
                time.sleep(2)
                clear_screen()
        else:
            input("\nPress 'Enter' to face another pirate...")
            clear_screen()

def swordmaster_challenge(player_name):
    global retorts_learned
    clear_screen()
    user_input = input(f"""
    You wish to challenge the legendary SwordMaster™, the ultimate test of your insult sword fighting skills.
    Your journey has led you through countless pirate battles, and now you stand at the threshold of destiny.
    The SwordMaster™ resides in a secluded glade deep within the forest, where only those truly versed in wit may pass.

    You enter a dim, cluttered shop on the village square, where a wiry, one-eyed shopkeeper greets you: "Ahoy there, fancy pants!". He listens as you explain you seek the famed SwordMaster™. He tells you to stay in the shop whilst he goes to ask the SwordMaster™ if she would like to see you - "AND DON'T TOUCH ANYTHING!". Sneakily, you follow him through the village at a distance, until you reach a forest, where you traverse a winding path under rustling boughs and crouching roots until you emerge into a clearing where a modest wooden house stands, smoke rising from its chimney. The shopkeeper mentions the mighty pirate wannabe named {player_name}. The SwordMaster™ does not want anything to do with you, and sends the shopkeeper away. You then approach the SwordMaster™, she looks up at you and says:
    "So, you are {player_name}? I bet those three bums have sent you on the three quests... I don't have time for amateurs. But if you want to prove yourself, you'll have to defeat me in an insult sword fight."

    Press 'Enter' to continue.
    > """)
    clear_screen()
    for insult, correct_retort in SWORDMASTER_INSULTS:
        clear_screen()
        print(f"SwordMaster: '{insult}'\n")
        for i, r in enumerate(retorts_learned, 1):
            print(f"  {i}. {r}")
        choice = input("\nYour retort (number): ").strip()
        if not choice.isdigit() or retorts_learned[int(choice) - 1] != correct_retort:
            print("\nIncorrect! The Insult Master has bested you.")
            print("GAME OVER")
            sys.exit()
        else:
            print("\nWell played! You matched his insult.")
            input("Press 'Enter' for the next round...")

    clear_screen()
    user_input = input(f"""
    Victory! You have defeated the SwordMaster™ in an insult sword fight.
    The SwordMaster™ nods in respect and says, "Well it seems I underestimated you, {player_name}. Anyway, you'll want to show this to those three pirates to prove your win."
    You are handed a shirt that reads "I beat the SwordMaster™ and all I got was this lousy t-shirt".

    Press 'Enter' to continue.
    > """)
    sys.exit()

# --- Main ------------------------------------------------------------------

if __name__ == "__main__":
    load()