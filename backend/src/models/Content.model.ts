import mongoose, { Document, Schema } from 'mongoose';

export interface IContent extends Document {
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  trailerUrl: string;
  mediaType: 'movie' | 'tv';
  genres: string[];
  releaseDate: string;
  rating: number;
  popularity: number;
  isNetflixOriginal: boolean;
  trending: boolean;
  topRated: boolean;
}

const contentSchema = new Schema<IContent>({
  tmdbId: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  overview: { type: String, required: true },
  posterPath: String,
  backdropPath: String,
  trailerUrl: String,
  mediaType: { type: String, enum: ['movie', 'tv'], required: true },
  genres: [String],
  releaseDate: String,
  rating: { type: Number, default: 0 },
  popularity: { type: Number, default: 0 },
  isNetflixOriginal: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  topRated: { type: Boolean, default: false }
}, {
  timestamps: true
});

contentSchema.index({ tmdbId: 1 });
contentSchema.index({ trending: 1, popularity: -1 });
contentSchema.index({ topRated: 1 });

export const Content = mongoose.model<IContent>('Content', contentSchema);
