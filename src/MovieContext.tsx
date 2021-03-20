import { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import { api } from './services/api';

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

interface MovieProviderData {
  selectedGenreId: number;
  selectedGenre: GenreResponseProps;
  setSelectedGenreId: (id: number) => void;
  movies: MovieProps[];
}


interface MovieProviderProps {
  children: ReactNode;
}

export const MovieContext = createContext({} as MovieProviderData);

export function MoviesProvider({ children }: MovieProviderProps) {
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);
  const [selectedGenreId, setSelectedGenreId] = useState(1);

  useEffect(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
      setMovies(response.data);
    });

    api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
      setSelectedGenre(response.data);
    })
  }, [selectedGenreId]);

  return (
    <MovieContext.Provider value={{ selectedGenreId, setSelectedGenreId, selectedGenre, movies }}>
      {children}
    </MovieContext.Provider>
  );
}
