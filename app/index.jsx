import { Text, View } from "react-native";
import Login from '../components/Login'
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../utils/redux/authActions';
import {auth} from '../Configs/FirebaseConfig'
export default function Index() {

  const currentUser = useSelector((state) => state.auth.user);

  const [userDetails, setUserDetails] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
    }, 2500);

    return () => clearTimeout(timer);
  }, []);


  // Check if the user is signed in on app load
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        // console.log('User is signed in:', user);
        setUserDetails(user);
        dispatch(setUser(user))
        
      } else {
        dispatch(setUser(null))
        setUserDetails(null)
        // console.log('No user is signed in.');
      }
    });
  
    return () => unsubscribe();
  }, []);





  
  return (

    <View>

      {userDetails ?
        <Redirect href={'/home'} /> :
        <Login />
      }


    </View>
  );
}
