import React from "react"
import {
  Center,
  ScrollView,
} from "native-base"
import FarmCard from "../components/FarmCard"

export default function DashboardScreen() {
  return (
    <ScrollView>
      <Center p="3">
        <FarmCard />
        <FarmCard />
        <FarmCard />
      </Center>
    </ScrollView>
  )
}
