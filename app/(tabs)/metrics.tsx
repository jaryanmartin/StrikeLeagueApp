import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useBLE from '@/hooks/useBLE';
import type { BleState } from '@/stores/bleStores';
import { useBleStore } from '@/stores/bleStores';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

export default function MetricScreen() {
  const router = useRouter();
  
  const faceAngle = useBleStore((state: BleState) => state.faceAngle);
  const swingPath = useBleStore((state: BleState) => state.swingPath);
  const sideAngle = useBleStore((state: BleState) => state.sideAngle);
  const attackAngle = useBleStore((state: BleState) => state.attackAngle);
  const time = useBleStore((state: BleState) => state.time);

  const feedback = useBleStore((state: BleState) => state.feedback);
  const { readFeedback } = useBLE();

  const {
    startRecord,
  } = useBLE();


  return (
     <ThemedView style={{ flex: 1, padding: 100 }}>
      <Pressable onPress={() => {
        router.back();
      }} style={styles.backIcon}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </Pressable>

      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.titleText}>Swing Analytics</ThemedText>
      </ThemedView>

      <ThemedView style={styles.faceAngle}>
          <ThemedText type={'subtitle'}>Face Angle: {faceAngle !== null ? `${faceAngle}°` : "Waiting..."}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.options}>
          <ThemedText type={'subtitle'}>Swing Path: {swingPath !== null ? `${swingPath}°` : "Waiting..."}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.options}>
          <ThemedText type={'subtitle'}>Side Angle: {sideAngle !== null ? `${sideAngle}°` : "Waiting..."}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.options}>
          <ThemedText type={'subtitle'}>Attack Angle: {attackAngle !== null ? `${attackAngle}°` : "Waiting..."}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.time}>
          <ThemedText type={'subtitle'}> {time !== null ? `${time.toLocaleString()}` : "Waiting..."}</ThemedText>
      </ThemedView>

      {/* <View style={styles.scanControls}>
        <Button title="Start Recording" onPress={startRecord} />
      </View> */}

      {/* <ThemedView style={styles.problem}>
        <ThemedText type='subtitle'>Problem Identified: {problem !== null ? `${problem}` : "Waiting..."}</ThemedText>
      </ThemedView> */}

      <ThemedView style={styles.feedback}>
        <ThemedText type='subtitle'>Feedback: {feedback !== null ? `${feedback}` : "Waiting..."}</ThemedText>
      </ThemedView>

      <Pressable onPress={readFeedback} style={styles.readButton}>
        <Ionicons name="refresh" size={28} color="white" />
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
  faceAngle: {
    textAlign: 'center',
    color: 'white',
    right: 75,
    bottom: 15,
    marginTop: 60,
},
  options: {
    color: 'white',
    right: 75,
    bottom: 15,
    marginTop: 30,
},
  time: {
    right: 0,
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
  scanControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  feedback: {
    textAlign: 'center',
    color: 'white',
    right: 75,
    bottom: 40,
    marginTop: 120,
},
  readButton: {
    position: 'absolute',
    right: 190,
    bottom: 100,
  },
});
