import {
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../constants/styles";
import Sizes_ from "../util/Sizes";
import { AntDesign, Entypo, SimpleLineIcons } from "@expo/vector-icons";
import { Input } from "react-native-elements";
import { Slider } from "react-native-range-slider-expo";
import RadioButtonRN from "radio-buttons-react-native-expo";
import Checkbox from "expo-checkbox";
import { Picker } from "@react-native-picker/picker";

const Encuestas = () => {
  const [value, setValue] = useState(0);
  const [rapidez, setRapidez] = useState(false);
  const [presentacion, SetPresentacion] = useState(false);
  const [comida, setComida] = useState(false);
  const [atencion, setAtencion] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [comentary, setComentary] = useState("");

  const dataRadio = [
    {
      label: "Si! 🥳",
      accessibilityLabel: "Your label",
    },
    {
      label: "Quiza en otro momento 🤗",
      accessibilityLabel: "Your label",
    },
  ];
  const rangeCalification = () => {
    return (
      <Slider
        min={1}
        max={5}
        step={1}
        valueOnChange={(value) => {
          console.log("vau", value);
          setValue(value);
        }}
        initialValue={1}
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
        selectedBtn={(e) => console.log(e)}
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
        selectedValue={selectedLanguage}
        onValueChange={(itemValue, itemIndex) => setSelectedLanguage(itemValue)}
      >
        <Picker.Item
          label="Propaganda urbana"
          value="pu"
          style={{ fontSize: Sizes_.small }}
        />
        <Picker.Item label="Redes Sociales" value="rs" />
        <Picker.Item label="Google" value="go" />
      </Picker>
    );
  };
  return (
    <View style={{ backgroundColor: "white", flex: 1, paddingHorizontal: 20 }}>
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
            source={require("../../assets/encuestas/encuestaCliente.png")}
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
        <ScrollView
          style={{ flex: 0.6, width: "100%", height: "100%", borderWidth: 0 }}
        >
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
                {" "}
                ¿Nos recomendarias a un amigo?{" "}
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
                ¿Que fue lo que mas te gusto?{" "}
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
            <View
              style={{
                width: "100%",
                height: Dimensions.get("window").height * 0.1,
                borderWidth: 0,
              }}
            >
              <Text style={styles.labelTxt}>¿Como nos encontraste?</Text>
              {selectPicker()}
            </View>
            <View
              style={{
                width: "100%",
                height: Dimensions.get("window").height * 0.1,
                borderWidth: 0,
              }}
            >
              <Text style={styles.labelTxt}>
                ¿Deseas dejarnos un comentario?{" "}
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
          }}
        >
          <Text>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  labelTxt: {
    color: Colors.primary500,
    fontWeight: "bold",
    fontSize: Sizes_.small,
  },
});
export default Encuestas;
