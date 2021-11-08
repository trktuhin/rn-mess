import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import * as signalR from '@aspnet/signalr';

import AuthNavigator from './app/navigation/AuthNavigator';
import AppNavigator from './app/navigation/AppNavigator';
import authStorage from './app/auth/storage';
import AuthContext from './app/auth/context';
import globalVariables from './app/globalVariables';

export default function App() {
  const [user, setUser] = useState();
  const [token, setToken] = useState(null);
  const [isReady, setIsReady] = useState(false);

  let connectionHub;

  const restoreUser = async () => {
    const user = await authStorage.getUser();
    if (user) {
      setUser(user);
    };
  }

  const startHubConnection = (username) => {
    connectionHub = new signalR.HubConnectionBuilder()
      .withUrl(globalVariables.BASE_URL + 'tokenUpdate?username=' + username)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionHub.on('ReceiveToken', data => {
      console.log("hello new token");
      authStorage.storeToken(data.token);
      setToken(data.token);
    });

    connectionHub.on('ReceiveRequest', data => {
      console.log("New Request", data);
    });

    connectionHub.start()
      .catch(err => {
        this.logError(err);
      });

    connectionHub.onclose((err) => {
      console.log("Disconnection error", err);
      tryStartConnectionAgain();
    });
  }

  const tryStartConnectionAgain = () => {
    let reconnectInterval;
    if (user && connectionHub.connection.connectionState == 2) { // 2 = disconnected; 0 = connceted
      reconnectInterval = setInterval(() => {
        console.log("Trying to reconnect");

        connectionHub.start().then(() => {
          clearInterval(reconnectInterval);
        })
          .catch(err => { });
      }, 30000);
    }
  }

  useEffect(() => {
    if (user) {
      authStorage.getDecodedToken().then(decodedToken => startHubConnection(decodedToken.nameid))
        .catch(err => console.log(err));

    }
  }, [user]);

  if (!isReady) return <AppLoading startAsync={restoreUser} onFinish={() => setIsReady(true)} onError={() => console.log("error")} />

  return (
    <AuthContext.Provider value={{ user, setUser, token }}>
      <NavigationContainer>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

