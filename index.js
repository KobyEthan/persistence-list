import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const conn = new pg.Client({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: "require",
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const result = await conn.query("SELECT * FROM playing_with_neon");
    console.log(result.rows);
    res.render("index.ejs");
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Error fetching data from database');
  }

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
