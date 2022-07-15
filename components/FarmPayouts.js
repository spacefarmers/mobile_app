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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NumberFormat from "react-number-format";
import moment from "moment";

export default class FarmPayouts extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, payouts: undefined };
  }

  async componentDidMount() {
    this.getPayouts();
  }

  async getPayouts() {
    this.setState({ loading: true });
    const response = await fetch(
      global.API_URL + "/api/farmers/" + this.props.farmId + "/payouts"
    );
    const json = await response.json();
    console.log(json);
    this.setState({ payouts: json.data, loading: false });
  }

  render() {
    return (
      <ScrollView
        mt="2"
        mb="4"
        refreshControl={
          <RefreshControl
            refreshing={this.state.loading}
            onRefresh={this.getPayouts.bind(this)}
          />
        }
        stickyHeaderIndices={[0]}
      >
        <Center>
          <Box backgroundColor="gray.100" maxW="1000" w="95%">
            <Heading pl="2" size="md">
              Payouts
            </Heading>
            <Box
              px="3"
              py="1"
              mt="3"
              overflow="hidden"
              backgroundColor="gray.50"
              borderColor="coolGray.200"
              borderWidth="1"
            >
              <Box pl="4" pr="5" backgroundColor="gray.50">
                <HStack space="3">
                  <VStack>
                    <Text color="primary.600" bold>
                      Date
                    </Text>
                    <Text color="primary.600">Block</Text>
                  </VStack>
                  <Spacer />
                  <VStack>
                    <Text color="primary.600" bold textAlign="right">
                      XCH
                    </Text>
                    <Text color="primary.600" textAlign="right">
                      Dollars
                    </Text>
                  </VStack>
                  <Icon
                    mt="3"
                    as={MaterialCommunityIcons}
                    name="information-outline"
                    color="primary.600"
                    size="4"
                  />
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
              {this.state.payouts == undefined ? (
                <Box>
                  <Skeleton.Text p="4" lines="2" />
                  <Skeleton.Text p="4" lines="2" />
                  <Skeleton.Text p="4" lines="2" />
                  <Skeleton.Text p="4" lines="2" />
                </Box>
              ) : (
                this.state.payouts.map((payout, index) => {
                  return (
                    <Box
                      key={payout.id}
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
                              new Date(payout.attributes.timestamp * 1000)
                            ).format("DD MMM YYYY HH:mm")}
                          </Text>
                          <Text>{payout.attributes.height}</Text>
                        </VStack>
                        <Spacer />
                        <VStack>
                          <NumberFormat
                            value={payout.attributes.amount / 10 ** 12}
                            displayType={"text"}
                            suffix=" XCH"
                            decimalScale={12}
                            fixedDecimalScale={true}
                            renderText={(value) => (
                              <Text bold textAlign="right">
                                {value}
                              </Text>
                            )}
                          />
                          <NumberFormat
                            value={
                              (payout.attributes.amount / 10 ** 12) *
                              payout.attributes.xch_price
                            }
                            displayType={"text"}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            thousandSeparator={true}
                            prefix={"$ "}
                            renderText={(value) => (
                              <Text textAlign="right">{value}</Text>
                            )}
                          />
                        </VStack>
                        {payout.attributes.transaction_id != "" ? (
                          <Icon
                            mt="3"
                            as={MaterialCommunityIcons}
                            name="check"
                            size="4"
                          />
                        ) : (
                          <Icon
                            mt="3"
                            as={MaterialCommunityIcons}
                            name="check"
                            size="4"
                          />
                        )}
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
