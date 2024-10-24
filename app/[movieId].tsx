import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function MovieDetailsScreen() {
  const router = useRouter();
  const { movieId } = useLocalSearchParams();
  
  interface MovieDetails {
    Title: string;
    Year: string;
    Plot: string;
    Poster: string;
  }

  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const response = await fetch(`http://www.omdbapi.com/?i=${movieId}&apikey=1980bee`);
      const data = await response.json();
      setMovieDetails(data);
    };
    fetchMovieDetails();
  }, [movieId]);

  if (!movieDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00f" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: movieDetails.Poster }}
        style={styles.poster}
        resizeMode="contain"
      />
      <Text style={styles.title}>{movieDetails.Title} ({movieDetails.Year})</Text>
      <Text style={styles.plot}>{movieDetails.Plot}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Back" onPress={() => router.back()} color="#007BFF" />
      </View>
    </ScrollView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#888',
  },
  poster: {
    width: width * 0.8, 
    height: height * 0.5,
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: width > 400 ? 26 : 22, 
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  plot: {
    fontSize: width > 400 ? 18 : 16, 
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
    paddingHorizontal: 10, 
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: width > 400 ? 50 : 20, 
    marginTop: 20,
  },
});
