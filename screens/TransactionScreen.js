import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera, getCameraPermissionsAsync } from "expo-camera";

const TransactionScreen = (props) => {
  // Los permisos de la camara
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  // para saber si es modo escanear o escaneando
  const [hasPermission, setHasPermission] = useState(null);
  const [domState, setDomState] = useState("normal");
  // para saber si el escaneo esta completo
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === "granted");
      // estas dos lineas estan bien?
      setDomState();
      setScanned();
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text> {hasCameraPermission === false ? scannedData : "Request"}</Text>
      <TouchableOpacity
        style={styles.button}
        // onPress={() => setHasPermission('scanner')} ?????????
      >
        <Text style={styles.text}>Escanear QR</Text>
      </TouchableOpacity>
      )
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#54c8ac",
  },
  text: {
    color: "white",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#f49e7e",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    width: "43%",
  },
});

export default TransactionScreen;
