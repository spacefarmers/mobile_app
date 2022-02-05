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

export default function FarmersListScreen({ navigation }) {
  const [page, setPage] = useState(1);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQueryInput, setSearchQueryInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getFarms();
  }, [page, searchQuery]);

  useEffect(() => {
    DeviceEventEmitter.addListener("filtes.toggle", (eventData) => {
      setShowFilters((prevState) => !prevState);
    });
  }, []);

  async function getFarms() {
    setLoading(true);
    let url = "https://spacefarmers.io/api/farmers/?page=" + page;
    if (searchQuery != "") url = url + "&search=" + searchQuery;
    const response = await fetch(url);
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
              <TouchableHighlight
                underlayColor="rgba(6, 182, 212, 0.1)"
                onPress={() =>
                  navigation.navigate("Farmer", { farmId: item.id })
                }
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
            leftIcon={
              <Icon as={MaterialCommunityIcons} name="chevron-left" size="sm" />
            }
            onPress={() => {
              setPage((oldPage) => oldPage - 1);
            }}
          ></Button>
          <Text pt="2">Page {page}</Text>
          <Button
            isDisabled={farms.length < 10}
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

      <Modal isOpen={showFilters} onClose={() => setShowFilters(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Filter list</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Launcher ID / Name</FormControl.Label>
              <Input value={searchQueryInput} onChangeText={setSearchQueryInput} />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setSearchQueryInput('');
                  setSearchQuery('');
                  setPage(1);
                  setShowFilters(false);
                }}
              >
                Reset
              </Button>
              <Button
                onPress={() => {
                  setSearchQuery(searchQueryInput);
                  setPage(1);
                  setShowFilters(false);
                }}
              >
                Filter
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
}
