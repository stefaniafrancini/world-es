// components/Board.tsx
import { GAME_COLORS } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  guesses: string[];
  colors: string[][];
};

export default function Board({ guesses, colors }: Props) {
  return (
    <View style={styles.board}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} style={styles.row}>
          {Array.from({ length: 5 }).map((_, j) => {
            const letter = guesses[i]?.[j] ?? " ";
            const colorCode = colors[i]?.[j] ?? "gray";
            return (
              <View
                key={j}
                style={[
                  styles.cell,
                  { backgroundColor: getColorFromCode(colorCode) },
                ]}
              >
                <Text style={styles.letter}>{letter.toUpperCase()}</Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function getColorFromCode(code: string) {
  return GAME_COLORS[code] || GAME_COLORS.gray;
}

const styles = StyleSheet.create({
  board: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  cell: {
    width: 50,
    height: 50,
    margin: 2,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  letter: {
    color: "white",
    fontWeight: "bold",
    fontSize: 24,
  },
});
