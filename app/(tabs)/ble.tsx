import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useBLE from '@/hooks/useBLE';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Button, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BluetoothScreen() {
  const router = useRouter();
  const {
    requestPermissions,
    startScan,
    stopScan,
    allDevices,
    connectToDevice,
    connectedDevice,
    color,
  } = useBLE();

  useEffect(() => {
    requestPermissions();
  }, []);
  
  return (
     <ThemedView style={{ flex: 1, padding: 100 }}>
      <Pressable onPress={() => {
        console.log('Back pressed');
        router.push('/settings');
      }} style={styles.backIcon}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </Pressable>

      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.titleText}>Bluetooth</ThemedText>
      </ThemedView>

      <View style={styles.scanControls}>
        <Button title="Start Scan" onPress={startScan} />
        <Button title="Stop Scan" onPress={stopScan} />
      </View>

      <Text style={styles.sectionTitle}>Discovered Devices:</Text>
      <FlatList
        data={allDevices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => connectToDevice(item)} style={styles.deviceItem}>
            <Text style={styles.deviceName}>{item.name ?? 'Unnamed Device'}</Text>
            <Text style={styles.deviceId}>{item.id}</Text>
          </TouchableOpacity>
        )}
      />

      {connectedDevice && (
        <View style={styles.connectionInfo}>
          <Text style={styles.connectedText}>Connected to: {connectedDevice.name}</Text>
          <Text style={{ color: color, fontWeight: 'bold', marginTop: 10 }}>
            Color: {color.toUpperCase()}
          </Text>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 500,
    right: 100,
    top: 25,
  },
  titleText: {
    fontSize: 45,
    lineHeight: 56,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'StrikeLeagueBold',
    color: 'white',
    flexWrap: 'nowrap',
    right: 40,
    bottom: 15,
},
  faceAngle: {
    textAlign: 'center',
    color: 'white',
    right: 75,
    bottom: 15,
    marginTop: 120,
},
  options: {
    color: 'white',
    right: 75,
    bottom: 15,
    marginTop: 90,
},
  boxText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
  },
  backIcon: {
    right: 350,
    bottom: 830,
    position: 'absolute',
    tintColor: 'white',
  },
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  scanControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
    fontWeight: '600',
  },
  deviceItem: {
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  deviceName: {
    color: 'white',
    fontSize: 16,
  },
  deviceId: {
    color: '#aaa',
    fontSize: 12,
  },
  connectionInfo: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  connectedText: {
    color: 'white',
    fontSize: 16,
  },
});
