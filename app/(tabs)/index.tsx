import { GradientOverlay } from '@/components/GradientOverlay';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
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
        {/* <Image source={require('@/assets/images/strike.png')} style={styles.logo} /> */}
        <ThemedText type="title" style={styles.titleText}>
          Strike League
        </ThemedText>
        <ThemedText style={styles.subtitle} type="subtitle">
          Track every swing with precision metrics and tailored insights.
        </ThemedText>
      </View>

      <View style={styles.actionSection}>
        <Pressable
          onPress={async () => {
            router.push('../countdown');
          }}
          style={({ pressed }) => [
            styles.primaryAction,
            {
              backgroundColor: palette.accent,
              shadowColor: colorScheme === 'dark' ? '#000000' : palette.accent,
              opacity: pressed ? 0.8 :1,
            },
          ]}
          accessibilityLabel="Start swing recording session">
          <ThemedText
            type="defaultSemiBold"
            style={styles.actionLabel}
            lightColor={Colors.light.background}
            darkColor={Colors.dark.background}>
            Start Recording
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => router.push('/settings')}
          style={({ pressed }) => [
            styles.secondaryAction,
            {
              backgroundColor: palette.surface,
              borderColor: palette.surfaceMuted,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          accessibilityLabel="Open settings">
          <ThemedText type="defaultSemiBold" style={styles.actionLabel}>
            Settings
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
  logo: {
    height: 160,
    width: 160,
    marginBottom: 16,
  },
  titleText: {
    textTransform: 'uppercase',
    letterSpacing: 6,
    textAlign: 'center',
    // fontFamily: 'StrikeLeagueBold',
},
  subtitle: {
    maxWidth: 320,
    textAlign: 'center',
    opacity: 0.85,
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
