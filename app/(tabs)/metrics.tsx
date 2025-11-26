import { GradientOverlay } from '@/components/GradientOverlay';
import MetricCard from '@/components/metrics/MetricCard';
import MetricInfoSheet from '@/components/metrics/MetricInfoSheet';
import SkeletonLoader from '@/components/metrics/SkeletonLoader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import type { MetricKey } from '@/constants/metricInfo';
import Swipeable from '@/hooks/useSwipeableHistory';
import type { BleState } from '@/stores/bleStores';
import { useBleStore } from '@/stores/bleStores';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import {
  subscribeToSwings,
  type SwingEntry
} from '@/app/utils/swingHistory';


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

// type MetricKey = 'faceAngle' | 'swingPath' | 'sideAngle' | 'attackAngle';

type MetricHistory = Partial<Record<MetricKey, number[]>>;

type MetricConfig = {
  key: MetricKey;
  label: string;
  value: number | null | undefined;
  unit: string;
  range: { min: number; max: number };
  history: number[];
};

type EnhancedMetric = MetricConfig & {
  delta: number | null;
  status: 'positive' | 'negative' | 'neutral';
  isLoading: boolean;
};

export default function MetricScreen() {

  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  const faceAngleLive = useBleStore((state: BleState) => state.faceAngle);
  const swingPathLive = useBleStore((state: BleState) => state.swingPath);
  const sideAngleLive = useBleStore((state: BleState) => state.sideAngle);
  const attackAngleLive = useBleStore((state: BleState) => state.attackAngle);
  const timeLive = useBleStore((state: BleState) => state.time);
  const feedbackLive = useBleStore((state: BleState) => state.feedback);
  const sessionId = useBleStore((state: BleState) => state.sessionId);

  const [metricHistory, setMetricHistory] = useState<MetricHistory>({});
  const [infoMetric, setInfoMetric] = useState<MetricKey | null>(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [swings, setSwings] = useState<SwingEntry[]>([]);
  const [currentSwingIndex, setCurrentSwingIndex] = useState(0);

  const hasHistory = !!sessionId && swings.length > 0;
  const currentSwing = hasHistory ? swings[currentSwingIndex] : null;

  const openInfo = (key: MetricKey) => { setInfoMetric(key); setInfoVisible(true); };
  const closeInfo = () => setInfoVisible(false);

  const faceAngle = hasHistory
  ? currentSwing?.faceAngle ?? null
  : faceAngleLive;

const swingPath = hasHistory
  ? currentSwing?.swingPath ?? null
  : swingPathLive;

const sideAngle = hasHistory
  ? currentSwing?.sideAngle ?? null
  : sideAngleLive;

const attackAngle = hasHistory
  ? currentSwing?.attackAngle ?? null
  : attackAngleLive;

const time = hasHistory
  ? currentSwing?.timestamp ?? null
  : timeLive;

const feedback = hasHistory
  ? currentSwing?.feedback ?? feedbackLive
  : feedbackLive;


  const canSwipeDown = currentSwingIndex > 0;
  const canSwipeUp = currentSwingIndex < swings.length - 1;

  const { panGesture, animatedStyle } = Swipeable({
    canSwipeUp,
    canSwipeDown,
    onSwipeUp: () => {
      setCurrentSwingIndex((i) => Math.min(i + 1, swings.length - 1));
    },
    onSwipeDown: () => {
      setCurrentSwingIndex((i) => Math.max(i - 1, 0));
    },
  });

  const appendHistory = useCallback((key: MetricKey, value: number | null | undefined) => {
    if (value === null || value === undefined) {
      return;
    }

    setMetricHistory((prev) => {
      const nextValues = [...(prev[key] ?? []), value].slice(-HISTORY_LENGTH);
      return { ...prev, [key]: nextValues };
    });
  }, []);

  // useEffect(() => {
  //   appendHistory('faceAngle', faceAngle);
  // }, [appendHistory, faceAngle]);

  // useEffect(() => {
  //   appendHistory('swingPath', swingPath);
  // }, [appendHistory, swingPath]);

  // useEffect(() => {
  //   appendHistory('sideAngle', sideAngle);
  // }, [appendHistory, sideAngle]);

  // useEffect(() => {
  //   appendHistory('attackAngle', attackAngle);
  // }, [appendHistory, attackAngle]);

  useEffect(() => {
    if (!sessionId) return;

    const unsubscribe = subscribeToSwings(sessionId, (entries) => {
      setSwings(entries);
      setCurrentSwingIndex(0);
    });

    return () => unsubscribe();
  }, [sessionId]);


  const formattedTimestamp = useMemo(() => safeLocaleString(time), [time]);

  const metrics = useMemo<MetricConfig[]>(
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
        range: { min: -40, max: 40 },
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
    [
      attackAngle,
      faceAngle,
      metricHistory.attackAngle,
      metricHistory.faceAngle,
      metricHistory.sideAngle,
      metricHistory.swingPath,
      sideAngle,
      swingPath,
    ],
  );

  const enhancedMetrics = useMemo<EnhancedMetric[]>(
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
  const totalMetricRows = Math.ceil(enhancedMetrics.length / 2);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <GradientOverlay colors={palette.heroGradient} />
      <View style={[styles.heroSection, { paddingTop: 48 }]}>
        <GradientOverlay
          colors={[`${palette.accent}1A`, 'transparent']}
          style={styles.heroGlow}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          pointerEvents="none"
        />
        <ThemedText type="title" style={styles.titleText}>
          Swing Analytics
        </ThemedText>
      </View>

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
        </ThemedView>

        <FlatList<EnhancedMetric>
          data={enhancedMetrics}
          keyExtractor={(metric) => metric.key}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.metricsRow}
          contentContainerStyle={styles.metricsList}
          renderItem={({ item, index }) => {
            const rowIndex = Math.floor(index / 2);
            const isLastRow = rowIndex === totalMetricRows - 1;

            return (
              <View
                style={[styles.metricWrapper, isLastRow && styles.metricWrapperLastRow]}
              >
                <MetricCard
                  label={item.label}
                  value={item.value}
                  unit={item.unit}
                  delta={item.delta}
                  status={item.status}
                  history={item.history}
                  range={item.range}
                  isLoading={item.isLoading}
                />
                <Pressable
                  onPress={() => openInfo(item.key as MetricKey)}
                  style={{ position: 'absolute', top: 8, right: 8, padding: 6 }}
                  accessibilityLabel={`More info about ${item.label}`}
                >
                  <Ionicons name="information-circle-outline" size={20} color ="white" />
                </Pressable>
              </View>
            );
          }}
        />
        <MetricInfoSheet
          metric={infoMetric}
          visible={infoVisible}
          onClose={closeInfo}
        />
    </ScrollView>
          </Animated.View>
    </GestureDetector>
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
    textTransform: 'uppercase',
    letterSpacing: 6,
    textAlign: 'center',
},
  feedbackCard: {
    borderRadius: 20,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 20,
    marginTop: 16,
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
  metricsList: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  metricsRow: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  metricWrapper: {
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  metricWrapperLastRow: {
    marginBottom: 0,
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
});
