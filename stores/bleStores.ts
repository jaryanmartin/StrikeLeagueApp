// app/stores/bleStore.ts (or wherever you keep it)
import { create } from 'zustand';

export type BleState = {
  faceAngle: number | null;
  swingPath: number | null;
  sideAngle: number | null;
  attackAngle: number | null;
  feedback: string | null;
//   aiFeedback: string | null;
//   logs: { timestamp: number; metrics: Record<string, number | null> }[];

  setFaceAngle: (val: number) => void;
  setSwingPath: (val: number) => void;
  setSideAngle: (val: number) => void;
  setAttackAngle: (val: number) => void;
  setFeedback: (msg: string) => void;
//   setAiFeedback: (msg: string) => void;
//   addLog: () => void;
};

export const useBleStore = create<BleState>((set, get) => ({
  faceAngle: null,
  swingPath: null,
  sideAngle: null,
  attackAngle: null,
  feedback: null,
//   aiFeedback: null,
//   logs: [],

  setFaceAngle: (val) => set({ faceAngle: val }),
  setSwingPath: (val) => set({ swingPath: val }),
  setSideAngle: (val) => set({ sideAngle: val }),
  setAttackAngle: (val) => set({ attackAngle: val }),
  setFeedback: (msg) => set({feedback: msg}),
//   setAiFeedback: (msg) => set({ aiFeedback: msg }),

//   addLog: () => {
//     const { faceAngle, swingPath, sideAngle, attackAngle, logs } = get();
//     const timestamp = Date.now();
//     const newLog = {
//       timestamp,
//       metrics: {
//         faceAngle,
//         swingPath,
//         sideAngle,
//         attackAngle,
//       },
//     };
//     set({ logs: [...logs, newLog] });
//   },
}));
