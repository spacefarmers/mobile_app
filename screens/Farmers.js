import React, { useState, useEffect } from "react"
import { Box, FlatList, HStack, VStack, Text, Spacer, Center, Button, Icon, Spinner, View } from "native-base";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';

export default function FarmersScreen() {
  const [page, setPage] = useState(1);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFarms();
  }, [page]);

  async function getFarms() {
    setLoading(true);
    const response = await fetch('https://spacefarmers.io/api/farmers/?page=' + page);
    const json = await response.json();
    console.log(json.data);
    setFarms(json.data);
    setLoading(false);
  }

  return (
      <Center flex={1}>
        <Box w="90%" maxW="1000" flex={1}>
        <HStack borderBottomWidth="1" space={3} justifyContent="space-between" px="4" py="2">
            <Text numberOfLines={1} _dark={{
            color: "warmGray.50"
          }} color="coolGray.800" bold>
              Farmer
            </Text>
            <Spacer />
            <Text w="100" textAlign="right" _dark={{
        color: "warmGray.50"
      }} color="coolGray.800" bold>
              Points
            </Text>
            <Text w="60" textAlign="right" _dark={{
        color: "warmGray.50"
      }} color="coolGray.800" bold>
              Share
            </Text>
          </HStack>
          { loading ? (
            <Spinner flex={1} size="lg" />
          ) : (
            <FlatList flex={1} data={farms}
            renderItem={({
            item
          }) => <Box flex={1} borderBottomWidth="1" _dark={{
            borderColor: "gray.600"
          }} borderColor="coolGray.200" px="4" py="2">
                  <HStack flex={1} space={3} justifyContent="space-between">
                    <VStack flex={1}>
                      <Text numberOfLines={1} _dark={{
                  color: "warmGray.50"
                }} color="coolGray.800" bold>
                        {item.attributes.farmer_name}
                      </Text>
                      <Text numberOfLines={1} ellipsizeMode='middle' color="coolGray.600" _dark={{
                            color: "warmGray.200"
                }}>
                        {item.id}
                      </Text>
                    </VStack>
                    <VStack w="100">
                      <Text  textAlign="right" _dark={{
                  color: "warmGray.50"
                }} color="coolGray.800" bold>
                        {item.attributes.points_24h}
                      </Text>
                      <Text  textAlign="right" color="coolGray.600" _dark={{
                  color: "warmGray.200"
                }}>
                        {item.attributes.tib_24h} TiB
                      </Text>
                    </VStack>
                    <Text w="60" pt="2" textAlign="right" _dark={{
                color: "warmGray.50"
              }} color="coolGray.800">
                      {item.attributes.ratio_24h} %
                    </Text>
                  </HStack>
                </Box>}
              keyExtractor={item => item.id} />
           )}
      <HStack py="2" space={5} justifyContent="space-between">
          <Button
            isDisabled={page <= 1}
            colorScheme="darkBlue"
            leftIcon={<Icon as={MaterialCommunityIcons} name="chevron-left" size="sm" />}
            onPress={() => { setPage((oldPage) => oldPage - 1); }}
            _text={{
              color: "warmGray.50",
            }}
            _light={{
              backgroundColor: "info.700",
            }}
          >
          </Button>
          <Text pt="2" _dark={{
              color: "warmGray.50"
            }} color="coolGray.800">
            Page {page}
          </Text>
          <Button
            isDisabled={farms.count < 10}
            colorScheme="darkBlue"
            rightIcon={<Icon as={MaterialCommunityIcons} name="chevron-right" size="sm" />}
            onPress={() => { setPage((oldPage) => oldPage + 1); }}
            _text={{
              color: "warmGray.50",
            }}
            _light={{
              backgroundColor: "info.700",
            }}
          >
          </Button>
        </HStack>
      </Box>
    </Center>
  );
}