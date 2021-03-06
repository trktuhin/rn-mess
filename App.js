import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import * as signalR from '@aspnet/signalr';

import AuthNavigator from './app/navigation/AuthNavigator';
import AppNavigator from './app/navigation/AppNavigator';
import authStorage from './app/auth/storage';
import AuthContext from './app/auth/context';
import globalVariables from './app/globalVariables';
import { useNetInfo } from '@react-native-community/netinfo';
import OfflineNotice from './app/components/OfflineNotice';

export default function App() {
  const [user, setUser] = useState();
  const [token, setToken] = useState(null);
  const [recievedRequest, setRecievedRequest] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const netInfo = useNetInfo();


  let connectionHub;

  const restoreUser = async () => {
    const user = await authStorage.getUser();
    if (user) {
      setUser(user);
    };
  }

  const startHubConnection = (username) => {
    connectionHub = new signalR.HubConnectionBuilder()
      .withUrl(globalVariables.BASE_URL + 'tokenUpdate?username=' + username, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionHub.on('ReceiveToken', data => {
      authStorage.detectCorrectToken(data.token).then(value => {
        if (value == true) {
          authStorage.storeToken(data.token);
          setToken(data.token);
        }
      }).catch(err => console.log(err));
    });

    connectionHub.on('ReceiveRequest', data => {
      // console.log("new quest rec");
      setRecievedRequest(true);
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
        //console.log("Trying to reconnect");

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

    } else {
      //console.log("Connection disconnect For log out");
      connectionHub = null;
    }
  }, [user]);

  if (!isReady) return <AppLoading startAsync={restoreUser} onFinish={() => setIsReady(true)} onError={() => console.log("error")} />

  if (netInfo.type !== "unknown" && netInfo.isInternetReachable === false)
    return <OfflineNotice />

  return (
    <AuthContext.Provider value={{ user, setUser, token, recievedRequest, setRecievedRequest }}>
      <NavigationContainer>
        {user?.isMobileVerified ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

