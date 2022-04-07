import React from "react";
import { Box, Text, Center, Heading, Flex, HStack, Spinner } from "native-base";
import { StackedBarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { TouchableOpacity } from "react-native";
import FarmOptionsModal from "../components/FarmOptionsModal";

export default class FarmCard extends React.Component {
  constructor(props) {
    super(props);
    this.graphPointsData = {
      labels: [],
      data: [],
      barColors: ['#6da2bf']
    };
    this.state = {
      loading: true,
      graphLoading: true,
      showOptionsModal: false,
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
      global.API_URL + "/api/graphs/farmer/points/" + this.props.farmId
    );
    const data = await response.json();
    data.reverse();
    this.graphPointsData.data = data
      .slice(-72)
      .map((x) => [x["value"]]);
    this.graphPointsData.labels = data.slice(-72).map((x) => {
      const date = new Date(x["timestamp"] * 1000);
      const hour = date.getHours();
      if (hour == 0) {
        return date.getDate() + "/" + (parseInt(date.getMonth()) + 1);
      }
      return "";
    });
    this.setState({ graphLoading: false });
  }

  handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
  }

  async getFarm() {
    this.setState({ loading: true, graphLoading: true });
    fetch(global.API_URL + "/api/farmers/" + this.props.farmId)
      .then(this.handleErrors)
      .then(response => {
        response.json().then(json => {
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
        });
      })
      .catch(error => {
        alert('Error while loading farm data!')
        this.setState({ loading: false });
      });
  }

  showOptionsModal(show = false) {
    this.setState({ showOptionsModal: show });
  }

  removeFarm() {
    this.props.addSize((sizes) => ({ ...sizes, [this.props.index]: 0 }));
    this.props.addPoints((points) => ({ ...points, [this.props.index]: 0 }));
    this.props.removeFarm(this.props.index);
    this.showOptionsModal(false);
  }

  render() {
    return (
      <Box maxW="400" w="90%">
        <FarmOptionsModal
          farmId={this.props.farmId}
          showModal={this.state.showOptionsModal}
          setShowModal={this.showOptionsModal.bind(this)}
          removeFarm={this.removeFarm.bind(this)}
        />
        <TouchableOpacity
          delayPressIn="300"
          delayLongPress="300"
          onLongPress={() => this.showOptionsModal(true)}
          onPress={this.props.onClick}
        >
          <Box
            rounded="lg"
            overflow="hidden"
            borderColor="coolGray.200"
            borderWidth="1"
            minHeight="350"
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
            {this.state.loading || !this.farm ? (
              <Spinner flex={1} py="4" />
            ) : (
              <Box>
                <Box>
                  <Center mt="7" minHeight="250">
                    {this.state.graphLoading ? (
                      <Spinner flex={1} py="4" />
                    ) : (
                      <StackedBarChart
                        data={this.graphPointsData}
                        width={Math.min(
                          390,
                          Dimensions.get("window").width * 0.85
                        )}
                        height={250}
                        yAxisInterval={10} // optional, defaults to 1
                        fromZero={true}
                        hideLegend={true}
                        decimalPlaces={0}
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
                        }}
                        style={{
                          marginTop: 10,
                          marginBottom: -10,
                          borderRadius: 8,
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
                    color= "white"
                    fontWeight= "700"
                    fontSize= "xs"
                    numberOfLines={1}
                    ellipsizeMode={"middle"}
                  >
                    {this.farm.attributes.farmer_name}
                  </Text>

                  <Text
                    color="gray.500"
                    position="absolute"
                    top="0"
                    right="0"
                    pr="3"
                    py="1.5"
                    maxW="150"
                    fontWeight="700"
                    numberOfLines={1}
                    ellipsizeMode={"middle"}
                  >
                    Points
                  </Text>
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
