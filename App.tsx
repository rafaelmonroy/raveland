import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import MapView from 'react-native-maps';
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
      {initialLocation && (
        <MapView
          style={styles.map}
          showsUserLocation={true}
          userLocationPriority="high"
          showsMyLocationButton={true}
          userLocationCalloutEnabled={true}
          followsUserLocation={true}
          region={{
            latitude: initialLocation.latitude,
            longitude: initialLocation.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        />
      )}
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
