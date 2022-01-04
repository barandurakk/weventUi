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

const RegisterScreen = () => {
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
  });

  const handleRegister = () => {
    axios
      .post('http://10.0.2.2:8000/register', formData)
      .then(res => {
        alert('Başarıyla kayıt olundu!');
        navigation.navigate('login');
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
        placeholder="Ad"
        onChange={e =>
          setFormData({...formData, firstname: e.nativeEvent.text})
        }
        value={formData.firstname}
      />
      <TextInput
        style={styles.input}
        placeholder="Soyad"
        onChange={e => setFormData({...formData, lastname: e.nativeEvent.text})}
        value={formData.lastname}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        onChange={e => setFormData({...formData, password: e.nativeEvent.text})}
        value={formData.password}
      />
      <TouchableOpacity style={styles.createButton} onPress={handleRegister}>
        <Text style={styles.createButtonText}>Üye Ol</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('login')}>
        <Text>Giriş Yap</Text>
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
  registerButton: {
    margin: 10,
  },
});

export default RegisterScreen;
