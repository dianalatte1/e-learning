import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
const TransactionScreen = (props) => {
  // Los permisos de la camara
  const [hasPermission, setHasPermission] = useState(null);
  // para saber si es modo escanear o escaneando
  const [domState, setDomState] = useState("normal");
  // para saber si el escaneo esta completo
  const [scanned, setScanned] = useState(false);
  // para guardar los datos escaneados
  const [scannedData, setScannedData] = useState("");

  //funcion que guarda los estados
  const saveBarcodeData = async ({ type, data }) => {
    console.log(data); // show the barcode in the terminal
    setScannedData(data);
    setDomState("normal");
    setScanned(true);
  };
  //se encarga de los permisos de la camara
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  // en caso de que los permisos sean negados
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  //comprobamos el modo de nuestro scanner
  return domState !== "scanner" ? (
    //si no tenemos modo scanner mostramos el boton para escanear
    //de lo contrario mostramos el escaner
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setDomState("scanner")}
      >
        <Text style={styles.text}>Escanear QR</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <BarCodeScanner
      // Hacemos que el componente ocupe toda la pantalla
      style={StyleSheet.absoluteFillObject}
      // si varible scanned=true
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
