import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index" 
        options={{ title: 'Search Movies' }}
      />
      <Tabs.Screen
        name="[movie]" 
        options={{ title: 'Movie Details' }}
      />
      <Tabs.Screen
        name="searchHistory" 
        options={{ title: 'Search History' }}
      />
    </Tabs>
  );
}
