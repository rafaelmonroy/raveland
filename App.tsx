import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Platform, Image } from 'react-native';
import MapView, { Marker, Overlay, Region } from 'react-native-maps';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { PERMISSIONS, request } from 'react-native-permissions';
import { gyroscope } from 'react-native-sensors';

const { width, height } = Dimensions.get('window');
const arrowImage = require('./src/images/arrow.png');

interface Location {
  latitude: number;
  longitude: number;
}

function App(): JSX.Element {
  const [initialLocation, setInitialLocation] = useState<Location>({ latitude: 0, longitude: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [gyroscopeSubscription, setGyroscopeSubscription] = useState<any>(null);

  useEffect(() => {
    requestLocationPermission();
    startGyroscopeUpdates();
    return () => {
      stopGyroscopeUpdates();
    };
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      try {
        const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (result === 'granted') {
          getCurrentLocation();
        }
      } catch (error) {
        console.warn('Location permission error:', error);
      }
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position: GeoPosition) => {
        const { latitude, longitude } = position.coords;
        setInitialLocation({ latitude, longitude });
      },
      (error) => {
        console.warn('Error getting current location:', error);
      }
    );
  };

  const startGyroscopeUpdates = () => {
    const gyroscopeObservable = gyroscope.subscribe(({ x, y }) => {
      const newRotation = Math.atan2(y, x) * (180 / Math.PI);
      setRotation(newRotation);
    });
    setGyroscopeSubscription(gyroscopeObservable);
  };

  const stopGyroscopeUpdates = () => {
    if (gyroscopeSubscription) {
      gyroscopeSubscription.unsubscribe();
      setGyroscopeSubscription(null);
    }
  };

  const initialRegion: Region = {
    latitude: 36.272100,
    longitude: -115.011000,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation
        followsUserLocation
        userLocationPriority="high"
        mapType='mutedStandard'
        showsMyLocationButton
        userLocationCalloutEnabled
        userInterfaceStyle='dark'
        initialRegion={initialRegion}
      >
        <Overlay
          image={require('./src/images/edc_map.png')}
          bounds={[
            [36.267946, -115.016941],
            [36.277146, -115.004826],
          ]}
        />
        <Marker coordinate={initialLocation} anchor={{ x: 0.5, y: 0.5 }} rotation={rotation}>
          <Image source={arrowImage} style={[styles.arrowImage, { transform: [{ rotate: `${rotation}deg` }] }]} />
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: height,
    width: width,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  arrowImage: {
    width: 32,
    height: 32,
  }
});

export default App;
