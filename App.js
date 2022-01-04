/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
<script src="http://localhost:8097"></script>;
import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import AddEventScreen from './screens/AddEventScreen/AddEventScreen';
import AuthContextProvider from './context/AuthContextProvider';
import AuthContext from './context/AuthContext';
import LoginScreen from './screens/LoginScreen/LoginScreen';

import {Text, View} from 'react-native';
const Stack = createNativeStackNavigator();

const App = () => {
  const user = useContext(AuthContext);
  console.log(user);
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <AuthContext.Consumer>
          {context =>
            context.userLoading ? (
              <View>
                <Text>Loading...</Text>
              </View>
            ) : context.isAuth ? (
              <Stack.Navigator screenOptions={{headerShadowVisible: false}}>
                <Stack.Screen
                  name="home"
                  component={HomeScreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="AddNavigation"
                  component={AddEventScreen}
                  options={{title: 'Etkinlik Oluştur'}}
                />
              </Stack.Navigator>
            ) : (
              <Stack.Navigator screenOptions={{headerShadowVisible: false}}>
                <Stack.Screen
                  name="login"
                  component={LoginScreen}
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack.Navigator>
            )
          }
        </AuthContext.Consumer>
      </NavigationContainer>
    </AuthContextProvider>
  );
};

export default App;
