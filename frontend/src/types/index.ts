export interface User {
  _id: string;
  email: string;
  name: string;
  avatar: string;
  profiles: Profile[];
  subscription: Subscription;
  paymentMethods: PaymentMethod[];
  watchlist: string[];
  continueWatching: ContinueWatching[];
  emailVerified: boolean;
}

export interface Profile {
  name: string;
  avatar: string;
  isKid: boolean;
}

export interface Subscription {
  plan: 'mobile' | 'basic' | 'standard' | 'premium';
  status: 'active' | 'inactive' | 'cancelled';
  startDate: string | null;
  endDate: string | null;
  autoRenew: boolean;
}

export interface PaymentMethod {
  type: 'card' | 'paypal';
  lastFour: string;
  expiryDate: string;
  cardType: string;
  isDefault: boolean;
}

export interface ContinueWatching {
  contentId: string;
  progress: number;
  timestamp: string;
}

export interface Content {
  _id?: string;
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  trailerUrl?: string;
  mediaType: 'movie' | 'tv';
  genres: string[];
  releaseDate: string;
  rating: number;
  popularity: number;
  runtime?: number;
  voteCount?: number;
}
