import { useRouter } from 'expo-router';
import { Button, View } from 'react-native';

export default function IndexScreen() {
  const navigation = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View>
        {
          <Button title="Login" onPress={() => navigation.push('/login')} />
        }
        {
          <Button title="Home" onPress={() => navigation.push('/home')} />
        }
       {
        <Button title = "agencias" onPress={() => navigation.push('/home/agencias')} />
       }

      </View>      
    </View>
  );
}
