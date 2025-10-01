import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function DistanceCalibrationSuccessScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Distance Calibration Complete!</ThemedText>
      <ThemedText style={styles.message}>
        Your distance calibration finished successfully. You can return to the home screen to continue.
      </ThemedText>
      <Pressable style={styles.actionButton} onPress={() => router.replace('/calibration')}>
        <ThemedText style={styles.actionButtonText}>Okay</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 100,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  title: {
    fontSize: 36,
    color: 'white',
    fontFamily: 'StrikeLeagueBold',
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    maxWidth: 420,
  },
  actionButton: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 48,
    backgroundColor: '#C7F9CC',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
});