import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import axios from 'axios';
import dayjs from 'dayjs';
import {useNavigation} from '@react-navigation/native';
import AuthContext from '../../context/AuthContext';

const AddEventScreen = ({route}) => {
  const {longitude, latitude} = route.params;
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();
  const [datePickerShow, setDatePickerShow] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startDate: new Date(),
    latitude: latitude,
    longitude: longitude,
    description: '',
  });

  const onPressDateInput = e => {
    e.preventDefault();
    setDatePickerShow(true);
  };

  const handleCreate = () => {
    axios
      .post('http://10.0.2.2:8000/event/new', formData, {
        headers: {id: authContext.user.userId},
      })
      .then(res => {
        if (res) {
          navigation.navigate('home');
        }
      })
      .catch(err => alert(err));
  };

  return (
    <View style={styles.container}>
      <Text style={{textAlign: 'left'}}>Etkinlik Adı</Text>
      <TextInput
        style={styles.input}
        placeholder="Etkinlik Adı"
        onChange={e => setFormData({...formData, name: e.nativeEvent.text})}
        value={formData.name}
      />
      <Text style={{textAlign: 'left'}}>Etkinlik Tarihi</Text>
      <TextInput
        style={styles.input}
        placeholder="Etkinlik Saati"
        onPressIn={onPressDateInput}
        value={dayjs(formData.startDate).format('DD/MM/YYYY - HH:mm')}
      />
      <DatePicker
        date={new Date(formData.startDate)}
        modal
        open={datePickerShow}
        onConfirm={date => {
          setDatePickerShow(false);
          setFormData({...formData, startDate: date.toISOString()});
        }}
        onCancel={() => {
          setDatePickerShow(false);
        }}
      />
      <TextInput
        style={styles.textArea}
        placeholder="Etkinlik Açıklaması"
        multiline
        numberOfLines={3}
        onChange={e =>
          setFormData({...formData, description: e.nativeEvent.text})
        }
        value={formData.description}
      />
      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>Etkinlik Oluştur</Text>
      </TouchableOpacity>
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
  createButton: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'red',
    borderRadius: 10,
  },
  createButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
  },
});

export default AddEventScreen;
