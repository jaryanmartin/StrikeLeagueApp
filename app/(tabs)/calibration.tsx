import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useBLE from '@/hooks/useBLE';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

export default function CalibrationScreen() {
  const router = useRouter();
  const { turnOffLaunchMonitor } = useBLE();
  
  return (
     <ThemedView style={{ flex: 1, padding: 100 }}>
      <Pressable onPress={() => {
        console.log('Back pressed');
        router.back();
      }} style={styles.backIcon}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </Pressable>

      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.titleText}>Calibration</ThemedText>
      </ThemedView>

      <Pressable onPress={() => router.push('/ble')} style={styles.boxInitial}>
        <ThemedText style={styles.boxText}>Calibrate Lighting</ThemedText>
      </Pressable>

      <Pressable onPress={() => router.push('/calibration')} style={styles.boxCalibration}>
        <ThemedText style={styles.boxText}>Calibrate Distance</ThemedText>
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
  backIcon: {
    right: 350,
    bottom: 830,
    position: 'absolute',
    tintColor: 'white',
  },
  boxHistory: {
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
});
