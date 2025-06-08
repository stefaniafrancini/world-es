import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import Board from "../../components/Board";
import Keyboard from "../../components/Keyboard";
import { getColors } from "../../utils/getColors";
import { getRandomWord, isValidWord } from "../data/words";

export default function GameScreen() {
  const [solution, setSolution] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [colors, setColors] = useState<string[][]>([]);
  const [current, setCurrent] = useState("");

  const resetGame = () => {
    setSolution(getRandomWord());
    setGuesses([]);
    setColors([]);
    setCurrent("");
  };

  useEffect(() => {
    resetGame();
  }, []);

  const onKeyPress = (key: string) => {
    if (key === "↲") {
      if (current.length !== 5) return;
      if (!isValidWord(current)) {
        Alert.alert("Palabra inválida");
        return;
      }

      const colorRow = getColors(current, solution);
      const newGuesses = [...guesses, current];
      const newColors = [...colors, colorRow];

      setGuesses(newGuesses);
      setColors(newColors);
      setCurrent("");

      if (current === solution) {
        Alert.alert("¡Ganaste!", `La palabra era: ${solution}`,
          [
            { text: "Jugar otra vez", onPress: () => resetGame() }
          ],
          { cancelable: false }
        );
      } else if (newGuesses.length === 6) {
        Alert.alert(
          "¡Perdiste!",
          `La palabra era: ${solution}`,
          [
            { text: "Intentar de nuevo", onPress: () => resetGame() }
          ],
          { cancelable: false }
        );
      }
      return;
    }

    if (key === "⌫") {
      setCurrent(current.slice(0, -1));
    } else if (current.length < 5) {
      setCurrent(current + key.toLowerCase());
    }
  };

  return (
    <View style={styles.container}>
      <Board
        guesses={[...guesses, ...(guesses.length < 6 ? [current] : [])]}
        colors={[...colors, ...(guesses.length < 6 ? [Array(5).fill("gray")] : [])]}
      />
      <Keyboard onKeyPress={onKeyPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, backgroundColor: "#f5f5f5", alignItems: "center", justifyContent: "space-between", paddingBottom: 60 },
});
