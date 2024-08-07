import * as React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import DashboardScreen from "./screens/Dashboard";
import FarmersListScreen from "./screens/FarmersList";
import FarmerScreen from "./screens/Farmer";
import BlocksListScreen from "./screens/BlocksList";
import PoolStatusScreen from "./screens/PoolStatus";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Notifications from 'expo-notifications';
import {
  NativeBaseProvider,
  Pressable,
  Image,
  VStack,
  Text,
  Center,
  HStack,
  Divider,
  Icon,
  Box,
} from "native-base";
import {TouchableOpacity, DeviceEventEmitter} from "react-native"

global.API_URL = 'https://spacefarmers.io';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Drawer = createDrawerNavigator();

const getIcon = (screenName) => {
  switch (screenName) {
    case "Dashboard":
      return "view-dashboard";
    case "Farmers":
      return "tractor";
    case "Blocks":
      return "square-root-box";
    case "Pool status":
      return "chart-bar";
    default:
      return undefined;
  }
};


const menuItem = (name, props) => {
  const index = props.state.routeNames.indexOf(name);
  return (
    <Box key={name}>
      <Pressable
        px="5"
        py="3"
        rounded="md"
        bg={
          index === props.state.index ? "rgba(6, 182, 212, 0.1)" : "transparent"
        }
        onPress={(event) => {
          props.navigation.navigate(name);
        }}
      >
        <HStack space="7" alignItems="center">
          <Icon
            color={index === props.state.index ? "#6a5c6d" : "gray.500"}
            size="5"
            as={<MaterialCommunityIcons name={getIcon(name)} />}
          />
          <Text
            fontWeight="500"
            color={index === props.state.index ? "#6a5c6d" : "gray.700"}
          >
            {name}
          </Text>
        </HStack>
      </Pressable>
    </Box>
  );
};

const menuLabel = (name) => {
  return (
    <Box>
      <Divider mt="5" />
      <Text fontWeight="500" fontSize="14" px="5" py="3" color="gray.500">
        {name}
      </Text>
    </Box>
  );
};

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} safeArea>
      <VStack space="6" my="2" mx="1">
        <Center>
          <Image
            source={require("./assets/logo_light.png")}
            alt="SpaceFarmers.io"
            size={"sm"}
            style={{ width: 250 }}
            resizeMode={"contain"}
          />
        </Center>
        <VStack>
          {menuLabel("Personal")}
          {["Dashboard"].map((name) => menuItem(name, props))}
          {menuLabel("Pool")}
          {["Farmers", "Blocks", "Pool status"].map((name) =>
            menuItem(name, props)
          )}
        </VStack>
      </VStack>
    </DrawerContentScrollView>
  );
}

function filterFarmers() {
  return (
    <TouchableOpacity onPress={() => DeviceEventEmitter.emit("filtes.toggle")}>
      <Icon as={MaterialCommunityIcons} name="filter" size="sm" mr="4" />
    </TouchableOpacity>
  );
}

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Dashboard"
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen name="Dashboard" component={DashboardScreen} />
          <Drawer.Screen
            name="Farmers"
            component={FarmersListScreen}
            options={{ headerRight: filterFarmers }}
          />
          <Drawer.Screen name="Farmer" component={FarmerScreen} />
          <Drawer.Screen name="Blocks" component={BlocksListScreen} />
          <Drawer.Screen name="Pool status" component={PoolStatusScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
