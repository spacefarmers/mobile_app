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
      let response = await fetch('https://spacefarmers.io/api/farmers/904b6b9dcd7a7f7964bc001d1fa20371a9f4914de0501226a8223e472cc0b00a');
      let json = await response.json();
      setData([...data, json.data]);
      response = await fetch('https://spacefarmers.io/api/farmers/af160f9391c716415b28a38b85024c0809a3a1b64c51ee4cb6e301156aa0380f');
      json = await response.json();
      setData([...data, json.data]);
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
