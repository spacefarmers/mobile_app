import React from "react";
import {
  Center,
  ScrollView,
  Box,
  Spinner,
  Text,
  Row,
  Column,
  Heading,
} from "native-base";
import { LineChart, StackedBarChart } from "react-native-chart-kit";
import { Dimensions, RefreshControl } from "react-native";

export default class FarmGraphs extends React.Component {
  constructor(props) {
    super(props);
    this.sizeChart = {
      labels: [],
      datasets: [
        {
          data: [],
          color: (opacity) => "rgba(109, 162, 191, 1)",
        },
      ],
    };
    this.pointsChart = {
      labels: [],
      data: [],
      barColors: ["#6da2bf"],
    };
    this.partialsChart = {
      labels: [],
      legend: [],
      data: [],
      barColors: [],
    };
    this.state = {
      pointsChartLoading: true,
      partialsChartLoading: true,
      sizeChartLoading: true,
    };
  }

  async componentDidMount() {
    this.getGraphs();
  }

  async getGraphs() {
    this.getPointsChart();
    this.getPartialsChart();
    this.getSizeChart();
  }

  async getSizeChart() {
    this.setState({ sizeChartLoading: true });
    const response = await fetch(
      global.API_URL + "/api/graphs/farmer/size_24h/" + this.props.farmId
    );
    const data = await response.json();
    this.sizeChart.datasets[0].data = data.slice(-72).map((x) => x["value"]);
    this.sizeChart.labels = data.slice(-72).map((x) => {
      const date = new Date(x["timestamp"] * 1000);
      const hour = date.getHours();
      if (hour == 0) {
        return date.getDate() + "/" + (parseInt(date.getMonth()) + 1);
      }
      return "";
    });
    this.setState({ sizeChartLoading: false });
  }

  async getPointsChart() {
    this.setState({ pointsChartLoading: true });
    const response = await fetch(
      global.API_URL + "/api/graphs/farmer/points/" + this.props.farmId
    );
    const data = await response.json();
    data.reverse();
    this.pointsChart.data = data.slice(-72).map((x) => [x["value"]]);
    this.pointsChart.labels = data.slice(-72).map((x) => {
      const date = new Date(x["timestamp"] * 1000);
      const hour = date.getHours();
      if (hour == 0) {
        return date.getDate() + "/" + (parseInt(date.getMonth()) + 1);
      }
      return "";
    });
    this.setState({ pointsChartLoading: false });
  }

  async getPartialsChart() {
    this.setState({ partialsChartLoading: true });
    const response = await fetch(
      global.API_URL + "/api/graphs/farmer/partials/" + this.props.farmId
    );
    const data = await response.json();
    this.partialsChart.legend = [];
    data.forEach((dataArray, dataIndex) => {
      let reversedData = dataArray.data.reverse().slice(-72);
      reversedData.forEach((chartData, index) => {
        if (dataIndex == 0) {
          this.partialsChart.data[index] = [chartData.value];
        } else {
          this.partialsChart.data[index][dataIndex] = chartData.value;
        }
      });
      this.partialsChart.barColors.push(
        this.partialColor(dataArray.status_code)
      );
      this.partialsChart.legend.push(dataArray.status_text);
    });
    this.partialsChart.labels = data[0].data.slice(-72).map((x) => {
      const date = new Date(x["timestamp"] * 1000);
      const hour = date.getHours();
      if (hour == 0) {
        return date.getDate() + "/" + (parseInt(date.getMonth()) + 1);
      }
      return "";
    });
    this.setState({ partialsChartLoading: false });
  }

  partialColor(code) {
    var colors = {};
    colors[0] = "#6da2bf";
    colors[2] = "#f5cc00";
    colors[100] = "#575366";
    return colors[code] || "#C20114";
  }

  render() {
    return (
      <ScrollView
        py="4"
        refreshControl={
          <RefreshControl
            refreshing={
              this.state.partialsChartLoading ||
              this.state.pointsChartLoading ||
              this.state.sizeChartLoading
            }
            onRefresh={this.getGraphs.bind(this)}
          />
        }
      >
        <Center>
          <Box maxW="1000" w="95%">
            <Heading pl="2" size="md">
              Graphs
            </Heading>
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
                {this.sizeChart.labels.length == 0 ? (
                  <Spinner flex={1} py="4" />
                ) : (
                  <LineChart
                    data={this.sizeChart}
                    width={
                      Math.min(800, Dimensions.get("window").width * 0.85) + 20
                    }
                    height={250}
                    withVerticalLines={false} // optional, defaults to 1
                    xLabelsOffset={-10}
                    fromZero={true}
                    withDots={false}
                    chartConfig={{
                      backgroundColor: "#fafafa",
                      backgroundGradientFrom: "#fafafa",
                      backgroundGradientTo: "#fafafa",
                      color: (opacity = 1) => `rgba(1, 82, 126, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      strokeWidth: 2, // optional, default 3
                      barPercentage: 0.1,
                      decimalPlaces: 0,
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
                24H size
              </Text>
            </Box>

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
                {this.pointsChart.labels.length == 0 ? (
                  <Spinner flex={1} py="4" />
                ) : (
                  <StackedBarChart
                    data={this.pointsChart}
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
                Points
              </Text>
            </Box>

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
                {this.partialsChart.labels.length == 0 ? (
                  <Spinner flex={1} py="4" />
                ) : (
                  <StackedBarChart
                    data={this.partialsChart}
                    width={
                      Math.min(800, Dimensions.get("window").width * 0.85) + 20
                    }
                    height={250}
                    yAxisInterval={10} // optional, defaults to 1
                    fromZero={true}
                    xLabelsOffset={-10}
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
                    decimalPlaces={0}
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
                Partials
              </Text>

              <Center>
                <Column pb="3" space="3">
                  {this.partialsChart.legend.map((label, index) => {
                    return (
                      <Row space="3" key={label}>
                        <Center
                          h="5"
                          w="5"
                          bg={this.partialsChart.barColors[index]}
                          rounded="md"
                          shadow={3}
                        />
                        <Text>{label}</Text>
                      </Row>
                    );
                  })}
                </Column>
              </Center>
            </Box>
          </Box>
        </Center>
        <Box h="50" />
      </ScrollView>
    );
  }
}
