/* eslint-disable no-bitwise */
import { useBleStore } from '@/stores/bleStores';
import { Buffer } from 'buffer';
import { useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

// import * as ExpoDevice from "expo-device";

import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";

const DATA_SERVICE_UUID = "c7e9f018-211c-44ac-8729-4d3287170d62";
const FACEANGLE_CHARACTERISTIC_UUID = "2c58a217-0a9b-445f-adac-0b37bd8635c3";
const SWINGPATH_CHARACTERISTIC_UUID = "449145fa-bad8-4b71-8094-44089b2c29b9";
const SIDEANGLE_CHARACTERISTIC_UUID = "a019ec27-5acf-4128-8a12-435901fc07ca";
const ATTACKANGLE_CHARACTERISTIC_UUID = "712da68d-cc4e-423e-b818-3f4cdf3a712a";

const VIRTUAL_DEVICE_NAME = "RaspberryPi"; // REPLACE THIS WITH RASPBERRY PI DEVICE NAME

const bleManager = new BleManager();

function useBLE() {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  
  const {
  setFaceAngle,
  setSwingPath,
  setSideAngle,
  setAttackAngle,
} = useBleStore.getState();

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
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();

      startStreamingData(deviceConnection);
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

  // Here is where I left off 
  const onDataUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error);
      return;
    } else if (!characteristic?.value) {
      console.log("No Data was received");
      return;
    }

    // const metricValue = base64.decode(characteristic.value);
    const raw = Buffer.from(characteristic.value, 'base64');
    const metricValue = raw.readInt16LE(0);
    // react-native-ble-plx converts raw data from peripheral into base64

    if (characteristic.uuid == FACEANGLE_CHARACTERISTIC_UUID)
    {
      setFaceAngle(metricValue);
    }
    else if (characteristic.uuid == SWINGPATH_CHARACTERISTIC_UUID)
    {
      setSwingPath(metricValue);
    }
    else if ( characteristic.uuid == SIDEANGLE_CHARACTERISTIC_UUID)
    {
      setSideAngle(metricValue);
    }
    else if (characteristic.uuid == ATTACKANGLE_CHARACTERISTIC_UUID)
    {
      setAttackAngle(metricValue);
    }
  };

  const startStreamingData = async (device: Device) => {
    if (device) {

      device.monitorCharacteristicForService(
        DATA_SERVICE_UUID,
        FACEANGLE_CHARACTERISTIC_UUID, 
        onDataUpdate
      );

      device.monitorCharacteristicForService(
        DATA_SERVICE_UUID,
        SWINGPATH_CHARACTERISTIC_UUID, 
        onDataUpdate
      );

      device.monitorCharacteristicForService(
        DATA_SERVICE_UUID,
        SIDEANGLE_CHARACTERISTIC_UUID, 
        onDataUpdate
      );

      device.monitorCharacteristicForService(
        DATA_SERVICE_UUID,
        ATTACKANGLE_CHARACTERISTIC_UUID, 
        onDataUpdate
      );

    } else {
      console.log("No Device Connected");
    }
  };

  const stopScan = () => {
  bleManager.stopDeviceScan();
};

  return {
    connectToDevice,
    allDevices,
    connectedDevice,
    requestPermissions,
    startScan,
    startStreamingData,
    stopScan,
  };
}

export default useBLE;