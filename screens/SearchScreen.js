import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SearchScreen = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla de Busqueda</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "pink",
  },
  text: {
    color: "white",
    fontSize: 30,
  },
});

export default SearchScreen;
