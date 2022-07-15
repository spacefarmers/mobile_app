import React, { useState, useEffect } from "react";
import {
  Box,
  FlatList,
  HStack,
  VStack,
  Text,
  Spacer,
  Center,
  Button,
  Icon,
  Spinner,
  Modal,
  FormControl,
  Input,
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableHighlight, DeviceEventEmitter } from "react-native";
import moment from "moment";

export default function BlockListScreen({ navigation }) {
  const [page, setPage] = useState(1);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBlocks();
  }, [page]);

  async function getBlocks() {
    setLoading(true);
    let url = global.API_URL + "/api/blocks/?page=" + page;
    const response = await fetch(url);
    const json = await response.json();
    setBlocks(json.data);
    setLoading(false);
  }

  return (
    <Center flex={1}>
      <Box w="90%" maxW="1000" flex={1}>
        <HStack
          borderBottomWidth="1"
          space={3}
          justifyContent="space-between"
          px="4"
          py="2"
        >
          <Text w="120" numberOfLines={1} bold>
            Block
          </Text>
          <Text bold>
            Farmer
          </Text>
          <Spacer />
          <Text w="60" textAlign="right" bold>
            Effort
          </Text>
        </HStack>
        {loading ? (
          <Spinner flex={1} size="lg" />
        ) : (
          <FlatList
            flex={1}
            data={blocks}
            renderItem={({ item }) => (
              <TouchableHighlight
                underlayColor="rgba(6, 182, 212, 0.1)"
              >
                <Box
                  flex={1}
                  borderBottomWidth="1"
                  _dark={{
                    borderColor: "gray.600",
                  }}
                  borderColor="coolGray.200"
                  px="4"
                  py="2"
                >
                  <HStack flex={1} space={3} justifyContent="space-between">
                    <VStack w="120" >
                      <Text numberOfLines={1} bold>
                        {item.attributes.height}
                      </Text>
                      <Text numberOfLines={1}>
                        {moment(
                          new Date(item.attributes.timestamp * 1000)
                        ).format("DD MMM YYYY HH:mm")}
                      </Text>
                    </VStack>
                    <VStack flex={1}>
                      <Text numberOfLines={1} bold>
                        {item.attributes.farmer_name}
                      </Text>
                      <Text numberOfLines={1} ellipsizeMode="middle">
                      {item.attributes.farmed_launcher_id}
                      </Text>
                    </VStack>
                    <Text w="60" pt="2" textAlign="right">
                      {item.attributes.effort} %
                    </Text>
                  </HStack>
                </Box>
              </TouchableHighlight>
            )}
            keyExtractor={(item) => item.id}
          />
        )}
        <HStack py="2" space={5} justifyContent="space-between">
          <Button
            isDisabled={page <= 1}
            leftIcon={
              <Icon as={MaterialCommunityIcons} name="chevron-left" size="sm" />
            }
            onPress={() => {
              setPage((oldPage) => oldPage - 1);
            }}
          ></Button>
          <Text pt="2">Page {page}</Text>
          <Button
            isDisabled={blocks.length < 10}
            rightIcon={
              <Icon
                as={MaterialCommunityIcons}
                name="chevron-right"
                size="sm"
              />
            }
            onPress={() => {
              setPage((oldPage) => oldPage + 1);
            }}
          ></Button>
        </HStack>
      </Box>
    </Center>
  );
}
