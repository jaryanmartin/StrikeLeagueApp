import { VIRTUAL_DEVICE_NAME } from '@/constants/ble';
import type { BleState } from '@/stores/bleStores';
import { useBleStore } from '@/stores/bleStores';
import { StyleSheet, Text, View } from 'react-native';

export default function BLEStatusChip() {
  const connectedDevice = useBleStore((s) => s.connectedDevice);
  const batteryLevel = useBleStore((state: BleState) => state.batteryLevel);
  const isConnected = !!connectedDevice;
  const displayName =
    connectedDevice?.name || connectedDevice?.localName || VIRTUAL_DEVICE_NAME;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isConnected ? '#22c55e' : '#737373' },
      ]}
    >
      <Text style={styles.label}>
        Connection Status:{' '}
        <Text style={styles.value}>
          {isConnected ? 'Connected' : 'No Device'}
        </Text>
      </Text>

      {isConnected && (
        <Text style={[styles.label, { marginTop: 4 }]}>
          Device Name:{' '}
          <Text style={styles.value}>{displayName}</Text>
        </Text>
      )}

      {/* {isConnected && batteryLevel != null && (
        <Text style={styles.label}>
          Device Battery:{' '}
          <Text style={styles.value}>{batteryLevel}%</Text>
        </Text>
      )} */}


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    minWidth: 220,
  },
  label: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontWeight: '700',
  },
});
