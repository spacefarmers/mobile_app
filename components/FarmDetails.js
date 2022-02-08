import React from "react";
import { Button, Center, ScrollView, Box, Heading, Text } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class FarmDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboardFarms: [],
    };
  }

  async componentDidMount() {
    let farmsStored = await AsyncStorage.getItem("@farmIds");
    this.setState({ dashboardFarms: JSON.parse(farmsStored) });
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.dashboardFarms != this.state.dashboardFarms)
      await AsyncStorage.setItem("@farmIds", JSON.stringify(this.state.dashboardFarms));
  }
  
  unique(value, index, self) {
    return self.indexOf(value) === index;
  };

  async addToDashboard() {
    this.setState({
      dashboardFarms: this.state.dashboardFarms
        .concat(this.props.farm.id)
        .filter(this.unique.bind(this)),
    });
  }

  async removeFromDashboard() {
    const index = this.state.dashboardFarms.indexOf(this.props.farm.id);
    var newIds = [...this.state.dashboardFarms];
    newIds.splice(index, 1);
    this.setState({ dashboardFarms: newIds });
  }


  render() {
    return (
      <ScrollView py="4">
        <Center>
          <Box maxW="1000" w="95%">
            <Heading pl="2" size="md">Details</Heading>
            <Box
              p="3"
              mt="3"
              rounded="lg"
              overflow="hidden"
              borderColor="coolGray.200"
              borderWidth="1"
              minHeight="300"
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
              <Text
                pt="2"
                _light={{
                  color: "info.700",
                }}
                _dark={{
                  color: "blue.600",
                }}
                fontWeight="500"
              >
                Launcher ID
              </Text>
              <Heading size="sm" numberOfLines={1} ellipsizeMode="middle">
                {this.props.farm.id}
              </Heading>

              <Text
                pt="2"
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
              <Heading size="sm">
                {this.props.farm.attributes.tib_24h} TiB
              </Heading>

              <Text
                pt="2"
                _light={{
                  color: "info.700",
                }}
                _dark={{
                  color: "blue.600",
                }}
                fontWeight="500"
              >
                Points
              </Text>
              <Heading size="sm">
                {this.props.farm.attributes.points_24h}
              </Heading>

              <Text
                pt="2"
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
              <Heading size="sm">
                {this.props.farm.attributes.ratio_24h}%
              </Heading>

              <Text
                pt="2"
                _light={{
                  color: "info.700",
                }}
                _dark={{
                  color: "blue.600",
                }}
                fontWeight="500"
              >
                Effort
              </Text>
              <Heading size="sm">
                {this.props.farm.attributes.current_effort}%
              </Heading>
            </Box>
          </Box>

          {this.state.dashboardFarms.includes(this.props.farm.id) ? (
            <Button
              colorScheme="gray"
              onPress={this.removeFromDashboard.bind(this)}
            >
              Remove from dashboard
            </Button>
          ) : (
            <Button onPress={this.addToDashboard.bind(this)}>
              Add to dashboard
            </Button>
          )}
        </Center>
      </ScrollView>
    );
  }
}
