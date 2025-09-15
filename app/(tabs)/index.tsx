import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  
  return (
     <ThemedView style={{ flex: 1, padding: 100 }}>
      <Image
        source={require('@/assets/images/strike.png')}
        style={styles.reactLogo}
      />

      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.titleText}>STRIKE LEAGUE</ThemedText>
      </ThemedView>

      <Pressable onPress={() => router.push('/metrics')} style={styles.boxInitial}>
        <ThemedText style={styles.boxText}>Swing Analytics</ThemedText>
      </Pressable>

      {/* <Pressable onPress={() => router.push('/feedback')} style={styles.boxFeedback}>
        <ThemedText style={styles.boxText}>Swing Feedback</ThemedText>
      </Pressable> */}

      {/* <Pressable onPress={() => router.push('/history')} style={styles.boxHistory}>
        <ThemedText style={styles.boxText}>History Logs</ThemedText>
      </Pressable> */}

      <Pressable onPress={() => router.push('/settings')} style={styles.boxSettings}>
        <ThemedText style={styles.boxText}>Settings</ThemedText>
      </Pressable>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    width: 300,
  },
  titleText: {
    fontSize: 70,
    lineHeight: 76,
    textAlign: 'center',
    fontFamily: 'StrikeLeagueBold',
    color: 'white',
    right: 40,
    bottom: 15,
},
  boxInitial: {
    marginTop: 225,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'black',
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 10,
    alignItems: 'center',
    width: 350,
    alignSelf: 'center',
    backgroundColor: '#C7F9CC',
  },
  boxFeedback: {
    marginTop: 30,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'black',
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 10,
    alignItems: 'center',
    width: 350,
    alignSelf: 'center',
    backgroundColor: '#CFE4FF',
  },
  boxHistory: {
    marginTop: 30,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'black',
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 10,
    alignItems: 'center',
    width: 350,
    alignSelf: 'center',
    backgroundColor: '#FFD9D9',
  },
  boxSettings: {
    marginTop: 30,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'black',
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 10,
    alignItems: 'center',
    width: 350,
    alignSelf: 'center',
    backgroundColor: '#E5DEFF',
  },
  boxText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
  },
  reactLogo: {
    height: 150,
    width: 150,
    bottom: 505 ,
    left: 140,
    position: 'absolute',
  },
});
