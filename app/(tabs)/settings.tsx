import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <ThemedView style={{ flex: 1, padding: 100 }}>

      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.titleText}>Settings</ThemedText>
      </ThemedView>

      <Pressable onPress={() => router.push('/ble')} style={styles.boxInitial}>
        <ThemedText style={styles.boxText}>Connect Bluetooth</ThemedText>
      </Pressable>

      <Pressable
        onPress={() => router.push('./calibration/wait')}
        style={styles.boxCalibration}>
        <ThemedText style={styles.boxText}>Calibrate Lighting</ThemedText>
      </Pressable>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 500,
    right: 100,
    top: 25,
  },
  titleText: {
    fontSize: 45,
    lineHeight: 56,
    textAlign: 'center',
    fontFamily: 'StrikeLeagueBold',
    color: 'white',
    flexWrap: 'nowrap',
    right: 40,
    bottom: 15,
},
  boxInitial: {
    marginTop: 125,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'black',
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 10,
    alignItems: 'center',
    width: 350,
    alignSelf: 'center',
    backgroundColor: '#C7F9CC',
  },
  boxCalibration: {
    marginTop: 30,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'black',
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 10,
    alignItems: 'center',
    width: 350,
    alignSelf: 'center',
    backgroundColor: '#FFD9D9',
  },
  options: {
    color: 'white',
    right: 75,
    bottom: 15,
    marginTop: 90,
},
  boxText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
  },
});
