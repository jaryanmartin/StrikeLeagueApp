import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

export default function TimerCountdown() {
  const router = useRouter();
  const [time, setTime] = useState(5);
  const [phase, setPhase] = useState<'PREP' | 'SWING'>('PREP');

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(prev => {
        if (prev <= 0.01) {
          clearInterval(timerId);
          setPhase('SWING');
          if (phase === 'PREP') {
            setTime(10);
          }
          return 0;
        }
        return (prev - 0.01);
      });
    }, 10);

    return () => clearInterval(timerId);
  }, [phase]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Put your phone down! 5 seconds!</ThemedText>
      <ActivityIndicator style={styles.spinner} color="white" size="large" />
      <ThemedText style={styles.status}>
        {time.toFixed(2)}
      </ThemedText>
      <Pressable
        style={[styles.actionButton, styles.cancelButton]}
        onPress={() => router.back()}>
        <ThemedText style={styles.actionButtonText}>Cancel</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 64,
  },
  title: {
    fontSize: 36,
    color: 'white',
    fontFamily: 'StrikeLeagueBold',
    textAlign: 'center',
    lineHeight: 45
  },
  spinner: {
    marginTop: 16,
  },
  status: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    maxWidth: 420,
  },
  actionButton: {
    marginTop: 24,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 48,
    backgroundColor: '#FFD9D9',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  cancelButton: {
    backgroundColor: '#FFD9D9',
  },
});