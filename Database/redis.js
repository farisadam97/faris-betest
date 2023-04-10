const redis = require("redis");
const { redisUrl, redisPort } = require("../Config");

const client = redis.createClient();

client.on("error", (error) => {
  if (error.message.includes("Socket already opened")) {
    console.log("Redis client already connected");
  } else {
    console.log(`Redis client error: ${error}`);
  }
});

client.on("connect", () => {
  console.log("Redis client connected");
});

module.exports = client;
