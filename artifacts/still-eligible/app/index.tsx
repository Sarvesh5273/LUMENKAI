import { Redirect } from 'expo-router';
import { useStore } from '@/lib/store';
import { View, ActivityIndicator } from 'react-native';

export default function IndexScreen() {
  const { isProfileLoaded, profile } = useStore();

  if (!isProfileLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Any saved profile counts as onboarded; every field is optional.
  if (profile) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/onboarding" />;
}
