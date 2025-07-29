// Hook for deciding AI feedback based on rules.json
import data from '@/data/rules.json' with { type: 'json' };
import type { BleState } from '@/stores/bleStores';
import { useBleStore } from '@/stores/bleStores';

type Rule = {
  id: string;
  metric: string;
  range: {
    min: number;
    max: number;
  };
  feedback: string;
};

const rules = data as Rule[];

function useFeedback() {

  const faceAngle = useBleStore((state: BleState) => state.faceAngle);
  const swingPath = useBleStore((state: BleState) => state.swingPath);
  const sideAngle = useBleStore((state: BleState) => state.sideAngle);
  const attackAngle = useBleStore((state: BleState) => state.attackAngle);

  const metrics = {
    faceAngle,
    swingPath,
    sideAngle,
    attackAngle,
  };

  for (const rule of rules) {
    const value = metrics[rule.metric as keyof typeof metrics];

    if (value !== null && value >= rule.range.min && value <= rule.range.max) {
      return {
        problem: rule.id,
        feedback: rule.feedback,
      };
    }
  }

  return {
    problem: "Perfect swing!",
    feedback: 'No issues detected.',
  };
}

export default useFeedback;