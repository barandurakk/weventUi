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
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AuthContext from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Map from '../../components/Map';

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
  const [filteredEventList, setFilteredEventList] = useState([]);
  const [viewMode, setViewMode] = useState('map');
  const [detailState, setDetailState] = useState({show: false, eventId: ''});
  const [addEventState, setAddEventState] = useState({
    show: false,
    longitude: null,
    latitude: null,
  });
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    if ((isGranted, authContext.user.userId)) {
      axios
        .get('http://10.0.2.2:8000/events', {
          headers: {id: authContext.user.userId},
        })
        .then(res => {
          console.log('fetching!', res.data);
          setEventList([...res.data]);
        })
        .catch(err => console.log(err));
    }
  }, [isGranted, authContext.user.userId]);

  useFocusEffect(
    React.useCallback(() => {
      if ((isGranted, authContext.user.userId)) {
        axios
          .get('http://10.0.2.2:8000/events', {
            headers: {id: authContext.user.userId},
          })
          .then(res => {
            console.log('fetching!', res.data);
            setEventList([...res.data]);
          })
          .catch(err => console.log(err));
      }
    }, [isGranted, authContext.user.userId]),
  );

  useEffect(() => {
    if (eventList && eventList.length !== 0) {
      setFilteredEventList(
        eventList.filter(
          event =>
            distance(
              event.latitude,
              event.longitude,
              position.latitude,
              position.longitude,
            ) <= range,
        ),
      );
    }
  }, [eventList, range, position]);

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

  const handleAddMarker = e => {
    let coordinates = e.nativeEvent.coordinate;
    setDetailState({show: false, eventId: ''});
    setAddEventState({
      show: true,
      longitude: coordinates.longitude,
      latitude: coordinates.latitude,
    });
  };

  const handleDetail = eventId => {
    setAddEventState({
      show: false,
      longitude: null,
      latitude: null,
    });
    setDetailState({show: true, eventId});
  };

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
    return (
      <>
        {filteredEventList.length === 0 ? (
          <Text>
            Yakınlarınızda bir etkinlik bulunanmamıştır. Yukarıdan uzaklığı
            değiştirip tekrar deneyebilirsiniz.
          </Text>
        ) : (
          <ScrollView style={styles.listContainer}>
            {filteredEventList.map((event, i) => (
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

  const renderMap = () => (
    <Map
      currentLat={position.latitude}
      currentLong={position.longitude}
      events={filteredEventList}
      onSelectPosition={handleAddMarker}
      selectedMarker={addEventState}
      onSelectEvent={handleDetail}
      onClickOutside={() => {
        setDetailState({show: false, eventId: ''});
        setAddEventState({
          show: false,
          longitude: null,
          latitude: null,
        });
      }}
      // onSelectEvent={eventId => navigation.navigate('eventDetail', {eventId})}
    />
  );

  return (
    <>
      {viewMode === 'list' ? renderList() : renderMap()}
      {addEventState.show && (
        <>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              navigation.navigate('AddNavigation', {
                latitude: addEventState.latitude,
                longitude: addEventState.longitude,
              })
            }>
            <Text style={styles.addButtonText}>
              Seçilen konuma etkinlik ekle
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() =>
              setAddEventState({show: false, longitude: null, latitude: null})
            }>
            <Text style={styles.addButtonText}>İptal</Text>
          </TouchableOpacity>
        </>
      )}
      {detailState.show && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate('eventDetail', {eventId: detailState.eventId})
          }>
          <Text style={styles.addButtonText}>Detay görüntüle</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}> {`Çık`}</Text>
      </TouchableOpacity>
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
        <TouchableOpacity
          style={[
            styles.rangeButtons,
            range === 250 ? styles.selectedRangeButton : '',
          ]}
          onPress={() => setRange(250)}>
          <Text
            style={[
              styles.rangeTexts,
              range === 250 ? styles.selectedRangeButtonText : '',
            ]}>
            250km
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: 'red',
    elevation: 3,
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
    position: 'absolute',
    top: 40,
    elevation: 3,
    left: 0,
  },
  rangeButtons: {
    marginLeft: 5,
    marginRight: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'red',
    borderRadius: 5,
    shadowRadius: 10,
    elevation: 2,
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
    right: 100,
    height: 60,
    paddingHorizontal: 10,
    width: 'auto',
    borderRadius: 50,
    backgroundColor: 'red',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 60,
    paddingHorizontal: 10,
    width: 60,
    borderRadius: 50,
    backgroundColor: 'black',
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
    fontSize: 16,
  },
  logoutText: {
    color: '#fff',
    fontSize: 12,
  },
  switchText: {
    color: '#fff',
  },
  listContainer: {
    height: 'auto',
    marginTop: 90,
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
