import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

type RootStackParamList = {
  'login': undefined;
  'home': undefined;
};

export default function IndexScreen() {
  const navigation = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View>
          {
            <Button onPress={() => navigation.push('/login')}>
              <Text>Login</Text>
            </Button>
          }

          {
            <Button onPress={() => navigation.push('/home')}>
              <Text>Home</Text>
            </Button>
          }
      </View>      
    </View>
  );
}
