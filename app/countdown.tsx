import { GradientOverlay } from '@/components/GradientOverlay';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import useBLE from '@/hooks/useBLE';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TimerCountdown() {
  const router = useRouter();
  const { startRecord } = useBLE();
  const [time, setTime] = useState(5);
  const [phase, setPhase] = useState<'WAITING' | 'PREP' | 'SWING' | 'DONE'>('WAITING');
  const [actionHeight, setActionHeight] = useState(0);
  const duration = phase === 'PREP' ? 5000 : 10000;
  const insets = useSafeAreaInsets();
  const bottomGap = insets.bottom + 48;  

  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  useEffect(() => {
    if (phase === 'WAITING' || phase === 'DONE') return;

    const start = performance.now();
    const timerId = setInterval(() => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, duration - elapsed); 
      setTime(remaining / 1000);

    if (remaining <= 0) {
      clearInterval(timerId);
      setPhase(p => (p === 'PREP' ? 'SWING' : 'DONE'));
    }
  }, 10);

    return () => clearInterval(timerId);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'SWING') return;
    (async () => {
      try {
        await startRecord();
      } catch (e) {
        console.warn('Failed to send START:', e);
        setPhase('DONE');
      }
    })();
  }, [phase, startRecord]);

  useEffect(() => {
    if (phase === 'DONE') {
      router.push('/(tabs)/metrics');
    }
  }, [phase]);

  const title =
    phase === 'SWING'
      ? 'Capturing Your Swing'
      : 'Prepare to Swing';

  const subtitle =
    phase === 'SWING'
      ? 'The recording is in progress, you have 10 seconds to complete your swing.'
      : 'You have 5 seconds to set up after readying up, then recording starts automatically.';


  return (
    <ThemedView style={[styles.container, { backgroundColor: 'transparent'}]}>
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
          {title}
        </ThemedText>
        <ThemedText style={styles.subtitle} type="subtitle">
          {subtitle}
        </ThemedText>
      </View>

      <ThemedText style={styles.status}>
        {time.toFixed(2)}
      </ThemedText>

      {phase !== 'SWING' ? (
        <View
          onLayout={e => setActionHeight(e.nativeEvent.layout.height)}
          style={[styles.actionSection, { marginBottom: bottomGap }]}
        >
          {/* Ready */}
          <Pressable
            onPress={() => setPhase('PREP')}
            style={({ pressed }) => [
              styles.primaryAction,
              {
                backgroundColor: palette.accent,
                shadowColor: colorScheme === 'dark' ? '#000000' : palette.accent,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedText
              type="defaultSemiBold"
              style={styles.actionLabel}
              lightColor={Colors.light.background}
              darkColor={Colors.dark.background}
            >
              Ready
            </ThemedText>
          </Pressable>

          {/* Cancel */}
          <Pressable
            onPress={() => router.back()}
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
      ) : (
        // placeholder to keep layout identical during SWING
        <View style={{ height: Math.max(actionHeight, 1), marginBottom: bottomGap }} />
      )}

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
  status: {
    fontSize: 50,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    maxWidth: 420,
    lineHeight: 110,
    letterSpacing: 1,
    includeFontPadding: false, 
    textAlignVertical: 'center',   
  },
  actionSection: {
    gap: 16,
  },
  primaryAction: {
    borderRadius: 22,
    paddingVertical: 20,
    alignItems: 'center',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
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