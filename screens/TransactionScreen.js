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

  const saveBarcodeData = async ({ type, data }) => {
    console.log(data); // show the barcode in the terminal
    setScannedData(data);
    setDomState("normal");
    setScanned(true);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return domState !== "scanner" ? (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setDomState("scanner")}
      >
        <Text style={styles.text}>Escanear QR</Text>
      </TouchableOpacity>
      )
    </View>
  ) : (
    <BarCodeScanner
      style={StyleSheet.absoluteFillObject}
      onBarCodeScanned={scanned ? undefined : saveBarcodeData}
    />
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
