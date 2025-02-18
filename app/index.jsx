import { Text, View, ActivityIndicator } from "react-native";
import Login from "../components/Login";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../utils/redux/authActions";
import { auth } from "../Configs/FirebaseConfig";
import { Colors } from "@/constants/Colors";

export default function Index() {
  const currentUser = useSelector((state) => state.auth.user);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("User is signed in through on auth change:", user);
        setUserDetails(user);
        dispatch(setUser(user));
      } else {
        dispatch(setUser(null));
        setUserDetails(null);
      }
      setLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.Primary || "#FF671F"} />
      </View>
    );
  }

  return <View>{userDetails ? <Redirect href={"/home"} /> : <Login />}</View>;
}
