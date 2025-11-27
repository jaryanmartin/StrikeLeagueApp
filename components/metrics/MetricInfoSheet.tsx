import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { METRIC_INFO, MetricKey } from '@/constants/metricInfo';
import { Ionicons } from '@expo/vector-icons';
import { Image, Modal, Pressable, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';

type Props = {
  metric: MetricKey | null;
  visible: boolean;
  onClose: () => void;
};

export default function MetricInfoSheet({ metric, visible, onClose }: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme as 'light' | 'dark'];
  const isDark = colorScheme === 'dark';
  const data = metric ? METRIC_INFO[metric] : null;

  return (
    <Modal visible={visible} transparent animationType="slide" presentationStyle="pageSheet">
      <Pressable style={[styles.backdrop, { backgroundColor: palette.overlay }]} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: palette.surface }]}>
        <View style={styles.header}>
          <ThemedText type="title">{data?.title ?? 'Metric'}</ThemedText>
          <Pressable accessibilityLabel="Close" onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={22} color={palette.text} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {data?.image ? (
            <Image source={data.image} style={styles.image} resizeMode="contain" />
          ) : null}

          {data?.summary ? (
            <ThemedText style={[styles.paragraph, { color: palette.text }]}>{data.summary}</ThemedText>
          ) : null}

          

          {data?.tips?.length ? (
            <View
              style={[
                styles.card,
                { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' },
              ]}
            >
              <ThemedText type="subtitle">Coach Notes</ThemedText>
              {data.tips.map((t, i) => (
                <ThemedText key={i}>• {t}</ThemedText>
              ))}
            </View>
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    borderTopLeftRadius: 18, borderTopRightRadius: 18,
    padding: 16,
    maxHeight: '80%',
    backgroundColor: 'white',
    minHeight: 600,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  content: { paddingBottom: 24, gap: 12 },
  paragraph: { lineHeight: 20 },
  card: { padding: 12, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.04)', gap: 6 },
  image: { width: '100%', height: 180, borderRadius: 12 },
});
