import { memo, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, ViewStyle } from 'react-native';

type SkeletonWidth = number | `${number}%` | 'auto';

interface SkeletonLoaderProps {
  width?: SkeletonWidth;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}
const DEFAULT_WIDTH: SkeletonWidth = '100%';
const DEFAULT_HEIGHT = 20;
const DEFAULT_RADIUS = 12;

function SkeletonLoaderComponent({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  borderRadius = DEFAULT_RADIUS,
  style,
}: SkeletonLoaderProps) {
  const animatedValueRef = useRef(new Animated.Value(0));

  useEffect(() => {
    const animatedValue = animatedValueRef.current;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => {
      animation.stop();
    };
  }, []);

  const animatedStyle = {
    opacity: animatedValueRef.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.8],
    }),
  };

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius },
        animatedStyle,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
});

export default memo(SkeletonLoaderComponent);