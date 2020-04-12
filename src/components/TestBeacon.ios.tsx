import React, { useEffect, useState } from 'react';
import BLEAdvertiser from 'react-native-ble-advertiser'
import { NativeEventEmitter, NativeModules, Text } from 'react-native';
const eventEmitter = new NativeEventEmitter(NativeModules.BLEAdvertiser);

export const TestBeacon: React.FC = () => {

    const [successScan, setSuccessScan] = useState('unknown');
    const [successBroad, setSuccessBroad] = useState('unknown');
    const [devices, setDevices] = useState<any[]>([]);

    useEffect(() => {
        // eventEmitter.addListener('onBTStatusChange', (enabled: true) => {
        //     console.log("iOS, Bluetooth status: ", enabled);
        // });

        BLEAdvertiser.setCompanyId(0xFFFF);
        BLEAdvertiser.broadcast('00420000-0000-0000-0000-000000000000', [12, 23, 56]) // The UUID you would like to advertise and additional manufacturer data. 
            .then(success => {
                setSuccessBroad(success);
                console.log('iOS, Broadcasting Sucessful', success);
            })
            .catch(error => console.log('iOS, Broadcasting Error', error));
        BLEAdvertiser.scan([12, 23, 56], {})
            .then(success => {
                setSuccessScan(success);
                eventEmitter.addListener('onDeviceFound', (event) => {
                    console.log(event) // "device data"
                    setDevices([...devices, event]);
                });
                console.log('iOS, Scan Sucessful', success);
            })
            .catch(error => console.log('iOS, Scan Error', error));

        return () => {
            eventEmitter.removeAllListeners('onDeviceFound');
            BLEAdvertiser.stopScan()
                .then(success => console.log("iOS, Stop Scan Successful", success))
                .catch(error => console.log("iOS, Stop Scan Error", error));
            BLEAdvertiser.stopBroadcast()
                .then(success => console.log("iOS, Stop Broadcast Successful", success))
                .catch(error => console.log("iOS, Stop Broadcast Error", error));
        }
    }, [])

    return (
        <>
            <Text>Scanning {successScan}</Text>
            <Text>Broadcasting {successBroad}</Text>
            <Text>Devices ({devices.length}) {devices}</Text>
        </>
    )
}