/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const charcoalBase = '#1C1F24';
const graphiteVeil = '#262B33';
const warmMetallic = '#C99B5B';
const warmMetallicDark = '#D7A861';

export const Colors = {
  light: {
    text: '#1F2229',
    background: '#F5F6F8',
    tint: warmMetallic,
    icon: '#737884',
    tabIconDefault: '#9196A3',
    tabIconSelected: warmMetallic,
    surface: '#E6E8EC',
    surfaceMuted: '#D9DCE2',
    overlay: 'rgba(245, 246, 248, 0.24)',
    accent: warmMetallic,
    success: '#3E9B7B',
    warning: '#D88644',
    heroGradient: ['#4A505C', '#343A44', '#21252C'],
  },
  dark: {
    text: '#F2F3F7',
    background: '#121417',
    tint: warmMetallicDark,
    icon: '#A8ADB7',
    tabIconDefault: '#7C818B',
    tabIconSelected: warmMetallicDark,
    surface: charcoalBase,
    surfaceMuted: graphiteVeil,
    overlay: 'rgba(255, 255, 255, 0.08)',
    accent: warmMetallicDark,
    success: '#74C0A1',
    warning: '#E19B5A',
    heroGradient: ['#1E2229', '#15181E', '#0E1014'],
  },
};
