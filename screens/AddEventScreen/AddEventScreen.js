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

const AddEventScreen = () => {
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();
  const [datePickerShow, setDatePickerShow] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startDate: new Date(),
    latitude: 0,
    longitude: 0,
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
      <TextInput
        style={styles.input}
        placeholder="Etkinlik Adı"
        onChange={e => setFormData({...formData, name: e.nativeEvent.text})}
        value={formData.name}
      />
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
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, styles.rowInput]}
          placeholder="Boylam"
          keyboardType="numeric"
          onChange={e =>
            setFormData({
              ...formData,
              longitude: parseFloat(e.nativeEvent.text),
            })
          }
          value={formData.longitude}
        />
        <TextInput
          style={[styles.input, styles.rowInput]}
          placeholder="Enlem"
          keyboardType="numeric"
          type="number"
          onChange={e =>
            setFormData({...formData, latitude: parseFloat(e.nativeEvent.text)})
          }
          value={formData.latitude}
        />
      </View>
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
    alignItems: 'center',
    padding: 10,
  },
  input: {
    width: '100%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  inputRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  rowInput: {
    flex: 1,
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
