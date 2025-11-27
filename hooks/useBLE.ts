import { useBleStore } from '@/stores/bleStores';
import { Buffer } from 'buffer';
import { useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

import {
  BleError,
  BleManager,
  Characteristic,
  Device,
  Subscription
} from "react-native-ble-plx";

import {
  logSwing,
  startSession,
  type FeedbackGroup,
  type SwingFeedback,
  type SwingMetrics,
} from "@/app/utils/swingHistory";

const DATA_SERVICE_UUID = "96f0284d-8895-4c08-baaf-402a2f7e8c5b";
const METRIC_CHARACTERISTIC_UUID = "d9c146d3-df83-49ec-801d-70494060d6d8";
const LIGHTING_CHARACTERISTIC_UUID = "778c5d1a-315f-4baf-a23b-6429b84835e3";
const STOP_LOOP_CHARACTERISTIC_UUID = "8f1a5ff0-399b-4afe-9cb4-280c8310e388";
// const BATTERY_CHARACTERISTIC_UUID = 'a834f0f7-89cc-453b-8be4-2905d27344bf';

const VIRTUAL_DEVICE_NAME = "group17rpi"; 

const bleManager = new BleManager();
let pendingMetrics: SwingMetrics | null = null;
let pendingGroup: FeedbackGroup | null = null;

function useBLE() {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const connectedDevice = useBleStore((state) => state.connectedDevice);
  const setConnectedDevice = useBleStore((state) => state.setConnectedDevice);
  // const setBatteryLevel = useBleStore((s) => s.setBatteryLevel);
  const {
  setFaceAngle,
  setSwingPath,
  setSideAngle,
  setAttackAngle,
  setFeedback,
  setTime,
  setFeedbackGroup,
} = useBleStore.getState();

const scanningRef = useRef<boolean>(false);
let isScanning = false;

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((Platform.Version ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);

      await deviceConnection.requestMTU(185);
      await deviceConnection.discoverAllServicesAndCharacteristics();

      const { sessionId, setSessionId } = useBleStore.getState();
      if (!sessionId) {
        const newSessionId = await startSession();
        setSessionId(newSessionId);
        pendingMetrics = null; // reset buffer at start
        pendingGroup = null;
        console.log("Started local swing session:", newSessionId);
      }
      
      bleManager.stopDeviceScan();
      await startStreamingData(deviceConnection);
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;


  const startScan = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }

      if (
        device &&
        (device.localName === VIRTUAL_DEVICE_NAME || device.name === VIRTUAL_DEVICE_NAME)
      ) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const onDataUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error);
      return;
    } 
    if (!characteristic?.value) {
      console.log("No Data was received");
      return;
    }

    const raw = Buffer.from(characteristic.value, 'base64').toString('utf-8');
    // console.log("UTF-8 Decoded String:", jsonStr);

    if (characteristic.uuid === METRIC_CHARACTERISTIC_UUID) {
      try {
        const data = JSON.parse(raw);
        console.log("Received BLE data:", data);

        const t = typeof data?.type === "string" ? data.type.toLowerCase() : "";

        if (t === "metrics") {
          const m =
            data.metrics && typeof data.metrics === "object" ? data.metrics : data;

          const faceAngleVal =
            typeof m["face angle"] === "number" ? m["face angle"] : null;
          const swingPathVal =
            typeof m["swing path"] === "number" ? m["swing path"] : null;
          const attackAngleVal =
            typeof m["attack angle"] === "number" ? m["attack angle"] : null;
          const sideAngleVal =
            typeof m["side angle"] === "number" ? m["side angle"] : null;

          if (faceAngleVal !== null) setFaceAngle(faceAngleVal);
          if (swingPathVal !== null) setSwingPath(swingPathVal);
          if (attackAngleVal !== null) setAttackAngle(attackAngleVal);
          if (sideAngleVal !== null) setSideAngle(sideAngleVal);
          setTime(new Date());

          pendingMetrics = {
            faceAngle: faceAngleVal,
            swingPath: swingPathVal,
            attackAngle: attackAngleVal,
            sideAngle: sideAngleVal,
          };

          const rawGroup =
            typeof m.group === "string" ? m.group : typeof data.group === "string" ? data.group : "";
          const normalized = rawGroup.trim().toLowerCase();

          let group: FeedbackGroup | null = null;
          switch (normalized) {
            case "pull":
              group = "Pull";
              break;
            case "push":
              group = "Push";
              break;
            case "slice":
              group = "Slice";
              break;
            case "hook":
              group = "Hook";
              break;
            case "ideal":
              group = "Ideal";
              break;
          }

          pendingGroup = group;
          setFeedbackGroup(group);
        }
        else {
          const feedbackText =
            typeof data.feedback === "string" ? data.feedback : raw;

          setFeedback(feedbackText);

          const { sessionId } = useBleStore.getState();
          if (sessionId && pendingMetrics && pendingGroup) {
            const structuredFeedback: SwingFeedback = {
              group: pendingGroup,
              message: feedbackText,
            };

            logSwing(sessionId, pendingMetrics, structuredFeedback).catch((err) =>
              console.error("Failed to log swing:", err)
            );

            // Clear pending for next swing
            pendingMetrics = null;
            pendingGroup = null;
          }
        }
      } catch (err) {
        console.error("Failed to parse BLE JSON:", err);
      }
    }
  }

  const startStreamingData = async (device: Device) => {
    if (device) {

      device.monitorCharacteristicForService(
        DATA_SERVICE_UUID,
        METRIC_CHARACTERISTIC_UUID, 
        onDataUpdate
      );

      // device.monitorCharacteristicForService(
      //   DATA_SERVICE_UUID,
      //   BATTERY_CHARACTERISTIC_UUID, 
      //   onDataUpdate
      // );

    } else {
      console.log("No Device Connected");
    }
  };

//   const stopScan = () => {
//   bleManager.stopDeviceScan();
// };

  const startRecord = async() => {
    if (!connectedDevice) {
      console.error("No device connected.");
      return;
    }

  const message = "START";
  const base64 = Buffer.from(message, 'utf-8').toString('base64');

  try {
    await bleManager.writeCharacteristicWithoutResponseForDevice(
      connectedDevice.id,
      DATA_SERVICE_UUID,
      METRIC_CHARACTERISTIC_UUID,
      base64
    );
    console.log("START command sent.");
    } catch (error) {
      console.error("Failed to send START:", error);
    }
  };

  const stopSession = async() => {
    if (!connectedDevice) {
      console.error("No device connected.");
      return;
    }

  const message = "END";
  const base64 = Buffer.from(message, 'utf-8').toString('base64');

  try {
    await bleManager.writeCharacteristicWithoutResponseForDevice(
      connectedDevice.id,
      DATA_SERVICE_UUID,
      STOP_LOOP_CHARACTERISTIC_UUID,
      base64
    );
    console.log("START command sent.");
    } catch (error) {
      console.error("Failed to send START:", error);
    }
  };

  const calibrateLighting = async() => {
   
    if (!connectedDevice) {
      console.error("No device connected.");
      return;
    }

  const message = "B";
  const base64 = Buffer.from(message, 'utf-8').toString('base64');

  try {
    await bleManager.writeCharacteristicWithoutResponseForDevice(
      connectedDevice.id,
      DATA_SERVICE_UUID,
      LIGHTING_CHARACTERISTIC_UUID,
      base64
    );
    console.log("START command sent.");
    } catch (error) {
      console.error("Failed to send START:", error);
    }
  };

  // const calibrateDistance = async() => {
   
  // if (!connectedDevice) {
  //   console.error("No device connected.");
  //   return;
  // }

  // const message = "C";
  // const base64 = Buffer.from(message, 'utf-8').toString('base64');

  // try {
  //   await bleManager.writeCharacteristicWithoutResponseForDevice(
  //     connectedDevice.id,
  //     DATA_SERVICE_UUID,
  //     DISTANCE_CHARACTERISTIC_UUID,
  //     base64
  //   );
  //   // setLightingCalibrated(true);
  //   console.log("Lighting calibration command sent.");
  //   } catch (error) {
  //     console.error("Failed to send lighting calibration command:", error);
  //     // setLightingCalibrated(false);
  //   }
  // };

  // const readFeedback = async () => {
  //   if (!connectedDevice) {
  //     console.error("No device connected.");
  //     return;
  //   }

  //   try {
  //     const characteristic = await bleManager.readCharacteristicForDevice(
  //       connectedDevice.id,
  //       DATA_SERVICE_UUID,
  //       FEEDBACK_CHARACTERISTIC_UUID
  //     );
  //     const raw = Buffer.from(characteristic?.value ?? '', 'base64').toString('utf-8');
  //     setFeedback(raw);
  //   } catch (error) {
  //     console.error("Failed to read feedback:", error);
  //   }
  // };

  const monitorLightingCalibration = (
    onValue: (value: string) => void,
    onError?: (error: BleError | Error) => void,
  ) => {
    if (!connectedDevice) {
      console.error("No device connected.");
      return () => {};
    }

    let subscription: Subscription | null = null;

    try {
      subscription = bleManager.monitorCharacteristicForDevice(
        connectedDevice.id,
        DATA_SERVICE_UUID,
        LIGHTING_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            const anyErr = error as any;
            const code = anyErr?.errorCode ?? anyErr?.code ?? anyErr?.status;
            const msg  = String(anyErr?.message ?? "").toLowerCase();

            if (
              code === 201 ||
              code === 205 ||
              msg.includes("cancel")
            ) {
              return;
            }

            console.error("Lighting calibration monitor error:", error);
            onError?.(error);
            return;
          }


          if (!characteristic?.value) {
            return;
          }

          const value = Buffer.from(characteristic.value, 'base64').toString('utf-8');
          onValue(value);
        }
      );
    } catch (error) {
      console.error("Failed to start lighting calibration monitor:", error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }

    return () => {
      try {
        subscription?.remove();
      } catch (error) {
        console.warn("Failed to stop lighting calibration monitor:", error);
      }
    };
  };

  return {
    connectToDevice,
    allDevices,
    connectedDevice,
    requestPermissions,
    startScan,
    startStreamingData,
    // stopScan,
    startRecord,
    calibrateLighting,
    stopSession,
    monitorLightingCalibration,
  };
}

export default useBLE;