import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import DashboardScreen from './screens/Dashboard';
import BlocksScreen from './screens/Blocks';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import DrawerItems from './constants/DrawerItems';
import { NativeBaseProvider } from "native-base";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Drawer.Navigator 
          drawerType="front"
          initialRouteName="Dashboard"
          screenOptions={{
            activeTintColor: '#e91e63',
            itemStyle: { marginVertical: 10 },
          }}
        
        >
          {
            DrawerItems.map(drawer=><Drawer.Screen 
              key={drawer.name}
              name={drawer.name}
              component={
                drawer.name==='Blocks' ? BlocksScreen 
                  : DashboardScreen
              }
            />)
          }
        </Drawer.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}