import { GradientOverlay } from '@/components/GradientOverlay';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import useBLE from '@/hooks/useBLE';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function LightingCalibrationWaitScreen() {
  const router = useRouter();
  const { monitorLightingCalibration, calibrateLighting, connectedDevice } = useBLE();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const bottomGap = insets.bottom + 48;
  const [actionHeight, setActionHeight] = useState(0);
  const mountedRef = useRef(true);

useEffect(() => {
  if (!connectedDevice) return;

  mountedRef.current = true;

  let unsubCalled = false;
  const safeUnsub = () => {
    if (!unsubCalled) {
      unsubCalled = true;
      unsubscribe?.();
    }
  };

  let navigated = false;
  const goSuccess = () => {
    if (navigated || !mountedRef.current) return;
    navigated = true;
    safeUnsub();
    router.replace('/calibration/success');
  };

  // 1) Subscribe first
  const unsubscribe = monitorLightingCalibration(
    (raw) => {
      if (!mountedRef.current) return;

      // DEBUG: see exactly what we get
      console.log('[calib status raw]:', raw);

      // If your hook already returns plain UTF-8 text, keep it simple:
      let text = String(raw);

      // If your hook returns base64 (react-native-ble-plx default), decode it:
      try {
        if (/^[A-Za-z0-9+/=]+$/.test(text)) {
          // heuristic; remove if your hook already decodes
          // @ts-ignore Buffer is polyfilled in your project; otherwise import a b64 decoder
          text = Buffer.from(text, 'base64').toString('utf8');
        }
      } catch {}

      const trimmed = text.trim().toLowerCase();
      console.log('[calib status text]:', JSON.stringify(trimmed));

      // Flexible match: "success", "ok", JSON, etc.
      let isSuccess = trimmed === 'success' || trimmed === 'ok' || trimmed === 'done';
      if (!isSuccess) {
        try {
          const j = JSON.parse(trimmed);
          const s = String(j?.status ?? j?.event ?? '').toLowerCase();
          if (s === 'success' || s === 'ok' || s === 'done' || s === 'true') isSuccess = true;
        } catch {}
      }

      if (isSuccess) goSuccess();
    },
    (err) => {
      if (!mountedRef.current) return;
      console.warn('monitor error:', err);
      setErrorMessage('Unable to monitor lighting calibration.');
    }
  );

  // 2) Write AFTER subscribe (tiny defer helps CCCD settle)
  const t = setTimeout(() => {
    calibrateLighting().catch((e: unknown) => console.warn('Start calib failed:', e));
  }, 50);

  // 3) Cleanup
  return () => {
    mountedRef.current = false;
    clearTimeout(t);
    safeUnsub();
  };
  // If monitorLightingCalibration / calibrateLighting are stable from the hook, deps are fine.
}, [connectedDevice]);

  const handleCancel = () => {
    router.replace('/settings');
  };

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
          onPress={handleCancel}
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
