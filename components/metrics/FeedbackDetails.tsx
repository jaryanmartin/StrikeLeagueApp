// components/metrics/FeedbackDetails.tsx
import type { FeedbackGroup } from '@/app/utils/swingHistory'; // adjust path if needed
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { FEEDBACK_BY_GROUP } from '@/constants/feedbackDetail';
import { Image, StyleSheet, useColorScheme, View } from 'react-native';

type Props = {
  group?: FeedbackGroup | null;
};

export default function FeedbackDetails({ group }: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  if (!group) return null;

  const config = FEEDBACK_BY_GROUP[group];
  if (!config) return null;

  return (
    <View style={styles.container}>
      <Image source={config.image} style={styles.image} resizeMode="contain" />
      {!!config.message && (
        <ThemedText style={[styles.message, { color: palette.text }]}>
          {config.message}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 220,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left',
  },
});
