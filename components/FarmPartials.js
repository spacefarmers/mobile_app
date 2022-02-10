import React from "react";
import {
  Center,
  ScrollView,
  Box,
  Heading,
  Skeleton,
  HStack,
  VStack,
  Spacer,
  Text,
} from "native-base";
import { RefreshControl } from "react-native";
import moment from "moment";

export default class FarmPartials extends React.Component {
  constructor(props) {
    super(props);
    this.state = { partialsLoading: true, partials: undefined };
  }

  async componentDidMount() {
    this.getPartials();
  }

  async getPartials() {
    this.setState({ partialsLoading: true });
    const response = await fetch(
      "https://spacefarmers.io/api/farmers/" + this.props.farmId + "/partials"
    );
    const json = await response.json();
    this.setState({ partials: json.data, partialsLoading: false });
  }

  render() {
    return (
      <ScrollView
        py="4"
        refreshControl={
          <RefreshControl
            refreshing={this.state.partialsLoading}
            onRefresh={this.getPartials.bind(this)}
          />
        }
      >
        <Center>
          <Box maxW="1000" w="95%">
            <Heading pl="2" size="md">
              Partials
            </Heading>
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
              {this.state.partials == undefined ? (
                <Box>
                  <Skeleton.Text p="4" lines="2" />
                  <Skeleton.Text p="4" lines="2" />
                  <Skeleton.Text p="4" lines="2" />
                  <Skeleton.Text p="4" lines="2" />
                </Box>
              ) : (
                this.state.partials.map((partial, index) => {
                  return (
                    <Box
                      key={partial.id}
                      borderBottomWidth="1"
                      _dark={{
                        borderColor: "gray.600",
                      }}
                      borderColor="coolGray.200"
                      pl="4"
                      pr="5"
                      py="2"
                    >
                      <HStack space="3">
                        <VStack>
                          <Text bold>
                            {moment(new Date(partial.attributes.timestamp * 1000)).format("DD/MM/YYYY HH:mm:ss")}
                          </Text>
                          <Text>
                            Harvester:{" "}
                            {partial.attributes.harvester_name ||
                              partial.attributes.harvester_id}
                          </Text>
                        </VStack>
                        <Spacer />
                        <VStack>
                          <Text textAlign="right" bold>
                            {partial.attributes.error_code}
                          </Text>
                          <Text textAlign="right">
                            {partial.attributes.points} pts
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  );
                })
              )}
            </Box>
          </Box>
        </Center>
      </ScrollView>
    );
  }
}
