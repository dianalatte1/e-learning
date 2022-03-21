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
  const [scannedData, setScannedData] = useState("");
  // agregando los estudiantes y los libros
  const [studentId, setStudentId] = useState("");
  const [bookId, setBookId] = useState(""); // the id of the scanned book

  const saveBarcodeData = async ({ type, data }) => {
    console.log(data); // show the barcode in the terminal
    setScannedData(data);
    // agregando la validacion para escanear un libro o un estudiante
    if (domState === "SCAN_BOOK") {
      // please scan a book
      setBookId(data);
      setDomState("normal");
      setScanned(true);
    } else if (domState === "SCAN_STUDENT") {
      setStudentId(data);
      setDomState("normal");
      setScanned(true);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  // si el estado no es normal muestrame el escaner
  if (domState != "normal") {
    return (
      <BarCodeScanner
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanned ? undefined : saveBarcodeData}
      />
    );
  }
  return (
    <View style={styles.container}>
      {/* Agregamos imagen de fondo */}
      <ImageBackground source={bgImage} style={styles.bgImage}>
        <View style={styles.upperContainer}>
          {/* En este contenedr colocamos el icono/nombre de la app */}
          <Image source={appIcon} style={styles.appIcon} />
          <Image source={appName} style={styles.appName} />
        </View>
        <View style={styles.lowerContainer}>
          {/* este contenedor tendra un textInput y un button */}
          <View style={styles.textinputContainer}>
            <TextInput
              style={styles.textinput}
              placeholder={"Id del libro"}
              placeholderTextColor={"#FFFFFF"}
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
            />
            <TouchableOpacity
              style={styles.scanbutton}
              onPress={() => setDomState("SCAN_BOOK")}
            >
              <Text style={styles.scanbuttonText}>Escanear</Text>
            </TouchableOpacity>
          </View>
          {/* este contenedor tendra un textInput y un button */}
          <View style={[styles.textinputContainer, { marginTop: 25 }]}>
            <TextInput
              style={styles.textinput}
              placeholder={"Id del alumno"}
              placeholderTextColor={"#FFFFFF"}
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <TouchableOpacity
              style={styles.scanbutton}
              onPress={() => setDomState("SCAN_STUDENT")}
            >
              <Text style={styles.scanbuttonText}>Escanear</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
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
