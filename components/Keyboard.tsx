import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onKeyPress: (key: string) => void;
};

const KEYS = [
  "QWERTYUIOP",
  "ASDFGHJKL",
  "⌫ZXCVBNM↲",
];

export default function Keyboard({ onKeyPress }: Props) {
  return (
    <View style={styles.container}>
      {KEYS.map((row, i) => (
        <View key={i} style={styles.row}>
          {[...row].map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => onKeyPress(key)}
              style={styles.key}
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
    backgroundColor: "#d3d6da",
    borderRadius: 4,
    margin: 2,
    padding: 12,
    minWidth: 32,
    alignItems: "center",
  },
  keyText: { fontWeight: "bold", fontSize: 16 },
});
