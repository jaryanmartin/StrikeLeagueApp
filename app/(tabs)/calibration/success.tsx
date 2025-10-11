import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function LightingCalibrationSuccessScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Lighting Calibration Complete!</ThemedText>
      <ThemedText style={styles.message}>
        Your lighting calibration finished successfully. You can return to the home screen to continue.
      </ThemedText>
      <Pressable style={styles.actionButton} onPress={() => router.replace('/settings')}>
        <ThemedText style={styles.actionButtonText}>Okay</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 50,
    paddingVertical: 100,
  },
  title: {
    fontSize: 32,
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