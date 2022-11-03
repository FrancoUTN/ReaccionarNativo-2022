import {
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../constants/styles";
import Sizes_ from "../../util/Sizes";
import { AntDesign, Entypo, SimpleLineIcons } from "@expo/vector-icons";
import { Input } from "react-native-elements";
import { Slider } from "react-native-range-slider-expo";
import RadioButtonRN from "radio-buttons-react-native-expo";
import Checkbox from "expo-checkbox";
import { Picker } from "@react-native-picker/picker";
import Button from "../../components/ui/Button";
import Camara from "../../components/altas/Camara";
import SurveyType from "../../util/enum/surveyType";
import StrongPoints from "../../util/enum/strongPoints";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  addDoc,
  collection,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import { vibrationError } from "../../util/VibrationError";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const EncuestaScreen = () => {
  const [tomarFoto, setTomarFoto] = useState(false);
  const [fotos, setFotos] = useState([]);
  const [valueRange, setValueRange] = useState(0);
  const [recommendation, setRecommendation] = useState(false);
  const [rapidez, setRapidez] = useState(false);
  const [presentacion, SetPresentacion] = useState(false);
  const [comida, setComida] = useState(false);
  const [atencion, setAtencion] = useState(false);
  const [howDoYouKnow, setHowDoYouKnow] = useState("street");
  const [comentary, setComentary] = useState("");
  const [loading, setLoading] = useState(false);

  const dataRadio = [
    {
      label: "Si! 🥳",
      accessibilityLabel: "Your label",
      value: "si",
    },
    {
      label: "Quiza en otro momento 🤗",
      accessibilityLabel: "Your label",
      value: "no",
    },
  ];
  const rangeCalification = () => {
    return (
      <Slider
        min={1}
        max={3}
        step={1}
        valueOnChange={(value) => {
          console.log("vau", value);
          setValueRange(value);
        }}
        initialValue={2}
        knobColor={Colors.primary500}
        valueLabelsBackgroundColor="black"
        inRangeBarColor="#CDCDCD"
        outOfRangeBarColor={Colors.primary100}
        styleSize="small"
        showValueLabels={true}
        containerStyle={{ marginTop: 25 }}
      />
    );
  };
  const radioCalification = () => {
    return (
      <RadioButtonRN
        data={dataRadio}
        selectedBtn={(e) => {
          setRecommendation(e.value);
        }}
        icon={
          <AntDesign name="checkcircle" size={25} color={Colors.primary500} />
        }
        animationTypes={["rotate"]}
        box={false}
      />
    );
  };
  const selectPicker = () => {
    return (
      <Picker
        mode="dropdown"
        selectedValue={howDoYouKnow}
        onValueChange={(itemValue, itemIndex) => {
          console.log("medio conocifo", itemValue);
          setHowDoYouKnow(itemValue);
        }}
      >
        <Picker.Item
          label="Propaganda urbana"
          value="street"
          style={{ fontSize: Sizes_.small }}
        />
        <Picker.Item label="Redes Sociales" value="socialMedia" />
        <Picker.Item label="Google" value="web" />
        <Picker.Item label="Otro" value="other" />
      </Picker>
    );
  };
  function fotoTomadaHandler(objetoFoto) {
    setTomarFoto(false);
    setFotos((fotosPrevias) => [...fotosPrevias, objetoFoto]);
  }
  const spanError = () => {
    return <Text style={styles.spanStyle}> * </Text>;
  };
  const verifyCheck = () => {
    if (rapidez || presentacion || comida || atencion) {
      return true;
    } else {
      return false;
    }
  };
  const verifyPhotos = () => {
    if (fotos.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  const verifyRecommendation = () => {
    if (recommendation) {
      return true;
    } else {
      return false;
    }
  };
  const verifyComentary = () => {
    if (comentary != "") {
      return true;
    } else {
      return false;
    }
  };
  const cleanValues = () => {
    setRapidez(false);
    SetPresentacion(false);
    setComida(false);
    setAtencion(false);
    setComentary("");
    setFotos([]);
    setRecommendation(false);
    setHowDoYouKnow("street");
  };
  const handleSubmit = async () => {
    if (
      verifyCheck() &&
      verifyPhotos() &&
      verifyComentary() &&
      verifyRecommendation()
    ) {
      console.log("entro if");
      let objValues = {
        rangeService: valueRange,
        recommendation: recommendation,
        strongPoint: [],
        howdoKnow: howDoYouKnow,
        photos: fotos,
        comentary: comentary,
        surveyType: SurveyType.cliente,
        dayVisit: new Date().getDate(),
      };
      rapidez && objValues.strongPoint.push(StrongPoints.rapidez);
      presentacion && objValues.strongPoint.push(StrongPoints.presentacion);
      comida && objValues.strongPoint.push(StrongPoints.comida);
      atencion && objValues.strongPoint.push(StrongPoints.atencion);

      const arrayDeFotos = [];

      for (const foto of fotos) {
        var storageRef = ref(
          getStorage(),
          `encuestas/${new Date().toISOString()}`
        );
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Petición de red fallida."));
          };
          xhr.responseType = "blob";
          xhr.open("GET", foto.uri, true);
          xhr.send(null);
        });
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        arrayDeFotos.push(url);
      }
      objValues.photos = arrayDeFotos;

      const colRef = collection(getFirestore(), "encuestas");
      const docRef = await addDoc(colRef, objValues);
      cleanValues();
      setLoading(false);
      //console.log("colRef", colRef, "docRef", docRef);
    } else {
      setLoading(false);
      vibrationError();
    }
  };
  if (tomarFoto) {
    return <Camara fotoTomada={fotoTomadaHandler} />;
  }
  if (loading) {
    return <LoadingOverlay message={'Cargando...'} />;
  }
  return (
    <KeyboardAwareScrollView
      nestedScrollEnabled={true}
      style={{ flex: 1, borderWidth: 0, backgroundColor: "white" }}
    >
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
          width: "100%",
          height: Dimensions.get("window").height,
          paddingHorizontal: 20,
        }}
      >
        <View style={{ flex: 0.1 }}></View>
        <View
          style={{
            flex: 0.8,
            width: "100%",
            height: "100%",
          }}
        >
          <View
            style={{
              flex: 0.4,
              width: "100%",
              height: "100%",
              borderWidth: 0,
              alignSelf: "center",
            }}
          >
            <Image
              source={require("../../../assets/encuestas/encuestaCliente.png")}
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            />
          </View>
          <Text
            style={{
              textAlign: "center",
              fontSize: Sizes_.normal,
              color: Colors.primary500,
              marginBottom: 10,
            }}
          >
            ¿Que tal estuvo el servicio?
          </Text>
          <ScrollView style={{ flex: 0.6, width: "100%", height: "100%" }}>
            <View style={{ flex: 1, width: "100%", height: "100%" }}>
              <View
                style={{
                  width: "100%",
                  height: Dimensions.get("window").height * 0.15,
                  marginBottom: 5,
                  borderWidth: 0,
                }}
              >
                {rangeCalification()}
              </View>
              <View
                style={{
                  width: "100%",
                  height: Dimensions.get("window").height * 0.15,
                  marginBottom: 0,
                }}
              >
                <Text style={styles.labelTxt}>
                  ¿Nos recomendarias a un amigo?
                  {!verifyRecommendation() && spanError()}
                </Text>
                {radioCalification()}
              </View>
              <View
                style={{
                  width: "100%",
                  height: Dimensions.get("window").height * 0.15,
                  borderWidth: 0,
                }}
              >
                <Text style={styles.labelTxt}>
                  ¿Que fue lo que mas te gusto?
                  {!verifyCheck() && spanError()}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    borderWidth: 0,
                    flex: 0.5,
                    justifyContent: "space-around",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 0.5,
                      justifyContent: "center",
                    }}
                  >
                    <Checkbox
                      style={{ marginHorizontal: 5 }}
                      value={rapidez}
                      onValueChange={setRapidez}
                      color={rapidez ? Colors.primary500 : undefined}
                    />
                    <Text>Rapidez</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 0.5,
                    }}
                  >
                    <Checkbox
                      style={{ marginHorizontal: 5 }}
                      value={presentacion}
                      onValueChange={SetPresentacion}
                      color={presentacion ? Colors.primary500 : undefined}
                    />
                    <Text>Presentación</Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    borderWidth: 0,
                    flex: 0.5,
                    justifyContent: "space-around",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 0.5,
                    }}
                  >
                    <Checkbox
                      style={{ marginHorizontal: 5 }}
                      value={comida}
                      onValueChange={setComida}
                      color={comida ? Colors.primary500 : undefined}
                    />
                    <Text>Comida</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 0.5,
                      justifyContent: "center",
                    }}
                  >
                    <Checkbox
                      style={{ marginHorizontal: 8 }}
                      value={atencion}
                      onValueChange={setAtencion}
                      color={atencion ? Colors.primary500 : undefined}
                    />
                    <Text>Atenciones</Text>
                  </View>
                </View>
              </View>
              {Platform.OS != "ios" && (
                <View
                  style={{
                    width: "100%",
                    height: Dimensions.get("window").height * 0.1,
                    borderWidth: 0,
                  }}
                >
                  <Text style={styles.labelTxt}>
                    ¿Como nos encontraste? {spanError()}
                  </Text>
                  {selectPicker()}
                </View>
              )}
              {/* IMAGENES */}
              <View
                style={{
                  width: "100%",
                  height:
                    fotos.length > 0
                      ? Dimensions.get("window").height * 0.2
                      : Dimensions.get("window").height * 0.1,
                  borderWidth: 0,
                  marginBottom: 10,
                }}
              >
                <Text style={styles.labelTxt}>
                  ¡ Añade algunas imagenes! {!verifyPhotos() && spanError()}
                </Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    borderWidth: 0,
                    paddingVertical: 5,
                  }}
                >
                  <View style={{ width: "30%", height: "100%" }}>
                    {fotos[0] && (
                      <Image
                        style={styles.image}
                        source={{ uri: fotos[0].uri }}
                      />
                    )}
                  </View>
                  <View style={{ width: "30%", height: "100%" }}>
                    {fotos[1] && (
                      <Image
                        style={styles.image}
                        source={{ uri: fotos[1].uri }}
                      />
                    )}
                  </View>
                  <View style={{ width: "30%", height: "100%" }}>
                    {fotos[2] && (
                      <Image
                        style={styles.image}
                        source={{ uri: fotos[2].uri }}
                      />
                    )}
                  </View>
                </View>
                <Button
                  onPress={() => {
                    if (fotos.length > 2) {
                      alert("ya has subido todas las fotos ");
                      return;
                    }
                    setTomarFoto(true);
                  }}
                >
                  {fotos.length > 2 ? "LISTO !" : "Tomar foto"}
                </Button>
              </View>

              <View
                style={{
                  width: "100%",
                  height: Dimensions.get("window").height * 0.12,
                  borderWidth: 0,
                }}
              >
                <Text style={styles.labelTxt}>
                  ¿Deseas dejarnos un comentario?
                  {!verifyComentary() && spanError()}
                </Text>
                <Input
                  placeholder="Tu opinion es muy importante"
                  inputStyle={{ fontSize: Sizes_.small }}
                  leftIcon={
                    <SimpleLineIcons
                      name="note"
                      size={Sizes_.normal}
                      color={Colors.error500}
                      style={{ marginRight: 10 }}
                    />
                  }
                  onChangeText={(value) => setComentary(value)}
                  value={comentary}
                />
              </View>
            </View>
          </ScrollView>
        </View>
        <View
          style={{ flex: 0.1, justifyContent: "center", alignItems: "center" }}
        >
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 1,
            }}
            onPress={() => {
              setLoading(true);
              handleSubmit();
            }}
          >
            <Text style={{ fontSize: Sizes_.normal, color: Colors.primary500 }}>
              Enviar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};
const styles = StyleSheet.create({
  labelTxt: {
    color: Colors.primary500,
    fontWeight: "bold",
    fontSize: Sizes_.small,
  },
  spanStyle: {
    color: "red",
    fontSize: Sizes_.normal,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  errorContainer: {},
  textError: {
    fontSize: Sizes_.small - 1,
  },
});
export default EncuestaScreen;
