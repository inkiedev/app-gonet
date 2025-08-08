import Footer from '@/components/home/footer';
import { Slot } from 'expo-router';

export default function HomeLayout() {
  return (
    <>
      <Slot  />
      <Footer />
    </>
  );
}