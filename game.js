const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const choices = ["rock", "paper", "scissors"];

function getComputerChoice() {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function getWinner(player, computer) {
  if (player === computer) {
    return "draw";
  }

  if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  ) {
    return "player";
  }

  return "computer";
}

rl.question("Choose rock, paper, or scissors: ", (answer) => {
  const playerChoice = answer.toLowerCase().trim();

  if (!choices.includes(playerChoice)) {
    console.log("Invalid choice. Please choose rock, paper, or scissors.");
    rl.close();
    return;
  }

  const computerChoice = getComputerChoice();
  const winner = getWinner(playerChoice, computerChoice);

  console.log(`You chose: ${playerChoice}`);
  console.log(`Computer chose: ${computerChoice}`);

  if (winner === "draw") {
    console.log("It's a draw!");
  } else if (winner === "player") {
    console.log("You win!");
  } else {
    console.log("Computer wins!");
  }

  rl.close();
});