import {
  Text,
  View,
  StatusBar,
  Dimensions,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../constants/styles";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
} from "react-native-chart-kit";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Sizes_ from "../../util/Sizes";
import StrongPoints from "../../util/enum/strongPoints";
import LoadingOverlay from "../../components/ui/LoadingOverlay";

const chartConfig = {
  backgroundGradientFrom: "white", //"#1E2923",
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: "white",
  backgroundGradientToOpacity: 1,
  color: (opacity = 1) => `rgba(119, 73, 54, ${opacity})`,
  strokeWidth: 1, // optional, default 3
  barPercentage: 1,
  useShadowColorFromDataset: false, // optional
};
const screenWidth = Dimensions.get("window").width;

const getDateDays = (arrayEncuestas = [], setDataLineChart) => {
  let monday = 0; //0
  let tuesday = 0;
  let wednesday = 0;
  let thursday = 0;
  let friday = 0;
  let saturday = 0;
  let sunday = 0; // 6

  arrayEncuestas.forEach((encuesta) => {
    switch (encuesta.dayVisit) {
      case "0":
        monday++;
        break;
      case "1":
        tuesday++;
        break;
      case "2":
        wednesday++;
        break;
      case "3":
        thursday++;
        break;
      case "4":
        friday++;
        break;
      case "5":
        saturday++;
        break;
      case "6":
        sunday++;
        break;
      default:
        break;
    }
  });
  var labels = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
  var datasets = [
    {
      data: [monday, tuesday, wednesday, thursday, friday, saturday, sunday],
      color: (opacity = 1) => `rgba(119, 73, 54, ${opacity})`, // optional
      strokeWidth: 2, // optional
    },
  ];
  setDataLineChart({
    labels: labels,
    datasets: datasets,
  });
};
const getDatePie = (arrayEncuestas = [], setDataPieChart) => {
  let contadorRapidez = 0;
  let contadorPresentacion = 0;
  let contadorComida = 0;
  let contadorAtencion = 0;
  //primero accedo a una encuesta
  arrayEncuestas.forEach((encuesta) => {
    encuesta.strongPoint.forEach((strongPoint) => {
      switch (strongPoint) {
        case StrongPoints.rapidez:
          contadorRapidez++;
          break;
        case StrongPoints.presentacion:
          contadorPresentacion++;
          break;
        case StrongPoints.comida:
          contadorComida++;
          break;
        case StrongPoints.atencion:
          contadorAtencion++;
          break;
        default:
          break;
      }
    });
  });

  const dataPie = [
    {
      name: "Rapidez",
      population: contadorRapidez,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: Colors.primary500,
      legendFontSize: 15,
    },
    {
      name: "Presentación",
      population: contadorPresentacion,
      color: "#F00",
      legendFontColor: Colors.primary500,
      legendFontSize: 15,
    },
    {
      name: "Comida",
      population: contadorComida,
      color: "aqua",
      legendFontColor: Colors.primary500,
      legendFontSize: 15,
    },
    {
      name: "Atención",
      population: contadorAtencion,
      color: "rgb(0, 0, 255)",
      legendFontColor: Colors.primary500,
      legendFontSize: 15,
    },
  ];
  setDataPieChart(dataPie);
};
const getBarChart = (arrayEncuestas = [], setDataBarChart) => {
  let contadorSi = 0;
  let contadorNo = 0;
  arrayEncuestas.forEach((encuesta) => {
    if (encuesta.recommendation === "si") {
      contadorSi++;
    } else if (encuesta.recommendation === "no") {
      contadorNo++;
    }
  });

  let dataBarChart = {
    labels: ["Claro que si!", "En otro momento"],
    datasets: [
      {
        data: [contadorSi, contadorNo],
      },
    ],
  };
  setDataBarChart(dataBarChart);
};
const getProgressChart = (arrayEncuestas = [], setDataProgressChart) => {
  let contador1 = 0;
  let contador2 = 0;
  let contador3 = 0;

  arrayEncuestas.forEach((encuesta) => {
    switch (encuesta.rangeService) {
      case 1:
        contador1++;
        break;
      case 2:
        contador2++;
        break;
      case 3:
        contador3++;
        break;

      default:
        break;
    }
  });

  contador1 = contador1 / arrayEncuestas.length;
  contador2 = contador2 / arrayEncuestas.length;
  contador3 = contador3 / arrayEncuestas.length;

  const data = {
    labels: ["⭐️", "⭐️⭐️", "⭐️⭐️⭐️"],
    data: [contador1, contador2, contador3],
  };
  setDataProgressChart(data);
};

const EstadisticaEncuestasScreen = () => {
  const [loading, setLoading] = useState(false);
  const [estadisticas, setEstadisticas] = useState([]);
  const [dataLineChart, setDataLineChart] = useState({
    labels: [
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado",
      "Domingo",
    ],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(119, 73, 54, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ["Días Visitados"], // optional
  });
  const [dataPieChart, setDataPieChart] = useState([
    {
      name: "...",
      population: 1,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ]);
  const [dataBarChart, setDataBarChart] = useState({
    labels: ["Claro que si!", "En otro momento"],
    datasets: [
      {
        data: [0, 0],
      },
    ],
  });
  const [dataProgressChart, setDataProgressChart] = useState({
    labels: ["Insuficiente", "Regular", "Bueno", "Muy Bueno", "Excelente"], // optional
    data: [0.4, 0.6, 0.8],
  });

  useEffect(() => {
    setLoading(true);
    const db = getFirestore();
    const q = query(collection(db, "encuestas"));
    return onSnapshot(q, (qs) => {
      const estadisticasTraidas = [];
      qs.forEach((documento) => {
        const objeto = {
          ...documento.data(),
        };
        estadisticasTraidas.push(objeto);
      });
      setEstadisticas(estadisticasTraidas);
      getDateDays(estadisticasTraidas, setDataLineChart);
      getDatePie(estadisticasTraidas, setDataPieChart);
      getBarChart(estadisticasTraidas, setDataBarChart);
      getProgressChart(estadisticasTraidas, setDataProgressChart);
      setLoading(false);
    });
  }, []);
  if (loading) {
    return <LoadingOverlay message={"Cargando información"}></LoadingOverlay>;
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.primary100,
        justifyContent: "space-around",

        //alignItems: "center",
      }}
    >
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <View
        style={{
          width: "100%",
          height: Dimensions.get("window").height * 0.05,
          borderWidth: 0,
        }}
      ></View>
      <Text
        style={{
          paddingHorizontal: 10,
          marginVertical: 5,
          fontSize: Sizes_.normal,
          textAlign: "left",
          color: Colors.primary500,
          fontWeight: "bold",
        }}
      >
        Estadisticas
      </Text>
      <ScrollView>
        <View style={{ flex: 1, justifyContent: "space-around" }}>
          <View
            style={{
              width: "100%",
              height: Dimensions.get("window").height * 0.3,
              borderRadius: 10,
              justifyContent: "center",
            }}
          >
            <Text style={styles.txtTittle}>Días mas visitados</Text>
            <LineChart
              data={dataLineChart}
              width={screenWidth}
              height={Dimensions.get("window").height * 0.25}
              chartConfig={chartConfig}
            />
          </View>
          <View
            style={{
              width: "100%",
              height: Dimensions.get("window").height * 0.3,

              justifyContent: "center",
            }}
          >
            <Text style={styles.txtTittle}>
              ¿Por que nos eligen nuestros clientes?{" "}
            </Text>
            <PieChart
              data={dataPieChart}
              width={screenWidth}
              height={Dimensions.get("window").height * 0.24}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"-10"}
              center={[0, 0]}
            />
          </View>
          <View
            style={{
              width: "100%",
              height: Dimensions.get("window").height * 0.3,
            }}
          >
            <Text style={styles.txtTittle}>
              ¿Nos recomendaron despues de su última visita?
            </Text>
            <BarChart
              style={{ borderWidth: 0 }}
              data={dataBarChart}
              width={screenWidth}
              height={Dimensions.get("window").height * 0.26}
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              fromZero
            />
          </View>
          <View
            style={{
              width: "100%",
              height: Dimensions.get("window").height * 0.3,
              paddingHorizontal: 0,
            }}
          >
            <Text style={styles.txtTittle}>
              Experiencia de nuestros clientes
            </Text>
            <ProgressChart
              data={dataProgressChart}
              width={screenWidth}
              height={220}
              strokeWidth={10}
              radius={20}
              chartConfig={chartConfig}
            />
          </View>
          <View
            style={{
              width: "100%",
              height: Dimensions.get("window").height * 0.1,
            }}
          ></View>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  txtTittle: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: Sizes_.small,
    marginVertical: 0,
  },
});
export default EstadisticaEncuestasScreen;
