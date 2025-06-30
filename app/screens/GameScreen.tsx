import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Board from "../../components/Board";
import Keyboard from "../../components/Keyboard";
import { getColors } from "../../utils/getColors";
import { getRandomWord, isValidWord } from "../data/words";

const logo = require("../../assets/images/logo.png");

export default function GameScreen() {
  const [solution, setSolution] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [colors, setColors] = useState<string[][]>([]);
  const [current, setCurrent] = useState("");
  const [keyColors, setKeyColors] = useState<{ [key: string]: string }>({});
  const [showSplash, setShowSplash] = useState(true);
  const [showEndMessage, setShowEndMessage] = useState(false);
  const [endMessage, setEndMessage] = useState("");
  const [streak, setStreak] = useState(0);
  const [hints, setHints] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const endAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    resetGame();

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1500,
      delay: 1000,
      useNativeDriver: true,
    }).start(() => setShowSplash(false));
  }, []);

  const resetGame = () => {
    setSolution(getRandomWord());
    setGuesses([]);
    setColors([]);
    setCurrent("");
    setKeyColors({});
    setShowEndMessage(false);
    endAnim.setValue(0);
  };

  const showEndGame = (message: string) => {
    setEndMessage(message);
    setShowEndMessage(true);
    Animated.spring(endAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleRestart = () => {
    Animated.timing(endAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowEndMessage(false);
      resetGame();
    });
  };

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

      const updatedKeyColors = { ...keyColors };
      const colorPriority: Record<string, number> = {
        green: 3,
        yellow: 2,
        gray: 1,
        undefined: 0,
      };

      const allLetters = current.split("");
      const letterMaxColor: { [letter: string]: string } = {};

      allLetters.forEach((letter, i) => {
        const color = colorRow[i];
        const prevColor = letterMaxColor[letter];
        const newPriority = colorPriority[color];
        const prevPriority = colorPriority[prevColor];

        if (!prevColor || newPriority > prevPriority) {
          letterMaxColor[letter] = color;
        }
      });

      Object.entries(letterMaxColor).forEach(([letter, color]) => {
        const prevColor = updatedKeyColors[letter];
        const newPriority = colorPriority[color];
        const prevPriority = colorPriority[prevColor];

        if (!prevColor || newPriority > prevPriority) {
          updatedKeyColors[letter] = color;
        }
      });

      setKeyColors(updatedKeyColors);
      setGuesses(newGuesses);
      setColors(newColors);
      setCurrent("");

      if (current === solution) {
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        if (nextStreak % 1 === 0) {
          setHints(prev => prev + 1);
        }
        showEndGame("🎉 ¡Ganaste!");
        return;
      } else if (newGuesses.length === 6) {
        setStreak(0);
        setHints(0);
        showEndGame(`😢 ¡Perdiste!\nLa palabra era: ${solution}`);
        return;
      }
    }

    if (key === "⌫") {
      setCurrent(current.slice(0, -1));
    } else if (current.length < 5) {
      setCurrent(current + key.toLowerCase());
    }
  };

  const useHint = () => {
  if (hints === 0) return;

  // Posiciones donde aún no acertaste la letra correcta
  const unrevealedPositions: number[] = [];
  for (let i = 0; i < 5; i++) {
    if (current[i] === solution[i]) {
      // ya está acertada, no la mostramos de nuevo
      continue;
    }
    unrevealedPositions.push(i);
  }

  if (unrevealedPositions.length === 0) {
    Alert.alert("No quedan letras por revelar");
    return;
  }

  // Elegir posición al azar entre las que faltan
  const position = unrevealedPositions[Math.floor(Math.random() * unrevealedPositions.length)];
  const letter = solution[position];

  // Rellenar current si es más corto de 5
  const newCurrentArray = current.padEnd(5).split("");
  newCurrentArray[position] = letter;

  setCurrent(newCurrentArray.join("").trimEnd());
  setHints(prev => prev - 1);
};



  return (
    <View style={styles.container}>
      {showSplash ? (
        <Animated.View style={[styles.splash, { opacity: fadeAnim }]}>
          <Text style={styles.splashText}>Wordle</Text>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </Animated.View>
      ) : (
        <>
          <Text style={styles.streakText}>🔥 Racha: {streak}</Text>
          <Board
            guesses={[...guesses, ...(guesses.length < 6 ? [current] : [])]}
            colors={[...colors, ...(guesses.length < 6 ? [Array(5).fill("gray")] : [])]}
          />
          <View style={{ alignItems: "center", marginVertical: 10 }}>
            <TouchableOpacity
              disabled={hints === 0}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: hints > 0 ? "#6aaa64" : "#ccc",
                padding: 8,
                borderRadius: 20,
              }}
              onPress={useHint}
            >
              <Text style={{ color: "white", fontWeight: "bold", marginRight: 8 }}>🔍 Pista</Text>
              <Text style={{ color: "white", fontWeight: "bold" }}>{hints}</Text>
            </TouchableOpacity>
          </View>
          <Keyboard onKeyPress={onKeyPress} keyColors={keyColors} />
        </>
      )}

      {showEndMessage && (
        <Animated.View
          style={[
            styles.endOverlay,
            {
              opacity: endAnim,
              transform: [{ scale: endAnim }],
            },
          ]}
        >
          <Text style={styles.endText}>{endMessage}</Text>
          <TouchableOpacity style={styles.button} onPress={handleRestart}>
            <Text style={styles.buttonText}>Jugar otra vez</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 60,
  },
  splash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  splashText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333",
  },
  logo: {
    width: 120,
    height: 120,
    marginTop: 20,
  },
  endOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  endText: {
    fontSize: 32,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#6aaa64",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  streakText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
});
