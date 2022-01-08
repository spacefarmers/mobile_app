import * as React from 'react';
import { View, Text } from "react-native";

export default function DashboardScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{fontSize:16,fontWeight:'700'}}>Dashboard Screen</Text>
    </View>
  );
}