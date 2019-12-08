const config = {
  mongoUri:
    process.env.MONGODB_URI ||
    "mongodb://heroku_lrlng4pq:7fu7ndug327p9hiq1ncvvin8hr@ds063168.mlab.com:63168/heroku_lrlng4pq",
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || "u5jf2498jf03k"
};

module.exports = config;
