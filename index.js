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

app.get("/", (req, res) => {
  // currentList = req.body.listTitle;
  // add currentList to the array, which will be the table that is selected from
  let sql = `SELECT * FROM Items`;
  db.all(sql,[], (err, rows) => {
    if (err) {return console.error(err.message)};
    items = rows;

    res.render("index.ejs", {
      listHeader: "Today",
      listItems: items,
      lists: lists,
      });
    });
  });

app.post("/new", (req, res) =>{

});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  sql = `INSERT INTO items (content) VALUES(?)`;
  db.run(sql,[item],(err) => {
     if (err){return console.error(err.message)};
     res.redirect("/");
   }
 );
});

app.post("/edit", (req, res) => {
  const item = req.body.updatedItemContent;
  const id = req.body.updatedItemId;
  sql = `UPDATE items SET content = ? WHERE id = ?`;
    db.run(sql, [item, id], (err) => {
   if (err) {return console.error(err.message)};
   res.redirect("/");
 });
});

app.post("/delete", (req, res) => {
  const id = req.body.deletedItemId;
  sql = `DELETE FROM items WHERE id = ?`;
    db.run(sql, [id], (err) => {
      if (err) {return console.error(err.message)};
      res.redirect("/");
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
