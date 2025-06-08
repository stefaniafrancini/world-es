export function getColors(guess: string, correctWord: string): string[] {
  const normalizedGuess = guess.toLowerCase();
  const normalizedCorrect = correctWord.toLowerCase();

  const result = Array(5).fill("gray");
  const used = Array(5).fill(false);

  for (let i = 0; i < 5; i++) {
    if (normalizedGuess[i] === normalizedCorrect[i]) {
      result[i] = "green";
      used[i] = true;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (result[i] !== "green") {
      for (let j = 0; j < 5; j++) {
        if (!used[j] && normalizedGuess[i] === normalizedCorrect[j]) {
          result[i] = "yellow";
          used[j] = true;
          break;
        }
      }
    }
  }

  return result;
}
