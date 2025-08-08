import { FontAwesome, Foundation } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet } from 'react-native';
import Card from '@/components/card';

const socialMedia = [
  {
    icon: <FontAwesome name="facebook" size={24} color="#000000" />,
    link: "https://www.facebook.com"
  },
  {
    icon: <FontAwesome name="twitter" size={24} color="#000000" />,
    link: "https://www.twitter.com" 
  },
  {
    icon: <Foundation name="web" size={24} color="#000000" />,
    link: "https://www.gonet.com"
  },
  {
    icon: <FontAwesome name="instagram" size={24} color="#000000" />,
    link: "https://www.instagram.com"
  },
  {
    icon: <FontAwesome name="linkedin" size={24} color="#000000" />,
    link: "https://www.linkedin.com"
  },
];

export default function Footer () {
    return (
        <View style={styles.footer}>
              <LinearGradient
                colors={['#00543b', '#00d280', '#006a54']}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              >
                <View style={styles.iconsContainer}>
                  {
                    socialMedia.map((item, index) => (
                      <Card key={index} style={{ width: 45, height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                        {
                          item.icon
                        }
                      </Card>
                    ))
                  }
                </View>
                <View>
                  <Text style={{ color: '#fff', fontSize: 10, marginTop: 25 }}>Ver 2.00.00.01</Text>
                </View>
              </LinearGradient>
            </View>
    )
}

const styles = StyleSheet.create({
   footer: {
    width: '100%',
    height: 150,
  },
  iconsContainer: {
    width: '80%',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
    gradient: {
    flex: 1,
    width: '100%',
      display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
})