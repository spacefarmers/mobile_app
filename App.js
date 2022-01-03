import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('./assets/adaptive-icon.png')}
      />
      <Text style={styles.text}>Welcome to SpaceFarmers.io!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#023c6a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 20,
  },
  logo: {
    width: 66,
    height: 58,
    marginBottom: 50,
  },
});
