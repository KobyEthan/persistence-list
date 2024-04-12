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

let currentListId = 1;
let currentList = {};
let lists = [];
let items = [];

async function getItems(){
  let sql = `SELECT * FROM items JOIN lists ON lists.id = items.list_id WHERE list_id = ?`;
  db.all(sql, [currentListId], (err, rows) => {
    if (err) {return console.error(err.message)}; 
    items = []
    rows.forEach((i) => {
      items.push(i);
    });
  });
  console.log(items);
  return items;
}

async function getcurrentList(){
  let sql = `SELECT * FROM lists`;
  db.all(sql, [], (err, rows) => {
    if (err) {return console.error(err.message)}; 
      lists = rows;
  });
  currentList = lists.find((list) => list.id == currentListId)
  console.log(currentList);
  return currentList;
}

app.get("/", async (req, res) => {
    try {
      const items = await getItems();
      const currentList = await getcurrentList();
  
      res.render("index.ejs", {
        listItems: items,
        lists: lists,
        list: currentList,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });

app.post("/list", (req,res) => {
  if (req.body.add === "new"){
    res.render("new.ejs");
  }else{
    currentListId = req.body.list;
    res.redirect("/");
  }
});

app.post("/new", (req, res) =>{
  const name = req.body.name;
  sql = `INSERT INTO lists (name) VALUES(?)`;
  db.run(sql,[name],(err, rows) => {
     if (err){return console.error(err.message)};
     const id = rows[0].id;
     currentListId = id;
     res.redirect("/");
   }
 );
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  sql = `INSERT INTO items (content, list_id) VALUES(?,?)`;
  db.run(sql,[item, currentListId],(err) => {
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
