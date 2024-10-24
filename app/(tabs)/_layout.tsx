import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index" // Movie Search Screen
        options={{ title: 'Search Movies' }}
      />
      <Tabs.Screen
        name="[movie]" // Movie Details Screen
        options={{ title: 'Movie Details' }}
      />
      <Tabs.Screen
        name="searchHistory" // Search History Screen
        options={{ title: 'Search History' }}
      />
    </Tabs>
  );
}
