// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
// import useBLE from '@/hooks/useBLE';
// import { BleState, useBleStore } from '@/stores/bleStores';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import { Pressable, StyleSheet } from 'react-native';

// export default function FeedbackScreen() {
//   const router = useRouter();

//   // const {
//   //   // problem,
//   //   feedback,
//   // } = useFeedback();

//   const feedback = useBleStore((state: BleState) => state.feedback);
//   const { readFeedback } = useBLE();

//   return (
//      <ThemedView style={{ flex: 1, padding: 100 }}>
//       <Pressable onPress={() => {
//         console.log('Back pressed');
//         router.back();
//       }} style={styles.backIcon}>
//         <Ionicons name="arrow-back" size={28} color="white" />
//       </Pressable>

//       <ThemedView style={styles.titleContainer}>
//         <ThemedText style={styles.titleText}>Swing Feedback</ThemedText>
//       </ThemedView>

//       {/* <ThemedView style={styles.problem}>
//         <ThemedText type='subtitle'>Problem Identified: {problem !== null ? `${problem}` : "Waiting..."}</ThemedText>
//       </ThemedView> */}

//       <ThemedView style={styles.feedback}>
//         <ThemedText type='subtitle'>Feedback: {feedback !== null ? `${feedback}` : "Waiting..."}</ThemedText>
//       </ThemedView>

//       <Pressable onPress={readFeedback} style={styles.readButton}>
//         <Ionicons name="refresh" size={28} color="white" />
//       </Pressable>

//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 500,
//     right: 100,
//     top: 25,
//   },
//   titleText: {
//     fontSize: 45,
//     lineHeight: 56,
//     textAlign: 'center',
//     fontFamily: 'StrikeLeagueBold',
//     color: 'white',
//     flexWrap: 'nowrap',
//     right: 40,
//     bottom: 15,
// },
//   feedback: {
//     textAlign: 'center',
//     color: 'white',
//     right: 75,
//     bottom: 15,
//     marginTop: 120,
// },
//   boxText: {
//     fontSize: 20,
//     fontWeight: '500',
//     color: 'black',
//   },
//   backIcon: {
//     right: 350,
//     bottom: 830,
//     position: 'absolute',
//     tintColor: 'white',
//   },
//   readButton: {
//     position: 'absolute',
//     right: 190,
//     bottom: 200,
//   },
// });
