import MetricCard from '@/components/metrics/MetricCard';
import SkeletonLoader from '@/components/metrics/SkeletonLoader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useBLE from '@/hooks/useBLE';
import type { BleState } from '@/stores/bleStores';
import { useBleStore } from '@/stores/bleStores';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

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

const HISTORY_LENGTH = 20;

type MetricKey = 'faceAngle' | 'swingPath' | 'sideAngle' | 'attackAngle';

type MetricHistory = Partial<Record<MetricKey, number[]>>;

export default function MetricScreen() {
  const faceAngle = useBleStore((state: BleState) => state.faceAngle);
  const swingPath = useBleStore((state: BleState) => state.swingPath);
  const sideAngle = useBleStore((state: BleState) => state.sideAngle);
  const attackAngle = useBleStore((state: BleState) => state.attackAngle);
  const time = useBleStore((state: BleState) => state.time);

  const feedback = useBleStore((state: BleState) => state.feedback);
  const { readFeedback } = useBLE();

  const [metricHistory, setMetricHistory] = useState<MetricHistory>({});

  const appendHistory = useCallback((key: MetricKey, value: number | null | undefined) => {
    if (value === null || value === undefined) {
      return;
    }

    setMetricHistory((prev) => {
      const nextValues = [...(prev[key] ?? []), value].slice(-HISTORY_LENGTH);
      return { ...prev, [key]: nextValues };
    });
  }, []);

  useEffect(() => {
    appendHistory('faceAngle', faceAngle);
  }, [appendHistory, faceAngle]);

  useEffect(() => {
    appendHistory('swingPath', swingPath);
  }, [appendHistory, swingPath]);

  useEffect(() => {
    appendHistory('sideAngle', sideAngle);
  }, [appendHistory, sideAngle]);

  useEffect(() => {
    appendHistory('attackAngle', attackAngle);
  }, [appendHistory, attackAngle]);

  const formattedTimestamp = useMemo(() => safeLocaleString(time), [time]);

  const metrics = useMemo(
    () => [
      {
        key: 'faceAngle' as const,
        label: 'Face Angle',
        value: faceAngle,
        unit: '°',
        range: { min: -30, max: 30 },
        history: metricHistory.faceAngle ?? [],
      },
      {
        key: 'swingPath' as const,
        label: 'Swing Path',
        value: swingPath,
        unit: '°',
        range: { min: -40, max: 40 },
        history: metricHistory.swingPath ?? [],
      },
      {
        key: 'sideAngle' as const,
        label: 'Side Angle',
        value: sideAngle,
        unit: '°',
        range: { min: -25, max: 25 },
        history: metricHistory.sideAngle ?? [],
      },
      {
        key: 'attackAngle' as const,
        label: 'Attack Angle',
        value: attackAngle,
        unit: '°',
        range: { min: -20, max: 20 },
        history: metricHistory.attackAngle ?? [],
      },
    ],
    [attackAngle, faceAngle, metricHistory.attackAngle, metricHistory.faceAngle, metricHistory.sideAngle, metricHistory.swingPath, sideAngle, swingPath],
  );

  const enhancedMetrics = useMemo(
    () =>
      metrics.map((metric) => {
        const historyPoints = metric.history ?? [];
        const lastTwo = historyPoints.slice(-2);
        const delta = lastTwo.length === 2 ? lastTwo[1] - lastTwo[0] : null;
        let status: 'positive' | 'negative' | 'neutral' = 'neutral';

        if (delta !== null) {
          if (delta > 0.2) {
            status = 'positive';
          } else if (delta < -0.2) {
            status = 'negative';
          }
        }

        const isLoading = metric.value === null || metric.value === undefined;

        return {
          ...metric,
          delta,
          status,
          isLoading,
        };
      }),
    [metrics],
  );

  const isFeedbackLoading = !feedback;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.titleText}>Swing Analytics</ThemedText>

        <ThemedView style={styles.feedbackCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="chatbubble-ellipses" size={20} color="white" />
            <ThemedText style={styles.sectionLabel} type="subtitle">
              Feedback
            </ThemedText>
          </View>
          {isFeedbackLoading ? (
            <SkeletonLoader height={60} borderRadius={14} />
          ) : (
            <ThemedText style={styles.feedbackText}>{feedback}</ThemedText>
          )}
          {formattedTimestamp ? (
            <View style={styles.timestampRow}>
              <Ionicons name="time" size={16} color="rgba(255,255,255,0.7)" />
              <ThemedText style={styles.timestamp}>Updated {formattedTimestamp}</ThemedText>
            </View>
          ) : null}
          <Pressable onPress={readFeedback} style={styles.refreshButton} accessibilityLabel="Refresh feedback">
            <Ionicons name="refresh" size={20} color="white" />
            <ThemedText style={styles.refreshLabel}>Refresh</ThemedText>
          </Pressable>
        </ThemedView>

        <View style={styles.metricsGrid}>
          {enhancedMetrics.map((metric) => (
            <View key={metric.key} style={styles.metricWrapper}>
              <MetricCard
                label={metric.label}
                value={metric.value}
                unit={metric.unit}
                delta={metric.delta}
                status={metric.status}
                history={metric.history}
                range={metric.range}
                isLoading={metric.isLoading}
              />
            </View>
          ))}
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 48,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
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
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionLabel: {
    fontSize: 18,
  },
  feedbackText: {
    fontSize: 18,
    lineHeight: 24,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timestamp: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
  },
  refreshButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.28)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  refreshLabel: {
    fontSize: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  metricWrapper: {
    width: '48%',
  },
});
