// useSwipeableHistory.ts
import { Gesture } from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type SwipeableConfig = {
  canSwipeUp: boolean;
  canSwipeDown: boolean;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
};

export default function Swipeable({
  canSwipeUp,
  canSwipeDown,
  onSwipeUp,
  onSwipeDown,
}: SwipeableConfig) {
  const position = useSharedValue(0);   // current Y offset of the card
  const startY = useSharedValue(0);     // starting Y when gesture begins

  const distanceThreshold = 80;   // how far to drag before it "commits"
  const velocityThreshold = 800;  // how fast to flick before it "commits"
  const throwDistance = 400;      // how far to "throw" the card off-screen

  const panGesture = Gesture.Pan()
    .onStart(() => {
      // remember where the card currently is
      startY.value = position.value;
    })
    .onUpdate((e) => {
      const tY = e.translationY;

      if (!canSwipeDown && tY > 0) {
        position.value = 0;
        return;
      }
      if (!canSwipeUp && tY < 0) {
        position.value = 0;
        return;
      }

      position.value = startY.value + tY;
    })
    .onEnd((e) => {
      const { translationY, velocityY } = e;

      // still respect boundaries
      if (!canSwipeDown && translationY > 0) {
        position.value = withTiming(0, { duration: 180 });
        return;
      }
      if (!canSwipeUp && translationY < 0) {
        position.value = withTiming(0, { duration: 180 });
        return;
      }

      const passedDistance = Math.abs(translationY) > distanceThreshold;
      const passedVelocity = Math.abs(velocityY) > velocityThreshold;
      const shouldCommit = passedDistance || passedVelocity;

      if (!shouldCommit) {
        position.value = withTiming(0, { duration: 180 });
        return;
      }

      const isDown = translationY > 0;

      if (isDown) {
        // Swipe DOWN:
        position.value = withSequence(
          withTiming(throwDistance, { duration: 120 }),
          withTiming(-throwDistance, { duration: 0 }), // jump to top
          withTiming(0, { duration: 160 })             // slide down in
        );
        if (onSwipeDown) runOnJS(onSwipeDown)();
      } else {
        // Swipe UP:
        position.value = withSequence(
          withTiming(-throwDistance, { duration: 120 }),
          withTiming(throwDistance, { duration: 0 }),  // jump to bottom
          withTiming(0, { duration: 160 })             // slide up in
        );
        if (onSwipeUp) runOnJS(onSwipeUp)();
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: position.value }],
  }));

  return { panGesture, animatedStyle };
}