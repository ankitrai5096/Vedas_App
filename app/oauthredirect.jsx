import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import Loading from '../components/Loading';

const OAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/home');
    }, 3000);

    return () => clearTimeout(timeout); 
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
     <Loading  size = 'large' color = '#FF671F'/>
    </View>
  );
};

export default OAuthRedirect;
