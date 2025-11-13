export type MetricKey = 'faceAngle' | 'swingPath' | 'attackAngle' | 'sideAngle';

export const METRIC_INFO: Record<MetricKey, {
  title: string;
  summary: string;
  ranges?: { good?: string; caution?: string; poor?: string };
  image?: any; // require(...) or { uri }
  tips?: string[];
}> = {
  faceAngle: {
    title: 'Face Angle',
    summary:
      'Face Angle is the clubface orientation (open/closed) relative to the target line at impact. Positive = open (right), negative = closed (left).',
    ranges: {
      good: '±1° to ±2° is typically “square enough” for many mid-irons.',
      caution: '±3° to ±5° may push/pull starts.',
      poor: '> ±5° often produces large starting direction errors.'
    },
    image: require('@/assets/images/face-angle.png'),
    tips: [
      'Match face to path for your intended shot shape.',
      'Check grip neutrality and wrist angles at impact.',
    ],
  },
  swingPath: {
    title: 'Swing Path',
    summary:
      'Clubhead horizontal path at impact relative to target. Positive = in-to-out (draw bias), negative = out-to-in (fade bias).',
    image: require('@/assets/images/club-path.png'),
    tips: ['Ball starts mostly where face points; path influences curvature.'],
  },
  attackAngle: {
    title: 'Attack Angle',
    summary:
      'Vertical clubhead motion at impact. Negative = hitting down, positive = hitting up.',
    image: require('@/assets/images/attack-angle.png'),
    tips: ['Irons: slightly down. Driver: often slightly up for distance.'],
  },
  sideAngle: {
    title: 'Side Angle',
    summary:
      'Horizontal launch direction relative to target line (ball’s initial start line). Positive = right, negative = left.',
    image: require('@/assets/images/side-angle.png'),
    tips: ['Primarily controlled by face angle at impact.'],
  },
};
