import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  
  return (
     <ThemedView style={{ flex: 1, padding: 100 }}>
      <Pressable onPress={() => router.push('/')}>
        <Ionicons name="arrow-back" size={28} color="white" style = {styles.backIcon}/>
      </Pressable>

      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.titleText}>Settings</ThemedText>
      </ThemedView>

      <ThemedView style={styles.faceAngle}>
        <ThemedText type='subtitle'>Units of Measurement:</ThemedText>
      </ThemedView>

      <ThemedView style={styles.swingPath}>
        <ThemedText type='subtitle'>Toggle Sound:</ThemedText>
      </ThemedView>

      <ThemedView style={styles.sideAngle}>
        <ThemedText type='subtitle'>Light/Dark Mode:</ThemedText>
      </ThemedView>

      <ThemedView style={styles.attackAngle}>
        <ThemedText type='subtitle'>Log Out:</ThemedText>
      </ThemedView>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 500,
    right: 100,
    top: 25,
  },
  titleText: {
    fontSize: 45,
    lineHeight: 56,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'StrikeLeagueBold',
    color: 'white',
    flexWrap: 'nowrap',
    right: 40,
    bottom: 15,
},
  faceAngle: {
    textAlign: 'center',
    color: 'white',
    right: 75,
    bottom: 15,
    marginTop: 120,
},
  swingPath: {
    color: 'white',
    right: 75,
    bottom: 15,
    marginTop: 90,
},
  sideAngle: {
    color: 'white',
    right: 75,
    bottom: 15,
    marginTop: 90,
},
  attackAngle: {
    color: 'white',
    right: 75,
    bottom: 15,
    marginTop: 90,
},
  boxText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
  },
  backIcon: {
    right: 250,
    bottom: 10,
    position: 'absolute',
    tintColor: 'white',
  },
});
