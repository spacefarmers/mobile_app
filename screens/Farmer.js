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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, useWindowDimensions } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";

export default function FarmScreen({ route }) {
  const { farmId } = route.params;
  const [dashboardFarms, setDashboardFarms] = useState([]);
  const [farm, setFarm] = useState({});
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "details", icon: "text" },
    { key: "graphs", icon: "chart-areaspline" },
    { key: "partials", icon: "playlist-check" },
    { key: "payouts", icon: "currency-usd" },
    { key: "blocks", icon: "square-root-box" },
  ]);

  useEffect(() => {
    setIndex(0);
    getDashboardFarms();
    getFarm();
  }, [farmId]);

  useEffect(() => {
    async function storeFarms() {
      await AsyncStorage.setItem("@farmIds", JSON.stringify(dashboardFarms));
    }

    storeFarms();
  }, [dashboardFarms]);

  async function getDashboardFarms() {
    let farmsStored = await AsyncStorage.getItem("@farmIds");
    setDashboardFarms(JSON.parse(farmsStored));
  }

  async function addToDashboard() {
    setDashboardFarms((ids) => ids.concat(farm.id).filter(unique));
  }

  async function removeFromDashboard() {
    const index = dashboardFarms.indexOf(farm.id);
    var newIds = [...dashboardFarms];
    newIds.splice(index, 1);
    setDashboardFarms(newIds);
  }

  async function getFarm() {
    setLoading(true);
    const response = await fetch(
      "https://spacefarmers.io/api/farmers/" + farmId
    );
    const json = await response.json();
    setFarm(json.data);
    setLoading(false);
  }

  const unique = (value, index, self) => {
    return self.indexOf(value) === index;
  };

  const addFarm = async (id) => {};

  const FirstRoute = () => (
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
            <Text
              pt="2"
              _light={{
                color: "info.700",
              }}
              _dark={{
                color: "blue.600",
              }}
              fontWeight="500"
            >
              Launcher ID
            </Text>
            <Heading size="sm" numberOfLines={1} ellipsizeMode="middle">
              {farm.id}
            </Heading>

            <Text
              pt="2"
              _light={{
                color: "info.700",
              }}
              _dark={{
                color: "blue.600",
              }}
              fontWeight="500"
            >
              Size
            </Text>
            <Heading size="sm">{farm.attributes.tib_24h} TiB</Heading>

            <Text
              pt="2"
              _light={{
                color: "info.700",
              }}
              _dark={{
                color: "blue.600",
              }}
              fontWeight="500"
            >
              Points
            </Text>
            <Heading size="sm">{farm.attributes.points_24h}</Heading>

            <Text
              pt="2"
              _light={{
                color: "info.700",
              }}
              _dark={{
                color: "blue.600",
              }}
              fontWeight="500"
            >
              Share
            </Text>
            <Heading size="sm">{farm.attributes.ratio_24h}%</Heading>

            <Text
              pt="2"
              _light={{
                color: "info.700",
              }}
              _dark={{
                color: "blue.600",
              }}
              fontWeight="500"
            >
              Effort
            </Text>
            <Heading size="sm">{farm.attributes.current_effort}%</Heading>
          </Box>
        </Box>

        {dashboardFarms.includes(farm.id) ? (
          <Button
            colorScheme="gray"
            onPress={() => {
              removeFromDashboard();
            }}
          >
            Remove from dashboard
          </Button>
        ) : (
          <Button
            colorScheme="darkBlue"
            onPress={() => {
              addToDashboard();
            }}
          >
            Add to dashboard
          </Button>
        )}
      </Center>
    </ScrollView>
  );

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
    details: FirstRoute,
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
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
          />
        </Box>
      )}
    </Box>
  );
}
