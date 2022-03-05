import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TransactionScreen = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla de Transaccion</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue",
  },
  text: {
    color: "white",
    fontSize: 30,
  },
});

export default TransactionScreen;
