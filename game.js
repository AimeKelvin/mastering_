const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// The order matters: each weapon beats the next 7 weapons.
// CHAOS MODE 2: supernatural warfare
const choices = [
  "rock",
  "paper",
  "scissors",
  "laser",
  "zombie",
  "vampire",
  "werewolf",
  "ghost",
  "alien",
  "robot",
  "meteor",
];

const emojis = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
  laser: "🔴",
  zombie: "🧟",
  vampire: "🧛",
  werewolf: "🐺",
  ghost: "👻",
  alien: "👽",
  robot: "🤖",
  meteor: "☄️",
};

// Automatically creates balanced rules.
// With 15 weapons, every weapon beats exactly 7 others.
function createBattleRules() {
  const battleRules = {};
  const weaponsDefeated = Math.floor(choices.length / 2);

  for (let i = 0; i < choices.length; i++) {
    battleRules[choices[i]] = [];

    for (let j = 1; j <= weaponsDefeated; j++) {
      const defeatedWeapon = choices[(i + j) % choices.length];
      battleRules[choices[i]].push(defeatedWeapon);
    }
  }

  return battleRules;
}

const beats = createBattleRules();

let playerHealth = 150;
let computerHealth = 150;
let round = 1;

function getComputerChoice() {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function getWinner(player, computer) {
  if (player === computer) {
    return "draw";
  }

  if (beats[player].includes(computer)) {
    return "player";
  }

  return "computer";
}

function getDamage() {
  let damage = Math.floor(Math.random() * 16) + 20;
  const criticalHit = Math.random() < 0.15;

  if (criticalHit) {
    damage += 15;
  }

  return {
    damage,
    criticalHit,
  };
}

function showRules() {
  console.log("\n====== CHAOS MODE 1 RULES ======\n");

  for (const choice of choices) {
    const defeated = beats[choice]
      .map((item) => `${emojis[item]} ${item}`)
      .join(", ");

    console.log(
      `${emojis[choice]} ${choice.toUpperCase()} beats: ${defeated}`
    );
  }

  console.log("\n================================\n");
}

function showWeapons() {
  console.log("\n====== AVAILABLE WEAPONS ======\n");

  choices.forEach((choice, index) => {
    console.log(`${index + 1}. ${emojis[choice]} ${choice.toUpperCase()}`);
  });

  console.log("\n===============================\n");
}

function showHealth() {
  console.log("\n❤️ HEALTH");
  console.log(`You:      ${Math.max(playerHealth, 0)} HP`);
  console.log(`Computer: ${Math.max(computerHealth, 0)} HP`);
}

function playRound() {
  console.log(`\n========== ROUND ${round} ==========`);

  rl.question(
    "\nChoose a weapon, or type weapons, rules, or quit\n> ",
    (answer) => {
      const playerChoice = answer.toLowerCase().trim();

      if (playerChoice === "rules") {
        showRules();
        playRound();
        return;
      }

      if (playerChoice === "weapons") {
        showWeapons();
        playRound();
        return;
      }

      if (playerChoice === "quit") {
        console.log("\nYou escaped the battlefield. 🏃");
        rl.close();
        return;
      }

      if (!choices.includes(playerChoice)) {
        console.log("\n❌ Invalid weapon.");
        console.log("Type 'weapons' to see all available weapons.");
        playRound();
        return;
      }

      const computerChoice = getComputerChoice();

      console.log(
        `\nYOU:      ${emojis[playerChoice]} ${playerChoice.toUpperCase()}`
      );

      console.log(
        `COMPUTER: ${emojis[computerChoice]} ${computerChoice.toUpperCase()}`
      );

      const winner = getWinner(playerChoice, computerChoice);

      if (winner === "draw") {
        console.log("\n💥 CLASH!");
        console.log("Neither fighter takes damage.");
      } else {
        const attack = getDamage();

        if (winner === "player") {
          computerHealth -= attack.damage;

          console.log(
            `\n${emojis[playerChoice]} ${playerChoice.toUpperCase()} destroys ` +
              `${emojis[computerChoice]} ${computerChoice.toUpperCase()}!`
          );

          if (attack.criticalHit) {
            console.log("🔥 CRITICAL HIT!");
          }

          console.log(`You dealt ${attack.damage} damage.`);
        } else {
          playerHealth -= attack.damage;

          console.log(
            `\n${emojis[computerChoice]} ${computerChoice.toUpperCase()} destroys ` +
              `${emojis[playerChoice]} ${playerChoice.toUpperCase()}!`
          );

          if (attack.criticalHit) {
            console.log("💀 COMPUTER CRITICAL HIT!");
          }

          console.log(`Computer dealt ${attack.damage} damage.`);
        }
      }

      showHealth();

      if (playerHealth <= 0) {
        console.log("\n☠️ ===========================");
        console.log("      YOU HAVE BEEN DEFEATED");
        console.log("===============================\n");

        rl.close();
        return;
      }

      if (computerHealth <= 0) {
        console.log("\n🏆 ===========================");
        console.log("         YOU WON THE WAR");
        console.log("===============================\n");

        rl.close();
        return;
      }

      round++;
      playRound();
    }
  );
}

console.log(`
╔════════════════════════════════════╗
║                                    ║
║       👻 RPS: CHAOS MODE 2 👽       ║
║                                    ║
╚════════════════════════════════════╝

Supernatural creatures have entered the war.

There are ${choices.length} fighters.
Each fighter defeats exactly ${Math.floor(choices.length / 2)} others.

Both fighters start with 150 HP.

COMMANDS

"weapons" — View every available fighter
"rules"   — View the battle rules
"quit"    — Escape the supernatural war
`);

showWeapons();
playRound();