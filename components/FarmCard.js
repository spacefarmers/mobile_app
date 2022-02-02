import React from "react";
import { Box, Text, Center, Heading, Flex, Icon, HStack } from "native-base";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FarmOptionsModal from "../components/FarmOptionsModal";

export default class FarmCard extends React.Component {
  constructor(props) {
    super(props);
    this.graphPointsData = {
      labels: [],
      datasets: [
        {
          data: [],
        },
      ],
    };
    this.state = {
      loading: true,
      graphLoading: true,
      showRemoveModal: false,
      currentGraph: "points",
    };
  }

  async componentDidMount() {
    await this.getFarm();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.lastRefresh != this.props.lastRefresh) {
      await this.getFarm();
    }
  }

  async getFarmGraph() {
    const response = await fetch(
      "https://spacefarmers.io/api/graphs/farmer/points/" + this.props.farmId
    );
    const data = await response.json();
    data.reverse();
    this.graphPointsData.datasets[0].data = data
      .slice(-72)
      .map((x) => x["value"] * 50);
    this.graphPointsData.labels = data.slice(-72).map((x) => {
      const date = new Date(x["timestamp"] * 1000);
      const hour = date.getHours();
      if (hour == 0) {
        return date.getDate() + "/" + date.getMonth() + 1;
      }
      return "";
    });
    this.setState({ graphLoading: false });
  }

  async getFarm() {
    this.setState({ loading: true, graphLoading: true });
    const response = await fetch(
      "https://spacefarmers.io/api/farmers/" + this.props.farmId
    );
    const json = await response.json();
    this.farm = json.data;
    this.props.addSize((sizes) => ({
      ...sizes,
      [this.props.index]: this.farm.attributes.tib_24h,
    }));
    this.props.addPoints((points) => ({
      ...points,
      [this.props.index]: this.farm.attributes.points_24h,
    }));
    this.setState({ loading: false });
    this.getFarmGraph();
  }

  showRemoveModal(show = false) {
    this.setState({ showRemoveModal: show });
  }

  removeFarm() {
    this.props.addSize((sizes) => ({ ...sizes, [this.props.index]: 0 }));
    this.props.addPoints((points) => ({ ...points, [this.props.index]: 0 }));
    this.props.removeFarm(this.props.index);
    this.showRemoveModal(false);
  }

  render() {
    return (
      <Box maxW="400" w="90%">
        <FarmOptionsModal
          showModal={this.state.showRemoveModal}
          setShowModal={this.showRemoveModal.bind(this)}
          removeFarm={this.removeFarm.bind(this)}
        />
        <TouchableOpacity
          delayPressIn="300"
          delayLongPress="300"
          onLongPress={() => this.showRemoveModal(true)}
        >
          <Box
            rounded="lg"
            overflow="hidden"
            borderColor="coolGray.200"
            borderWidth="1"
            mb="3"
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
            {this.state.loading ? (
              "LOADING"
            ) : (
              <Box>
                <Box>
                  <Center>
                    <HStack space={2} mt="1.5">
                      <Text fontWeight="700">Points</Text>
                    </HStack>
                  </Center>
                  <Center>
                    {this.state.graphLoading ? (
                      "LOADING"
                    ) : (
                      <BarChart
                        data={this.graphPointsData}
                        width={Math.min(
                          400,
                          Dimensions.get("window").width * 0.85
                        )}
                        height={250}
                        yAxisInterval={10} // optional, defaults to 1
                        fromZero={true}
                        xLabelsOffset={-10}
                        chartConfig={{
                          backgroundColor: "#fafafa",
                          backgroundGradientFrom: "#fafafa",
                          backgroundGradientTo: "#fafafa",
                          color: (opacity = 1) =>
                            `rgba(1, 82, 126, ${opacity})`,
                          labelColor: (opacity = 1) =>
                            `rgba(0, 0, 0, ${opacity})`,
                          strokeWidth: 2, // optional, default 3
                          barPercentage: 0.1,
                          decimalPlaces: 0,
                        }}
                        bezier
                        style={{
                          marginTop: 10,
                          marginBottom: -10,
                          marginLeft: -40,
                          borderRadius: 8,
                        }}
                      />
                    )}
                  </Center>
                  <Center
                    bg="info.700"
                    _dark={{
                      bg: "blue.600",
                    }}
                    _text={{
                      color: "warmGray.50",
                      fontWeight: "700",
                      fontSize: "xs",
                    }}
                    position="absolute"
                    top="0"
                    px="3"
                    py="1.5"
                  >
                    {this.farm.attributes.farmer_name}
                  </Center>
                </Box>
                <Flex
                  direction="row"
                  mb="2.5"
                  _text={{
                    color: "coolGray.800",
                  }}
                >
                  <Box width="50%" px="4">
                    <Text
                      fontSize="xs"
                      _light={{
                        color: "info.700",
                      }}
                      _dark={{
                        color: "blue.600",
                      }}
                      fontWeight="500"
                    >
                      Size
                    </Text>
                    <Heading size="md">
                      {this.farm.attributes.tib_24h} TiB
                    </Heading>
                  </Box>
                  <Box width="50%" px="4">
                    <Text
                      fontSize="xs"
                      _light={{
                        color: "info.700",
                      }}
                      _dark={{
                        color: "blue.600",
                      }}
                      fontWeight="500"
                      textAlign="right"
                    >
                      Points
                    </Text>
                    <Heading size="md" textAlign="right">
                      {this.farm.attributes.points_24h}
                    </Heading>
                  </Box>
                </Flex>
                <Flex
                  direction="row"
                  mb="2.5"
                  mt="1.5"
                  _text={{
                    color: "coolGray.800",
                  }}
                >
                  <Box width="50%" px="4">
                    <Text
                      fontSize="xs"
                      _light={{
                        color: "info.700",
                      }}
                      _dark={{
                        color: "blue.600",
                      }}
                      fontWeight="500"
                    >
                      Share
                    </Text>
                    <Heading size="md">
                      {this.farm.attributes.ratio_24h}%
                    </Heading>
                  </Box>
                  <Box width="50%" px="4">
                    <Text
                      fontSize="xs"
                      _light={{
                        color: "info.700",
                      }}
                      _dark={{
                        color: "blue.600",
                      }}
                      fontWeight="500"
                      textAlign="right"
                    >
                      Effort
                    </Text>
                    <Heading size="md" textAlign="right">
                      {this.farm.attributes.current_effort}%
                    </Heading>
                  </Box>
                </Flex>
              </Box>
            )}
          </Box>
        </TouchableOpacity>
      </Box>
    );
  }
}
