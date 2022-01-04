import React, {useContext, useState, useEffect} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import axios from 'axios';
import dayjs from 'dayjs';
import AuthContext from '../../context/AuthContext';

const EventDetailScreen = ({route}) => {
  const {eventId} = route.params;
  const authContext = useContext(AuthContext);
  const [event, setEvent] = useState({
    name: '',
    startDate: '',
    description: '',
    ownerFirstname: '',
    ownerLastname: '',
  });

  useEffect(() => {
    console.log(eventId);
    if (eventId) {
      axios
        .get(`http://10.0.2.2:8000/event/${eventId}`, {
          headers: {id: authContext.user.userId},
        })
        .then(res => {
          if (res.data) {
            console.log(res.data);
            setEvent({
              ...res.data,
              ownerFirstname: res.data.firstname,
              ownerLastname: res.data.lastname,
            });
          }
        })
        .catch(err => alert(err));
    }
  }, [eventId]);

  return (
    <View style={styles.container}>
      <Text style={{textAlign: 'left'}}>Etkinlik Adı</Text>
      <TextInput
        style={styles.input}
        placeholder="Etkinlik Adı"
        value={event.name}
      />
      <Text style={{textAlign: 'left'}}>Etkinlik Sahibi</Text>
      <TextInput
        style={styles.input}
        placeholder="Etkinlik Adı"
        value={`${event.ownerFirstname} ${event.ownerLastname}`}
      />
      <Text style={{textAlign: 'left'}}>Etkinlik Tarihi</Text>
      <TextInput
        style={styles.input}
        placeholder="Etkinlik Saati"
        value={dayjs(event.startDate).format('DD/MM/YYYY - HH:mm')}
      />
      <Text style={{textAlign: 'left'}}>Etkinlik Açıklaması</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Etkinlik Açıklaması"
        multiline
        numberOfLines={3}
        value={event.description}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: '100%',
    padding: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  textArea: {
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default EventDetailScreen;
