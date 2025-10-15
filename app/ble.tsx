import { GradientOverlay } from '@/components/GradientOverlay';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import useBLE from '@/hooks/useBLE';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useBleStore } from '@/stores/bleStores';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function BluetoothScreen() {
  const router = useRouter();
  const {
    requestPermissions,
    startScan,
    stopScan,
    allDevices,
    connectToDevice,
    connectedDevice,
    calibrateLighting,
  } = useBLE();

  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const isLightingCalibrated = useBleStore((state) => state.isLightingCalibrated);

  useEffect(() => {
    requestPermissions();
  }, []);
 
  return (
    <ThemedView style={[styles.container, { backgroundColor: 'transparent' }]}>
      <GradientOverlay colors={palette.heroGradient} pointerEvents="none"/>
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [
          styles.backButton,
          {
            borderColor: palette.surfaceMuted,
            backgroundColor: colorScheme === 'dark' ? palette.surface : `${palette.surface}F2`,
            opacity: pressed ? 0.6 : 1,
          },
        ]}
        accessibilityLabel="Go back">
        <Ionicons
          name="arrow-back"
          size={20}
          color={colorScheme === 'dark' ? palette.text : palette.tint}
        />
      </Pressable>

      <View style={styles.heroSection} pointerEvents="none">
        <GradientOverlay
          colors={[`${palette.accent}1A`, 'transparent']}
          style={styles.heroGlow}
          start={{ x: 0.3, y: 0 }}
          end={{ x: 0.7, y: 1 }}
          pointerEvents="none"
        />
        <View style={[styles.heroIcon, { backgroundColor: `${palette.accent}1A` }]}>
          <Ionicons name="bluetooth" size={36} color={palette.accent} />
        </View>
        <ThemedText type="title" style={styles.titleText}>
          Bluetooth Devices
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Connect your tracker to begin capturing swing metrics in real time.
        </ThemedText>
      </View>

      <View style={styles.actionSection}>
        <Pressable
          onPress={startScan}
          style={({ pressed }) => [
            styles.primaryAction,
            {
              backgroundColor: palette.accent,
              shadowColor: colorScheme === 'dark' ? '#000000' : palette.accent,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          accessibilityLabel="Start scanning for Bluetooth devices">
          <ThemedText
            type="defaultSemiBold"
            style={styles.actionLabel}
            lightColor={Colors.light.background}
            darkColor={Colors.dark.background}>
            Start Scan
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={stopScan}
          style={({ pressed }) => [
            styles.secondaryAction,
            {
              backgroundColor: palette.surface,
              borderColor: palette.surfaceMuted,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          accessibilityLabel="Stop scanning for Bluetooth devices">
          <ThemedText type="defaultSemiBold" style={styles.actionLabel}>
            Stop Scan
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.devicesSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Available Devices
        </ThemedText>
        <FlatList
          data={allDevices}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.devicesList}
          ListEmptyComponent={
            <ThemedText style={styles.emptyState}>
              No devices found. Start a scan to discover nearby trackers.
            </ThemedText>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => connectToDevice(item)}
              style={[
                styles.deviceItem,
                {
                  borderColor: palette.surfaceMuted,
                  backgroundColor:
                    connectedDevice?.id === item.id ? `${palette.accent}26` : palette.surface,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Connect to ${item.name ?? 'Unnamed Device'}`}>
              <View style={styles.deviceHeader}>
                <ThemedText type="defaultSemiBold" style={styles.deviceName}>
                  {item.name ?? 'Unnamed Device'}
                </ThemedText>
                {connectedDevice?.id === item.id && (
                  <View style={[styles.connectedBadge, { backgroundColor: `${palette.accent}40` }]}> 
                    <Ionicons name="checkmark-circle" size={16} color={palette.accent} />
                    <ThemedText style={styles.connectedLabel}>Connected</ThemedText>
                  </View>
                )}
              </View>
              <ThemedText style={styles.deviceId}>{item.id}</ThemedText>
            </TouchableOpacity>
          )}
        />
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
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  heroSection: {
    alignItems: 'center',
    paddingBottom: 24,
    marginTop: 8,
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
    paddingVertical: 18,
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
    fontSize: 16,
    letterSpacing: 0.3,
  },
  devicesSection: {
    marginTop: 32,
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 12,
    textAlign: 'left',
  },
  devicesList: {
    gap: 12,
    paddingBottom: 16,
  },
  deviceItem: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  connectedLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.85,
  },
  deviceName: {
    fontSize: 16,
  },
  deviceId: {
    opacity: 0.7,
    fontSize: 12,
  },
  emptyState: {
    textAlign: 'center',
    opacity: 0.7,
    paddingVertical: 32,
  },
  calibrationWarning: {
    textAlign: 'center',
    marginTop: 16,
  },
});
