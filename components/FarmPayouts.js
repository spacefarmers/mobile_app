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
    this.state = { payoutsLoading: true, payouts: undefined };
  }

  async componentDidMount() {
    this.getPayouts();
  }

  async getPayouts() {
    this.setState({ payoutsLoading: true });
    const response = await fetch(
      "https://spacefarmers.io/api/farmers/" + this.props.farmId + "/payouts"
    );
    const json = await response.json();
    console.log(json);
    this.setState({ payouts: json.data, payoutsLoading: false });
  }

  render() {
    return (
      <ScrollView
        py="4"
        refreshControl={
          <RefreshControl
            refreshing={this.state.payoutsLoading}
            onRefresh={this.getPayouts.bind(this)}
          />
        }
      >
        <Center>
          <Box maxW="1000" w="95%">
            <Heading pl="2" size="md">
              Payouts
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
                            ).format("DD/MM/YYYY HH:mm")}
                          </Text>
                          <Text>Block: {payout.attributes.height}</Text>
                        </VStack>
                        <Spacer />
                        <VStack>
                          <NumberFormat
                            value={payout.attributes.amount / 10 ** 12}
                            displayType={"text"}
                            suffix=" XCH"
                            decimalScale={12}
                            fixedDecimalScale={true}
                            renderText={value => <Text bold textAlign="right">{value}</Text>}
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
                            renderText={value => <Text textAlign="right">{value}</Text>}
                          />
                        </VStack>
                        {payout.attributes.transaction_id != "" ? (
                          <Icon
                            mt="2"
                            as={MaterialCommunityIcons}
                            name="check"
                            size="sm"
                          />
                        ) : (
                          <Icon
                            mt="2"
                            as={MaterialCommunityIcons}
                            name="check"
                            size="sm"
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
