/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
<script src="http://localhost:8097"></script>;
import React, {useEffect, useState, useContext} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Switch,
} from 'react-native';
import axios from 'axios';
import dayjs from 'dayjs';
import {useNavigation} from '@react-navigation/native';
import AuthContext from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Example App',
        message: 'Example App access to your location ',
      },
    );
    return granted;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

const HomeScreen = () => {
  const authContext = useContext(AuthContext);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const [isGranted, setIsGranted] = useState(false);
  const [range, setRange] = useState(0.5);
  const [eventList, setEventList] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    if (isGranted) {
      axios
        .get('http://10.0.2.2:8000/events', {
          headers: {id: authContext.user.userId},
        })
        .then(res => {
          setEventList([...res.data]);
        })
        .catch(err => console.log(err));
    }
  }, [range, position]);

  useEffect(() => {
    requestLocationPermission().then(granted => {
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        setIsGranted(true);
        getPosition();
      } else {
        console.log('location permission denied');
        setIsGranted(false);
      }
    });
  }, []);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      pos => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      err => console.log(err),
      {enableHighAccuracy: true},
    );
    return () => Geolocation.clearWatch(watchId);
  }, []);

  const distance = (lat1, lon1, lat2, lon2) => {
    var p = 0.017453292519943295; // Math.PI / 180
    var c = Math.cos;
    var a =
      0.5 -
      c((lat2 - lat1) * p) / 2 +
      (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  };

  const handleLogout = () => {
    AsyncStorage.removeItem('userId').then(res => {
      authContext.setUserId('');
    });
  };

  const getPosition = () => {
    Geolocation.getCurrentPosition(
      pos => {
        setError('');
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      e => setError(e.message),
      {enableHighAccuracy: true},
    );
  };

  const renderList = () => {
    const filteredList = eventList.filter(
      event =>
        distance(
          event.latitude,
          event.longitude,
          position.latitude,
          position.longitude,
        ) <= range,
    );

    return (
      <>
        {filteredList.length === 0 ? (
          <Text>
            Yakınlarınızda bir etkinlik bulunanmamıştır. Yukarıdan uzaklığı
            değiştirip tekrar deneyebilirsiniz.
          </Text>
        ) : (
          <ScrollView style={styles.listContainer}>
            {filteredList.map((event, i) => (
              <TouchableOpacity key={event.id} style={styles.listItem}>
                <View>
                  <Text style={styles.eventName}>{event.name}</Text>
                  <Text style={styles.eventTime}>
                    {dayjs(event.startdate).format('DD/MM/YYYY - HH:mm')}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Harita Görünümü</Text>
          <Switch
            trackColor={{false: '#fff', true: '#fff'}}
            thumbColor={viewMode === 'list' ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() =>
              setViewMode(prev => (prev === 'list' ? 'map' : 'list'))
            }
            value={viewMode === 'list' ? true : false}
          />
          <Text style={styles.switchText}>Liste Görünümü</Text>
        </View>
        <View style={styles.rangeContainer}>
          <TouchableOpacity
            style={[
              styles.rangeButtons,
              range === 0.5 ? styles.selectedRangeButton : '',
            ]}
            onPress={() => setRange(0.5)}>
            <Text
              style={[
                styles.rangeTexts,
                range === 0.5 ? styles.selectedRangeButtonText : '',
              ]}>
              500m
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.rangeButtons,
              range === 5 ? styles.selectedRangeButton : '',
            ]}
            onPress={() => setRange(5)}>
            <Text
              style={[
                styles.rangeTexts,
                range === 5 ? styles.selectedRangeButtonText : '',
              ]}>
              5km
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.rangeButtons,
              range === 25 ? styles.selectedRangeButton : '',
            ]}
            onPress={() => setRange(25)}>
            <Text
              style={[
                styles.rangeTexts,
                range === 25 ? styles.selectedRangeButtonText : '',
              ]}>
              25km
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.rangeButtons,
              range === 100 ? styles.selectedRangeButton : '',
            ]}
            onPress={() => setRange(100)}>
            <Text
              style={[
                styles.rangeTexts,
                range === 100 ? styles.selectedRangeButtonText : '',
              ]}>
              100km
            </Text>
          </TouchableOpacity>
        </View>
        {viewMode === 'list' ? renderList() : <Text>Map</Text>}
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddNavigation')}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}> {`Çık`}</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: '100%',
    // marginTop: 50,
  },
  switchContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: 'red',
  },
  rangeContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 5,
    paddingTop: 5,
    width: '100%',
    backgroundColor: 'gray',
  },
  rangeButtons: {
    marginLeft: 10,
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'red',
    borderRadius: 5,
    shadowRadius: 10,
  },
  selectedRangeButton: {
    backgroundColor: 'white',
  },
  selectedRangeButtonText: {
    color: 'red',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 60,
    width: 60,
    borderRadius: 50,
    backgroundColor: 'red',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    height: 40,
    width: 40,
    borderRadius: 50,
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rangeTexts: {
    color: '#fff',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  logoutText: {
    color: '#fff',
    fontSize: 12,
  },
  switchText: {
    color: '#fff',
  },
  listContainer: {
    height: '100%',
  },
  listItem: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

export default HomeScreen;
