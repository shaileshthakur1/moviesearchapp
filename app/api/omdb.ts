const API_KEY = 'http://www.omdbapi.com/?i=tt3896198&apikey=1980bee';

export const fetchMovies = async (query: string) => {
  const response = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=1980bee`);
  return response.json();
};

export const fetchMovieDetails = async (movieId: string) => {
  const response = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=1980bee`);
  return response.json();
};
