// constants/feedbackDetail.ts
import type { FeedbackGroup } from '@/app/utils/swingHistory';
import type { ImageSourcePropType } from 'react-native';

const GripImage = require('../assets/images/push_pull.png') as ImageSourcePropType;
const StanceImage = require('../assets/images/slice_hook.png') as ImageSourcePropType;
const TigerImage = require('../assets/images/swaggy_tiger.png') as ImageSourcePropType;

export type FeedbackConfig = {
  message?: string;   
  image: ImageSourcePropType;
};

export const FEEDBACK_BY_GROUP: Record<FeedbackGroup, FeedbackConfig> = {
  Pull: {
    image: GripImage,
    message:
      'Move your hands so you see fewer knuckles on your top hand when holding the club. ' +
      'Try pointing the "V" between your thumb and finger more toward your chin, not your shoulder, ' +
      'for a more balanced grip.',
  },
  Push: {
    image: GripImage,
    message:
      'Move your hands so you see more knuckles on your top hand when holding the club. ' +
      'Point the "V" between your thumb and finger more toward your right shoulder instead of your chin ' +
      'to strengthen a weak grip for better control.',
  },
  Slice: {
    image: StanceImage,
    message:
      'Move your trail foot back so your feet are parallel or slightly closed to the target line. ' +
      'This square stance helps you swing straighter through the ball and reduces slicing.',
  },
  Hook: {
    image: StanceImage,
    message:
      'Move your trail foot forward so your feet are parallel or slightly open to the target line. ' +
      'This squares your stance and helps you swing straighter through the ball to avoid hooking shots.',
  },
  Ideal: {
    image: TigerImage,
    // no message – just swaggy Tiger
  },
};
