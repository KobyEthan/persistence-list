import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const conn = new pg.Client({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: "require",
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function selectAll() {
    const result = await conn.query("SELECT * FROM playing_with_neon WHERE id = 1");
    console.log(result);
}
selectAll();

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
