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
    this.state = { loading: true, partials: undefined };
  }

  async componentDidMount() {
    this.getPartials();
  }

  async getPartials() {
    this.setState({ loading: true });
    const response = await fetch(
      global.API_URL + "/api/farmers/" + this.props.farmId + "/partials"
    );
    const json = await response.json();
    this.setState({ partials: json.data, loading: false });
  }

  render() {
    return (
      <ScrollView
        mt="2"
        mb="4"
        refreshControl={
          <RefreshControl
            refreshing={this.state.loading}
            onRefresh={this.getPartials.bind(this)}
          />
        }
        stickyHeaderIndices={[0]}
      >
        <Center>
          <Box backgroundColor="gray.100" maxW="1000" w="95%">
            <Heading pl="2" size="md">
              Partials
            </Heading>
            <Box
              px="3"
              py="1"
              mt="3"
              overflow="hidden"
              backgroundColor="coolGray.50"
              borderColor="coolGray.200"
              borderWidth="1"
            >
              <Box pl="4" pr="5" backgroundColor="coolGray.50">
                <HStack space="3">
                  <VStack>
                    <Text color="primary.600" bold>
                      Date
                    </Text>
                    <Text color="primary.600">Harvester</Text>
                  </VStack>
                  <Spacer />
                  <VStack>
                    <Text color="primary.600" bold textAlign="right">
                      Status
                    </Text>
                    <Text color="primary.600" textAlign="right">
                      Points
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </Box>
          </Box>
        </Center>
        <Center>
          <Box maxW="1000" w="95%">
            <Box
              px="3"
              overflow="hidden"
              backgroundColor="gray.50"
              borderColor="coolGray.200"
              borderWidth="1"
              mb="3"
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
                            {moment(
                              new Date(partial.attributes.timestamp * 1000)
                            ).format("DD/MM/YYYY HH:mm:ss")}
                          </Text>
                          <Text>
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
                            {partial.attributes.points}
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
