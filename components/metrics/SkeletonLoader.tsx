import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Polyline, Stop } from 'react-native-svg';
import SkeletonLoader from './SkeletonLoader';

type MetricStatus = 'positive' | 'negative' | 'neutral';

interface MetricCardProps {
  label: string;
  value: number | null | undefined;
  unit?: string;
  delta?: number | null | undefined;
  status?: MetricStatus;
  history?: number[];
  range?: { min: number; max: number };
  isLoading?: boolean;
}

const STATUS_STYLES: Record<MetricStatus, { border: string; icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  positive: {
    border: '#3DDC97',
    icon: 'arrow-up',
    color: '#3DDC97',
  },
  negative: {
    border: '#FF5C5C',
    icon: 'arrow-down',
    color: '#FF5C5C',
  },
  neutral: {
    border: 'rgba(255, 255, 255, 0.18)',
    icon: 'remove',
    color: 'rgba(255, 255, 255, 0.5)',
  },
};

const MAX_HISTORY_POINTS = 12;

function MetricCardComponent({
  label,
  value,
  unit,
  delta,
  status = 'neutral',
  history = [],
  range = { min: 0, max: 100 },
  isLoading,
}: MetricCardProps) {
  const statusStyles = STATUS_STYLES[status];
  const sanitizedLabel = useMemo(() => label.toLowerCase().replace(/[^a-z0-9]+/g, '-'), [label]);
  const gaugeGradientId = useMemo(() => `gaugeGradient-${sanitizedLabel}`, [sanitizedLabel]);
  const sparkGradientId = useMemo(() => `sparkGradient-${sanitizedLabel}`, [sanitizedLabel]);

  const formattedValue = useMemo(() => {
    if (value === null || value === undefined) {
      return null;
    }
    return `${value.toFixed(1)}${unit ?? ''}`;
  }, [unit, value]);

  const formattedDelta = useMemo(() => {
    if (delta === null || delta === undefined) {
      return null;
    }
    const symbol = delta > 0 ? '+' : '';
    return `${symbol}${delta.toFixed(1)}${unit ?? ''}`;
  }, [delta, unit]);

  const clampedHistory = useMemo(() => history.slice(-MAX_HISTORY_POINTS), [history]);

  const sparklinePoints = useMemo(() => {
    if (!clampedHistory.length) {
      return '';
    }

    const width = 120;
    const height = 40;
    const minValue = Math.min(...clampedHistory);
    const maxValue = Math.max(...clampedHistory);
    const valueRange = maxValue - minValue || 1;

    return clampedHistory
      .map((point, index) => {
        const x = (index / (clampedHistory.length - 1 || 1)) * width;
        const y = height - ((point - minValue) / valueRange) * height;
        return `${x},${y}`;
      })
      .join(' ');
  }, [clampedHistory]);

  const gaugeProgress = useMemo(() => {
    if (value === null || value === undefined) {
      return 0;
    }
    const clamped = Math.min(Math.max(value, range.min), range.max);
    const normalized = (clamped - range.min) / (range.max - range.min || 1);
    return normalized;
  }, [range.max, range.min, value]);

  const gaugePath = useMemo(() => {
    const radius = 36;
    const circumference = Math.PI * radius;
    const dashArray = `${circumference} ${circumference}`;
    const dashOffset = circumference - circumference * gaugeProgress;

    return { radius, dashArray, dashOffset };
  }, [gaugeProgress]);

  return (
    <ThemedView style={[styles.card, { borderLeftColor: statusStyles.border }]}> 
      <View style={styles.headerRow}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        <Ionicons name={statusStyles.icon} size={18} color={statusStyles.color} />
      </View>

      <View style={styles.valueRow}>
        {isLoading ? (
          <SkeletonLoader width={110} height={28} borderRadius={12} />
        ) : (
          <ThemedText style={styles.valueText}>{formattedValue}</ThemedText>
        )}
        {!isLoading && formattedDelta ? (
          <View style={styles.deltaChip}>
            <Ionicons
              name={delta && delta < 0 ? 'trending-down' : 'trending-up'}
              size={16}
              color={statusStyles.color}
            />
            <ThemedText style={[styles.deltaText, { color: statusStyles.color }]}>{formattedDelta}</ThemedText>
          </View>
        ) : null}
      </View>

      <View style={styles.visualRow}>
        <Svg width={84} height={48} viewBox="0 0 84 48">
          <Defs>
            <LinearGradient id={gaugeGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
              <Stop offset="100%" stopColor={statusStyles.color} />
            </LinearGradient>
          </Defs>
          <Circle
            cx="42"
            cy="42"
            r={gaugePath.radius}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={8}
            fill="transparent"
            strokeDasharray={gaugePath.dashArray}
            strokeDashoffset={Math.PI * gaugePath.radius}
            strokeLinecap="round"
            transform="rotate(-180 42 42)"
          />
          <Circle
            cx="42"
            cy="42"
            r={gaugePath.radius}
            stroke={`url(#${gaugeGradientId})`}
            strokeWidth={8}
            fill="transparent"
            strokeDasharray={gaugePath.dashArray}
            strokeDashoffset={gaugePath.dashOffset}
            strokeLinecap="round"
            transform="rotate(-180 42 42)"
          />
        </Svg>

        <View style={styles.sparklineContainer}>
          {clampedHistory.length > 1 ? (
            <Svg width="100%" height="100%" viewBox="0 0 120 40" preserveAspectRatio="none">
              <Defs>
                <LinearGradient id={sparkGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                  <Stop offset="100%" stopColor={statusStyles.color} />
                </LinearGradient>
              </Defs>
              <Path
                d={`M0,40 L${sparklinePoints} L120,40 Z`}
                fill="rgba(255,255,255,0.08)"
              />
              <Polyline
                points={sparklinePoints}
                fill="none"
                stroke={`url(#${sparkGradientId})`}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </Svg>
          ) : (
            <SkeletonLoader height={40} borderRadius={12} />
          )}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    padding: 18,
    borderLeftWidth: 4,
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    opacity: 0.8,
    fontFamily: 'StrikeLeagueBold',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  valueText: {
    fontSize: 26,
    fontFamily: 'StrikeLeagueBold',
  },
  deltaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
  },
  deltaText: {
    marginLeft: 6,
    fontSize: 14,
  },
  visualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    gap: 16,
  },
  sparklineContainer: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
});

export default memo(MetricCardComponent);