const keys = require("./keys");

// express app setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// postgres setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

pgClient.on("connect", () => {
  pgClient
    .query("CREATE TABLE IF NOT EXISTS values(number INT)")
    .catch((err) => console.log(err));
});

// redis client setup
const redis = require("redis");
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();

// express route handlers
app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * FROM values");
  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  redisClient.hgetall("values", (error, values) => {
    console.log("values:: ", values);
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const { index } = req.body;
  console.log("herererere, ", index);
  if (parseInt(index) > 40) {
    res.status(402).send("Index is too high.");
  }

  redisClient.hset("values", index, "nothing yet!");
  redisPublisher.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);
  res.send({
    ok: true,
  });
});

app.listen(5000, () => {
  console.log("Listen to 5000");
});
