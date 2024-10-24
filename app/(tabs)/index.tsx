import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MovieSearchScreen() {
  const [query, setQuery] = useState('');
  const [ isLoading ,setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    Poster: string; imdbID: string; Title: string; Year: string 
}[]>([]);
  const router = useRouter();

  const saveQueryHistory = async (query: string) => {
      try {
        const date = new Date().toLocaleString();
        const newHistoryItem = { query, date };
        const history = await AsyncStorage.getItem('searchHistory');
        const parsedHistory = history ? JSON.parse(history) : [];
        parsedHistory.push(newHistoryItem);
        await AsyncStorage.setItem('searchHistory', JSON.stringify(parsedHistory));
      } catch (error) {
        console.error('Error saving search history:', error);
      }
    };

  const fetchMovies = async (searchText: string) => {
    if (searchText.length < 3) {
      setSearchResults([]);
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await fetch(`http://www.omdbapi.com/?s=${searchText}&apikey=1980bee`);
      const data = await response.json();
      const movies = data.Search || [];
  
      // Save each searched movie to history
      movies.forEach((movie: { Title: string; imdbID: string }) => {
        saveSearchHistory(movie);
      });
  
      setSearchResults(movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectMovie = (movie: { imdbID: string; Title: string; Year: string }) => {
    saveSearchHistory(movie); // Save clicked movie
    router.push(`/${movie.imdbID}`);
  };
  
  // Your saveSearchHistory function as defined earlier
  const saveSearchHistory = async (movie: { Title: string; imdbID: string }) => {
    const newEntry = {
      query: movie.Title,
      id: movie.imdbID,
      date: new Date().toLocaleString(),
    };
  
    try {
      const existingHistory = await AsyncStorage.getItem('searchHistory');
      const historyArray = existingHistory ? JSON.parse(existingHistory) : [];
  
      // Avoid duplicates
      const isDuplicate = historyArray.some((item: { id: string; }) => item.id === movie.imdbID);
      if (!isDuplicate) {
        historyArray.push(newEntry);
        await AsyncStorage.setItem('searchHistory', JSON.stringify(historyArray));
      }
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search for movies..."
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          fetchMovies(text);
        }}
        style={styles.searchInput}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#6366F1" style={styles.loader} />
      ) : (
      <FlatList
        data={searchResults}
        keyExtractor={(item: { imdbID: string }) => item.imdbID}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectMovie(item)} style={styles.movieItem}>
          <Image
            source={{ uri: item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/90x100' }}
            style={styles.poster}
          />
          <View style={styles.movieInfo}>
            <Text style={styles.title} numberOfLines={2}>{item.Title}</Text>
            <Text style={styles.year}>{item.Year}</Text>
          </View>
        </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <ImageBackground
              source={{ uri: './assets/images/bg3.png' }} // Replace with your desired image URL
              style={styles.emptyBackground}
              resizeMode="cover"
            >
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}></Text>
          </View>
          </ImageBackground>
        )}
        style={{ marginTop: 20 }}
      />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  movieItem: {
    padding: 5,
    fontSize: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  movieInfo: {
    flex: 1,
    paddingLeft: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  emptyBackground: {
    width: '100%',
    height: 800, 
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: 20,
  },
  year: {
    fontSize: 16,
    color: '#666',
  },
  loader: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
  },
});
