import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onKeyPress: (key: string) => void;
  keyColors: { [key: string]: string };
};

const KEYS = ["QWERTYUIOP", "ASDFGHJKL", "⌫ZXCVBNM↲"];

export default function Keyboard({ onKeyPress, keyColors }: Props) {
  const getKeyStyle = (key: string) => {
    const color = keyColors[key.toLowerCase()];
    switch (color) {
      case "green":
        return styles.greenKey;
      case "yellow":
        return styles.yellowKey;
      case "gray":
        return styles.grayKey;
      default:
        return styles.defaultKey;
    }
  };

  return (
    <View style={styles.container}>
      {KEYS.map((row, i) => (
        <View key={i} style={styles.row}>
          {[...row].map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => onKeyPress(key)}
              style={[styles.key, getKeyStyle(key)]}
            >
              <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  row: { flexDirection: "row", justifyContent: "center", marginVertical: 4 },
  key: {
    borderRadius: 4,
    margin: 2,
    padding: 12,
    minWidth: 32,
    alignItems: "center",
  },
  keyText: { fontWeight: "bold", fontSize: 16 },
  greenKey: { backgroundColor: "#6aaa64" },
  yellowKey: { backgroundColor: "#c9b458" },
  grayKey: { backgroundColor: "#787c7e" },
  defaultKey: { backgroundColor: "#d3d6da" },
});
