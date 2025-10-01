import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useBLE from '@/hooks/useBLE';
import { useRouter } from 'expo-router';

const SUCCESS_VALUES = new Set(['success', 'completed', 'done', 'ok', 'true', '1']);

const isSuccessValue = (raw: string) => {
  const trimmed = raw.trim();

  if (!trimmed) {
    return false;
  }

  const normalized = trimmed.toLowerCase();

  if (SUCCESS_VALUES.has(normalized)) {
    return true;
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed === 'object' && parsed !== null) {
      const status = 'status' in parsed ? String((parsed as Record<string, unknown>).status ?? '') : '';
      if (SUCCESS_VALUES.has(status.trim().toLowerCase())) {
        return true;
      }
    }
  } catch {
    // Ignore JSON parse errors and treat value as plain text.
  }

  return false;
};

export default function LightingCalibrationWaitScreen() {
  const router = useRouter();
  const { monitorLightingCalibration, connectedDevice } = useBLE();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!connectedDevice) {
      return undefined;
    }

    setErrorMessage(null);

    const unsubscribe = monitorLightingCalibration(
      (value) => {
        if (isSuccessValue(value)) {
          router.replace('/calibration/lighting/success');
        }
      },
      () => {
        setErrorMessage('Unable to monitor lighting calibration.');
      },
    );

    return unsubscribe;
  }, [connectedDevice, monitorLightingCalibration, router]);

  const statusText = useMemo(() => {
    if (!connectedDevice) {
      return 'Please allow your Strike League device to finish lighting calibration.';
    }

    if (errorMessage) {
      return errorMessage;
    }

    return 'Monitoring for calibration status...';
  }, [connectedDevice, errorMessage]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Calibrating Lighting. Please Wait!</ThemedText>
      <ActivityIndicator style={styles.spinner} color="white" size="large" />
      <ThemedText style={styles.status}>
        {statusText}
      </ThemedText>
      <Pressable
        style={[styles.actionButton, styles.cancelButton]}
        onPress={() => router.replace('/calibration/lighting')}>
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
    fontSize: 18,
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