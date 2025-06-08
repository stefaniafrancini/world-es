import { SafeAreaView } from 'react-native';
import GameScreen from '../screens/GameScreen'; // Ruta relativa corregida

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GameScreen />
    </SafeAreaView>
  );
}
