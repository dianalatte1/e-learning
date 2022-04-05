import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  addDoc,
  updateDoc,
  Timestamp,
  increment,
} from "firebase/firestore/lite";
import db from "../config";

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

  const [studentId, setStudentId] = useState("QUbu7OSi3Ygdbb7D6qde");
  const [bookId, setBookId] = useState("WfXZEwyebawshesfUYnd");
  const [bookName, setBookName] = useState("");
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    console.log({ bookName, studentName });
  }, [bookName, studentName]);

  const saveBarcodeData = async ({ type, data }) => {
    console.log(data); // show the barcode in the terminal
    setScannedData(data); // maybe not used anymore

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
      const queryCollection = async (collectionName) => {
        const myCollection = collection(db, collectionName);
        const snapshot = await getDocs(myCollection);
        const list = snapshot.docs.map((doc) => doc.data());
        return list;
      };

      const booksList = await queryCollection("books");
      console.log(booksList);

      const studentsList = await queryCollection("students");
      console.log(studentsList);

      const transactionsList = await queryCollection("transactions");
      console.log(transactionsList);
    })();
  }, []);

  const handleTransaction = async () => {
    console.log("handleTransaction");
    await getStudentDetails(studentId);
    await getBookDetails(bookId);

    const bookRef = doc(db, "books", bookId);
    const bookSnapshot = await getDoc(bookRef);
    if (bookSnapshot.exists()) {
      console.log("Document data:", bookSnapshot.data());
      let book = bookSnapshot.data().book_details;
      console.log(book.is_book_available);
      if (book.is_book_available) {
        initiateBookIssue(bookId, studentId, bookName, studentName);
        Alert.alert("Libro emitido al alumno");
      } else {
        initiateBookReturn(bookId, studentId, bookName, studentName);
        Alert.alert("Libro devuelto a la biblioteca");
      }
    } else {
      console.log("No such document!");
    }
  };

  const getBookDetails = async (bookId) => {
    const cleanBookId = bookId.trim();
    const q = query(
      collection(db, "books"),
      where("book_details.book_id", "==", cleanBookId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.docs.map((doc) => {
      setBookName(doc.data().book_details.book_name);
    });
  };
  const getStudentDetails = async (studentId) => {
    const cleanStudentId = studentId.trim();
    const q = query(
      collection(db, "students"),
      where("student_details.student_id", "==", cleanStudentId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.docs.map((doc) => {
      setStudentName(doc.data().student_details.student_name);
    });
  };

  const initiateBookIssue = async (
    bookId,
    studentId,
    bookName,
    studentName
  ) => {
    console.log("Libro emitido al alumno");
    // codigo para agregar una transaccion
    await addDoc(collection(db, "transactions"), {
      student_id: studentId,
      student_name: studentName,
      book_id: bookId,
      book_name: bookName,
      date: Timestamp.now().toDate(),
      transaction_type: "emitido",
    });
    // codigo para cambiar el estado del libro
    const issueBook = doc(db, "books/" + bookId);
    await updateDoc(issueBook, { "book_details.is_book_available": false });
    // codigo para cambiar el numero de libros emitidos al alumno
    const updateStudent = doc(db, "students/" + studentId);
    await updateDoc(updateStudent, {
      number_of_books_issued: increment(1),
    });
    //actualizar el estado local
    setBookId("");
    setStudentId("");
  };

  const initiateBookReturn = async (
    bookId,
    studentId,
    bookName,
    studentName
  ) => {
    // console.log("Libro devuelto a la biblioteca");
    await addDoc(collection(db, "transactions"), {
      student_id: studentId,
      student_name: studentName,
      book_id: bookId,
      book_name: bookName,
      date: Timestamp.now().toDate(),
      transaction_type: "devuelto",
    });
    const returnBook = doc(db, "books/" + bookId);
    // nested update in firebase
    await updateDoc(returnBook, { "book_details.is_book_available": true });
    const updateReturnStudent = doc(db, "students/" + studentId);
    await updateDoc(updateReturnStudent, {
      number_of_books_issued: increment(-1),
    });
    setBookId("");
    setStudentId("");
  };

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
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
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
          {/* agregando un nuevo button */}
          <TouchableOpacity
            style={[styles.button, { marginTop: 25 }]}
            onPress={handleTransaction}
          >
            <Text style={styles.buttonText}>Entregar</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
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
  // Estilos para nuestro nuevo button Entregar
  button: {
    width: "43%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F48D20",
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "Rajdhani_600SemiBold",
  },
});

export default TransactionScreen;
