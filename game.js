const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const choices = [
  "rock",
  "scissors",
  "sword",
  "gun",
  "paper",
  "magic",
  "shield",
];

const emojis = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
  sword: "⚔️",
  gun: "🔫",
  shield: "🛡️",
  magic: "🔮",
};

// Each weapon beats exactly 3 others.
const beats = {
  rock: ["scissors", "sword", "gun"],
  scissors: ["sword", "gun", "paper"],
  sword: ["gun", "paper", "magic"],
  gun: ["paper", "magic", "shield"],
  paper: ["magic", "shield", "rock"],
  magic: ["shield", "rock", "scissors"],
  shield: ["rock", "scissors", "sword"],
};

let playerHealth = 100;
let computerHealth = 100;
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
  console.log("\n====== CHAOS MODE RULES ======\n");

  for (const choice of choices) {
    const defeated = beats[choice]
      .map((item) => `${emojis[item]} ${item}`)
      .join(", ");

    console.log(`${emojis[choice]} ${choice} beats: ${defeated}`);
  }

  console.log("\n==============================\n");
}

function showHealth() {
  console.log("\n❤️ HEALTH");
  console.log(`You:      ${Math.max(playerHealth, 0)} HP`);
  console.log(`Computer: ${Math.max(computerHealth, 0)} HP`);
}

function playRound() {
  console.log(`\n========== ROUND ${round} ==========`);

  rl.question(
    "\nChoose rock, paper, scissors, sword, gun, shield, or magic\n> ",
    (answer) => {
      const playerChoice = answer.toLowerCase().trim();

      if (playerChoice === "rules") {
        showRules();
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
        console.log("Type 'rules' to see your options.");
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
            `\n${emojis[playerChoice]} ${playerChoice.toUpperCase()} destroys ${emojis[computerChoice]} ${computerChoice.toUpperCase()}!`
          );

          if (attack.criticalHit) {
            console.log("🔥 CRITICAL HIT!");
          }

          console.log(`You dealt ${attack.damage} damage.`);
        } else {
          playerHealth -= attack.damage;

          console.log(
            `\n${emojis[computerChoice]} ${computerChoice.toUpperCase()} destroys ${emojis[playerChoice]} ${playerChoice.toUpperCase()}!`
          );

          if (attack.criticalHit) {
            console.log("💀 COMPUTER CRITICAL HIT!");
          }

          console.log(`Computer dealt ${attack.damage} damage.`);
        }
      }

      showHealth();

      if (playerHealth <= 0) {
        console.log("\n☠️ =======================");
        console.log("   YOU HAVE BEEN DEFEATED");
        console.log("===========================\n");

        rl.close();
        return;
      }

      if (computerHealth <= 0) {
        console.log("\n🏆 =======================");
        console.log("      YOU WON THE WAR");
        console.log("===========================\n");

        rl.close();
        return;
      }

      round++;

      playRound();
    }
  );
}

console.log(`
╔══════════════════════════════════╗
║                                  ║
║        ⚔️ RPS: CHAOS MODE ⚔️      ║
║                                  ║
╚══════════════════════════════════╝

The classic game has evolved.

🪨 Rock
📄 Paper
✂️ Scissors
⚔️ Sword
🔫 Gun
🛡️ Shield
🔮 Magic

Both fighters start with 100 HP.

Type "rules" to see what beats what.
Type "quit" to leave the game.
`);

playRound();