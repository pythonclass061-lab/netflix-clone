import { Request, Response } from 'express';
import axios from 'axios';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

const formatContent = (item: any, type?: string) => ({
  tmdbId: item.id,
  title: item.title || item.name,
  overview: item.overview,
  posterPath: item.poster_path ? `${IMG_BASE}/w500${item.poster_path}` : null,
  backdropPath: item.backdrop_path ? `${IMG_BASE}/original${item.backdrop_path}` : null,
  mediaType: type || item.media_type,
  releaseDate: item.release_date || item.first_air_date,
  rating: item.vote_average,
  popularity: item.popularity,
  genres: item.genre_ids || [],
  voteCount: item.vote_count
});

export const getTrending = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${TMDB_BASE}/trending/all/week`, {
      params: { api_key: process.env.TMDB_API_KEY }
    });
    res.json({ results: response.data.results.map((item: any) => formatContent(item)) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending content' });
  }
};

export const getPopular = async (req: Request, res: Response) => {
  try {
    const { type = 'movie' } = req.query;
    const response = await axios.get(`${TMDB_BASE}/${type}/popular`, {
      params: { api_key: process.env.TMDB_API_KEY }
    });
    res.json({ results: response.data.results.map((item: any) => formatContent(item, type as string)) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular content' });
  }
};

export const getTopRated = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${TMDB_BASE}/movie/top_rated`, {
      params: { api_key: process.env.TMDB_API_KEY }
    });
    res.json({ results: response.data.results.map((item: any) => formatContent(item, 'movie')) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top rated content' });
  }
};

export const searchContent = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Search query required' });

    const response = await axios.get(`${TMDB_BASE}/search/multi`, {
      params: { api_key: process.env.TMDB_API_KEY, query }
    });

    const results = response.data.results
      .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
      .map((item: any) => formatContent(item));

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
};

export const getContentDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type = 'movie' } = req.query;

    const response = await axios.get(`${TMDB_BASE}/${type}/${id}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        append_to_response: 'videos'
      }
    });

    const item = response.data;
    const trailer = item.videos?.results?.find((v: any) => v.type === 'Trailer');

    res.json({
      ...formatContent(item, type as string),
      trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
      runtime: item.runtime || item.episode_run_time?.[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content details' });
  }
};
