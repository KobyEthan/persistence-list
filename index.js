import express from "express";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";

const app = express();
const port = 3000;

const db = new sqlite3.Database("./data/database.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
})
let sql;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

app.get("/", (res) => {
  let sql = `SELECT * FROM items`
  db.all(sql,[], (err, rows) => {
    if (err) return console.error(err.message);
    rows.forEach((row) => {
    items.push(row);
    });
  });
    console.log(items);
    res.render("index.ejs", {
      listHeader: "Today",
      listItems: items,
    });

});

app.post("/add", async (req, res) => {

});

app.post("/edit", async (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
