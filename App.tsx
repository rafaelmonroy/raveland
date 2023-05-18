import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import MapView, { Overlay } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, request } from 'react-native-permissions';

const { width, height } = Dimensions.get('window');

function App(): JSX.Element {
  const [initialLocation, setInitialLocation] = useState({ latitude: 0, longitude: 0 });

  useEffect(() => {
    requestLocationPermission();
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
      position => {
        const { latitude, longitude } = position.coords;
        setInitialLocation({ latitude, longitude });
      },
      error => {
        console.warn('Error getting current location:', error);
      }
    );
  };

  return (
    <View style={styles.container}>

      <MapView
        style={styles.map}
        showsUserLocation
        userLocationPriority="high"
        mapType='mutedStandard'
        showsMyLocationButton
        userLocationCalloutEnabled
        userInterfaceStyle='dark'
        region={{
          latitude: 36.272100,
          longitude: -115.011000,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
        <Overlay
          image={require('./src/images/edc_map.png')}
          bounds={[
            [36.267946, -115.016941],
            [36.277146, -115.004826],
          ]}
        />
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
});

export default App;