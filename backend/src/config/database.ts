import Datastore from 'nedb-promises';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = {
  users: Datastore.create({ 
    filename: path.join(dataDir, 'users.db'), 
    autoload: true 
  }),
  content: Datastore.create({ 
    filename: path.join(dataDir, 'content.db'), 
    autoload: true 
  }),
  payments: Datastore.create({ 
    filename: path.join(dataDir, 'payments.db'), 
    autoload: true 
  }),
};

// Seed sample data
async function seedData() {
  const count = await db.content.count({});
  if (count === 0) {
    console.log('🌱 Seeding sample movies...');
    const movies = [
      { tmdbId: 1, title: "The Dark Knight", overview: "When the menace known as the Joker wreaks havoc...", posterPath: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911B6EMb4FGSioF.jpg", backdropPath: "https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5e8F.jpg", mediaType: "movie", releaseDate: "2008-07-18", rating: 8.5, popularity: 85.0, genres: ["Action", "Crime", "Drama"] },
      { tmdbId: 2, title: "Inception", overview: "A thief who steals corporate secrets...", posterPath: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", backdropPath: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg", mediaType: "movie", releaseDate: "2010-07-16", rating: 8.4, popularity: 80.0, genres: ["Action", "Sci-Fi"] },
      { tmdbId: 3, title: "Interstellar", overview: "A team of explorers travel through a wormhole...", posterPath: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", backdropPath: "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg", mediaType: "movie", releaseDate: "2014-11-07", rating: 8.4, popularity: 78.0, genres: ["Adventure", "Drama", "Sci-Fi"] },
      { tmdbId: 4, title: "The Matrix", overview: "A computer hacker learns about the true nature of reality...", posterPath: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", backdropPath: "https://image.tmdb.org/t/p/original/fNG7i7RqMEr2pEpJhGnqJf1dY6d.jpg", mediaType: "movie", releaseDate: "1999-03-31", rating: 8.2, popularity: 70.0, genres: ["Action", "Sci-Fi"] },
      { tmdbId: 5, title: "Pulp Fiction", overview: "The lives of two mob hitmen, a boxer, and a pair of diner bandits...", posterPath: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", backdropPath: "https://image.tmdb.org/t/p/original/suaEOtk1N1s1Eb5GHDVNZZBZ2e3.jpg", mediaType: "movie", releaseDate: "1994-10-14", rating: 8.5, popularity: 75.0, genres: ["Thriller", "Crime"] }
    ];
    
    for (const movie of movies) {
      await db.content.insert(movie);
    }
    console.log('✅ Sample content ready!');
  }
}

seedData();

export default db;
