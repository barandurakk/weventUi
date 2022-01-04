import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import AuthContext from '../../context/AuthContext';

const LoginScreen = () => {
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();
  const [datePickerShow, setDatePickerShow] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = () => {
    axios
      .post('http://10.0.2.2:8000/login', formData)
      .then(res => {
        if (res) {
          console.log(res.data);
          AsyncStorage.setItem('userId', res.data.id)
            .then(success => {
              authContext.setUserId(res.data.id);
            })
            .catch(error => {
              alert(error);
            });
        }
      })
      .catch(err => alert(err));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        onChange={e => setFormData({...formData, email: e.nativeEvent.text})}
        value={formData.email}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        onChange={e => setFormData({...formData, password: e.nativeEvent.text})}
        value={formData.password}
      />
      <TouchableOpacity style={styles.createButton} onPress={handleLogin}>
        <Text style={styles.createButtonText}>Giriş Yap</Text>
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

export default LoginScreen;
