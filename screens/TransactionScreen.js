import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Image,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";

const bgImage = require("../assets/background2.png");
const appIcon = require("../assets/appIcon.png");
const appName = require("../assets/appName.png");

const TransactionScreen = (props) => {
  // Los permisos de la camara
  const [hasPermission, setHasPermission] = useState(null);
  // para saber si es modo escanear o escaneando
  const [domState, setDomState] = useState("normal");
  // para saber si el escaneo esta completo
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState("");

  const [studentId, setStudentId] = useState("");
  const [bookId, setBookId] = useState(""); // the id of the scanned book

  const saveBarcodeData = async ({ type, data }) => {
    console.log(data); // show the barcode in the terminal
    setScannedData(data); // maybe not used anymore

    if (domState === "SCAN_BOOK") {
      // please scan a book
      // setBookId({ bookId: data, domState: "normal", scanned: true });
      setBookId(data);
      setDomState("normal");
      setScanned(true);
    } else if (domState === "SCAN_STUDENT") {
      // setStudentId({
      //   studentId: data,
      //   domState: "normal",
      //   scanned: true,
      // });
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

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (domState != "normal") {
    return (
      <BarCodeScanner
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanned ? undefined : saveBarcodeData}
      />
    );
  }
  return (
    // return domState !== "scanner" ? (
    <View style={styles.container}>
      {/* Agregamos imagen de fondo */}
      <ImageBackground source={bgImage} style={styles.bgImage}>
        <View style={styles.upperContainer}>
          {/* En este contenedr colocamos el icono/nombre de la app */}
          <Image source={appIcon} style={styles.appIcon} />
          <Image source={appName} style={styles.appName} />
        </View>
        <View style={styles.lowerContainer}>
          <View style={styles.textinputContainer}>
            <TextInput
              style={styles.textinput}
              placeholder={"Id del libro"}
              placeholderTextColor={"#FFFFFF"}
              value={bookId}
              // onChange={(e) => setBookId(e.target.value)}
            />
            <TouchableOpacity
              style={styles.scanbutton}
              onPress={() => setDomState("SCAN_BOOK")}
            >
              <Text style={styles.scanbuttonText}>Escanear</Text>
            </TouchableOpacity>
          </View>
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
      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => setDomState("scanner")}
      >
        <Text style={styles.text}>Escanear QR</Text>
      </TouchableOpacity> */}
    </View>
    // ) : (
    //   <BarCodeScanner
    //     style={StyleSheet.absoluteFillObject}
    //     onBarCodeScanned={scanned ? undefined : saveBarcodeData}
    //   />
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  bgImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  upperContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  appIcon: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginTop: 80,
  },
  appName: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  lowerContainer: {
    flex: 0.5,
    alignItems: "center",
  },
  textinputContainer: {
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "#9DFD24",
    borderColor: "#FFFFFF",
  },
  textinput: {
    width: "57%",
    height: 50,
    padding: 10,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 3,
    fontSize: 18,
    backgroundColor: "#5653D4",
    fontFamily: "Rajdhani_600SemiBold",
    color: "#FFFFFF",
  },
  scanbutton: {
    width: 100,
    height: 50,
    backgroundColor: "#9DFD24",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  scanbuttonText: {
    fontSize: 24,
    color: "#0A0101",
    fontFamily: "Rajdhani_600SemiBold",
  },
});

export default TransactionScreen;
