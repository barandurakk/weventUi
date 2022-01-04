import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from './AuthContext';

const AuthContextProvider = props => {
  const [user, setUser] = useState({
    userId: '',
    firstname: '',
    lastname: '',
    email: '',
    age: null,
  });
  const [isAuth, setIsAuth] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    getUserId();
  }, [user.userId]);

  const setUserId = id => {
    setUser({...user, userId: id});
  };

  const getUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log(userId);
      if (userId !== null) {
        setIsAuth(true);
        setUserId(userId);
        setUserLoading(false);
      } else {
        setIsAuth(false);
        setUserLoading(false);
      }
    } catch (e) {
      setIsAuth(false);
      setUserLoading(false);
    }
  };

  const setUserDetails = user => {
    setUser({
      ...user,
      firstname: user.firstname,
      lastname: user.lastname,
      age: user.age,
      email: user.email,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userLoading: userLoading,
        isAuth: isAuth,
        setUserId: setUserId,
        setUserDetails: setUserDetails,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
