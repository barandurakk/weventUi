import React, {useState} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import {View, StyleSheet, Text, TouchableHighlight} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import dayjs from 'dayjs';

const Map = ({
  currentLat,
  currentLong,
  events,
  onSelectPosition,
  onSelectEvent,
  selectedMarker,
  onClickOutside,
}) => {
  const handleClick = e => {
    onSelectEvent(e.nativeEvent.id);
  };

  return (
    <MapView
      loadingEnabled={true}
      loadingIndicatorColor="#666666"
      loadingBackgroundColor="#eeeeee"
      showsUserLocation={true}
      rotateEnabled={false}
      scrollDuringRotateOrZoomEnabled={false}
      showsMyLocationButton
      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
      style={styles.map}
      onLongPress={onSelectPosition}
      onPress={onClickOutside}
      onMarkerPress={handleClick}
      initialRegion={{
        latitude: currentLat,
        longitude: currentLong,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }}>
      {events.map(event => (
        <Marker
          key={event.id}
          identifier={event.id}
          style={styles.markers}
          stopPropagation={true}
          coordinate={{
            latitude: parseFloat(event.latitude),
            longitude: parseFloat(event.longitude),
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          description={
            event.startdate
              ? dayjs(event.startdate).format('DD/MM/YYYY - HH:mm')
              : ''
          }
          title={event.name}
        />
      ))}
      {selectedMarker.latitude && selectedMarker.longitude && (
        <Marker
          key={0}
          style={styles.markers}
          stopPropagation
          coordinate={{
            latitude: parseFloat(selectedMarker.latitude),
            longitude: parseFloat(selectedMarker.longitude),
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          pinColor="#21516a"
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // ...StyleSheet.absoluteFillObject,
  },
  markers: {
    elevation: 2,
    zIndex: 999,
  },
  customView: {
    elevation: 2,
    zIndex: 999,
  },
  callout: {
    backgroundColor: 'white',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  title: {
    color: 'black',
    fontSize: 14,
    lineHeight: 18,
    flex: 1,
  },
  description: {
    color: '#707070',
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
});

export default Map;
