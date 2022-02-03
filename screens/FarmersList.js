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
  View,
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableHighlight } from "react-native";

export default function FarmersListScreen({ navigation }) {
  const [page, setPage] = useState(1);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFarms();
  }, [page]);

  async function getFarms() {
    setLoading(true);
    const response = await fetch(
      "https://spacefarmers.io/api/farmers/?page=" + page
    );
    const json = await response.json();
    setFarms(json.data);
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
          <Text numberOfLines={1} bold>
            Farmer
          </Text>
          <Spacer />
          <Text w="100" textAlign="right" bold>
            Points
          </Text>
          <Text w="60" textAlign="right" bold>
            Share
          </Text>
        </HStack>
        {loading ? (
          <Spinner flex={1} size="lg" />
        ) : (
          <FlatList
            flex={1}
            data={farms}
            renderItem={({ item }) => (
              <TouchableHighlight onPress={() => navigation.navigate('Farmer', { farmId: item.id })}>
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
                    <VStack flex={1}>
                      <Text numberOfLines={1} bold>
                        {item.attributes.farmer_name}
                      </Text>
                      <Text numberOfLines={1} ellipsizeMode="middle">
                        {item.id}
                      </Text>
                    </VStack>
                    <VStack w="100">
                      <Text textAlign="right" bold>
                        {item.attributes.points_24h}
                      </Text>
                      <Text textAlign="right">
                        {item.attributes.tib_24h} TiB
                      </Text>
                    </VStack>
                    <Text w="60" pt="2" textAlign="right">
                      {item.attributes.ratio_24h} %
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
            colorScheme="darkBlue"
            leftIcon={
              <Icon as={MaterialCommunityIcons} name="chevron-left" size="sm" />
            }
            onPress={() => {
              setPage((oldPage) => oldPage - 1);
            }}
          ></Button>
          <Text pt="2">Page {page}</Text>
          <Button
            isDisabled={farms.count < 10}
            colorScheme="darkBlue"
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
