import { Device } from 'react-native-ble-plx';
import { create } from 'zustand';

export type BleState = {
  faceAngle: number | null;
  swingPath: number | null;
  sideAngle: number | null;
  attackAngle: number | null;
  feedback: string | null;
  connectedDevice: Device | null;
  time: Date | null,

  setFaceAngle: (val: number) => void;
  setSwingPath: (val: number) => void;
  setSideAngle: (val: number) => void;
  setAttackAngle: (val: number) => void;
  setFeedback: (msg: string) => void;
  setConnectedDevice: (device: Device | null) => void;
  setTime: (date: Date) => void;
};

export const useBleStore = create<BleState>((set, get) => ({
  faceAngle: null,
  swingPath: null,
  sideAngle: null,
  attackAngle: null,
  feedback: null,
  connectedDevice: null,
  time: null,

  setFaceAngle: (val) => set({ faceAngle: val }),
  setSwingPath: (val) => set({ swingPath: val }),
  setSideAngle: (val) => set({ sideAngle: val }),
  setAttackAngle: (val) => set({ attackAngle: val }),
  setFeedback: (msg) => set({feedback: msg}),
  setConnectedDevice: (device) => set({ connectedDevice: device }),
  setTime: (date) => set({time: date}),
}));
