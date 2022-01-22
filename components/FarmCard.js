import React from 'react';
import {
  Box,
  Text,
  AspectRatio,
  Center,
  Heading,
  Flex,
} from "native-base";
import { TouchableOpacity } from 'react-native';
import FarmOptionsModal from "../components/FarmOptionsModal"

export default class FarmCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, showRemoveModal: false };
  }

  async componentDidMount() {
    await this.getFarm();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.lastRefresh != this.props.lastRefresh) {
      await this.getFarm();
    }
  }

  async getFarm() {
    // const response = await fetch('http://192.168.89.116/api/farmers/' + this.props.farmId);
    this.setState({loading: true});
    const response = await fetch('https://spacefarmers.io/api/farmers/' + this.props.farmId);
    const json = await response.json();
    this.farm = json.data;
    this.props.addSize(sizes => ({ ...sizes, [this.props.index]: this.farm.attributes.tib_24h}));
    this.props.addPoints(points => ({ ...points, [this.props.index]: this.farm.attributes.points_24h}));
    this.setState({loading: false});
  }

  showRemoveModal(show = false) {
    this.setState({showRemoveModal: show});
  }

  removeFarm() {
    this.props.addSize(sizes => ({ ...sizes, [this.props.index]: 0}));
    this.props.addPoints(points => ({ ...points, [this.props.index]: 0}));
    this.props.removeFarm(this.props.index);
    this.showRemoveModal(false);
  }

  render() {
    return(
      <Box maxW="400" w="90%">
        <FarmOptionsModal showModal={this.state.showRemoveModal} setShowModal={this.showRemoveModal.bind(this)} removeFarm={this.removeFarm.bind(this)} />
        <TouchableOpacity onLongPress={() => this.showRemoveModal(true)}>
          <Box
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
            {this.state.loading ? "LOADING" : (
              <Box>
                <Box>
                  <AspectRatio w="100%" ratio={16 / 9}>
                    <Center>
                      <Heading size="sm">
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
                    {this.farm.attributes.farmer_name}
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
                    >
                      Size
                    </Text>
                    <Heading size="md">
                      {this.farm.attributes.tib_24h} TiB
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
                      textAlign="right"
                    >
                      Points
                    </Text>
                    <Heading size="md" textAlign="right">
                      {this.farm.attributes.points_24h}
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
                    >
                      Share
                    </Text>
                    <Heading size="md">
                      {this.farm.attributes.ratio_24h}%
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
                      textAlign="right"
                    >
                      Effort
                    </Text>
                    <Heading size="md" textAlign="right">
                      {this.farm.attributes.current_effort}%
                    </Heading>
                  </Box>
                </Flex>
              </Box>
            )}
          </Box>
        </TouchableOpacity>
      </Box>
    );
  }
}
