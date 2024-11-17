import { Text, View } from "react-native";
import Login from '../components/Login'
import { auth } from './../Configs/FirebaseConfig'
import { Redirect } from "expo-router";
import { useEffect } from "react";
export default function Index() {


  useEffect(() => {
    const timer = setTimeout(() => {
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const user = auth.currentUser;
  return (

    <View>

      {user ?
        <Redirect href={'/home'} /> :
        <Login />
      }

    </View>
  );
}
