import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const colorRole: 'text' | 'tint' = type === 'link' ? 'tint' : 'text';
  const color = useThemeColor({ light: lightColor, dark: darkColor }, colorRole);

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto', default: 'sans-serif' }),
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  defaultSemiBold: {
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto', default: 'sans-serif' }),
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
    fontWeight: '600',
  },
  title: {
    fontFamily: 'StrikeLeagueTitle',
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: 4,
  },
  subtitle: {
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto', default: 'sans-serif' }),
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: 0.1,
    fontWeight: '600',
  },
  link: {
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto', default: 'sans-serif' }),
    lineHeight: 24,
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
