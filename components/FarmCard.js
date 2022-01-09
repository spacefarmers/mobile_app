import React from 'react';
import {
  Box,
  Text,
  AspectRatio,
  Center,
  Heading,
  Flex,
} from "native-base";

export default class FarmCard extends React.Component {
  render() {
    return(
      <Box
        maxW="80"
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
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
        <Box>
          <AspectRatio w="100%" ratio={16 / 9}>
            <Center>
              <Heading size="sm" ml="-1">
                TODO: Graph
              </Heading>
            </Center>
          </AspectRatio>
          <Center
            bg="blue.800"
            _dark={{
              bg: "blue.600",
            }}
            _text={{
              color: "warmGray.50",
              fontWeight: "700",
              fontSize: "xs",
            }}
            position="absolute"
            top="0"
            px="3"
            py="1.5"
          >
            {this.props.farm.attributes.farmer_name}
          </Center>
        </Box>
        <Flex
          direction="row"
          mb="2.5"
          mt="1.5"
          _text={{
            color: "coolGray.800",
          }}
        >
          <Box width="50%" px="4">
           <Text
              fontSize="xs"
              _light={{
                color: "blue.800",
              }}
              _dark={{
                color: "blue.600",
              }}
              fontWeight="500"
              ml="-0.5"
              mt="-1"
            >
              Size
            </Text>
            <Heading size="md" ml="-1">
              {this.props.farm.attributes.tib_24h} TiB
            </Heading>
          </Box>
          <Box width="50%" px="4">
           <Text
              fontSize="xs"
              _light={{
                color: "blue.800",
              }}
              _dark={{
                color: "blue.600",
              }}
              fontWeight="500"
              ml="-0.5"
              mt="-1"
            >
              Points (24H)
            </Text>
            <Heading size="md" ml="-1">
              {this.props.farm.attributes.points_24h}
            </Heading>
          </Box>
        </Flex>
        <Flex
          direction="row"
          mb="2.5"
          mt="1.5"
          _text={{
            color: "coolGray.800",
          }}
        >
          <Box width="50%" px="4">
           <Text
              fontSize="xs"
              _light={{
                color: "blue.800",
              }}
              _dark={{
                color: "blue.600",
              }}
              fontWeight="500"
              ml="-0.5"
              mt="-1"
            >
              Share
            </Text>
            <Heading size="md" ml="-1">
              {this.props.farm.attributes.ratio_24h}%
            </Heading>
          </Box>
          <Box width="50%" px="4">
           <Text
              fontSize="xs"
              _light={{
                color: "blue.800",
              }}
              _dark={{
                color: "blue.600",
              }}
              fontWeight="500"
              ml="-0.5"
              mt="-1"
            >
              Effort
            </Text>
            <Heading size="md" ml="-1">
              -.--%
            </Heading>
          </Box>
        </Flex>
      </Box>
    );
  }
}