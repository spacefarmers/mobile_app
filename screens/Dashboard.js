import React, { useState, useEffect } from "react"
import {
  Center,
  View,
  FlatList,
  Text,
} from "native-base"
import FarmCard from "../components/FarmCard"
import { ActivityIndicator } from "react-native";

export default function DashboardScreen() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    getFarms();
  }, []);

  const getFarms = async () => {
    try {
     const response = await fetch('https://spacefarmers.io/api/farmers');
     const json = await response.json();
     setData(json.data);
   } catch (error) {
     console.error(error);
   } finally {
     setLoading(false);
   }
 }

  const renderItem = ({ farm }) => (
    <Center>
      <FarmCard farm={farm} />
    </Center>
  );

  return (
    <View>
      {isLoading ? <ActivityIndicator /> : (
        <FlatList
          pt="4"
          data={data}
          renderItem={({ item }) => (
            <Center>
              <FarmCard farm={item} />
            </Center>
          )}
          keyExtractor={({ id }, index) => id}
        />
      )}
    </View>
  )
}
