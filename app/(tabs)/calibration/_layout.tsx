import { Stack } from 'expo-router';

export default function CalibrationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="lighting_wait" />
      <Stack.Screen name="lighting_success" />
      <Stack.Screen name="distance_wait" />
      <Stack.Screen name="distance_success" />
    </Stack>
  );
}