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
      'Face Angle indicates the direction the clubface is pointed at impact relative to the target line, and it’s the biggest factor in determining the golf ball’s starting direction. A positive value means the face is pointed right (open), and a negative value means it’s pointed left (closed).',
    image: require('@/assets/images/face-angle.png'),
    tips: [
      'Match face to path for your intended shot shape.',
      'Check grip neutrality and wrist angles at impact.',
    ],
  },
  swingPath: {
    title: 'Swing Path',
    summary:
      'Swing Path describes the direction the clubhead is traveling (right or left) through impact relative to the target line, which strongly influences shot curve. A positive value means the club is moving right (‘in-to-out’), while a negative value means it’s moving left (‘out-to-in’).',
    image: require('@/assets/images/club-path.png'),
    tips: ['Ball starts mostly where face points; path influences curvature.'],
  },
  attackAngle: {
    title: 'Attack Angle',
    summary:
      'Attack Angle describes whether the club is moving upward or downward at impact. Negative values (hitting down) are ideal for irons, while positive values (hitting up) help maximize distance with the driver.',
    image: require('@/assets/images/attack-angle.png'),
    tips: ['For irons, aim for a slight downward strike.'],
  },
  sideAngle: {
    title: 'Side Angle',
    summary:
      'Side Angle (Azimuth) shows the direction the ball actually launches, left or right, after the golf ball leaves the club. It represents the ball’s real starting direction, combining both your clubface and swing path, and helps predict where the shot will end up.',
    image: require('@/assets/images/side-angle.png'),
    tips: ['Training Drill: Lay a club or alignment stick on the ground. Make sure your feet, hips, and shoulders are pointed parallel to the target line before swinging.'],
  },
};
