import type { ImageProps } from 'expo-image';
import { Image } from 'expo-image';
import { StyleSheet, type ImageStyle, type StyleProp } from 'react-native';

type GradientPoint = { x: number; y: number };

type GradientOverlayProps = {
  colors: string[];
  start?: GradientPoint;
  end?: GradientPoint;
  style?: StyleProp<ImageStyle>;
  pointerEvents?: ImageProps['pointerEvents'];
};

const defaultPoint: GradientPoint = { x: 0, y: 0 };

const buildGradientUri = (colors: string[], start: GradientPoint, end: GradientPoint) => {
  const stops = colors
    .map((color, index) => {
      const offset = colors.length === 1 ? 0 : (index / (colors.length - 1)) * 100;
      return `<stop offset="${offset}%" stop-color="${color}" />`;
    })
    .join('');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>` +
    `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1 1">` +
    `<defs>` +
    `<linearGradient id="gradient" x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}">` +
    `${stops}` +
    `</linearGradient>` +
    `</defs>` +
    `<rect width="1" height="1" fill="url(#gradient)" />` +
    `</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export function GradientOverlay({
  colors,
  start = defaultPoint,
  end = { x: 1, y: 1 },
  style,
  pointerEvents,
}: GradientOverlayProps) {
  const uri = buildGradientUri(colors, start, end);

  return (
    <Image
      source={{ uri }}
      style={[StyleSheet.absoluteFillObject, style]}
      contentFit="cover"
      pointerEvents={pointerEvents}
    />
  );
}