import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useBLE from '@/hooks/useBLE';
import type { BleState } from '@/stores/bleStores';
import { useBleStore } from '@/stores/bleStores';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

const formatMetricValue = (value: number | null, suffix?: string) => {
  if (value === null || value === undefined) {
    return 'Waiting…';
  }

  return `${value}${suffix ?? ''}`;
};

const safeLocaleString = (value: Date | string | number | null | undefined) => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toLocaleString();
  }

  try {
    const dateValue = new Date(value);
    if (!Number.isNaN(dateValue.getTime())) {
      return dateValue.toLocaleString();
    }
  } catch {
    // Swallow formatting errors and fall through to returning the raw value.
  }

  return String(value);
};

export default function MetricScreen() {
  const router = useRouter();
  
  const faceAngle = useBleStore((state: BleState) => state.faceAngle);
  const swingPath = useBleStore((state: BleState) => state.swingPath);
  const sideAngle = useBleStore((state: BleState) => state.sideAngle);
  const attackAngle = useBleStore((state: BleState) => state.attackAngle);
  const time = useBleStore((state: BleState) => state.time);

  const feedback = useBleStore((state: BleState) => state.feedback);
  const { readFeedback } = useBLE();

  const metrics = [
    { label: 'Face Angle', value: formatMetricValue(faceAngle, '°') },
    { label: 'Swing Path', value: formatMetricValue(swingPath, '°') },
    { label: 'Side Angle', value: formatMetricValue(sideAngle, '°') },
    { label: 'Attack Angle', value: formatMetricValue(attackAngle, '°') },
  ];

  const formattedTimestamp = useMemo(() => safeLocaleString(time), [time]);

  return (

    <ThemedView style={styles.container}>
      <Pressable
        onPress={() => {
          router.back();
        }}
        style={styles.backIcon}
        accessibilityLabel="Go back">
        <Ionicons name="arrow-back" size={28} color="white" />
      </Pressable>

      <ThemedText style={styles.titleText}>Swing Analytics</ThemedText>

      <ThemedView style={styles.feedbackCard}>
        <ThemedText style={styles.sectionLabel} type="subtitle">
          Feedback
        </ThemedText>
        <ThemedText style={styles.feedbackText}>
          {feedback ?? 'Waiting…'}
        </ThemedText>
        {formattedTimestamp ? (
          <ThemedText style={styles.timestamp}>
            Last updated {formattedTimestamp}
          </ThemedText>
        ) : null}
        <Pressable onPress={readFeedback} style={styles.refreshButton} accessibilityLabel="Refresh feedback">
          <Ionicons name="refresh" size={20} color="white" />
          <ThemedText style={styles.refreshLabel}>Refresh</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.metricsGrid}>
        {metrics.map((metric) => (
          <ThemedView key={metric.label} style={styles.metricCard}>
            <ThemedText style={styles.metricLabel}>{metric.label}</ThemedText>
            <ThemedText style={styles.metricValue}>{metric.value}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>

    </ThemedView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  backIcon: {
    position: 'absolute',
    left: 24,
    top: 40,
    padding: 8,
  },
  titleText: {
    fontSize: 40,
    fontFamily: 'StrikeLeagueBold',
    textAlign: 'center',
    color: 'white',
    marginBottom: 32,
    lineHeight: 55,
  },
  feedbackCard: {
    borderRadius: 20,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 20,
    marginTop: 50,
  },
  sectionLabel: {
    marginBottom: 12,
  },
  feedbackText: {
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 16,
  },
  timestamp: {
    fontSize: 14,
    opacity: 0.7,
  },
  refreshButton: {
    marginTop: 16,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    left: 100,
  },
  refreshLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexBasis: '48%',
  },
  metricLabel: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontFamily: 'StrikeLeagueBold',
  },
});
