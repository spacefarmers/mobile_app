import React, { useState, useEffect } from "react";
import {
  Box,
  Center,
  Heading,
  Spinner,
  Text,
} from "native-base";
import { StackedBarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

export default function PoolStatusScreen({ navigation }) {
  const [pointsChartLoading, setPointsChartLoading] = useState(false);
  const [pointsChart, setPointsChart] = useState({
    labels: [],
    data: [],
    barColors: ["#6da2bf"],
  });

  useEffect(() => {
    getPointsChart();
  }, []);

  async function getPointsChart() {
    setPointsChartLoading(true);
    const response = await fetch(global.API_URL + "/api/graphs/pool/points/");
    const data = await response.json();
    data.reverse();
    setPointsChart((chart) => {
      chart.data = data.slice(-72).map((x) => [x["value"]]);
      chart.labels = data.slice(-72).map((x) => {
        const date = new Date(x["timestamp"] * 1000);
        const minute = date.getMinutes();
        if (minute == 0) {
          return date.getHours() + ":00";
        }
        return "";
      });
      setPointsChartLoading(false);
      return chart;
    });
  }

  return (
    <Box flex={1}>
      <Center>
        <Heading py="3">Pool status</Heading>
      </Center>

      <Box
      my="3"
      rounded="lg"
      overflow="hidden"
      borderColor="coolGray.200"
      borderWidth="1"
      minHeight="300"
      _dark={{
        borderColor: "coolGray.600",
        backgroundColor: "gray.700",
      }}
      _web={{
        shadow: 2,
        borderWidth: 0,
      }}
      _light={{
        backgroundColor: "gray.50",
      }}
      >
        <Center mt="7" minHeight="250">
          {pointsChart.labels.length == 0 ? (
            <Spinner flex={1} py="4" />
          ) : (
            <StackedBarChart
              data={pointsChart}
              width={
                Math.min(800, Dimensions.get("window").width * 0.85) + 20
              }
              height={250}
              yAxisInterval={10} // optional, defaults to 1
              fromZero={true}
              xLabelsOffset={-10}
              decimalPlaces={0}
              hideLegend={true}
              chartConfig={{
                backgroundColor: "#fafafa",
                backgroundGradientFrom: "#fafafa",
                backgroundGradientTo: "#fafafa",
                color: (opacity = 1) => `rgba(1, 82, 126, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                strokeWidth: 2, // optional, default 3
                barPercentage: 0.1,
              }}
              style={{
                marginTop: 20,
                marginLeft: -20,
              }}
            />
          )}
        </Center>
        <Text
          bg="info.700"
          _dark={{
            bg: "blue.600",
          }}
          position="absolute"
          top="0"
          px="3"
          py="1.5"
          maxW="220"
          color="white"
          fontWeight="700"
          fontSize="xs"
          numberOfLines={1}
          ellipsizeMode={"middle"}
        >
          Pool points
        </Text>
      </Box>
    </Box>
  );
}
