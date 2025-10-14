import { GradientOverlay } from '@/components/GradientOverlay';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

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

        <View style={[styles.heroIcon, { backgroundColor: `${palette.accent}1A` }]}>
          <Ionicons name="settings" size={36} color={palette.accent} />
        </View>
        <ThemedText type="title" style={styles.titleText}>
          Settings
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Manage your Strike League experience and keep your devices ready to play.
        </ThemedText>
      </View>

       <View style={styles.actionSection}>
        <Pressable
          onPress={() => router.push('/ble')}
          style={[
            styles.primaryAction,
            {
              backgroundColor: palette.accent,
              shadowColor: colorScheme === 'dark' ? '#000000' : palette.accent,
            },
          ]}
          accessibilityLabel="Connect a Bluetooth device"
        >
          <ThemedText
            type="defaultSemiBold"
            style={styles.actionLabel}
            lightColor={Colors.light.background}
            darkColor={Colors.dark.background}
          >
            Connect Bluetooth
          </ThemedText>
        </Pressable>

      <Pressable
          onPress={() => router.push('/calibration/wait')}
          style={[
            styles.secondaryAction,
            {
              backgroundColor: palette.surface,
              borderColor: palette.surfaceMuted,
            },
          ]}
          accessibilityLabel="Start lighting calibration"
        >
          <View style={styles.secondaryContent}>
            <ThemedText type="defaultSemiBold" style={styles.actionLabel}>
              Calibrate Lighting
            </ThemedText>
          </View>
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
    paddingBottom: 24,
  },
  heroGlow: {
    position: 'absolute',
    top: -140,
    left: -140,
    right: -140,
    height: 320,
    borderRadius: 240,
  },
  heroIcon: {
    height: 72,
    width: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  titleText: {
    textTransform: 'uppercase',
    letterSpacing: 6,
    textAlign: 'center',
  },
  subtitle: {
    maxWidth: 340,
    textAlign: 'center',
    opacity: 0.85,
    marginTop: 12,
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
  secondaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionLabel: {
    fontSize: 18,
    letterSpacing: 0.3,
  },
});
