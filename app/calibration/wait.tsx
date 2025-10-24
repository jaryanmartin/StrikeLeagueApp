import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientOverlay } from '@/components/GradientOverlay';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import useBLE from '@/hooks/useBLE';
import { useColorScheme } from '@/hooks/useColorScheme';

const SUCCESS_VALUES = new Set(['success', 'completed', 'done', 'ok', 'true', '1']);

const isSuccessValue = (raw: string) => {
  const trimmed = raw.trim();
  if (!trimmed) return false;
  const normalized = trimmed.toLowerCase();
  if (SUCCESS_VALUES.has(normalized)) return true;
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === 'object') {
      const status = 'status' in parsed ? String((parsed as Record<string, unknown>).status ?? '') : '';
      if (SUCCESS_VALUES.has(status.trim().toLowerCase())) return true;
    }
  } catch {}
  return false;
};

export default function LightingCalibrationWaitScreen() {
  const router = useRouter();
  const { monitorLightingCalibration, connectedDevice } = useBLE();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const bottomGap = insets.bottom + 48;
  const [actionHeight, setActionHeight] = useState(0);

  useEffect(() => {
    if (!connectedDevice) return;
    setErrorMessage(null);
    const unsubscribe = monitorLightingCalibration(
      (value) => {
        if (isSuccessValue(value)) router.replace('/calibration/success');
      },
      () => {
        setErrorMessage('Unable to monitor lighting calibration.');
      }
    );
    return unsubscribe;
  }, [connectedDevice, monitorLightingCalibration, router]);

  const statusText = useMemo(() => {
    if (!connectedDevice) return 'Connect to your Strike League device to start lighting calibration.';
    if (errorMessage) return errorMessage;
    return 'Monitoring for calibration status...';
  }, [connectedDevice, errorMessage]);

  return (
    <ThemedView style={[styles.container, { backgroundColor: 'transparent' }]}>
      <GradientOverlay colors={palette.heroGradient} />
      <View style={styles.heroSection}>
        <GradientOverlay
          colors={[`${palette.accent}1A`, 'transparent']}
          style={styles.heroGlow}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          pointerEvents="none"
        />
        <ThemedText type="title" style={styles.titleText}>
          Calibrating Lighting
        </ThemedText>
        <ThemedText style={styles.subtitle} type="subtitle">
          Please wait while we adjust the camera exposure for your environment.
        </ThemedText>
      </View>
      <ActivityIndicator style={styles.spinner} color="white" size="large" />
      <ThemedText style={styles.status}>{statusText}</ThemedText>
      <View
        onLayout={e => setActionHeight(e.nativeEvent.layout.height)}
        style={[styles.actionSection, { marginBottom: bottomGap }]}
      >
        <Pressable
          onPress={() => router.replace('/settings')}
          style={({ pressed }) => [
            styles.secondaryAction,
            {
              backgroundColor: palette.surface,
              borderColor: palette.surfaceMuted,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <ThemedText type="defaultSemiBold" style={styles.actionLabel}>
            Cancel
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 16,
    paddingBottom: 24,
  },
  heroGlow: {
    position: 'absolute',
    top: -120,
    left: -120,
    right: -120,
    height: 320,
    borderRadius: 240,
  },
  titleText: {
    textTransform: 'uppercase',
    letterSpacing: 6,
    textAlign: 'center',
  },
  subtitle: {
    maxWidth: 320,
    textAlign: 'center',
    opacity: 0.85,
    marginTop: 12,
  },
  spinner: {
    alignSelf: 'center',
    marginTop: 8,
  },
  status: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    maxWidth: 420,
    alignSelf: 'center',
  },
  actionSection: {
    gap: 16,
  },
  secondaryAction: {
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
  },
  actionLabel: {
    fontSize: 18,
    letterSpacing: 0.3,
  },
});
