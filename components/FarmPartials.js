import React from "react";
import {
  Button,
  Center,
  ScrollView,
  Box,
  Heading,
  Text,
  Spinner,
  HStack,
  VStack,
  Spacer,
} from "native-base";

export default class FarmPartials extends React.Component {
  constructor(props) {
    super(props);
    this.state = { partialsLoading: true, partials: [] };
  }

  async componentDidMount() {
    this.setState({ partialsLoading: true });
    const response = await fetch(
      "https://spacefarmers.io/api/farmers/" + this.props.farmId + "/partials"
    );
    const json = await response.json();
    this.setState({ partials: json.data, partialsLoading: false });
  }

  render() {
    return (
      <ScrollView py="4">
        <Center>
          <Box maxW="1000" w="95%">
            <Heading pl="2" size="md">Partials</Heading>
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
              {this.state.partialsLoading ? (
                <Spinner flex={1} py="4" />
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
                            {new Date(
                              partial.attributes.timestamp * 1000
                            ).toLocaleString()}
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
