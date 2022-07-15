import React from "react";
import {
  Center,
  ScrollView,
  Box,
  Heading,
  Text,
  Skeleton,
  HStack,
  VStack,
  Spacer,
  Icon,
} from "native-base";
import { RefreshControl } from "react-native";
import NumberFormat from "react-number-format";
import moment from "moment";

export default class FarmBlocks extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, blocks: undefined };
  }

  async componentDidMount() {
    this.getBlocks();
  }

  async getBlocks() {
    this.setState({ loading: true });
    const response = await fetch(
      global.API_URL + "/api/farmers/" + this.props.farmId + "/blocks"
    );
    const json = await response.json();
    this.setState({ blocks: json.data, loading: false });
  }

  render() {
    return (
      <ScrollView
        mt="2"
        mb="4"
        refreshControl={
          <RefreshControl
            refreshing={this.state.loading}
            onRefresh={this.getBlocks.bind(this)}
          />
        }
        stickyHeaderIndices={[0]}
      >
        <Center>
          <Box backgroundColor="gray.100" maxW="1000" w="95%">
            <Heading pl="2" size="md">
              Blocks
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
              <Box
                pl="4"
                pr="5"
                backgroundColor="coolGray.50"
              >
                <HStack space="3">
                  <VStack>
                    <Text color="primary.600" bold>Date</Text>
                    <Text color="primary.600">Block</Text>
                  </VStack>
                  <Spacer />
                  <VStack>
                    <Text color="primary.600" bold textAlign="right">Farmer effort</Text>
                    <Text color="primary.600" textAlign="right">Pool reward</Text>
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
              {this.state.blocks == undefined ? (
                <Box>
                  <Skeleton.Text p="4" lines="2" />
                  <Skeleton.Text p="4" lines="2" />
                  <Skeleton.Text p="4" lines="2" />
                  <Skeleton.Text p="4" lines="2" />
                </Box>
              ) : (
                this.state.blocks.map((block, index) => {
                  return (
                    <Box
                      key={block.id}
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
                              new Date(block.attributes.timestamp * 1000)
                            ).format("DD MMM YYYY HH:mm")}
                          </Text>
                          <Text>{block.attributes.height}</Text>
                        </VStack>
                        <Spacer />
                        <VStack>
                          <NumberFormat
                            value={block.attributes.farmer_effort}
                            displayType={"text"}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            thousandSeparator={true}
                            suffix=" %"
                            renderText={(value) => (
                              <Text bold textAlign="right">
                                {value}
                              </Text>
                            )}
                          />
                          <NumberFormat
                            value={block.attributes.amount / 10 ** 12}
                            displayType={"text"}
                            suffix=" XCH"
                            decimalScale={2}
                            fixedDecimalScale={true}
                            renderText={(value) => (
                              <Text textAlign="right">{value}</Text>
                            )}
                          />
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
