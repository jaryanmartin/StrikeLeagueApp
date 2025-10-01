/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useThemeColor<
  K extends keyof typeof Colors.light & keyof typeof Colors.dark
>(
  props: { light?: (typeof Colors.light)[K]; dark?: (typeof Colors.dark)[K] },
  colorName: K
): (typeof Colors.light)[K] {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme] as (typeof Colors.light)[K] | undefined;

  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors[theme][colorName] as (typeof Colors.light)[K];
}
