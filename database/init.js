// MongoDB initialization script
db = db.getSiblingDB('netflix-clone');

// Create collections
db.createCollection('users');
db.createCollection('contents');
db.createCollection('payments');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.contents.createIndex({ tmdbId: 1 }, { unique: true });
db.contents.createIndex({ trending: 1, popularity: -1 });
db.contents.createIndex({ topRated: 1 });
db.contents.createIndex({ mediaType: 1 });

print('✅ Database initialized successfully!');
