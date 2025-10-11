import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    StrikeLeagueTitle: require('@/assets/fonts/StrikeLeagueTitle.ttf'),
    StrikeLeagueBold: require('@/assets/fonts/CosmicBold.ttf'),  
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; 
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: Platform.select({ ios: -2, default: 0 }),
        },
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="metrics"
        options={{
          title: 'Metrics',
          tabBarIcon: ({ color }) => <Ionicons name="golf" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings-sharp" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ble"
        options={{
          title: 'Ble',
          href: null,
          tabBarIcon: ({ color }) => <Ionicons name="bluetooth" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Calibration"
        options={{
          title: 'Calibration',
          href: null,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />

      <Tabs.Screen name="calibration" options={{ href: null }} />
      <Tabs.Screen name="calibration/index" options={{ href: null }} />
      <Tabs.Screen name="calibration/wait" options={{ href: null }} />
      <Tabs.Screen name="calibration/success" options={{ href: null }} />


    </Tabs>
  );
}
