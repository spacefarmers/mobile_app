import React, { useState, useEffect } from "react";
import {
  Box,
  ScrollView,
  Center,
  Text,
  Heading,
  Spinner,
  Button,
  Icon,
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, useWindowDimensions } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import FarmDetails from "../components/FarmDetails";

export default function FarmScreen({ route }) {
  const { farmId } = route.params;
  const [farm, setFarm] = useState({});
  const [loading, setLoading] = useState(true);
  const [index, setTabIndex] = useState(0);
  const [routes] = useState([
    { key: "details", icon: "text" },
    { key: "graphs", icon: "chart-areaspline" },
    { key: "partials", icon: "playlist-check" },
    { key: "payouts", icon: "currency-usd" },
    { key: "blocks", icon: "square-root-box" },
  ]);

  useEffect(() => {
    setTabIndex(0);
    getFarm();
  }, [farmId]);

  async function getFarm() {
    setLoading(true);
    const response = await fetch(
      "https://spacefarmers.io/api/farmers/" + farmId
    );
    const json = await response.json();
    setFarm(json.data);
    setLoading(false);
  }


  const wipRoute = () => (
    <ScrollView py="4">
      <Center>
        <Box maxW="1000" w="90%">
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
            <Center>
              <Text>This page is work in progress</Text>
            </Center>
          </Box>
        </Box>
      </Center>
    </ScrollView>
  );

  const renderScene = SceneMap({
    details: () => <FarmDetails farm={farm} />,
    graphs: wipRoute,
    partials: wipRoute,
    payouts: wipRoute,
    blocks: wipRoute,
  });

  const layout = useWindowDimensions();

  const renderIcon = ({ route }) => {
    return <Icon as={MaterialCommunityIcons} name={route.icon} size="sm" />;
  };

  return (
    <Box flex={1}>
      {loading ? (
        <Spinner flex={1} size="lg" />
      ) : (
        <Box flex={1}>
          <Center>
            <Heading py="3">{farm.attributes.farmer_name}</Heading>
          </Center>
          <TabView
            renderTabBar={(props) => (
              <TabBar
                {...props}
                style={{ backgroundColor: "white" }}
                indicatorStyle={{
                  backgroundColor: 'rgb(3, 105, 161)',
                }}
                renderIcon={renderIcon}
              />
            )}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setTabIndex}
            initialLayout={{ width: layout.width }}
          />
        </Box>
      )}
    </Box>
  );
}
